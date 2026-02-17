"use client";

// Project Detail Sidebar - Custom Metrics Editor
// Vollständig benutzerdefinierte Metriken mit automatischer Gesamt-Fortschrittsberechnung
// Gemäß .cursorrules: 2x3 Matrix (DE/EN/ES x Colloquial/Management)

import React, { useState, useEffect, useMemo } from "react";
import { X, AlertCircle, Plus, Save, Trash2 } from "lucide-react";
import { supabase, type Project, type CustomMetric } from "@/lib/supabase";

interface ProjectDetailSidebarProps {
  project: Project;
  lang: "de" | "en" | "es";
  mode: "colloquial" | "management";
  onClose: () => void;
  onSaveComplete?: () => void;
}

// 2x3 Matrix Labels (lang x mode)
const LABELS = {
  metric_name_placeholder: {
    de: { colloquial: "Metrik Name (z.B. Server)", management: "KPI Bezeichnung" },
    en: { colloquial: "Metric Name (e.g. Servers)", management: "KPI Designation" },
    es: { colloquial: "Nombre de métrica", management: "Designación de KPI" },
  },
  metric_unit_placeholder: {
    de: { colloquial: "Einheit", management: "Unit" },
    en: { colloquial: "Unit", management: "Unit" },
    es: { colloquial: "Unidad", management: "Unidad" },
  },
  add_metric_button: {
    de: { colloquial: "+ Eigene Messung hinzufügen", management: "+ Define Custom KPI" },
    en: { colloquial: "+ Add custom measurement", management: "+ Define Custom KPI" },
    es: { colloquial: "+ Añadir medición propia", management: "+ Definir KPI personalizado" },
  },
  calculation_hint: {
    de: { colloquial: "Durchschnitt deiner Ziele", management: "Aggregierter Performance Index (Ø)" },
    en: { colloquial: "Average of your goals", management: "Aggregated Performance Score (Ø)" },
    es: { colloquial: "Promedio de tus objetivos", management: "Índice de Desempeño Agregado (Ø)" },
  },
  overall: {
    de: { colloquial: "Gesamt-Fortschritt", management: "Overall Performance Index" },
    en: { colloquial: "Overall Progress", management: "Overall Performance Index" },
    es: { colloquial: "Progreso General", management: "Índice de Rendimiento General" },
  },
  current: {
    de: { colloquial: "Aktuell", management: "Current" },
    en: { colloquial: "Current", management: "Current" },
    es: { colloquial: "Actual", management: "Current" },
  },
  goal: {
    de: { colloquial: "Ziel", management: "Target" },
    en: { colloquial: "Goal", management: "Target" },
    es: { colloquial: "Objetivo", management: "Target" },
  },
  save: {
    de: { colloquial: "Speichern", management: "Save Changes" },
    en: { colloquial: "Save", management: "Save Changes" },
    es: { colloquial: "Guardar", management: "Guardar Cambios" },
  },
  no_metrics: {
    de: { colloquial: "Noch keine Messwerte. Leg deine erste eigene Metrik an!", management: "Keine KPIs definiert. Bitte Metriken zur Erfolgsmessung konfigurieren." },
    en: { colloquial: "No metrics yet. Add your first custom measurement!", management: "No KPIs defined. Please configure performance metrics." },
    es: { colloquial: "Aún no hay métricas. ¡Añade tu primera medición!", management: "No hay KPIs definidos. Por favor configure las métricas de rendimiento." },
  },
};

