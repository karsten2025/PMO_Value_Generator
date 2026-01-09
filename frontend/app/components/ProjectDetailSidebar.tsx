"use client";

// Project Detail Sidebar - Zeigt alle KPIs eines Projekts
// Gemäß .cursorrules: 2x3 Matrix (DE/EN/ES x Colloquial/Management)

import React, { useState, useEffect } from 'react';
import { X, Target, Layers, Settings, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase, type Project, type KPIValue } from '@/lib/supabase';
import kpiLibrary from '../../mock/kpi-library-mock.json';

interface ProjectDetailSidebarProps {
  project: Project;
  lang: 'de' | 'en' | 'es';
  mode: 'colloquial' | 'management';
  onClose: () => void;
}

interface EnrichedKPI {
  id: string;
  kpi_library_id: string;
  kpi_type: 'strategic' | 'tactical' | 'operational';
  title: string;
  description: string;
  unit: string;
  icon: string;
  target_value: number;
  actual_value: number;
  progress: number;
}

export default function ProjectDetailSidebar({ 
  project, 
  lang, 
  mode, 
  onClose 
}: ProjectDetailSidebarProps) {
  const [kpis, setKpis] = useState<EnrichedKPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectKPIs();
  }, [project.id]);

  const loadProjectKPIs = async () => {
    setLoading(true);
    try {
      // Lade KPI-Werte aus der Datenbank
      const { data: kpiValues, error } = await supabase
        .from('pmo_kpi_values')
        .select('*')
        .eq('project_id', project.id);

      if (error) throw error;

      if (kpiValues) {
        // Enriche mit KPI-Library Daten
        const enriched: EnrichedKPI[] = kpiValues.map((kv: KPIValue) => {
          const kpiDef = kpiLibrary.kpis.find((k: any) => k.id === kv.kpi_id);
          
          if (!kpiDef) {
            return {
              id: kv.id,
              kpi_library_id: kv.kpi_id,
              kpi_type: 'operational' as const,
              title: 'Unknown KPI',
              description: 'No definition found',
              unit: '%',
              icon: 'help-circle',
              target_value: kv.target_value,
              actual_value: kv.actual_value,
              progress: Math.round((kv.actual_value / kv.target_value) * 100)
            };
          }

          // Nutze title_matrix und matrix für mehrsprachige Inhalte
          const title = (kpiDef as any).title_matrix?.[lang]?.[mode] || kpiDef.title;
          const description = kpiDef.matrix?.[lang]?.[mode] || '';
          
          return {
            id: kv.id,
            kpi_library_id: kv.kpi_id,
            kpi_type: kpiDef.kpi_type,
            title,
            description,
            unit: kpiDef.unit,
            icon: kpiDef.icon,
            target_value: kv.target_value,
            actual_value: kv.actual_value,
            progress: Math.round((kv.actual_value / kv.target_value) * 100)
          };
        });

        setKpis(enriched);
      }
    } catch (error) {
      console.error('Error loading project KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gruppiere KPIs nach Typ
  const groupedKPIs = {
    strategic: kpis.filter(k => k.kpi_type === 'strategic'),
    tactical: kpis.filter(k => k.kpi_type === 'tactical'),
    operational: kpis.filter(k => k.kpi_type === 'operational'),
  };

  // Berechne Gesamt-Progress
  const overallProgress = kpis.length > 0
    ? Math.round(kpis.reduce((sum, k) => sum + k.progress, 0) / kpis.length)
    : 0;

  // Helper functions
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'strategic': return <Target className="w-5 h-5 text-yellow-500" />;
      case 'tactical': return <Layers className="w-5 h-5 text-blue-500" />;
      case 'operational': return <Settings className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      strategic: {
        de: { colloquial: 'Strategisch', management: 'Strategic Alignment' },
        en: { colloquial: 'Strategic', management: 'Strategic Alignment' },
        es: { colloquial: 'Estratégico', management: 'Alineación Estratégica' }
      },
      tactical: {
        de: { colloquial: 'Taktisch', management: 'Tactical Governance' },
        en: { colloquial: 'Tactical', management: 'Tactical Governance' },
        es: { colloquial: 'Táctico', management: 'Gobernanza Táctica' }
      },
      operational: {
        de: { colloquial: 'Operativ', management: 'Operational Excellence' },
        en: { colloquial: 'Operational', management: 'Operational Excellence' },
        es: { colloquial: 'Operativo', management: 'Excelencia Operativa' }
      }
    };

    return labels[type as keyof typeof labels]?.[lang]?.[mode] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'border-yellow-500/30 bg-yellow-500/5';
      case 'tactical': return 'border-blue-500/30 bg-blue-500/5';
      case 'operational': return 'border-green-500/30 bg-green-500/5';
      default: return 'border-slate-500/30 bg-slate-500/5';
    }
  };

  // UI Labels (mehrsprachig)
  const labels = {
    title: {
      de: { colloquial: 'Projekt-Details', management: 'Project Performance Dashboard' },
      en: { colloquial: 'Project Details', management: 'Project Performance Dashboard' },
      es: { colloquial: 'Detalles del Proyecto', management: 'Panel de Rendimiento del Proyecto' }
    },
    overall: {
      de: { colloquial: 'Gesamt-Fortschritt', management: 'Overall Performance Index' },
      en: { colloquial: 'Overall Progress', management: 'Overall Performance Index' },
      es: { colloquial: 'Progreso General', management: 'Índice de Rendimiento General' }
    },
    kpis: {
      de: { colloquial: 'Kennzahlen', management: 'Key Performance Indicators' },
      en: { colloquial: 'Metrics', management: 'Key Performance Indicators' },
      es: { colloquial: 'Métricas', management: 'Indicadores Clave de Rendimiento' }
    },
    target: {
      de: { colloquial: 'Ziel', management: 'Target' },
      en: { colloquial: 'Goal', management: 'Target' },
      es: { colloquial: 'Objetivo', management: 'Target' }
    },
    current: {
      de: { colloquial: 'Aktuell', management: 'Current' },
      en: { colloquial: 'Current', management: 'Current' },
      es: { colloquial: 'Actual', management: 'Current' }
    },
    noKpis: {
      de: { colloquial: 'Keine Kennzahlen vorhanden', management: 'No KPIs tracked for this project' },
      en: { colloquial: 'No metrics available', management: 'No KPIs tracked for this project' },
      es: { colloquial: 'No hay métricas disponibles', management: 'No hay KPIs rastreados para este proyecto' }
    }
  };

  if (loading) {
    return (
      <div className="fixed top-0 right-0 h-full w-[500px] bg-slate-900/95 backdrop-blur-xl border-l-2 border-slate-700 shadow-2xl z-50 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-[500px] bg-slate-900/95 backdrop-blur-xl border-l-2 border-slate-700 shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-white mb-2">
              {project.name_matrix?.[lang]?.[mode] || project.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {project.description_matrix?.[lang]?.[mode] || project.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Overall Progress */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">
              {labels.overall[lang][mode]}
            </span>
            <span className={`text-2xl font-black ${getProgressTextColor(overallProgress)}`}>
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Groups */}
      <div className="p-6 space-y-6">
        {kpis.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">{labels.noKpis[lang][mode]}</p>
          </div>
        ) : (
          <>
            {(['strategic', 'tactical', 'operational'] as const).map((type) => {
              const typeKPIs = groupedKPIs[type];
              if (typeKPIs.length === 0) return null;

              return (
                <div key={type} className={`border-2 rounded-xl p-4 ${getTypeColor(type)}`}>
                  {/* Group Header */}
                  <div className="flex items-center gap-2 mb-4">
                    {getTypeIcon(type)}
                    <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                      {getTypeLabel(type)}
                    </h3>
                    <span className="text-xs text-slate-400">
                      ({typeKPIs.length})
                    </span>
                  </div>

                  {/* KPI Cards */}
                  <div className="space-y-3">
                    {typeKPIs.map((kpi) => (
                      <div
                        key={kpi.id}
                        className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50"
                      >
                        {/* KPI Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 pr-2">
                            <h4 className="text-sm font-semibold text-slate-200 mb-1">
                              {kpi.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {kpi.description}
                            </p>
                          </div>
                          <div className={`text-xl font-black ${getProgressTextColor(kpi.progress)}`}>
                            {kpi.progress}%
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${getProgressColor(kpi.progress)}`}
                            style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                          />
                        </div>

                        {/* Values */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">
                            {labels.current[lang][mode]}: <span className="font-semibold text-white">{kpi.actual_value}{kpi.unit}</span>
                          </span>
                          <span className="text-slate-400">
                            {labels.target[lang][mode]}: <span className="font-semibold text-white">{kpi.target_value}{kpi.unit}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

