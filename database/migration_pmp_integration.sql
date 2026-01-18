-- ============================================
-- PMO VALUE GENERATOR: PMP Integration
-- Migration: Project Management Plan Tables
-- ============================================
-- Berücksichtigt .cursorrules: 2x3 Matrix (de/en/es × colloquial/management)
-- ============================================

-- ============================================
-- 1. PROJECT MANAGEMENT PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS project_management_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- W-FRAGEN (2x3 Matrix für Labels)
  -- WHY: Business Case
  business_case_why TEXT,
  business_objectives JSONB DEFAULT '[]',
  expected_benefits JSONB DEFAULT '[]',
  
  -- WHAT: Scope & Deliverables
  scope_what TEXT,
  scope_deliverables JSONB DEFAULT '[]',
  scope_exclusions JSONB DEFAULT '[]',
  
  -- HOW: Approach & Methodology
  approach_how TEXT,
  methodology VARCHAR(50) DEFAULT 'hybrid', -- agile/waterfall/hybrid
  phases JSONB DEFAULT '[]',
  
  -- WHO: Team & Stakeholders
  team_structure JSONB DEFAULT '{}',
  -- {owner_id, team_members: [{user_id, role}], stakeholders: [{name, role, interest}]}
  
  -- WHEN: Timeline
  timeline JSONB DEFAULT '{}',
  -- {start_date, end_date, baseline_end_date, critical_path}
  
  -- WHERE: Location & Systems
  locations JSONB DEFAULT '[]',
  affected_systems JSONB DEFAULT '[]',
  
  -- HOW MUCH: Budget
  budget JSONB DEFAULT '{}',
  -- {total_budget, currency, spent, forecast, contingency, breakdown: [{category, amount}]}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  
  UNIQUE(project_id)
);

-- Index für schnelle Project Lookups
CREATE INDEX idx_pmp_project_id ON project_management_plans(project_id);

-- ============================================
-- 2. PROJECT MILESTONES
-- ============================================
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Timeline
  due_date DATE NOT NULL,
  baseline_due_date DATE,
  completion_date DATE,
  
  -- Status: pending/in_progress/completed/delayed/cancelled
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Progress
  percentage_complete INTEGER DEFAULT 0 CHECK (percentage_complete >= 0 AND percentage_complete <= 100),
  
  -- Dependencies
  depends_on UUID[], -- Array of milestone IDs
  
  -- Deliverables
  deliverables JSONB DEFAULT '[]',
  
  -- 2x3 Matrix für Status Labels (optional, falls custom Namen gewünscht)
  matrix_data JSONB DEFAULT '{}',
  -- {de: {colloquial, management}, en: {...}, es: {...}}
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  sort_order INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_milestones_project_id ON project_milestones(project_id);
CREATE INDEX idx_milestones_due_date ON project_milestones(due_date);
CREATE INDEX idx_milestones_status ON project_milestones(status);

-- ============================================
-- 3. PROJECT RISKS & ISSUES
-- ============================================
CREATE TABLE IF NOT EXISTS project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Type: risk (potential) vs issue (occurred)
  type VARCHAR(50) DEFAULT 'risk', -- risk/issue
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Risk Assessment
  probability VARCHAR(50), -- low/medium/high
  impact VARCHAR(50), -- low/medium/high
  risk_score INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN probability = 'high' AND impact = 'high' THEN 9
      WHEN probability = 'high' AND impact = 'medium' THEN 6
      WHEN probability = 'high' AND impact = 'low' THEN 3
      WHEN probability = 'medium' AND impact = 'high' THEN 6
      WHEN probability = 'medium' AND impact = 'medium' THEN 4
      WHEN probability = 'medium' AND impact = 'low' THEN 2
      WHEN probability = 'low' AND impact = 'high' THEN 3
      WHEN probability = 'low' AND impact = 'medium' THEN 2
      ELSE 1
    END
  ) STORED,
  
  -- Status: open/mitigated/closed
  status VARCHAR(50) DEFAULT 'open',
  
  -- Mitigation
  mitigation_plan TEXT,
  mitigation_actions JSONB DEFAULT '[]',
  
  -- Assignment
  owner_id UUID,
  
  -- Dates
  identified_date DATE DEFAULT CURRENT_DATE,
  target_closure_date DATE,
  closed_date DATE,
  
  -- 2x3 Matrix für Custom Labels (optional)
  matrix_data JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Indexes