export default function ProjectDetailSidebar({
  project,
  lang,
  mode,
  onClose,
  onSaveComplete,
}: ProjectDetailSidebarProps) {
  const [metrics, setMetrics] = useState<CustomMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectMetrics();
  }, [project.id]);

  const loadProjectMetrics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pmo_projects")
        .select("metrics")
        .eq("id", project.id)
        .single();

      if (error) throw error;
      const stored = (data?.metrics as CustomMetric[]) ?? [];
      const parsed = Array.isArray(stored) ? stored : [];
      setMetrics(parsed);
    } catch (error) {
      console.error("Error loading project metrics:", error);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  // Live-Berechnung: Overall Progress = Durchschnitt aller Erfüllungsgrade (max 100% pro Metrik)
  const overallProgress = useMemo(() => {
    if (metrics.length === 0) return 0;
    const sum = metrics.reduce((acc, m) => {
      const fulfillment = m.goal > 0 ? (m.current / m.goal) * 100 : 0;
      return acc + Math.min(fulfillment, 100);
    }, 0);
    return Math.round(sum / metrics.length);
  }, [metrics]);

  const updateMetric = (id: string, field: keyof CustomMetric, value: string | number) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id !== id ? m : { ...m, [field]: value }))
    );
  };

  const addMetric = () => {
    const newMetric: CustomMetric = {
      id: `m-${Date.now()}`,
      name: "",
      unit: "",
      current: 0,
      goal: 100,
    };
    setMetrics((prev) => [...prev, newMetric]);
  };

  const deleteMetric = (id: string) => {
    setMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const saveMetrics = async () => {
    try {
      const { error } = await supabase
        .from("pmo_projects")
        .update({
          metrics,
          updated_at: new Date().toISOString(),
        })
        .eq("id", project.id);

      if (error) throw error;

      onSaveComplete?.();

      const msg =
        lang === "de"
          ? "Metriken gespeichert!"
          : lang === "es"
          ? "¡Métricas guardadas!"
          : "Metrics saved!";
      alert(msg);
    } catch (error) {
      console.error("Error saving metrics:", error);
      const errMsg =
        lang === "de"
          ? "Fehler beim Speichern."
          : lang === "es"
          ? "Error al guardar."
          : "Error saving.";
      alert(errMsg);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressTextColor = (progress: number) => {
    if (progress >= 80) return "text-green-500";
    if (progress >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getMetricProgress = (m: CustomMetric) => {
    if (m.goal <= 0) return 0;
    return Math.min(Math.round((m.current / m.goal) * 100), 100);
  };

  if (loading) {
    return (
      <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] max-w-[90vw] bg-slate-900/95 backdrop-blur-xl border-l-2 border-slate-700 shadow-2xl z-50 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] max-w-[90vw] bg-slate-900/95 backdrop-blur-xl border-l-2 border-slate-700 shadow-2xl z-50 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4 sm:p-6 z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-4 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 truncate">
              {project.name_matrix?.[lang]?.[mode] || project.name}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
              {project.description_matrix?.[lang]?.[mode] || project.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Overall Progress (Auto-Calculation) */}
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">
              {LABELS.overall[lang][mode]}
            </span>
            <span className={`text-2xl font-black ${getProgressTextColor(overallProgress)}`}>
              {overallProgress}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(overallProgress)}`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {LABELS.calculation_hint[lang][mode]}
          </p>
        </div>
      </div>

      {/* Custom Metrics List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {metrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 mb-4 text-slate-600" />
            <p className="text-center text-slate-400 mb-6 max-w-md">
              {LABELS.no_metrics[lang][mode]}
            </p>
            <button
              onClick={addMetric}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {LABELS.add_metric_button[lang][mode]}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {metrics.map((m) => {
              const progress = getMetricProgress(m);
              return (
                <div
                  key={m.id}
                  className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <input
                        type="text"
                        value={m.name}
                        onChange={(e) => updateMetric(m.id, "name", e.target.value)}
                        placeholder={LABELS.metric_name_placeholder[lang][mode]}
                        className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      />
                      <input
                        type="text"
                        value={m.unit}
                        onChange={(e) => updateMetric(m.id, "unit", e.target.value)}
                        placeholder={LABELS.metric_unit_placeholder[lang][mode]}
                        className="w-full max-w-[120px] bg-slate-700/50 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-600 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => deleteMetric(m.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title={lang === "de" ? "Löschen" : lang === "es" ? "Eliminar" : "Delete"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Progress</span>
                      <span className={`text-lg font-black ${getProgressTextColor(progress)}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current / Goal */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        {LABELS.current[lang][mode]}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={m.current}
                          onChange={(e) =>
                            updateMetric(m.id, "current", parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-600 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                          step="0.01"
                        />
                        <span className="text-xs text-slate-400 whitespace-nowrap">{m.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">
                        {LABELS.goal[lang][mode]}
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={m.goal}
                          onChange={(e) =>
                            updateMetric(m.id, "goal", parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-700/50 text-white text-sm font-semibold px-3 py-1.5 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          step="0.01"
                        />
                        <span className="text-xs text-slate-400 whitespace-nowrap">{m.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={addMetric}
              className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {LABELS.add_metric_button[lang][mode]}
            </button>
          </div>
        )}
      </div>

      {/* Save Button (Sticky Footer) */}
      <div className="sticky bottom-0 bg-slate-900 border-t border-slate-700 p-4">
        <button
          onClick={saveMetrics}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {LABELS.save[lang][mode]}
        </button>
      </div>
    </div>
  );
}
