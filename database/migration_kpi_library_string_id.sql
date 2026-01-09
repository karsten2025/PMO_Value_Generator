-- Migration: KPI Library mit String-IDs statt UUID
-- Damit die IDs aus kpi-library-mock.json (z.B. "DIS_AWR_STR_001") funktionieren

-- 1. Alte Tabelle droppen
DROP TABLE IF EXISTS pmo_kpi_library CASCADE;

-- 2. Neu erstellen mit TEXT id
CREATE TABLE pmo_kpi_library (
    id TEXT PRIMARY KEY,  -- z.B. "DIS_AWR_STR_001"
    step_number INTEGER NOT NULL,
    kpi_category TEXT CHECK (kpi_category IN ('strategic', 'tactical', 'operational')),
    matrix_data JSONB NOT NULL,
    unit TEXT DEFAULT '%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Index für Performance
CREATE INDEX idx_pmo_kpi_library_step ON pmo_kpi_library(step_number);
CREATE INDEX idx_pmo_kpi_library_category ON pmo_kpi_library(kpi_category);

-- 4. RLS deaktivieren
ALTER TABLE pmo_kpi_library DISABLE ROW LEVEL SECURITY;

