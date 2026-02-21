'use client';

// ============================================
// Project PMP Detail Page
// ============================================
// Vollständiger Projektmanagementplan
// Route: /portfolio/[portfolioId]/project/[projectId]
// ============================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LayoutGrid, BarChart3, FileText } from 'lucide-react';
import { ProjectCardPMPSection } from '@/app/components/ProjectCardPMPSection';
import ProjectDefinitionHub from '@/app/components/ProjectDefinitionHub';
import { ProjectMilestonesSection } from '@/app/components/ProjectMilestonesSection';
import { ProjectRisksSection } from '@/app/components/ProjectRisksSection';
import { ProjectChangeManagementSection } from '@/app/components/ProjectChangeManagementSection';
import { SharedControlsDropdown } from '@/app/components/SharedControlsDropdown';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type {
  ProjectManagementPlan,
  ProjectMilestone,
  ProjectRisk,
  ProjectChangeRequest,
  PMPUILabel,
} from '@/app/types/pmp';

interface PageProps {
  params: Promise<{
    portfolioId: string;
    projectId: string;
  }>;
}

export default function ProjectPMPPage({ params }: PageProps) {
  const router = useRouter();
  const { language: contextLang, register: contextRegister } = useLanguage();
  
  // Unwrap params (Next.js 15+)
  const [portfolioId, setPortfolioId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');
  
  const [lang, setLang] = useState<'de' | 'en' | 'es'>('de');
  const [register, setRegister] = useState<'colloquial' | 'management'>('colloquial');
  
  const [project, setProject] = useState<any>(null);
  const [charter, setCharter] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'dashboard' | 'details'>('blueprint');
  const [pmp, setPmp] = useState<ProjectManagementPlan | null>(null);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [risks, setRisks] = useState<ProjectRisk[]>([]);
  const [changes, setChanges] = useState<ProjectChangeRequest[]>([]);
  const [labels, setLabels] = useState<Record<string, PMPUILabel>>({});
  const [loading, setLoading] = useState(true);

  // Unwrap params on mount
  useEffect(() => {
    params.then((p) => {
      setPortfolioId(p.portfolioId);
      setProjectId(p.projectId);
    });
  }, [params]);

  // Sync with LanguageContext
  useEffect(() => {
    if (contextLang) {
      setLang(contextLang.toLowerCase() as 'de' | 'en' | 'es');
    }
  }, [contextLang]);

  useEffect(() => {
    if (contextRegister) {
      setRegister(contextRegister);
    }
  }, [contextRegister]);

  // Load Project & PMP Data
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      // Load Project from existing table
      const { data: projectData, error: projectError } = await supabase
        .from('pmo_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('Error loading project:', projectError);
        setLoading(false);
        return;
      }
      
      setProject(projectData);

      // Load Charter (Business Case) für Inheritance
      try {
        const { data: charterData } = await supabase
          .from('pmo_project_charters')
          .select('*')
          .eq('project_id', projectId)
          .single();
        setCharter(charterData);
      } catch {
        setCharter(null);
      }

      // ========================================
      // DEMO DATA für Cloud Migration DUMMY
      // ========================================
      const isDummyProject = projectData.name?.includes('Cloud Migration') || 
                             projectData.name?.includes('DUMMY');

      if (isDummyProject) {
        // Load demo PMP, Milestones, Risks, Changes
        loadDemoData();
        setLoading(false);
        return;
      }

      // Try to load PMP (table might not exist yet)
      try {
        const { data: pmpData } = await supabase
          .from('project_management_plans')
          .select('*')
          .eq('project_id', projectId)
          .single();

        if (pmpData) setPmp(pmpData);
      } catch (e) {
        console.log('PMP table not yet available');
      }

      // Try to load Milestones (table might not exist yet)
      try {
        const { data: milestonesData } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('due_date', { ascending: true });

        if (milestonesData) setMilestones(milestonesData);
      } catch (e) {
        console.log('Milestones table not yet available');
      }

      // Try to load Risks (table might not exist yet)
      try {
        const { data: risksData } = await supabase
          .from('project_risks')
          .select('*')
          .eq('project_id', projectId)
          .order('risk_score', { ascending: false });

        if (risksData) setRisks(risksData);
      } catch (e) {
        console.log('Risks table not yet available');
      }

      // Try to load Change Requests (table might not exist yet)
      try {
        const { data: changesData } = await supabase
          .from('project_change_requests')
          .select('*')
          .eq('project_id', projectId)
          .order('request_date', { ascending: false });

        if (changesData) setChanges(changesData);
      } catch (e) {
        console.log('Change requests table not yet available');
      }

      // Try to load UI Labels (table might not exist yet)
      try {
        const { data: labelsData } = await supabase
          .from('pmp_ui_labels')
          .select('*');

        if (labelsData) {
          const labelsMap: Record<string, PMPUILabel> = {};
          labelsData.forEach((label: any) => {
            labelsMap[label.label_key] = label;
          });
          setLabels(labelsMap);
        }
      } catch (e) {
        console.log('UI labels table not yet available');
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // DEMO DATA Loader (nur für DUMMY Projekt)
  // ========================================
  const loadDemoData = () => {
    // Demo PMP
    const demoPMP: ProjectManagementPlan = {
      id: 'pmp-demo',
      project_id: projectId,
      business_case_why: lang === 'de' 
        ? 'Senkung der Infrastrukturkosten und Verbesserung der Skalierbarkeit'
        : lang === 'es'
        ? 'Reducir costos de infraestructura y mejorar la escalabilidad'
        : 'Reduce infrastructure costs and improve scalability',
      business_objectives: lang === 'de'
        ? ['Infrastrukturkosten um 30% senken', 'Systemverfügbarkeit auf 99.9% erhöhen', 'Deployment-Zeiten um 50% verkürzen']
        : lang === 'es'
        ? ['Reducir costos de infraestructura en 30%', 'Aumentar disponibilidad del sistema a 99.9%', 'Reducir tiempos de despliegue en 50%']
        : ['Reduce infrastructure costs by 30%', 'Increase system availability to 99.9%', 'Reduce deployment times by 50%'],
      scope_what: lang === 'de'
        ? 'Migration von 18 Legacy-Anwendungen zur AWS Cloud'
        : lang === 'es'
        ? 'Migración de 18 aplicaciones heredadas a AWS Cloud'
        : 'Migration of 18 legacy applications to AWS Cloud',
      scope_deliverables: lang === 'de'
        ? ['Migrierte Applikationen (18 Stück)', 'Cloud-Architektur-Dokumentation', 'Betriebshandbuch', 'Schulungsmaterialien']
        : lang === 'es'
        ? ['Aplicaciones Migradas (18 total)', 'Documentación de Arquitectura Cloud', 'Manual de Operaciones', 'Materiales de Capacitación']
        : ['Migrated Applications (18 total)', 'Cloud Architecture Documentation', 'Operations Manual', 'Training Materials'],
      approach_how: lang === 'de'
        ? 'Phasenweise Lift-and-Shift-Migration in 3 Phasen: Bewertung, Migration, Optimierung'
        : lang === 'es'
        ? 'Migración Lift-and-Shift por fases en 3 etapas: Evaluación, Migración, Optimización'
        : 'Phased Lift-and-Shift Migration in 3 phases: Assessment, Migration, Optimization',
      methodology: 'hybrid',
      team_structure: {
        owner_name: 'Johann Schmidt',
        team_members: [
          { name: 'Maria Mueller', role: 'Cloud Architect' },
          { name: 'Thomas Weber', role: 'DevOps Lead' },
          { name: 'Anna Fischer', role: 'QA Manager' },
        ],
        stakeholders: [
          { name: 'Dr. Schulz', role: 'CTO', interest: 'high', influence: 'high' },
          { name: 'Finance Team', role: 'Budget Owner', interest: 'medium', influence: 'high' },
        ],
      },
      timeline: {
        start_date: '2025-10-01',
        end_date: '2026-07-01',
      },
      locations: lang === 'de'
        ? ['Frankfurt Rechenzentrum', 'AWS eu-central-1']
        : lang === 'es'
        ? ['Centro de Datos Frankfurt', 'AWS eu-central-1']
        : ['Frankfurt Data Center', 'AWS eu-central-1'],
      affected_systems: lang === 'de'
        ? ['ERP-System', 'CRM', 'Analytics-Plattform']
        : lang === 'es'
        ? ['Sistema ERP', 'CRM', 'Plataforma de Analítica']
        : ['ERP System', 'CRM', 'Analytics Platform'],
      budget: {
        total_budget: 2300000,
        currency: '€',
        spent: 1500000,
        forecast: 2250000,
        breakdown: lang === 'de'
          ? [
              { category: 'Cloud-Infrastruktur', amount: 800000 },
              { category: 'Personal', amount: 1000000 },
              { category: 'Lizenzen', amount: 300000 },
              { category: 'Schulungen', amount: 200000 },
            ]
          : lang === 'es'
          ? [
              { category: 'Infraestructura Cloud', amount: 800000 },
              { category: 'Personal', amount: 1000000 },
              { category: 'Licencias', amount: 300000 },
              { category: 'Capacitación', amount: 200000 },
            ]
          : [
              { category: 'Cloud Infrastructure', amount: 800000 },
              { category: 'Personnel', amount: 1000000 },
              { category: 'Licenses', amount: 300000 },
              { category: 'Training', amount: 200000 },
            ],
      },
    };

    setPmp(demoPMP);

    // Demo Milestones
    const demoMilestones: ProjectMilestone[] = [
      {
        id: 'ms-1',
        project_id: projectId,
        name: lang === 'de' ? 'Phase 1: Bewertung abgeschlossen' : lang === 'es' ? 'Fase 1: Evaluación Completada' : 'Phase 1: Assessment Complete',
        description: lang === 'de' ? 'Infrastruktur-Audit und Anwendungsanalyse abgeschlossen' : lang === 'es' ? 'Auditoría de infraestructura y análisis de aplicaciones finalizado' : 'Infrastructure audit and application analysis finished',
        due_date: '2025-12-31',
        status: 'completed',
        percentage_complete: 100,
        completion_date: '2025-12-28',
      },
      {
        id: 'ms-2',
        project_id: projectId,
        name: lang === 'de' ? 'Phase 2: Migration läuft' : lang === 'es' ? 'Fase 2: Migración en Progreso' : 'Phase 2: Migration In Progress',
        description: lang === 'de' ? '12 von 18 Anwendungen in die Cloud migriert' : lang === 'es' ? '12 de 18 aplicaciones migradas a la nube' : '12 of 18 applications migrated to cloud',
        due_date: '2026-04-30',
        status: 'in_progress',
        percentage_complete: 67,
      },
      {
        id: 'ms-3',
        project_id: projectId,
        name: lang === 'de' ? 'Phase 3: Optimierung & Go-Live' : lang === 'es' ? 'Fase 3: Optimización y Lanzamiento' : 'Phase 3: Optimization & Go-Live',
        description: lang === 'de' ? 'Performance-Tuning und finaler Umstieg' : lang === 'es' ? 'Ajuste de rendimiento y cambio final' : 'Performance tuning and final cutover',
        due_date: '2026-07-01',
        status: 'pending',
        percentage_complete: 0,
      },
    ];

    setMilestones(demoMilestones);

    // Demo Risks
    const demoRisks: ProjectRisk[] = [
      {
        id: 'risk-1',
        project_id: projectId,
        type: 'risk',
        title: lang === 'de' ? 'Datenverlust während Migration' : lang === 'es' ? 'Pérdida de Datos Durante la Migración' : 'Data Loss During Migration',
        description: lang === 'de' ? 'Potenzielle Datenkorruption oder -verlust während der Datenbankmigration' : lang === 'es' ? 'Posible corrupción o pérdida de datos durante la migración de la base de datos' : 'Potential data corruption or loss during database migration',
        probability: 'medium',
        impact: 'high',
        risk_score: 6,
        status: 'open',
        mitigation_plan: lang === 'de' ? 'Umfassende Backup-Strategie + Rollback-Mechanismus' : lang === 'es' ? 'Estrategia de respaldo integral + mecanismo de rollback' : 'Comprehensive backup strategy + rollback mechanism',
        owner_name: 'Thomas Weber',
      },
      {
        id: 'action-1',
        project_id: projectId,
        type: 'issue',
        title: lang === 'de' ? 'Budgetüberschreitung' : lang === 'es' ? 'Exceso de Presupuesto' : 'Budget Overrun',
        description: lang === 'de' ? 'Cloud-Kosten höher als geschätzt aufgrund von Datentransfergebühren' : lang === 'es' ? 'Costos de nube más altos de lo estimado debido a tarifas de transferencia de datos' : 'Cloud costs higher than estimated due to data transfer fees',
        probability: 'low',
        impact: 'medium',
        risk_score: 3,
        status: 'mitigated',
        mitigation_plan: lang === 'de' ? 'Kostenoptimierung + monatliches Budget-Review' : lang === 'es' ? 'Optimización de costos + revisión mensual de presupuesto' : 'Cost optimization + monthly budget review',
        owner_name: 'Johann Schmidt',
      },
    ];

    setRisks(demoRisks);

    // Demo Change Requests
    const demoChanges: ProjectChangeRequest[] = [
      {
        id: 'cr-1',
        project_id: projectId,
        cr_number: 'CR-001',
        title: lang === 'de' ? 'Multi-Cloud-Strategie hinzufügen' : lang === 'es' ? 'Agregar Estrategia Multi-Cloud' : 'Add Multi-Cloud Strategy',
        description: lang === 'de' ? 'Erweiterung auf Azure zusätzlich zu AWS' : lang === 'es' ? 'Expansión a Azure además de AWS' : 'Extend to Azure in addition to AWS',
        scope_impact: lang === 'de' ? '3 zusätzliche Anwendungen auf Azure migrieren' : lang === 'es' ? '3 aplicaciones adicionales a migrar a Azure' : '3 additional applications to migrate to Azure',
        cost_impact: 450000,
        timeline_impact: 90,
        risk_impact: 'medium',
        status: 'approved',
        requester_name: 'Dr. Schulz',
        approved_by: 'Finance Team',
        approval_date: '2025-11-15',
        implementation_date: '2026-02-01',
      },
    ];

    setChanges(demoChanges);
  };

  const handleSaveDefinition = async (
    activeModules: string[],
    baselineData: Record<string, unknown>
  ) => {
    if (!projectId) return;
    const { error } = await supabase
      .from('pmo_projects')
      .update({
        active_modules: activeModules,
        baseline_data: baselineData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);
    if (error) throw error;
    setProject((prev: any) => ({
      ...prev,
      active_modules: activeModules,
      baseline_data: baselineData,
    }));
    alert(
      lang === 'de'
        ? 'Baseline gespeichert!'
        : lang === 'es'
        ? '¡Línea base guardada!'
        : 'Baseline saved!'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">
          {lang === 'de' && 'Lade Projektdaten...'}
          {lang === 'en' && 'Loading project data...'}
          {lang === 'es' && 'Cargando datos del proyecto...'}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">
          {lang === 'de' && 'Projekt nicht gefunden'}
          {lang === 'en' && 'Project not found'}
          {lang === 'es' && 'Proyecto no encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back + Breadcrumb */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Back to Portfolio Overview Button */}
              <button
                onClick={() => router.push('/?view=projects')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0 text-slate-400 hover:text-slate-200"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {lang === 'de' && 'Portfolio Übersicht'}
                  {lang === 'en' && 'Portfolio Overview'}
                  {lang === 'es' && 'Vista de Portfolio'}
                </span>
              </button>
              
              {/* Project Name */}
              <h1 className="text-lg font-semibold text-white truncate">
                {project.name_matrix?.[lang]?.[register] || project.name}
              </h1>
            </div>

            {/* Right: Controls */}
            <SharedControlsDropdown
              language={lang}
              mode={register}
              onLanguageChange={setLang}
              onModeChange={setRegister}
            />
          </div>
        </div>

        {/* Tabs: Blueprint | Dashboard | Details */}
        <div className="flex gap-1 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'blueprint'
                ? 'text-cyan-400 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            {lang === 'de' && 'Blueprint'}
            {lang === 'en' && 'Blueprint'}
            {lang === 'es' && 'Plan'}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            {lang === 'de' && 'Dashboard'}
            {lang === 'en' && 'Dashboard'}
            {lang === 'es' && 'Panel'}
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'details'
                ? 'text-cyan-400 border-b-2 border-cyan-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            {lang === 'de' && 'Details'}
            {lang === 'en' && 'Details'}
            {lang === 'es' && 'Detalles'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Tab: Blueprint (Definition Hub) */}
          {activeTab === 'blueprint' && (
            <ProjectDefinitionHub
              projectId={projectId}
              project={project}
              charter={charter}
              lang={lang}
              mode={register}
              onSave={handleSaveDefinition}
            />
          )}

          {/* Tab: Dashboard (Metriken-Übersicht) */}
          {activeTab === 'dashboard' && (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">
                {lang === 'de' && 'Metriken-Dashboard'}
                {lang === 'en' && 'Metrics Dashboard'}
                {lang === 'es' && 'Panel de Métricas'}
              </h2>
              <p className="text-slate-400 mb-4">
                {lang === 'de' && 'Definiere zuerst die Ziele im Blueprint. Die Ist-Werte werden hier gegen die Baseline gemessen.'}
                {lang === 'en' && 'Define targets in the Blueprint first. Actual values will be measured against the baseline here.'}
                {lang === 'es' && 'Define primero los objetivos en el Plan. Los valores reales se medirán contra la línea base aquí.'}
              </p>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${project.progress ?? 0}%` }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {project.progress ?? 0}% {lang === 'de' ? 'Fortschritt' : lang === 'es' ? 'Progreso' : 'Progress'}
              </p>
            </div>
          )}

          {/* Tab: Details (PMP Sections) */}
          {activeTab === 'details' && (
            <>
          {/* Project Header */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {project.name_matrix?.[lang]?.[register] || project.name}
            </h1>
            <p className="text-slate-400 mb-4">
              {project.description_matrix?.[lang]?.[register] || project.description}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                style={{ width: `${project.progress || 0}%` }}
              />
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">👤</span>
                <span className="text-slate-300">{project.project_owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">💰</span>
                <span className="text-slate-300">{project.budget ? `${(project.budget / 1000000).toFixed(1)}M€` : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">📅</span>
                <span className="text-slate-300">
                  {project.start_date && new Date(project.start_date).toLocaleDateString(lang)} → {project.end_date && new Date(project.end_date).toLocaleDateString(lang)}
                </span>
              </div>
            </div>
          </div>

          {/* PMP Sections */}
          <div className="space-y-6">
            {/* W-Questions */}
            <ProjectCardPMPSection
              pmp={pmp}
              labels={labels}
              lang={lang}
              register={register}
              onEdit={() => alert('Edit PMP - Coming soon!')}
            />

            {/* Milestones */}
            <ProjectMilestonesSection
              project_id={projectId}
              milestones={milestones}
              labels={labels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Milestone - Coming soon!')}
              onEdit={(ms) => alert(`Edit Milestone: ${ms.name}`)}
              onDelete={(id) => alert(`Delete Milestone: ${id}`)}
              isEditable={true}
            />

            {/* Risks & Action Items */}
            <ProjectRisksSection
              project_id={projectId}
              risks={risks}
              labels={labels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Risk - Coming soon!')}
              onEdit={(risk) => alert(`Edit Risk: ${risk.title}`)}
              onDelete={(id) => alert(`Delete Risk: ${id}`)}
              isEditable={true}
            />

            {/* Change Management */}
            <ProjectChangeManagementSection
              project_id={projectId}
              changes={changes}
              labels={labels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Change Request - Coming soon!')}
              onEdit={(cr) => alert(`Edit Change: ${cr.title}`)}
              onDelete={(id) => alert(`Delete Change: ${id}`)}
              onApprove={(id) => alert(`Approve Change: ${id}`)}
              onReject={(id, reason) => alert(`Reject: ${id}\nReason: ${reason}`)}
              isEditable={true}
            />
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
