"use client";

// Portfolio Context für globalen State
// Verwaltet das aktuell ausgewählte Portfolio app-weit

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, Portfolio } from '@/lib/supabase';

interface PortfolioContextType {
  portfolios: Portfolio[];
  selectedPortfolio: Portfolio | null;
  selectPortfolio: (portfolio: Portfolio) => void;
  isLoading: boolean;
  error: string | null;
  refreshPortfolios: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration Fix: Erst nach dem Mount rendern
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Portfolios aus Supabase laden
  const loadPortfolios = async () => {
    try {
      console.log('🔄 [PortfolioContext] Starte Laden der Portfolios...');
      console.log('🔑 [PortfolioContext] Umgebungsvariablen Check:');
      console.log('  - NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL || 'UNDEFINED');
      console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'UNDEFINED');
      
      setIsLoading(true);
      setError(null);

      // Spaltennamen: id, name, description
      const { data, error: fetchError } = await supabase
        .from('pmo_portfolios')
        .select('id, name, description')
        .order('name', { ascending: true });

      console.log('📊 [PortfolioContext] Supabase Response:', { data, error: fetchError });

      if (fetchError) {
        console.error('❌ [PortfolioContext] Supabase Fehler Details:');
        console.error('  - Message:', fetchError.message);
        console.error('  - Code:', fetchError.code);
        console.error('  - Details:', fetchError.details);
        console.error('  - Hint:', fetchError.hint);
        console.error('  - Full Error:', JSON.stringify(fetchError, null, 2));
        throw fetchError;
      }

      console.log(`✅ [PortfolioContext] ${data?.length || 0} Portfolios geladen:`, data);
      setPortfolios(data || []);

      // Wenn noch kein Portfolio gewählt, wähle das erste
      if (!selectedPortfolio && data && data.length > 0) {
        console.log('🎯 [PortfolioContext] Wähle erstes Portfolio:', data[0].name);
        setSelectedPortfolio(data[0]);
        // Speichere Auswahl in localStorage (nur im Browser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('selectedPortfolioId', data[0].id);
        }
      } else if (!data || data.length === 0) {
        console.warn('⚠️ [PortfolioContext] Keine aktiven Portfolios gefunden!');
      }
    } catch (err: any) {
      console.error('💥 [PortfolioContext] Fehler beim Laden der Portfolios:');
      console.error('  - Type:', typeof err);
      console.error('  - Message:', err?.message || 'No message');
      console.error('  - Code:', err?.code || 'No code');
      console.error('  - Hint:', err?.hint || 'No hint');
      console.error('  - Details:', err?.details || 'No details');
      console.error('  - Stack:', err?.stack || 'No stack');
      
      try {
        console.error('  - Serialized:', JSON.stringify(err, null, 2));
      } catch (serErr) {
        console.error('  - (Could not serialize error)');
      }
      
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
      console.log('🏁 [PortfolioContext] Laden abgeschlossen');
    }
  };

  // Initial laden und aus localStorage wiederherstellen
  useEffect(() => {
    loadPortfolios();
  }, []);

  // Stelle letzte Auswahl aus localStorage wieder her
  useEffect(() => {
    if (isMounted && portfolios.length > 0 && !selectedPortfolio) {
      const savedId = localStorage.getItem('selectedPortfolioId');
      if (savedId) {
        const saved = portfolios.find(p => p.id === savedId);
        if (saved) {
          setSelectedPortfolio(saved);
        }
      }
    }
  }, [portfolios, isMounted, selectedPortfolio]);

  const selectPortfolio = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedPortfolioId', portfolio.id);
    }
  };

  const refreshPortfolios = async () => {
    await loadPortfolios();
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolios,
        selectedPortfolio,
        selectPortfolio,
        isLoading,
        error,
        refreshPortfolios,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

// Custom Hook für einfachen Zugriff
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio muss innerhalb eines PortfolioProvider verwendet werden');
  }
  return context;
}

