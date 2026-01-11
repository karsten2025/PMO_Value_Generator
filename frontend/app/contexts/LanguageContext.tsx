/**
 * Language & Register Context für 2x3 Matrix
 * 
 * Verwaltet User-Präferenzen:
 * - Sprache: DE, EN, ES
 * - Register: colloquial (Normalsprache) vs. management (Profi)
 * 
 * Integration mit bestehendem PortfolioContext!
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type Language = 'DE' | 'EN' | 'ES';
export type Register = 'colloquial' | 'management';

interface LanguageContextType {
  language: Language;
  register: Register;
  setLanguage: (lang: Language) => void;
  setRegister: (reg: Register) => void;
  
  // Helper: Gibt aktuellen Matrix-Key zurück (z.B. "de_colloquial")
  getMatrixKey: () => string;
  
  // Helper: Extrahiert Text aus 2x3 Matrix-Objekt
  getText: (matrixData: any) => string;
}

// Context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Load from localStorage (persistent)
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_language');
      // If saved value exists and is valid, use it. Otherwise default to EN.
      if (saved && ['DE', 'EN', 'ES'].includes(saved)) {
        return saved as Language;
      }
      // First visit: Set default to EN and save it
      localStorage.setItem('user_language', 'EN');
      return 'EN';
    }
    return 'EN';
  });
  
  const [register, setRegisterState] = useState<Register>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_register');
      return (saved as Register) || 'colloquial';  // Default: Normalsprache
    }
    return 'colloquial';
  });
  
  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('user_language', language);
  }, [language]);
  
  useEffect(() => {
    localStorage.setItem('user_register', register);
  }, [register]);
  
  // Setter mit Validation
  const setLanguage = (lang: Language) => {
    if (['DE', 'EN', 'ES'].includes(lang)) {
      setLanguageState(lang);
    }
  };
  
  const setRegister = (reg: Register) => {
    if (['colloquial', 'management'].includes(reg)) {
      setRegisterState(reg);
    }
  };
  
  // Helper: Matrix-Key (für Supabase Queries)
  const getMatrixKey = () => {
    const langMap: Record<Language, string> = {
      'DE': 'de',
      'EN': 'en',
      'ES': 'es'
    };
    
    return `${langMap[language]}_${register}`;
  };
  
  // Helper: Extrahiert Text aus 2x3 Matrix
  // Beispiel matrixData: { de: { colloquial: "...", management: "..." }, en: {...}, es: {...} }
  const getText = (matrixData: any): string => {
    if (!matrixData) return '';
    
    const langMap: Record<Language, string> = {
      'DE': 'de',
      'EN': 'en',
      'ES': 'es'
    };
    
    const lang = langMap[language];
    
    // Fallback-Logik: DE → EN → ES, colloquial → management
    const text = 
      matrixData?.[lang]?.[register] ||
      matrixData?.[lang]?.['management'] ||
      matrixData?.['en']?.[register] ||
      matrixData?.['en']?.['management'] ||
      '';
    
    return text;
  };
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        register,
        setLanguage,
        setRegister,
        getMatrixKey,
        getText
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// Hook
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  
  return context;
}

// UI Labels (für Komponenten)
export const LANGUAGE_LABELS: Record<Language, string> = {
  'DE': '🇩🇪 Deutsch',
  'EN': '🇬🇧 English',
  'ES': '🇪🇸 Español'
};

export const REGISTER_LABELS: Record<Register, { short: string; long: string }> = {
  'colloquial': {
    short: '👥 Einfach',
    long: 'Normalsprache (für alle verständlich)'
  },
  'management': {
    short: '💼 Profi',
    long: 'Management-Sprache (PM-Terminologie)'
  }
};

