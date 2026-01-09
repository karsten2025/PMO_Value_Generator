# 🎯 FEATURE: Project Drill-Down für Stakeholder

## Problem
Stakeholder fragen: "Welche Projekte tragen zu diesem Portfolio bei?" 
Aktuell zeigt die App nur aggregierte Zahlen, aber keine Projekt-Details.

---

## Lösung: 3-Ebenen Navigation

```
PORTFOLIO (IT-Transformation 2026)
    ↓
PROJEKTE (z.B. Cloud Migration, ERP Upgrade, Data Analytics)
    ↓
MILESTONES & KPIs (Impact Cycle pro Projekt)
```

---

## 🎨 UI-KONZEPT

### Option 1: Sidebar-Erweiterung (Einfachste Lösung)

**Wenn man auf den Portfolio Health Hub klickt:**

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊 PORTFOLIO: IT-TRANSFORMATION 2026  ┃
┃  Total Impact Score: 73%               ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                        ┃
┃  🟡 STRATEGIC INITIATIVES (80%)        ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ✓ Cloud Migration Program        │ ┃
┃  │   Progress: 85% | Impact: High   │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ⚠ Digital Workplace Initiative   │ ┃
┃  │   Progress: 75% | Impact: Medium │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  🔵 TACTICAL INITIATIVES (50%)         ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ✗ PMO Tool Rollout               │ ┃
┃  │   Progress: 30% | Impact: Low    │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ✓ Team Onboarding Program        │ ┃
┃  │   Progress: 70% | Impact: High   │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  🟢 OPERATIONAL INITIATIVES (90%)      ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ✓ Monthly Reporting Automation   │ ┃
┃  │   Progress: 95% | Impact: High   │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  ┌──────────────────────────────────┐ ┃
┃  │ ✓ Dashboard Optimization         │ ┃
┃  │   Progress: 85% | Impact: Medium │ ┃
┃  │   [View Details →]               │ ┃
┃  └──────────────────────────────────┘ ┃
┃                                        ┃
┃  [+ Neues Projekt hinzufügen]          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

**Wenn man auf "View Details" klickt:**
→ Sidebar zeigt den **Impact Cycle des spezifischen Projekts**
→ Mit dessen **individuellen KPIs**

---

### Option 2: Neue Tab-View (Professioneller)

**Tabs im Header:**
```
[Overview] [Projects] [Analytics] [Settings]
```

**Projects-Tab zeigt:**
```
╔══════════════════════════════════════════════════════════════╗
║  PORTFOLIO: IT-TRANSFORMATION 2026                           ║
║  Projects: 6 Active | 2 On Hold | 1 Completed              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Filter: [All ▼] [Strategic ▼] [Tactical ▼] [Operational ▼]║
║  Sort by: [Progress ▼] [Impact ▼] [Name ▼]                 ║
║                                                              ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║  ┃  🟡 STRATEGIC PROJECTS (2 of 3 on track)             ┃ ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  Cloud Migration Program                    [85% ▓▓▓▓░]│ ║
║  │  Owner: John Smith | Budget: 2.3M€ | Status: ✅ On Track│ ║
║  │  Impact Score: 🟢 High | Risk: 🟡 Medium               │ ║
║  │  [View Impact Cycle] [Edit] [Reports]                  │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  Digital Workplace Initiative               [75% ▓▓▓▓░]│ ║
║  │  Owner: Sarah Lee | Budget: 1.5M€ | Status: ⚠️ At Risk │ ║
║  │  Impact Score: 🟡 Medium | Risk: 🔴 High               │ ║
║  │  [View Impact Cycle] [Edit] [Reports]                  │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║  ┃  🔵 TACTICAL PROJECTS (1 of 2 on track)              ┃ ║
║  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                              ║
║  ┌────────────────────────────────────────────────────────┐ ║
║  │  PMO Tool Rollout                           [30% ▓░░░░]│ ║
║  │  Owner: Mike Chen | Budget: 500K€ | Status: 🔴 Delayed │ ║
║  │  Impact Score: 🔴 Low | Risk: 🔴 High                  │ ║
║  │  [View Impact Cycle] [Edit] [Reports]                  │ ║
║  └────────────────────────────────────────────────────────┘ ║
║                                                              ║
║  [... weitere Projekte ...]                                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

### Option 3: Matrix-View (Für C-Level)

**Visual: Portfolio-Project-Matrix**

```
                STRATEGIC  │  TACTICAL  │  OPERATIONAL
        ─────────────────────────────────────────────────
