# 🚀 MHFA Event Registration Platform - Development Handoff Document

## 🧩 Project Scope & Goals

### 🎯 Primary Goal
Build a low-maintenance, low-cost website that can:
- Display upcoming MHFA events
- Let users register via prefilled Google Forms
- Automatically send confirmation and reminder emails
- Give admins easy control over events and messaging
- Run entirely on free-tier services (Vercel, Make, Google)

## 🏗️ Architecture Overview

### 1. 🖥️ Frontend – Public Event Listing Site
- **Stack:** Next.js 15.3.4 (App Router) + Tailwind CSS v3 + TypeScript, deployed on Vercel
- **MVP Features:** Event cards showing date, time, location, title + Register button
- **Performance:** ISR with 60-second revalidation for sub-50ms TTFB
- **Accessibility:** Focus-trapped modals or new-tab opening (mobile-friendly)

### 2. 🔐 Backend – Admin Dashboard
- **Stack:** Next.js API routes (Supabase optional for later)
- **Features:** Auth-protected /admin page with full event CRUD
- **Data Model:** Immutable Event ID, Title, Date, Time, Location, Google Form links
- **Enhancement:** Timezone handling simplified for MVP

### 3. 📄 Prefilled Form Links
- **Validation:** URL-encode values and fetch() test for 200/302 response
- **Real Example Pattern:** `entry.1753222212` (date), `entry.679525213` (location)
- **Future:** Auto-create forms from template via Google API

### 4. 📩 Email Automation – Make Scenarios
- **Platform:** Make.com (free tier: 1,000 ops/month, 15-min scheduling)
- **Confirmation:** Triggered by new form submission, idempotent with Run ID
- **Reminder:** Daily 08:00 check for tomorrow's events, batch process up to 10,000 rows
- **Calendar:** Generate .ics attachments for "Add to calendar" functionality

### 5. 🗄️ Data Storage
- **Google Sheets:** Timestamp, Name, Email, Event ID, Event Date, Confirmation Sent, Reminder Sent
- **Backups:** Weekly CSV exports to Google Drive/GitHub

---

## ✅ CURRENT STATUS: Phase 2 - Event Display System Complete

### 🏆 **Major Milestone: Working Event Registration Flow**

**✅ COMPLETED Phase 1 & 2:**
- **Step A:** ✅ Accessible button component with variants
- **Step B:** ✅ Card component system 
- **Step C:** ✅ Complete type system with Event interface
- **Step C+:** ✅ All TypeScript compilation and ESLint errors resolved
- **Step D:** ✅ Sample events with real Google Forms patterns
- **Step E:** ✅ EventCard component displaying all event data
- **Step F:** ✅ Working registration links with proper URL encoding

**🎯 NEXT IMMEDIATE STEP:** Phase 3 - Admin Dashboard & API Routes

---

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

**❗ Key Learning:** Without `baseUrl`, you get "is not a module" errors when importing from `@/lib/*`

### **Build Process Status**
- **✅ Clean TypeScript compilation:** `npm run build` passes with no errors
- **✅ All ESLint rules satisfied:** No unused variables or empty interfaces
- **✅ Production-ready:** Static build optimized at ~101kB first load

### **Development Commands**
```bash
# Start development server (with hot reload)
npm run dev          # → http://localhost:3000

# Production build (tests TypeScript/ESLint)
npm run build        # → Clean build: ✓ Compiled successfully

# Lint check
npm run lint

# Git workflow
git add .
git commit -m "feat: your message"
git push origin main
```

---

## 📁 Critical File Structure & Key Components

