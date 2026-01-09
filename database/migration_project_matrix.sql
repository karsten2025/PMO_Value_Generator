-- Migration: 2x3 Matrix für Projektnamen und Beschreibungen
-- Gemäß .cursorrules: DE/EN/ES x Colloquial/Management

-- 1. name_matrix hinzufügen
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS name_matrix JSONB;

-- 2. description_matrix hinzufügen
ALTER TABLE pmo_projects 
ADD COLUMN IF NOT EXISTS description_matrix JSONB;

-- 3. Alte Spalten behalten als Fallback
-- (name und description bleiben als einfache TEXT-Spalten)

-- Hinweis: Die Matrix-Struktur sollte so aussehen:
-- {
--   "de": { "colloquial": "...", "management": "..." },
--   "en": { "colloquial": "...", "management": "..." },
--   "es": { "colloquial": "...", "management": "..." }
-- }

