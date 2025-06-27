"use client";

import { useState, useEffect } from "react";
import { BusinessCard } from "./BusinessCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

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
  searchTerm?: string;
}

export function BusinessDirectoryClient({ companies, industries, cities, searchTerm = "" }: BusinessDirectoryClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 20;

  // Reset filters when search term is cleared
  useEffect(() => {
    if (!searchTerm) {
      setSelectedIndustries([]);
      setSelectedCity("all");
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Filter companies based on selected filters and search term
  const filteredCompanies = companies.filter(company => {
    const industryMatch = selectedIndustries.length === 0 || 
      company.industry.some(ind => selectedIndustries.includes(ind));
    const cityMatch = selectedCity === "all" || company.city === selectedCity;
    
    // Search functionality - search across name, description, industry, and city
    const searchMatch = !searchTerm || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description && company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.industry.some(ind => ind.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    return industryMatch && cityMatch && searchMatch;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
      {/* Mobile Filters Button & Results Count */}
      <div className="flex items-center justify-between mb-6 lg:hidden">
        <div className="text-sm text-gray-600">
          {filteredCompanies.length} companies found
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </div>

      <div className="lg:flex lg:gap-8">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-1/3 max-w-xs space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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

        {/* Mobile Filters Modal */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">
                {/* Industry Filter */}
                <div>
                  <h3 className="text-base font-medium mb-3">Industry</h3>
                  <div className="space-y-3">
                    {industries.map(industry => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`mobile-industry-${industry}`}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
                        />
                        <Label 
                          htmlFor={`mobile-industry-${industry}`} 
                          className="text-sm font-normal cursor-pointer"
                        >
                          {industry}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* City Filter */}
                <div>
                  <h3 className="text-base font-medium mb-3">City</h3>
                  <Select value={selectedCity} onValueChange={handleCityChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
                <Button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full"
                  style={{ backgroundColor: '#0B4168' }}
                >
                  Show {filteredCompanies.length} Results
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <section className="flex-1">
          {/* Results count for desktop */}
          <div className="hidden lg:block text-sm text-gray-600 mb-6">
            {filteredCompanies.length} companies found
          </div>
          
          {/* Business Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {currentCompanies.map(company => (
              <BusinessCard key={company.id} company={company} />
            ))}
          </div>

          {/* No results state */}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No companies found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => goToPage(page)}
                    className={`${currentPage === page ? "text-white" : ""} min-w-[40px]`}
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
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}