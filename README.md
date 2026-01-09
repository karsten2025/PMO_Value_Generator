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

> **Hinweis**: Screenshots und Demo-Videos folgen in Kürze.

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
git clone https://github.com/DEIN-USERNAME/PMO_Value_Generator.git
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

### Portfolio Health Hub

Zentrale Visualisierung mit 3 konzentrischen Ringen:

- **🟡 Strategic Ring** (außen): Langfristige Ziele & Portfolio-Alignment
- **🔵 Tactical Ring** (mittig): Resource Management & Governance
- **🟢 Operational Ring** (innen): Tägliche Effizienz & Delivery

**Total Impact Score** wird als aggregierter Wert im Zentrum angezeigt.

### Project Drill-Down

- Filtere Projekte nach Strategic/Tactical/Operational
- Sieh alle KPIs eines Projekts auf einen Blick
- Verfolge den Fortschritt mit farbigen Progress Bars
- Impact Score & Risk Level als Badges

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

Das Projekt enthält ein Seed-Script, das folgende Test-Daten erstellt:

- **2 Portfolios**: "Digital Transformation [DUMMY]", "Product Launch [DUMMY]"
- **6 Projekte**: Je 2 Strategic, 2 Tactical, 2 Operational
- **24 KPI-Werte**: Realistische Ist/Soll-Werte für diverse Fortschritts-Levels

**Alle Dummy-Daten** sind mit `[DUMMY]` markiert und können einfach gelöscht werden:

```sql
DELETE FROM pmo_portfolios WHERE name LIKE '%[DUMMY]%';
```

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

- [ ] **Authentication**: Supabase Auth Integration
- [ ] **Real-time Updates**: Live-Sync zwischen Usern
- [ ] **Export/Report**: PDF-Export für Stakeholder-Berichte
- [ ] **AI-Insights**: KI-gestützte Trend-Analyse
- [ ] **Mobile App**: React Native Version

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

**Karsten**

- LinkedIn: [Dein LinkedIn-Profil](https://linkedin.com/in/dein-profil)
- GitHub: [@DeinUsername](https://github.com/DeinUsername)

---

## 🙏 Acknowledgments

- **PMI (Project Management Institute)** für die Standards und Best Practices
- **Americo Pinto** für die Inspiration zum PMO Value Ring Konzept
- **Supabase** für die großartige Backend-as-a-Service Plattform
- **Vercel** für Next.js und das Developer Experience

---

## 📞 Support & Kontakt

Fragen? Öffne ein [Issue](https://github.com/DEIN-USERNAME/PMO_Value_Generator/issues) oder kontaktiere mich auf LinkedIn!

---

<div align="center">

**⭐ Wenn dir dieses Projekt gefällt, gib ihm einen Star auf GitHub! ⭐**

Gebaut mit ❤️ für die PMO-Community

</div>

