import { scrapeAndSyncCompanies } from '@/lib/firecrawl';
import { NextResponse } from 'next/server';

export async function POST() {
  // In a production environment, you should protect this endpoint
  // to prevent unauthorized access, for example by checking for an admin session.
  try {
    console.log('Starting company scrape job...');
    const result = await scrapeAndSyncCompanies();
    console.log('Company scrape job finished successfully.');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Company scrape job failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}