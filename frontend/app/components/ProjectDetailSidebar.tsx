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

  // Check if this is the DUMMY project
  const isDummyProject = project.name?.includes('Cloud Migration') || project.name?.includes('DUMMY');

  useEffect(() => {
    if (isDummyProject) {
      loadDemoKPIs();
    } else {
      loadProjectKPIs();
    }
  }, [project.id, isDummyProject]);

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
            kpi_type: kpiDef.kpi_type as 'strategic' | 'tactical' | 'operational',
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

  // ========================================
  // DEMO KPIs für Cloud Migration DUMMY
  // ========================================
  const loadDemoKPIs = () => {
    setLoading(true);

    const demoKPIs: EnrichedKPI[] = [
      // Strategic KPIs
      {
        id: 'demo-spi',
        kpi_library_id: 'spi',
        kpi_type: 'strategic',
        title: lang === 'de' ? 'Schedule Performance Index (SPI)' : lang === 'es' ? 'Índice de Rendimiento del Cronograma' : 'Schedule Performance Index (SPI)',
        description: lang === 'de' ? 'Zeitplan-Effizienz: > 1.0 = Vor Plan, < 1.0 = Verzögert' : lang === 'es' ? 'Eficiencia del cronograma: > 1.0 = Adelantado, < 1.0 = Retrasado' : 'Schedule efficiency: > 1.0 = Ahead, < 1.0 = Behind',
        unit: '',
        icon: 'calendar',
        target_value: 1.0,
        actual_value: 0.95,
        progress: 95,
      },
      {
        id: 'demo-cpi',
        kpi_library_id: 'cpi',
        kpi_type: 'strategic',
        title: lang === 'de' ? 'Cost Performance Index (CPI)' : lang === 'es' ? 'Índice de Rendimiento de Costos' : 'Cost Performance Index (CPI)',
        description: lang === 'de' ? 'Budget-Effizienz: > 1.0 = Unter Budget, < 1.0 = Über Budget' : lang === 'es' ? 'Eficiencia del presupuesto: > 1.0 = Bajo presupuesto, < 1.0 = Sobre presupuesto' : 'Budget efficiency: > 1.0 = Under budget, < 1.0 = Over budget',
        unit: '',
        icon: 'dollar-sign',
        target_value: 1.0,
        actual_value: 0.98,
        progress: 98,
      },
      {
        id: 'demo-stakeholder',
        kpi_library_id: 'stakeholder-satisfaction',
        kpi_type: 'strategic',
        title: lang === 'de' ? 'Stakeholder-Zufriedenheit' : lang === 'es' ? 'Satisfacción de Stakeholders' : 'Stakeholder Satisfaction',
        description: lang === 'de' ? 'Durchschnittliche Zufriedenheit der Stakeholder' : lang === 'es' ? 'Satisfacción promedio de stakeholders' : 'Average stakeholder satisfaction score',
        unit: '%',
        icon: 'users',
        target_value: 85,
        actual_value: 89,
        progress: 105,
      },
      // Tactical KPIs
      {
        id: 'demo-velocity',
        kpi_library_id: 'team-velocity',
        kpi_type: 'tactical',
        title: lang === 'de' ? 'Team Velocity' : lang === 'es' ? 'Velocidad del Equipo' : 'Team Velocity',
        description: lang === 'de' ? 'Story Points pro Sprint' : lang === 'es' ? 'Puntos de historia por sprint' : 'Story points completed per sprint',
        unit: ' SP',
        icon: 'zap',
        target_value: 45,
        actual_value: 48,
        progress: 107,
      },
      {
        id: 'demo-burndown',
        kpi_library_id: 'sprint-burndown',
        kpi_type: 'tactical',
        title: lang === 'de' ? 'Sprint Burndown' : lang === 'es' ? 'Burndown del Sprint' : 'Sprint Burndown',
        description: lang === 'de' ? 'Restliche Arbeit im aktuellen Sprint' : lang === 'es' ? 'Trabajo restante en el sprint actual' : 'Remaining work in current sprint',
        unit: '%',
        icon: 'trending-down',
        target_value: 100,
        actual_value: 72,
        progress: 72,
      },
      {
        id: 'demo-budget-util',
        kpi_library_id: 'budget-utilization',
        kpi_type: 'tactical',
        title: lang === 'de' ? 'Budget-Auslastung' : lang === 'es' ? 'Utilización del Presupuesto' : 'Budget Utilization',
        description: lang === 'de' ? 'Verbrauchtes Budget vs. Zeitplan' : lang === 'es' ? 'Presupuesto gastado vs. cronograma' : 'Budget spent vs. timeline progress',
        unit: '%',
        icon: 'percent',
        target_value: 65,
        actual_value: 65,
        progress: 100,
      },
      // Operational KPIs
      {
        id: 'demo-defect-rate',
        kpi_library_id: 'defect-rate',
        kpi_type: 'operational',
        title: lang === 'de' ? 'Fehlerrate' : lang === 'es' ? 'Tasa de Defectos' : 'Defect Rate',
        description: lang === 'de' ? 'Anzahl der Fehler pro 1000 Codezeilen' : lang === 'es' ? 'Número de defectos por 1000 líneas de código' : 'Number of defects per 1000 lines of code',
        unit: ' /1k LOC',
        icon: 'alert-circle',
        target_value: 5,
        actual_value: 3,
        progress: 140, // Lower is better, but we invert for display
      },
      {
        id: 'demo-test-coverage',
        kpi_library_id: 'test-coverage',
        kpi_type: 'operational',
        title: lang === 'de' ? 'Test-Abdeckung' : lang === 'es' ? 'Cobertura de Pruebas' : 'Test Coverage',
        description: lang === 'de' ? 'Prozentsatz des Codes mit automatisierten Tests' : lang === 'es' ? 'Porcentaje de código con pruebas automatizadas' : 'Percentage of code covered by automated tests',
        unit: '%',
        icon: 'check-circle',
        target_value: 80,
        actual_value: 85,
        progress: 106,
      },
      {
        id: 'demo-deployment-freq',
        kpi_library_id: 'deployment-frequency',
        kpi_type: 'operational',
        title: lang === 'de' ? 'Deployment-Frequenz' : lang === 'es' ? 'Frecuencia de Despliegue' : 'Deployment Frequency',
        description: lang === 'de' ? 'Anzahl erfolgreicher Deployments pro Woche' : lang === 'es' ? 'Número de despliegues exitosos por semana' : 'Number of successful deployments per week',
        unit: ' /week',
        icon: 'upload-cloud',
        target_value: 5,
        actual_value: 6,
        progress: 120,
      },
    ];

    setKpis(demoKPIs);
    setLoading(false);
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
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 mb-4 text-slate-600" />
            <p className="text-center text-slate-400 mb-6 max-w-md">
              {isDummyProject ? (
                <>
                  {lang === 'de' && 'Keine Projekt-KPIs verfügbar'}
                  {lang === 'en' && 'No project KPIs available'}
                  {lang === 'es' && 'No hay KPIs de proyecto disponibles'}
                </>
              ) : (
                <>
                  {lang === 'de' && mode === 'colloquial' && 'Noch keine Kennzahlen erfasst. Füge projektspezifische KPIs hinzu um den Fortschritt zu tracken.'}
                  {lang === 'de' && mode === 'management' && 'No KPIs tracked for this project yet. Define project-specific KPIs to monitor performance.'}
                  {lang === 'en' && mode === 'colloquial' && 'No metrics tracked yet. Add project-specific KPIs to monitor progress.'}
                  {lang === 'en' && mode === 'management' && 'No KPIs tracked for this project yet. Define project-specific KPIs to monitor performance.'}
                  {lang === 'es' && mode === 'colloquial' && 'Aún no hay métricas rastreadas. Agrega KPIs específicos del proyecto para monitorear el progreso.'}
                  {lang === 'es' && mode === 'management' && 'No se rastrean KPIs para este proyecto aún. Defina KPIs específicos del proyecto para monitorear el rendimiento.'}
                </>
              )}
            </p>
            {!isDummyProject && (
              <button
                onClick={() => alert('KPI-Editor - Coming soon! 🚀')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <TrendingUp className="w-5 h-5" />
                {lang === 'de' && 'KPIs hinzufügen'}
                {lang === 'en' && 'Add KPIs'}
                {lang === 'es' && 'Agregar KPIs'}
              </button>
            )}
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

