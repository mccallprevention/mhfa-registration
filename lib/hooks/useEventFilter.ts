// lib/hooks/useEventFilter.ts
import { useState, useMemo } from 'react';
import { Event, Language, TrainingType } from '@/lib/types';
import { enrichEventForDisplay, sortEventsByDate } from '@/lib/utils';

export type FilterOption = 'all' | TrainingType;

interface UseEventFilterOptions {
  initialLanguage?: Language;
  initialFilter?: FilterOption;
  sortAscending?: boolean;
}

export function useEventFilter(
  events: Event[],
  options: UseEventFilterOptions = {}
) {
  const {
    initialLanguage = 'en',
    initialFilter = 'all',
    sortAscending = true
  } = options;

  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);
  const [activeFilter, setActiveFilter] = useState<FilterOption>(initialFilter);

  const filteredAndSortedEvents = useMemo(() => {
    // Apply language filter
    let filtered = events.filter(event => event.language === currentLanguage);
    
    // Apply training type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => event.trainingType === activeFilter);
    }
    
    // Sort by date
    const sorted = sortEventsByDate(filtered, sortAscending);
    
    // Enrich with display properties
    return sorted.map(enrichEventForDisplay);
  }, [events, currentLanguage, activeFilter, sortAscending]);

  const eventCounts = useMemo(() => {
    const languageEvents = events.filter(event => event.language === currentLanguage);
    
    return {
      all: languageEvents.length,
      MHFA: languageEvents.filter(e => e.trainingType === 'MHFA').length,
      QPR: languageEvents.filter(e => e.trainingType === 'QPR').length
    };
  }, [events, currentLanguage]);

  const upcomingEventCounts = useMemo(() => {
    const languageEvents = events
      .filter(event => event.language === currentLanguage)
      .map(enrichEventForDisplay)
      .filter(event => event.isUpcoming);
    
    return {
      all: languageEvents.length,
      MHFA: languageEvents.filter(e => e.trainingType === 'MHFA').length,
      QPR: languageEvents.filter(e => e.trainingType === 'QPR').length
    };
  }, [events, currentLanguage]);

  return {
    // State
    currentLanguage,
    activeFilter,
    
    // Setters
    setCurrentLanguage,
    setActiveFilter,
    
    // Computed values
    filteredEvents: filteredAndSortedEvents,
    eventCounts,
    upcomingEventCounts,
    
    // Utilities
    hasEvents: filteredAndSortedEvents.length > 0,
    hasUpcomingEvents: filteredAndSortedEvents.some(e => e.isUpcoming)
  };
}