import { z } from 'zod';

export const companyScrapeSchema = z.object({
  name: z.string().describe("The name of the company."),
  description: z.string().describe("A brief description of what the company does."),
  website: z.string().url().optional().describe("The company's official website URL."),
  industry: z.array(z.string()).describe("An array of industries the company operates in (e.g., ['Software', 'Artificial Intelligence', 'Biotech'])"),
  size: z.number().optional().describe("The size of the company, often as an employee count range (e.g., '51-200')."),
  founded: z.number().int().optional().describe("The year the company was founded."),
  logoUrl: z.string().url().optional().describe("The URL for the company's logo image."),
});

export const firecrawlScrapeSchema = z.object({
    companies: z.array(companyScrapeSchema).describe("An array of tech companies found on the page.")
});