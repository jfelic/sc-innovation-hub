"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: string; // Serialized as string from server component
  endDate: string | null; // Serialized as string from server component
  venue: string | null;
  address: string | null;
  city: string;
  state: string;
  isVirtual: boolean;
  eventUrl: string | null;
  industry: string[];
  organizerName: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Defines the props for the SavedEventCard component.
 * It expects a single 'event' object and an optional onUnsave callback.
 */
interface SavedEventCardProps {
  event: Event;
  onUnsave?: () => void; // Callback to refresh the list when event is unsaved
}

/**
 * Renders an event card specifically designed for the saved events page.
 * Matches the Figma design with image, title, date/time, and unsave functionality.
 * @param {SavedEventCardProps} props - The properties for the component.
 * @returns {JSX.Element} A styled card displaying saved event information.
 */
export function SavedEventCard({ event, onUnsave }: SavedEventCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  // Debug: Log event data to see structure
  console.log('SavedEventCard - Event data:', event);

  // Function to handle unsaving an event
  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers
    
    if (!session?.user?.id) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}/favorite`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Call the onUnsave callback to refresh the list
        onUnsave?.();
      } else {
        console.error('Failed to unsave event');
      }
    } catch (error) {
      console.error('Error unsaving event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format the date and time for display
  const formatDateTime = () => {
    const eventDate = new Date(event.startDate); // Convert string back to Date
    const dayOfWeek = format(eventDate, 'EEE'); // Sun, Mon, etc.
    const monthDay = format(eventDate, 'MMMM do'); // June 29th
    const time = format(eventDate, 'h:mm a'); // 5:00 PM
    const timezone = 'ET'; // Default timezone
    
    return `${dayOfWeek}, ${monthDay} - ${time} ${timezone}`;
  };

  // Use a placeholder image if no logoUrl is available
  const imageUrl = event.logoUrl || '/api/placeholder/300/200';

  return (
    <Card className="w-full overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {/* Event Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y3ZjhmOSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E0YWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FdmVudCBJbWFnZTwvdGV4dD4KPC9zdmc+';
            }}
          />
        </div>

        {/* Unsave Heart Button - positioned in top right of image */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnsave}
            disabled={isLoading}
            className="p-1 h-8 w-8 bg-white/80 hover:bg-white/90 rounded-full shadow-sm"
          >
            <Heart 
              className="h-4 w-4 fill-red-500 text-red-500 hover:fill-red-600 hover:text-red-600"
            />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Event Title */}
        <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
          {event.title}
        </h3>

        {/* Date and Time */}
        <p className="text-sm text-gray-600">
          {formatDateTime()}
        </p>
      </CardContent>
    </Card>
  );
}