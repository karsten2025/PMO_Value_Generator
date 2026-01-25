'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, ChevronDown, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

type Language = 'DE' | 'EN' | 'ES';
type Mode = 'colloquial' | 'management';

interface GitHubStyleHeaderProps {
  // Brand & Context
  brandName?: string;
  companyName?: string;
  portfolioName?: string;
  onPortfolioClick?: () => void;
  
  // Main Views (Tabs)
  currentView: 'cycle' | 'projects';
  onViewChange: (view: 'cycle' | 'projects') => void;
  
  // Controls
  language: Language;
  onLanguageChange: (lang: Language) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  
  // Optional Features
  showSearch?: boolean;
  onSearchClick?: () => void;
  onAIAssistantClick?: () => void;
  
  // Additional Actions
  additionalControls?: React.ReactNode;
}

export default function GitHubStyleHeader({
  brandName = 'PMO Value Generator',
  companyName,
  portfolioName,
  onPortfolioClick,
  currentView,
  onViewChange,
  language,
  onLanguageChange,
  mode,
  onModeChange,
  showSearch = false,
  onSearchClick,
  onAIAssistantClick,
  additionalControls,
}: GitHubStyleHeaderProps) {
  const [showControlsMenu, setShowControlsMenu] = useState(false);
  const controlsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close controls menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target as Node)) {
        setShowControlsMenu(false);
      }
    };

    if (showControlsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showControlsMenu]);

  // Translations
  const getViewLabel = (view: 'cycle' | 'projects') => {
    if (view === 'cycle') {
      return {
        DE: 'Impact Cycle',
        EN: 'Impact Cycle',
        ES: 'Ciclo de Impacto'
      }[language];
    } else {
      return {
        DE: 'Portfolio Übersicht',
        EN: 'Portfolio Overview',
        ES: 'Vista de Portafolio'
      }[language];
    }
  };

  const getModeLabel = (m: Mode) => {
    if (m === 'colloquial') {
      return {
        DE: 'Normal',
        EN: 'Normal',
        ES: 'Normal'
      }[language];
    } else {
      return {
        DE: 'Management',
        EN: 'Management',
        ES: 'Gerencia'
      }[language];
    }
  };

  const getLanguageFlag = (lang: Language) => {
    const flags = { DE: '🇩🇪', EN: '🇬🇧', ES: '🇪🇸' };
    return flags[lang];
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700">
      {/* DESKTOP HEADER */}
      <div className="hidden lg:flex flex-col">
        {/* Top Row: Brand + Company + Controls (all left-aligned) */}
        <div className="flex items-center px-6 py-3 border-b border-slate-700/50">
          {/* Left: Brand + Company + Controls */}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-blue-400 flex items-center gap-3">
              <div className="rounded-full overflow-hidden">
                <Image 
                  src="/torus-logo.png" 
                  alt="Torus PMO Logo" 
                  width={48} 
                  height={48}
                  className="object-cover mix-blend-screen scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                />
              </div>
              {brandName}
            </h1>
            
            {/* Company Name (read-only) */}
            {companyName && (
              <span className="text-sm text-slate-400">
                🏢 {companyName}
              </span>
            )}
            {/* Controls Dropdown */}
            <div className="relative" ref={controlsRef}>
              <button
                onClick={() => setShowControlsMenu(!showControlsMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm"
              >
                <Settings size={16} />
                <span>Controls</span>
                <ChevronDown size={14} className={`transition-transform ${showControlsMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Controls Menu */}
              {showControlsMenu && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-4 space-y-4">
                    {/* Language */}
                    <div>
                      <div className="text-xs text-slate-400 mb-2">🌐 Language</div>
                      <div className="flex gap-2">
                        {(['DE', 'EN', 'ES'] as Language[]).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => onLanguageChange(lang)}
                            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md transition ${
                              language === lang
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                          >
                            <span>{getLanguageFlag(lang)}</span>
                            <span className="text-sm font-medium">{lang}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mode */}
                    <div>
                      <div className="text-xs text-slate-400 mb-2">💼 Register</div>
                      <div className="flex gap-2">
                        {(['colloquial', 'management'] as Mode[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => onModeChange(m)}
                            className={`flex-1 px-3 py-2 rounded-md transition text-sm ${
                              mode === m
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                            }`}
                          >
                            {getModeLabel(m)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-700" />

                    {/* AI Assistant */}
                    {onAIAssistantClick && (
                      <button
                        onClick={() => {
                          onAIAssistantClick();
                          setShowControlsMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition text-white text-sm font-medium"
                      >
                        <span>🤖</span>
                        <span>AI Assistant</span>
                      </button>
                    )}

                    {/* Additional Controls */}
                    {additionalControls}
                  </div>
                </div>
              )}
            </div>

            {/* Search (Optional) */}
            {showSearch && onSearchClick && (
              <button
                onClick={onSearchClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm text-slate-300"
              >
                <Search size={16} />
                <span className="hidden xl:inline">Search</span>
                <kbd className="hidden xl:inline px-1.5 py-0.5 bg-slate-600 rounded text-xs">⌘K</kbd>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Row: Main View Tabs */}
        <div className="flex items-center gap-1 px-6 py-2">
          <button
            onClick={() => onViewChange('cycle')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition font-medium ${
              currentView === 'cycle'
                ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span className="text-lg">🔵</span>
            <span>{getViewLabel('cycle')}</span>
          </button>

          <button
            onClick={() => onViewChange('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition font-medium ${
              currentView === 'projects'
                ? 'bg-slate-900 text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span className="text-lg">📊</span>
            <span>{getViewLabel('projects')}</span>
          </button>
        </div>
      </div>

      {/* TABLET HEADER (768px - 1024px) */}
      <div className="hidden sm:flex lg:hidden items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-blue-400 flex items-center gap-2">
            <div className="rounded-full overflow-hidden">
              <Image 
                src="/torus-logo.png" 
                alt="Torus PMO Logo" 
                width={32} 
                height={32}
                className="object-cover mix-blend-screen scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </div>
            PMO
          </h1>
          {companyName && (
            <span className="text-xs text-slate-400">{companyName}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Tabs (Compact) */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => onViewChange('cycle')}
              className={`px-2 py-1 rounded text-xs ${
                currentView === 'cycle' ? 'bg-blue-600' : 'hover:bg-slate-600'
              }`}
            >
              🔵
            </button>
            <button
              onClick={() => onViewChange('projects')}
              className={`px-2 py-1 rounded text-xs ${
                currentView === 'projects' ? 'bg-blue-600' : 'hover:bg-slate-600'
              }`}
            >
              📊
            </button>
          </div>

          {/* Controls Button */}
          <button
            onClick={() => setShowControlsMenu(!showControlsMenu)}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* MOBILE HEADER (<768px) */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between px-3 py-3">
          <h1 className="text-lg font-bold text-blue-400 flex items-center gap-2">
            <div className="rounded-full overflow-hidden">
              <Image 
                src="/torus-logo.png" 
                alt="Torus PMO Logo" 
                width={36} 
                height={36}
                className="object-cover mix-blend-screen scale-110 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              />
            </div>
            PMO
          </h1>
          {/* Mobile Menu rendered by parent */}
        </div>
        
        {/* Mobile View Tabs */}
        <div className="flex gap-1 px-3 pb-2">
          <button
            onClick={() => onViewChange('cycle')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition text-sm font-medium ${
              currentView === 'cycle'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>🔵</span>
            <span>{getViewLabel('cycle')}</span>
          </button>

          <button
            onClick={() => onViewChange('projects')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg transition text-sm font-medium ${
              currentView === 'projects'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span>📊</span>
            <span>{getViewLabel('projects')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
