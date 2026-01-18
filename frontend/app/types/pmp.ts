// ============================================
// PMP Types & Interfaces
// ============================================
// Berücksichtigt .cursorrules: 2x3 Matrix
// ============================================

// ============================================
// 0. MATRIX DATA TYPE (2x3 Matrix)
// ============================================

export interface MatrixData {
  de: {
    colloquial: string;
    management: string;
  };
  en: {
    colloquial: string;
    management: string;
  };
  es: {
    colloquial: string;
    management: string;
  };
}

export type Language = 'de' | 'en' | 'es';
export type Register = 'colloquial' | 'management';

// Helper: Get Label from Matrix
export function getMatrixLabel(
  matrix: MatrixData | undefined,
  lang: Language,
  register: Register
): string | undefined {
  return matrix?.[lang]?.[register];
}

// ============================================
// 1. CORE PMP INTERFACE
// ============================================

export interface ProjectManagementPlan {
  id: string;
  project_id: string;
  
  // W-FRAGEN
  business_case_why?: string;
  business_objectives?: string[];
  expected_benefits?: string[];
  
  scope_what?: string;
  scope_deliverables?: string[];
  scope_exclusions?: string[];
  
  approach_how?: string;
  methodology?: 'agile' | 'waterfall' | 'hybrid';
  phases?: ProjectPhase[];
  
  team_structure?: TeamStructure;
  
  timeline?: ProjectTimeline;
  
  locations?: string[];
  affected_systems?: string[];
  
  budget?: ProjectBudget;
  
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// ============================================
// 2. SUPPORTING TYPES
// ============================================

export interface ProjectPhase {
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  deliverables?: string[];
}

export interface TeamStructure {
  owner_id?: string;
  owner_name?: string;
  team_members?: TeamMember[];
  stakeholders?: Stakeholder[];
}

export interface TeamMember {
  user_id?: string;
  name: string;
  role: string;
  allocation?: number; // % time allocation
}

export interface Stakeholder {
  name: string;
  role: string;
  interest: 'low' | 'medium' | 'high';
  influence: 'low' | 'medium' | 'high';
  communication_frequency?: string;
}

export interface ProjectTimeline {
  start_date?: string;
  end_date?: string;
  baseline_end_date?: string;
  critical_path?: string[];
}

export interface ProjectBudget {
  total_budget?: number;
  currency?: string;
  spent?: number;
  forecast?: number;
  contingency?: number;
  breakdown?: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage?: number;
}

// ============================================
// 3. MILESTONES
// ============================================

export interface ProjectMilestone {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  due_date: string;
  baseline_due_date?: string;
  completion_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
  percentage_complete: number;
  depends_on?: string[];
  deliverables?: string[];
  matrix_data?: MatrixData; // 2x3 for custom labels
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  sort_order?: number;
}

// ============================================
// 4. RISKS & ISSUES
// ============================================

export interface ProjectRisk {
  id: string;
  project_id: string;
  type: 'risk' | 'issue';
  title: string;
  description?: string;
  probability?: 'low' | 'medium' | 'high';
  impact?: 'low' | 'medium' | 'high';
  risk_score?: number; // 1-9, calculated
  status: 'open' | 'mitigated' | 'closed';
  mitigation_plan?: string;
  mitigation_actions?: string[];
  owner_id?: string;
  owner_name?: string;
  identified_date?: string;
  target_closure_date?: string;
  closed_date?: string;
  matrix_data?: MatrixData;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// Risk Score Helper
export function calculateRiskScore(
  probability: 'low' | 'medium' | 'high',
  impact: 'low' | 'medium' | 'high'
): number {
  const scores: Record<string, Record<string, number>> = {
    high: { high: 9, medium: 6, low: 3 },
    medium: { high: 6, medium: 4, low: 2 },
    low: { high: 3, medium: 2, low: 1 },
  };
  return scores[probability]?.[impact] || 1;
}

// Risk Color Helper
export function getRiskColor(score: number): string {
  if (score >= 7) return 'red'; // High risk
  if (score >= 4) return 'yellow'; // Medium risk
  return 'green'; // Low risk
}

// ============================================
// 5. CHANGE REQUESTS
// ============================================

export interface ProjectChangeRequest {
  id: string;
  project_id: string;
  cr_number?: string;
  title: string;
  description?: string;
  justification?: string;
  requested_by?: string;
  requester_name?: string;
  request_date?: string;
  
  // Impact
  scope_impact?: string;
  cost_impact?: number;
  timeline_impact?: number; // days
  risk_impact?: 'low' | 'medium' | 'high';
  quality_impact?: string;
  
