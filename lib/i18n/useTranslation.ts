// lib/i18n/useTranslation.ts
import { translations } from './translations';
import { Language } from '@/lib/types';

export function useTranslation(language: Language) {
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return the key if path not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return { t };
}