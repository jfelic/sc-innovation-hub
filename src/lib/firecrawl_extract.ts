import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import { prisma } from './db';

const urlsToExtract = {
    "builtin": "https://builtin.com/companies?city=Charleston&state=South+Carolina&country=USA/*",
    "goodfirms": "https://goodfirms.co/directory/city/top-software-development-companies/charleston/*",
    "biopharmguy": "https://biopharmguy.com/links/state-sc-all-geo.php/*"
}

const schema = z.object({
  Companies: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    website: z.string().optional(),
    industry: z.array(z.string()),
    size: z.number().nullable().optional(), // Allow null values
    founded: z.number().nullable().optional(), // Allow null values
    address: z.string().optional(),
    city: z.string().default("Charleston"),
    state: z.string().default("South Carolina"),
    logoUrl: z.string().optional(),
    sourceUrl: z.string().optional(),
    sourceType: z.string().default("extracted"),
  })).optional()
});

export async function extractAndSyncCompanies() {
  console.log("Starting Firecrawl extract and sync...");

  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is not set in environment variables.');
  }

  const app = new FireCrawlApp({apiKey: process.env.FIRECRAWL_API_KEY});

  console.log('Extracting from multiple URLs...');
  let extractResult;
  try {
    extractResult = await app.extract([
      urlsToExtract.builtin,
      urlsToExtract.goodfirms,
      urlsToExtract.biopharmguy
    ], {
        prompt: "Extract tech company information from these webpages. For industry: give me all the industries that the company belongs to in an array of strings. For size: convert employeeranges like \"50-100\" to middle value (75). If there is only one value then just use that value. For founded: extract year only as number. Use Charleston, South Carolina as location defaults if not specified", 
        schema: schema,
    });
  } catch (error) {
    console.error('Firecrawl API call failed:', error);
    throw new Error(`Extract job failed. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  }

  // Check if the extraction was successful
  if (!extractResult.success) {
      console.error('Firecrawl extract failed:', extractResult.error);
      throw new Error('Failed to extract data from the provided URLs');
  }

  // Log the raw extracted data for debugging
  console.log('Raw extract result structure: ', extractResult.data);

  // Validate the extracted data against our Zod schema
  // This ensures the data structure matches what we expect before saving to database
  const parsedData = schema.safeParse(extractResult.data);
  if (!parsedData.success) {
      console.error('Zod validation failed:', parsedData.error.flatten());
      throw new Error('Extracted data does not match the expected schema.');
  }

  console.log('Extracted data successfully validated against schema: ', parsedData.data);

  // Process and insert the validated data into our Prisma database
  if (parsedData.data.Companies && parsedData.data.Companies.length > 0) {
    const insertedCompanies = []; // Keep track of successfully processed companies
    
    // Loop through each company in the extracted data
    for (const company of parsedData.data.Companies) {
      try {

        // Set metadata for tracking where this data came from
        let sourceUrl = null;        // Could be enhanced to track specific source URL
        let sourceType = "extracted";
        
        // Note: You could enhance this to track which specific URL each company came from
        // by analyzing the response or making separate API calls
        
        // Use Prisma's upsert to either update existing company or create new one
        // This prevents duplicate entries based on company name (which is unique in our schema)
        const insertedCompany = await prisma.company.upsert({
          where: { name: company.name }, // Find existing company by name
          
          // If company exists, update these fields
          update: {
            description: company.description,
            website: company.website,
            industry: company.industry,
            size: company.size,
            founded: company.founded,
            address: company.address,
            city: company.city || "Charleston",           // Use default if not provided
            state: company.state || "South Carolina",     // Use default if not provided
            logoUrl: company.logoUrl,
            sourceType: sourceType,
            updatedAt: new Date()                         // Prisma will auto-update this anyway
          },
          
          // If company doesn't exist, create new record with these fields
          create: {
            name: company.name,
            description: company.description,
            website: company.website,
            industry: company.industry,
            size: company.size,
            founded: company.founded,
            address: company.address,
            city: company.city || "Charleston",
            state: company.state || "South Carolina",
            logoUrl: company.logoUrl,
            sourceUrl: sourceUrl,
            sourceType: sourceType
            // createdAt and updatedAt will be auto-set by Prisma
          }
        });
        
        // Add to our success tracking array
        insertedCompanies.push(insertedCompany);
        console.log(`✅ Upserted company: ${company.name}`);
        
      } catch (error) {
        // If individual company insertion fails, log error but continue with others
        console.error(`❌ Failed to insert company ${company.name}:`, error);
        // Continue processing other companies even if one fails
      }
    }
    
    console.log(`Extract and sync complete for ${insertedCompanies.length} companies.`);
    return { count: insertedCompanies.length, data: insertedCompanies };
    
  } else {
    console.log('No companies found in the extracted data');
    return { count: 0, data: [] };
  }
}