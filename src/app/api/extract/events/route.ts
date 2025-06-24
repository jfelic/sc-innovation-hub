import { extractAndSyncEvents } from '@/lib/firecrawl_extract_events';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting event extract job...'); // Updated log message
    const result = await extractAndSyncEvents(); // Changed function call
    console.log('Event extract job finished successfully.'); // Updated log message
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Event extract job failed:', error); // Updated log message
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}