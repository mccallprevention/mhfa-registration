import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Event, EventDisplay, UrlValidationResult, Language } from "./types"
import { TrainingType } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities with language support
export function formatDate(dateString: string, language: Language = 'en'): string {
  const date = new Date(dateString)
  const locale = language === 'es' ? 'es-US' : 'en-US'
  
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatTime(timeString: string, language: Language = 'en'): string {
  const [hours, minutes] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hours), parseInt(minutes))
  const locale = language === 'es' ? 'es-US' : 'en-US'
  
  return date.toLocaleTimeString(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Format time range for display with language support
export function formatTimeRange(startTime: string, endTime: string, language: Language = 'en'): string {
  const locale = language === 'es' ? 'es-US' : 'en-US'
  
  const formatSingleTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  return `${formatSingleTime(startTime)} - ${formatSingleTime(endTime)}`;
}

// Google Forms URL utilities - Updated for MHFA project requirements
export function generatePrefillUrl(event: Event): string {
  const params = new URLSearchParams({
    usp: 'pp_url',
    [event.dateEntryId]: event.date,
    [event.locationEntryId]: event.location
  });
  
  // URLSearchParams encodes spaces as '+', but Google Forms needs '%20'
  const paramString = params.toString().replace(/\+/g, '%20');
  
  return `${event.googleFormBaseUrl}?${paramString}`;
}

// URL validation for Google Forms
export async function validateGoogleFormUrl(url: string): Promise<UrlValidationResult> {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // Use HEAD to avoid downloading full content
      mode: 'no-cors', // Handle CORS issues with Google Forms
    })
    
    // Google Forms typically return 200 for valid forms or 302 for redirects
    const isValid = response.status === 200 || response.status === 302
    
    return {
      isValid,
      status: response.status,
      url
    }
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error',
      url
    }
  }
}

// Alternative validation method that works better with Google Forms CORS
export function validateGoogleFormUrlBasic(url: string): UrlValidationResult {
  try {
    const urlObj = new URL(url)
    
    // Basic validation: should be a Google Forms URL
    const isGoogleForm = urlObj.hostname === 'docs.google.com' && 
                        urlObj.pathname.includes('/forms/')
    
    if (!isGoogleForm) {
      return {
        isValid: false,
        error: 'URL must be a Google Forms link',
        url
      }
    }
    
    return {
      isValid: true,
      url
    }
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format',
      url
    }
  }
}

// Event validation utilities
export function isEventUpcoming(eventDate: string): boolean {
  const today = new Date()
  const eventDateObj = new Date(eventDate)
  
  // For MVP, simple date comparison works
  // TODO: Add timezone support in future version
  today.setHours(0, 0, 0, 0) // Reset time to start of day
  eventDateObj.setHours(0, 0, 0, 0)
  
  return eventDateObj >= today
}

// Convert Event to EventDisplay with computed properties - UPDATED
export function enrichEventForDisplay(event: Event): EventDisplay {
  const isUpcoming = isEventUpcoming(event.date)
  const displayDate = formatDate(event.date, event.language)
  const displayTime = formatTimeRange(event.startTime, event.endTime, event.language)
  const prefillUrl = generatePrefillUrl(event)
  
  return {
    ...event,
    isUpcoming,
    displayDate,
    displayTime,
    prefillUrl
  }
}

// Generate a unique ID for new events
export function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Utility to sort events by date
export function sortEventsByDate(events: Event[], ascending: boolean = true): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
  })
}

// Get events that need reminders (happening tomorrow)
export function getEventsNeedingReminders(events: Event[]): Event[] {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowString = tomorrow.toISOString().split('T')[0] // YYYY-MM-DD format
  
  return events.filter(event => 
    event.isActive && 
    event.date === tomorrowString
  )
}

// Format date for Google Sheets/Make.com integration
export function formatDateForSheets(date: Date): string {
  return date.toISOString()
}

// Parse event form data and add metadata - UPDATED
export function createEventFromForm(formData: {
  title: string
  date: string
  startTime: string      
  endTime: string        
  location: string
  address?: string       
  trainingType: TrainingType
  language: Language     // NEW
  googleFormBaseUrl: string
  dateEntryId: string
  locationEntryId: string
  isActive: boolean
  timeZone?: string
}): Event {
  const now = new Date().toISOString()
  
  return {
    id: generateEventId(),
    title: formData.title,
    date: formData.date,
    startTime: formData.startTime,      
    endTime: formData.endTime,          
    location: formData.location,
    address: formData.address,          
    trainingType: formData.trainingType,
    language: formData.language,        // NEW
    googleFormBaseUrl: formData.googleFormBaseUrl,
    dateEntryId: formData.dateEntryId,
    locationEntryId: formData.locationEntryId,
    isActive: formData.isActive,
    timeZone: formData.timeZone,
    createdAt: now,
    updatedAt: now
  }
}