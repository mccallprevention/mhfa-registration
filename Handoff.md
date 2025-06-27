# 🚀 Event Registration Platform - Development Handoff Document

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

*Last Updated: June 27, 2025*

## 🧩 Project Scope & Goals

### 🎯 Primary Goal

Build a low-maintenance, low-cost, bilingual website that can:

  - Display upcoming **MHFA** and **QPR** events in both English and Spanish.
  - Let users register via language-specific, prefilled Google Forms.
  - Automatically archive past events while maintaining admin access to historical data.
  - Provide intuitive admin controls for event management with Active/Archived views.
  - Automatically send confirmation and reminder emails (future phase).
  - Give admins easy control over events and messaging (future phase).
  - Run entirely on free-tier services (Vercel, Redis Cloud, Make, Google).

## 🏗️ Architecture Overview

### 1\. 🖥️ Frontend – Public Event Listing Site

  - **Stack:** Next.js (App Router) + Tailwind CSS v3 + TypeScript, deployed on Vercel.
  - **Current Features:** A fully branded, bilingual, and responsive UI. Includes dynamic event filtering by language (EN/ES) and training type (MHFA/QPR). Automatically displays only active (future) events to public users.
  - **Performance:** Designed for fast loads, with responsive grid layouts that maintain perfect alignment across devices.

### 2\. 🔐 Backend – Admin Dashboard (**COMPLETE**)

  - **Stack:** Next.js API routes with Redis Cloud database and authentication.
  - **Features:** An auth-protected `/admin` page for full CRUD (Create, Read, Update, Delete) of events with Active/Archived view toggle.
  - **Data Model:** Immutable Event ID, Title, Date, Time, Location, Language, Training Type, Google Form links.
  - **Archive System:** Events automatically archive when their date passes, with admin access to view historical events.

### 3\. 📄 Prefilled Form Links

  - **Method:** Unique Google Form links exist for each event permutation (e.g., MHFA English, QPR Spanish).
  - **Validation:** The `generatePrefillUrl()` utility correctly URL-encodes event details into the link.

### 4\. 📩 Email Automation – Make Scenarios (Future Phase)

  - **Platform:** Make.com (free tier).
  - **Confirmation:** Will be triggered by new Google Form submissions.
  - **Reminder:** A daily job will check for upcoming events and email registrants.
  - **Calendar:** Will generate `.ics` attachments for "Add to calendar" functionality.

### 5\. 🗄️ Data Storage (**IMPLEMENTED**)

  - **Events Database:** **Redis Cloud** via Vercel Storage (30MB free tier).
  - **Connection:** Standard Redis protocol via `REDIS_URL` environment variable.
  - **Client:** Uses `redis` npm package with `RedisClientType` for type safety.
  - **Archive Logic:** Date-based automatic archiving with API filtering support.
  - **Registrations:** Google Sheets will be the database for user registrations (future phase).
  - **Backups:** Plan includes weekly CSV exports of registration data.

-----

## ✅ CURRENT STATUS: Phase 4 Complete - Full Admin Dashboard with Archive System

### 🏆 **Major Milestones Achieved:**

1. **Interactive Bilingual Event Filtering** - The public-facing front-end is feature-complete.
2. **Architecture Refactoring** - Codebase has been refactored for maintainability and scalability.
3. **Database Infrastructure** - Redis Cloud database deployed and connected.
4. **Complete API Layer** - Full CRUD operations implemented and tested.
5. **API-Driven Frontend** - Main application now fetches all data from database.
6. **Database Manipulation Verified** - Real-time CRUD operations confirmed working.
7. **Admin Dashboard Complete** - Full admin interface with authentication and CRUD operations.
8. **Automatic Archive System** - Events automatically archive based on dates with admin access to historical data.
9. **Responsive Card Layout System** - Perfect grid alignment on desktop while maintaining natural mobile spacing.

