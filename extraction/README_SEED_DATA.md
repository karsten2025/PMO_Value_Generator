# PMO Data Seeder - Testdaten Generator

## 🎯 Übersicht

Das `seed_pmo_data.py` Skript erstellt realistische Testdaten in deiner Supabase-Datenbank, um das PMO Impact Cycle System zu testen.

## 📦 Was wird erstellt?

### 1. **Portfolios** (2 Stück)
- ✅ `Digital Transformation [DUMMY]`
  - Organisation: IT & Innovation
  - Scenario: **Balanced Performance**
  - Strategic: ~80%, Tactical: ~60%, Operational: ~90%

- ✅ `Product Launch [DUMMY]`
  - Organisation: Product Management  
  - Scenario: **High Performance**
  - Strategic: ~87%, Tactical: ~90%, Operational: ~93%

### 2. **Projekte** (3 Stück)
- `Cloud Migration Phase 1 [DUMMY]` → Digital Transformation
- `Customer Portal Relaunch [DUMMY]` → Digital Transformation
- `Product Alpha Launch [DUMMY]` → Product Launch

### 3. **KPI-Metriken** (20 pro Portfolio)
Für jeden der 10 Impact Cycle Steps wird eine Metrik mit realistischen Werten erstellt:
- **Target Value**: Zielwert (80-100)
- **Actual Value**: Ist-Wert (basierend auf Scenario)
- **Category**: Strategic / Tactical / Operational

## 🚀 Installation & Verwendung

### 1. Umgebungsvariablen einrichten

Erstelle eine `.env` Datei im Projektstammverzeichnis:

```bash
# Supabase Credentials
SUPABASE_URL=https://dein-projekt.supabase.co
SUPABASE_SERVICE_KEY=dein-service-key-hier

# Nicht der ANON Key! Nutze den SERVICE_ROLE Key für Admin-Operationen
```

**Wo finde ich den Service Key?**
1. Gehe zu [supabase.com](https://supabase.com) → Dein Projekt
2. **Settings** → **API**
3. Kopiere den **service_role key** (nicht den anon key!)

### 2. Dependencies installieren

```bash
# Python-Umgebung aktivieren
source .venv/bin/activate

# Falls noch nicht installiert:
pip install supabase rich python-dotenv
```

### 3. Skript ausführen

```bash
python3 extraction/seed_pmo_data.py
```

### 4. Ausgabe

```
🌱 PMO Data Seeder
Erstellt Testdaten für das PMO Impact Cycle System

🧹 Lösche bestehende [DUMMY] Daten...
  ✓ 2 Dummy-Portfolios gelöscht (inkl. abhängige Daten)

📂 Erstelle Portfolios...
  ✓ Portfolio erstellt: Digital Transformation [DUMMY]
  ✓ Portfolio erstellt: Product Launch [DUMMY]

📋 Erstelle Projekte...
  ✓ Projekt erstellt: Cloud Migration Phase 1 [DUMMY]
  ✓ Projekt erstellt: Customer Portal Relaunch [DUMMY]
  ✓ Projekt erstellt: Product Alpha Launch [DUMMY]

📊 Erstelle KPI-Metriken (Scenario: balanced)...
  ✓ 10 Metriken erstellt
    Strategic:   79.5%
    Tactical:    58.3%
    Operational: 88.7%

📊 Erstelle KPI-Metriken (Scenario: high)...
  ✓ 10 Metriken erstellt
    Strategic:   87.2%
    Tactical:    90.1%
    Operational: 93.4%

✅ Seeding abgeschlossen!
```

## 🎨 Performance Scenarios

Das Skript erstellt drei verschiedene Performance-Profile:

### **Balanced** (Portfolio 1)
- Strategic: 75-85%
- Tactical: 50-70%
- Operational: 85-95%
- → Zeigt gemischte Performance mit Verbesserungsbedarf im taktischen Bereich

### **High** (Portfolio 2)
- Strategic: 80-95%
- Tactical: 85-95%
- Operational: 88-98%
- → Zeigt exzellente Performance über alle Ebenen
- → Health Hub sollte **pulsieren** bei Total Score > 90%!

### **Low** (Optional)
- Strategic: 30-50%
- Tactical: 40-60%
- Operational: 35-55%
- → Kann manuell im Code aktiviert werden

## 🗑️ Testdaten löschen

### Option 1: Über das Skript
Das Skript löscht automatisch beim erneuten Start alle bestehenden `[DUMMY]` Daten.

### Option 2: Manuell in Supabase

```sql
-- Alle Dummy-Portfolios löschen (Cascade löscht auch Projekte & Metriken)
DELETE FROM pmo_portfolios 
WHERE name LIKE '%[DUMMY]%';
```

## 🔍 Datenstruktur

### `pmo_portfolios`
```sql
{
  id: uuid,
  name: text,
  description: text,
  organization: text,
  is_active: boolean,
  created_at: timestamp
}
```

### `pmo_projects`
```sql
{
  id: uuid,
  name: text,
  description: text,
  portfolio_id: uuid,
  status: text,
  start_date: date,
  target_end_date: date
}
```

### `pmo_instance_metrics`
```sql
{
  id: uuid,
  portfolio_id: uuid,
  step_id: integer (1-10),
  kpi_id: text,
  target_value: numeric,
  actual_value: numeric,
  unit: text,
  last_updated: timestamp,
  notes: text
}
```

## ✅ Nach dem Seeding

1. Öffne die App: **http://localhost:3002**
2. Wähle im Portfolio-Dropdown eines der Dummy-Portfolios aus
3. Beobachte:
   - 🎯 **Portfolio Health Hub** in der Mitte zeigt aggregierte Scores
   - 🔵 **Impact Nodes** zeigen individuelle Step-Performance
   - 💫 **Pulsieren** bei "Product Launch" (High Performance > 90%)

## 🐛 Troubleshooting

### "SUPABASE_SERVICE_KEY nicht gefunden"
- Stelle sicher, dass `.env` im Projekt-Root existiert
- Nutze den **SERVICE_ROLE** Key, nicht den ANON Key

### "permission denied for table pmo_portfolios"
- Der ANON Key hat keine Schreibrechte
- Nutze den SERVICE_ROLE Key für Admin-Operationen

### "Foreign key violation"
- Stelle sicher, dass die KPI Library (`pmo_kpi_library`) befüllt ist
- Führe zuerst `sync_pmi_kpis.py` aus

### "Keine Daten im Health Hub sichtbar"
- Prüfe Browser-Konsole auf Fehler
- Stelle sicher, dass `.env.local` im `frontend/` Ordner existiert
- Nutze dort den **ANON** Key für Frontend-Zugriff

## 📊 Erwartete Ergebnisse

Nach erfolgreichem Seeding solltest du sehen:

| Portfolio | Strategic | Tactical | Operational | Total Impact |
|-----------|-----------|----------|-------------|--------------|
| Digital Transformation | ~80% (🟡) | ~60% (🔵) | ~90% (🟢) | ~78% |
| Product Launch | ~87% (🟡) | ~90% (🔵) | ~93% (🟢) | ~90% (💫 Pulsing!) |

Die konzentrischen Ringe im Health Hub sollten diese Werte dynamisch visualisieren!

