export type TrainingType = "MHFA" | "QPR";

export interface Event {
  id: string;
  title: string;
  date: string;
  startTime: string;  
  endTime: string;   
  location: string;
  address?: string;   
  trainingType: TrainingType;
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