**✅ COMPLETED:**

  - **Step A:** Foundational, accessible UI components (`Button`, `Card`).
  - **Step B:** Full branding and theming to match McCall's guidelines.
  - **Step C:** Reusable, polished brand components (`LogoHeader`, `LanguageToggle`).
  - **Step D:** Expanded `Event` type system to support multiple training types and languages.
  - **Step E:** Full bilingual support, with distinct English and Spanish events and UI text.
  - **Step F:** **Core filtering logic implemented:** Events are now correctly filtered first by language, then by training type.
  - **Step G:** All known TypeScript, ESLint, and React Hydration errors have been resolved.
  - **Step H:** **Architecture refactoring completed:**
    - Fixed critical type duplication issue
    - Implemented proper i18n translation system
    - Extracted all constants and configuration
    - Created reusable custom hooks
    - Reduced sample data file from 600+ to ~100 lines
  - **Step I:** **Database infrastructure implemented:**
    - Redis Cloud database via Vercel Storage (30MB free)
    - Type-safe database client with singleton connection pattern
    - Full CRUD operations for events
    - Database seeding functionality
    - Production-ready API routes with proper runtime configuration
  - **Step J:** **Complete API layer implemented:**
    - `/api/events` - GET (with auto-seeding) and POST endpoints
    - `/api/events/[id]` - GET, PUT, DELETE for individual events
    - Next.js 15 async params compatibility resolved
    - Comprehensive error handling and validation
  - **Step K:** **Frontend API integration completed:**
    - Main page now fetches all events from database API
    - Loading and error states implemented
    - Real-time database changes verified working
    - Auto-seeding on first load confirmed
  - **Step L:** **Critical timezone bug fixed:**
    - Implemented `parseLocalDate` helper function
    - Fixed JavaScript UTC date parsing issues
    - Date consistency achieved between frontend and admin views
    - All date utilities updated to use local timezone parsing
  - **Step M (NEW):** **Complete admin dashboard implemented:**
    - Authentication system with NextAuth.js
    - Protected `/admin` routes with session management
    - Full CRUD interface for event management
    - Admin-only access to all event operations
  - **Step N (NEW):** **Automatic archive system implemented:**
    - Events automatically archive when their date passes (11:59 PM on event day)
    - Frontend users only see active (future) events
    - Admin users can toggle between Active and Archived views
    - API endpoints support archive filtering (`?archived=true`)
    - No manual archiving required - fully date-based automation
  - **Step O (NEW):** **Enhanced EventCard layout system:**
    - Responsive grid alignment ensuring perfect row alignment on desktop
    - Natural mobile stacking without artificial constraints
    - Date/time separation on individual lines for better readability
    - Consistent Register button alignment across cards in same row
    - Image-free variant with optimized left-alignment

**🎯 NEXT IMMEDIATE STEP:** Phase 5 - Email Automation & Make.com Integration

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

**❗ Key Learning:** Without `baseUrl`, you get "is not a module" errors. All imports use `@/lib/...` pattern.

### **Redis API Routes Configuration (CRITICAL)**

**🚨 ESSENTIAL: Every API route that uses Redis MUST include this as the first export:**

```typescript
export const runtime = 'nodejs' // Required for Redis client
```

**Why:** The `redis` npm package uses Node.js APIs that aren't available in the Edge runtime. Without this, routes will work locally but fail in production with "module not found" errors.

### **Environment Variables (PRODUCTION)**

**Required in Vercel:**
```env
REDIS_URL=redis://default:password@host:port  # Auto-set by Vercel Storage
NEXTAUTH_SECRET=your_generated_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
```

**Required in `.env.local`:**
```env
# Redis Cloud (copy from Vercel environment variables)
REDIS_URL=redis://default:password@host:port

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_here

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_chosen_password_here
```

### **Browser Extension Hydration Warnings**

If you see hydration mismatch errors in development, they're likely caused by browser extensions (Grammarly, password managers, etc.). Solution: Add `suppressHydrationWarning` to both `<html>` and `<body>` tags in `layout.tsx`.

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
│   ├── api/
│   │   ├── test-db/
│   │   │   └── route.ts         # ✅ Database connection test endpoint
│   │   ├── test-auth/
│   │   │   └── route.ts         # ✅ Authentication test endpoint
│   │   └── events/              # ✅ COMPLETE: Main events API with archive support
│   │       ├── route.ts         # ✅ GET/POST endpoints (supports ?archived=true)
│   │       └── [id]/
│   │           └── route.ts     # ✅ GET/PUT/DELETE for individual events
│   ├── admin/                   # ✅ NEW: Complete admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx         # ✅ Admin login interface
│   │   └── page.tsx             # ✅ Protected admin dashboard with archive tabs
│   ├── test-events/
│   │   └── page.tsx             # ✅ Database testing interface
│   ├── globals.css              # 🎨 CRITICAL: McCall branding CSS variables
│   ├── layout.tsx               # ✅ Root layout with hydration warning suppression
│   └── page.tsx                 # ✅ UPDATED: API-driven, shows active events only
├── components/
│   ├── ui/
│   │   ├── button.tsx           # Base button component
│   │   ├── card.tsx             # Base card components
│   │   ├── logo-header.tsx      # ✅ Reusable McCall Logo component
│   │   └── language-toggle.tsx  # ✅ Interactive, responsive language toggle
│   ├── event-card.tsx           # ✅ ENHANCED: Responsive grid alignment system
│   └── training-filter.tsx      # MHFA/QPR/All filter buttons
└── lib/
    ├── db/                      # ✅ Database layer
    │   ├── redis-client.ts      # ✅ Type-safe Redis client with CRUD operations
    │   └── seed.ts              # ✅ Database seeding utilities
    ├── constants.ts             # ✅ Centralized configuration
    ├── types.ts                 # ✅ Defines the shape of Event data (w/ language)
    ├── utils.ts                 # ✅ ENHANCED: Archive utilities + responsive card helpers
    ├── sample-data.ts           # ✅ DEPRECATED: Use sample-data-generator.ts
    ├── sample-data-generator.ts # ✅ Dynamic sample data generation
    ├── hooks/
    │   └── useEventFilter.ts    # ✅ Reusable filtering logic
    └── i18n/
        ├── translations.ts      # ✅ Centralized translations
        └── useTranslation.ts    # ✅ Translation hook
