import { prisma } from "@/lib/db";
import { BusinessDirectoryClient } from "./BusinessDirectoryClient";

/**
 * Server component that fetches data and passes it to the client component.
 * This allows us to have server-side data fetching with client-side interactivity.
 */
export async function BusinessDirectory() {
  // Fetch all companies from the database, ordered alphabetically by name.
  const companies = await prisma.company.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  // To build the category filter, we need a unique list of all industries.
  const industryData = await prisma.company.findMany({
    select: {
      industry: true,
    },
  });
  const categories = [...new Set(industryData.flatMap(c => c.industry))].sort();

  // To build the city filter, we need a unique list of all cities.
  const cityData = await prisma.company.findMany({
    select: {
      city: true,
    },
    distinct: ['city'],
  });
  const cities = cityData.map(c => c.city).sort();

  // Pass all the fetched data to the client component
  return (
    <BusinessDirectoryClient 
      companies={companies}
      categories={categories}
      cities={cities}
    />
  );
}