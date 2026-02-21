"use client";

/**
 * Project Definition Hub - Bindeglied zwischen Intake/Airlock und operativem Dashboard
 * Opt-In: User wählt Impact Dimensions, definiert Zielwerte als Baseline
 * Eigene Nomenklatur (keine geschützten Begriffe)
 */

import React, { useState, useEffect } from "react";
import { Package, DollarSign, Calendar, AlertTriangle, Users, Save } from "lucide-react";

export type ImpactDimensionId =
  | "deliverable_definition"
  | "financials"
  | "timeline"
  | "risks"
  | "team_resources";

interface ImpactDimension {
  id: ImpactDimensionId;
  icon: React.ReactNode;
  labels: { de: string; en: string; es: string };
}

const IMPACT_DIMENSIONS: ImpactDimension[] = [
  {
    id: "deliverable_definition",
    icon: <Package className="w-6 h-6" />,
    labels: {
      de: "Deliverable Definition",
      en: "Deliverable Definition",
      es: "Definición de Entregables",
    },
  },
  {
    id: "financials",
    icon: <DollarSign className="w-6 h-6" />,
    labels: {
      de: "Financial Framework",
      en: "Financial Framework",
      es: "Marco Financiero",
    },
  },
  {
    id: "timeline",
    icon: <Calendar className="w-6 h-6" />,
    labels: {
      de: "Timeline & Pace",
      en: "Timeline & Pace",
      es: "Cronograma y Ritmo",
    },
  },
  {
    id: "risks",
    icon: <AlertTriangle className="w-6 h-6" />,
    labels: {
      de: "Uncertainty Radar",
      en: "Uncertainty Radar",
      es: "Radar de Incertidumbre",
    },
  },
  {
    id: "team_resources",
    icon: <Users className="w-6 h-6" />,
    labels: {
      de: "Team & Resources",
      en: "Team & Resources",
      es: "Equipo y Recursos",
    },
  },
];

interface BaselineData {
  budget_cap?: number;
  deadline?: string;
  deliverable_count?: number;
  risk_register_count?: number;
  team_size?: number;
  [key: string]: unknown;
}

interface ProjectDefinitionHubProps {
  projectId: string;
  project: {
    budget?: number;
    start_date?: string | null;
    end_date?: string | null;
    active_modules?: string[];
    baseline_data?: BaselineData | null;
  };
  charter?: {
    business_case_summary?: string | null;
    strategic_fit_score?: number | null;
  } | null;
  lang: "de" | "en" | "es";
  mode: "colloquial" | "management";
  onSave: (activeModules: string[], baselineData: BaselineData) => Promise<void>;
}

