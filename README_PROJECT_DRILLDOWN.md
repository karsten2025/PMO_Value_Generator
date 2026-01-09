# 🎯 PROJECT DRILL-DOWN FEATURE

## Was ist neu?

Stakeholder können jetzt sehen, **welche Projekte** zu einem Portfolio beitragen!

### Neue Features:
- ✅ **Projects-Tab**: Zeigt alle Projekte eines Portfolios
- ✅ **Strategic/Tactical/Operational Filtering**: Projekte nach Alignment gruppiert
- ✅ **Real-time Progress**: Automatische Berechnung aus KPIs
- ✅ **Impact & Risk Scores**: Auf einen Blick sehen, wo Risiken sind
- ✅ **Project Owner & Budget**: Vollständige Projekt-Details

---

## 🚀 SETUP (3 Schritte)

### 1. Datenbank-Migration ausführen

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
```

**In Supabase SQL Editor:**
1. Öffne [Supabase Dashboard](https://supabase.com/dashboard)
2. Gehe zu **SQL Editor**
3. Kopiere den Inhalt von `database/migration_add_project_details.sql`
4. Führe die Migration aus

**Erwartete Ausgabe:**
```
✅ Project detail columns added successfully
✅ Performance indices created
✅ Existing projects updated with defaults
✅ Migration verified: All 5 columns exist
🎉 Migration completed successfully!
```

---

### 2. Seed-Daten generieren

```bash
# Virtuelle Umgebung aktivieren (falls noch nicht aktiv)
source .venv/bin/activate

# Seed-Script ausführen
python3 extraction/seed_pmo_data.py
```

**Was passiert:**
- 6 realistische Projekte werden erstellt:
  - 🟡 2x Strategic (Cloud Migration, Digital Workplace)
  - 🔵 2x Tactical (PMO Tool Rollout, Team Onboarding)
  - 🟢 2x Operational (Reporting Automation, Dashboard Optimization)
- Jedes Projekt bekommt:
  - `project_owner` (z.B. "John Smith")
  - `budget` (z.B. 2.3M EUR)
  - `impact_score` (low/medium/high)
  - `risk_level` (low/medium/high)
  - `start_date` und `end_date`
  - `tags` für Kategorisierung

---

### 3. Frontend starten

```bash
cd frontend
npm run dev
```

**Browser öffnen:**
- `http://localhost:3000`

---

## 🎨 WIE MAN ES BENUTZT

### Im Frontend:

1. **Portfolio auswählen** (Dropdown oben rechts)
   - z.B. "IT-Transformation 2026"

2. **View-Switcher** (Header, neben Portfolio-Selector)
   - **Cycle**: Zeigt den Impact Cycle (Flywheel)
   - **Projects**: Zeigt die Projekt-Liste

3. **In der Projects-View:**
   - **Filter**: All / Strategic / Tactical / Operational
   - **Projekt-Karten**: Zeigen Progress, Owner, Budget, Impact, Risk
   - **"View Impact Cycle" Button**: Drill-Down zum Projekt (TODO)

---

## 📸 SCREENSHOTS FÜR LINKEDIN

### Screenshot 1: Projects-List View
```
Portfolio: IT-TRANSFORMATION 2026
6 active projects

FILTER: [All] [Strategic] [Tactical] [Operational]

🟡 STRATEGIC PROJECTS (2 of 2 on track)

┌─────────────────────────────────────────┐
│ Cloud Migration Program           85% ✅│
│ Migration kritischer Workloads zu AWS   │
│ ████████████████░░ 85%                  │
│ 👤 John Smith | 💰 2.3M€               │
│ Impact: 🟢 High | Risk: 🟡 Medium      │
│ [View Impact Cycle →]                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Digital Workplace Initiative      75% ⚠ │
│ Einführung moderner Kollaborations-Tools│
│ ███████████████░░░ 75%                  │
│ 👤 Sarah Lee | 💰 1.5M€                │
│ Impact: 🟡 Medium | Risk: 🔴 High      │
│ [View Impact Cycle →]                   │
└─────────────────────────────────────────┘

🔵 TACTICAL PROJECTS (1 of 2 on track)
... etc ...
```

---

## 🛠️ TECHNISCHE DETAILS

### Neue Datenbank-Spalten:

