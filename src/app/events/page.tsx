import { Navbar } from "@/components/Navbar";
import { EventsList } from "@/components/EventsList";
import { EventsMap } from "@/components/EventsMap";
import { prisma } from "@/lib/db";

export default async function EventsPage() {
  // Fetch events from database
  const events = await prisma.event.findMany({
    orderBy: {
      startDate: 'asc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Left column - Events List (1/3) */}
        <div className="w-1/3 bg-white border-r border-gray-200 overflow-hidden">
          <EventsList events={events} />
        </div>
        
        {/* Right column - Interactive Map (2/3) */}
        <div className="w-2/3 relative">
          <EventsMap events={events} />
        </div>
      </div>
    </div>
  );
}