```

### **🗄️ Database Layer**

**Database Client (`lib/db/redis-client.ts`):**
- Singleton Redis connection pattern for efficiency
- Type-safe operations using `RedisClientType`
- Full CRUD operations: `getAllEvents()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- Auto-seeding functionality for development
- Production-ready error handling

**Key Functions Available:**
```typescript
// READ operations
EventDatabase.getAllEvents(): Promise<Event[]>
EventDatabase.getEventById(id: string): Promise<Event | null>

// WRITE operations  
EventDatabase.createEvent(data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>
EventDatabase.updateEvent(id: string, updates: Partial<Event>): Promise<Event | null>
EventDatabase.deleteEvent(id: string): Promise<boolean>

// UTILITY operations
EventDatabase.seedDatabase(initialEvents: Event[]): Promise<void>
```

### **🗃️ Archive System (NEW)**

**Automatic Archiving Logic:**
Events are automatically considered "archived" when their date has passed. The archive determination happens at the API level using date comparison:

```typescript
// lib/utils.ts - Archive Logic
export function isEventArchived(eventDate: string): boolean {
  const today = new Date()
  const event = new Date(eventDate + 'T23:59:59') // End of event day
  
  // Reset today to start of day for fair comparison
  today.setHours(0, 0, 0, 0)
  
  return event < today
}
```

**API Endpoints with Archive Support:**
```typescript
// Active events only (default behavior)
GET /api/events

// Archived events only
GET /api/events?archived=true  

// All events (active + archived)
GET /api/events?includeArchived=true
```

**Archive Utility Functions:**
```typescript
// Filter events by archive status
filterEventsByArchiveStatus(events: Event[], showArchived: boolean): Event[]

// Get counts for both active and archived events
getEventCounts(events: Event[]): {
  active: { total: number, MHFA: number, QPR: number },
  archived: { total: number, MHFA: number, QPR: number }
}
```

### **🎨 Enhanced EventCard Component (NEW)**

**Responsive Grid Alignment System:**
The EventCard component now features a sophisticated responsive system that ensures perfect alignment in grid layouts while maintaining natural spacing on mobile.

```typescript
// components/event-card.tsx - Key Responsive Classes
className="w-full lg:h-full lg:flex lg:flex-col"      // Grid behavior on large screens
className="pb-3 lg:flex-1"                           // Content area expansion  
className="text-xl text-mccall-navy mb-4 lg:h-[3rem] lg:flex lg:items-start" // Fixed title height
```

**Layout Features:**
- **Desktop (lg: 1024px+):** Fixed heights for perfect row alignment
- **Mobile/Tablet (< 1024px):** Natural content-based heights
- **Date/Time Separation:** Date and time display on separate lines
- **Icon Alignment:** Clock and MapPin icons perfectly aligned
- **Button Alignment:** Register buttons align across all cards in same row

**Breakpoint Strategy:**
- Uses `lg:` (1024px) breakpoint to match when 3-column grids appear
- Avoids artificial constraints on medium-width desktop windows
- Ensures natural mobile stacking behavior

### **🔐 Admin Dashboard System (NEW)**

**Authentication (`app/admin/login/page.tsx`):**
- Simple credential-based authentication
- Session management with redirect handling
- Protected route middleware

