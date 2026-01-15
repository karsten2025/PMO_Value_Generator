/**
 * Helper Functions
 * 
 * Wiederverwendbare Utility Functions für Labels, Titles, Icons
 */

import React from 'react';
import { TrendingUp, Users as UsersIcon, CheckCircle } from 'lucide-react';
import uiLabels from '../../mock/ui-labels-matrix.json';

type Language = 'de' | 'en' | 'es';
type Mode = 'colloquial' | 'management';

/**
 * Get Label from UI Labels Matrix
 */
export function getLabel(
  category: keyof typeof uiLabels.alignment_widget,
  lang: Language,
  mode: Mode
): string {
  return uiLabels.alignment_widget[category][lang][mode];
}

/**
 * Get Milestone Title (Multilingual)
 */
export function getMilestoneTitle(id: string, lang: Language): string {
  const titles: Record<string, Record<Language, string>> = {
    '1': { de: 'Bewusstseinsbildung & Schulung', en: 'Awareness & Education', es: 'Concienciación y Educación' },
    '2': { de: 'Anforderungsermittlung', en: 'Requirements Discovery', es: 'Descubrimiento de Requisitos' },
    '3': { de: 'Nutzen-Definition', en: 'Benefit Definition', es: 'Definición de Beneficios' },
    '4': { de: 'Lösungsdesign', en: 'Solution Design', es: 'Diseño de Solución' },
    '5': { de: 'Service-Einführung', en: 'Service Launch', es: 'Lanzamiento de Servicio' },
    '6': { de: 'Täglicher Betrieb', en: 'Daily Operations', es: 'Operaciones Diarias' },
    '7': { de: 'Leistungsverfolgung', en: 'Performance Tracking', es: 'Seguimiento de Rendimiento' },
    '8': { de: 'Kontinuierliche Verbesserung', en: 'Continuous Enhancement', es: 'Mejora Continua' },
    '9': { de: 'Ergebnis-Realisierung', en: 'Outcome Realization', es: 'Realización de Resultados' },
    '10': { de: 'Stakeholder-Validierung', en: 'Stakeholder Validation', es: 'Validación de Stakeholders' }
  };
  return titles[id]?.[lang] || titles[id]?.['en'] || 'Unknown';
}

/**
 * Get KPI Icon by Type
 */
export function getKPIIcon(kpiType: string): React.ReactNode {
  switch (kpiType) {
    case 'strategic': return React.createElement(TrendingUp, { className: "w-4 h-4 text-green-400" });
    case 'tactical': return React.createElement(UsersIcon, { className: "w-4 h-4 text-yellow-400" });
    case 'operational': return React.createElement(CheckCircle, { className: "w-4 h-4 text-blue-400" });
    default: return null;
  }
}

/**
 * Get KPI Type Label (Multilingual)
 */
export function getKPITypeLabel(kpiType: string, lang: Language): string {
  const labels: Record<string, Record<Language, string>> = {
    strategic: { de: 'Strategisch', en: 'Strategic', es: 'Estratégico' },
    tactical: { de: 'Taktisch', en: 'Tactical', es: 'Táctico' },
    operational: { de: 'Operativ', en: 'Operational', es: 'Operativo' }
  };
  return labels[kpiType]?.[lang] || kpiType;
}


