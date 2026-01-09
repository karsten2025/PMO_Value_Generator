-- ============================================================================
-- PMO Impact & Value Engine - CLEAN SLATE MIGRATION
-- ============================================================================
-- WARNUNG: Dieses Skript löscht ALTE Tabellen und erstellt ein neues Schema!
-- Führe es NUR aus, wenn du sicher bist, dass keine wichtigen Daten verloren gehen.
-- ============================================================================

-- ============================================================================
-- SCHRITT 1: CLEANUP (Alte Tabellen entfernen)
-- ============================================================================

-- Lösche Tabellen zuerst (CASCADE entfernt automatisch Abhängigkeiten)
DROP TABLE IF EXISTS pmo_kpi_values CASCADE;
DROP TABLE IF EXISTS pmo_instance_metrics CASCADE;
DROP TABLE IF EXISTS pmo_instances CASCADE;
DROP TABLE IF EXISTS pmo_kpi_library CASCADE;
DROP TABLE IF EXISTS pmo_projects CASCADE;
DROP TABLE IF EXISTS pmo_process_templates CASCADE;
DROP TABLE IF EXISTS pmo_templates CASCADE;
DROP TABLE IF EXISTS process_templates CASCADE;
DROP TABLE IF EXISTS pmo_portfolios CASCADE;
DROP TABLE IF EXISTS ui_config CASCADE;

-- Lösche Funktionen (Trigger werden automatisch mit Tabellen gelöscht)
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- SCHRITT 2: PORTFOLIOS (Der Überbau)
-- ============================================================================

CREATE TABLE pmo_portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- ============================================================================
-- SCHRITT 3: PROJEKTE (Neu)
-- ============================================================================

