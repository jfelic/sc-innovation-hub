"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  const descriptionLimit = 150;
  const shouldTruncate = company.description && company.description.length > descriptionLimit;

  const displayDescription = shouldTruncate && !isExpanded 
    ? company.description?.substring(0, descriptionLimit) + "..."
    : company.description;

  return (
    <Card className="w-full max-w-sm h-96 flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-4 font-bold">
          <CardTitle>{company.name}</CardTitle>
        </div>
        <CardDescription>
          {company.industry.join(', ')}
        </CardDescription>
        <CardDescription>
          {company.city}, {company.state}
        </CardDescription>
        {company.size && (
          <CardDescription>
            {company.size} Employees
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto">
          {company.description && (
            <div className="text-sm">
              <p>{displayDescription}</p>
              {shouldTruncate && (
                <Button
                  variant="link"
                  className="h-auto px-0 py-0 mt-1 flex items-center gap-1 justify-start"
                  style={{ color: '#0B4168', padding: '0.25rem 0' }}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <>
                      Read Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-start mt-4 flex-shrink-0">
          {company.website ? (
            <Button 
              style={{ backgroundColor: '#0B4168' }} 
              className="hover:bg-blue-800 hover:scale-105 transition-all duration-200"
              onClick={() => window.open(company.website!, '_blank')}
            >
              More Info
            </Button>
          ) : (
            <Button 
              style={{ backgroundColor: '#6B7280' }} 
              className="cursor-not-allowed opacity-50"
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