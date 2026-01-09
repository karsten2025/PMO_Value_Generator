# 🗄️ Datenbank Setup

Dieses Verzeichnis enthält SQL-Skripte zum Einrichten der Supabase-Datenbank für das PMO Impact & Value Engine Projekt.

## 📋 Voraussetzungen

- Supabase Projekt erstellt
- Zugriff auf den SQL Editor im Supabase Dashboard

## 🚀 Schnellstart

### Schritt 1: SQL-Skript ausführen

1. Öffne dein Supabase Dashboard
2. Navigiere zu: **SQL Editor** (linkes Menü)
3. Klicke auf **"New query"**
4. Kopiere den gesamten Inhalt von `setup_schema.sql`
5. Füge ihn in den SQL Editor ein
6. Klicke auf **"Run"** (Strg/Cmd + Enter)

### Schritt 2: Überprüfung

Nach der Ausführung solltest du sehen:

```
==============================================
PMO Database Schema Setup - FERTIG!
==============================================
Portfolios: 0
Projekte: 0
KPIs: 0
Metriken: 0
==============================================
Nächster Schritt: Führe seed_pmo_data.py aus!
==============================================
```

### Schritt 3: Testdaten einfügen

Führe das Seeding-Skript aus:

```bash
cd /Users/karsten/Documents/PMO_Value_Generator
python3 extraction/seed_pmo_data.py
```

## 📊 Datenbank-Struktur

Das Schema erstellt folgende Tabellen:

| Tabelle | Beschreibung |
|---------|-------------|
| `pmo_portfolios` | Portfolios (Digital Transformation, Product Launch, etc.) |
| `pmo_projects` | Projekte innerhalb der Portfolios |
| `pmo_templates` | PMO Impact Cycle Templates (10 Schritte) |
| `pmo_instances` | Laufende Prozess-Instanzen |
| `pmo_kpi_library` | KPI-Bibliothek (30 KPIs: 3 pro Schritt) |
| `pmo_instance_metrics` | Aktuelle KPI-Messwerte (Ist/Soll) |

## 🔧 Fehlerbehebung

### Fehler: "relation already exists"

**Lösung:** Die Tabellen existieren bereits. Das ist OK! Das Skript nutzt `IF NOT EXISTS`, sodass es sicher ist, es mehrmals auszuführen.

### Fehler: "permission denied"

**Lösung:** Stelle sicher, dass du den **SQL Editor** nutzt und NICHT das Table Editor GUI.

### Fehlende Spalten

Falls du vorher manuell Tabellen erstellt hast, kannst du diese löschen und das Skript neu ausführen:

```sql
-- VORSICHT: Löscht alle Daten!
DROP TABLE IF EXISTS pmo_instance_metrics CASCADE;
DROP TABLE IF EXISTS pmo_kpi_library CASCADE;
DROP TABLE IF EXISTS pmo_instances CASCADE;
DROP TABLE IF EXISTS pmo_templates CASCADE;
DROP TABLE IF EXISTS pmo_projects CASCADE;
DROP TABLE IF EXISTS pmo_portfolios CASCADE;
```

Dann führe `setup_schema.sql` erneut aus.

## 🔄 Updates

Falls du das Schema später erweitern möchtest, kannst du weitere SQL-Dateien hinzufügen:

```bash
database/
├── setup_schema.sql       # Initial Setup
├── migration_001.sql      # Erste Änderung
└── migration_002.sql      # Zweite Änderung
```

## 📝 Notizen

- **Row Level Security (RLS):** Derzeit deaktiviert. Für Produktion aktivieren!
- **Indizes:** Bereits für häufige Queries optimiert
- **Cascading Deletes:** Aktiviert - beim Löschen eines Portfolios werden alle abhängigen Daten gelöscht

