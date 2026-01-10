# 🎯 PMO Impact Cycle - Interactive Portfolio Management Visualization

> **Real-time Portfolio Health Monitoring** mit KPI-Tracking und interaktiver Visualisierung für strategisches, taktisches und operatives PMO-Management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

---

## 📖 Über das Projekt

**PMO Impact Cycle** ist eine moderne Web-Applikation zur Visualisierung und zum Tracking von PMO-Performance-Metriken. Das Tool ermöglicht es PMO-Leadern, strategische, taktische und operative KPIs in Echtzeit zu monitoren und fundierte Entscheidungen zu treffen.

### ✨ Kernfeatures

- **🎨 Interactive Impact Cycle Visualization**: 10-stufiger PMO-Prozess als React Flow Diagramm
- **📊 Portfolio Health Hub**: Konzentrische Ringe zeigen Strategic/Tactical/Operational Scores
- **🔍 Project Drill-Down**: Detaillierte KPI-Ansicht auf Projektebene
- **🌍 Multilingual Support**: Deutsch, Englisch, Spanisch
- **🎭 Dual-Mode**: "Colloquial" (einfache Sprache) und "Management" (PMI-Standard-Nomenklatur)
- **📈 Real-time KPI Tracking**: Automatische Berechnung von Erreichungsgraden
- **🗄️ Supabase Integration**: Persistente Datenhaltung mit PostgreSQL

---

## 🎥 Demo

### 🚀 Live Demo

