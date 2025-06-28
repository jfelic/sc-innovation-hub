"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { format } from 'date-fns';
import { MapPin, Calendar, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

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

interface EventsMapClientProps {
  events: Event[];
  selectedEventId?: string | null;
}

interface EventWithCoordinates extends Event {
  coordinates?: [number, number];
}

// Create custom icons for different event types
const createEventIcon = (isVirtual: boolean, industry: string[], isSelected: boolean = false) => {
  const iconColor = isVirtual ? '#10b981' : // Green for virtual
                   industry.includes('tech') ? '#3b82f6' : // Blue for tech
                   industry.includes('cyber') ? '#ef4444' : // Red for cyber
                   industry.includes('ai') ? '#8b5cf6' : // Purple for AI
                   '#6b7280'; // Gray for others

  const size = isSelected ? 32 : 24;
  const strokeColor = isSelected ? '#fff' : 'none';
  const strokeWidth = isSelected ? 2 : 0;

  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}" width="${size}" height="${size}" stroke="${strokeColor}" stroke-width="${strokeWidth}">
        <path d="M12 2c-3.866 0-7 3.134-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Default coordinates for Charleston, SC
const CHARLESTON_COORDS: [number, number] = [32.7765, -79.9311];

// Component to handle map navigation when event is selected
function MapController({ selectedEventId, eventsWithCoordinates }: { 
  selectedEventId: string | null | undefined;
  eventsWithCoordinates: EventWithCoordinates[];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedEventId) {
      const selectedEvent = eventsWithCoordinates.find(event => event.id === selectedEventId);
      if (selectedEvent && selectedEvent.coordinates) {
        // Fly to the selected event's location
        map.flyTo(selectedEvent.coordinates, 15, {
          duration: 1.5
        });
      }
    }
  }, [selectedEventId, eventsWithCoordinates, map]);

  return null;
}

// Cache for geocoded addresses
const geocodeCache = new Map<string, [number, number] | null>();

// Load cache from localStorage on initialization
const loadCacheFromStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('geocode-cache');
      if (cached) {
        const data = JSON.parse(cached);
        Object.entries(data).forEach(([key, value]) => {
          geocodeCache.set(key, value as [number, number] | null);
        });
      }
    } catch (error) {
      console.error('Failed to load geocode cache:', error);
    }
  }
};

// Save cache to localStorage
const saveCacheToStorage = () => {
  if (typeof window !== 'undefined') {
    try {
      const cacheObject = Object.fromEntries(geocodeCache);
      localStorage.setItem('geocode-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Failed to save geocode cache:', error);
    }
  }
};

// Initialize cache on first load
if (typeof window !== 'undefined') {
  loadCacheFromStorage();
}

// Geocoding function with caching
const geocodeAddress = async (address: string, city: string, state: string): Promise<[number, number] | null> => {
  const fullAddress = `${address}, ${city}, ${state}`;
  const cacheKey = fullAddress.toLowerCase().trim();
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) || null;
  }
  
  try {
    const encodedAddress = encodeURIComponent(fullAddress);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=us`
    );
    
    if (!response.ok) {
      geocodeCache.set(cacheKey, null);
      saveCacheToStorage();
      return null;
    }
    
    const data = await response.json();
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      const coordinates: [number, number] = [lat, lon];
      
      // Cache the result
      geocodeCache.set(cacheKey, coordinates);
      saveCacheToStorage();
      
      return coordinates;
    } else {
      // Cache negative result to avoid future requests
      geocodeCache.set(cacheKey, null);
      saveCacheToStorage();
      return null;
    }
  } catch (error) {
    console.error('Geocoding error for address:', fullAddress, error);
    // Don't cache network errors - only cache actual "not found" results
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Network error - don't cache, allow retry
      return null;
    }
    // Cache actual geocoding failures
    geocodeCache.set(cacheKey, null);
    saveCacheToStorage();
    return null;
  }
};

export default function EventsMapClient({ events, selectedEventId }: EventsMapClientProps) {
  const [eventsWithCoordinates, setEventsWithCoordinates] = useState<EventWithCoordinates[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const geocodeEvents = async () => {
      setIsLoading(true);
      
      // Filter events that have physical addresses (more lenient filtering)
      const physicalEvents = events.filter(event => 
        !event.isVirtual && 
        event.venue !== 'Online' && 
        (event.address || event.venue) && // Allow either address OR venue
        event.city && 
        event.state
      );

      console.log(`Filtered ${physicalEvents.length} physical events out of ${events.length} total events`);

      const geocodedEvents: EventWithCoordinates[] = [];
      const uncachedEvents: Event[] = [];

      // First pass: check cache for existing coordinates
      for (const event of physicalEvents) {
        const addressPart = event.address || event.venue || '';
        const fullAddress = `${addressPart}, ${event.city}, ${event.state}`;
        const cacheKey = fullAddress.toLowerCase().trim();
        
        if (geocodeCache.has(cacheKey)) {
          const coordinates = geocodeCache.get(cacheKey);
          geocodedEvents.push({
            ...event,
            coordinates: coordinates || undefined
          });
        } else {
          uncachedEvents.push(event);
        }
      }

      // If we have all coordinates from cache, set immediately
      if (uncachedEvents.length === 0) {
        setEventsWithCoordinates(geocodedEvents.filter(event => event.coordinates));
        setIsLoading(false);
        return;
      }

      // Second pass: geocode uncached events with rate limiting
      for (const event of uncachedEvents) {
        // Add proper delay to respect OpenStreetMap rate limits (1 request/second)
        await new Promise(resolve => setTimeout(resolve, 1100));
        
        const addressPart = event.address || event.venue || '';
        const coordinates = await geocodeAddress(addressPart, event.city, event.state);
        
        geocodedEvents.push({
          ...event,
          coordinates: coordinates || undefined
        });
      }

      const finalEvents = geocodedEvents.filter(event => event.coordinates);
      console.log(`Successfully geocoded ${finalEvents.length} events with coordinates`);
      setEventsWithCoordinates(finalEvents);
      setIsLoading(false);
    };

    geocodeEvents();
  }, [events]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading event locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={CHARLESTON_COORDS}
        zoom={10}
        className="h-full w-full relative z-0"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedEventId={selectedEventId} eventsWithCoordinates={eventsWithCoordinates} />
        
        {eventsWithCoordinates.map((event) => {
          if (!event.coordinates) return null;
          
          const isSelected = selectedEventId === event.id;

          return (
            <Marker
              key={event.id}
              position={event.coordinates}
              icon={createEventIcon(event.isVirtual, event.industry, isSelected)}
            >
              <Popup className="custom-popup" maxWidth={300}>
                <div className="p-2">
                  {/* Event Title and Logo */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base leading-tight">
                        {event.title}
                      </h3>
                      {event.organizerName && (
                        <p className="text-sm text-gray-600 mt-1">
                          by {event.organizerName}
                        </p>
                      )}
                    </div>
                    {event.logoUrl && (
                      <img 
                        src={event.logoUrl} 
                        alt={event.title}
                        className="w-12 h-12 rounded object-cover ml-3 flex-shrink-0"
                      />
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>
                      {format(new Date(event.startDate), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      {event.venue && <div className="font-medium">{event.venue}</div>}
                      <div>{event.address}</div>
                      <div>{event.city}, {event.state}</div>
                    </div>
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
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {event.description.length > 150 
                        ? `${event.description.substring(0, 150)}...`
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
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Event Details
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}