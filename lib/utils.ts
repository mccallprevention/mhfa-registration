// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Event, EventDisplay } from "@/lib/types"

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
  
  // Add pre-filled entries if they exist
  if (event.dateEntryId) {
    url.searchParams.set(event.dateEntryId, formatDate(event.date))
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