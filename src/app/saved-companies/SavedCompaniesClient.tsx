"use client";

import { useState, useMemo } from "react";
import type { Company } from "@/generated/prisma";
import { SavedCompanyCard } from "@/components/SavedCompanyCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

interface SavedCompaniesClientProps {
  companies: Company[];
}

// Helper function to get unique industries from companies
function getUniqueIndustries(companies: Company[]): string[] {
  const allIndustries = companies.flatMap(company => company.industry);
  return [...new Set(allIndustries)].sort();
}

/**
 * Client component that handles filtering and rendering of saved companies.
 * This component is separated to handle client-side interactivity while keeping the parent page as a server component.
 */
export function SavedCompaniesClient({ companies: initialCompanies }: SavedCompaniesClientProps) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // Debug: Log initial companies
  console.log('SavedCompaniesClient - Initial companies:', initialCompanies);

  // Get dynamic industry filters from actual saved companies
  const availableIndustries = getUniqueIndustries(companies);

  // Filter companies based on selected industry
  const filteredCompanies = useMemo(() => {
    if (!selectedFilter) {
      return companies;
    }

    return companies.filter(company => {
      // Check if company has the selected industry
      return company.industry.some(industry => 
        industry.toLowerCase().includes(selectedFilter.toLowerCase()) ||
        selectedFilter.toLowerCase().includes(industry.toLowerCase())
      );
    });
  }, [companies, selectedFilter]);

  // Handle unsaving a company
  const handleUnsave = (companyId: string) => {
    setCompanies(prev => prev.filter(company => company.id !== companyId));
  };

  // Handle filter selection
  const handleFilterClick = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <>
      {/* Industry Filter Tags - only show if there are industries to filter */}
      {availableIndustries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {availableIndustries.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedFilter === filter
                  ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      )}

      {/* Companies grid or empty state - 3 cards per row to match main directory */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredCompanies.map(company => (
            <SavedCompanyCard 
              key={company.id} 
              company={company} 
              onUnsave={() => handleUnsave(company.id)}
            />
          ))}
        </div>
      ) : selectedFilter ? (
        /* No results for filter */
        <div className="text-center py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">No Companies Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                No saved companies match the "{selectedFilter}" filter. Try selecting a different industry or clear the filter to see all your saved companies.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFilter(null)}
                className="w-full"
              >
                Clear Filter
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Empty state - no saved companies */
        <div className="text-center py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <CardTitle className="text-xl text-gray-900">No Saved Companies Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Start exploring the directory to discover and save companies that interest you.
              </p>
              <Button asChild className="w-full" style={{ backgroundColor: '#0B4168' }}>
                <Link href="/">
                  Explore Companies
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}