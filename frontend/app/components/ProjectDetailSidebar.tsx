"use client";

// Project Detail Sidebar - KPI Editor (Inline Editing)
// Gemäß .cursorrules: 2x3 Matrix (DE/EN/ES x Colloquial/Management)

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, AlertCircle, Plus, Save, Trash2 } from 'lucide-react';
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
  title: string;
  description: string;
  unit: string;
  target_value: number;
  actual_value: number;
  progress: number;
  isNew?: boolean; // Flag für neu hinzugefügte KPIs
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
              title: 'Unknown KPI',
              description: 'No definition found',
              unit: '%',
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
            title,
            description,
            unit: kpiDef.unit,
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
      {
        id: 'demo-spi',
        kpi_library_id: 'spi',
        title: lang === 'de' ? 'Schedule Performance Index (SPI)' : lang === 'es' ? 'Índice de Rendimiento del Cronograma' : 'Schedule Performance Index (SPI)',
        description: lang === 'de' ? 'Zeitplan-Effizienz: > 1.0 = Vor Plan, < 1.0 = Verzögert' : lang === 'es' ? 'Eficiencia del cronograma: > 1.0 = Adelantado, < 1.0 = Retrasado' : 'Schedule efficiency: > 1.0 = Ahead, < 1.0 = Behind',
        unit: '',
        target_value: 1.0,
        actual_value: 0.95,
        progress: 95,
      },
      {
        id: 'demo-cpi',
        kpi_library_id: 'cpi',
        title: lang === 'de' ? 'Cost Performance Index (CPI)' : lang === 'es' ? 'Índice de Rendimiento de Costos' : 'Cost Performance Index (CPI)',
        description: lang === 'de' ? 'Budget-Effizienz: > 1.0 = Unter Budget, < 1.0 = Über Budget' : lang === 'es' ? 'Eficiencia del presupuesto: > 1.0 = Bajo presupuesto, < 1.0 = Sobre presupuesto' : 'Budget efficiency: > 1.0 = Under budget, < 1.0 = Over budget',
        unit: '',
        target_value: 1.0,
        actual_value: 0.98,
        progress: 98,
      },
      {
        id: 'demo-stakeholder',
        kpi_library_id: 'stakeholder-satisfaction',
        title: lang === 'de' ? 'Stakeholder-Zufriedenheit' : lang === 'es' ? 'Satisfacción de Stakeholders' : 'Stakeholder Satisfaction',
        description: lang === 'de' ? 'Durchschnittliche Zufriedenheit der Stakeholder' : lang === 'es' ? 'Satisfacción promedio de stakeholders' : 'Average stakeholder satisfaction score',
        unit: '%',
        target_value: 85,
        actual_value: 89,
        progress: 105,
      },
      {
        id: 'demo-velocity',
        kpi_library_id: 'team-velocity',
        title: lang === 'de' ? 'Team Velocity' : lang === 'es' ? 'Velocidad del Equipo' : 'Team Velocity',
        description: lang === 'de' ? 'Story Points pro Sprint' : lang === 'es' ? 'Puntos de historia por sprint' : 'Story points completed per sprint',
        unit: ' SP',
        target_value: 45,
        actual_value: 48,
        progress: 107,
      },
      {
        id: 'demo-burndown',
        kpi_library_id: 'sprint-burndown',
        title: lang === 'de' ? 'Sprint Burndown' : lang === 'es' ? 'Burndown del Sprint' : 'Sprint Burndown',
        description: lang === 'de' ? 'Restliche Arbeit im aktuellen Sprint' : lang === 'es' ? 'Trabajo restante en el sprint actual' : 'Remaining work in current sprint',
        unit: '%',
        target_value: 100,
        actual_value: 72,
        progress: 72,
      },
      {
        id: 'demo-budget-util',
        kpi_library_id: 'budget-utilization',
        title: lang === 'de' ? 'Budget-Auslastung' : lang === 'es' ? 'Utilización del Presupuesto' : 'Budget Utilization',
        description: lang === 'de' ? 'Verbrauchtes Budget vs. Zeitplan' : lang === 'es' ? 'Presupuesto gastado vs. cronograma' : 'Budget spent vs. timeline progress',
        unit: '%',
        target_value: 65,
        actual_value: 65,
        progress: 100,
      },
      {
        id: 'demo-test-coverage',
        kpi_library_id: 'test-coverage',
        title: lang === 'de' ? 'Test-Abdeckung' : lang === 'es' ? 'Cobertura de Pruebas' : 'Test Coverage',
        description: lang === 'de' ? 'Prozentsatz des Codes mit automatisierten Tests' : lang === 'es' ? 'Porcentaje de código con pruebas automatizadas' : 'Percentage of code covered by automated tests',
        unit: '%',
        target_value: 80,
        actual_value: 85,
        progress: 106,
      },
      {
        id: 'demo-deployment-freq',
        kpi_library_id: 'deployment-frequency',
        title: lang === 'de' ? 'Deployment-Frequenz' : lang === 'es' ? 'Frecuencia de Despliegue' : 'Deployment Frequency',
        description: lang === 'de' ? 'Anzahl erfolgreicher Deployments pro Woche' : lang === 'es' ? 'Número de despliegues exitosos por semana' : 'Number of successful deployments per week',
        unit: ' /week',
        target_value: 5,
        actual_value: 6,
        progress: 120,
      },
    ];

    setKpis(demoKPIs);
    setLoading(false);
  };

  // Berechne Gesamt-Progress
  const overallProgress = kpis.length > 0
    ? Math.round(kpis.reduce((sum, k) => sum + k.progress, 0) / kpis.length)
    : 0;

  // ========================================
  // KPI UPDATE HANDLERS (Inline Editing)
  // ========================================
  const updateKPI = (id: string, field: 'title' | 'actual_value' | 'target_value', value: string | number) => {
    setKpis((prev) =>
      prev.map((kpi) => {
        if (kpi.id !== id) return kpi;

        const updated = { ...kpi, [field]: value };

        // Recalculate progress if values changed
        if (field === 'actual_value' || field === 'target_value') {
          const actual = field === 'actual_value' ? Number(value) : kpi.actual_value;
          const target = field === 'target_value' ? Number(value) : kpi.target_value;
          updated.progress = target > 0 ? Math.round((actual / target) * 100) : 0;
        }

        return updated;
      })
    );
  };

  const addNewKPI = () => {
    const newKPI: EnrichedKPI = {
      id: `new-${Date.now()}`,
      kpi_library_id: '',
      title: lang === 'de' ? 'Neue Metrik' : lang === 'es' ? 'Nueva Métrica' : 'New Metric',
      description: '',
      unit: '%',
      target_value: 100,
      actual_value: 0,
      progress: 0,
      isNew: true,
    };
    setKpis((prev) => [...prev, newKPI]);
  };

  const deleteKPI = (id: string) => {
    setKpis((prev) => prev.filter((kpi) => kpi.id !== id));
  };

  const saveKPIs = () => {
    console.log('💾 KPIs to save:', kpis);
    alert(
      lang === 'de'
        ? 'KPIs gespeichert! (Siehe Console)'
        : lang === 'es'
        ? 'KPIs guardados! (Ver consola)'
        : 'KPIs saved! (See console)'
    );
  };

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
    addMetric: {
      de: { colloquial: 'Metrik hinzufügen', management: 'Add KPI' },
      en: { colloquial: 'Add Metric', management: 'Add KPI' },
      es: { colloquial: 'Agregar Métrica', management: 'Agregar KPI' }
    },
    save: {
      de: { colloquial: 'Speichern', management: 'Save Changes' },
      en: { colloquial: 'Save', management: 'Save Changes' },
      es: { colloquial: 'Guardar', management: 'Guardar Cambios' }
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

      {/* KPI List (Flat, Editable) */}
      <div className="p-6 space-y-4">
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
            <button
              onClick={addNewKPI}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {labels.addMetric[lang][mode]}
            </button>
          </div>
        ) : (
          <>
            {/* Flat KPI List with Inline Editing */}
            <div className="space-y-3">
              {kpis.map((kpi, index) => (
                <div
                  key={kpi.id}
                  className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  {/* KPI Header with Inline Title Edit */}
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={kpi.title}
                        onChange={(e) => updateKPI(kpi.id, 'title', e.target.value)}
                        className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        placeholder={lang === 'de' ? 'Metrik-Name' : lang === 'es' ? 'Nombre de métrica' : 'Metric name'}
                      />
                      {kpi.description && (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {kpi.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteKPI(kpi.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title={lang === 'de' ? 'Löschen' : lang === 'es' ? 'Eliminar' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar with Live Update */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className={`text-lg font-black ${getProgressTextColor(kpi.progress)}`}>
                        {kpi.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(kpi.progress)}`}
                        style={{ width: `${Math.min(kpi.progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline Value Editors */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Actual Value */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        {labels.current[lang][mode]}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={kpi.actual_value}
                          onChange={(e) => updateKPI(kpi.id, 'actual_value', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                          step="0.01"
                        />
                        <span className="text-xs text-slate-400 whitespace-nowrap">{kpi.unit}</span>
                      </div>
                    </div>

                    {/* Target Value */}
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        {labels.target[lang][mode]}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={kpi.target_value}
                          onChange={(e) => updateKPI(kpi.id, 'target_value', parseFloat(e.target.value) || 0)}
                          className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          step="0.01"
                        />
                        <span className="text-xs text-slate-400 whitespace-nowrap">{kpi.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Metric Button */}
            <button
              onClick={addNewKPI}
              className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {labels.addMetric[lang][mode]}
            </button>
          </>
        )}
      </div>

      {/* Save Button (Sticky Footer) */}
      {kpis.length > 0 && (
        <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
          <button
            onClick={saveKPIs}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {labels.save[lang][mode]}
          </button>
        </div>
      )}
    </div>
  );
}

