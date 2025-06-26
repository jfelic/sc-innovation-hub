import { Navbar } from "@/components/Navbar";
import { EventsPageClient } from "@/components/EventsPageClient";
import { prisma } from "@/lib/db";

export default async function EventsPage() {
  // Fetch events from database
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <EventsPageClient events={events} />
    </div>
  );
}