'use client';

// ============================================
// PMP Demo/Test Page
// ============================================
// Zeigt alle neuen PMP Komponenten mit Demo-Daten
// Route: /pmp-demo
// ============================================

import React, { useState } from 'react';
import { ProjectCardPMPSection } from '../components/ProjectCardPMPSection';
import { ProjectMilestonesSection } from '../components/ProjectMilestonesSection';
import { ProjectRisksSection } from '../components/ProjectRisksSection';
import { ProjectChangeManagementSection } from '../components/ProjectChangeManagementSection';
import { SharedControlsDropdown } from '../components/SharedControlsDropdown';
import {
  ProjectManagementPlan,
  ProjectMilestone,
  ProjectRisk,
  ProjectChangeRequest,
  PMPUILabel,
  PMP_LABEL_KEYS,
} from '../types/pmp';

export default function PMPDemoPage() {
  const [lang, setLang] = useState<'de' | 'en' | 'es'>('de');
  const [register, setRegister] = useState<'colloquial' | 'management'>('colloquial');

  // ============================================
  // DEMO DATA
  // ============================================

  // Demo PMP (Multilingual)
  const getBusinessCaseWhy = () => {
    const texts: Record<string, string> = {
      de: 'Kosteneinsparungen durch Cloud-Infrastruktur und verbesserte Skalierbarkeit',
      en: 'Cost savings through cloud infrastructure and improved scalability',
      es: 'Ahorro de costos mediante infraestructura en la nube y mejor escalabilidad',
    };
    return texts[lang] || texts['en'];
  };

  const getBusinessObjectives = () => {
    const objectives: Record<string, string[]> = {
      de: [
        'Reduktion der Infrastrukturkosten um 30%',
        'Erhöhung der Systemverfügbarkeit auf 99,9%',
        'Verkürzung der Deployment-Zeiten um 50%',
      ],
      en: [
        'Reduce infrastructure costs by 30%',
        'Increase system availability to 99.9%',
        'Reduce deployment times by 50%',
      ],
      es: [
        'Reducir costos de infraestructura en 30%',
        'Aumentar disponibilidad del sistema a 99.9%',
        'Reducir tiempos de despliegue en 50%',
      ],
    };
    return objectives[lang] || objectives['en'];
  };

  const getScopeWhat = () => {
    const texts: Record<string, string> = {
      de: 'Migration von 18 Legacy-Anwendungen zur AWS Cloud',
      en: 'Migration of 18 legacy applications to AWS Cloud',
      es: 'Migración de 18 aplicaciones heredadas a AWS Cloud',
    };
    return texts[lang] || texts['en'];
  };

  const getDeliverables = () => {
    const deliverables: Record<string, string[]> = {
      de: [
        'Migrierte Applikationen (18 Stück)',
        'Cloud-Architektur-Dokumentation',
        'Betriebshandbuch',
        'Schulungsmaterialien',
      ],
      en: [
        'Migrated Applications (18 total)',
        'Cloud Architecture Documentation',
        'Operations Manual',
        'Training Materials',
      ],
      es: [
        'Aplicaciones Migradas (18 total)',
        'Documentación de Arquitectura Cloud',
        'Manual de Operaciones',
        'Materiales de Capacitación',
      ],
    };
    return deliverables[lang] || deliverables['en'];
  };

  const getApproachHow = () => {
    const texts: Record<string, string> = {
      de: 'Phasenweise Lift-and-Shift-Migration in 3 Phasen: Bewertung, Migration, Optimierung',
      en: 'Phased Lift-and-Shift Migration in 3 phases: Assessment, Migration, Optimization',
      es: 'Migración Lift-and-Shift por fases en 3 etapas: Evaluación, Migración, Optimización',
    };
    return texts[lang] || texts['en'];
  };

  const getLocations = () => {
    const locations: Record<string, string[]> = {
      de: ['Frankfurt Rechenzentrum', 'AWS eu-central-1'],
      en: ['Frankfurt Data Center', 'AWS eu-central-1'],
      es: ['Centro de Datos Frankfurt', 'AWS eu-central-1'],
    };
    return locations[lang] || locations['en'];
  };

  const getAffectedSystems = () => {
    const systems: Record<string, string[]> = {
      de: ['ERP-System', 'CRM', 'Analytics-Plattform'],
      en: ['ERP System', 'CRM', 'Analytics Platform'],
      es: ['Sistema ERP', 'CRM', 'Plataforma de Analítica'],
    };
    return systems[lang] || systems['en'];
  };

  const getBudgetCategories = () => {
    const categories: Record<string, { category: string; amount: number }[]> = {
      de: [
        { category: 'Cloud-Infrastruktur', amount: 800000 },
        { category: 'Personal', amount: 1000000 },
        { category: 'Lizenzen', amount: 300000 },
        { category: 'Schulungen', amount: 200000 },
      ],
      en: [
        { category: 'Cloud Infrastructure', amount: 800000 },
        { category: 'Personnel', amount: 1000000 },
        { category: 'Licenses', amount: 300000 },
        { category: 'Training', amount: 200000 },
      ],
      es: [
        { category: 'Infraestructura Cloud', amount: 800000 },
        { category: 'Personal', amount: 1000000 },
        { category: 'Licencias', amount: 300000 },
        { category: 'Capacitación', amount: 200000 },
      ],
    };
    return categories[lang] || categories['en'];
  };

  const demoPMP: ProjectManagementPlan = {
    id: 'pmp-1',
    project_id: 'project-1',
    business_case_why: getBusinessCaseWhy(),
    business_objectives: getBusinessObjectives(),
    scope_what: getScopeWhat(),
    scope_deliverables: getDeliverables(),
    approach_how: getApproachHow(),
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
    locations: getLocations(),
    affected_systems: getAffectedSystems(),
    budget: {
      total_budget: 2300000,
      currency: '€',
      spent: 1500000,
      forecast: 2250000,
      breakdown: getBudgetCategories(),
    },
  };

  // Demo Milestones (Multilingual)
  const getMilestoneName = (key: string) => {
    const names: Record<string, Record<string, string>> = {
      ms1: {
        de: 'Phase 1: Bewertung abgeschlossen',
        en: 'Phase 1: Assessment Complete',
        es: 'Fase 1: Evaluación Completada',
      },
      ms2: {
        de: 'Phase 2: Migration läuft',
        en: 'Phase 2: Migration In Progress',
        es: 'Fase 2: Migración en Progreso',
      },
      ms3: {
        de: 'Phase 3: Optimierung & Go-Live',
        en: 'Phase 3: Optimization & Go-Live',
        es: 'Fase 3: Optimización y Lanzamiento',
      },
    };
    return names[key]?.[lang] || names[key]?.['en'] || key;
  };

  const getMilestoneDesc = (key: string) => {
    const descs: Record<string, Record<string, string>> = {
      ms1: {
        de: 'Infrastruktur-Audit und Anwendungsanalyse abgeschlossen',
        en: 'Infrastructure audit and application analysis finished',
        es: 'Auditoría de infraestructura y análisis de aplicaciones finalizado',
      },
      ms2: {
        de: '12 von 18 Anwendungen in die Cloud migriert',
        en: '12 of 18 applications migrated to cloud',
        es: '12 de 18 aplicaciones migradas a la nube',
      },
      ms3: {
        de: 'Performance-Tuning und finaler Umstieg',
        en: 'Performance tuning and final cutover',
        es: 'Ajuste de rendimiento y cambio final',
      },
    };
    return descs[key]?.[lang] || descs[key]?.['en'] || '';
  };

  const demoMilestones: ProjectMilestone[] = [
    {
      id: 'ms-1',
      project_id: 'project-1',
      name: getMilestoneName('ms1'),
      description: getMilestoneDesc('ms1'),
      due_date: '2025-12-31',
      status: 'completed',
      percentage_complete: 100,
      completion_date: '2025-12-28',
    },
    {
      id: 'ms-2',
      project_id: 'project-1',
      name: getMilestoneName('ms2'),
      description: getMilestoneDesc('ms2'),
      due_date: '2026-04-30',
      status: 'in_progress',
      percentage_complete: 67,
    },
    {
      id: 'ms-3',
      project_id: 'project-1',
      name: getMilestoneName('ms3'),
      description: getMilestoneDesc('ms3'),
      due_date: '2026-07-01',
      status: 'pending',
      percentage_complete: 0,
    },
  ];

  // Demo Risks (Multilingual)
  const getRiskTitle = (key: string) => {
    const titles: Record<string, Record<string, string>> = {
      risk1: {
        de: 'Datenverlust während Migration',
        en: 'Data Loss During Migration',
        es: 'Pérdida de Datos Durante la Migración',
      },
      risk2: {
        de: 'Budgetüberschreitung',
        en: 'Budget Overrun',
        es: 'Exceso de Presupuesto',
      },
      risk3: {
        de: 'Legacy-System-Kompatibilität',
        en: 'Legacy System Compatibility',
        es: 'Compatibilidad del Sistema Heredado',
      },
    };
    return titles[key]?.[lang] || titles[key]?.['en'] || key;
  };

  const getRiskDesc = (key: string) => {
    const descs: Record<string, Record<string, string>> = {
      risk1: {
        de: 'Potenzielle Datenkorruption oder -verlust während der Datenbankmigration',
        en: 'Potential data corruption or loss during database migration',
        es: 'Posible corrupción o pérdida de datos durante la migración de la base de datos',
      },
      risk2: {
        de: 'Cloud-Kosten höher als geschätzt aufgrund von Datentransfergebühren',
        en: 'Cloud costs higher than estimated due to data transfer fees',
        es: 'Costos de nube más altos de lo estimado debido a tarifas de transferencia de datos',
      },
      risk3: {
        de: 'Eine Anwendung ist nicht kompatibel mit der Cloud-Architektur',
        en: 'One application incompatible with cloud architecture',
        es: 'Una aplicación incompatible con la arquitectura de nube',
      },
    };
    return descs[key]?.[lang] || descs[key]?.['en'] || '';
  };

  const getMitigationPlan = (key: string) => {
    const plans: Record<string, Record<string, string>> = {
      risk1: {
        de: 'Automatisierte Backup-Strategie implementieren, Migration in Staging-Umgebung testen',
        en: 'Implement automated backup strategy, test migration in staging environment',
        es: 'Implementar estrategia de respaldo automatizada, probar migración en entorno de staging',
      },
      risk2: {
        de: 'Mengenrabatt mit AWS ausgehandelt, Datentransferstrategie optimiert',
        en: 'Negotiated volume discount with AWS, optimized data transfer strategy',
        es: 'Negociado descuento por volumen con AWS, optimizada estrategia de transferencia de datos',
      },
      risk3: {
        de: 'Re-Architektur vs. On-Premise-Betrieb evaluieren',
        en: 'Evaluate re-architecture vs. keeping on-premise',
        es: 'Evaluar rearquitectura vs. mantener en local',
      },
    };
    return plans[key]?.[lang] || plans[key]?.['en'] || '';
  };

  const demoRisks: ProjectRisk[] = [
    {
      id: 'risk-1',
      project_id: 'project-1',
      type: 'risk',
      title: getRiskTitle('risk1'),
      description: getRiskDesc('risk1'),
      probability: 'medium',
      impact: 'high',
      risk_score: 6,
      status: 'open',
      mitigation_plan: getMitigationPlan('risk1'),
      owner_name: 'Thomas Weber',
    },
    {
      id: 'risk-2',
      project_id: 'project-1',
      type: 'risk',
      title: getRiskTitle('risk2'),
      description: getRiskDesc('risk2'),
      probability: 'medium',
      impact: 'medium',
      risk_score: 4,
      status: 'mitigated',
      mitigation_plan: getMitigationPlan('risk2'),
      owner_name: 'Johann Schmidt',
    },
    {
      id: 'risk-3',
      project_id: 'project-1',
      type: 'issue',
      title: getRiskTitle('risk3'),
      description: getRiskDesc('risk3'),
      probability: 'high',
      impact: 'medium',
      risk_score: 6,
      status: 'open',
      mitigation_plan: getMitigationPlan('risk3'),
      owner_name: 'Maria Mueller',
    },
  ];

  // Demo Change Requests (Multilingual)
  const getChangeTitle = (key: string) => {
    const titles: Record<string, Record<string, string>> = {
      cr1: {
        de: 'Load Balancer hinzufügen',
        en: 'Add Load Balancer',
        es: 'Agregar Balanceador de Carga',
      },
      cr2: {
        de: 'Zusätzliches Security Audit',
        en: 'Additional Security Audit',
        es: 'Auditoría de Seguridad Adicional',
      },
      cr3: {
        de: 'Test-Umgebung überspringen',
        en: 'Skip Test Environment',
        es: 'Omitir Entorno de Prueba',
      },
    };
    return titles[key]?.[lang] || titles[key]?.['en'] || key;
  };

  const getChangeDesc = (key: string) => {
    const descs: Record<string, Record<string, string>> = {
      cr1: {
        de: 'Redundanter Load Balancer für höhere Verfügbarkeit',
        en: 'Redundant load balancer for higher availability',
        es: 'Balanceador de carga redundante para mayor disponibilidad',
      },
      cr2: {
        de: 'Penetrationstest von externem Dienstleister',
        en: 'Penetration testing by external provider',
        es: 'Prueba de penetración por proveedor externo',
      },
      cr3: {
        de: 'Direkt in Produktion gehen, Staging überspringen',
        en: 'Go directly to production, skip staging',
        es: 'Ir directamente a producción, omitir staging',
      },
    };
    return descs[key]?.[lang] || descs[key]?.['en'] || '';
  };

  const getChangeRejectionReason = () => {
    const reasons: Record<string, string> = {
      de: 'Zu riskant - Staging-Tests sind Pflicht für sichere Migration',
      en: 'Too risky - Staging tests are mandatory for safe migration',
      es: 'Demasiado arriesgado - Las pruebas de staging son obligatorias para una migración segura',
    };
    return reasons[lang] || reasons['en'];
  };

  const demoChanges: ProjectChangeRequest[] = [
    {
      id: 'cr-1',
      project_id: 'project-1',
      cr_number: 'CR-001',
      title: getChangeTitle('cr1'),
      description: getChangeDesc('cr1'),
      status: 'implemented',
      priority: 'high',
      cost_impact: 50000,
      timeline_impact: 14,
      risk_impact: 'low',
      request_date: '2025-12-10',
      approval_date: '2025-12-15',
      implementation_date: '2026-01-05',
      requested_by: 'maria-mueller-id',
      requester_name: 'Maria Mueller',
      approved_by: 'johann-schmidt-id',
    },
    {
      id: 'cr-2',
      project_id: 'project-1',
      cr_number: 'CR-002',
      title: getChangeTitle('cr2'),
      description: getChangeDesc('cr2'),
      status: 'pending',
      priority: 'medium',
      cost_impact: 80000,
      timeline_impact: 21,
      risk_impact: 'high',
      request_date: '2026-01-15',
      requested_by: 'thomas-weber-id',
      requester_name: 'Thomas Weber',
    },
    {
      id: 'cr-3',
      project_id: 'project-1',
      cr_number: 'CR-003',
      title: getChangeTitle('cr3'),
      description: getChangeDesc('cr3'),
      status: 'rejected',
      priority: 'low',
      cost_impact: -30000,
      timeline_impact: -7,
      risk_impact: 'high',
      request_date: '2025-11-20',
      review_date: '2025-11-22',
      rejection_reason: getChangeRejectionReason(),
      requested_by: 'budget-team-id',
      requester_name: 'Budget Team',
      reviewed_by: 'johann-schmidt-id',
    },
  ];

  // Demo UI Labels (2x3 Matrix)
  const demoLabels: Record<string, PMPUILabel> = {
    [PMP_LABEL_KEYS.W_QUESTION_WHY]: {
      id: '1',
      label_key: PMP_LABEL_KEYS.W_QUESTION_WHY,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Warum machen wir das?', management: 'Geschäftsbegründung' },
        en: { colloquial: 'Why are we doing this?', management: 'Business Case' },
        es: { colloquial: '¿Por qué hacemos esto?', management: 'Caso de negocio' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_WHAT]: {
      id: '2',
      label_key: PMP_LABEL_KEYS.W_QUESTION_WHAT,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Was wird gemacht?', management: 'Projektumfang' },
        en: { colloquial: 'What will be done?', management: 'Project Scope' },
        es: { colloquial: '¿Qué se hará?', management: 'Alcance del proyecto' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_HOW]: {
      id: '3',
      label_key: PMP_LABEL_KEYS.W_QUESTION_HOW,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Wie gehen wir vor?', management: 'Vorgehensmodell' },
        en: { colloquial: 'How will we do it?', management: 'Approach & Methodology' },
        es: { colloquial: '¿Cómo lo haremos?', management: 'Enfoque y metodología' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_WHO]: {
      id: '4',
      label_key: PMP_LABEL_KEYS.W_QUESTION_WHO,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Wer macht mit?', management: 'Projektorganisation' },
        en: { colloquial: 'Who is involved?', management: 'Project Organization' },
        es: { colloquial: '¿Quién participa?', management: 'Organización del proyecto' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_WHEN]: {
      id: '5',
      label_key: PMP_LABEL_KEYS.W_QUESTION_WHEN,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Wann passiert was?', management: 'Zeitplan' },
        en: { colloquial: 'When will it happen?', management: 'Timeline' },
        es: { colloquial: '¿Cuándo sucederá?', management: 'Cronograma' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_WHERE]: {
      id: '6',
      label_key: PMP_LABEL_KEYS.W_QUESTION_WHERE,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Wo findet es statt?', management: 'Standorte & Systeme' },
        en: { colloquial: 'Where will it take place?', management: 'Locations & Systems' },
        es: { colloquial: '¿Dónde tendrá lugar?', management: 'Ubicaciones y sistemas' },
      },
    },
    [PMP_LABEL_KEYS.W_QUESTION_HOW_MUCH]: {
      id: '7',
      label_key: PMP_LABEL_KEYS.W_QUESTION_HOW_MUCH,
      label_category: 'w_questions',
      matrix_data: {
        de: { colloquial: 'Was kostet es?', management: 'Projektbudget' },
        en: { colloquial: 'How much will it cost?', management: 'Project Budget' },
        es: { colloquial: '¿Cuánto costará?', management: 'Presupuesto del proyecto' },
      },
    },
    [PMP_LABEL_KEYS.MILESTONE_STATUS_PENDING]: {
      id: '8',
      label_key: PMP_LABEL_KEYS.MILESTONE_STATUS_PENDING,
      label_category: 'milestone_status',
      matrix_data: {
        de: { colloquial: 'Noch nicht begonnen', management: 'Ausstehend' },
        en: { colloquial: 'Not started yet', management: 'Pending' },
        es: { colloquial: 'Aún no iniciado', management: 'Pendiente' },
      },
    },
    [PMP_LABEL_KEYS.MILESTONE_STATUS_IN_PROGRESS]: {
      id: '9',
      label_key: PMP_LABEL_KEYS.MILESTONE_STATUS_IN_PROGRESS,
      label_category: 'milestone_status',
      matrix_data: {
        de: { colloquial: 'In Arbeit', management: 'In Bearbeitung' },
        en: { colloquial: 'In progress', management: 'In Progress' },
        es: { colloquial: 'En progreso', management: 'En progreso' },
      },
    },
    [PMP_LABEL_KEYS.MILESTONE_STATUS_COMPLETED]: {
      id: '10',
      label_key: PMP_LABEL_KEYS.MILESTONE_STATUS_COMPLETED,
      label_category: 'milestone_status',
      matrix_data: {
        de: { colloquial: 'Fertig', management: 'Abgeschlossen' },
        en: { colloquial: 'Done', management: 'Completed' },
        es: { colloquial: 'Completado', management: 'Completado' },
      },
    },
    [PMP_LABEL_KEYS.MILESTONE_STATUS_DELAYED]: {
      id: '11',
      label_key: PMP_LABEL_KEYS.MILESTONE_STATUS_DELAYED,
      label_category: 'milestone_status',
      matrix_data: {
        de: { colloquial: 'Verspätet', management: 'Verzögert' },
        en: { colloquial: 'Late', management: 'Delayed' },
        es: { colloquial: 'Retrasado', management: 'Retrasado' },
      },
    },
    [PMP_LABEL_KEYS.RISK_STATUS_OPEN]: {
      id: '12',
      label_key: PMP_LABEL_KEYS.RISK_STATUS_OPEN,
      label_category: 'risk_status',
      matrix_data: {
        de: { colloquial: 'Offen', management: 'Offen' },
        en: { colloquial: 'Open', management: 'Open' },
        es: { colloquial: 'Abierto', management: 'Abierto' },
      },
    },
    [PMP_LABEL_KEYS.RISK_STATUS_MITIGATED]: {
      id: '13',
      label_key: PMP_LABEL_KEYS.RISK_STATUS_MITIGATED,
      label_category: 'risk_status',
      matrix_data: {
        de: { colloquial: 'Entschärft', management: 'Mitigiert' },
        en: { colloquial: 'Handled', management: 'Mitigated' },
        es: { colloquial: 'Manejado', management: 'Mitigado' },
      },
    },
    [PMP_LABEL_KEYS.RISK_STATUS_CLOSED]: {
      id: '14',
      label_key: PMP_LABEL_KEYS.RISK_STATUS_CLOSED,
      label_category: 'risk_status',
      matrix_data: {
        de: { colloquial: 'Erledigt', management: 'Geschlossen' },
        en: { colloquial: 'Resolved', management: 'Closed' },
        es: { colloquial: 'Resuelto', management: 'Cerrado' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-400">
              📋 PMP Integration Demo
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Testing: W-Questions, Milestones, Risks & Action Items
            </p>
          </div>
          
          {/* Controls Dropdown (rechts neben dem Titel) */}
          <SharedControlsDropdown
            language={lang}
            mode={register}
            onLanguageChange={setLang}
            onModeChange={setRegister}
          />
        </div>

        {/* Project Card */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 sm:p-6">
          <h2 className="text-xl font-bold mb-1">Cloud Migration Program [DUMMY]</h2>
          <p className="text-slate-400 text-sm mb-6">
            Moving important work tasks to AWS cloud with multi-cloud strategy
          </p>

          <div className="space-y-6">
            {/* W-Questions Section */}
            <ProjectCardPMPSection
              pmp={demoPMP}
              labels={demoLabels}
              lang={lang}
              register={register}
              onEdit={() => alert('Edit PMP clicked!')}
            />

            {/* Milestones Section */}
            <ProjectMilestonesSection
              project_id="project-1"
              milestones={demoMilestones}
              labels={demoLabels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Milestone clicked!')}
              onEdit={(ms) => alert(`Edit Milestone: ${ms.name}`)}
              onDelete={(id) => alert(`Delete Milestone: ${id}`)}
              isEditable={true}
            />

            {/* Risks & Action Items Section */}
            <ProjectRisksSection
              project_id="project-1"
              risks={demoRisks}
              labels={demoLabels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Risk clicked!')}
              onEdit={(risk) => alert(`Edit Risk: ${risk.title}`)}
              onDelete={(id) => alert(`Delete Risk: ${id}`)}
              isEditable={true}
            />

            {/* Change Management Section */}
            <ProjectChangeManagementSection
              project_id="project-1"
              changes={demoChanges}
              labels={demoLabels}
              lang={lang}
              register={register}
              onAdd={() => alert('Add Change Request clicked!')}
              onEdit={(cr) => alert(`Edit Change Request: ${cr.title}`)}
              onDelete={(id) => alert(`Delete Change Request: ${id}`)}
              onApprove={(id) => alert(`Approve Change Request: ${id}`)}
              onReject={(id, reason) => alert(`Reject: ${id}\nReason: ${reason}`)}
              isEditable={true}
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-sm">
          <h3 className="font-semibold text-blue-300 mb-2">✅ Was funktioniert:</h3>
          <ul className="space-y-1 text-slate-300">
            <li>• 2x3 Matrix (DE/EN/ES × Colloquial/Management)</li>
            <li>• W-Fragen collapsible mit Icons</li>
            <li>• Milestones mit Progress Bars & Status Icons</li>
            <li>• Risks mit Risk Score & Color Coding (Red/Yellow/Green)</li>
            <li>• Action Items statt "Probleme" (konstruktiv)</li>
            <li>• Change Management mit Approve/Reject Workflow</li>
            <li>• Impact Summary (Cost + Timeline)</li>
            <li>• Alle Komponenten fully responsive</li>
            <li>• Add/Edit/Delete Modals (Demo Alerts)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
