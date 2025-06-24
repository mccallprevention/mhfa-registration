"use client";

import { EventCard } from "@/components/event-card";
import { TrainingFilter } from "@/components/training-filter";
import { sampleEvents } from "@/lib/sample-data";
import { useState } from "react";
import { Search } from "lucide-react";

type FilterOption = "all" | "MHFA" | "QPR";

// McCall header logo component
function McCallHeaderLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 relative">
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#bcd63e]"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#003057]"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#fbac40]"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white transform rotate-45 origin-center"></div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#003057]">McCall</h1>
        <p className="text-sm text-[#003057] -mt-1">PREVENTION SERVICES</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredEvents = activeFilter === "all" 
    ? sampleEvents 
    : sampleEvents.filter(event => event.trainingType === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2e8] to-[#f4eee1]">
      {/* Header with McCall branding */}
      <header className="bg-[#003057] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="bg-white rounded-full p-2">
              <McCallHeaderLogo />
            </div>
            <button className="bg-[#80bc00] hover:bg-[#6ca000] px-4 py-2 rounded text-white font-semibold transition-colors">
              EN | ES
            </button>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-r from-[#003057] to-[#054a76] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Mental Health Training Programs
            </h1>
            <p className="text-xl opacity-90">
              Join us for professional development opportunities in Mental Health First Aid (MHFA) 
              and Question, Persuade, Refer (QPR) suicide prevention training.
            </p>
          </div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Search className="w-5 h-5" />
              <span className="font-medium">Find a training</span>
            </div>
            <TrainingFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </div>
        </div>
      </div>

      {/* Events grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-lg text-gray-600">
              No {activeFilter === "all" ? "" : activeFilter} trainings are currently scheduled.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please check back later or try a different filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#003057] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            © 2025 McCall Behavioral Health Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}