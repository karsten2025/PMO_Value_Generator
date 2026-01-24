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
 * - SAP-Integration Badge mit Live-Sync-Indikator
 * 
 * DATENQUELLE: pmo_project_finance (Werte in CENTS!)
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react';
import uiLabels from '@/mock/ui-labels-matrix.json';

/**
 * SAP LOGO SVG COMPONENT
 * ======================
 * Offizielles SAP-Icon mit charakteristischem Blauton
 */
const SAPLogo = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* SAP Rechteck mit Rundung */}
    <rect
      x="5"
      y="25"
      width="90"
      height="50"
      rx="8"
      fill="#008fd3"
      stroke="#006ba6"
      strokeWidth="2"
    />
    {/* SAP Schriftzug */}
    <text
      x="50"
      y="60"
      textAnchor="middle"
      fontSize="28"
      fontWeight="bold"
      fontFamily="Arial, sans-serif"
      fill="white"
    >
      SAP
    </text>
  </svg>
);

/**
 * VERIFIED BADGE COMPONENT
 * ========================
 * Grüner Checkmark-Badge für "Live-Synchronisiert"
 */
const VerifiedBadge = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" fill="#10b981" />
    <path
      d="M8 12l3 3 5-5"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

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
  const [showTooltip, setShowTooltip] = useState(false);

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
          <div className="relative">
            <SAPLogo className="w-5 h-5" />
          </div>
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
          {/* SAP Logo mit Verified Badge */}
          <div 
            className="relative p-2 bg-slate-900/50 rounded-lg group/sap"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SAPLogo className="w-6 h-6" />
            {/* Verified Badge (rechts unten) */}
            <div className="absolute -bottom-1 -right-1">
              <VerifiedBadge className="w-4 h-4" />
            </div>
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute left-0 top-full mt-2 z-50 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg shadow-xl">
                <div className="text-xs text-slate-300 leading-relaxed">
                  {labels.sap_sync_tooltip?.[lang]?.[mode] || labels.sap_sync_tooltip?.en?.colloquial}
                </div>
                {/* Tooltip Arrow */}
                <div className="absolute -top-2 left-4 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 transform rotate-45"></div>
              </div>
            )}
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