  // Approval
  status: 'pending' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
  reviewed_by?: string;
  review_date?: string;
  approved_by?: string;
  approval_date?: string;
  rejection_reason?: string;
  
  // Implementation
  implementation_date?: string;
  actual_cost_impact?: number;
  actual_timeline_impact?: number;
  implementation_notes?: string;
  
  priority?: 'low' | 'medium' | 'high' | 'critical';
  matrix_data?: MatrixData;
  created_at?: string;
  updated_at?: string;
}

// Change Request Impact Summary
export interface ChangeRequestImpactSummary {
  total_cost_impact: number;
  total_timeline_impact: number; // days
  pending_count: number;
  approved_count: number;
  rejected_count: number;
}

// ============================================
// 6. PROJECT KPIs (Frei definierbar!)
// ============================================

export interface ProjectKPI {
  id: string;
  project_id: string;
  kpi_name: string;
  kpi_description?: string;
  category?: string; // schedule/cost/quality/scope/custom
  current_value?: number;
  target_value?: number;
  baseline_value?: number;
  unit?: string; // %, €, days, count, etc.
  higher_is_better: boolean;
  warning_threshold?: number;
  critical_threshold?: number;
  display_order?: number;
  is_visible: boolean;
  matrix_data?: MatrixData; // 2x3 for multilingual names
  value_history?: KPIValueHistory[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface KPIValueHistory {
  date: string;
  value: number;
  note?: string;
}

// KPI Performance Calculation
export interface KPIPerformance {
  kpi: ProjectKPI;
  performance_percentage: number; // 0-100%
  status: 'critical' | 'warning' | 'on_track' | 'excellent';
  trend?: 'up' | 'down' | 'stable';
}

export function calculateKPIPerformance(kpi: ProjectKPI): KPIPerformance {
  if (
    kpi.current_value === undefined ||
    kpi.target_value === undefined ||
    kpi.target_value === 0
  ) {
    return {
      kpi,
      performance_percentage: 0,
      status: 'warning',
    };
  }

  const current = kpi.current_value;
  const target = kpi.target_value;
  const baseline = kpi.baseline_value || 0;

  let percentage: number;

  if (kpi.higher_is_better) {
    // Höher ist besser (z.B. Umsatz, Fortschritt)
    percentage = (current / target) * 100;
  } else {
    // Niedriger ist besser (z.B. Kosten, Fehler, Verzögerungen)
    // Invertierte Logik: Je niedriger current, desto besser die Performance
    if (current <= target) {
      percentage = 100; // On target or better
    } else {
      // Überschreitung: percentage sinkt
      const overshoot = current - target;
      const tolerance = target * 0.2; // 20% tolerance
      percentage = Math.max(0, 100 - (overshoot / tolerance) * 100);
    }
  }

  // Status determination
  let status: 'critical' | 'warning' | 'on_track' | 'excellent';
  if (percentage >= 100) status = 'excellent';
  else if (percentage >= 90) status = 'on_track';
  else if (percentage >= 75) status = 'warning';
  else status = 'critical';

  // Trend (if history exists)
  let trend: 'up' | 'down' | 'stable' | undefined;
  if (kpi.value_history && kpi.value_history.length >= 2) {
    const recent = kpi.value_history.slice(-2);
    const delta = recent[1].value - recent[0].value;
    if (Math.abs(delta) < target * 0.05) trend = 'stable'; // < 5% change
    else if (kpi.higher_is_better) {
      trend = delta > 0 ? 'up' : 'down';
    } else {
      trend = delta < 0 ? 'up' : 'down'; // Inverted for "lower is better"
    }
  }

  return {
    kpi,
    performance_percentage: Math.round(percentage),
    status,
    trend,
  };
}

// ============================================
// 7. UI LABELS (2x3 Matrix)
// ============================================

export interface PMPUILabel {
  id: string;
  label_key: string;
  label_category: string;
  matrix_data: MatrixData;
  created_at?: string;
}

// Label Keys
export const PMP_LABEL_KEYS = {
  // W-Questions
  W_QUESTION_WHY: 'w_question_why',
  W_QUESTION_WHAT: 'w_question_what',
  W_QUESTION_HOW: 'w_question_how',
  W_QUESTION_WHO: 'w_question_who',
  W_QUESTION_WHEN: 'w_question_when',
  W_QUESTION_WHERE: 'w_question_where',
  W_QUESTION_HOW_MUCH: 'w_question_how_much',
  
  // Milestone Status
  MILESTONE_STATUS_PENDING: 'milestone_status_pending',
  MILESTONE_STATUS_IN_PROGRESS: 'milestone_status_in_progress',
  MILESTONE_STATUS_COMPLETED: 'milestone_status_completed',
  MILESTONE_STATUS_DELAYED: 'milestone_status_delayed',
  
  // Risk Status
  RISK_STATUS_OPEN: 'risk_status_open',
  RISK_STATUS_MITIGATED: 'risk_status_mitigated',
  RISK_STATUS_CLOSED: 'risk_status_closed',
  
  // Change Request Status
  CR_STATUS_PENDING: 'cr_status_pending',
  CR_STATUS_APPROVED: 'cr_status_approved',
  CR_STATUS_REJECTED: 'cr_status_rejected',
} as const;

// ============================================
// 8. PROJECT HEALTH SUMMARY
// ============================================

export interface ProjectHealthSummary {
  overall_health: 'critical' | 'at_risk' | 'on_track' | 'excellent';
  schedule_status: 'delayed' | 'on_track' | 'ahead';
  budget_status: 'over_budget' | 'on_budget' | 'under_budget';
  scope_status: 'scope_creep' | 'on_track' | 'reduced';
  quality_status: 'below_target' | 'on_target' | 'exceeds_target';
  risk_exposure: 'high' | 'medium' | 'low';
  
  // Metrics
  spi?: number; // Schedule Performance Index
  cpi?: number; // Cost Performance Index
  open_risks_count: number;
  high_risks_count: number;
  pending_changes_count: number;
  
  // KPIs
  kpi_performance_avg: number; // 0-100%
  critical_kpis_count: number;
}

// Helper: Calculate Project Health
export function calculateProjectHealth(
  pmp: ProjectManagementPlan,
  milestones: ProjectMilestone[],
  risks: ProjectRisk[],
  changes: ProjectChangeRequest[],
  kpis: ProjectKPI[]
): ProjectHealthSummary {
  // Schedule Status
  const delayedMilestones = milestones.filter(m => m.status === 'delayed');
  const schedule_status: 'delayed' | 'on_track' | 'ahead' =
    delayedMilestones.length > 0 ? 'delayed' : 'on_track';

  // Budget Status
  const budget = pmp.budget;
  let budget_status: 'over_budget' | 'on_budget' | 'under_budget' = 'on_budget';
  if (budget && budget.total_budget && budget.spent) {
    const spentPercentage = (budget.spent / budget.total_budget) * 100;
    if (spentPercentage > 105) budget_status = 'over_budget';
    else if (spentPercentage < 95) budget_status = 'under_budget';
  }

  // Risk Exposure
  const openRisks = risks.filter(r => r.status === 'open');
  const highRisks = openRisks.filter(r => (r.risk_score || 0) >= 7);
  const risk_exposure: 'high' | 'medium' | 'low' =
    highRisks.length > 2 ? 'high' : highRisks.length > 0 ? 'medium' : 'low';

  // KPI Performance
  const kpiPerformances = kpis.map(calculateKPIPerformance);
  const kpi_performance_avg =
    kpiPerformances.reduce((sum, kp) => sum + kp.performance_percentage, 0) /
    (kpiPerformances.length || 1);
  const critical_kpis_count = kpiPerformances.filter(
    kp => kp.status === 'critical'
  ).length;

  // Overall Health
  let healthScore = 100;
  if (schedule_status === 'delayed') healthScore -= 20;
  if (budget_status === 'over_budget') healthScore -= 20;
  if (risk_exposure === 'high') healthScore -= 30;
  if (risk_exposure === 'medium') healthScore -= 15;
  if (critical_kpis_count > 0) healthScore -= critical_kpis_count * 10;

  const overall_health: 'critical' | 'at_risk' | 'on_track' | 'excellent' =
    healthScore < 50
      ? 'critical'
      : healthScore < 70
      ? 'at_risk'
      : healthScore < 90
      ? 'on_track'
      : 'excellent';

  return {
    overall_health,
    schedule_status,
    budget_status,
    scope_status: 'on_track', // TODO: implement scope tracking
    quality_status: 'on_target', // TODO: implement quality tracking
    risk_exposure,
    open_risks_count: openRisks.length,
    high_risks_count: highRisks.length,
    pending_changes_count: changes.filter(c => c.status === 'pending').length,
    kpi_performance_avg: Math.round(kpi_performance_avg),
    critical_kpis_count,
  };
}
