'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Users, Briefcase } from 'lucide-react';

type Language = 'DE' | 'EN' | 'ES';
type Mode = 'colloquial' | 'management';

interface CompactHeaderControlsProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  showCommandHint?: boolean;
}

export default function CompactHeaderControls({
  language,
  onLanguageChange,
  mode,
  onModeChange,
  showCommandHint = false,
}: CompactHeaderControlsProps) {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    if (showLanguageDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown]);

  const languages: Language[] = ['DE', 'EN', 'ES'];
  
  const getLanguageFlag = (lang: Language) => {
    const flags = { DE: '🇩🇪', EN: '🇬🇧', ES: '🇪🇸' };
    return flags[lang];
  };

  const getModeLabel = (m: Mode) => {
    if (m === 'colloquial') {
      return language === 'DE' ? 'Normal' : language === 'ES' ? 'Normal' : 'Normal';
    } else {
      return language === 'DE' ? 'Management' : language === 'ES' ? 'Gerencia' : 'Management';
    }
  };

  const getModeIcon = (m: Mode) => {
    return m === 'colloquial' ? <Users size={16} /> : <Briefcase size={16} />;
  };

  const toggleMode = () => {
    onModeChange(mode === 'colloquial' ? 'management' : 'colloquial');
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* LANGUAGE DROPDOWN */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm font-medium text-white"
          aria-label="Select Language"
        >
          <span className="text-base">{getLanguageFlag(language)}</span>
          <span className="hidden sm:inline">{language}</span>
          <ChevronDown size={14} className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showLanguageDropdown && (
          <div className="absolute top-full mt-1 right-0 bg-slate-800 border border-slate-600 rounded-lg shadow-xl overflow-hidden z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onLanguageChange(lang);
                  setShowLanguageDropdown(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-700 transition text-left ${
                  language === lang ? 'bg-slate-700 text-blue-400' : 'text-white'
                }`}
              >
                <span className="text-base">{getLanguageFlag(lang)}</span>
                <span className="text-sm font-medium">{lang}</span>
                {language === lang && <span className="ml-auto text-blue-400">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MODE TOGGLE SWITCH */}
      <button
        onClick={toggleMode}
        className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm font-medium text-white group"
        title={`Switch to ${mode === 'colloquial' ? 'Management' : 'Normal'} mode`}
      >
        <span className="flex items-center gap-1.5">
          {getModeIcon(mode)}
          <span className="hidden sm:inline">{getModeLabel(mode)}</span>
        </span>
        
        {/* Toggle Indicator */}
        <div className="hidden sm:flex items-center gap-0.5 ml-1">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
            mode === 'colloquial' ? 'bg-blue-400' : 'bg-slate-500'
          }`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${
            mode === 'management' ? 'bg-blue-400' : 'bg-slate-500'
          }`} />
        </div>
      </button>

      {/* COMMAND PALETTE HINT (Optional) */}
      {showCommandHint && (
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 bg-slate-800/50 border border-slate-700 rounded text-xs text-slate-400">
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">⌘K</kbd>
        </div>
      )}
    </div>
  );
}
