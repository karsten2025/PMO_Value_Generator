"use client";

import React from "react";
import { Target, Sliders, FolderKanban } from "lucide-react";

export type ProjectType = "strategic" | "tactical" | "operational";
export type ProjectStatus = "green" | "yellow" | "red";

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  progress: number;
  status: ProjectStatus;
}

export interface Weights {
  str: number;
  tac: number;
  ops: number;
}

export interface CalculatedScores {
  strategic: number;
  tactical: number;
  operational: number;
  total: number;
}

interface HealthHubSidebarContentProps {
  weights: Weights;
  onWeightsChange: (weights: Weights) => void;
  projects: Project[];
  includedProjectIds: string[];
  onIncludedProjectIdsChange: (ids: string[]) => void;
  calculatedScores: CalculatedScores;
  lang: "de" | "en" | "es";
  onClose: () => void;
}

const typeLabels: Record<ProjectType, { de: string; en: string; es: string }> = {
  strategic: { de: "Strategisch", en: "Strategic", es: "Estratégico" },
  tactical: { de: "Taktisch", en: "Tactical", es: "Táctico" },
  operational: { de: "Operativ", en: "Operational", es: "Operacional" },
};

const statusColors: Record<ProjectStatus, string> = {
  green: "bg-emerald-500/30 border-emerald-500 text-emerald-400",
  yellow: "bg-amber-500/30 border-amber-500 text-amber-400",
  red: "bg-red-500/30 border-red-500 text-red-400",
};

export default function HealthHubSidebarContent({
  weights,
  onWeightsChange,
  projects,
  includedProjectIds,
  onIncludedProjectIdsChange,
  calculatedScores,
  lang,
  onClose,
}: HealthHubSidebarContentProps) {
  const weightsSum = weights.str + weights.tac + weights.ops;
  const isWeightsValid = weightsSum === 100;

  const toggleProject = (id: string) => {
    if (includedProjectIds.includes(id)) {
      onIncludedProjectIdsChange(includedProjectIds.filter((i) => i !== id));
    } else {
      onIncludedProjectIdsChange([...includedProjectIds, id]);
    }
  };

  const groupedProjects = {
    strategic: projects.filter((p) => p.type === "strategic"),
    tactical: projects.filter((p) => p.type === "tactical"),
    operational: projects.filter((p) => p.type === "operational"),
  };

  const updateWeight = (key: keyof Weights, value: number) => {
    const clamped = Math.max(0, Math.min(100, value));
    onWeightsChange({ ...weights, [key]: clamped });
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-700">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Target className="w-5 h-5" />
            {lang === "de" ? "Impact Score Konfiguration" : lang === "es" ? "Configuración del Impact Score" : "Impact Score Configuration"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">
            ×
          </button>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {lang === "de" ? "Formel, Gewichtung & Projektauswahl" : lang === "es" ? "Fórmula, pesos y selección de proyectos" : "Formula, weights & project selection"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Sektion 1: Formel */}
        <section>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            {lang === "de" ? "Berechnungsformel" : lang === "es" ? "Fórmula de cálculo" : "Calculation Formula"}
          </h3>
          <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-600 font-mono text-sm">
            <div className="text-slate-300 space-y-1">
              <span className="text-cyan-400">{Math.round(calculatedScores.strategic)}%</span>
              <span className="text-slate-500"> × </span>
              <span className="text-amber-400">{weights.str}%</span>
              <span className="text-slate-500"> + </span>
              <span className="text-blue-400">{Math.round(calculatedScores.tactical)}%</span>
              <span className="text-slate-500"> × </span>
              <span className="text-amber-400">{weights.tac}%</span>
              <span className="text-slate-500"> + </span>
              <span className="text-emerald-400">{Math.round(calculatedScores.operational)}%</span>
              <span className="text-slate-500"> × </span>
              <span className="text-amber-400">{weights.ops}%</span>
              <span className="text-slate-500"> = </span>
              <span className="text-white font-bold text-lg">{Math.round(calculatedScores.total)}%</span>
            </div>
          </div>
        </section>

        {/* Sektion 2: Gewichtung */}
        <section>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            {lang === "de" ? "Gewichtung (STR / TAC / OPS)" : lang === "es" ? "Pesos (STR / TAC / OPS)" : "Weights (STR / TAC / OPS)"}
          </h3>
          <div className="space-y-3">
            {(["str", "tac", "ops"] as const).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400 uppercase font-medium">{key}</span>
                  <span className="text-slate-300">{weights[key]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[key]}
                  onChange={(e) => updateWeight(key, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}
            <div className={`text-xs pt-2 ${isWeightsValid ? "text-emerald-400" : "text-amber-400"}`}>
              {lang === "de" ? "Summe: " : lang === "es" ? "Total: " : "Sum: "}
              {weightsSum}%
              {!isWeightsValid && (
                <span className="ml-2">
                  ({lang === "de" ? "sollte 100% sein" : lang === "es" ? "debería ser 100%" : "should be 100%"})
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Sektion 3: Projektauswahl */}
        <section>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-blue-400" />
            {lang === "de" ? "Projektauswahl" : lang === "es" ? "Selección de proyectos" : "Project Selection"}
          </h3>
          <div className="space-y-4">
            {(["strategic", "tactical", "operational"] as const).map((type) => (
              <div key={type}>
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">
                  {typeLabels[type][lang]}
                </h4>
                <div className="space-y-2">
                  {groupedProjects[type].map((project) => {
                    const isIncluded = includedProjectIds.includes(project.id);
                    return (
                      <label
                        key={project.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isIncluded ? "bg-slate-700/50 border-slate-600" : "bg-slate-900/50 border-slate-700 opacity-60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={() => toggleProject(project.id)}
                          className="rounded border-slate-500 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="flex-1 text-sm text-slate-200 truncate">{project.name}</span>
                        <span className="text-sm font-semibold text-slate-300">{project.progress}%</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[project.status]}`}
                        >
                          {project.status === "green"
                            ? "✓"
                            : project.status === "yellow"
                            ? "!"
                            : "!"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
