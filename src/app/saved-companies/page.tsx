import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Navbar } from '@/components/Navbar';
import { SavedCompanyCard } from '@/components/SavedCompanyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { SavedCompaniesClient } from './SavedCompaniesClient';

export default async function SavedCompaniesPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  // Fetch the user's favorited companies with company details
  const favoriteCompanies = await prisma.companyBookmark.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      company: true, // Include full company details
    },
    orderBy: {
      createdAt: 'desc', // Most recently favorited first
    },
  });

  // Extract just the company data for easier use
  const companies = favoriteCompanies.map(bookmark => bookmark.company);

  // Debug: Log companies to see their structure
  console.log('Companies data:', companies);

  return (
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#FFFFFF' }}>
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/account-dashboard" className="hover:text-gray-700">Account</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">Saved Companies</span>
          </div>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Saved Companies</h1>
          
          <p className="text-gray-600 mb-6">
            Whether you're job hunting, exploring partnership opportunities, or just keeping tabs on standout players in South Carolina's tech scene, this is your personal list of companies to watch.
          </p>

        </div>

        {/* Pass companies data to client component for filtering and rendering */}
        <SavedCompaniesClient companies={companies} />
      </div>
    </div>
  );
}