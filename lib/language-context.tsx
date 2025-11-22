'use client';

import { createContext, useContext, useState, ReactNode, useRef, useCallback } from 'react';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
  onLanguageChange: (callback: (lang: Language) => void) => () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ja');
  const listenersRef = useRef<Set<(lang: Language) => void>>(new Set());

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const newLang = prev === 'en' ? 'ja' : 'en';
      
      listenersRef.current.forEach(callback => callback(newLang));
      return newLang;
    });
  }, []);

  const onLanguageChange = useCallback((callback: (lang: Language) => void) => {
    listenersRef.current.add(callback);
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage,
    onLanguageChange,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
