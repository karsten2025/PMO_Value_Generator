"use client";

// Portfolio Project List - Zeigt alle Projekte eines Portfolios
// Gruppiert nach Strategic/Tactical/Operational
// Mit Drill-Down zu einzelnem Projekt-Impact-Cycle

import React, { useState, useEffect, useMemo } from 'react';
import { supabase, type Project, type KPIValue } from '@/lib/supabase';
import { Target, Layers, Settings, ChevronDown, AlertCircle } from 'lucide-react';
import ProjectDetailSidebar from './ProjectDetailSidebar';

interface PortfolioProjectListProps {
  portfolioId: string;
  portfolioName: string;
  lang: 'de' | 'en' | 'es';
  mode: 'colloquial' | 'management';
  onProjectSelect: (projectId: string) => void;
}

export default function PortfolioProjectList({ 
  portfolioId,
  portfolioName,
  lang,
  mode,
  onProjectSelect 
}: PortfolioProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'strategic' | 'tactical' | 'operational'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, [portfolioId]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      // 1. Lade alle aktiven Projekte des Portfolios
      const { data: projectsData, error: projectsError } = await supabase
        .from('pmo_projects')
        .select('*')
        .eq('portfolio_id', portfolioId)
        .eq('status', 'active')
        .order('strategic_alignment', { ascending: false }); // Strategic zuerst

      if (projectsError) throw projectsError;

      if (projectsData) {
        setProjects(projectsData);

        // 2. Berechne Progress für jedes Projekt
        const progressMap: Record<string, number> = {};
        for (const project of projectsData) {
          const progress = await calculateProjectProgress(project.id);
          progressMap[project.id] = progress;
        }
        setProjectProgress(progressMap);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProjectProgress = async (projectId: string): Promise<number> => {
    try {
      // Hole alle KPIs für dieses Projekt
      const { data: kpis, error } = await supabase
        .from('pmo_kpi_values')
        .select('actual_value, target_value')
        .eq('project_id', projectId);

      if (error || !kpis || kpis.length === 0) return 0;

      // Durchschnittlicher Fortschritt
      const avgProgress = kpis.reduce((sum, kpi) => {
        const percent = kpi.target_value > 0 
          ? (kpi.actual_value / kpi.target_value) * 100 
          : 0;
        return sum + Math.min(percent, 100);
      }, 0) / kpis.length;

      return Math.round(avgProgress);
    } catch (error) {
      console.error(`Error calculating progress for project ${projectId}:`, error);
      return 0;
    }
  };

  // Filter & Grouping
  const filteredProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(p => p.strategic_alignment === filter);
  }, [projects, filter]);

  const groupedProjects = useMemo(() => {
    return {
      strategic: filteredProjects.filter(p => p.strategic_alignment === 'strategic'),
      tactical: filteredProjects.filter(p => p.strategic_alignment === 'tactical'),
      operational: filteredProjects.filter(p => p.strategic_alignment === 'operational'),
    };
  }, [filteredProjects]);

  // Helper functions
  const getAlignmentIcon = (alignment: string) => {
    switch (alignment) {
      case 'strategic': return <Target className="w-5 h-5 text-yellow-500" />;
      case 'tactical': return <Layers className="w-5 h-5 text-blue-500" />;
      case 'operational': return <Settings className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getAlignmentColor = (alignment: string) => {
    switch (alignment) {
      case 'strategic': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'tactical': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'operational': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

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

  const getStatusEmoji = (progress: number) => {
    if (progress >= 80) return '✅';
    if (progress >= 50) return '⚠️';
    return '🔴';
  };

  const getScoreBadge = (score: 'low' | 'medium' | 'high', label: string) => {
    const colors = {
      low: 'text-red-400 bg-red-500/10',
      medium: 'text-yellow-400 bg-yellow-500/10',
      high: 'text-green-400 bg-green-500/10',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[score]}`}>
        {label}: {score.charAt(0).toUpperCase() + score.slice(1)}
      </span>
    );
  };

  const formatBudget = (cents: number) => {
    const millions = cents / 1000000;
    return millions.toFixed(1) + 'M€';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('de-DE', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900">
        <div className="text-slate-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-900 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {portfolioName}
        </h1>
        <p className="text-slate-400">
          {projects.length} active projects 
          {filteredProjects.length !== projects.length && ` (${filteredProjects.length} filtered)`}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All ({projects.length})
        </button>
        <button
          onClick={() => setFilter('strategic')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
            filter === 'strategic' 
              ? 'bg-yellow-600 text-white shadow-lg' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Target className="w-4 h-4" />
          Strategic ({groupedProjects.strategic.length})
        </button>
        <button
          onClick={() => setFilter('tactical')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
            filter === 'tactical' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tactical ({groupedProjects.tactical.length})
        </button>
        <button
          onClick={() => setFilter('operational')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all ${
            filter === 'operational' 
              ? 'bg-green-600 text-white shadow-lg' 
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Settings className="w-4 h-4" />
          Operational ({groupedProjects.operational.length})
        </button>
      </div>

      {/* Project Groups */}
      {Object.entries(groupedProjects).map(([alignment, groupProjects]) => (
        groupProjects.length > 0 && (
          <div key={alignment} className="mb-8">
            {/* Group Header */}
            <div className="flex items-center gap-3 mb-4">
              {getAlignmentIcon(alignment)}
              <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                {alignment} Projects
              </h2>
              <span className="text-sm text-slate-400">
                ({groupProjects.filter(p => (projectProgress[p.id] || 0) >= 80).length} of {groupProjects.length} on track)
              </span>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
              {groupProjects.map((project) => {
                const progress = projectProgress[project.id] || 0;
                return (
                  <div
                    key={project.id}
                    className={`bg-slate-800 rounded-xl p-5 border-2 transition-all cursor-pointer hover:scale-[1.01] hover:shadow-xl ${getAlignmentColor(project.strategic_alignment)}`}
                    onClick={() => setSelectedProject(project)}
                  >
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {project.name_matrix?.[lang]?.[mode] || project.name}
                          </h3>
                          <span className="text-xl">
                            {getStatusEmoji(progress)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {project.description_matrix?.[lang]?.[mode] || project.description}
                        </p>
                      </div>
                      <div className={`text-4xl font-black ${getProgressTextColor(progress)}`}>
                        {progress}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Project Meta */}
                    <div className="flex items-center flex-wrap gap-3 text-sm mb-3">
                      <span className="text-slate-300 flex items-center gap-1">
                        👤 {project.project_owner}
                      </span>
                      <span className="text-slate-300 flex items-center gap-1">
                        💰 {formatBudget(project.budget)}
                      </span>
                      <span className="text-slate-300 flex items-center gap-1">
                        📅 {formatDate(project.start_date)} → {formatDate(project.end_date)}
                      </span>
                    </div>

                    {/* Scores */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      {getScoreBadge(project.impact_score, 'Impact')}
                      {getScoreBadge(project.risk_level, 'Risk')}
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {project.tags.map((tag, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <button 
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onProjectSelect(project.id);
                        }}
                      >
                        View Impact Cycle
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ))}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">
            No projects found for this filter.
          </p>
        </div>
      )}

      {/* Project Detail Sidebar */}
      {selectedProject && (
        <ProjectDetailSidebar
          project={selectedProject}
          lang={lang}
          mode={mode}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}

