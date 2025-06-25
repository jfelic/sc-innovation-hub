import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import { prisma } from './db';

const urlsToExtract = {
    "meetup": "https://www.meetup.com/find/?keywords=tech&location=us--sc--Charleston&source=EVENTS/*",
    "cybersc": "https://cybersc.us/events/*",
    "allevents": "https://allevents.in/charleston/it/*",
}

const schema = z.object({
  Events: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
    startDate: z.string(), // Firecrawl will return as string, convert to Date later
    endDate: z.string().optional(),
    venue: z.string().optional(),
    address: z.string().optional(),
    city: z.string().default("Charleston"),
    state: z.string().default("SC"),
    isVirtual: z.boolean().default(false),
    eventUrl: z.string().optional(),
    industry: z.array(z.string()),
    organizerName: z.string().optional(), // Simple string field
    organizerWebsite: z.string().optional(),
    logoUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    sourceType: z.string().default("extracted")
  })).optional()
});

export async function extractAndSyncEvents() {
  console.log("Event Extract: Starting Firecrawl extract and sync...");

  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('Events Extract: FIRECRAWL_API_KEY is not set in environment variables.');
  }

  const app = new FireCrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

  console.log('Event Extract: Extracting from multiple URLs...');
  let extractResult;
  try {
    extractResult = await app.extract([
      urlsToExtract.meetup,
      urlsToExtract.cybersc,
      urlsToExtract.allevents
    ], {
        prompt: "Extract tech event information from these webpages. Try your best to get the address information for the event. For industry: give me all the industries that this event belongs to in an array of strings (tech, ai, cyber, innovation, networking, etc). For startDate and endDate: convert to ISO date format. For isVirtual: true if online/virtual event, false if in-person. Extract organizer name and website if available. Use Charleston, SC as location defaults if not specified", 
        schema: schema,
    });
  } catch (error) {
    console.error('Event Extract: Firecrawl API call failed:', error);
    throw new Error(`Event Extract: Extract job failed. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }

  // Check if the extraction was successful
  if (!extractResult.success) {
      console.error('Event Extract: Firecrawl extract failed:', extractResult.error);
      throw new Error('Event Extract: Failed to extract data from the provided URLs');
  }

  // Log the raw extracted data for debugging
  console.log('Event Extract: Raw extract result structure: ', extractResult.data);

  // Validate the extracted data against our Zod schema
  const parsedData = schema.safeParse(extractResult.data);
  if (!parsedData.success) {
      console.error('Event Extract: Zod validation failed:', parsedData.error.flatten());
      throw new Error('Event Extract: Extracted data does not match the expected schema.');
  }

  console.log('Event Extract: Extracted data successfully validated against schema: ', parsedData.data);

  // Process and insert the validated data into our Prisma database
  if (parsedData.data.Events && parsedData.data.Events.length > 0) {
    const insertedEvents = []; // Keep track of successfully processed events
    
    // Loop through each event in the extracted data
    for (const event of parsedData.data.Events) {
      try {
        console.log(`Event Extract: Processing event: ${event.title}`); // Debug print

        // Convert string dates to Date objects for Prisma
        let startDate = null;
        let endDate = null;
        
        try {
          startDate = new Date(event.startDate);
          console.log(`Event Extract: Converted startDate: ${startDate}`); // Debug date conversion
          
          if (event.endDate) {
            endDate = new Date(event.endDate);
            console.log(`Event Extract: Converted endDate: ${endDate}`); // Debug date conversion
          }
        } catch (dateError) {
          console.error(`Event Extract: Date conversion failed for ${event.title}:`, dateError);
          // Skip this event if date conversion fails
          continue;
        }

        // Set metadata for tracking where this data came from
        const sourceUrl = event.sourceUrl || null;
        const sourceType = event.sourceType || "extracted";
        
        // Use event title + startDate as unique identifier since events can have same titles
        // but different dates (recurring events, etc.)
        const uniqueKey = `${event.title}-${startDate.toISOString().split('T')[0]}`;
        
        // Check if event already exists first
        const existingEvent = await prisma.event.findFirst({
        where: {
            title: event.title,
            startDate: startDate
        }
        });

        if (existingEvent) {
        console.log(`Event Extract: Skipping duplicate event: ${event.title}`); // Debug skip
        continue; // Skip to next event
        }

        // Simple create - no duplicate checking
        const insertedEvent = await prisma.event.create({
        data: {  // create() needs a 'data' object
            title: event.title,
            description: event.description,
            startDate: startDate,
            endDate: endDate,
            venue: event.venue,
            address: event.address,
            city: event.city || "Charleston",
            state: event.state || "SC",
            isVirtual: event.isVirtual || false,
            eventUrl: event.eventUrl,
            industry: event.industry || [],
            organizerName: event.organizerName,
            organizerWebsite: event.organizerWebsite,
            logoUrl: event.logoUrl,
            sourceUrl: sourceUrl,
            sourceType: sourceType
        }
        });
        
        insertedEvents.push(insertedEvent);
        console.log(`✅ Event Extract: Created event: ${event.title}`); // Debug success
        
      } catch (error) {
        console.error(`❌ Event Extract: Failed to insert event ${event.title}:`, error); // Debug error
        // Continue processing other events even if one fails
      }
    }
    
    console.log(`Event Extract: Extract and sync complete for ${insertedEvents.length} events.`);
    return { count: insertedEvents.length, data: insertedEvents };
    
  } else {
    console.log('Event Extract: No events found in the extracted data');
    return { count: 0, data: [] };
  }
}