ON TRACK    │  ✅ Cloud      │  ✅ Team    │  ✅ Reporting
        (80%)   │     Migration  │     Onboarding│     Automation
            │  ✅ Digital    │             │  ✅ Dashboard
            │     Workplace  │             │     Optimization
        ─────────────────────────────────────────────────
AT RISK     │                │  ⚠️ PMO Tool│
        (50%)   │                │     Rollout   │
        ─────────────────────────────────────────────────
DELAYED     │                │             │
        (0%)    │                │             │
        ─────────────────────────────────────────────────
            80% ────────    50% ────────    90% ────────
```

**Klick auf eine Zelle:**
→ Zeigt alle Projekte in dieser Kategorie
→ Drill-Down zu Impact Cycle

---

## 🛠️ IMPLEMENTATION

### Schritt 1: Datenbank erweitern

**Tabelle `pmo_projects` bereits vorhanden!** ✅ (aus deiner `migration_clean_slate.sql`)

Aber wir brauchen noch:
- **`strategic_alignment`** (strategic / tactical / operational)
- **`impact_score`** (low / medium / high)
- **`risk_level`** (low / medium / high)

```sql
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS strategic_alignment TEXT 
  CHECK (strategic_alignment IN ('strategic', 'tactical', 'operational'));

ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS impact_score TEXT 
  CHECK (impact_score IN ('low', 'medium', 'high'));

ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS risk_level TEXT 
  CHECK (risk_level IN ('low', 'medium', 'high'));

ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS project_owner TEXT;

ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS budget NUMERIC;
```

---

### Schritt 2: Frontend-Komponente erstellen

**Neue Datei: `frontend/app/components/PortfolioProjectList.tsx`**

```typescript
"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Target, Layers, Settings } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  project_owner: string;
  budget: number;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  strategic_alignment: 'strategic' | 'tactical' | 'operational';
  impact_score: 'low' | 'medium' | 'high';
  risk_level: 'low' | 'medium' | 'high';
  progress: number; // Berechnet aus KPIs
}

interface PortfolioProjectListProps {
  portfolioId: string;
  onProjectSelect: (projectId: string) => void;
}

