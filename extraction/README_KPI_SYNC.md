# PMO KPI Library Sync Script

Interaktives Python-Skript zur Extraktion und Synchronisation von 30 PMI-konformen KPIs in die Supabase-Datenbank.

## 📋 Features

- ✅ **30 KPIs** (3 pro Impact Cycle Schritt)
- ✅ **Vollständige 2x3 Matrix** (DE/EN/ES × Normal/Management)
- ✅ **PMI-konforme Nomenklatur** im Management-Register
- ✅ **Rechtssichere Paraphrasierung** (IP-Schutz)
- ✅ **Tabellarische Übersicht** mit Rich-Formatierung
- ✅ **Interaktive Bestätigung** vor Upload

## 🚀 Installation

### 1. Abhängigkeiten installieren

Falls noch nicht vorhanden, installiere `rich` für schöne Terminal-Ausgabe:

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
source .venv/bin/activate
pip install rich
```

Die anderen Abhängigkeiten (`supabase`, `python-dotenv`) sollten bereits installiert sein.

### 2. Umgebungsvariablen

Stelle sicher, dass deine `.env`-Datei im Projektroot existiert:

```bash
# .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## 📊 Verwendung

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
source .venv/bin/activate
python3 extraction/sync_pmi_kpis.py
```

### Interaktiver Workflow

1. **Validierung**: Das Skript prüft automatisch die Vollständigkeit aller 30 KPIs
2. **Tabellarische Übersicht**: Zeigt alle KPIs nach Schritt und Kategorie sortiert
3. **Detailansicht** (optional): Vollständige Beschreibungen in DE-Normal und DE-Management
4. **Upload-Bestätigung**: Du wirst gefragt, ob die KPIs hochgeladen werden sollen
5. **Supabase-Upload**: Bei Bestätigung werden die Daten eingefügt

### Beispiel-Ausgabe

```
╭────────────────────────────────────────────────────────────────╮
│          PMO Impact Cycle - KPI Library Sync                   │
│  Extraktion und Synchronisation von 30 PMI-konformen Kennzahlen│
╰────────────────────────────────────────────────────────────────╯

🔍 Validiere KPI-Bibliothek...

✓ Gesamtanzahl KPIs: 30
✓ Step 1: 3 KPIs
✓ Step 2: 3 KPIs
...
✓ Step 10: 3 KPIs

✓ Strategic KPIs:  10
✓ Tactical KPIs:   10
✓ Operational KPIs: 10

╭──────────────────────────────────────────────────────────────────╮
│        🎯 PMO Impact Cycle - KPI-Bibliothek (30 Kennzahlen)     │
├──────┬──────────────┬────────────────────────────────┬──────────┤
│ Step │ Kategorie    │ KPI-Titel (DE-Management)      │ Einheit  │
├──────┼──────────────┼────────────────────────────────┼──────────┤
│ 1    │ 🎯 Strategic │ Stakeholder Awareness Index    │ Score... │
│ 1    │ ⚙️  Tactical  │ Communication Campaign Reach   │ Anzahl...│
│ 1    │ 🔧 Operational│ Training Completion Rate      │ %        │
...
╰──────┴──────────────┴────────────────────────────────┴──────────╯

⚠️  Möchtest du diese 30 KPIs jetzt in Supabase (pmo_kpi_library) hochladen? (y/n): y

📤 Verbinde mit Supabase...
📤 Lade 30 KPIs hoch...
✓ Upload erfolgreich! 30 KPIs wurden hochgeladen.

╭────────────────────────────────────────────────────────────────╮
│                      ✅ SYNC ERFOLGREICH                        │
│                                                                 │
│  30 KPIs wurden erfolgreich in Supabase hochgeladen.           │
│  Die KPIs können jetzt in der Frontend-Anwendung genutzt werden.│
╰────────────────────────────────────────────────────────────────╯
```

## 🎯 KPI-Struktur

Jede KPI enthält:

- **`step_number`**: 1-10 (Impact Cycle Schritt)
- **`internal_code`**: z.B. `DIS_AWR`, `PLN_VPR`
- **`kpi_type`**: `strategic`, `tactical`, oder `operational`
- **`kpi_code`**: Eindeutige ID (z.B. `DIS_AWR_STR_001`)
- **`title`**: Englischer Titel
- **`unit`**: Maßeinheit (z.B. `%`, `Score (0-100)`, `Tage`)
- **`matrix_data`**: 2x3 Matrix
  - Sprachen: `de`, `en`, `es`
  - Register: `colloquial` (Normal), `management` (Management)

### Beispiel einer KPI

```json
{
  "step_number": 1,
  "internal_code": "DIS_AWR",
  "kpi_type": "strategic",
  "kpi_code": "DIS_AWR_STR_001",
  "title": "Stakeholder Awareness Index",
  "unit": "Score (0-100)",
  "matrix_data": {
    "de": {
      "colloquial": "Wie viele Leute wissen überhaupt, was das PMO macht?",
      "management": "Quantifizierung der PMO-Sichtbarkeit im Stakeholder-Netzwerk..."
    },
    "en": { ... },
    "es": { ... }
  }
}
```

## 📚 KPI-Kategorien

### 🎯 Strategic (10 KPIs)
Fokus: **Alignment & Business Value**
- Beispiele: ROI, Stakeholder Awareness, Customer Satisfaction

### ⚙️ Tactical (10 KPIs)
Fokus: **Kapazität & Governance**
- Beispiele: Resource Utilization, SLA Coverage, Dashboard Frequency

### 🔧 Operational (10 KPIs)
Fokus: **Effizienz & Qualität**
- Beispiele: Training Completion Rate, Cycle Time, Accuracy

## 🔒 IP-Schutz & Compliance

Alle KPIs folgen den `.cursorrules`:
- ✅ Keine geschützten PMI-Markennamen
- ✅ Paraphrasierte Konzepte aus PMI-Standards
- ✅ Eigene Terminologie ("Impact Cycle" statt "Flywheel")
- ✅ PMI-konforme Management-Nomenklatur wo relevant

## 🗄️ Datenbank-Schema

Stelle sicher, dass die Tabelle `pmo_kpi_library` in Supabase existiert:

```sql
CREATE TABLE pmo_kpi_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_number INTEGER NOT NULL,
  internal_code VARCHAR(20) NOT NULL,
  kpi_type VARCHAR(20) NOT NULL,
  kpi_code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  unit VARCHAR(100) NOT NULL,
  matrix_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🆘 Troubleshooting

### ModuleNotFoundError: No module named 'rich'

```bash
source .venv/bin/activate
pip install rich
```

### Supabase-Verbindungsfehler

Prüfe deine `.env`-Datei:
```bash
cat .env | grep SUPABASE
```

### KPIs bereits vorhanden

Falls die KPIs bereits existieren, lösche sie zuerst in Supabase oder ändere das Skript für `upsert` statt `insert`.

## 🔗 Nächste Schritte

Nach erfolgreichem Upload kannst du:
1. KPIs in der Frontend-Sidebar anzeigen
2. KPI-Vorschläge pro Impact Cycle Schritt einbauen
3. User-spezifische KPI-Tracking-Funktionen entwickeln

## 📝 Hinweis

Dieses Skript ist Teil des **PMO Value Generator** Projekts und folgt Domain-Driven Design (DDD) Prinzipien für Template-Management.

