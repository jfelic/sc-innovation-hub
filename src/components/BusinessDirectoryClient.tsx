"use client";

import { BusinessCard } from "./BusinessCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                  <Checkbox id={`industry-${industry}`} />
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
            <Select>
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
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map over the fetched companies to render a BusinessCard for each one */}
        {companies.map(company => (
          <BusinessCard key={company.id} company={company} />
        ))}
      </section>
    </div>
  );
}