CREATE INDEX idx_risks_project_id ON project_risks(project_id);
CREATE INDEX idx_risks_type ON project_risks(type);
CREATE INDEX idx_risks_status ON project_risks(status);
CREATE INDEX idx_risks_score ON project_risks(risk_score DESC);

-- ============================================
-- 4. PROJECT CHANGE REQUESTS
-- ============================================
CREATE TABLE IF NOT EXISTS project_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Change Request Info
  cr_number VARCHAR(50), -- CR-001, CR-002, etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  justification TEXT,
  
  -- Requester
  requested_by UUID,
  request_date DATE DEFAULT CURRENT_DATE,
  
  -- Impact Assessment
  scope_impact TEXT,
  cost_impact DECIMAL(12, 2) DEFAULT 0, -- +/- amount
  timeline_impact INTEGER DEFAULT 0, -- +/- days
  risk_impact VARCHAR(50), -- low/medium/high
  quality_impact TEXT,
  
  -- Approval Workflow
  status VARCHAR(50) DEFAULT 'pending', -- pending/approved/rejected/implemented/cancelled
  reviewed_by UUID,
  review_date DATE,
  approved_by UUID,
  approval_date DATE,
  rejection_reason TEXT,
  
  -- Implementation
  implementation_date DATE,
  actual_cost_impact DECIMAL(12, 2),
  actual_timeline_impact INTEGER,
  implementation_notes TEXT,
  
  -- Priority
  priority VARCHAR(50) DEFAULT 'medium', -- low/medium/high/critical
  
  -- 2x3 Matrix (optional)
  matrix_data JSONB DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_changes_project_id ON project_change_requests(project_id);
CREATE INDEX idx_changes_status ON project_change_requests(status);
CREATE INDEX idx_changes_cr_number ON project_change_requests(cr_number);

-- ============================================
-- 5. PROJECT KPIs (Frei definierbar!)
-- ============================================
CREATE TABLE IF NOT EXISTS project_kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- KPI Definition (vom Projektleiter definiert)
  kpi_name VARCHAR(255) NOT NULL,
  kpi_description TEXT,
  
  -- Category (optional grouping)
  category VARCHAR(100), -- schedule/cost/quality/scope/custom
  
  -- Values
  current_value DECIMAL(12, 2),
  target_value DECIMAL(12, 2),
  baseline_value DECIMAL(12, 2),
  
  unit VARCHAR(50), -- %, €, days, count, etc.
  
  -- Direction
  higher_is_better BOOLEAN DEFAULT TRUE,
  
  -- Thresholds (optional)
  warning_threshold DECIMAL(12, 2),
  critical_threshold DECIMAL(12, 2),
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,
  
  -- 2x3 Matrix für KPI Name & Description
  matrix_data JSONB DEFAULT '{}',
  -- {de: {colloquial: "Server migriert", management: "Infrastruktur-Migration"}, en: {...}, es: {...}}
  
  -- History (optional, für Trend Charts)
  value_history JSONB DEFAULT '[]',
  -- [{date, value, note}]
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID
);

-- Indexes
CREATE INDEX idx_project_kpis_project_id ON project_kpis(project_id);
CREATE INDEX idx_project_kpis_category ON project_kpis(category);
CREATE INDEX idx_project_kpis_display_order ON project_kpis(display_order);

