# 🚀 PMO Database Migration - Anleitung

## ✅ AKTUELLER STAND

Die `migration_clean_slate.sql` enthält jetzt **ALLE** Schema-Updates in einem einzigen Skript:

### **Was ist ENTHALTEN:**

1. ✅ **String-IDs für KPIs**
   - `pmo_kpi_library.id` ist jetzt `TEXT` (z.B. `'DIS_AWR_STR_001'`)
   - `pmo_kpi_values.kpi_id` ist jetzt `TEXT` (Foreign Key zu pmo_kpi_library)

2. ✅ **Matrix-Spalten für Projekte**
   - `pmo_projects.name_matrix` (JSONB) für mehrsprachige Namen
   - `pmo_projects.description_matrix` (JSONB) für mehrsprachige Beschreibungen

3. ✅ **Erweiterte Projekt-Felder**
   - `strategic_alignment` (strategic/tactical/operational)
   - `impact_score` (low/medium/high)
   - `risk_level` (low/medium/high)
   - `project_owner`, `budget`, `tags`

4. ✅ **project_id in pmo_kpi_values**
   - Direkte Verknüpfung zwischen KPI-Werten und Projekten
   - `instance_id` ist jetzt optional (NULL erlaubt)

5. ✅ **Entfernung von pmo_instance_metrics**
   - Nur noch `pmo_kpi_values` wird verwendet
   - Keine Duplikate mehr!

---

## 📋 WIE DU DIE MIGRATION AUSFÜHRST

### **Option 1: Supabase UI (Empfohlen)**

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt aus
3. Klicke auf **SQL Editor** (linkes Menü)
4. Klicke auf **New Query**
5. Kopiere den gesamten Inhalt von `migration_clean_slate.sql`
6. Füge ihn ein und klicke **Run**

**Ergebnis:**
```
✅ PMO Database Schema - CLEAN SLATE ABGESCHLOSSEN!
Portfolios:  2
Projekte:    0
Instanzen:   0
KPIs:        0
KPI-Werte:   0
```

---

### **Option 2: Supabase CLI**

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
supabase db reset
supabase db push
```

---

## 🌱 TESTDATEN EINFÜGEN

Nach der Migration führe das Seed-Script aus:

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
python3 extraction/seed_pmo_data.py
```

**Das Script wird:**
- 2 Portfolios erstellen
- 6 Projekte mit Matrix-Daten erstellen
- 30 KPIs in die Library hochladen (String-IDs!)
- KPI-Werte für alle Projekte generieren

---

## ⚠️ WICHTIGE HINWEISE

### **1. Alte Migrations-Scripts NICHT MEHR NUTZEN**

Diese Scripts sind **veraltet** und in `migration_clean_slate.sql` enthalten:
- ~~`migration_add_project_details.sql`~~
- ~~`migration_project_matrix.sql`~~
- ~~`migration_kpi_library_string_id.sql`~~
- ~~`migration_kpi_values_string_id.sql`~~
- ~~`migration_fix_instance_id.sql`~~
- ~~`migration_add_project_id.sql`~~

**Nutze nur noch:** `migration_clean_slate.sql`

---

### **2. Frontend Kompatibilität**

Die folgenden Frontend-Komponenten sind bereits angepasst:
- ✅ `frontend/lib/supabase.ts` (String-IDs, project_id)
- ✅ `frontend/app/page.tsx` (pmo_kpi_values statt pmo_instance_metrics)
- ✅ `frontend/app/components/PortfolioProjectList.tsx` (project_id, Matrix-Daten)
- ✅ `frontend/app/components/ProjectDetailSidebar.tsx` (String-IDs)

---

### **3. Seed Script Kompatibilität**

Das `extraction/seed_pmo_data.py` ist angepasst:
- ✅ Lädt KPIs aus `frontend/mock/kpi-library-mock.json` (String-IDs)
- ✅ Erstellt Projekte mit `name_matrix` und `description_matrix`
- ✅ Verknüpft KPI-Werte mit `project_id`
- ✅ Setzt `instance_id` auf NULL

---

## 🎯 VERCEL DEPLOYMENT

Nach der Migration und dem Seeding:

1. **Environment Variables** in Vercel setzen:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Redeploy** triggern (automatisch nach Git Push)

3. **Testen**:
   - Öffne deine Vercel-URL
   - Wähle "Digital Transformation [DUMMY]" Portfolio
   - Prüfe, ob Health Hub 75% zeigt
   - Prüfe, ob Projects-Tab 6 Projekte zeigt

---

## 📊 SCHEMA ÜBERSICHT

```
pmo_portfolios
├── pmo_projects (mit name_matrix, description_matrix, strategic_alignment, etc.)
│   └── pmo_kpi_values (mit project_id und String kpi_id)
└── pmo_instances (optional, für Workflow-Tracking)

pmo_kpi_library (String-IDs: 'DIS_AWR_STR_001', etc.)
```

---

## 🆘 TROUBLESHOOTING

### **Problem: "column does not exist"**
**Lösung:** Du hast ein altes Schema. Führe `migration_clean_slate.sql` aus (löscht alles und erstellt neu).

### **Problem: "invalid input syntax for type uuid"**
**Lösung:** Dein Code versucht noch UUIDs zu verwenden. Prüfe, ob `kpi_id` als `TEXT` behandelt wird.

### **Problem: "relation pmo_instance_metrics does not exist"**
**Lösung:** Alter Code referenziert noch die alte Tabelle. Ändere auf `pmo_kpi_values`.

---

## ✅ READY FOR LINKEDIN!

Wenn alles funktioniert:
1. Mach einen Screenshot vom Health Hub (zeigt 75%)
2. Mach einen Screenshot von der Projects-Liste
3. Nutze die Texte aus `LINKEDIN_POST_ENGLISH.md`
4. **POST! 🚀**

---

**Letzte Aktualisierung:** 2026-01-10  
**Status:** ✅ Produktionsbereit

