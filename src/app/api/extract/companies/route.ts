import { extractAndSyncCompanies } from '@/lib/firecrawl_extract';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting company extract job...');
    const result = await extractAndSyncCompanies();
    console.log('Company extract job finished successfully.');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Company extract job failed:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}