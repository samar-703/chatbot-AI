'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [language, setLanguage] = useState<Language>('en');
  const [listeners, setListeners] = useState<Set<(lang: Language) => void>>(new Set());

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'en' ? 'ja' : 'en';
      // Notify all listeners
      listeners.forEach(callback => callback(newLang));
      return newLang;
    });
  };

  const onLanguageChange = (callback: (lang: Language) => void) => {
    setListeners(prev => new Set(prev).add(callback));
    return () => {
      setListeners(prev => {
        const newSet = new Set(prev);
        newSet.delete(callback);
        return newSet;
      });
    };
  };

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