-- ============================================
-- 6. PMP LABELS (2x3 Matrix für UI)
-- ============================================
-- Statische Labels für W-Fragen, Status, etc.
CREATE TABLE IF NOT EXISTS pmp_ui_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_key VARCHAR(100) UNIQUE NOT NULL, -- 'w_question_why', 'status_pending', etc.
  label_category VARCHAR(50), -- 'w_questions', 'milestone_status', 'risk_status', etc.
  
  -- 2x3 Matrix
  matrix_data JSONB NOT NULL,
  -- {
  --   de: {colloquial: "Warum", management: "Geschäftsbegründung"},
  --   en: {colloquial: "Why", management: "Business Case"},
  --   es: {colloquial: "Por qué", management: "Caso de negocio"}
  -- }
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed PMP Labels
INSERT INTO pmp_ui_labels (label_key, label_category, matrix_data) VALUES
-- W-FRAGEN
('w_question_why', 'w_questions', '{
  "de": {"colloquial": "Warum machen wir das?", "management": "Geschäftsbegründung"},
  "en": {"colloquial": "Why are we doing this?", "management": "Business Case"},
  "es": {"colloquial": "¿Por qué hacemos esto?", "management": "Caso de negocio"}
}'::jsonb),

('w_question_what', 'w_questions', '{
  "de": {"colloquial": "Was wird gemacht?", "management": "Projektumfang"},
  "en": {"colloquial": "What will be done?", "management": "Project Scope"},
  "es": {"colloquial": "¿Qué se hará?", "management": "Alcance del proyecto"}
}'::jsonb),

('w_question_how', 'w_questions', '{
  "de": {"colloquial": "Wie gehen wir vor?", "management": "Vorgehensmodell"},
  "en": {"colloquial": "How will we do it?", "management": "Approach & Methodology"},
  "es": {"colloquial": "¿Cómo lo haremos?", "management": "Enfoque y metodología"}
}'::jsonb),

('w_question_who', 'w_questions', '{
  "de": {"colloquial": "Wer macht mit?", "management": "Projektorganisation"},
  "en": {"colloquial": "Who is involved?", "management": "Project Organization"},
  "es": {"colloquial": "¿Quién participa?", "management": "Organización del proyecto"}
}'::jsonb),

('w_question_when', 'w_questions', '{
  "de": {"colloquial": "Wann passiert was?", "management": "Zeitplan"},
  "en": {"colloquial": "When will it happen?", "management": "Timeline"},
  "es": {"colloquial": "¿Cuándo sucederá?", "management": "Cronograma"}
}'::jsonb),

('w_question_where', 'w_questions', '{
  "de": {"colloquial": "Wo findet es statt?", "management": "Standorte & Systeme"},
  "en": {"colloquial": "Where will it take place?", "management": "Locations & Systems"},
  "es": {"colloquial": "¿Dónde tendrá lugar?", "management": "Ubicaciones y sistemas"}
}'::jsonb),

('w_question_how_much', 'w_questions', '{
  "de": {"colloquial": "Was kostet es?", "management": "Projektbudget"},
  "en": {"colloquial": "How much will it cost?", "management": "Project Budget"},
  "es": {"colloquial": "¿Cuánto costará?", "management": "Presupuesto del proyecto"}
}'::jsonb),

-- MILESTONE STATUS
('milestone_status_pending', 'milestone_status', '{
  "de": {"colloquial": "Noch nicht begonnen", "management": "Ausstehend"},
  "en": {"colloquial": "Not started yet", "management": "Pending"},
  "es": {"colloquial": "Aún no iniciado", "management": "Pendiente"}
}'::jsonb),

('milestone_status_in_progress', 'milestone_status', '{
  "de": {"colloquial": "In Arbeit", "management": "In Bearbeitung"},
  "en": {"colloquial": "In progress", "management": "In Progress"},
  "es": {"colloquial": "En progreso", "management": "En progreso"}
}'::jsonb),

('milestone_status_completed', 'milestone_status', '{
  "de": {"colloquial": "Fertig", "management": "Abgeschlossen"},
  "en": {"colloquial": "Done", "management": "Completed"},
  "es": {"colloquial": "Completado", "management": "Completado"}
}'::jsonb),

