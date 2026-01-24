-- ============================================================================
-- QUICK INSERT: Finance Data für Cloud Migration Program [DUMMY]
-- ============================================================================
-- Dieser Query fügt sofort Finance-Daten ein (ohne komplexe Suche)
-- ============================================================================

-- SCHRITT 1: Tabelle erstellen (falls noch nicht vorhanden)
CREATE TABLE IF NOT EXISTS pmo_project_finance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES pmo_projects(id) ON DELETE CASCADE NOT NULL,
    planned_capex BIGINT DEFAULT 0,
    planned_opex BIGINT DEFAULT 0,
    actual_capex BIGINT DEFAULT 0,
    actual_opex BIGINT DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    fiscal_year INTEGER,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, fiscal_year)
);

-- RLS deaktivieren
ALTER TABLE pmo_project_finance DISABLE ROW LEVEL SECURITY;

-- SCHRITT 2: Finance-Daten für DUMMY-Projekt einfügen
-- (Wir suchen das Projekt und fügen die Daten in einem Schritt ein)
INSERT INTO pmo_project_finance (
    project_id,
    planned_capex,
    planned_opex,
    actual_capex,
    actual_opex,
    currency,
    fiscal_year
)
SELECT 
    id AS project_id,
    250000000 AS planned_capex,   -- 2.500.000 EUR (in Cents)
    120000000 AS planned_opex,    -- 1.200.000 EUR (in Cents)
    235000000 AS actual_capex,    -- 2.350.000 EUR (in Cents) - 6% unter Budget
    125000000 AS actual_opex,     -- 1.250.000 EUR (in Cents) - 4% über Budget
    'EUR' AS currency,
    2026 AS fiscal_year
FROM pmo_projects 
WHERE name ILIKE '%Cloud Migration%' 
  AND name ILIKE '%DUMMY%'
LIMIT 1
ON CONFLICT (project_id, fiscal_year) DO UPDATE SET
    planned_capex = EXCLUDED.planned_capex,
    planned_opex = EXCLUDED.planned_opex,
    actual_capex = EXCLUDED.actual_capex,
    actual_opex = EXCLUDED.actual_opex,
    last_updated = NOW();

-- SCHRITT 3: Prüfen, ob es geklappt hat
SELECT 
    p.name AS projekt_name,
    pf.planned_capex / 100.0 AS geplant_capex_eur,
    pf.actual_capex / 100.0 AS ausgegeben_capex_eur,
    pf.planned_opex / 100.0 AS geplant_opex_eur,
    pf.actual_opex / 100.0 AS ausgegeben_opex_eur,
    (pf.planned_capex + pf.planned_opex) / 100.0 AS total_geplant_eur,
    (pf.actual_capex + pf.actual_opex) / 100.0 AS total_ausgegeben_eur,
    pf.currency,
    pf.fiscal_year
FROM pmo_projects p
JOIN pmo_project_finance pf ON p.id = pf.project_id
WHERE p.name ILIKE '%Cloud Migration%';
