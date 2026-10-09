'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function resolveTranslation(language: Language, path: string): string {
  const keys = path.split('.');
  let current: any = translations[language];

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English
      let fallback: any = translations.en;
      for (const fKey of keys) {
        if (fallback && typeof fallback === 'object' && fKey in fallback) {
          fallback = fallback[fKey];
        } else {
          return path;
        }
      }
      return typeof fallback === 'string' ? fallback : path;
    }
  }

  return typeof current === 'string' ? current : path;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('az'); // Default in application is Azerbaijani

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('agromint_language') as Language;
        if (saved === 'en' || saved === 'az') {
          setLanguageState(saved);
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('agromint_language', lang);
      }
    } catch (e) {
      // ignore
    }
  };

  const t = (path: string): string => {
    return resolveTranslation(language, path);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for components rendered without Provider (e.g. isolated unit tests)
    return {
      language: 'en',
      setLanguage: () => {},
      t: (path: string) => resolveTranslation('en', path),
    };
  }
  return context;
}
