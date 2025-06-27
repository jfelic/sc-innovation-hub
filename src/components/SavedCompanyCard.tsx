"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Company } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

/**
 * Defines the props for the SavedCompanyCard component.
 * It expects a single 'company' object and an optional onUnsave callback.
 */
interface SavedCompanyCardProps {
  company: Company;
  onUnsave?: () => void; // Callback to refresh the list when company is unsaved
}

/**
 * Renders a company card specifically designed for the saved companies page.
 * Matches the Figma design with simplified layout and unsave functionality.
 * @param {SavedCompanyCardProps} props - The properties for the component.
 * @returns {JSX.Element} A styled card displaying saved company information.
 */
export function SavedCompanyCard({ company, onUnsave }: SavedCompanyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Debug: Log company data to see structure
  console.log('SavedCompanyCard - Company data:', company);

  // Function to handle unsaving a company
  const handleUnsave = async () => {
    if (!session?.user?.id) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/companies/${company.id}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Call the onUnsave callback to refresh the list
        onUnsave?.();
      } else {
        console.error('Failed to unsave company');
      }
    } catch (error) {
      console.error('Error unsaving company:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get the primary industry for display
  const primaryIndustry = company.industry && company.industry.length > 0 
    ? company.industry[0] 
    : 'Technology';

  return (
    <Card className="w-full p-6 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{company.name}</h3>
          
          {/* Unsave button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsave}
            disabled={isLoading}
            className="p-1 h-8 w-8 hover:bg-red-50"
          >
            <Heart 
              className="h-5 w-5 fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
            />
          </Button>
        </div>

        {/* Industry badge */}
        <div className="mb-3">
          <Badge 
            variant="secondary" 
            className="bg-gray-100 text-gray-700 text-sm"
          >
            {primaryIndustry}
          </Badge>
        </div>

        {/* Company description */}
        {company.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {company.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}