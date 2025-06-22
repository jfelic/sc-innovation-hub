import { z } from 'zod';

export const companyScrapeSchema = z.object({
  name: z.string().describe("The name of the company."),
  description: z.string().describe("A brief description of what the company does."),
  website: z.string().url().optional().describe("The company's official website URL."),
});

export const firecrawlScrapeSchema = z.object({
    companies: z.array(companyScrapeSchema).describe("An array of tech companies found on the page.")
});