import { Event } from "@/lib/types";

// Sample MHFA events using real Google Forms URL patterns
export const sampleEvents: Event[] = [
  {
    id: "event_2025_07_15_adult_cert",
    title: "Mental Health First Aid - Adult Certification",
    date: "2025-07-15",
    time: "09:00",
    location: "Torrington Behavioral Health District",
    googleFormBaseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfw3r099XjHo2bHbydU-TQbgByD-giErYmzSRzhioaJfGxuKQ/viewform",
    dateEntryId: "entry.1753222212",
    locationEntryId: "entry.679525213",
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "event_2025_07_22_youth_cert",
    title: "Youth Mental Health First Aid Training",
    date: "2025-07-22",
    time: "13:00",
    location: "Community Health Center Waterbury",
    googleFormBaseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfw3r099XjHo2bHbydU-TQbgByD-giErYmzSRzhioaJfGxuKQ/viewform",
    dateEntryId: "entry.1753222212",
    locationEntryId: "entry.679525213",
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "event_2025_08_05_virtual_adult",
    title: "Virtual MHFA Adult - Online Session",
    date: "2025-08-05",
    time: "10:00",
    location: "Online via Zoom",
    googleFormBaseUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfw3r099XjHo2bHbydU-TQbgByD-giErYmzSRzhioaJfGxuKQ/viewform",
    dateEntryId: "entry.1753222212",
    locationEntryId: "entry.679525213",
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-01T00:00:00.000Z"
  }
];