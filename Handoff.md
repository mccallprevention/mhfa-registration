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

## ✅ CURRENT STATUS: Phase 2 Complete + Architecture Refactor

### 🏆 **Major Milestones Achieved:**

1. **Interactive Bilingual Event Filtering** - The public-facing front-end is feature-complete.
2. **Architecture Refactoring** - Codebase has been refactored for maintainability and scalability.

**✅ COMPLETED:**

  - **Step A:** Foundational, accessible UI components (`Button`, `Card`).
  - **Step B:** Full branding and theming to match McCall's guidelines.
  - **Step C:** Reusable, polished brand components (`LogoHeader`, `LanguageToggle`).
  - **Step D:** Expanded `Event` type system to support multiple training types and languages.
  - **Step E:** Full bilingual support, with distinct English and Spanish events and UI text.
  - **Step F:** **Core filtering logic implemented:** Events are now correctly filtered first by language, then by training type.
  - **Step G:** All known TypeScript, ESLint, and React Hydration errors have been resolved.
  - **Step H (NEW):** **Architecture refactoring completed:**
    - Fixed critical type duplication issue
    - Implemented proper i18n translation system
    - Extracted all constants and configuration
    - Created reusable custom hooks
    - Reduced sample data file from 600+ to ~100 lines

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

**❗ Key Learning:** Without `baseUrl`, you get "is not a module" errors. All imports use `@/lib/...` pattern.

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
│   ├── globals.css         # 🎨 CRITICAL: McCall branding CSS variables
│   ├── layout.tsx          # ✅ Root layout with hydration warning suppression
│   └── page.tsx            # 🧠 The "brain": manages state & filtering
├── components/
│   ├── ui/
│   │   ├── button.tsx          # Base button component
│   │   ├── card.tsx            # Base card components
│   │   ├── logo-header.tsx     # ✅ Reusable McCall Logo component
│   │   └── language-toggle.tsx # ✅ Interactive, responsive language toggle
│   ├── event-card.tsx      # Displays a single event card
│   └── training-filter.tsx # MHFA/QPR/All filter buttons
└── lib/
    ├── constants.ts        # ✅ NEW: Centralized configuration
    ├── types.ts            # ✅ Defines the shape of Event data (w/ language)
    ├── utils.ts            # ✅ Language-aware utility functions (FIXED)
    ├── sample-data.ts      # ✅ DEPRECATED: Use sample-data-generator.ts
    ├── sample-data-generator.ts # ✅ NEW: Dynamic sample data generation
    ├── hooks/
    │   └── useEventFilter.ts    # ✅ NEW: Reusable filtering logic
    └── i18n/
        ├── translations.ts      # ✅ NEW: Centralized translations
        └── useTranslation.ts    # ✅ NEW: Translation hook
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

### **🌐 i18n Translation System (NEW)**

**✅ COMPLETE** - Professional translation system replacing inline ternary operators.

```typescript
// Usage in components:
import { useTranslation } from '@/lib/i18n/useTranslation';

const { t } = useTranslation(currentLanguage);
<h1>{t('hero.title')}</h1>
```

### **🎯 Custom Hooks (NEW)**

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
} = useEventFilter(sampleEvents);
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

### **5. HTML Semantics & Hydration Errors**

  - React hydration errors from browser extensions are suppressed with `suppressHydrationWarning` on both `<html>` and `<body>` tags.
  - Previous hydration error in `event-card.tsx` was fixed by replacing invalid `<p>` tag nesting.

### **6. Architecture Refactoring (NEW)**

  - **Type Safety:** Fixed critical type duplication bug where `utils.ts` contained full copy of all types.
  - **Maintainability:** Sample data reduced from 600+ lines to ~100 lines with generator function.
  - **Scalability:** All constants, translations, and reusable logic extracted to dedicated modules.
  - **Import Pattern:** All imports now use `@/lib/...` pattern for consistency and reliability.

-----

## 📋 Next Steps for Development

### **🎯 Phase 3: Admin Dashboard (NEXT)**

The codebase is now properly structured for building the backend and admin interface:

1. **Authentication Setup:** 
   - Create and protect an `/admin` route
   - Consider using NextAuth.js or Clerk for authentication

2. **API Routes:** 
   - Build `/api/events` for GET, POST, PUT, DELETE
   - Leverage existing types and utilities from refactoring

3. **Data Persistence:** 
   - Move from `sample-data-generator.ts` to real database
   - Consider Vercel KV, Supabase, or Google Sheets as backend

4. **Event Management UI:** 
   - Build admin UI using existing components
   - Utilize `useEventFilter` hook for admin event viewing
   - Reuse form validation from `createEventFromForm` utility

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

## 🎉 Ready for Phase 3!

The codebase has been successfully refactored with:
- ✅ Clean architecture
- ✅ Type safety throughout
- ✅ Reusable utilities and hooks
- ✅ Professional i18n system
- ✅ Centralized configuration
- ✅ No TypeScript or ESLint errors
- ✅ Browser extension compatibility

The foundation is solid and ready for the admin dashboard implementation!