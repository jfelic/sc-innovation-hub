import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { SavedEventsClient } from './SavedEventsClient';

export default async function SavedEventsPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch the user's favorited events with event details
  const favoriteEvents = await prisma.eventBookmark.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      event: true, // Include full event details
    },
    orderBy: {
      createdAt: 'desc', // Most recently favorited first
    },
  });

  // Extract just the event data for easier use and serialize dates
  const events = favoriteEvents.map(bookmark => ({
    ...bookmark.event,
    startDate: bookmark.event.startDate.toISOString(),
    endDate: bookmark.event.endDate?.toISOString() || null,
    createdAt: bookmark.event.createdAt.toISOString(),
    updatedAt: bookmark.event.updatedAt.toISOString(),
  }));

  // Debug: Log events to see their structure
  console.log('Events data:', events);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/account-dashboard" className="hover:text-gray-700">Account</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">Saved Events</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved Events</h1>
          
          <p className="text-gray-600 mb-6">
            Here's your personal lineup of local tech events you've bookmarked. Stay in the loop with what's happening in South Carolina's tech scene.
          </p>
        </div>

        {/* Pass events data to client component for filtering and rendering */}
        <SavedEventsClient events={events} />
      </div>
    </div>
  );
}