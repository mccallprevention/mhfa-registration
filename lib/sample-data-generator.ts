// lib/sample-data-generator.ts
import { Event, TrainingType, Language } from '@/lib/types';
import { URLS, FORM_ENTRY_IDS } from '@/lib/constants';

interface EventTemplate {
  title: string;
  location: string;
  address?: string;
  startTime: string;
  endTime: string;
  trainingType: TrainingType;
  language: Language;
}

const eventTemplates: EventTemplate[] = [
  // English MHFA Templates
  {
    title: "Mental Health First Aid - Adult Certification",
    location: "Torrington Behavioral Health District",
    address: "350 Main Street, Torrington, CT 06790",
    startTime: "09:00",
    endTime: "17:00",
    trainingType: "MHFA",
    language: "en"
  },
  {
    title: "Youth Mental Health First Aid Training",
    location: "Community Health Center Waterbury",
    address: "625 Wolcott Street, Waterbury, CT 06705",
    startTime: "13:00",
    endTime: "20:30",
    trainingType: "MHFA",
    language: "en"
  },
  // English QPR Templates
  {
    title: "QPR Gatekeeper Training - Basic",
    location: "Hartford Healthcare Behavioral Center",
    address: "80 Meriden Avenue, Southington, CT 06489",
    startTime: "14:00",
    endTime: "16:30",
    trainingType: "QPR",
    language: "en"
  },
  // Spanish MHFA Templates
  {
    title: "Primeros Auxilios de Salud Mental - Adultos",
    location: "New Opportunities of Greater Torrington",
    address: "100 Water Street, Torrington, CT 06790",
    startTime: "09:00",
    endTime: "17:00",
    trainingType: "MHFA",
    language: "es"
  },
  // Spanish QPR Templates
  {
    title: "QPR - Prevención del Suicidio",
    location: "Hispanic Alliance of Northwestern CT",
    address: "417 Main Street, Winsted, CT 06098",
    startTime: "14:00",
    endTime: "16:30",
    trainingType: "QPR",
    language: "es"
  }
];

function getGoogleFormUrl(trainingType: TrainingType, language: Language): string {
  const key = `${trainingType}_${language.toUpperCase()}` as keyof typeof URLS.GOOGLE_FORMS;
  return URLS.GOOGLE_FORMS[key];
}

function generateEventId(date: string, trainingType: string): string {
  const dateStr = date.replace(/-/g, '_');
  const typeStr = trainingType.toLowerCase();
  const random = Math.random().toString(36).substring(2, 6);
  return `event_${dateStr}_${typeStr}_${random}`;
}

export function generateSampleEvents(count: number = 20): Event[] {
  const events: Event[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  for (let i = 0; i < count; i++) {
    const template = eventTemplates[i % eventTemplates.length];
    
    // Generate dates spread across upcoming months
    const monthOffset = Math.floor(i / 4); // Spread events across months
    const dayOffset = (i % 20) + 5; // Days 5-25 of each month
    
    const eventDate = new Date(currentYear, currentMonth + monthOffset, dayOffset);
    const dateString = eventDate.toISOString().split('T')[0];
    
    const event: Event = {
      id: generateEventId(dateString, template.trainingType),
      title: template.title,
      date: dateString,
      startTime: template.startTime,
      endTime: template.endTime,
      location: template.location,
      address: template.address,
      trainingType: template.trainingType,
      language: template.language,
      googleFormBaseUrl: getGoogleFormUrl(template.trainingType, template.language),
      dateEntryId: FORM_ENTRY_IDS.DATE,
      locationEntryId: FORM_ENTRY_IDS.LOCATION,
      isActive: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    
    events.push(event);
  }
  
  return events;
}

// Export a generated set of sample events
export const sampleEvents = generateSampleEvents(20);