('milestone_status_delayed', 'milestone_status', '{
  "de": {"colloquial": "Verspätet", "management": "Verzögert"},
  "en": {"colloquial": "Late", "management": "Delayed"},
  "es": {"colloquial": "Retrasado", "management": "Retrasado"}
}'::jsonb),

-- RISK STATUS
('risk_status_open', 'risk_status', '{
  "de": {"colloquial": "Offen", "management": "Offen"},
  "en": {"colloquial": "Open", "management": "Open"},
  "es": {"colloquial": "Abierto", "management": "Abierto"}
}'::jsonb),

('risk_status_mitigated', 'risk_status', '{
  "de": {"colloquial": "Entschärft", "management": "Mitigiert"},
  "en": {"colloquial": "Handled", "management": "Mitigated"},
  "es": {"colloquial": "Manejado", "management": "Mitigado"}
}'::jsonb),

('risk_status_closed', 'risk_status', '{
  "de": {"colloquial": "Erledigt", "management": "Geschlossen"},
  "en": {"colloquial": "Resolved", "management": "Closed"},
  "es": {"colloquial": "Resuelto", "management": "Cerrado"}
}'::jsonb),

-- CHANGE REQUEST STATUS
('cr_status_pending', 'change_status', '{
  "de": {"colloquial": "Wird geprüft", "management": "Ausstehende Genehmigung"},
  "en": {"colloquial": "Being reviewed", "management": "Pending Approval"},
  "es": {"colloquial": "En revisión", "management": "Pendiente de aprobación"}
}'::jsonb),

('cr_status_approved', 'change_status', '{
  "de": {"colloquial": "Genehmigt", "management": "Genehmigt"},
  "en": {"colloquial": "Approved", "management": "Approved"},
  "es": {"colloquial": "Aprobado", "management": "Aprobado"}
}'::jsonb),

('cr_status_rejected', 'change_status', '{
  "de": {"colloquial": "Abgelehnt", "management": "Abgelehnt"},
  "en": {"colloquial": "Rejected", "management": "Rejected"},
  "es": {"colloquial": "Rechazado", "management": "Rechazado"}
}'::jsonb)

ON CONFLICT (label_key) DO NOTHING;

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE project_management_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmp_ui_labels ENABLE ROW LEVEL SECURITY;

-- Policies (alle User können lesen, nur Owner/Team können schreiben)
-- Hinweis: Diese Policies müssen später an das Auth-System angepasst werden

-- PMP: Read for all authenticated, Write for project team
CREATE POLICY "PMP read for authenticated users"
  ON project_management_plans FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "PMP write for project creators"
  ON project_management_plans FOR ALL
  USING (auth.uid() = created_by);

-- Milestones
CREATE POLICY "Milestones read for authenticated"
  ON project_milestones FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Milestones write for creators"
  ON project_milestones FOR ALL
  USING (auth.uid() = created_by);

-- Risks
CREATE POLICY "Risks read for authenticated"
  ON project_risks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Risks write for creators"
  ON project_risks FOR ALL
  USING (auth.uid() = created_by);

-- Change Requests
CREATE POLICY "Change requests read for authenticated"
  ON project_change_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Change requests write for creators"
  ON project_change_requests FOR ALL
  USING (auth.uid() = requested_by);

-- KPIs
CREATE POLICY "KPIs read for authenticated"
  ON project_kpis FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "KPIs write for creators"
  ON project_kpis FOR ALL
  USING (auth.uid() = created_by);

-- UI Labels (read-only for all)
CREATE POLICY "UI Labels read for all"
  ON pmp_ui_labels FOR SELECT
  USING (TRUE);

-- ============================================
-- 8. UPDATE TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pmp_updated_at BEFORE UPDATE ON project_management_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON project_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON project_risks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_changes_updated_at BEFORE UPDATE ON project_change_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON project_kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- Next: Add PMP data for existing projects via frontend