### **🔧 Core Configuration Files**
```
📁 mhfa-registration/
├── tsconfig.json           # ⚠️  MUST have baseUrl: "."
├── tailwind.config.js      # Tailwind v3 config with shadcn/ui colors
├── app/
│   ├── globals.css         # Complete CSS custom properties
│   ├── layout.tsx          # Layout with hydration warning suppression
│   └── page.tsx            # ✅ Working event listing page
├── components/
│   ├── ui/                 # Generic reusable components (shadcn/ui)
│   │   ├── button.tsx      # ✅ Accessible button with variants
│   │   └── card.tsx        # ✅ Card system components
│   └── event-card.tsx      # ✅ MHFA event display component
└── lib/
    ├── types.ts            # ✅ Complete type system
    ├── utils.ts            # ✅ All utility functions
    └── sample-data.ts      # ✅ Sample MHFA events
```

### **🧩 Type System (lib/types.ts)**
**✅ COMPLETE** - Ready for immediate use:

```typescript
// Core Event interface with immutable ID design
interface Event {
  id: string;                 // UUID - never changes once created
  title: string;
  date: string;               // YYYY-MM-DD format for Google Forms
  time: string;               // HH:MM format (24-hour)
  location: string;           // Human-readable → converts to proper encoding
  googleFormBaseUrl: string;  // Base form URL
  dateEntryId: string;        // e.g., "entry.1753222212" 
  locationEntryId: string;    // e.g., "entry.679525213"
  isActive: boolean;
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
  timeZone?: string;          // Optional (simplified for MVP)
}
```

### **⚙️ Utility Functions (lib/utils.ts)**
**✅ COMPLETE** - All type-safe and tested:

```typescript
// Key functions ready for immediate use:
- cn()                      // Tailwind class merging
- formatDate()              // "Monday, July 15, 2025"
- formatTime()              // "2:30 PM" 
- generatePrefillUrl()      // ✅ FIXED: Uses %20 for spaces, not +
- isEventUpcoming()         // Date validation (simplified, no timezone)
- enrichEventForDisplay()   // Event → EventDisplay conversion
- generateEventId()         // Unique event IDs
- validateGoogleFormUrl()   // URL validation (basic + fetch methods)
```

### **🎨 UI Components**