export default function PortfolioProjectList({ 
  portfolioId, 
  onProjectSelect 
}: PortfolioProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<'all' | 'strategic' | 'tactical' | 'operational'>('all');

  useEffect(() => {
    loadProjects();
  }, [portfolioId]);

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('pmo_projects')
      .select('*')
      .eq('portfolio_id', portfolioId)
      .eq('status', 'active');

    if (data) {
      // Berechne Progress für jedes Projekt
      const projectsWithProgress = await Promise.all(
        data.map(async (project) => {
          const progress = await calculateProjectProgress(project.id);
          return { ...project, progress };
        })
      );
      setProjects(projectsWithProgress);
    }
  };

  const calculateProjectProgress = async (projectId: string): Promise<number> => {
    // Hole alle KPIs für dieses Projekt
    const { data: kpis } = await supabase
      .from('pmo_kpi_values')
      .select('actual_value, target_value')
      .eq('instance_id', projectId); // Annahme: instance_id = project_id

    if (!kpis || kpis.length === 0) return 0;

    // Durchschnittlicher Fortschritt
    const avgProgress = kpis.reduce((sum, kpi) => {
      const percent = kpi.target_value > 0 
        ? (kpi.actual_value / kpi.target_value) * 100 
        : 0;
      return sum + Math.min(percent, 100);
    }, 0) / kpis.length;

    return Math.round(avgProgress);
  };

  const getAlignmentIcon = (alignment: string) => {
    switch (alignment) {
      case 'strategic': return <Target className="w-5 h-5 text-yellow-500" />;
      case 'tactical': return <Layers className="w-5 h-5 text-blue-500" />;
      case 'operational': return <Settings className="w-5 h-5 text-green-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string, progress: number) => {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.strategic_alignment === filter);

  const groupedProjects = {
    strategic: filteredProjects.filter(p => p.strategic_alignment === 'strategic'),
    tactical: filteredProjects.filter(p => p.strategic_alignment === 'tactical'),
    operational: filteredProjects.filter(p => p.strategic_alignment === 'operational'),
  };

  return (
    <div className="w-full h-full bg-slate-900 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Portfolio Projects</h2>
        <p className="text-slate-400">
          {projects.length} active projects
        </p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('strategic')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            filter === 'strategic' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Target className="w-4 h-4" />
          Strategic
        </button>
        <button
          onClick={() => setFilter('tactical')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            filter === 'tactical' 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Tactical
        </button>
        <button
          onClick={() => setFilter('operational')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            filter === 'operational' 
              ? 'bg-green-600 text-white' 
              : 'bg-slate-800 text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          Operational
        </button>
      </div>

      {/* Project Groups */}
      {Object.entries(groupedProjects).map(([alignment, projects]) => (
        projects.length > 0 && (
          <div key={alignment} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {getAlignmentIcon(alignment)}
              <h3 className="text-lg font-bold text-white uppercase">
                {alignment} Projects
              </h3>
              <span className="text-sm text-slate-400">
                ({projects.filter(p => p.progress >= 80).length} of {projects.length} on track)
              </span>
            </div>

            {/* Project Cards */}
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                  onClick={() => onProjectSelect(project.id)}
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-white mb-1">
                        {project.name}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {project.description}
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${getStatusColor(project.status, project.progress)}`}>
                      {project.progress}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        project.progress >= 80 
                          ? 'bg-green-500' 
                          : project.progress >= 50 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-slate-400">
                      <span>👤 {project.project_owner}</span>
                      <span>💰 {(project.budget / 1000000).toFixed(1)}M€</span>
                      <span className="flex items-center gap-1">
                        Impact: 
                        <span className={`font-semibold ${
                          project.impact_score === 'high' ? 'text-green-500' :
                          project.impact_score === 'medium' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {project.impact_score === 'high' ? '🟢 High' :
                           project.impact_score === 'medium' ? '🟡 Medium' :
                           '🔴 Low'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        Risk: 
                        <span className={`font-semibold ${
                          project.risk_level === 'low' ? 'text-green-500' :
                          project.risk_level === 'medium' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>
                          {project.risk_level === 'low' ? '🟢 Low' :
                           project.risk_level === 'medium' ? '🟡 Medium' :
                           '🔴 High'}
                        </span>
                      </span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                      View Impact Cycle →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center text-slate-400 py-12">
          <p>No projects found for this filter.</p>
        </div>
      )}
    </div>
  );
}
```

---

### Schritt 3: Integration in die Hauptseite

**In `frontend/app/page.tsx`:**

```typescript
const [view, setView] = useState<'cycle' | 'projects'>('cycle');
const [selectedProject, setSelectedProject] = useState<string | null>(null);

// ...

{view === 'cycle' && (
  <ReactFlow /* ... existing code ... */ />
)}

{view === 'projects' && selectedPortfolio && (
  <PortfolioProjectList 
    portfolioId={selectedPortfolio.id}
    onProjectSelect={(projectId) => {
      setSelectedProject(projectId);
      // TODO: Load Impact Cycle für dieses spezifische Projekt
    }}
  />
)}

{/* Toggle Button */}
<button
  onClick={() => setView(view === 'cycle' ? 'projects' : 'cycle')}
  className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg"
>
  {view === 'cycle' ? '📋 Show Projects' : '🎯 Show Impact Cycle'}
</button>
```

---

## 🚀 QUICK-WIN LÖSUNG (Ohne Code!)

**Falls du schnell starten willst:**

1. **Sidebar erweitern** (10 Min.):
   - Wenn man auf den **Portfolio Health Hub** klickt
   - Sidebar zeigt eine **Liste der Projekte**
   - Mit **Progress-Balken** und **Impact-Score**

2. **Dummy-Daten erstellen** (5 Min.):
   - Nutze `seed_pmo_data.py` (schon vorhanden!)
   - Füge 3-5 Projekte pro Portfolio hinzu
   - Mit realistischen Namen, Owner, Budget

3. **Screenshot machen** (2 Min.):
   - Zeigt die Projekt-Liste
   - Nutze das für LinkedIn!

---

## ✅ NÄCHSTE SCHRITTE

**Was möchtest du priorisieren?**

1. **Sidebar-Erweiterung** (Option 1) - Schnell, aber weniger übersichtlich
2. **Projects-Tab** (Option 2) - Professioneller, etwas mehr Arbeit
3. **Matrix-View** (Option 3) - Perfekt für C-Level, aber komplex

**Oder soll ich dir erstmal die Datenbank-Migration und Seed-Daten erstellen?**

Sag mir, welchen Ansatz du bevorzugst! 💪

