

> **Note to Future Developers & Maintainers:**
>
> The goal of this document is to make it so that the next developer can just read this and hit the ground running.
>
> **Document Maintenance Protocol:**
> 
> 1. This protocol must be retained in all subsequent versions of this document.  
> 2. Upon completion of a feature, this document must be updated to reflect the current project status and any significant development choices.  
> 3. Updates should detail architectural decisions, particularly those affecting file structure, shared utilities, or core business logic, to facilitate efficient onboarding.  
> 4. The existing structure of this document should be preserved. Revisions should be additive unless a fundamental change in the project's strategic direction necessitates a structural overhaul.
>

# 🚀 Event Registration Platform - Development Handoff Document

*Last Updated: June 25, 2025*

## 🧩 Project Scope & Goals

### 🎯 Primary Goal

Build a low-maintenance, low-cost, bilingual website that can:

  - Display upcoming **MHFA** and **QPR** events in both English and Spanish.
  - Let users register via language-specific, prefilled Google Forms.
  - Automatically send confirmation and reminder emails (future phase).
  - Give admins easy control over events and messaging (future phase).
  - Run entirely on free-tier services (Vercel, Make, Google).

## 🏗️ Architecture Overview

### 1\. 🖥️ Frontend – Public Event Listing Site

  - **Stack:** Next.js (App Router) + Tailwind CSS v3 + TypeScript, deployed on Vercel.
  - **Current Features:** A fully branded, bilingual, and responsive UI. Includes dynamic event filtering by language (EN/ES) and training type (MHFA/QPR).
  - **Performance:** Designed for fast loads, with future potential for ISR (Incremental Static Regeneration) on Vercel.

### 2\. 🔐 Backend – Admin Dashboard (Future Phase)

  - **Stack:** Next.js API routes.
  - **Features:** An auth-protected `/admin` page for full CRUD (Create, Read, Update, Delete) of events.
  - **Data Model:** Immutable Event ID, Title, Date, Time, Location, Language, Training Type, Google Form links.

### 3\. 📄 Prefilled Form Links

  - **Method:** Unique Google Form links exist for each event permutation (e.g., MHFA English, QPR Spanish).
  - **Validation:** The `generatePrefillUrl()` utility correctly URL-encodes event details into the link.

### 4\. 📩 Email Automation – Make Scenarios (Future Phase)

  - **Platform:** Make.com (free tier).
  - **Confirmation:** Will be triggered by new Google Form submissions.
  - **Reminder:** A daily job will check for upcoming events and email registrants.
  - **Calendar:** Will generate `.ics` attachments for "Add to calendar" functionality.

### 5\. 🗄️ Data Storage (Future Phase)

  - **Registrations:** Google Sheets will be the database for user registrations.
  - **Events:** Event data will be moved from the current `sample-data.ts` file to a database (JSON file, Vercel KV, or Google Sheets) accessed via API.
  - **Backups:** Plan includes weekly CSV exports of registration data.

-----

## ✅ CURRENT STATUS: Phase 2 - Branded, Bilingual UI Complete

### 🏆 **Major Milestone: Interactive Bilingual Event Filtering**

The public-facing front-end is feature-complete. It successfully displays events according to user selections for language and training type, is fully branded, and is free of known bugs.

**✅ COMPLETED:**

  - **Step A:** Foundational, accessible UI components (`Button`, `Card`).
  - **Step B:** Full branding and theming to match McCall's guidelines.
  - **Step C:** Reusable, polished brand components (`LogoHeader`, `LanguageToggle`).
  - **Step D:** Expanded `Event` type system to support multiple training types and languages.
  - **Step E:** Full bilingual support, with distinct English and Spanish events and UI text.
  - **Step F:** **Core filtering logic implemented:** Events are now correctly filtered first by language, then by training type.
  - **Step G:** All known TypeScript, ESLint, and React Hydration errors have been resolved.

**🎯 NEXT IMMEDIATE STEP:** Phase 3 - Admin Dashboard & API Routes

-----

## 🛠️ Critical Development Environment Details

### **TypeScript Configuration (ESSENTIAL for new devs)**

```json
// tsconfig.json - MUST include baseUrl for @/ imports to work
{
  "compilerOptions": {
    "baseUrl": ".",  // 🚨 CRITICAL: Required for @/ path aliases
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**❗ Key Learning:** Without `baseUrl`, you get "is not a module" errors.

### **Git Workflow (Best Practice)**

#### Creating a Feature Branch

Use feature branches for all new work to keep the `main` branch stable.

```bash
# Create and switch to a new branch before making changes
git checkout -b feature/your-feature-name
```

#### Merging a Feature Branch into Main

Follow these steps to safely merge your completed feature back into the `main` branch.

```bash
# 1. Go to the main branch and make sure it's up-to-date.
git checkout main
git pull origin main

# 2. Switch back to your feature branch.
git checkout feature/your-feature-name

