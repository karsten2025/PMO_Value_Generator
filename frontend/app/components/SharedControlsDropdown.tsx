'use client';

// ============================================
// Shared Controls Dropdown
// ============================================
// Wiederverwendbares Controls-Menü für alle Pages
// Language + Mode Switcher + Optional: zusätzliche Actions
// ============================================

import React, { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, Globe, Users, Briefcase, X } from 'lucide-react';

type Language = 'de' | 'en' | 'es';
type Mode = 'colloquial' | 'management';

interface SharedControlsDropdownProps {
  language: Language;
  mode: Mode;
  onLanguageChange: (lang: Language) => void;
  onModeChange: (mode: Mode) => void;
  additionalActions?: React.ReactNode; // Optional: extra buttons (AI Assistant, etc.)
}

export function SharedControlsDropdown({
  language,
  mode,
  onLanguageChange,
  onModeChange,
  additionalActions,
}: SharedControlsDropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getLanguageLabel = (lang: Language) => {
    const labels = {
      de: 'Deutsch',
      en: 'English',
      es: 'Español',
    };
    return labels[lang];
  };

  const getLanguageFlag = (lang: Language) => {
    const flags = { de: '🇩🇪', en: '🇬🇧', es: '🇪🇸' };
    return flags[lang];
  };

  const getModeLabel = (m: Mode) => {
    if (m === 'colloquial') {
      return {
        de: 'Normal',
        en: 'Normal',
        es: 'Normal',
      }[language];
    } else {
      return {
        de: 'Management',
        en: 'Management',
        es: 'Gerencia',
      }[language];
    }
  };

  const getModeIcon = (m: Mode) => {
    return m === 'colloquial' ? <Users size={16} /> : <Briefcase size={16} />;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm text-slate-200"
        aria-label="Controls"
      >
        <Settings size={16} />
        <span className="hidden sm:inline">Controls</span>
        <ChevronDown
          size={14}
          className={`transition-transform ${showMenu ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute left-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Language Section */}
          <div className="p-3 border-b border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
                <Globe size={16} />
                <span>
                  {language === 'de' && 'Sprache'}
                  {language === 'en' && 'Language'}
                  {language === 'es' && 'Idioma'}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {(['de', 'en', 'es'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    onLanguageChange(lang);
                    setShowMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
                    language === lang
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="text-lg">{getLanguageFlag(lang)}</span>
                  <span>{getLanguageLabel(lang)}</span>
                  {language === lang && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Section */}
          <div className="p-3 border-b border-slate-700">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold mb-2">
              {getModeIcon(mode)}
              <span>
                {language === 'de' && 'Ansicht'}
                {language === 'en' && 'View'}
                {language === 'es' && 'Vista'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              {(['colloquial', 'management'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    onModeChange(m);
                    setShowMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-colors text-sm ${
                    mode === m
                      ? 'bg-green-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {getModeIcon(m)}
                  <span>{getModeLabel(m)}</span>
                  {mode === m && <span className="ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Actions (optional) */}
          {additionalActions && (
            <div className="p-3">
              {additionalActions}
            </div>
          )}

          {/* Close Button (Mobile) */}
          <div className="lg:hidden p-2 border-t border-slate-700">
            <button
              onClick={() => setShowMenu(false)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded transition text-sm text-slate-300"
            >
              <X size={16} />
              <span>
                {language === 'de' && 'Schließen'}
                {language === 'en' && 'Close'}
                {language === 'es' && 'Cerrar'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
