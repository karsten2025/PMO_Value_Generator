"use client";

/**
 * Project Lifecycle View - Horizontale Pipeline
 * 49 Projektmanagement-Prozesse + 3 Pre-Project
 * Interaktiv: Drawer, Speichern, Grüner Haken
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { GitMerge, Search, Check, Edit2, Trash2 } from "lucide-react";
import {
  LIFECYCLE_CONTENT,
  getProcessLabel,
  getGateLabel,
  getPhaseTitle,
} from "@/app/data/lifecycleContent";
import { PROCESS_ARTIFACT_KEYS } from "@/app/data/lifecycleContent";
import ProcessInputDrawer from "./ProcessInputDrawer";
import GovernanceTierSelector from "./GovernanceTierSelector";
import { supabase } from "@/lib/supabase";

type Lang = "de" | "en" | "es";
type Mode = "colloquial" | "management";

export type ProjectTier = "strategic" | "tactical" | "operational" | null;

export interface ProjectItem {
  id: string;
  name: string;
  tier: ProjectTier;
  artifacts_data?: Record<string, Record<string, unknown>>;
}

// Phasen: Pre-Project -> [Go/No-Go] -> Initiating -> [Charter] -> Planning -> [Plan OK] -> Execution & Control -> [Acceptance] -> Closing
const PHASES: Array<{
  id: string;
  gateIndex: number | null;
  processes: { id: string }[];
}> = [
  { id: "phase0", gateIndex: 0, processes: [{ id: "na" }, { id: "bc" }, { id: "bmp" }] },
  { id: "phase1", gateIndex: 1, processes: [{ id: "4.1" }, { id: "4.2" }] },
  {
    id: "phase2",
    gateIndex: 2,
    processes: [
      { id: "5.1" }, { id: "5.2" }, { id: "5.3" }, { id: "5.4" }, { id: "5.5" },
      { id: "5.6" }, { id: "5.7" }, { id: "5.8" }, { id: "5.9" }, { id: "5.10" },
      { id: "5.11" }, { id: "5.12" }, { id: "5.13" }, { id: "5.14" }, { id: "5.15" },
      { id: "5.16" }, { id: "5.17" }, { id: "5.18" }, { id: "5.19" }, { id: "5.20" },
      { id: "5.21" }, { id: "5.22" }, { id: "5.23" }, { id: "5.24" },
    ],
  },
  {
    id: "phase3",
    gateIndex: 3,
    processes: [
      { id: "6.1" }, { id: "6.2" }, { id: "6.3" }, { id: "6.4" }, { id: "6.5" },
      { id: "6.6" }, { id: "6.7" }, { id: "6.8" }, { id: "6.9" }, { id: "6.10" },
      { id: "7.1" }, { id: "7.2" }, { id: "7.3" }, { id: "7.4" }, { id: "7.5" },
      { id: "7.6" }, { id: "7.7" }, { id: "7.8" }, { id: "7.9" }, { id: "7.10" },
      { id: "7.11" }, { id: "7.12" },
    ],
  },
  { id: "phase4", gateIndex: null, processes: [{ id: "8.1" }] },
];

interface ProjectLifecycleViewProps {
  portfolioId: string | null;
  projects?: ProjectItem[];
  lang: Lang;
  mode: Mode;
  onProjectsChange?: () => void;
  onNavigateToProjects?: () => void;
}

export default function ProjectLifecycleView({
  portfolioId,
  projects: initialProjects = [],
  lang,
  mode,
  onProjectsChange,
  onNavigateToProjects,
}: ProjectLifecycleViewProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjects[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState("");
  const [drawerProcessId, setDrawerProcessId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const loadProjects = useCallback(async () => {
    if (!portfolioId) {
      setProjects([]);
      setSelectedProjectId(null);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("pmo_projects")
      .select("id, name, strategic_alignment, governance_tier, artifacts_data")
      .eq("portfolio_id", portfolioId)
      .in("status", ["active", "intake"])
      .order("created_at", { ascending: false });
    setIsLoading(false);
    if (error) {
      console.error("Error loading workflow projects:", error);
      setProjects([]);
      return;
    }
    const list: ProjectItem[] = (data || []).map((p) => {
      const raw = p as { governance_tier?: string | null; strategic_alignment?: string | null };
      const tier = (raw.governance_tier ?? raw.strategic_alignment ?? null) as ProjectTier;
      return {
        id: p.id,
        name: p.name,
        tier,
        artifacts_data: (p as { artifacts_data?: Record<string, Record<string, unknown>> }).artifacts_data ?? {},
      };
    });
    setProjects(list);
    if (list.length > 0) {
      const stillExists = list.some((p) => p.id === selectedProjectId);
      if (!stillExists) setSelectedProjectId(list[0].id);
    } else {
      setSelectedProjectId(null);
    }
    onProjectsChange?.();
  }, [portfolioId, onProjectsChange]);

  useEffect(() => {
    if (portfolioId) {
      loadProjects();
    } else {
      setProjects(initialProjects);
      setSelectedProjectId(initialProjects[0]?.id ?? null);
    }
  }, [portfolioId, loadProjects]);

  const selectedProject = useMemo(
    () => (selectedProjectId ? projects.find((p) => p.id === selectedProjectId) ?? null : null),
    [projects, selectedProjectId]
  );

  const groupedProjects = useMemo(() => {
    const filtered = projects.filter(
      (p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const groups: Record<string, ProjectItem[]> = {
      strategic: filtered.filter((p) => p.tier === "strategic"),
      tactical: filtered.filter((p) => p.tier === "tactical"),
      operational: filtered.filter((p) => p.tier === "operational"),
      undefined: filtered.filter((p) => p.tier === null || p.tier === undefined),
    };
    return groups;
  }, [projects, searchQuery]);

  const hasProcessData = useCallback(
    (project: ProjectItem | undefined, processId: string): boolean => {
      if (!project?.artifacts_data) return false;
      const key = PROCESS_ARTIFACT_KEYS[processId];
      if (!key) return false;
      const data = project.artifacts_data[key];
      if (!data || typeof data !== "object") return false;
      return Object.keys(data).length > 0;
    },
    []
  );

  const handleNewDraft = async () => {
    if (!portfolioId) return;
    const defaultName = LIFECYCLE_CONTENT.ui.new_draft_default_name[lang][mode];
    const { data, error } = await supabase
      .from("pmo_projects")
      .insert({
        portfolio_id: portfolioId,
        name: defaultName,
        status: "intake",
        governance_tier: null,
      })
      .select("id, name, strategic_alignment")
      .single();
    if (error) {
      console.error("Error creating draft:", error.message, error.code, error.details);
      return;
    }
    const newProject: ProjectItem = {
      id: data.id,
      name: data.name,
      tier: null,
      artifacts_data: {},
    };
    setProjects((prev) => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    onProjectsChange?.();
  };

  const handleProcessClick = (processId: string) => {
    if (selectedProjectId) {
      setDrawerProcessId(processId);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = LIFECYCLE_CONTENT.ui.delete_confirm[lang][mode];
    if (!window.confirm(msg)) return;
    const { error } = await supabase.from("pmo_projects").delete().eq("id", projectId);
    if (error) {
      console.error("Error deleting project:", error);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setDrawerProcessId(null);
    }
    onProjectsChange?.();
  };

  const handleStartRename = (project: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProjectId(project.id);
    setEditingName(project.name);
  };

  const handleSaveRename = async () => {
    if (!editingProjectId || !editingName.trim()) {
      setEditingProjectId(null);
      return;
    }
    const trimmed = editingName.trim();
    const { error } = await supabase
      .from("pmo_projects")
      .update({ name: trimmed })
      .eq("id", editingProjectId);
    if (error) {
      console.error("Error renaming project:", error);
      setEditingProjectId(null);
      return;
    }
    setProjects((prev) =>
      prev.map((p) => (p.id === editingProjectId ? { ...p, name: trimmed } : p))
    );
    setEditingProjectId(null);
    onProjectsChange?.();
  };

  const handleApproveAndStart = async () => {
    if (!selectedProjectId) return;
    const project = projects.find((p) => p.id === selectedProjectId);
    const artifacts = project?.artifacts_data ?? {};
    const allTags = new Set<string>();
    ["needs_assessment", "business_case", "benefits_management_plan"].forEach((k) => {
      const a = artifacts[k] as Record<string, unknown> | undefined;
      if (a?.tags && typeof a.tags === "string") {
        parseTagsFromInput(a.tags).forEach((t) => allTags.add(t));
      }
    });
    const tagsArray = Array.from(allTags);

    const tier = project?.tier ?? (project as { governance_tier?: string })?.governance_tier;
    const { error } = await supabase
      .from("pmo_projects")
      .update({
        status: "active",
        start_date: new Date().toISOString().split("T")[0],
        ...(tagsArray.length > 0 && { tags: tagsArray }),
        ...(tier && { strategic_alignment: tier }),
      })
      .eq("id", selectedProjectId);
    if (error) {
      console.error("Error promoting project:", error);
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== selectedProjectId));
    setSelectedProjectId(null);
    onProjectsChange?.();
    onNavigateToProjects?.();
  };

  const handleTierChange = async (projectId: string, newTier: ProjectTier) => {
    const { error } = await supabase
      .from("pmo_projects")
      .update({ governance_tier: newTier })
      .eq("id", projectId);
    if (error) {
      console.error("Error updating tier:", error);
      return;
    }
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, tier: newTier } : p))
    );
    onProjectsChange?.();
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    }
    if (e.key === "Escape") {
      setEditingProjectId(null);
      setEditingName("");
    }
  };

  const parseTagsFromInput = (input: string): string[] => {
    if (!input || typeof input !== "string") return [];
    return input
      .split(/[,\s]+/)
      .map((t) => t.replace(/^#/, "").trim())
      .filter(Boolean);
  };

  const handleSaveArtifact = async (processId: string, data: Record<string, unknown>) => {
    if (!selectedProjectId) return;
    const key = PROCESS_ARTIFACT_KEYS[processId];
    if (!key) return;
    const project = projects.find((p) => p.id === selectedProjectId);
    const current = project?.artifacts_data ?? {};
    const updated = { ...current, [key]: data };

    const tagsInput = data.tags;
    const tags = typeof tagsInput === "string" ? parseTagsFromInput(tagsInput) : [];

    const updatePayload: Record<string, unknown> = { artifacts_data: updated };
    if (tags.length > 0) updatePayload.tags = tags;

    const { error } = await supabase
      .from("pmo_projects")
      .update(updatePayload)
      .eq("id", selectedProjectId);
    if (error) {
      console.error("Error saving artifact:", error);
      throw error;
    }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId ? { ...p, artifacts_data: updated } : p
      )
    );
    setDrawerProcessId(null);
    onProjectsChange?.();
  };

  const tierLabels: Record<string, string> = {
    strategic: LIFECYCLE_CONTENT.ui.tier_strategic[lang][mode],
    tactical: LIFECYCLE_CONTENT.ui.tier_tactical[lang][mode],
    operational: LIFECYCLE_CONTENT.ui.tier_operational[lang][mode],
    undefined: LIFECYCLE_CONTENT.ui.tier_undefined[lang][mode],
  };

  const drawerArtifactKey = drawerProcessId ? PROCESS_ARTIFACT_KEYS[drawerProcessId] : null;
  const drawerInitialData = selectedProject && drawerArtifactKey
    ? (selectedProject.artifacts_data?.[drawerArtifactKey] as Record<string, unknown> | undefined) ?? {}
    : {};

  return (
    <div className="h-full flex bg-slate-900 text-white overflow-hidden">
      {/* Linke Spalte: Project Selector */}
      <div className="w-[20%] min-w-[200px] max-w-[280px] flex flex-col border-r border-slate-700 bg-slate-800/50">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <GitMerge size={16} />
            {LIFECYCLE_CONTENT.ui.projects_label[lang][mode]}
          </h3>
          {portfolioId && (
            <button
              onClick={handleNewDraft}
              disabled={isLoading}
              className="w-full mb-3 px-3 py-2 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 rounded-lg text-sm font-medium text-cyan-300 transition disabled:opacity-50"
            >
              {LIFECYCLE_CONTENT.ui.new_draft[lang][mode]}
            </button>
          )}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={LIFECYCLE_CONTENT.ui.search_placeholder[lang][mode]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-700/80 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {!portfolioId ? (
            <p className="text-sm text-slate-500 px-2">Portfolio auswählen</p>
          ) : projects.length === 0 && !isLoading ? (
            <p className="text-sm text-slate-500 px-2">Keine Projekte</p>
          ) : (
            (["strategic", "tactical", "operational", "undefined"] as const).map((tierKey) => {
              const items = groupedProjects[tierKey] ?? [];
              return items.length > 0 ? (
                  <div key={tierKey} className="mb-4">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 mb-2">
                      {tierLabels[tierKey]}
                    </div>
                    <div className="space-y-1">
                      {items.map((project) => {
                        const isEditing = editingProjectId === project.id;
                        const isSelected = selectedProjectId === project.id;
                        return (
                          <div
                            key={project.id}
                            onClick={() => !isEditing && setSelectedProjectId(project.id)}
                            className={`group flex items-center gap-1 w-full px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                              isSelected
                                ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/50"
                                : "hover:bg-slate-700/50 text-slate-300"
                            }`}
                          >
                            {isEditing ? (
                              <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onBlur={handleSaveRename}
                                onKeyDown={handleRenameKeyDown}
                                placeholder={LIFECYCLE_CONTENT.ui.rename_placeholder[lang][mode]}
                                className="flex-1 min-w-0 px-2 py-0.5 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <>
                                <span className="flex-1 min-w-0 truncate">{project.name}</span>
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => handleStartRename(project, e)}
                                    className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-600/50 transition"
                                    aria-label="Umbenennen"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeleteProject(project.id, e)}
                                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-600/50 transition"
                                    aria-label="Löschen"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null;
            })
          )}
        </div>
      </div>

      {/* Rechter Bereich: Pipeline */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-4 border-b border-slate-700 bg-slate-800/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2">
            <h2 className="text-xl font-bold text-cyan-400">
              {LIFECYCLE_CONTENT.ui.workflow_title[lang][mode]} {selectedProject?.name ?? "—"}
            </h2>
            {selectedProject && (
              <GovernanceTierSelector
                tier={selectedProject.tier}
                lang={lang}
                mode={mode}
                projectId={selectedProject.id}
                onTierChange={handleTierChange}
              />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {LIFECYCLE_CONTENT.ui.workflow_subtitle[lang][mode]}
          </p>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6 min-h-0">
          <div className="flex items-stretch gap-0 min-w-max h-full">
            {PHASES.map((phase, phaseIndex) => (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col w-[200px] sm:w-[240px] lg:w-[260px] flex-shrink-0">
                  <div className="px-3 py-2 mb-2 bg-slate-800 rounded-t-lg border border-slate-600 border-b-0">
                    <h3 className="text-xs sm:text-sm font-semibold text-cyan-400 line-clamp-2">
                      {getPhaseTitle(phaseIndex, lang, mode)}
                    </h3>
                  </div>
                  <div className="custom-scrollbar flex-1 min-h-[120px] max-h-[50vh] sm:max-h-[55vh] lg:max-h-[60vh] overflow-y-auto rounded-b-lg border border-slate-600 border-t-0 bg-slate-800/80 p-2 sm:p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      {phase.processes.map((proc) => {
                        const hasData = hasProcessData(selectedProject, proc.id);
                        const isDrawerOpen = drawerProcessId === proc.id;
                        return (
                          <button
                            key={proc.id}
                            onClick={() => handleProcessClick(proc.id)}
                            disabled={!selectedProjectId}
                            className={`relative px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all text-left ${
                              hasData
                                ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400/60"
                                : "bg-slate-700/50 text-slate-400 border border-slate-600 hover:bg-slate-600/50"
                            } ${isDrawerOpen ? "ring-2 ring-cyan-400/50" : ""} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {hasData && (
                              <span className="absolute top-1 right-1" title="Daten gespeichert">
                                <Check size={12} className="text-emerald-400" />
                              </span>
                            )}
                            {getProcessLabel(proc.id, lang, mode)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {phase.gateIndex !== null && (
                  <div className="flex items-center flex-shrink-0 px-1 sm:px-2" title={getGateLabel(phase.gateIndex, lang, mode)}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rotate-45 bg-slate-700 border-2 border-cyan-500/60 flex items-center justify-center shadow-[0_0_8px_rgba(34,211,238,0.15)]">
                      <span className="text-[6px] sm:text-[7px] -rotate-45 text-cyan-300 font-bold text-center leading-tight max-w-[28px] sm:max-w-[36px] truncate">
                        {getGateLabel(phase.gateIndex, lang, mode)}
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 bg-slate-800/50 p-4 min-h-[100px] sm:min-h-[120px] flex-shrink-0 flex flex-col gap-3">
          {selectedProject && (
            <button
              onClick={handleApproveAndStart}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
            >
              <Check size={18} />
              {LIFECYCLE_CONTENT.ui.approve_start[lang][mode]}
            </button>
          )}
          <div>
            <div className="text-sm text-slate-500 mb-2">
              {LIFECYCLE_CONTENT.ui.input_area_label[lang][mode]}
            </div>
            <div className="bg-slate-800 rounded-lg border border-slate-600 p-4 text-slate-400 text-sm">
              {!selectedProjectId ? (
                <span className="text-slate-500">
                  Projekt auswählen oder neu anlegen.
                </span>
              ) : (
                <span className="text-slate-500">
                  {LIFECYCLE_CONTENT.ui.input_area_placeholder[lang][mode]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProcessInputDrawer
        isOpen={!!drawerProcessId}
        onClose={() => setDrawerProcessId(null)}
        processId={drawerProcessId ?? ""}
        projectId={selectedProjectId ?? ""}
        projectName={selectedProject?.name ?? ""}
        lang={lang}
        mode={mode}
        initialData={drawerInitialData}
        onSave={handleSaveArtifact}
      />
    </div>
  );
}