export default function ProjectDefinitionHub({
  projectId,
  project,
  charter,
  lang,
  mode,
  onSave,
}: ProjectDefinitionHubProps) {
  const [activeModules, setActiveModules] = useState<string[]>(
    project.active_modules ?? []
  );
  const [baselineData, setBaselineData] = useState<BaselineData>(
    (project.baseline_data as BaselineData) ?? {}
  );
  const [saving, setSaving] = useState(false);

  // Inheritance: Vorauswahl aus Charter/Business Case (nur wenn Projekt noch keine Module hat)
  useEffect(() => {
    const hasProjectModules =
      project.active_modules && project.active_modules.length > 0;
    if (!hasProjectModules && charter?.business_case_summary) {
      setActiveModules(["deliverable_definition", "financials", "timeline"]);
    }
  }, [project.active_modules, charter?.business_case_summary]);

  const toggleModule = (id: ImpactDimensionId) => {
    setActiveModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const updateBaseline = (key: string, value: unknown) => {
    setBaselineData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(activeModules, baselineData);
    } finally {
      setSaving(false);
    }
  };

  // Draft Values aus Projekt/Charter (Inheritance)
  const draftBudget = project.budget ?? charter ? undefined : undefined;
  const draftDeadline = project.end_date ?? undefined;

  const labels = {
    title: {
      de: "Execution Blueprint",
      en: "Execution Blueprint",
      es: "Plan de Ejecución",
    },
    subtitle: {
      de: "Wähle deine Impact Dimensions und definiere die Ziele",
      en: "Select your Impact Dimensions and define targets",
      es: "Selecciona tus dimensiones de impacto y define objetivos",
    },
    moduleMatrix: {
      de: "Impact Dimensions",
      en: "Impact Dimensions",
      es: "Dimensiones de Impacto",
    },
    dataFlow: {
      de: "Zielwerte definieren",
      en: "Define Target Values",
      es: "Definir Valores Objetivo",
    },
    save: {
      de: "Als Baseline speichern",
      en: "Save as Baseline",
      es: "Guardar como Línea Base",
    },
    draftHint: {
      de: "Vorausgefüllt aus Business Case",
      en: "Pre-filled from Business Case",
      es: "Pre-rellenado desde Business Case",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-cyan-400">
          {labels.title[lang]}
        </h2>
        <p className="text-slate-400 mt-1">{labels.subtitle[lang]}</p>
      </div>

      {/* Sektion A: Module Matrix */}
      <section>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          {labels.moduleMatrix[lang]}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {IMPACT_DIMENSIONS.map((dim) => {
            const isActive = activeModules.includes(dim.id);
            return (
              <button
                key={dim.id}
                onClick={() => toggleModule(dim.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  flex flex-col gap-2 min-h-[100px]
                  ${
                    isActive
                      ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/10"
                      : "bg-slate-800/50 border-slate-700 text-slate-500 opacity-60 hover:opacity-80 hover:border-slate-600"
                  }
                `}
              >
                <span className="text-2xl">{dim.icon}</span>
                <span className="text-sm font-semibold">
                  {dim.labels[lang]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sektion B: Data Flow (dynamische Eingabemasken) */}
      {activeModules.length > 0 && (
        <section className="bg-slate-800/80 rounded-xl border border-slate-700 p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
            {labels.dataFlow[lang]}
          </h3>
          <div className="space-y-6">
            {activeModules.includes("financials") && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Budget Cap (€)
                </label>
                <input
                  type="number"
                  value={baselineData.budget_cap ?? draftBudget ?? ""}
                  onChange={(e) =>
                    updateBaseline(
                      "budget_cap",
                      e.target.value ? parseInt(e.target.value, 10) : undefined
                    )
                  }
                  placeholder={draftBudget ? String(draftBudget) : "z.B. 500000"}
                  className="w-full max-w-xs bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                />
                {draftBudget && !baselineData.budget_cap && (
                  <p className="text-xs text-cyan-400/80 mt-1">
                    {labels.draftHint[lang]}
                  </p>
                )}
              </div>
            )}
            {activeModules.includes("timeline") && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={
                    baselineData.deadline ?? draftDeadline ?? ""
                  }
                  onChange={(e) =>
                    updateBaseline("deadline", e.target.value || undefined)
                  }
                  className="w-full max-w-xs bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                />
                {draftDeadline && !baselineData.deadline && (
                  <p className="text-xs text-cyan-400/80 mt-1">
                    {labels.draftHint[lang]}
                  </p>
                )}
              </div>
            )}
            {activeModules.includes("deliverable_definition") && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  {lang === "de"
                    ? "Anzahl Haupt-Deliverables"
                    : lang === "es"
                    ? "Número de Entregables Principales"
                    : "Number of Key Deliverables"}
                </label>
                <input
                  type="number"
                  value={baselineData.deliverable_count ?? ""}
                  onChange={(e) =>
                    updateBaseline(
                      "deliverable_count",
                      e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined
                    )
                  }
                  placeholder="z.B. 5"
                  className="w-full max-w-xs bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                />
              </div>
            )}
            {activeModules.includes("risks") && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  {lang === "de"
                    ? "Risiken im Register (Ziel)"
                    : lang === "es"
                    ? "Riesgos en Registro (Objetivo)"
                    : "Risks in Register (Target)"}
                </label>
                <input
                  type="number"
                  value={baselineData.risk_register_count ?? ""}
                  onChange={(e) =>
                    updateBaseline(
                      "risk_register_count",
                      e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined
                    )
                  }
                  placeholder="z.B. 10"
                  className="w-full max-w-xs bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                />
              </div>
            )}
            {activeModules.includes("team_resources") && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  {lang === "de"
                    ? "Team-Größe (FTE)"
                    : lang === "es"
                    ? "Tamaño del Equipo (FTE)"
                    : "Team Size (FTE)"}
                </label>
                <input
                  type="number"
                  value={baselineData.team_size ?? ""}
                  onChange={(e) =>
                    updateBaseline(
                      "team_size",
                      e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined
                    )
                  }
                  placeholder="z.B. 5"
                  className="w-full max-w-xs bg-slate-700/50 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none"
                />
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-colors flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {labels.save[lang]}
          </button>
        </section>
      )}

      {activeModules.length === 0 && (
        <p className="text-slate-500 text-sm italic">
          {lang === "de" &&
            "Wähle mindestens eine Impact Dimension, um Zielwerte zu definieren."}
          {lang === "en" &&
            "Select at least one Impact Dimension to define target values."}
          {lang === "es" &&
            "Selecciona al menos una dimensión de impacto para definir valores objetivo."}
        </p>
      )}
    </div>
  );
}
