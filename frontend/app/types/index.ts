/**
 * Shared Type Definitions
 * 
 * Zentrale TypeScript Typen für das PMO Impact & Value Engine Projekt
 */

// KPI Value Structure
export interface KPIValue {
  kpiId: string;
  targetValue: number;
  currentValue: number;
}

// Milestone Completion Tracking (Process ID → Completion %)
export interface MilestoneCompletion {
  [milestoneId: string]: number; // 0-100%
}
