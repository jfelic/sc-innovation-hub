"use client"

import { useState } from "react";
import { EventsList } from "@/components/EventsList";
import { EventsMap } from "@/components/EventsMap";
import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";

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

interface EventsPageClientProps {
  events: Event[];
}

export function EventsPageClient({ events }: EventsPageClientProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
      {/* Mobile View Toggle */}
      <div className="lg:hidden flex bg-white border-b border-gray-200 p-2">
        <div className="flex w-full bg-gray-100 rounded-lg p-1">
          <Button
            variant={mobileView === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMobileView('list')}
            className="flex-1 flex items-center justify-center space-x-1"
            style={mobileView === 'list' ? { backgroundColor: '#0B4168' } : {}}
          >
            <List className="h-4 w-4" />
            <span>List</span>
          </Button>
          <Button
            variant={mobileView === 'map' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMobileView('map')}
            className="flex-1 flex items-center justify-center space-x-1"
            style={mobileView === 'map' ? { backgroundColor: '#0B4168' } : {}}
          >
            <Map className="h-4 w-4" />
            <span>Map</span>
          </Button>
        </div>
      </div>

      {/* Events List - Desktop: 1/3 width, Mobile: full width when list view */}
      <div className={`
        bg-white border-r border-gray-200 overflow-hidden
        lg:w-1/3 
        ${mobileView === 'list' ? 'flex-1' : 'hidden'} 
        lg:flex lg:flex-col
      `}>
        <EventsList 
          events={events} 
          selectedEventId={selectedEventId}
          onEventSelect={handleEventSelect}
        />
      </div>
      
      {/* Map - Desktop: 2/3 width, Mobile: full width when map view */}
      <div className={`
        relative
        lg:w-2/3 
        ${mobileView === 'map' ? 'flex-1' : 'hidden'} 
        lg:flex lg:flex-col
      `}>
        <EventsMap 
          events={events} 
          selectedEventId={selectedEventId}
        />
      </div>
    </div>
  );
}