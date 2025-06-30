// lib/utils.ts - Updated with fixes for date prefill and auto form URL generation
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Event, EventDisplay, TrainingType, Language } from "@/lib/types"
import { URLS, FORM_ENTRY_IDS } from "@/lib/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string (YYYY-MM-DD) into a readable format
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00') // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString // Return original if parsing fails
  }
}

/**
 * Format date for Google Forms prefilling (YYYY-MM-DD format)
 */
export function formatDateForGoogleForms(dateString: string): string {
  // Google Forms expects YYYY-MM-DD format, which is the same as our database format
  return dateString
}

/**
 * Get the appropriate Google Form URL based on training type and language
 */
export function getGoogleFormUrl(trainingType: TrainingType, language: Language): string {
  const key = `${trainingType}_${language.toUpperCase()}` as keyof typeof URLS.GOOGLE_FORMS
  return URLS.GOOGLE_FORMS[key]
}

/**
 * Format time range from start and end times (HH:MM format)
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  try {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':')
      const date = new Date()
      date.setHours(parseInt(hours), parseInt(minutes))
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  } catch {
    return `${startTime} - ${endTime}` // Return original if parsing fails
  }
}

/**
 * Generate a pre-filled Google Form URL for an event
 */
export function generatePrefillUrl(event: Event): string {
  if (!event.googleFormBaseUrl) {
    return '#' // Return empty anchor if no form URL
  }
  
  const url = new URL(event.googleFormBaseUrl)
  
  // Add the usp=pp_url parameter for proper Google Forms prefilling
  url.searchParams.set('usp', 'pp_url')
  
  // Add pre-filled entries if they exist
  if (event.dateEntryId) {
    // Use YYYY-MM-DD format (same as database format)
    url.searchParams.set(event.dateEntryId, formatDateForGoogleForms(event.date))
  }
  
  if (event.locationEntryId && event.location) {
    const locationText = event.address 
      ? `${event.location}, ${event.address}`
      : event.location
    url.searchParams.set(event.locationEntryId, locationText)
  }
  
  return url.toString()
}

/**
 * Create complete event data with auto-generated Google Form information
 */
export function createEventWithFormData(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'googleFormBaseUrl' | 'dateEntryId' | 'locationEntryId'>): Omit<Event, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    ...eventData,
    googleFormBaseUrl: getGoogleFormUrl(eventData.trainingType, eventData.language),
    dateEntryId: FORM_ENTRY_IDS.DATE,
    locationEntryId: FORM_ENTRY_IDS.LOCATION,
  }
}

/**
 * Enrich event data with additional display properties
 */
export function enrichEventForDisplay(event: Event): EventDisplay {
  const now = new Date()
  const eventDate = new Date(event.date)
  const isUpcoming = eventDate >= now
  
  return {
    ...event,
    displayDate: formatDate(event.date),
    displayTime: formatTimeRange(event.startTime, event.endTime),
    prefillUrl: generatePrefillUrl(event),
    isUpcoming
  }
}

/**
 * Sort events by date (earliest first by default, or latest first if ascending = false)
 */
export function sortEventsByDate(events: Event[], ascending: boolean = true): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date + 'T' + a.startTime)
    const dateB = new Date(b.date + 'T' + b.startTime)
    const diff = dateA.getTime() - dateB.getTime()
    return ascending ? diff : -diff
  })
}

/**
 * Check if an event date has passed (is archived)
 */
export function isEventArchived(eventDate: string): boolean {
  const today = new Date()
  const event = new Date(eventDate + 'T23:59:59') // End of event day
  
  // Reset today to start of day for fair comparison
  today.setHours(0, 0, 0, 0)
  
  return event < today
}

/**
 * Filter events based on archive status
 */
export function filterEventsByArchiveStatus(events: Event[], showArchived: boolean = false): Event[] {
  return events.filter(event => {
    const archived = isEventArchived(event.date)
    return showArchived ? archived : !archived
  })
}

/**
 * Get event counts by archive status
 */
export function getEventCounts(events: Event[]) {
  const active = events.filter(event => !isEventArchived(event.date))
  const archived = events.filter(event => isEventArchived(event.date))
  
  return {
    active: {
      total: active.length,
      MHFA: active.filter(e => e.trainingType === 'MHFA').length,
      QPR: active.filter(e => e.trainingType === 'QPR').length,
    },
    archived: {
      total: archived.length,
      MHFA: archived.filter(e => e.trainingType === 'MHFA').length,
      QPR: archived.filter(e => e.trainingType === 'QPR').length,
    }
  }
}