# 3. Merge main into your feature branch to resolve any conflicts locally.
# (This step is optional but recommended for complex projects).
git merge main

# 4. Once ready, switch back to the main branch and merge your feature branch into it.
git checkout main
git merge feature/your-feature-name

# 5. Push the newly updated main branch to the remote repository.
git push origin main

# 6. (Optional) Clean up by deleting the now-merged feature branch.
git branch -d feature/your-feature-name # Deletes locally
git push origin --delete feature/your-feature-name # Deletes remotely
```

### **Development Commands**

```bash
npm run dev      # Starts dev server at http://localhost:3000
npm run build    # Creates an optimized production build, checks for errors
npm run lint     # Runs the linter to check for code quality issues
```

-----

## 📁 Critical File Structure & Key Components

```
📁 mhfa-registration/
├── app/
│   ├── globals.css         # 🎨 CRITICAL: McCall branding CSS variables
│   └── page.tsx            # 🧠 The "brain": manages state & filtering
├── components/
│   ├── ui/
│   │   ├── logo-header.tsx     # ✅ Reusable McCall Logo component
│   │   └── language-toggle.tsx # ✅ Interactive, responsive language toggle
│   ├── event-card.tsx      # Displays a single event card
│   └── training-filter.tsx # MHFA/QPR/All filter buttons
└── lib/
    ├── types.ts            # ✅ Defines the shape of Event data (w/ language)
    ├── utils.ts            # ✅ Language-aware utility functions
    └── sample-data.ts      # ✅ Contains both English & Spanish sample events
```

### **🧩 Type System (lib/types.ts)**

**✅ COMPLETE & EXPANDED** - The core `Event` interface and related types.

```typescript
export type TrainingType = "MHFA" | "QPR";
export type Language = "en" | "es";

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;  
  endTime: string;   
  location: string;
  address?: string;   
  trainingType: TrainingType;
  language: Language;  // NEW: Language property
  googleFormBaseUrl: string;
  dateEntryId: string;
  locationEntryId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  timeZone?: string;
}

export interface UrlValidationResult {
  isValid: boolean;
  status?: number;
  error?: string;
  url: string;
}

export interface EventDisplay extends Event {
  isUpcoming: boolean;
  displayDate: string;
  displayTime: string;
  prefillUrl: string;
  urlValidation?: UrlValidationResult;
}
```

### **⚙️ Utility Functions (lib/utils.ts)**

**✅ COMPLETE & BILINGUAL** - All type-safe and tested utility functions.

```typescript
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
  const tomorrowString = tomorrow.toISOString().split('T')[0] // yyyy-MM-dd format
  
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
  language: Language      // NEW
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
```

-----

## 🚨 Important Development Choices & Learnings

### **1. The Core Filtering Logic (The Fix)**

The central challenge was displaying events correctly based on two criteria. The solution in `app/page.tsx` is a **chained filter**, which is the most important piece of logic on the page.

```typescript
const filteredEvents = sampleEvents
  .filter(event => event.language === currentLanguage) // 1. Filter by language FIRST
  .filter(event => activeFilter === "all" || event.trainingType === activeFilter); // 2. Then filter by type
```

### **2. Bilingual Support Architecture**

  - **Data:** The `language: "en" | "es"` property on the `Event` type is the foundation.
  - **Utils:** Functions in `lib/utils.ts` accept a `language` parameter for correct formatting.
  - **UI:** The `page.tsx` uses ternary operators (`currentLanguage === "en" ? "..." : "..."`) to switch static UI text.

### **3. Brand as a Theme via CSS Variables**

  - All McCall brand colors are defined as CSS custom properties (variables) in `app/globals.css`.
  - Tailwind configuration (`tailwind.config.js`) is extended to recognize these variables (e.g., `bg-mccall-navy`). This makes applying or updating the brand theme trivial.

### **4. Component Organization**

  - **`components/ui/`** is for generic, reusable primitives (e.g., a button, a logo).
  - **`components/`** is for specific, composite components that solve an app problem (e.g., an event card).

### **5. HTML Semantics & Hydration Errors**

  - A React hydration error was fixed in `event-card.tsx` by replacing a `<p>` tag that incorrectly wrapped a `<div>` with a `<div>` itself, ensuring valid HTML.

-----

## 📋 Next Steps for Development

### **🎯 Phase 3: Admin Dashboard (NEXT)**

The plan for building the backend and admin interface remains the same.

1.  **Authentication Setup:** Create and protect an `/admin` route.
2.  **API Routes:** Build `/api/events` for GET, POST, PUT, DELETE.
3.  **Data Persistence:** Move event data from the local `sample-data.ts` to a server-side source accessed by the API.
4.  **Event Management UI:** Build a simple admin UI for event CRUD.

### **🎯 Phase 4: Email Automation**

  - Set up Make.com scenarios to watch for Google Form submissions and send emails.