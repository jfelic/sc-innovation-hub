import { prisma } from "@/lib/db";
import { BusinessDirectoryClient } from "./BusinessDirectoryClient";

interface BusinessDirectoryProps {
  searchTerm?: string;
}

/**
 * Server component that fetches data and passes it to the client component.
 * This allows us to have server-side data fetching with client-side interactivity.
 */
export async function BusinessDirectory({ searchTerm }: BusinessDirectoryProps) {
  // Fetch all companies from the database, ordered alphabetically by name.
  const rawCompanies = await prisma.company.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  // Apply defaults for empty city and state values
  const companies = rawCompanies.map(company => ({
    ...company,
    city: company.city && company.city.trim() !== "" ? company.city : "Charleston",
    state: company.state && company.state.trim() !== "" ? company.state : "SC"
  }));

  // To build the industry filter, we need a unique list of all industries.
  const industryData = await prisma.company.findMany({
    select: {
      industry: true,
    },
  });
  const industries = [...new Set(industryData.flatMap(c => c.industry))].sort();

  // To build the city filter, we need a unique list of all cities.
  // Now we can get distinct cities after applying defaults
  const cities = [...new Set(companies.map(c => c.city))].sort();

  // Pass all the fetched data to the client component
  return (
    <BusinessDirectoryClient 
      companies={companies}
      industries={industries}
      cities={cities}
      searchTerm={searchTerm}
    />
  );
}