**Dashboard Interface (`app/admin/page.tsx`):**
- **Active Events Tab:** Shows upcoming events with full CRUD operations
- **Archived Events Tab:** Shows past events in read-only mode
- **Statistics Display:** Event counts for both active and archived categories
- **Grid Layout:** Uses same responsive card system as frontend
- **Training Type Filtering:** Works within both Active and Archived views

**Admin-Only Features:**
- Event creation, editing, and deletion
- Toggle between Active/Archived views
- Access to historical event data
- Real-time event statistics

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
  language: Language;
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

**✅ ENHANCED** - Now includes archive management and responsive card utilities:

```typescript
// Archive Management
isEventArchived(eventDate: string): boolean
filterEventsByArchiveStatus(events: Event[], showArchived: boolean): Event[]
getEventCounts(events: Event[]): { active: {...}, archived: {...} }

// Date Formatting (Timezone-Safe)
formatDate(dateString: string): string
formatTimeRange(startTime: string, endTime: string): string
parseLocalDate(dateString: string): Date

// Event Processing
enrichEventForDisplay(event: Event): EventDisplay
sortEventsByDate(events: Event[], ascending: boolean): Event[]
generatePrefillUrl(event: Event): string
```

### **🌐 i18n Translation System**

**✅ COMPLETE** - Professional translation system replacing inline ternary operators.

```typescript
// Usage in components:
import { useTranslation } from '@/lib/i18n/useTranslation';

const { t } = useTranslation(currentLanguage);
<h1>{t('hero.title')}</h1>
```

### **🎯 Custom Hooks**

**✅ useEventFilter Hook** - Encapsulates all filtering logic with useful computed properties:

```typescript
const {
  currentLanguage,
  activeFilter,
  setCurrentLanguage,
  setActiveFilter,
  filteredEvents,
  eventCounts,        // { all: 10, MHFA: 6, QPR: 4 }
  upcomingEventCounts,
  hasEvents,
  hasUpcomingEvents
} = useEventFilter(events); // Now accepts events from API
```

-----

## 🚨 Important Development Choices & Learnings

### **1. The Core Filtering Logic (The Fix)**

The central challenge was displaying events correctly based on two criteria. The solution in `app/page.tsx` is a **chained filter**, which is the most important piece of logic on the page.

```typescript
const filteredEvents = events // Now from API, not sample data
  .filter(event => event.language === currentLanguage) // 1. Filter by language FIRST
  .filter(event => activeFilter === "all" || event.trainingType === activeFilter); // 2. Then filter by type
```

### **2. Bilingual Support Architecture**

  - **Data:** The `language: "en" | "es"` property on the `Event` type is the foundation.
  - **Utils:** Functions in `lib/utils.ts` accept a `language` parameter for correct formatting.
  - **UI:** Now uses centralized translation system via `useTranslation` hook.

### **3. Brand as a Theme via CSS Variables**

  - All McCall brand colors are defined as CSS custom properties (variables) in `app/globals.css`.
  - Tailwind configuration (`tailwind.config.js`) is extended to recognize these variables (e.g., `bg-mccall-navy`).
  - Constants are now also available in `lib/constants.ts` for JavaScript usage.

### **4. Component Organization**

  - **`components/ui/`** is for generic, reusable primitives (e.g., a button, a logo).
  - **`components/`** is for specific, composite components that solve an app problem (e.g., an event card).
  - **`lib/hooks/`** contains custom React hooks for reusable logic.
  - **`lib/i18n/`** contains all internationalization/translation files.
  - **`lib/db/`** contains all database-related functionality.

### **5. HTML Semantics & Hydration Errors**

  - React hydration errors from browser extensions are suppressed with `suppressHydrationWarning` on both `<html>` and `<body>` tags.
  - Previous hydration error in `event-card.tsx` was fixed by replacing invalid `<p>` tag nesting.

### **6. Architecture Refactoring**

  - **Type Safety:** Fixed critical type duplication bug where `utils.ts` contained full copy of all types.
  - **Maintainability:** Sample data reduced from 600+ lines to ~100 lines with generator function.
  - **Scalability:** All constants, translations, and reusable logic extracted to dedicated modules.
  - **Import Pattern:** All imports now use `@/lib/...` pattern for consistency and reliability.

### **7. Database Architecture**

  - **Redis Cloud Choice:** Selected over Upstash or old Vercel KV for better reliability and performance.
  - **Singleton Pattern:** Database connection reuses single client instance for efficiency.
  - **Type Safety:** Full TypeScript integration with `RedisClientType` from `redis` package.
  - **Error Handling:** Comprehensive try/catch blocks with fallback behaviors.
  - **Production Ready:** Proper runtime configuration prevents deployment failures.