```sql
pmo_projects:
  - strategic_alignment: TEXT ('strategic' | 'tactical' | 'operational')
  - impact_score: TEXT ('low' | 'medium' | 'high')
  - risk_level: TEXT ('low' | 'medium' | 'high')
  - project_owner: TEXT
  - budget: BIGINT (in EUR cents)
  - start_date: DATE
  - end_date: DATE
  - tags: JSONB (array of strings)
```

### Neue Frontend-Komponente:

```typescript
frontend/app/components/PortfolioProjectList.tsx
  - Lädt Projekte aus Supabase
  - Berechnet Progress aus KPIs
  - Gruppiert nach Strategic/Tactical/Operational
  - Filtert und sortiert
  - Drill-Down zu Projekt-Details (TODO)
```

### TypeScript Types:

```typescript
frontend/lib/supabase.ts:
  interface Project {
    id: string;
    name: string;
    description: string | null;
    portfolio_id: string;
    status: 'active' | 'on_hold' | 'completed' | 'cancelled' | 'planning';
    strategic_alignment: 'strategic' | 'tactical' | 'operational';
    impact_score: 'low' | 'medium' | 'high';
    risk_level: 'low' | 'medium' | 'high';
    project_owner: string;
    budget: number;
    start_date: string | null;
    end_date: string | null;
    tags: string[];
  }
```

---

## 🐛 TROUBLESHOOTING

### Problem: "Projects-Tab ist leer"

**Lösung:**
1. Prüfe, ob die Migration erfolgreich war:
   ```sql
   SELECT column_name 
   FROM information_schema.columns 
   WHERE table_name = 'pmo_projects' 
     AND column_name IN ('strategic_alignment', 'impact_score', 'risk_level');
   ```
   Erwartet: 3 Zeilen

2. Prüfe, ob Seed-Daten vorhanden sind:
   ```sql
   SELECT name, strategic_alignment, project_owner 
   FROM pmo_projects 
   WHERE name LIKE '%[DUMMY]%';
   ```
   Erwartet: 6 Projekte

---

### Problem: "Progress ist immer 0%"

**Ursache:** Keine KPI-Daten in `pmo_kpi_values` für die Projekte

**Lösung:**
1. Prüfe, ob KPI-Werte vorhanden sind:
   ```sql
   SELECT instance_id, COUNT(*) 
   FROM pmo_kpi_values 
   GROUP BY instance_id;
   ```

2. Falls leer: Führe `seed_pmo_data.py` nochmal aus

---

### Problem: "View-Switcher funktioniert nicht"

**Prüfe:**
1. Browser-Console (F12) für Fehler
2. Next.js Dev-Server läuft (sollte keine Fehler zeigen)
3. `PortfolioProjectList` wurde korrekt importiert:
   ```typescript
   import PortfolioProjectList from './components/PortfolioProjectList';
   ```

---

## 📝 TODO (Für spätere Entwicklung)

- [ ] **Project Drill-Down**: Klick auf "View Impact Cycle" lädt projekt-spezifische Impact Cycle
- [ ] **Project Creation**: Button "New Project" zum Erstellen neuer Projekte
- [ ] **Project Editing**: Inline-Edit von Project-Details
- [ ] **Sorting**: Sortierung nach Progress, Budget, Risk
- [ ] **Search**: Suche nach Projekt-Namen
- [ ] **Export**: Export der Projekt-Liste als CSV/PDF
- [ ] **Matrix-View**: Option 3 aus FEATURE_PROJECT_DRILLDOWN.md implementieren

---

## ✅ READY FÜR LINKEDIN!

**Jetzt kannst du:**
1. Screenshots der **Projects-View** machen
2. Screenshot des **View-Switchers** (Cycle ↔ Projects)
3. Screenshot einer **Projekt-Karte** mit Details
4. Diese in dein **LinkedIn Carousel** einbauen (Slide 6 oder 7)

**Storytelling-Punkt:**
> "Stakeholder fragen nicht nur nach dem Portfolio-Score.
> Sie wollen wissen: **Welche Projekte** tragen dazu bei?
> Deshalb haben wir einen **Drill-Down** gebaut:
> Strategic → Tactical → Operational, alles auf einen Blick!"

🎉 **FEATURE COMPLETE!**

