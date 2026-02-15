"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext'; // Dein existierender Context
import { SE_LIFECYCLE_DATA } from '@/data/se-lifecycle';
import { BookOpen, X, Download, Lightbulb, Cpu, Rocket, Activity, RefreshCw } from 'lucide-react';

// Icon Mapping Helper
const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Lightbulb': return <Lightbulb className="w-6 h-6" />;
    case 'Cpu': return <Cpu className="w-6 h-6" />;
    case 'Rocket': return <Rocket className="w-6 h-6" />;
    case 'Activity': return <Activity className="w-6 h-6" />;
    case 'RefreshCw': return <RefreshCw className="w-6 h-6" />;
    default: return <BookOpen className="w-6 h-6" />;
  }
};

export default function SystemsEngineeringHUD() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, register } = useLanguage(); // Zugriff auf DE/EN/ES und Colloquial/Management

  // Safe Accessor für die Sprache (Fallback auf 'en' falls context undefined)
  const langKey = (language?.toLowerCase() || 'en') as 'de' | 'en' | 'es';
  const modeKey = (register || 'colloquial') as 'colloquial' | 'management';

  return (
    <>
      {/* 1. Der Trigger Button (Rechts am Rand) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40
                     bg-slate-900/80 backdrop-blur-md border-l border-t border-b border-blue-500/50
                     text-blue-400 p-3 rounded-l-xl
                     hover:bg-blue-900/50 hover:w-16 transition-all duration-300
                     shadow-[0_0_15px_rgba(59,130,246,0.5)] group"
          title="Systems Engineering DNA"
        >
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-widest [writing-mode:vertical-rl] rotate-180 h-24 opacity-70 group-hover:opacity-100">
              System DNA
            </span>
          </div>
        </button>
      )}

      {/* 2. Das Slide-Over Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 z-50 shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-blue-500">🧬</span> System DNA
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
            Aligned with ISO/IEC 15288
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-8">

          <div className="text-sm text-slate-300 mb-6 bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
            {langKey === 'de'
              ? "Unsere Value Engine ist keine Spielerei. Sie basiert auf strengen Ingenieurs-Prinzipien."
              : "Our Value Engine is not a toy. It is based on rigorous engineering principles."}
          </div>

          {/* Timeline of Phases */}
          <div className="relative border-l-2 border-slate-700 ml-3 space-y-10">
            {SE_LIFECYCLE_DATA.map((phase, index) => (
              <div key={phase.id} className="relative pl-8 group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[11px] top-0 w-6 h-6 rounded-full border-2 bg-slate-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${phase.color.split(' ')[0]} ${phase.color.split(' ')[1]}`}>
                  <div className="text-white scale-75">
                    {getIcon(phase.icon)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                    Phase 0{index + 1}
                  </span>

                  <h3 className={`text-lg font-bold text-white transition-colors group-hover:text-blue-400`}>
                    {phase.titles[langKey][modeKey]}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {phase.description[langKey][modeKey]}
                  </p>

                  {/* Download / Navigate Link - mit lang & mode für Doc-Seiten (/docs/phase*) */}
                  <a
                    href={phase.downloadLink.startsWith("/docs/phase")
                      ? `${phase.downloadLink}?lang=${langKey}&mode=${modeKey}`
                      : phase.downloadLink}
                    target="_self"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors border border-blue-500/30 px-3 py-2 rounded bg-blue-500/10 hover:bg-blue-500/20 w-fit"
                  >
                    <Download className="w-3 h-3" />
                    {langKey === 'de' ? 'ISO Beschreibung (PDF)' : 'ISO Description (PDF)'}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-800 text-center">
             <p className="text-[10px] text-slate-500 uppercase tracking-widest">
             Aligned with the methodologies of the INCOSE SE Handbook
             Developed by Karsten Zenk PMP® etc.
             </p>
          </div>
        </div>
      </div>
    </>
  );
}