### **8. Critical Timezone Handling**

  - **JavaScript Date Parsing Bug:** `new Date("2025-06-05")` parses as UTC midnight, then converts to local timezone
  - **Solution Implemented:** `parseLocalDate()` helper function parses YYYY-MM-DD strings as local time
  - **Functions Fixed:** `formatDate()`, `isEventUpcoming()`, `sortEventsByDate()` all use local time parsing
  - **Impact:** Prevents off-by-one-day errors between database dates and frontend display
  - **Pattern:** Always use `parseLocalDate(dateString)` instead of `new Date(dateString)` for YYYY-MM-DD dates

### **9. Archive System Design (NEW)**

  - **Date-Based Logic:** Archive status determined by date comparison, not database flags
  - **API-Level Filtering:** Archive filtering happens at the API endpoint level for efficiency
  - **No Manual Archiving:** Events automatically archive when their date passes (11:59 PM)
  - **Backwards Compatible:** Existing events work seamlessly with archive system
  - **Admin Access:** Admins retain full access to archived events for historical reference

### **10. Responsive Card Layout Strategy (NEW)**

  - **Breakpoint Selection:** Uses `lg:` (1024px) to match when 3-column grids actually appear
  - **Mobile-First:** Natural content heights on mobile prevent artificial spacing constraints
  - **Grid Alignment:** Perfect row alignment on desktop while maintaining accessibility
  - **Performance Optimized:** CSS-only solution with no JavaScript layout calculations
  - **Future-Proof:** Responsive system scales well with design system changes

-----

## 🧠 Notes for AI Coding Assistance

### **Critical Information for AI Assistants**

**If your training data cutoff is before January 31, 2025, you may have outdated information about:**

#### **1. Vercel Database Options (MAJOR CONFUSION SOURCE)**

**❌ OUTDATED (Pre-2025):**
- Vercel KV was a direct Vercel service
- Used `@vercel/kv` package with `KV_REST_API_URL` and `KV_REST_API_TOKEN`
- Setup through Vercel Storage tab with "KV" option

**✅ CURRENT (2025):**
- Vercel Storage now uses **Redis Cloud** as the provider
- Uses standard `redis` package with single `REDIS_URL` environment variable
- Setup through Vercel Storage → "Create Database" → "Redis" (powered by Redis Cloud)
- **30MB free tier** (not the 25MB often mentioned in older guides)

#### **2. API Routes Runtime Configuration**

**❌ OUTDATED:** 
- API routes automatically work with all packages
- Edge runtime is sufficient for most use cases

**✅ CURRENT REQUIREMENT:**
- Any API route using `redis` package **MUST** include: `export const runtime = 'nodejs'`
- This must be the **first export** in the file
- Without this, routes work locally but fail in production with "module not found" errors
- This is due to Redis requiring Node.js APIs not available in Edge runtime

#### **3. Redis Client Patterns**

**❌ OUTDATED:**
- Using `any` types for Redis clients
- Direct connection in each function
- REST-based clients for Vercel deployments

**✅ CURRENT BEST PRACTICE:**
- Import `RedisClientType` from `redis` for proper typing
- Singleton connection pattern to reuse client instance
- Standard Redis protocol (TCP) not REST
- Proper connection management with error handlers

#### **4. Package Dependencies**

**❌ OUTDATED GUIDES SUGGEST:**
```bash
npm install @vercel/kv        # Wrong for current setup
npm install @upstash/redis    # Wrong for Redis Cloud
```

**✅ CORRECT FOR REDIS CLOUD:**
```bash
npm install redis             # Standard Redis client
npm install next-auth         # For authentication
npm install --save-dev @types/node @types/next-auth
```

#### **5. Environment Variable Patterns**

**❌ OUTDATED:**
```env
KV_REST_API_URL=...           # Old Vercel KV
KV_REST_API_TOKEN=...
UPSTASH_REDIS_REST_URL=...    # Upstash specific
UPSTASH_REDIS_REST_TOKEN=...
```

**✅ CURRENT:**
```env
REDIS_URL=redis://default:password@host:port  # Single Redis Cloud URL
```

### **Key Debugging Hints:**

