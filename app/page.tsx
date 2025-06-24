"use client";

import { useState } from "react";
import { EventCard } from "@/components/event-card";
import { TrainingFilter } from "@/components/training-filter";
import { sampleEvents } from "@/lib/sample-data";
import { TrainingType } from "@/lib/types";

type FilterOption = TrainingType | "Both";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Both");
  
  // Filter events based on active filter
  const filteredEvents = sampleEvents.filter(event => {
    if (activeFilter === "Both") return true;
    return event.trainingType === activeFilter;
  });
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">
          Mental Health Training Programs
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Register for MHFA and QPR certification courses
        </p>
        
        <TrainingFilter 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
        
        <div className="grid gap-6 md:grid-cols-1">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No {activeFilter} trainings currently scheduled.
          </p>
        )}
      </div>
    </main>
  );
}