**[→ Live Demo auf Vercel](https://pmo-value-generator.vercel.app)** *(aktualisiere mit deiner echten Vercel-URL)*

### 📸 Screenshots

> **Hinweis**: Screenshots folgen in Kürze. Die App ist bereits live und voll funktionsfähig!

---

## 🏗️ Architektur

```
PMO_Value_Generator/
├── frontend/              # Next.js 16 App (App Router)
│   ├── app/              # Pages & Components
│   ├── mock/             # Mock-Daten für Entwicklung
│   └── lib/              # Supabase Client & Utilities
├── extraction/           # Python Scripts für Datenextraktion
│   ├── seed_pmo_data.py  # Seed-Script für Demo-Daten
│   └── upload_kpi_library.py  # KPI-Bibliothek hochladen
├── database/             # SQL Migrations
│   └── migration_clean_slate.sql  # Vollständiges Schema
└── knowledge_base_pdf/   # PMI Standard Guides (nicht im Repo)
```

---

## 🚀 Quick Start

### Voraussetzungen

- **Node.js** 18+ und npm
- **Python** 3.10+
- **Supabase Account** (kostenlos)

### 1️⃣ Repository klonen

```bash
git clone https://github.com/karsten2025/PMO_Value_Generator.git
cd PMO_Value_Generator
```

### 2️⃣ Supabase Setup

1. Erstelle ein neues Projekt auf [supabase.com](https://supabase.com)
2. Führe die Migration aus:
   ```bash
   # In Supabase SQL Editor:
   database/migration_clean_slate.sql
   ```
3. Erstelle `.env` im Root-Verzeichnis:
   ```env
   SUPABASE_URL=https://dein-projekt.supabase.co
   SUPABASE_KEY=dein-anon-key
   ```
4. Erstelle `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
   ```

### 3️⃣ KPI-Bibliothek hochladen

```bash
# Python Virtual Environment erstellen
python3 -m venv .venv
source .venv/bin/activate  # Mac/Linux
# .venv\Scripts\activate    # Windows

# Dependencies installieren
pip install supabase python-dotenv rich

# KPI-Bibliothek hochladen
python3 extraction/upload_kpi_library.py

# Demo-Daten erstellen
python3 extraction/seed_pmo_data.py
```

### 4️⃣ Frontend starten

```bash
cd frontend
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) 🎉

---

## 📊 Datenmodell

### Kernentitäten

- **`pmo_portfolios`**: Portfolio-Definitionen
- **`pmo_projects`**: Projekte mit Strategic/Tactical/Operational Alignment
- **`pmo_kpi_library`**: 30 PMI-konforme KPIs (3 pro Milestone)
- **`pmo_kpi_values`**: Ist/Soll-Werte für KPI-Tracking

### KPI-Kategorien

Jeder der 10 Milestones hat 3 KPIs:

- **Strategic**: Alignment & Value (z.B. Stakeholder Awareness Index)
- **Tactical**: Capacity & Governance (z.B. Resource Allocation Efficiency)
- **Operational**: Effizienz & Qualität (z.B. Delivery Timeliness)

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** (App Router, React Server Components)
- **React Flow** (Node-based Diagrams)
- **Tailwind CSS** (Styling)
- **TypeScript** (Type Safety)

### Backend

- **Supabase** (PostgreSQL, Realtime, Auth)
- **Python 3.10+** (Data Extraction & Seeding)

### Libraries

- `react-flow` - Interactive Diagramme
- `lucide-react` - Icon Library
- `supabase-js` - Supabase Client
- `rich` - Python Terminal Formatting

---

## 🎨 Features im Detail

### 🌟 Impact Cycle Visualization (Flywheel)

**10 interaktive Milestones** im Kreis angeordnet:
1. **Discovery & Awareness** - PMO bekannt machen
2. **Needs Assessment** - Anforderungen verstehen
3. **Stakeholder Validation** - Buy-in sichern
4. **Framework Design** - Prozesse definieren
5. **Implementation Planning** - Roadmap erstellen
6. **Pilot Execution** - Erste Quick Wins
7. **Feedback & Refinement** - Lernen & anpassen
8. **Scaling & Adoption** - Rollout im Unternehmen
9. **Performance Measurement** - Erfolg messen
10. **Continuous Improvement** - Optimieren & wiederholen

**Jeder Node zeigt:**
- ✅ **Progress Ring** - Visueller Fortschritt (0-100%)
- 🎯 **Completion Score** - Im Management-Modus sichtbar
- 🟢/🟡/🔴 **Farb-Coding** - Basierend auf Performance
- 💨 **Breathing Effect** - Bei <50% Fortschritt pulsiert der Node

### Portfolio Health Hub

**Zentrale Visualisierung mit 3 konzentrischen Ringen:**

- **🟡 Strategic Ring** (außen, Radius: 176px): 
  - Langfristige Ziele & Portfolio-Alignment
  - Zeigt Strategic KPIs (z.B. Stakeholder Awareness, ROI Projection)
  - Label: "STR" mit Prozent-Score

- **🔵 Tactical Ring** (mittig, Radius: 133px): 
  - Resource Management & Governance
  - Zeigt Tactical KPIs (z.B. Resource Allocation, Team Capacity)
  - Label: "TAC" mit Prozent-Score

- **🟢 Operational Ring** (innen, Radius: 90px): 
  - Tägliche Effizienz & Delivery
  - Zeigt Operational KPIs (z.B. Delivery Timeliness, Quality Score)
  - Label: "OPS" mit Prozent-Score

**📊 Total Impact Score:**
- Angezeigt als **große Magenta-Zahl** im Zentrum (z.B. "75%")
- Wird aus allen 3 Ebenen gewichtet berechnet
- **Pulst bei >90%** als Erfolgs-Indikator
- Dynamische Glow-Effekte basierend auf Score

### Project Drill-Down

**Tab-Switcher:** "Cycle" (Flywheel-Ansicht) ↔️ "Projects" (Projekt-Liste)

**In der Projekt-Liste:**
- 🔍 **Filter nach Alignment**: Strategic / Tactical / Operational
- 📊 **Progress Bars**: Farbcodiert (Grün ≥80%, Orange 50-79%, Rot <50%)
- 🎯 **Impact Score Badges**: Low / Medium / High
- ⚠️ **Risk Level Badges**: Low / Medium / High
- 💰 **Budget, Owner, Dates**: Alle Projekt-Metadaten sichtbar
- 🏷️ **Tags**: Mehrsprachige Tags (z.B. "Cloud", "Infrastruktur")

**Klick auf ein Projekt:**
- Öffnet **Sidebar** mit allen KPIs des Projekts
- Gruppiert nach Strategic / Tactical / Operational
- Zeigt **Zielwert, Ist-Wert, Progress** für jede KPI
- **Multilingual**: Projekt-Namen und Beschreibungen in DE/EN/ES

### Multilingual & Dual-Mode

**3 Sprachen:**
- 🇩🇪 Deutsch
- 🇬🇧 Englisch
- 🇪🇸 Spanisch

**2 Register:**
- **Colloquial**: Einfache, verständliche Sprache für alle Teammitglieder
- **Management**: PMI-Standard-Nomenklatur für C-Level & Stakeholder

---

## 📝 Scripts

### Python-Scripts

```bash
# Demo-Daten erstellen (2 Portfolios, 6 Projekte, 24 KPIs)
python3 extraction/seed_pmo_data.py

# KPI-Bibliothek hochladen (30 KPIs)
python3 extraction/upload_kpi_library.py

# PMI-Standards extrahieren (erfordert PDFs in knowledge_base_pdf/)
python3 extraction/extract_all_pdfs.py
```

### Frontend-Scripts

```bash
cd frontend

# Development Server
npm run dev

# Production Build
npm run build
npm start

# Linting
npm run lint
```

---

## 🧪 Dummy-Daten

Das Projekt enthält ein Seed-Script (`extraction/seed_pmo_data.py`), das folgende Test-Daten erstellt:

### Portfolios
- **"Digital Transformation [DUMMY]"** 
  - Beschreibung: Digitalisierung der Kernprozesse und Einführung neuer Tools
- **"Product Launch [DUMMY]"**
  - Beschreibung: Launch der neuen Produktlinie Q2 2026

### Projekte (6 Stück)

**Strategic (2):**
1. **Cloud-Migration Programm** - 87% Progress ✅
2. **Digitaler Arbeitsplatz Initiative** - 74% Progress ⚠️

**Tactical (2):**
3. **PMO-Tool Einführung** - 27% Progress 🔴
4. **Team-Onboarding Programm** - 71% Progress ⚠️

**Operational (2):**
5. **Monats-Reporting Automatisierung** - 94% Progress ✅
6. **Dashboard-Optimierung** - 82% Progress ✅

### KPI-Werte
- **~25 KPI-Werte** mit realistischen Ist/Soll-Verhältnissen
- Verteilt über alle 10 Milestones
- Unterschiedliche Performance-Level für diverse Visualisierungen

**Alle Dummy-Daten** sind mit `[DUMMY]` markiert und können einfach gelöscht werden:

```sql
DELETE FROM pmo_portfolios WHERE name LIKE '%[DUMMY]%';
```

**Script ausführen:**
```bash
python3 extraction/seed_pmo_data.py
```

Das Script löscht automatisch alte `[DUMMY]`-Daten und erstellt neue!

---

## 🔐 Sicherheit & Best Practices

### ⚠️ WICHTIG: Secrets Management

- **NIEMALS** `.env` oder `.env.local` Dateien committen!
- Die `.gitignore` schützt dich automatisch
- Verwende Supabase Row Level Security (RLS) für produktive Deployments

### IP-Schutz & Compliance

Das Projekt respektiert geistiges Eigentum:

- Verwendung eigener Nomenklatur statt geschützter Markennamen
- PMI-Standards werden paraphrasiert
- Siehe `.cursorrules` für Details

---

## 🚧 Roadmap

### ✅ Completed Features (v1.0)
- ✅ **Impact Cycle Visualization** - 10 Milestones mit Progress Tracking
- ✅ **Portfolio Health Hub** - 3 konzentrische Ringe mit Total Impact Score
- ✅ **Project Drill-Down** - Detaillierte KPI-Ansicht auf Projektebene
- ✅ **Multilingual Support** - DE/EN/ES mit 2x3 Matrix
- ✅ **Dual-Mode** - Colloquial & Management Nomenklatur
- ✅ **Supabase Integration** - Persistente Datenhaltung
- ✅ **Demo Data Seeding** - Realistische Test-Daten
- ✅ **Vercel Deployment** - Live-Demo verfügbar

### 🔮 Future Vision (V2.0) - **"Intelligente Projekt-Workflow-Automatisierung"**

> **Kern-Philosophie**: *"Automatisiere den Prozess, intelligiere die Entscheidung"*

Die nächste Version wird PMO Impact Cycle von einem **Visualisierungs-Tool** zu einem **intelligenten Workflow-Orchestrator** transformieren.

---

#### **Phase 1: Projekt-Workflow-Engine** 🔄 *(Q2-Q3 2026)*

**Multi-Methodology Support:**
- 🔵 **Agile (Scrum/Kanban)**
  - Sprint Planning Assistant mit Velocity-Berechnungen
  - Auto-generierte Burndown/Burnup Charts
  - Daily Standup Reminder & Retrospektive-Templates
  - Story Point Estimation Helper

- 🟡 **Predictive (Waterfall/Stage-Gate)**
  - Meilenstein-Tracking mit Dependency-Chains
  - Critical Path Method (CPM) Analyse
  - Gate-Review Automation mit Checklisten
  - Gantt-Chart Integration

- 🟣 **Hybrid (SAFe, Scaled Agile)**
  - Program Increment (PI) Planning
  - Release Train Management
  - Flexible Phasen-Definition
  - Stage-Gate mit integrierten Sprints

- 🟢 **Iterative/Inkrementell**
  - RAD (Rapid Application Development) Workflows
  - RUP-inspired Phasen-Management
  - Prototyping-Zyklen Tracking

**Visualisierungen:**
- BPMN-Style Process Designer (Drag & Drop)
- Swimlane-Diagramme für Verantwortlichkeiten
- Value Stream Mapping
- Anpassbare Workflow-Templates

---

#### **Phase 2: Intelligente Automatisierung** 🤖 *(Q3-Q4 2026)*

**Rule-Based Automation (Kein AI erforderlich):**
- ⚡ **Smart Status-Updates**: Auto-Transition bei Milestone-Completion
- 📧 **Context-Aware Notifications**: Slack/Email/Teams Integration
- 📊 **Report-Generation**: Auto-generierte Portfolio-Reports (PDF/Excel)
- 🔗 **Dependency Management**: Automatische Blockade-Erkennung
- 📈 **KPI-Tracking**: Real-time Sync mit Jira, GitHub, Azure DevOps

**Integration-Pipelines:**
- **Jira API**: Sync von Issues, Stories, Epics
- **GitHub Actions**: CI/CD-Status in Portfolio-View
- **Azure DevOps**: Work Items & Test Results
- **Confluence**: Automatische Dokumentations-Links
- **Excel/CSV Import**: Legacy-Daten Migration

---

#### **Phase 3: Cognitive Intelligence (AI-powered)** 🧠 *(Q4 2026 - Q1 2027)*

**Use Case 1: Predictive Analytics**
```
🎯 "Projekt-Verzögerung voraussagen"
├─ Input: Historische Velocity + Burndown-Trends
├─ AI-Model: Random Forest / XGBoost
├─ Output: "87% Wahrscheinlichkeit für 2-Wochen-Verzögerung"
└─ Action: Empfehlung für Ressourcen-Reallokation
```

**Use Case 2: Anomaly Detection**
```
🔍 "Ungewöhnliche Patterns erkennen"
├─ Input: Time-Series KPI-Daten (z.B. Daily Story Points)
├─ AI-Model: Isolation Forest / LSTM Neural Network
├─ Output: Alert bei statistischen Abweichungen
└─ Action: Automatische Root-Cause-Analyse
```

**Use Case 3: Natural Language Insights**
```
💬 "Conversational AI für Portfolio-Analyse"
├─ User: "Warum ist Projekt X rot?"
├─ AI (GPT-4): Analysiert KPIs, Kommentare, Historie
├─ Output: "Resource Allocation Efficiency 45% unter Target.
│          Team-Onboarding verzögert durch Stakeholder-Approval.
│          Empfehlung: Quick-Win mit Backlog-Priorisierung."
└─ Action: Interaktive Empfehlungen mit 1-Click-Umsetzung
```

**Use Case 4: Smart Recommendations**
```
🧙 "Optimale Sprint-Planung"
├─ Input: Team-Velocity, Backlog-Prioritäten, Dependencies
├─ AI-Model: Constraint Optimization (OR-Tools / Genetic Algorithm)
├─ Output: "Empfohlene Story-Auswahl für Sprint 12"
└─ Action: Auto-Fill Sprint mit optimierter Story-Kombination
```

**Use Case 5: Risk Prediction**
```
⚠️ "Risiko-Früherkennung"
├─ Input: Projekt-Historie, Team-Fluktuation, Budget-Variance
├─ AI-Model: Multi-Class Classification (XGBoost)
├─ Output: Risk-Score (0-100) mit Confidence-Intervall
└─ Action: Mitigation-Plan-Generator + Stakeholder-Alert
```

**Use Case 6: Intelligent Resource Allocation**
```
👥 "Team-Skill-Matching"
├─ Input: Team-Skills, Projekt-Anforderungen, Verfügbarkeiten
├─ AI-Model: Graph Neural Network
├─ Output: Optimale Team-Zusammensetzung
└─ Action: Automatische Kalender-Integration
```

---

#### **Technische Architektur (V2.0)**

```
┌─────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js 17+ / React Flow / TailwindCSS)     │
│  ├─ Workflow Designer (BPMN-Editor mit Drag & Drop)    │
│  ├─ AI Insights Dashboard (Real-time Predictions)      │
│  ├─ Conversational UI (ChatGPT-style Interface)        │
│  └─ Collaboration Hub (Supabase Realtime)              │
└─────────────────────────────────────────────────────────┘
                          ⬇️ API Gateway
┌─────────────────────────────────────────────────────────┐
│  BACKEND (Python FastAPI / Supabase Edge Functions)    │
│  ├─ Workflow Engine (BPMN.io / Process Orchestration)  │
│  ├─ Integration Layer (Jira, GitHub, Azure DevOps)     │
│  ├─ AI Service Orchestrator (Model Management)         │
│  └─ WebSocket Server (Real-time Sync)                  │
└─────────────────────────────────────────────────────────┘
                          ⬇️ ML Pipeline
┌─────────────────────────────────────────────────────────┐
│  AI/ML STACK                                            │
│  ├─ OpenAI API (GPT-4o für NLP & Conversational AI)    │
│  ├─ Scikit-learn / XGBoost (Predictive Models)         │
│  ├─ TensorFlow / PyTorch (Deep Learning)               │
│  ├─ LangChain (RAG für PMI Knowledge Base)             │
│  └─ MLflow (Model Versioning & A/B Testing)            │
└─────────────────────────────────────────────────────────┘
                          ⬇️ Data Layer
┌─────────────────────────────────────────────────────────┐
│  DATA LAYER (Supabase PostgreSQL + Vector Store)       │
│  ├─ Workflow Definitions (BPMN JSON)                   │
│  ├─ Historical Metrics (Time Series with TimescaleDB)  │
│  ├─ AI Training Data (Feature Store)                   │
│  └─ Vector Embeddings (pgvector für Semantic Search)   │
└─────────────────────────────────────────────────────────┘
```

---

#### **Priorisierung & Zeitplan**

**MVP für V2.0** *(3-6 Monate)*
1. ✅ Workflow-Template Library (Agile, Predictive, Hybrid)
2. ✅ Basic Automation (Status-Updates, Notifications)
3. ✅ 1-2 AI-Features als POC (z.B. Risk Prediction)

**V2.1 - Full Automation** *(6-9 Monate)*
4. ✅ Jira/Azure DevOps Integration
5. ✅ Report-Automation (PDF-Export)
6. ✅ Real-time Collaboration

**V2.2 - AI Suite** *(9-12 Monate)*
7. ✅ Predictive Analytics (Verzögerungs-Prognose)
8. ✅ Anomaly Detection
9. ✅ Natural Language Insights (GPT-4 Integration)

**V3.0 - Enterprise** *(12+ Monate)*
10. ✅ Custom AI-Models (Fine-tuning auf Unternehmensdaten)
11. ✅ Mobile App (React Native)
12. ✅ Multi-Tenant Architecture mit White-Label Option

---

#### **Business Impact & USP**

**Warum V2.0 ein Game-Changer ist:**

- 🚀 **Time-to-Value**: Reduziere PMO-Setup von Wochen auf Stunden
- 🎯 **Accuracy**: 30-40% genauere Projekt-Prognosen durch AI
- 💰 **Cost Savings**: Automatisierung spart 50% Admin-Aufwand
- 🧠 **Intelligence**: Proaktive Risiko-Erkennung statt Reaktion
- 🔄 **Flexibility**: Multi-Methodology Support für jede Organisation

**Zielgruppe:**
- PMO-Leiter in mittelständischen & Enterprise-Unternehmen
- Transformation-Manager in Digitalisierungs-Projekten
- Portfolio-Manager mit 10+ parallelen Projekten
- Agile Coaches & Scrum Master

---

### 🛠️ Contributions Welcome!

Interessiert an V2.0? 
- 💡 **Feature-Ideen**: Öffne ein [Discussion](https://github.com/karsten2025/PMO_Value_Generator/discussions)
- 🐛 **Bug-Reports**: Erstelle ein [Issue](https://github.com/karsten2025/PMO_Value_Generator/issues)
- 🤝 **Partnerships**: Kontaktiere mich für Kooperationen

---

---

## 🤝 Contributing

Contributions sind willkommen! Bitte:

1. Forke das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe den Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 📄 Lizenz

Dieses Projekt steht unter der **MIT License** - siehe [LICENSE](LICENSE) Datei für Details.

---

## 👤 Autor

**Karsten** - PMO & Portfolio Management Enthusiast

- 🔗 LinkedIn: [Dein LinkedIn-Profil](https://linkedin.com/in/dein-profil) *(aktualisiere mit deinem echten Profil)*
- 🐙 GitHub: [@karsten2025](https://github.com/karsten2025)
- 🌐 Website: [Deine Website](https://deine-website.de) *(optional)*

---

## 🙏 Acknowledgments

- **PMI (Project Management Institute)** für die Standards und Best Practices
- **Americo Pinto** für die Inspiration zum PMO Value Ring Konzept
- **Supabase** für die großartige Backend-as-a-Service Plattform
- **Vercel** für Next.js und das Deployment
- **React Flow** für die interaktiven Diagramm-Komponenten

---

## 📞 Support & Kontakt

Fragen? Öffne ein [Issue](https://github.com/karsten2025/PMO_Value_Generator/issues) oder kontaktiere mich auf LinkedIn!

**Für Kooperationen oder Consulting-Anfragen:** [Kontakt aufnehmen](mailto:deine-email@example.com) *(aktualisiere mit deiner E-Mail)*

---

<div align="center">

**⭐ Wenn dir dieses Projekt gefällt, gib ihm einen Star auf GitHub! ⭐**

Gebaut mit ❤️ für die PMO-Community

</div>

