"use client"

import dynamic from 'next/dynamic';

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

interface EventsMapProps {
  events: Event[];
  selectedEventId?: string | null;
}

// Dynamically import the Map component to avoid SSR issues with Leaflet
// React Leaflet makes direct calls to DOM and is not compatible with SSR
const DynamicMapClient = dynamic(() => import('./EventsMapClient'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading map...</p>
      </div>
    </div>
  )
});

export function EventsMap({ events, selectedEventId }: EventsMapProps) {
  return <DynamicMapClient events={events} selectedEventId={selectedEventId} />;
}