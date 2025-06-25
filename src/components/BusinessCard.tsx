import type { Company } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // This now imports from the shadcn component

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
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
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
      <CardContent>
        <div>
            {company.description && <p className="text-sm">{company.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-row mt-4">
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