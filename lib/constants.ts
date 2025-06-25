// lib/constants.ts

export const BRAND_COLORS = {
  navy: '#003057',
  midBlue: '#054a76',
  green: '#80bc00',
  lightGreen: '#bcd63e',
  gold: '#ffc629',
  lightGold: '#fbac40',
  beige: '#f5f2e8',
  cream: '#f4eee1'
} as const;

export const TRAINING_TYPES = {
  MHFA: 'MHFA',
  QPR: 'QPR'
} as const;

export const LANGUAGES = {
  EN: 'en',
  ES: 'es'
} as const;

export const URLS = {
  MCCALL_HOME: 'https://mccallbhn.org/',
  GOOGLE_FORMS: {
    MHFA_EN: 'https://docs.google.com/forms/d/e/1FAIpQLSfw3r099XjHo2bHbydU-TQbgByD-giErYmzSRzhioaJfGxuKQ/viewform',
    MHFA_ES: 'https://docs.google.com/forms/d/e/1FAIpQLSfH27T3aCWY8yZzF8OpDJ_hRbO54D_lGobW96T9aMxu5c9THA/viewform',
    QPR_EN: 'https://docs.google.com/forms/d/e/1FAIpQLSdel9p7wqnEMN-zjgOLRr6JKYL33uv2RkH2jKOUxrW9LKpvZg/viewform',
    QPR_ES: 'https://docs.google.com/forms/d/e/1FAIpQLSda55mbKZll96Q8Tytwrz8tmCf7fuvrhn0994HsUuBUxABm2g/viewform'
  }
} as const;

export const FORM_ENTRY_IDS = {
  DATE: 'entry.1753222212',
  LOCATION: 'entry.679525213'
} as const;

export const DATE_FORMATS = {
  DISPLAY: {
    weekday: 'long' as const,
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const
  },
  TIME: {
    hour: 'numeric' as const,
    minute: '2-digit' as const,
    hour12: true
  }
} as const;