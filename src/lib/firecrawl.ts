import FirecrawlApp from '@mendable/firecrawl-js';
import { prisma } from './db';
import { firecrawlScrapeSchema } from './firecrawl_data_validation';

export async function scrapeAndSyncCompanies() {
  if (!process.env.FIRECRAWL_API_KEY) {
    throw new Error('FIRECRAWL_API_KEY is not set in environment variables.');
  }

  const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

  const urlToScrape = 'https://builtin.com/companies/type/app-development-companies/artificial-intelligence-companies/big-data-analytics-companies/biotech-companies/blockchain-companies/cloud-companies/computer-vision-companies/cryptocurrency-companies/cybersecurity-companies/database-companies/design-companies/edtech-companies/fintech-companies/gaming-companies/greentech-companies/healthtech-companies/information-technology-companies/iot-companies/legal-tech-companies/software-companies/virtual-reality-companies/web3-companies?city=Charleston&state=South+Carolina&country=USA';

  console.log(`Scraping URL: ${urlToScrape}`);

  const scrapeResult = await app.scrapeUrl(urlToScrape, {
    formats: ['json'],
    jsonOptions: { 
      schema: firecrawlScrapeSchema,
      prompt: "Extract all the companies listed on the page with their name, description, and website. The location for all companies is Charleston, SC."
    }
  });

  if (!scrapeResult.success || !scrapeResult.json) {
    console.error('Firecrawl scrape failed:', scrapeResult.error);
    throw new Error(`Failed to scrape or extract JSON data from ${urlToScrape}`);
  }

  const parsedData = firecrawlScrapeSchema.safeParse(scrapeResult.json);

  if (!parsedData.success) {
    console.error('Zod validation failed:', parsedData.error.flatten());
    throw new Error('Scraped data does not match the expected schema.');
  }

  const { companies } = parsedData.data;
  console.log(`Found ${companies.length} companies.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const company of companies) {
    await prisma.company.upsert({
        where: { name: company.name }, // Assumes company name is unique
        update: {
            description: company.description,
            website: company.website,
            sourceType: 'SCRAPED',
            sourceUrl: urlToScrape,
        },
        create: {
            name: company.name,
            description: company.description,
            website: company.website,
            city: 'Charleston',
            state: 'South Carolina',
            sourceType: 'SCRAPED',
            sourceUrl: urlToScrape,
            isVerified: true, // Assuming scraped data is trusted
        },
    });
    // This logic doesn't distinguish between created and updated,
    // but upsert handles it. For more detailed logging, you could query first.
  }
  
  console.log(`Sync complete for ${companies.length} companies.`);
  return { count: companies.length, data: companies };
}