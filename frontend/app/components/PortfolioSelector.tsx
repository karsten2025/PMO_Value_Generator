"use client";

// Portfolio Selector Komponente
// Dropdown im Header zur Auswahl des aktiven Portfolios

import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '@/app/contexts/PortfolioContext';
import { ChevronDown, Briefcase, RefreshCw } from 'lucide-react';

export default function PortfolioSelector() {
  const { portfolios, selectedPortfolio, selectPortfolio, isLoading, error, refreshPortfolios } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hydration Fix: Erst nach dem Mount rendern
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Schließe Dropdown bei Klick außerhalb
  useEffect(() => {
    if (!isMounted) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isMounted]);

  // Verhindere Hydration-Fehler
  if (!isMounted) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg min-w-[280px]">
        <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
        <div className="flex-1">
          <div className="h-3 w-16 bg-slate-700 rounded mb-1" />
          <div className="h-4 w-32 bg-slate-700 rounded" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg">
        <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
        <span className="text-sm text-slate-400">Lade Portfolios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 border border-red-800 rounded-lg">
        <span className="text-sm text-red-400">⚠️ Fehler beim Laden</span>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-900/20 border border-yellow-800 rounded-lg">
        <Briefcase className="w-4 h-4 text-yellow-400" />
        <span className="text-sm text-yellow-400">Keine Portfolios verfügbar</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 
                   border border-slate-700 rounded-lg transition-all duration-200
                   min-w-[280px] group"
      >
        <Briefcase className="w-5 h-5 text-blue-400" />
        <div className="flex-1 text-left">
          <div className="text-xs text-slate-400 uppercase tracking-wider">Portfolio</div>
          <div className="text-sm font-semibold text-white truncate">
            {selectedPortfolio?.name || 'Kein Portfolio gewählt'}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 
                      ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-slate-800 border border-slate-700 
                        rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              Portfolios ({portfolios.length})
            </span>
            <button
              onClick={() => {
                refreshPortfolios();
                setIsOpen(false);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Aktualisieren
            </button>
          </div>

          {/* Portfolio Liste */}
          <div className="max-h-[400px] overflow-y-auto">
            {portfolios.map((portfolio) => (
              <button
                key={portfolio.id}
                onClick={() => {
                  selectPortfolio(portfolio);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 transition-colors duration-150
                           ${selectedPortfolio?.id === portfolio.id
                             ? 'bg-blue-600/20 border-l-4 border-blue-500'
                             : 'hover:bg-slate-700 border-l-4 border-transparent'
                           }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">
                      {portfolio.name}
                    </div>
                    {portfolio.description && (
                      <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                        {portfolio.description}
                      </div>
                    )}
                  </div>
                  {selectedPortfolio?.id === portfolio.id && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

