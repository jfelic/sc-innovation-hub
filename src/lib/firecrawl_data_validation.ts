import { z } from 'zod';

export const companyScrapeSchema = z.object({
  // id field is auto-gnereated 
  name: z.string().describe("The name of the company."),
  description: z.string().describe("A brief description of what the company does."),
  website: z.string().url().optional().describe("The company's official website URL."),
  industry: z.array(z.string()).describe("An array of industries the company operates in (e.g., ['Software', 'Artificial Intelligence', 'Biotech'])"),
  size: z.number().int().nullable().optional().describe("Employee count or size of the company."),
  founded: z.number().int().nullable().optional().describe("The year the company was founded."),

  // Location information
  address: z.string().optional().describe("The street address of the company."),
  city: z.string().optional().describe("The city where the company is located. If there is no city, this field can be empty."),
  state: z.string().optional().describe("The state or region where the company is located. If there is no state, this field can be empty."),

  // Metadata
  logoUrl: z.string().url().optional().describe("The URL for the company's logo image."),

});

export const firecrawlScrapeSchema = z.object({
    companies: z.array(companyScrapeSchema).describe("An array of tech companies found on the page.")
});