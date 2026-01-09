-- Migration: project_id zu pmo_kpi_values hinzufügen
-- Damit können wir KPI-Werte direkt zu Projekten zuordnen

-- Spalte hinzufügen
ALTER TABLE pmo_kpi_values 
ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES pmo_projects(id) ON DELETE CASCADE;

-- Index für Performance
CREATE INDEX IF NOT EXISTS idx_pmo_kpi_values_project_id 
ON pmo_kpi_values(project_id);

