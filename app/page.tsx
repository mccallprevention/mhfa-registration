import { EventCard } from "@/components/event-card";
import { sampleEvents } from "@/lib/sample-data";

export default function Home() {
  // Debug: Log the number of events
  console.log("Number of sample events:", sampleEvents.length);
  console.log("Sample events:", sampleEvents);
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Mental Health First Aid Training
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Register for upcoming MHFA certification courses
        </p>
        
        <div className="grid gap-6 md:grid-cols-1">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}