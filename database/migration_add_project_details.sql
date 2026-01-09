-- Migration: Add Project Detail Columns for Drill-Down Feature
-- Purpose: Enable stakeholders to see which projects contribute to portfolio
-- Date: 2026-01-09

-- ============================================================================
-- 1. Extend pmo_projects table with strategic alignment and impact metrics
-- ============================================================================

DO $$ 
BEGIN

-- Add strategic_alignment column
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS strategic_alignment TEXT 
  CHECK (strategic_alignment IN ('strategic', 'tactical', 'operational'));

-- Add impact_score column
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS impact_score TEXT 
  CHECK (impact_score IN ('low', 'medium', 'high'));

-- Add risk_level column
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS risk_level TEXT 
  CHECK (risk_level IN ('low', 'medium', 'high'));

-- Add project_owner column
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS project_owner TEXT;

-- Add budget column (in EUR cents to avoid floating point issues)
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS budget BIGINT DEFAULT 0;

-- Add start_date and end_date
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS start_date DATE;

ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Add tags for categorization (JSONB array)
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;

RAISE NOTICE '✅ Project detail columns added successfully';

END $$;

-- ============================================================================
-- 2. Create index for performance
-- ============================================================================

DO $$
BEGIN

-- Index for filtering by strategic alignment
CREATE INDEX IF NOT EXISTS idx_projects_alignment 
  ON pmo_projects(strategic_alignment);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_projects_status 
  ON pmo_projects(status);

-- Index for filtering by portfolio
CREATE INDEX IF NOT EXISTS idx_projects_portfolio 
  ON pmo_projects(portfolio_id);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_projects_portfolio_status_alignment 
  ON pmo_projects(portfolio_id, status, strategic_alignment);

RAISE NOTICE '✅ Performance indices created';

END $$;

-- ============================================================================
-- 3. Update existing projects with default values (if any exist)
-- ============================================================================

DO $$
BEGIN

UPDATE pmo_projects 
SET 
  strategic_alignment = 'tactical',
  impact_score = 'medium',
  risk_level = 'medium',
  project_owner = 'Unassigned'
WHERE strategic_alignment IS NULL;

RAISE NOTICE '✅ Existing projects updated with defaults';

END $$;

-- ============================================================================
-- 4. Verify migration
-- ============================================================================

DO $$
DECLARE
  col_count INTEGER;
BEGIN

SELECT COUNT(*) INTO col_count
FROM information_schema.columns
WHERE table_name = 'pmo_projects'
  AND column_name IN (
    'strategic_alignment', 
    'impact_score', 
    'risk_level', 
    'project_owner', 
    'budget'
  );

IF col_count = 5 THEN
  RAISE NOTICE '✅ Migration verified: All 5 columns exist';
ELSE
  RAISE WARNING '⚠️  Warning: Only % of 5 expected columns found', col_count;
END IF;

END $$;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '🎉 Migration completed successfully!';
  RAISE NOTICE '📊 Projects can now be categorized as Strategic/Tactical/Operational';
  RAISE NOTICE '🎯 Impact Score and Risk Level tracking enabled';
  RAISE NOTICE '👤 Project Owner field added';
  RAISE NOTICE '💰 Budget tracking enabled';
END $$;

