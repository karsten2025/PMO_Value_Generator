-- ========================================
-- RENAME PROJECTS: Remove [DUMMY] from all except Cloud Migration
-- ========================================
-- Only keep Cloud Migration as DUMMY for demo purposes
-- All other projects should be for real usage

-- Backup: Export current names first (for reference)
SELECT id, name, description 
FROM pmo_projects 
ORDER BY name;

-- Remove [DUMMY] from all projects EXCEPT Cloud Migration
UPDATE pmo_projects 
SET name = REPLACE(name, ' [DUMMY]', '')
WHERE name LIKE '%[DUMMY]%' 
  AND name NOT LIKE '%Cloud Migration%';

-- Ensure Cloud Migration keeps [DUMMY] tag
UPDATE pmo_projects 
SET name = 'Cloud Migration Program [DUMMY]'
WHERE name LIKE '%Cloud Migration%';

-- Update descriptions to clarify status
UPDATE pmo_projects 
SET description = CONCAT(description, ' (Demo project with sample data)')
WHERE name LIKE '%Cloud Migration Program [DUMMY]%';

-- Verify changes
SELECT id, name, description 
FROM pmo_projects 
ORDER BY name;