#### **Generic UI Components (components/ui/)**
```typescript
// components/ui/button.tsx - Full variant system
<Button variant="default|outline|secondary|destructive|ghost|link" 
        size="default|sm|lg|icon" />

// components/ui/card.tsx - Complete card system  
<Card>
  <CardHeader>
    <CardTitle />
    <CardDescription />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

#### **App-Specific Components (components/)**
```typescript
// components/event-card.tsx - MHFA event display
<EventCard event={event} />
// Displays: Title, formatted date/time, location
// Register button opens prefilled Google Form in new tab
```

### **📄 Working Pages**

#### **Home Page (app/page.tsx)**
**✅ COMPLETE** - Displays all MHFA events with:
- Clean header and description
- Grid layout of EventCards
- Working registration links
- Debug logging for development

---

## 🎯 Google Forms Integration Pattern (WORKING)

**✅ Fixed URL Structure (spaces encoded as %20):**
```
https://docs.google.com/forms/d/e/1FAIpQLSfw3r099XjHo2bHbydU-TQbgByD-giErYmzSRzhioaJfGxuKQ/viewform?usp=pp_url&entry.1753222212=2025-07-03&entry.679525213=Torrington%20Behavioral%20Health%20District
```

**🔑 Critical Implementation Details:**
- **Date format:** YYYY-MM-DD (e.g., `2025-07-03`)
- **Location format:** Spaces encoded as `%20` (NOT `+` to avoid display issues)
- **Entry IDs:** `entry.1753222212` (date), `entry.679525213` (location)
- **URL Generation:** `generatePrefillUrl()` handles encoding correctly

**⚠️ Key Fix Applied:**
```typescript
// In generatePrefillUrl() - fixes space encoding issue
const paramString = params.toString().replace(/\+/g, '%20');
```

---

## 🚨 Important Development Choices & Learnings

### **1. Component Organization**
- **`components/ui/`** = Generic, reusable UI primitives (from shadcn/ui)
- **`components/`** = App-specific components using UI primitives
- **Don't put app components in ui folder!**

### **2. ESLint Configuration Decisions**
```typescript
// ✅ LEARNED: Handle unused variables properly
catch (error) { ... }           // ❌ ESLint error: unused var
catch { ... }                   // ✅ SOLUTION: Remove unused error var
```

### **3. Tailwind CSS Version Choice**
- **✅ Using Tailwind v3.4.0** (downgraded from v4 alpha for stability)
- **✅ shadcn/ui compatible** CSS custom properties configured
- **✅ Dark mode support** included but not yet implemented

### **4. TypeScript Import Strategy**
```typescript
// ✅ WORKING: All imports use @/ aliases
import { Event } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { EventCard } from "@/components/event-card"  // NOT @/components/ui/event-card
```

### **5. Event Data Simplification for MVP**
- **Timezone handling:** Removed from `isEventUpcoming()` to avoid complexity
- **Event IDs:** Simple readable format for debugging (e.g., `event_2025_07_15_adult_cert`)
- **Sample data:** 3 realistic MHFA events with varying dates/locations

---

## 📋 Next Steps for Development

### **🎯 Phase 3: Admin Dashboard (NEXT)**

**Implementation Plan:**
1. **Authentication Setup**
   - Create `/app/admin/page.tsx` with basic auth
   - Use NextAuth.js or simple password protection for MVP
   
2. **Event Management UI**
   - List all events with edit/delete buttons
   - Form for creating new events
   - Toggle active/inactive status
   
3. **API Routes**
   - `/api/events` - GET all events
   - `/api/events` - POST new event
   - `/api/events/[id]` - PUT/DELETE specific event
   
4. **Data Persistence**
   - Start with JSON file storage for MVP
   - Later migrate to Google Sheets API

### **🎯 Phase 4: Email Automation**
- Set up Make.com scenarios
- Connect to Google Forms responses
- Implement confirmation emails
- Add reminder emails

---

## 🏁 Success Metrics for MVP

**Phase 1: ✅ COMPLETE - Foundation**
- [x] TypeScript compilation working
- [x] All ESLint errors resolved  
- [x] Accessible UI components ready
- [x] Type-safe utility functions
- [x] Clean production builds

**Phase 2: ✅ COMPLETE - Event Display**
- [x] Sample events with real Google Forms URLs
- [x] Event listing page with sample data
- [x] URL encoding fixed for proper form prefilling
- [x] Register buttons opening forms in new tabs
- [x] Professional MHFA-branded UI

**Phase 3: ⏳ UPCOMING - Admin Features**
- [ ] Admin authentication
- [ ] Event CRUD operations
- [ ] API endpoints
- [ ] Data persistence

**Phase 4: ⏳ UPCOMING - Automation**
- [ ] Google Sheets integration
- [ ] Make.com email automation
- [ ] Calendar attachments

---

## 💡 Quick Start for New Developer

**1. Clone & Setup:**
```bash
cd C:\Users\[your-username]\mhfa-registration
npm install
npm run dev     # Visit http://localhost:3000
```

**2. Test Current Functionality:**
- View the event listing page
- Click "Register for Event" buttons
- Verify Google Forms open with prefilled data

**3. Key Files to Understand:**
- `lib/types.ts` - Event interface and type system
- `lib/utils.ts` - Look at `generatePrefillUrl()` for URL handling
- `components/event-card.tsx` - How events are displayed
- `app/page.tsx` - Main event listing implementation

**4. Start Phase 3:**
Create `/app/admin/page.tsx` and begin building the admin dashboard.

---

## 🔑 Key Takeaways for Handoff

1. **TypeScript is fully configured** - Don't change tsconfig.json baseUrl
2. **URL encoding is handled** - Spaces must be %20, not + for Google Forms
3. **Component structure is established** - Keep ui/ generic, app components outside
4. **Sample data works end-to-end** - Test the full flow before making changes
5. **Build passes all checks** - Maintain clean builds with each change

The foundation is rock-solid. Time to build the admin features! 🚀