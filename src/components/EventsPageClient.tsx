"use client"

import { useState } from "react";
import { EventsList } from "@/components/EventsList";
import { EventsMap } from "@/components/EventsMap";

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

  const handleEventSelect = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  return (
    <div className="flex h-[calc(100vh-5rem)]">
      {/* Left column - Events List (1/3) */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-hidden">
        <EventsList 
          events={events} 
          selectedEventId={selectedEventId}
          onEventSelect={handleEventSelect}
        />
      </div>
      
      {/* Right column - Interactive Map (2/3) */}
      <div className="w-2/3 relative">
        <EventsMap 
          events={events} 
          selectedEventId={selectedEventId}
        />
      </div>
    </div>
  );
}