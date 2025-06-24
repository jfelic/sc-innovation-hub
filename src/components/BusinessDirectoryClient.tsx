"use client";

import { useState } from "react";
import { BusinessCard } from "./BusinessCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string[];
  size: number | null;
  founded: number | null;
  address: string | null;
  city: string;
  state: string;
  logoUrl: string | null;
  sourceUrl: string | null;
  sourceType: string;
  createdAt: Date;
  updatedAt: Date;
}

interface BusinessDirectoryClientProps {
  companies: Company[];
  industries: string[];
  cities: string[];
}

export function BusinessDirectoryClient({ companies, industries, cities }: BusinessDirectoryClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const itemsPerPage = 20;

  // Filter companies based on selected filters
  const filteredCompanies = companies.filter(company => {
    const industryMatch = selectedIndustries.length === 0 || 
      company.industry.some(ind => selectedIndustries.includes(ind));
    const cityMatch = selectedCity === "all" || company.city === selectedCity;
    return industryMatch && cityMatch;
  });

  // Calculate pagination values based on filtered results
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Filter handlers that reset to page 1
  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industry]);
    } else {
      setSelectedIndustries(selectedIndustries.filter(ind => ind !== industry));
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
    // Main container for the directory layout
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8">
      {/* Sidebar for filtering options */}
      <aside className="w-1/3 max-w-xs space-y-6">
        {/* Industry Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Map over the unique industries to create checkboxes */}
              {industries.map(industry => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`industry-${industry}`}
                    checked={selectedIndustries.includes(industry)}
                    onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                  />
                  <Label 
                    htmlFor={`industry-${industry}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* City Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">City</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCity} onValueChange={handleCityChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {/* Map over the unique cities to create options */}
                {cities.map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </aside>

      {/* Main section for displaying business cards in a grid */}
      <section className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map over the current page companies to render a BusinessCard for each one */}
          {currentCompanies.map(company => (
            <BusinessCard key={company.id} company={company} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className={currentPage === page ? "text-white" : ""}
                  style={currentPage === page ? { backgroundColor: '#0B4168' } : {}}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}