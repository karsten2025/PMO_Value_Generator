-- Migration: instance_id in pmo_kpi_values als optional machen
-- Damit können wir KPI-Werte direkt zu Portfolios zuordnen,
-- ohne zwingend eine pmo_instance zu brauchen

-- 1. Foreign Key Constraint entfernen
ALTER TABLE pmo_kpi_values 
DROP CONSTRAINT IF EXISTS pmo_kpi_values_instance_id_fkey;

-- 2. Spalte auf NULL erlauben
ALTER TABLE pmo_kpi_values 
ALTER COLUMN instance_id DROP NOT NULL;

-- 3. Foreign Key Constraint neu erstellen (mit NULL erlaubt)
ALTER TABLE pmo_kpi_values 
ADD CONSTRAINT pmo_kpi_values_instance_id_fkey 
FOREIGN KEY (instance_id) 
REFERENCES pmo_instances(id) 
ON DELETE CASCADE;

-- Hinweis: instance_id ist jetzt optional (NULL erlaubt)
-- Das erlaubt uns, KPI-Werte direkt einem Portfolio zuzuordnen
-- ohne dass eine explizite PMO-Instanz existieren muss

