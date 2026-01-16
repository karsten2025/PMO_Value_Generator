/**
 * Score Calculation Engine für PMO Value Generator
 * 
 * Berechnet Scores auf 3 Ebenen:
 * 1. Metric Level: Einzelne Metrik (Target vs. Current)
 * 2. Process Level: Aggregation aller Metriken eines Prozesses
 * 3. Portfolio Level: Aggregation aller Prozesse
 * 
 * Basiert auf Logic Model Framework:
 * - Input: 10% Gewichtung
 * - Process: 15% Gewichtung
 * - Output: 20% Gewichtung
 * - Outcome: 35% Gewichtung (HÖCHSTER IMPACT!)
 * - Feedback: 20% Gewichtung
 * 
 * Unterstützt:
 * - "higher_is_better" Metriken (z.B. Trainings durchgeführt)
 * - "lower_is_better" Metriken (z.B. Kosten, Verzögerungen)
 */

// ===========================
// TYPES & INTERFACES
// ===========================

export type MetricCategory = 'input' | 'process' | 'output' | 'outcome' | 'feedback';
export type ScoringDirection = 'higher_is_better' | 'lower_is_better';
export type CategoryWeights = Record<MetricCategory, number>;

export interface MetricValue {
  metric_id: string;
  metric_name: string;
  category: MetricCategory;
  scoring_direction: ScoringDirection;
  target_value: number;
  current_value: number;
  unit?: string; // z.B. "€", "h", "%" etc.
}

export interface MetricScore extends MetricValue {
  score: number; // 0-100
  performance: 'excellent' | 'good' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable'; // Wird später aus Historie berechnet
}

export interface ProcessScore {
  process_id: number;
  process_name: string;
  metrics: MetricScore[];
  overall_score: number; // 0-100, gewichtet nach Kategorien
  category_scores: {
    input: number;
    process: number;
    output: number;
    outcome: number;
    feedback: number;
  };
}

export interface PortfolioScore {
  portfolio_id: string;
  portfolio_name: string;
  processes: ProcessScore[];
  overall_score: number; // 0-100, Durchschnitt aller Prozesse
  health_status: 'excellent' | 'good' | 'warning' | 'critical';
  category_scores: {
    input: number;
    process: number;
    output: number;
    outcome: number;
    feedback: number;
  };
}

// ===========================
// CATEGORY WEIGHTS (Logic Model)
// ===========================

export const DEFAULT_CATEGORY_WEIGHTS: Record<MetricCategory, number> = {
  input: 0.10,     // 10% - Ressourcen sind Basis, aber nicht direkter Impact
  process: 0.15,   // 15% - Aktivitäten sind wichtig für Execution
  output: 0.20,    // 20% - Deliverables sind direktes Ergebnis
  outcome: 0.35,   // 35% - Business Value = HÖCHSTER IMPACT! 🔥
  feedback: 0.20,  // 20% - Stakeholder Response für Iteration
};

// Export for backwards compatibility
export const CATEGORY_WEIGHTS = DEFAULT_CATEGORY_WEIGHTS;

/**
 * Load Category Weights from LocalStorage (falls angepasst)
 * Fallback: DEFAULT_CATEGORY_WEIGHTS
 */
