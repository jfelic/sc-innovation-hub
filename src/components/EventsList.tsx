"use client"

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, ExternalLink, Clock, Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  venue: string | null;
  address: string | null;
  city: string;
  state: string;
  isVirtual: boolean;
  eventUrl: string | null;
  industry: string[];
  organizerName: string | null;
  logoUrl: string | null;
}

interface EventsListProps {
  events: Event[];
  selectedEventId?: string | null;
  onEventSelect?: (eventId: string) => void;
}

export function EventsList({ events, selectedEventId, onEventSelect }: EventsListProps) {
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();

  // Function to check if an event is favorited by the user
  const checkIfFavorited = useCallback(async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/favorite`);
      if (response.ok) {
        const data = await response.json();
        return data.isFavorited;
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
    return false;
  }, []);

  // Load favorite states for all events on component mount
  useEffect(() => {
    if (session?.user?.id && events.length > 0) {
      const loadFavoriteStates = async () => {
        const states: Record<string, boolean> = {};
        for (const event of events) {
          states[event.id] = await checkIfFavorited(event.id);
        }
        setFavoriteStates(states);
      };
      loadFavoriteStates();
    }
  }, [session?.user?.id, events, checkIfFavorited]);

  // Function to handle favoriting/unfavoriting an event
  const handleFavoriteToggle = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!session?.user?.id) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin';
      return;
    }

    setLoadingStates(prev => ({ ...prev, [eventId]: true }));
    try {
      const isFavorited = favoriteStates[eventId];
      const response = await fetch(`/api/events/${eventId}/favorite`, {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFavoriteStates(prev => ({ ...prev, [eventId]: !isFavorited }));
      } else {
        console.error('Failed to toggle favorite');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="text-gray-600 mt-1">{events.length} events found</p>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
            <p className="mt-1 text-sm text-gray-500">No events found in the database.</p>
          </div>
        ) : (
          events.map((event) => {
            const isSelected = selectedEventId === event.id;
            const isPhysicalEvent = !event.isVirtual && event.venue !== 'Online' && event.address;
            
            return (
              <Card 
                key={event.id} 
                className={`transition-all cursor-pointer ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 shadow-lg bg-blue-50' 
                    : 'hover:shadow-md'
                } ${
                  isPhysicalEvent ? 'hover:ring-1 hover:ring-blue-300' : ''
                }`}
                onClick={() => isPhysicalEvent && onEventSelect?.(event.id)}
              >
              <CardContent className="p-4">
                {/* Event Title, Logo, and Favorite Button */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {event.title}
                    </h3>
                    {event.organizerName && (
                      <p className="text-xs text-gray-500 mt-1">
                        by {event.organizerName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {/* Favorite button - only show if user is logged in */}
                    {session && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleFavoriteToggle(event.id, e)}
                        disabled={loadingStates[event.id]}
                        className="p-1 h-8 w-8 hover:bg-red-50"
                      >
                        <Heart 
                          className={`h-4 w-4 ${
                            favoriteStates[event.id] 
                              ? 'fill-red-500 text-red-500' 
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        />
                      </Button>
                    )}
                    {event.logoUrl && (
                      <img 
                        src={event.logoUrl} 
                        alt={event.title}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {format(new Date(event.startDate), "MMM d, yyyy")}
                    {event.endDate && event.endDate !== event.startDate && (
                      <span> - {format(new Date(event.endDate), "MMM d, yyyy")}</span>
                    )}
                  </span>
                  <Clock className="h-3 w-3 ml-3 mr-1" />
                  <span>{format(new Date(event.startDate), "h:mm a")}</span>
                </div>

                {/* Location */}
                <div className="flex items-center text-xs text-gray-600 mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>
                    {event.isVirtual ? (
                      "Virtual Event"
                    ) : (
                      <>
                        {event.venue && `${event.venue}, `}
                        {event.city}, {event.state}
                      </>
                    )}
                  </span>
                </div>

                {/* Industries */}
                {event.industry.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.industry.slice(0, 3).map((industry) => (
                      <span
                        key={industry}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {industry}
                      </span>
                    ))}
                    {event.industry.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{event.industry.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Description (truncated) */}
                {event.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {event.description.length > 100 
                      ? `${event.description.substring(0, 100)}...`
                      : event.description
                    }
                  </p>
                )}

                {/* Event URL */}
                {event.eventUrl && (
                  <a
                    href={event.eventUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Event Details
                  </a>
                )}
              </CardContent>
            </Card>
            );
          })
        )}
      </div>
    </div>
  );
}