CREATE TABLE pmo_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    portfolio_id UUID REFERENCES pmo_portfolios(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_portfolio ON pmo_projects(portfolio_id);
CREATE INDEX idx_projects_status ON pmo_projects(status);

-- ============================================================================
-- SCHRITT 4: PROCESS TEMPLATES (Neu)
-- ============================================================================

CREATE TABLE pmo_process_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    step_number INTEGER,
    internal_code TEXT,
    matrix_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_step ON pmo_process_templates(step_number);

-- ============================================================================
-- SCHRITT 5: TEMPLATES (Wissens-Bibliothek)
-- ============================================================================

CREATE TABLE pmo_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internal_name TEXT UNIQUE,        -- Interner Code (z.B. 'impact_cycle_v1')
    legal_safe_title TEXT,            -- Rechtlich sicherer Titel des Frameworks
    matrix_data JSONB,                -- 2x3 Matrix (DE/EN/ES x Colloquial/Management)
    total_steps INTEGER,              -- Anzahl der Schritte im Prozess (für Validierung)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SCHRITT 6: PMO INSTANCES (Prozess-Durchläufe)
-- ============================================================================

CREATE TABLE pmo_instances (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_name TEXT,                            -- Name des konkreten PMO-Projekts
    portfolio_id UUID REFERENCES pmo_portfolios(id) ON DELETE CASCADE,
    project_id UUID REFERENCES pmo_projects(id) ON DELETE CASCADE,
    template_id UUID REFERENCES pmo_templates(id),  -- Referenz auf Template
    current_step INTEGER DEFAULT 1,               -- Welcher Schritt ist gerade aktiv?
    selected_lang TEXT DEFAULT 'de',              -- Gewählte Sprache (de/en/es)
    selected_mode TEXT DEFAULT 'colloquial',      -- Gewählter Modus (colloquial/management)
    instance_data JSONB,                          -- Strukturierte Nutzer-Eingaben
    alignment_data JSONB DEFAULT '{
        "strategic": {"goal_id": null, "score": 0},
        "tactical": {"priority": "Medium", "resource_status": "yellow"},
        "operational": {"sla_status": "on_track", "last_review": null}
    }'::jsonb,                                    -- Alignment-Struktur für PMI-Standards
    status TEXT DEFAULT 'active',                 -- Status: active/completed/paused
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_instances_portfolio ON pmo_instances(portfolio_id);
CREATE INDEX idx_instances_project ON pmo_instances(project_id);
CREATE INDEX idx_instances_status ON pmo_instances(status);

-- ============================================================================
-- SCHRITT 7: KPI LIBRARY (Best-Practice Kennzahlen-Bibliothek)
-- ============================================================================

CREATE TABLE pmo_kpi_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    step_number INTEGER NOT NULL,     -- 1 bis 10 (Flywheel/Impact Cycle Schritte)
    kpi_category TEXT CHECK (kpi_category IN ('strategic', 'tactical', 'operational')),
    matrix_data JSONB NOT NULL,       -- Die 2x3 Matrix für Namen & Beschreibung (DE/EN/ES x Colloquial/Management)
    unit TEXT,                        -- z.B. '%', 'Tage', 'EUR', 'Score'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kpi_step ON pmo_kpi_library(step_number);
CREATE INDEX idx_kpi_category ON pmo_kpi_library(kpi_category);

-- ============================================================================
-- SCHRITT 8: KPI VALUES (Konkrete Messwerte / KPI-Instanzen)
-- ============================================================================
-- Hier speichern wir, welcher Wert für welches Projekt in welchem Portfolio gilt.

CREATE TABLE pmo_kpi_values (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES pmo_portfolios(id) ON DELETE CASCADE,
    instance_id UUID REFERENCES pmo_instances(id) ON DELETE CASCADE,
    kpi_id UUID REFERENCES pmo_kpi_library(id) ON DELETE CASCADE,
    target_value NUMERIC,             -- Zielwert (Soll)
    actual_value NUMERIC,             -- Ist-Wert
    step_id TEXT,                     -- Verknüpfung zum Flywheel-Knoten (z.B. 'milestone_1')
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kpi_values_portfolio ON pmo_kpi_values(portfolio_id);
CREATE INDEX idx_kpi_values_instance ON pmo_kpi_values(instance_id);
CREATE INDEX idx_kpi_values_kpi ON pmo_kpi_values(kpi_id);
CREATE INDEX idx_kpi_values_step ON pmo_kpi_values(step_id);

-- ============================================================================
-- SCHRITT 9: UI CONFIG (Neu)
-- ============================================================================

CREATE TABLE ui_config (
    id TEXT PRIMARY KEY, 
    matrix_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Füge UI-Labels ein (mit UPSERT-Logik)
INSERT INTO ui_config (id, matrix_data) VALUES (
  'sidebar_labels', 
  '{
    "alignment_widget": {
      "strategic": {
        "de": { "colloquial": "Das große Ziel", "management": "Strategic Alignment & Portfolio Value" },
        "en": { "colloquial": "The Big Goal", "management": "Strategic Business Alignment" },
        "es": { "colloquial": "El Objetivo Mayor", "management": "Alineación Estratégica" }
      },
      "tactical": {
        "de": { "colloquial": "Planung & Leute", "management": "Tactical Capacity & Resource Optimization" },
        "en": { "colloquial": "Planning & People", "management": "Tactical Governance & Capacity" },
        "es": { "colloquial": "Planificación y Equipo", "management": "Gobernanza Táctica y Capacidad" }
      },
      "operational": {
        "de": { "colloquial": "Tägliche Arbeit", "management": "Operational Excellence & Performance Tracking" },
        "en": { "colloquial": "Day-to-day Work", "management": "Operational Execution & SLA Metrics" },
        "es": { "colloquial": "Trabajo Diario", "management": "Excelencia Operativa y Métricas" }
      },
      "save_button": {
        "de": { "colloquial": "Eingaben merken", "management": "Deliverables in Instanz sichern" },
        "en": { "colloquial": "Keep changes", "management": "Commit Evidence to Instance" },
        "es": { "colloquial": "Guardar cambios", "management": "Confirmar Evidencia en Instancia" }
      }
    }
  }'
) ON CONFLICT (id) DO UPDATE SET matrix_data = EXCLUDED.matrix_data;

-- ============================================================================
-- SCHRITT 10: ROW LEVEL SECURITY DEAKTIVIEREN
-- ============================================================================
-- WICHTIG: Ohne diese Statements sind die Tabellen in Supabase nicht zugänglich!

ALTER TABLE pmo_portfolios DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_process_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_instances DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_kpi_library DISABLE ROW LEVEL SECURITY;
ALTER TABLE pmo_kpi_values DISABLE ROW LEVEL SECURITY;
ALTER TABLE ui_config DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- SCHRITT 11: HELPER FUNCTIONS & TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger für Tabellen mit updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON pmo_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instances_updated_at
    BEFORE UPDATE ON pmo_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SCHRITT 12: SAMPLE DATA
-- ============================================================================

-- Beispiel-Portfolios
INSERT INTO pmo_portfolios (name, description) VALUES 
('IT-Transformation 2026', 'Alle Projekte zur Digitalisierung der Infrastruktur'),
('Produkt-Innovation', 'Entwicklung neuer Marktlösungen');

-- ============================================================================
-- SCHRITT 13: STATUS REPORT
-- ============================================================================

DO $$
DECLARE
    portfolio_count INTEGER;
    project_count INTEGER;
    kpi_count INTEGER;
    kpi_value_count INTEGER;
    instance_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO portfolio_count FROM pmo_portfolios;
    SELECT COUNT(*) INTO project_count FROM pmo_projects;
    SELECT COUNT(*) INTO kpi_count FROM pmo_kpi_library;
    SELECT COUNT(*) INTO kpi_value_count FROM pmo_kpi_values;
    SELECT COUNT(*) INTO instance_count FROM pmo_instances;
    
    RAISE NOTICE '================================================================';
    RAISE NOTICE '✅ PMO Database Schema - CLEAN SLATE ABGESCHLOSSEN!';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Portfolios:  %', portfolio_count;
    RAISE NOTICE 'Projekte:    %', project_count;
    RAISE NOTICE 'Instanzen:   %', instance_count;
    RAISE NOTICE 'KPIs:        %', kpi_count;
    RAISE NOTICE 'KPI-Werte:   %', kpi_value_count;
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Alle alten Tabellen wurden gelöscht und neu erstellt!';
    RAISE NOTICE '================================================================';
    RAISE NOTICE 'Nächster Schritt:';
    RAISE NOTICE '1. Führe extraction/seed_pmo_data.py aus (für Testdaten)';
    RAISE NOTICE '2. Öffne http://localhost:3000 im Browser';
    RAISE NOTICE '================================================================';
END $$;