export function getCategoryWeights(): Record<MetricCategory, number> {
  if (typeof window === 'undefined') {
    return DEFAULT_CATEGORY_WEIGHTS;
  }

  try {
    const saved = localStorage.getItem('category_weights');
    if (saved) {
      const parsed = JSON.parse(saved) as CategoryWeights;
      // Validate: Summe muss ~100% sein
      const total = Object.values(parsed).reduce((sum: number, w: number) => sum + w, 0);
      if (Math.abs(total - 1.0) < 0.01) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load category weights:', e);
  }

  return DEFAULT_CATEGORY_WEIGHTS;
}

// ===========================
// METRIC SCORE CALCULATION
// ===========================

/**
 * Berechnet Score für eine einzelne Metrik
 * 
 * @param metric - Metrik mit Target und Current Value
 * @returns MetricScore mit berechnetem Score (0-100) und Performance-Level
 */
export function calculateMetricScore(metric: MetricValue): MetricScore {
  const { target_value, current_value, scoring_direction } = metric;

  // Edge Case: Division by Zero vermeiden
  if (target_value === 0) {
    return {
      ...metric,
      score: 0,
      performance: 'critical',
    };
  }

  let rawScore: number;

  // Berechnung abhängig von Scoring Direction
  if (scoring_direction === 'higher_is_better') {
    // Beispiel: Trainings durchgeführt (mehr = besser)
    // Score = (Current / Target) * 100
    rawScore = (current_value / target_value) * 100;
  } else {
    // "lower_is_better"
    // Beispiel: Kosten, Verzögerungen (weniger = besser)
    // Score = (1 - (Current / Target)) * 100
    // Aber: Wenn Current < Target, dann Score > 100 (gut!)
    // Wenn Current > Target, dann Score < 100 (schlecht!)
    if (current_value <= target_value) {
      // Besser als Target! 🎉
      rawScore = 100 + ((target_value - current_value) / target_value) * 50;
    } else {
      // Schlechter als Target 😞
      rawScore = Math.max(0, 100 - ((current_value - target_value) / target_value) * 100);
    }
  }

  // Score auf 0-100 begrenzen (außer bei "lower_is_better" über-performance)
  const rawScoreClamped = scoring_direction === 'lower_is_better' 
    ? Math.min(150, Math.max(0, rawScore)) // Max 150 bei lower_is_better
    : Math.min(100, Math.max(0, rawScore)); // Max 100 bei higher_is_better

  // RUNDEN: Aufrunden ohne Nachkommastellen
  const score = Math.round(rawScoreClamped);

  // Performance Level bestimmen
  const performance = getPerformanceLevel(score);

  return {
    ...metric,
    score,
    performance,
  };
}

/**
 * Bestimmt Performance-Level basierend auf Score
 * 
 * @param score - Score (0-150, meist 0-100)
 * @returns Performance Level
 */
function getPerformanceLevel(score: number): 'excellent' | 'good' | 'warning' | 'critical' {
  if (score >= 90) return 'excellent';  // 90-150%
  if (score >= 70) return 'good';       // 70-89%
  if (score >= 50) return 'warning';    // 50-69%
  return 'critical';                     // 0-49%
}

// ===========================
// PROCESS SCORE CALCULATION
// ===========================

/**
 * Berechnet Score für einen kompletten Prozess
 * 
 * Gewichtet Metriken nach Kategorie (Logic Model)
 * 
 * @param processId - ID des Prozesses (1-10)
 * @param processName - Name des Prozesses
 * @param metrics - Alle Metriken des Prozesses mit Werten
 * @returns ProcessScore mit gewichtetem Overall Score
 */
export function calculateProcessScore(
  processId: number,
  processName: string,
  metrics: MetricValue[]
): ProcessScore {
  // 1. Berechne Score für jede Metrik
  const metricScores: MetricScore[] = metrics.map(calculateMetricScore);

  // 2. Gruppiere Metriken nach Kategorie
  const categorizedMetrics = groupMetricsByCategory(metricScores);

  // 3. Berechne Category Scores (Durchschnitt pro Kategorie)
  const categoryScores = {
    input: calculateCategoryAverage(categorizedMetrics.input),
    process: calculateCategoryAverage(categorizedMetrics.process),
    output: calculateCategoryAverage(categorizedMetrics.output),
    outcome: calculateCategoryAverage(categorizedMetrics.outcome),
    feedback: calculateCategoryAverage(categorizedMetrics.feedback),
  };

  // 4. Lade angepasste Weights (falls vorhanden)
  const weights = getCategoryWeights();

  // 5. Berechne Overall Score (gewichtet nach Logic Model oder Custom Weights)
  const overall_score = 
    (categoryScores.input * weights.input) +
    (categoryScores.process * weights.process) +
    (categoryScores.output * weights.output) +
    (categoryScores.outcome * weights.outcome) +
    (categoryScores.feedback * weights.feedback);

  return {
    process_id: processId,
    process_name: processName,
    metrics: metricScores,
    overall_score: Math.round(overall_score),
    category_scores: {
      input: Math.round(categoryScores.input),
      process: Math.round(categoryScores.process),
      output: Math.round(categoryScores.output),
      outcome: Math.round(categoryScores.outcome),
      feedback: Math.round(categoryScores.feedback),
    },
  };
}

/**
 * Gruppiert Metriken nach Kategorie
 */
function groupMetricsByCategory(metrics: MetricScore[]): Record<MetricCategory, MetricScore[]> {
  return metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<MetricCategory, MetricScore[]>);
}

/**
 * Berechnet Durchschnitt für eine Kategorie
 */
function calculateCategoryAverage(metrics: MetricScore[] = []): number {
  if (metrics.length === 0) return 0;
  const sum = metrics.reduce((acc, m) => acc + m.score, 0);
  return sum / metrics.length;
}

// ===========================
// PORTFOLIO SCORE CALCULATION
// ===========================

/**
 * Berechnet Score für ein komplettes Portfolio
 * 
 * @param portfolioId - ID des Portfolios
 * @param portfolioName - Name des Portfolios
 * @param processes - Alle Prozesse mit ihren Scores
 * @returns PortfolioScore mit Overall Score und Health Status
 */
export function calculatePortfolioScore(
  portfolioId: string,
  portfolioName: string,
  processes: ProcessScore[]
): PortfolioScore {
  // Overall Score = Durchschnitt aller Process Scores
  const overall_score = processes.length > 0
    ? Math.round(processes.reduce((sum, p) => sum + p.overall_score, 0) / processes.length)
    : 0;

  // Health Status bestimmen
  const health_status = getPerformanceLevel(overall_score);

  return {
    portfolio_id: portfolioId,
    portfolio_name: portfolioName,
    processes,
    overall_score,
    health_status,
  };
}

// ===========================
// COLOR HELPERS (für UI)
// ===========================

/**
 * Gibt Farbe für Performance Level zurück (Tailwind Classes)
 */
export function getPerformanceColor(performance: 'excellent' | 'good' | 'warning' | 'critical'): {
  bg: string;
  text: string;
  border: string;
} {
  switch (performance) {
    case 'excellent':
      return {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500',
      };
    case 'good':
      return {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500',
      };
    case 'warning':
      return {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500',
      };
    case 'critical':
      return {
        bg: 'bg-red-500/20',
        text: 'text-red-400',
        border: 'border-red-500',
      };
  }
}

/**
 * Gibt Icon für Performance Level zurück
 */
export function getPerformanceIcon(performance: 'excellent' | 'good' | 'warning' | 'critical'): string {
  switch (performance) {
    case 'excellent': return '🎯';
    case 'good': return '✅';
    case 'warning': return '⚠️';
    case 'critical': return '🔴';
  }
}

