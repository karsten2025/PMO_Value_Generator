"use client";

/**
 * PROJECT FINANCE VALUE WIDGET
 * =============================
 * Zeigt Budget-Daten (CapEx/OpEx) für ein Projekt an.
 * 
 * FEATURES:
 * - Collapsed: Nur Gesamtbudget anzeigen
 * - Expanded: Detaillierte Tabelle mit Variance
 * - 2x3 Matrix Support (DE/EN/ES x Colloquial/Management)
 * - Farbcodierung: Grün (unter Budget), Rot (über Budget)
 * 
 * DATENQUELLE: pmo_project_finance (Werte in CENTS!)
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Wallet, ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react';
import uiLabels from '@/mock/ui-labels-matrix.json';

interface ProjectFinanceValueProps {
  projectId: string;
  lang: 'de' | 'en' | 'es';
  mode: 'colloquial' | 'management';
}

interface FinanceData {
  id: string;
  project_id: string;
  planned_capex: number; // in CENTS
  planned_opex: number;  // in CENTS
  actual_capex: number;  // in CENTS
  actual_opex: number;   // in CENTS
  currency: string;
  fiscal_year: number;
}

export default function ProjectFinanceValue({ 
  projectId, 
  lang, 
  mode 
}: ProjectFinanceValueProps) {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // UI-Labels aus 2x3 Matrix laden
  const labels = uiLabels.project_finance;
  const getLabel = (key: keyof typeof labels) => {
    return labels[key]?.[lang]?.[mode] || labels[key]?.en?.colloquial || key;
  };

  // Finance-Daten laden
  useEffect(() => {
    loadFinanceData();
  }, [projectId]);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pmo_project_finance')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Kein Eintrag gefunden (normaler Fall für neue Projekte)
          setFinanceData(null);
        } else {
          console.error('Error loading finance data:', error);
        }
      } else {
        setFinanceData(data);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
      setFinanceData(null);
    } finally {
      setLoading(false);
    }
  };

  // Hilfsfunktionen: CENTS → EURO
  const centsToEuro = (cents: number): number => {
    return cents / 100;
  };

  const formatCurrency = (cents: number, currency: string = 'EUR'): string => {
    const euros = centsToEuro(cents);
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(euros);
  };

  // Variance-Berechnung (in Prozent)
  const calculateVariance = (planned: number, actual: number): number => {
    if (planned === 0) return 0;
    return ((actual - planned) / planned) * 100;
  };

  // Wenn keine Daten vorhanden
  if (!loading && !financeData) {
    return (
      <div 
        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-slate-400">
          <Wallet className="w-4 h-4" />
          <span className="text-sm">{getLabel('no_data')}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div 
        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 animate-pulse"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-6 bg-slate-700 rounded w-32"></div>
      </div>
    );
  }

  // Berechnungen
  const plannedTotal = financeData!.planned_capex + financeData!.planned_opex;
  const actualTotal = financeData!.actual_capex + financeData!.actual_opex;
  const totalVariance = calculateVariance(plannedTotal, actualTotal);

  const capexVariance = calculateVariance(financeData!.planned_capex, financeData!.actual_capex);
  const opexVariance = calculateVariance(financeData!.planned_opex, financeData!.actual_opex);

  // Farbcodierung
  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-red-400'; // Über Budget
    if (variance < 0) return 'text-green-400'; // Unter Budget
    return 'text-slate-400'; // Exakt
  };

  const getVarianceBgColor = (variance: number) => {
    if (variance > 0) return 'bg-red-500/10 border-red-500/20';
    if (variance < 0) return 'bg-green-500/10 border-green-500/20';
    return 'bg-slate-500/10 border-slate-500/20';
  };

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      {/* COLLAPSED VIEW - Nur Gesamtbudget */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // Verhindert, dass der Click zur Project Card durchdringt
          setIsExpanded(!isExpanded);
        }}
        className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-800/50 hover:bg-slate-800/70 rounded-xl border border-slate-700 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Wallet className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-sm text-slate-400">{getLabel('title')}</div>
            <div className="text-xl font-bold text-white">
              {formatCurrency(plannedTotal, financeData!.currency)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Variance Indicator */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getVarianceBgColor(totalVariance)}`}>
            {totalVariance > 0 ? (
              <TrendingUp className={`w-4 h-4 ${getVarianceColor(totalVariance)}`} />
            ) : totalVariance < 0 ? (
              <TrendingDown className={`w-4 h-4 ${getVarianceColor(totalVariance)}`} />
            ) : null}
            <span className={`text-sm font-medium ${getVarianceColor(totalVariance)}`}>
              {totalVariance > 0 ? '+' : ''}{totalVariance.toFixed(1)}%
            </span>
          </div>

          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          )}
        </div>
      </div>

      {/* EXPANDED VIEW - Detaillierte Tabelle */}
      {isExpanded && (
        <div className="mt-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-3">
          {/* Header */}
          <div className="grid grid-cols-4 gap-3 text-xs font-medium text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-700/50">
            <div>{getLabel('category')}</div>
            <div className="text-right">{getLabel('planned')}</div>
            <div className="text-right">{getLabel('actual')}</div>
            <div className="text-right">{getLabel('variance')}</div>
          </div>

          {/* CapEx Row */}
          <div className="grid grid-cols-4 gap-3 items-center">
            <div className="text-sm text-white font-medium">
              {getLabel('capex')}
            </div>
            <div className="text-sm text-slate-300 text-right">
              {formatCurrency(financeData!.planned_capex, financeData!.currency)}
            </div>
            <div className="text-sm text-white text-right font-medium">
              {formatCurrency(financeData!.actual_capex, financeData!.currency)}
            </div>
            <div className={`text-sm text-right font-semibold ${getVarianceColor(capexVariance)}`}>
              {capexVariance > 0 ? '+' : ''}{capexVariance.toFixed(1)}%
            </div>
          </div>

          {/* OpEx Row */}
          <div className="grid grid-cols-4 gap-3 items-center">
            <div className="text-sm text-white font-medium">
              {getLabel('opex')}
            </div>
            <div className="text-sm text-slate-300 text-right">
              {formatCurrency(financeData!.planned_opex, financeData!.currency)}
            </div>
            <div className="text-sm text-white text-right font-medium">
              {formatCurrency(financeData!.actual_opex, financeData!.currency)}
            </div>
            <div className={`text-sm text-right font-semibold ${getVarianceColor(opexVariance)}`}>
              {opexVariance > 0 ? '+' : ''}{opexVariance.toFixed(1)}%
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50 pt-3"></div>

          {/* Total Row */}
          <div className="grid grid-cols-4 gap-3 items-center bg-slate-800/50 -mx-4 px-4 py-2 rounded-lg">
            <div className="text-sm text-white font-bold">
              {getLabel('total')}
            </div>
            <div className="text-sm text-slate-200 text-right font-semibold">
              {formatCurrency(plannedTotal, financeData!.currency)}
            </div>
            <div className="text-sm text-white text-right font-bold">
              {formatCurrency(actualTotal, financeData!.currency)}
            </div>
            <div className={`text-sm text-right font-bold ${getVarianceColor(totalVariance)}`}>
              {totalVariance > 0 ? '+' : ''}{totalVariance.toFixed(1)}%
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
            <span>Fiscal Year: {financeData!.fiscal_year}</span>
            <span>Currency: {financeData!.currency}</span>
          </div>
        </div>
      )}
    </div>
  );
}
