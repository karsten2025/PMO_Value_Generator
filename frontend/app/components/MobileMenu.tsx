'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileMenuProps {
  mode: 'colloquial' | 'management';
  onModeChange: (mode: 'colloquial' | 'management') => void;
  showModeSwitch?: boolean;
  additionalContent?: React.ReactNode;
  // Optional: Lokaler Language State (falls kein Context verwendet wird)
  language?: 'DE' | 'EN' | 'ES';
  onLanguageChange?: (lang: 'DE' | 'EN' | 'ES') => void;
}

/**
 * MobileMenu Component
 * 
 * Wiederverwendbares Hamburger Menu für Mobile
 * - Language Switcher (DE/EN/ES) - nutzt Context ODER lokalen State
 * - Mode Switcher (Normal/Management) - optional
 * - Zusätzlicher Content (optional)
 * 
 * Features:
 * - Slide-in Animation von rechts
 * - Backdrop mit Blur
 * - Body Scroll Lock wenn offen
 */
export default function MobileMenu({ 
  mode, 
  onModeChange, 
  showModeSwitch = true,
  additionalContent,
  language: localLanguage,
  onLanguageChange: localSetLanguage
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Nutze lokalen State falls vorhanden, sonst Context
  const contextLang = useLanguage();
  const language = localLanguage || contextLang.language;
  const setLanguage = localSetLanguage || contextLang.setLanguage;

  // Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button - Nur auf Mobile sichtbar */}
      <button
        onClick={toggleMenu}
        className="sm:hidden p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
        aria-label="Menu"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            // X Icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            // Hamburger Icon
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Sliding Menu Panel - RESPONSIVE WIDTH */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-slate-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          sm:hidden
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-blue-400">⚙️ Settings</h2>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-slate-700 transition"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Language Switcher */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase mb-2">
                🌍 Language
              </label>
              <div className="flex gap-2">
                {(['DE', 'EN', 'ES'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`
                      flex-1 py-2 px-3 rounded-lg font-medium text-sm transition
                      ${language === lang 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}
                    `}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Switcher - Optional */}
            {showModeSwitch && (
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase mb-2">
                  👁️ View Mode
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onModeChange('colloquial');
                      closeMenu();
                    }}
                    className={`
                      py-3 px-4 rounded-lg font-medium text-sm transition text-left
                      ${mode === 'colloquial' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <div>
                        <div className="font-bold">Normal</div>
                        <div className="text-xs opacity-75">Team Language</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      onModeChange('management');
                      closeMenu();
                    }}
                    className={`
                      py-3 px-4 rounded-lg font-medium text-sm transition text-left
                      ${mode === 'management' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💼</span>
                      <div>
                        <div className="font-bold">Management</div>
                        <div className="text-xs opacity-75">Executive Language</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Additional Content Slot */}
            {additionalContent && (
              <div className="pt-4 border-t border-slate-700">
                {additionalContent}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

