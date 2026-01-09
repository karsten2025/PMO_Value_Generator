# Supabase Setup für PMO Impact Cycle Frontend

## 🚀 Schnellstart

### 1. Umgebungsvariablen einrichten

Erstelle eine `.env.local` Datei im `frontend/` Verzeichnis:

```bash
cd frontend
touch .env.local
```

Füge folgende Zeilen hinzu (ersetze mit deinen Supabase-Credentials):

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### 2. Supabase Credentials finden

1. Gehe zu [supabase.com](https://supabase.com)
2. Öffne dein Projekt
3. Klicke auf **Settings** → **API**
4. Kopiere:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Server neu starten

Nach dem Hinzufügen der Umgebungsvariablen, starte den Dev-Server neu:

```bash
npm run dev
```

## 📊 Datenbank-Struktur

Die App erwartet folgende Supabase-Tabellen:

### `pmo_portfolios`
```sql
- id (uuid, primary key)
- name (text)
- description (text, nullable)
- organization (text, nullable)
- is_active (boolean, default: true)
- created_at (timestamp)
```

### `pmo_instance_metrics`
```sql
- id (uuid, primary key)
- portfolio_id (uuid, foreign key → pmo_portfolios)
- step_id (integer, 1-10)
- kpi_id (text)
- target_value (numeric)
- actual_value (numeric)
- unit (text)
- last_updated (timestamp)
- notes (text, nullable)
```

## 🔒 Row Level Security (RLS)

Stelle sicher, dass RLS für beide Tabellen aktiviert ist:

```sql
-- Beispiel: Alle authentifizierten Benutzer können lesen
CREATE POLICY "Allow authenticated read" ON pmo_portfolios
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated read" ON pmo_instance_metrics
  FOR SELECT USING (auth.role() = 'authenticated');
```

## ✅ Funktionsweise

1. **Portfolio-Auswahl**: Im Header kannst du zwischen Portfolios wechseln
2. **Automatisches Laden**: KPI-Metriken werden automatisch für das gewählte Portfolio geladen
3. **Echtzeit-Fortschritt**: Die Impact-Nodes zeigen den realen Fortschritt basierend auf:
   - `actual_value / target_value` für jede KPI
   - Durchschnitt aller KPIs pro Step (Milestone)

## 🐛 Troubleshooting

### "Keine Portfolios verfügbar"
- Prüfe, ob Portfolios in der `pmo_portfolios` Tabelle existieren
- Stelle sicher, dass `is_active = true` gesetzt ist

### "Fehler beim Laden"
- Überprüfe die Umgebungsvariablen in `.env.local`
- Prüfe die Browser-Konsole auf Fehlermeldungen
- Stelle sicher, dass RLS-Policies korrekt konfiguriert sind

### Metriken werden nicht angezeigt
- Prüfe, ob Daten in `pmo_instance_metrics` existieren
- Stelle sicher, dass `portfolio_id` korrekt referenziert ist
- Prüfe, ob `step_id` zwischen 1-10 liegt

