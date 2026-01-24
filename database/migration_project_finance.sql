-- ============================================================================
-- PROJECT FINANCE TABLE - Value & Budget Tracking
-- ============================================================================
-- Speichert CapEx und OpEx für jedes Projekt (in CENTS!)
-- ============================================================================

CREATE TABLE IF NOT EXISTS pmo_project_finance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES pmo_projects(id) ON DELETE CASCADE NOT NULL,
    
    -- PLANNED BUDGET (in CENTS)
    planned_capex BIGINT DEFAULT 0,        -- Planned Capital Expenditure
    planned_opex BIGINT DEFAULT 0,         -- Planned Operational Expenditure
    
    -- ACTUAL SPENDING (in CENTS)
    actual_capex BIGINT DEFAULT 0,         -- Actual Capital Expenditure
    actual_opex BIGINT DEFAULT 0,          -- Actual Operational Expenditure
    
    -- METADATA
    currency VARCHAR(3) DEFAULT 'EUR',     -- Währung
    fiscal_year INTEGER,                   -- Geschäftsjahr
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    updated_by TEXT,                       -- Wer hat zuletzt aktualisiert?
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- UNIQUE CONSTRAINT: Pro Projekt nur ein Finance-Eintrag (pro Jahr)
    UNIQUE(project_id, fiscal_year)
);

-- Indizes für Performance
CREATE INDEX IF NOT EXISTS idx_project_finance_project ON pmo_project_finance(project_id);
CREATE INDEX IF NOT EXISTS idx_project_finance_year ON pmo_project_finance(fiscal_year);

-- RLS deaktivieren (wie bei anderen Tabellen)
ALTER TABLE pmo_project_finance DISABLE ROW LEVEL SECURITY;

-- Trigger für updated_at
CREATE TRIGGER update_project_finance_updated_at
    BEFORE UPDATE ON pmo_project_finance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (Demo-Projekt: Cloud Migration Program [DUMMY])
-- ============================================================================

-- Finde die Cloud Migration Program [DUMMY] ID
DO $$
DECLARE
    dummy_project_id UUID;
BEGIN
    -- Suche das DUMMY-Projekt
    SELECT id INTO dummy_project_id 
    FROM pmo_projects 
    WHERE name ILIKE '%Cloud Migration%' 
    AND name LIKE '%[DUMMY]%' 
    LIMIT 1;
    
    IF dummy_project_id IS NOT NULL THEN
        -- Füge Finance-Daten ein (nur wenn noch nicht vorhanden)
        INSERT INTO pmo_project_finance (
            project_id,
            planned_capex,
            planned_opex,
            actual_capex,
            actual_opex,
            currency,
            fiscal_year
        ) VALUES (
            dummy_project_id,
            250000000,  -- 2.5M EUR in Cents (CapEx)
            120000000,  -- 1.2M EUR in Cents (OpEx)
            235000000,  -- 2.35M EUR actual (5% under budget ✅)
            125000000,  -- 1.25M EUR actual (4% over budget ⚠️)
            'EUR',
            2026
        ) ON CONFLICT (project_id, fiscal_year) DO NOTHING;
        
        RAISE NOTICE '✅ Finance-Daten für Cloud Migration Program [DUMMY] eingefügt';
    ELSE
        RAISE NOTICE '⚠️  Kein DUMMY-Projekt gefunden, Sample Data übersprungen';
    END IF;
END $$;

-- ============================================================================
-- STATUS REPORT
-- ============================================================================

DO $$
DECLARE
    finance_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO finance_count FROM pmo_project_finance;
    
    RAISE NOTICE '================================================================';
    RAISE NOTICE '✅ PROJECT FINANCE MIGRATION ABGESCHLOSSEN!';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Finance-Einträge: %', finance_count;
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Nächster Schritt: Frontend-Komponente ProjectFinanceValue.tsx nutzen';
    RAISE NOTICE '================================================================';
END $$;
