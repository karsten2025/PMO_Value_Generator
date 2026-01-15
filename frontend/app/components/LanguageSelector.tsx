/**
 * Language & Register Selector
 * 
 * UI Component für 2x3 Matrix Auswahl:
 * - Sprache (DE/EN/ES)
 * - Register (colloquial/management)
 * 
 * Integration: Im Header oder Sidebar neben Portfolio-Selector
 */

'use client';

import React from 'react';
import { useLanguage, LANGUAGE_LABELS, REGISTER_LABELS, Language, Register } from '@/app/contexts/LanguageContext';
import { Globe, Users, Briefcase } from 'lucide-react';

export default function LanguageSelector() {
  const { language, register, setLanguage, setRegister } = useLanguage();
  
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700">
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-cyan-400" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600 
                     hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                     text-sm cursor-pointer transition"
        >
          {Object.entries(LANGUAGE_LABELS).map(([lang, label]) => (
            <option key={lang} value={lang}>
              {label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Divider */}
      <div className="w-px h-6 bg-slate-600" />
      
      {/* Register Selector */}
      <div className="flex items-center gap-2">
        {register === 'colloquial' ? (
          <Users className="w-4 h-4 text-green-400" />
        ) : (
          <Briefcase className="w-4 h-4 text-blue-400" />
        )}
        
        <select
          value={register}
          onChange={(e) => setRegister(e.target.value as Register)}
          className="bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600 
                     hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                     text-sm cursor-pointer transition"
        >
          {Object.entries(REGISTER_LABELS).map(([reg, labels]) => (
            <option key={reg} value={reg}>
              {labels.short}
            </option>
          ))}
        </select>
      </div>
      
      {/* Info Tooltip */}
      <div className="group relative">
        <div className="w-4 h-4 rounded-full bg-slate-700 text-slate-400 text-xs 
                        flex items-center justify-center cursor-help">
          ?
        </div>
        
        {/* Tooltip */}
        <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-slate-800 border 
                        border-slate-600 rounded-lg shadow-xl opacity-0 invisible 
                        group-hover:opacity-100 group-hover:visible transition-all z-50">
          <p className="text-xs text-slate-300 mb-2">
            <strong className="text-cyan-400">Sprache:</strong> Wähle deine bevorzugte Sprache
          </p>
          <p className="text-xs text-slate-300">
            <strong className="text-green-400">👥 Einfach:</strong> Für alle verständlich
            <br />
            <strong className="text-blue-400">💼 Profi:</strong> PM-Fachbegriffe
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Version (für Mobile oder Sidebar)
 */
export function LanguageSelectorCompact() {
  const { language, register, setLanguage, setRegister } = useLanguage();
  
  return (
    <div className="flex flex-col gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-slate-700 text-white px-2 py-1 rounded text-sm"
      >
        {Object.entries(LANGUAGE_LABELS).map(([lang, label]) => (
          <option key={lang} value={lang}>{label}</option>
        ))}
      </select>
      
      <select
        value={register}
        onChange={(e) => setRegister(e.target.value as Register)}
        className="bg-slate-700 text-white px-2 py-1 rounded text-sm"
      >
        {Object.entries(REGISTER_LABELS).map(([reg, labels]) => (
          <option key={reg} value={reg}>{labels.short}</option>
        ))}
      </select>
    </div>
  );
}


