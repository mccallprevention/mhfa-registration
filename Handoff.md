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

*Last Updated: June 26, 2025*

## 🧩 Project Scope & Goals

### 🎯 Primary Goal

Build a low-maintenance, low-cost, bilingual website that can:

  - Display upcoming **MHFA** and **QPR** events in both English and Spanish.
  - Let users register via language-specific, prefilled Google Forms.
  - Automatically send confirmation and reminder emails (future phase).
  - Give admins easy control over events and messaging (future phase).
  - Run entirely on free-tier services (Vercel, Redis Cloud, Make, Google).

## 🏗️ Architecture Overview

### 1\. 🖥️ Frontend – Public Event Listing Site

  - **Stack:** Next.js (App Router) + Tailwind CSS v3 + TypeScript, deployed on Vercel.
  - **Current Features:** A fully branded, bilingual, and responsive UI. Includes dynamic event filtering by language (EN/ES) and training type (MHFA/QPR).
  - **Performance:** Designed for fast loads, with future potential for ISR (Incremental Static Regeneration) on Vercel.

### 2\. 🔐 Backend – Admin Dashboard (In Progress)

  - **Stack:** Next.js API routes with Redis Cloud database.
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

### 5\. 🗄️ Data Storage (**IMPLEMENTED**)

  - **Events Database:** **Redis Cloud** via Vercel Storage (30MB free tier).
  - **Connection:** Standard Redis protocol via `REDIS_URL` environment variable.
  - **Client:** Uses `redis` npm package with `RedisClientType` for type safety.
  - **Registrations:** Google Sheets will be the database for user registrations (future phase).
  - **Backups:** Plan includes weekly CSV exports of registration data.

-----

## ✅ CURRENT STATUS: Phase 3 In Progress - Database Layer Complete

### 🏆 **Major Milestones Achieved:**

1. **Interactive Bilingual Event Filtering** - The public-facing front-end is feature-complete.
2. **Architecture Refactoring** - Codebase has been refactored for maintainability and scalability.
3. **Database Infrastructure** - Redis Cloud database deployed and connected.
4. **API Foundation** - Database client implemented with full CRUD operations.

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
  - **Step I (NEW):** **Database infrastructure implemented:**
    - Redis Cloud database via Vercel Storage (30MB free)
    - Type-safe database client with singleton connection pattern
    - Full CRUD operations for events
    - Database seeding functionality
    - Production-ready API routes with proper runtime configuration

**🎯 NEXT IMMEDIATE STEP:** Complete Phase 3 - API Routes & Admin Authentication

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
│   │   │   └── route.ts         # ✅ NEW: Database connection test endpoint
│   │   └── events/              # 🔄 IN PROGRESS: Main events API
│   │       ├── route.ts         # GET/POST endpoints for events
│   │       └── [id]/
│   │           └── route.ts     # GET/PUT/DELETE for individual events
│   ├── globals.css              # 🎨 CRITICAL: McCall branding CSS variables
│   ├── layout.tsx               # ✅ Root layout with hydration warning suppression
│   └── page.tsx                 # 🧠 The "brain": manages state & filtering
├── components/
│   ├── ui/
│   │   ├── button.tsx           # Base button component
│   │   ├── card.tsx             # Base card components
│   │   ├── logo-header.tsx      # ✅ Reusable McCall Logo component
│   │   └── language-toggle.tsx  # ✅ Interactive, responsive language toggle
│   ├── event-card.tsx           # Displays a single event card
│   └── training-filter.tsx      # MHFA/QPR/All filter buttons
└── lib/
    ├── db/                      # ✅ NEW: Database layer
    │   ├── redis-client.ts      # ✅ NEW: Type-safe Redis client with CRUD operations
    │   └── seed.ts              # ✅ NEW: Database seeding utilities
    ├── constants.ts             # ✅ Centralized configuration
    ├── types.ts                 # ✅ Defines the shape of Event data (w/ language)
    ├── utils.ts                 # ✅ Language-aware utility functions (FIXED)
    ├── sample-data.ts           # ✅ DEPRECATED: Use sample-data-generator.ts
    ├── sample-data-generator.ts # ✅ Dynamic sample data generation
    ├── hooks/
    │   └── useEventFilter.ts    # ✅ Reusable filtering logic
    └── i18n/
        ├── translations.ts      # ✅ Centralized translations
        └── useTranslation.ts    # ✅ Translation hook
```

### **🗄️ Database Layer (NEW)**

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

**Database Seeding (`lib/db/seed.ts`):**
- `seedDatabaseIfEmpty()`: Automatically populates database with sample data on first run
- Integrates with existing `generateSampleEvents()` utility
- Safe to run multiple times (checks for existing data)

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

**✅ FIXED** - No longer contains duplicate type definitions. All utilities are type-safe and properly import from `@/lib/types`.

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

### **7. Database Architecture (NEW)**

  - **Redis Cloud Choice:** Selected over Upstash or old Vercel KV for better reliability and performance.
  - **Singleton Pattern:** Database connection reuses single client instance for efficiency.
  - **Type Safety:** Full TypeScript integration with `RedisClientType` from `redis` package.
  - **Error Handling:** Comprehensive try/catch blocks with fallback behaviors.
  - **Production Ready:** Proper runtime configuration prevents deployment failures.

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

### **Reliable Information Sources (as of 2025):**
- Vercel Storage documentation (not older KV docs)
- Redis Cloud official documentation
- Next.js App Router API routes documentation
- This handoff document (maintained current)

-----

## 📋 Next Steps for Development

### **🎯 Phase 3: Admin Dashboard (IN PROGRESS)**

**✅ COMPLETED:**
- Database infrastructure and client
- Test endpoints and connection verification
- Production deployment with proper configuration

**🔄 CURRENT TASKS:**
1. **API Routes Implementation:**
   - Complete `/api/events` GET/POST endpoints
   - Complete `/api/events/[id]` GET/PUT/DELETE endpoints
   - Add proper validation and error handling

2. **Frontend API Integration:**
   - Update main page to fetch from `/api/events` instead of sample data
   - Add loading states and error handling
   - Test auto-seeding functionality

3. **Authentication Setup:**
   - Implement NextAuth.js configuration
   - Create and protect `/admin` route
   - Add login/logout functionality

4. **Admin UI Components:**
   - Build event management interface
   - Create forms for adding/editing events
   - Implement delete confirmations

### **🎯 Phase 4: Email Automation**

  - Set up Make.com scenarios to watch for Google Form submissions
  - Use `getEventsNeedingReminders` utility for reminder logic
  - Leverage `formatDateForSheets` for data formatting

### **📈 Technical Debt & Future Improvements**

1. **Testing:** Add unit tests for utilities and integration tests for components
2. **Error Handling:** Implement proper error boundaries and logging
3. **Performance:** Consider implementing ISR for event pages
4. **Accessibility:** Conduct full accessibility audit
5. **SEO:** Add proper meta tags and structured data for events

-----

## 🎉 Current Status Summary

The codebase has been successfully evolved through Phase 3 foundation with:
- ✅ Clean architecture maintained
- ✅ Type safety throughout
- ✅ Production-ready database layer
- ✅ Verified Redis Cloud connectivity
- ✅ API foundation implemented
- ✅ Professional i18n system
- ✅ Centralized configuration
- ✅ Zero TypeScript or ESLint errors
- ✅ Browser extension compatibility
- ✅ Scalable database patterns

**The foundation is rock-solid and ready for the final API routes and admin interface implementation!**