1. **"Module not found" errors in production:** Add `export const runtime = 'nodejs'` to API routes
2. **Connection refused locally:** Check that `REDIS_URL` is set in `.env.local`
3. **Works locally, fails in production:** Usually missing runtime configuration
4. **TypeScript errors with Redis:** Use `RedisClientType` instead of `any`
5. **Archive events not filtering:** Check date format (YYYY-MM-DD) and API parameters
6. **Card layout misalignment:** Ensure responsive classes use `lg:` breakpoint, not `md:`

### **Archive System Testing (NEW):**
```javascript
// To test archive system:
// 1. Create event with yesterday's date - should appear in Archived tab
// 2. Create event with tomorrow's date - should appear in Active tab  
// 3. Check frontend - only future events should be visible
// 4. Toggle admin tabs - should see different event sets
```

### **Responsive Layout Testing (NEW):**
```javascript
// To test responsive card alignment:
// 1. Desktop (1024px+): Cards should have equal heights, aligned buttons
// 2. Mobile/Tablet (< 1024px): Cards should have natural heights
// 3. Resize window: Should transition smoothly between behaviors
// 4. Different content lengths: Should maintain alignment in desktop grid
```

### **Reliable Information Sources (as of 2025):**
- Vercel Storage documentation (not older KV docs)
- Redis Cloud official documentation
- Next.js App Router API routes documentation
- This handoff document (maintained current)

-----

## 📋 Next Steps for Development

### **🎯 Phase 5: Email Automation & Make.com Integration (NEXT)**

**✅ FOUNDATION COMPLETE:**
- Database infrastructure and client
- Complete API layer with CRUD operations and archive support
- Frontend integration with API-driven architecture
- Full admin dashboard with authentication and archive management
- Responsive card layout system for optimal user experience

**🔄 UPCOMING TASKS:**
1. **Make.com Scenario Setup:**
   - Create Google Form submission watchers
   - Implement confirmation email triggers
   - Set up reminder email daily checks using existing archive logic
   - Calendar invitation generation for confirmed registrants

2. **Email Template Design:**
   - Bilingual confirmation email templates
   - Event reminder email templates with calendar attachments
   - Branded email styling matching website design
   - Dynamic content insertion from event data

3. **Google Sheets Integration:**
   - Registration data collection from forms
   - Data formatting using existing `formatDateForSheets` utility
   - Backup and export capabilities for admin users
   - Integration with reminder email system

### **📈 Technical Debt & Future Improvements**

1. **Testing:** Add unit tests for archive utilities and responsive layout components
2. **Error Handling:** Implement proper error boundaries for admin dashboard
3. **Performance:** Consider implementing ISR for event pages with archive support
4. **Accessibility:** Conduct full accessibility audit on admin dashboard
5. **SEO:** Add proper meta tags and structured data for events
6. **Monitoring:** Add logging for archive operations and admin actions

### **🚀 Potential Feature Enhancements**

1. **Advanced Archive Management:**
   - Bulk archive operations for admin users
   - Archive date range filtering (e.g., "Events from last month")
   - Export archived events to CSV/PDF
   - Archive statistics and reporting

2. **Enhanced Admin Features:**
   - Event duplication functionality
   - Bulk import/export capabilities
   - Event recurrence for repeating trainings
   - Enhanced form validation and preview functionality

3. **User Experience Improvements:**
   - Real-time event notifications
   - Advanced filtering options (date ranges, location)
   - Event search functionality
   - Mobile-optimized admin interface

-----

## 🎉 Current Status Summary

The codebase has been successfully completed through Phase 4 with:
- ✅ Clean architecture maintained and enhanced
- ✅ Type safety throughout entire stack
- ✅ Production-ready database layer with verified CRUD operations
- ✅ Complete API layer with archive filtering support
- ✅ Fully API-driven frontend with automatic archive handling
- ✅ Complete admin dashboard with authentication and archive management
- ✅ Automatic event archiving system based on event dates
- ✅ Advanced responsive card layout system for optimal grid alignment
- ✅ Real-time database manipulation confirmed working across all interfaces
- ✅ Critical timezone parsing bug resolved
- ✅ Date consistency achieved across all interfaces
- ✅ Professional i18n system implemented
- ✅ Centralized configuration and reusable patterns
- ✅ Zero TypeScript or ESLint errors
- ✅ Browser extension compatibility maintained
- ✅ Scalable database patterns established
- ✅ Next.js 15 compatibility ensured
- ✅ Mobile-first responsive design with desktop grid optimization

**The application is now production-ready with a complete event management system featuring automatic archiving, full admin controls, and optimized user experience across all devices. Ready for email automation integration!**