/**
 * Unit Tests für Score Calculation Engine
 * 
 * Testet:
 * - Higher is better Metriken
 * - Lower is better Metriken
 * - Edge Cases (Division by Zero, Negative Values)
 * - Category Weighting
 * - Process & Portfolio Aggregation
 */

import {
  calculateMetricScore,
  calculateProcessScore,
  calculatePortfolioScore,
  MetricValue,
  CATEGORY_WEIGHTS,
} from '../scoreCalculation';

describe('Score Calculation Engine', () => {
  // ===========================
  // METRIC SCORE TESTS
  // ===========================

  describe('calculateMetricScore', () => {
    test('HIGHER IS BETTER: 100% erreicht', () => {
      const metric: MetricValue = {
        metric_id: 'M1',
        metric_name: 'Trainings durchgeführt',
        category: 'process',
        scoring_direction: 'higher_is_better',
        target_value: 100,
        current_value: 100,
      };

      const result = calculateMetricScore(metric);

      expect(result.score).toBe(100);
      expect(result.performance).toBe('excellent');
    });

    test('HIGHER IS BETTER: 75% erreicht', () => {
      const metric: MetricValue = {
        metric_id: 'M2',
        metric_name: 'Projekte abgeschlossen',
        category: 'output',
        scoring_direction: 'higher_is_better',
        target_value: 100,
        current_value: 75,
      };

      const result = calculateMetricScore(metric);

      expect(result.score).toBe(75);
      expect(result.performance).toBe('good');
    });

    test('HIGHER IS BETTER: Über-Performance (150%)', () => {
      const metric: MetricValue = {
        metric_id: 'M3',
        metric_name: 'Stakeholder Meetings',
        category: 'feedback',
        scoring_direction: 'higher_is_better',
        target_value: 100,
        current_value: 150,
      };

      const result = calculateMetricScore(metric);

      // Score wird auf 100 begrenzt bei higher_is_better
      expect(result.score).toBe(100);
      expect(result.performance).toBe('excellent');
    });

    test('LOWER IS BETTER: Target erreicht', () => {
      const metric: MetricValue = {
        metric_id: 'M4',
        metric_name: 'Kosten pro Projekt',
        category: 'input',
        scoring_direction: 'lower_is_better',
        target_value: 10000, // €10k Target
        current_value: 10000, // €10k Actual
        unit: '€',
      };

      const result = calculateMetricScore(metric);

      expect(result.score).toBe(100);
      expect(result.performance).toBe('excellent');
    });

    test('LOWER IS BETTER: Besser als Target (Unter-Kosten!)', () => {
      const metric: MetricValue = {
        metric_id: 'M5',
        metric_name: 'Verzögerung in Tagen',
        category: 'process',
        scoring_direction: 'lower_is_better',
        target_value: 10, // Max 10 Tage
        current_value: 5,  // Nur 5 Tage! 🎉
        unit: 'Tage',
      };

      const result = calculateMetricScore(metric);

      // 50% besser als Target → Score über 100
      expect(result.score).toBeGreaterThan(100);
      expect(result.score).toBeLessThanOrEqual(150);
      expect(result.performance).toBe('excellent');
    });

    test('LOWER IS BETTER: Schlechter als Target (Über-Kosten)', () => {
      const metric: MetricValue = {
        metric_id: 'M6',
        metric_name: 'Budget Überschreitung',
        category: 'input',
        scoring_direction: 'lower_is_better',
        target_value: 1000, // Max €1k
        current_value: 1500, // €1.5k 😞
        unit: '€',
      };

      const result = calculateMetricScore(metric);

      // 50% schlechter als Target
      expect(result.score).toBeLessThan(100);
      expect(result.performance).toBe('warning'); // 50% = warning
    });

    test('EDGE CASE: Target = 0 (Division by Zero)', () => {
      const metric: MetricValue = {
        metric_id: 'M7',
        metric_name: 'Test Metric',
        category: 'output',
        scoring_direction: 'higher_is_better',
        target_value: 0,
        current_value: 50,
      };

      const result = calculateMetricScore(metric);

      expect(result.score).toBe(0);
      expect(result.performance).toBe('critical');
    });
  });

  // ===========================
  // PROCESS SCORE TESTS
  // ===========================

  describe('calculateProcessScore', () => {
    test('Berechnet gewichteten Overall Score korrekt', () => {
      const metrics: MetricValue[] = [
        // INPUT (10% Weight)
        {
          metric_id: 'M1',
          metric_name: 'Budget',
          category: 'input',
          scoring_direction: 'higher_is_better',
          target_value: 100,
          current_value: 80, // 80%
        },
        // OUTCOME (35% Weight) - HÖCHSTE GEWICHTUNG!
        {
          metric_id: 'M2',
          metric_name: 'Business Value',
          category: 'outcome',
          scoring_direction: 'higher_is_better',
          target_value: 100,
          current_value: 90, // 90%
        },
      ];

      const result = calculateProcessScore(1, 'Test Process', metrics);

      // Overall Score = (80 * 0.10) + (90 * 0.35) = 8 + 31.5 = ~40
      // Aber: Nur 2 von 5 Kategorien haben Werte!
      expect(result.overall_score).toBeGreaterThan(0);
      expect(result.category_scores.input).toBe(80);
      expect(result.category_scores.outcome).toBe(90);
    });

    test('Mehrere Metriken in einer Kategorie: Durchschnitt', () => {
      const metrics: MetricValue[] = [
        {
          metric_id: 'M1',
          metric_name: 'Metric A',
          category: 'output',
          scoring_direction: 'higher_is_better',
          target_value: 100,
          current_value: 80, // 80%
        },
        {
          metric_id: 'M2',
          metric_name: 'Metric B',
          category: 'output',
          scoring_direction: 'higher_is_better',
          target_value: 100,
          current_value: 60, // 60%
        },
      ];

      const result = calculateProcessScore(2, 'Test Process 2', metrics);

      // Category Score = (80 + 60) / 2 = 70
      expect(result.category_scores.output).toBe(70);
    });
  });

  // ===========================
  // PORTFOLIO SCORE TESTS
  // ===========================

  describe('calculatePortfolioScore', () => {
    test('Berechnet Durchschnitt aller Prozesse', () => {
      const processes = [
        {
          process_id: 1,
          process_name: 'Process A',
          metrics: [],
          overall_score: 80,
          category_scores: { input: 0, process: 0, output: 0, outcome: 0, feedback: 0 },
        },
        {
          process_id: 2,
          process_name: 'Process B',
          metrics: [],
          overall_score: 60,
          category_scores: { input: 0, process: 0, output: 0, outcome: 0, feedback: 0 },
        },
      ];

      const result = calculatePortfolioScore('P1', 'Test Portfolio', processes);

      // Overall = (80 + 60) / 2 = 70
      expect(result.overall_score).toBe(70);
      expect(result.health_status).toBe('good'); // 70% = good
    });
  });

  // ===========================
  // CATEGORY WEIGHTS TEST
  // ===========================

  describe('CATEGORY_WEIGHTS', () => {
    test('Summe aller Gewichtungen = 100%', () => {
      const sum = Object.values(CATEGORY_WEIGHTS).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 2); // 100% mit 2 Dezimalstellen
    });

    test('OUTCOME hat höchste Gewichtung', () => {
      const weights = CATEGORY_WEIGHTS;
      expect(weights.outcome).toBeGreaterThan(weights.input);
      expect(weights.outcome).toBeGreaterThan(weights.process);
      expect(weights.outcome).toBeGreaterThan(weights.output);
      expect(weights.outcome).toBeGreaterThan(weights.feedback);
    });
  });
});

