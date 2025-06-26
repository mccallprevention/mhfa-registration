"use client";

import { EventCard } from "@/components/event-card";
import { TrainingFilter } from "@/components/training-filter";
import { LogoHeader } from "@/components/ui/logo-header";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useState, useEffect } from "react";
import type { Event } from '@/lib/types'

type FilterOption = "all" | "MHFA" | "QPR";

export default function Home() {
  // NEW: API data loading
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Keep your existing state
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "es">("en");

  // NEW: Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true)
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        setEvents(data.events || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Keep your existing filtering logic - just change sampleEvents to events
  const filteredEvents = events
    .filter(event => event.language === currentLanguage)
    .filter(event => activeFilter === "all" || event.trainingType === activeFilter);

  // Keep your existing handler
  const handleLanguageChange = (language: "en" | "es") => {
    setCurrentLanguage(language);
  };

  // NEW: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f2e8] to-[#f4eee1]">
        <header className="bg-[#003057] text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <LogoHeader className="mr-4 sm:mr-6" />   
              <LanguageToggle onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </header>
        <div className="bg-gradient-to-r from-[#003057] to-[#054a76] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    )
  }

  // NEW: Error state  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f2e8] to-[#f4eee1]">
        <header className="bg-[#003057] text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <LogoHeader className="mr-4 sm:mr-6" />   
              <LanguageToggle onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </header>
        <div className="bg-gradient-to-r from-[#003057] to-[#054a76] text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Events</h1>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-white text-[#003057] px-4 py-2 rounded hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Keep your EXACT existing return structure
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2e8] to-[#f4eee1]">
      {/* Header with McCall branding */}
      <header className="bg-[#003057] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoHeader className="mr-4 sm:mr-6" />   
            <LanguageToggle onLanguageChange={handleLanguageChange} />
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="bg-gradient-to-r from-[#003057] to-[#054a76] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {currentLanguage === "en" 
                ? "Mental Health Training Programs"
                : "Programas de Capacitación en Salud Mental"}
            </h1>
            <p className="text-xl opacity-90">
              {currentLanguage === "en"
                ? "Join us for professional development opportunities in Mental Health First Aid (MHFA) and Question, Persuade, Refer (QPR) suicide prevention training."
                : "Únase a nosotros para oportunidades de desarrollo profesional en Primeros Auxilios de Salud Mental (MHFA) y capacitación en prevención del suicidio Preguntar, Persuadir, Referir (QPR)."}
            </p>
          </div>
        </div>
      </div>

      {/* Filter section */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <TrainingFilter 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter}
            currentLanguage={currentLanguage}
          />
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
            {currentLanguage === "en"
              ? "© 2025 McCall Behavioral Health Network. All rights reserved."
              : "© 2025 McCall Behavioral Health Network. Todos los derechos reservados."}
          </p>
        </div>
      </footer>
    </div>
  );
}