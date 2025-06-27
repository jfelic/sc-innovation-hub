"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import type { Company } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Defines the props for the BusinessCard component.
 * It expects a single 'company' object.
 */
interface BusinessCardProps {
  company: Company;
}

/**
 * Renders a single business card with company details using the shadcn/ui Card component.
 * @param {BusinessCardProps} props - The properties for the component.
 * @returns {JSX.Element} A styled card displaying company information.
 */
export function BusinessCard({ company }: BusinessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const descriptionLimit = 150;
  const shouldTruncate = company.description && company.description.length > descriptionLimit;

  // Function to check if the company is already favorited by the user
  const checkIfFavorited = useCallback(async () => {
    try {
      const response = await fetch(`/api/companies/${company.id}/favorite`);
      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [company.id]);

  // Check if company is favorited on component mount
  useEffect(() => {
    if (session?.user?.id) {
      checkIfFavorited();
    }
  }, [session?.user?.id, checkIfFavorited]);

  // Function to handle favoriting/unfavoriting a company
  const handleFavoriteToggle = async () => {
    if (!session?.user?.id) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin';
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/companies/${company.id}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const displayDescription = shouldTruncate && !isExpanded 
    ? company.description?.substring(0, descriptionLimit) + "..."
    : company.description;

  return (
    <Card className="w-full h-80 md:h-96 flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base md:text-lg leading-tight">{company.name}</CardTitle>
          {/* Favorite button - only show if user is logged in */}
          {session && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              disabled={isLoading}
              className="p-1 h-8 w-8 hover:bg-red-50"
            >
              <Heart 
                className={`h-4 w-4 ${
                  isFavorited 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-400 hover:text-red-500'
                }`}
              />
            </Button>
          )}
        </div>
        <CardDescription className="text-xs md:text-sm">
          {company.industry.slice(0, 2).join(', ')}{company.industry.length > 2 && '...'}
        </CardDescription>
        <CardDescription className="text-xs md:text-sm">
          {company.city}, {company.state}
        </CardDescription>
        {company.size && (
          <CardDescription className="text-xs md:text-sm">
            {company.size} Employees
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-grow overflow-hidden pt-0">
        <div className="flex-grow overflow-y-auto">
          {company.description && (
            <div className="text-xs md:text-sm">
              <p className="leading-relaxed">{displayDescription}</p>
              {shouldTruncate && (
                <Button
                  variant="link"
                  className="h-auto px-0 py-1 mt-2 flex items-center gap-1 justify-start text-xs md:text-sm"
                  style={{ color: '#0B4168' }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      Read Less <ChevronUp className="h-3 w-3 md:h-4 md:w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-start mt-3 flex-shrink-0">
          {company.website ? (
            <Button 
              size="sm"
              style={{ backgroundColor: '#0B4168' }} 
              className="hover:bg-blue-800 hover:scale-105 transition-all duration-200 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2 min-h-[36px] md:min-h-[40px]"
              onClick={() => window.open(company.website!, '_blank')}
            >
              More Info
            </Button>
          ) : (
            <Button 
              size="sm"
              style={{ backgroundColor: '#6B7280' }} 
              className="cursor-not-allowed opacity-50 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2 min-h-[36px] md:min-h-[40px]"
              disabled
            >
              No Website
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}