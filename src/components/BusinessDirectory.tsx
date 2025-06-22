import { prisma } from "@/lib/db";
import { BusinessCard } from "./BusinessCard";

/**
 * Renders the main business directory page.
 * This is a server component that fetches company data directly from the database
 * to display a list of businesses and generate dynamic filter options.
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

  // To build the county filter, we need a unique list of all cities.
  const cityData = await prisma.company.findMany({
    select: {
      city: true,
    },
    distinct: ['city'],
  });
  const counties = cityData.map(c => c.city).sort();

  return (
    // Main container for the directory layout
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
      {/* Sidebar for filtering options */}
      <aside className="w-1/3 max-w-xs">
        {/* Category Filter Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Category</h2>
          <ul>
            {/* Map over the unique categories to create checkboxes */}
            {categories.map(cat => (
              <li key={cat}>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        
        {/* County Filter Section */}
        <div>
          <h2 className="text-lg font-semibold mb-2">County</h2>
          {/* A dropdown select for filtering by county */}
          <select className="w-full px-2 py-2 rounded border">
            <option value="">All Counties</option>
            {/* Map over the unique counties to create options */}
            {counties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

      </aside>

      {/* Main section for displaying business cards in a grid */}
      <section className="w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Map over the fetched companies to render a BusinessCard for each one */}
        {companies.map(company => (
          <BusinessCard key={company.id} company={company} />
        ))}
      </section>
    </div>
  )
}