-- Migration: pmo_kpi_values mit TEXT kpi_id statt UUID
-- Damit die Foreign Key zu pmo_kpi_library funktioniert

-- 1. Alte Constraints entfernen
ALTER TABLE pmo_kpi_values 
DROP CONSTRAINT IF EXISTS pmo_kpi_values_kpi_id_fkey;

-- 2. kpi_id Typ ändern von UUID zu TEXT
ALTER TABLE pmo_kpi_values 
ALTER COLUMN kpi_id TYPE TEXT;

-- 3. Foreign Key neu erstellen
ALTER TABLE pmo_kpi_values 
ADD CONSTRAINT pmo_kpi_values_kpi_id_fkey 
FOREIGN KEY (kpi_id) 
REFERENCES pmo_kpi_library(id) 
ON DELETE CASCADE;

