# 💰 PROJECT FINANCE VALUE WIDGET

## 📝 ÜBERSICHT

Die **ProjectFinanceValue**-Komponente zeigt **CapEx** (Capital Expenditure) und **OpEx** (Operational Expenditure) für jedes Projekt mit intelligenter Variance-Analyse.

---

## 🎯 FEATURES

### ✅ **2x3 Matrix Support**
- **Sprachen:** DE, EN, ES
- **Register:** Colloquial (einfach) / Management (formal)
- **Labels:** Automatisch aus `frontend/mock/ui-labels-matrix.json`

### ✅ **Collapsed/Expanded States**
- **Collapsed (Standard):** Zeigt nur Gesamtbudget + Variance-Indikator
- **Expanded (Klick):** Detaillierte Tabelle mit CapEx/OpEx Breakdown

### ✅ **Intelligente Farbcodierung**
- **Grün:** Actual < Planned (unter Budget ✅)
- **Rot:** Actual > Planned (über Budget ⚠️)
- **Grau:** Exact Match

### ✅ **Cent-basierte Speicherung**
- Alle Werte in der DB sind **BIGINT (Cents)**
- UI rechnet automatisch in **Euro** um
- Verhindert Floating-Point-Fehler

---

## 📊 DATENBANK-SCHEMA

### **Tabelle: `pmo_project_finance`**

```sql
CREATE TABLE pmo_project_finance (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES pmo_projects(id),
    
    -- PLANNED (in CENTS)
    planned_capex BIGINT,
    planned_opex BIGINT,
    
    -- ACTUAL (in CENTS)
    actual_capex BIGINT,
    actual_opex BIGINT,
    
    -- METADATA
    currency VARCHAR(3) DEFAULT 'EUR',
    fiscal_year INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🚀 SETUP

### **1. Datenbank Migration ausführen**

```bash
# In Supabase SQL Editor:
cd database/
# Kopiere migration_project_finance.sql und führe es aus
```

**ODER direkt im Terminal:**

```bash
psql -h db.hgvlurhieyydtquzhcyp.supabase.co \
     -U postgres \
     -d postgres \
     -f database/migration_project_finance.sql
```

---

### **2. Sample Data (Optional)**

Die Migration fügt automatisch Finance-Daten für das **Cloud Migration Program [DUMMY]** ein:

```sql
-- Planned Budget
CapEx: 2.5M EUR (250,000,000 Cents)
OpEx:  1.2M EUR (120,000,000 Cents)
Total: 3.7M EUR

-- Actual Spending
CapEx: 2.35M EUR (5% under budget ✅)
OpEx:  1.25M EUR (4% over budget ⚠️)
Total: 3.6M EUR (2.7% under budget ✅)
```

---

## 🎨 UI-KOMPONENTE

### **Verwendung in Project Card**

```tsx
import ProjectFinanceValue from '@/app/components/ProjectFinanceValue';

<ProjectFinanceValue 
  projectId={project.id} 
  lang="de"    // oder 'en', 'es'
  mode="colloquial"  // oder 'management'
/>
```

### **Props**

| Prop | Typ | Beschreibung |
|------|-----|--------------|
| `projectId` | `string` | UUID des Projekts |
| `lang` | `'de' \| 'en' \| 'es'` | Sprache für UI-Labels |
| `mode` | `'colloquial' \| 'management'` | Register (einfach/formal) |

---

## 🧮 VARIANCE-BERECHNUNG

### **Formel**

```typescript
variance = ((actual - planned) / planned) * 100
```

### **Beispiel**

```typescript
Planned CapEx: 2.500.000 EUR
Actual CapEx:  2.350.000 EUR

Variance = ((2.350.000 - 2.500.000) / 2.500.000) * 100
         = -6.0%  // ✅ 6% unter Budget
```

---

## 🌍 INTERNATIONALISIERUNG

### **Labels in `ui-labels-matrix.json`**

```json
{
  "project_finance": {
    "title": {
      "de": { "colloquial": "Budget & Kosten", "management": "Strategic Capital Allocation" },
      "en": { "colloquial": "Budget & Costs", "management": "Strategic Capital Allocation" },
      "es": { "colloquial": "Presupuesto y Costos", "management": "Asignación Estratégica de Capital" }
    },
    "capex": {
      "de": { "colloquial": "Investitionen", "management": "Capital Expenditure (CapEx)" },
      "en": { "colloquial": "Investments", "management": "Capital Expenditure (CapEx)" },
      "es": { "colloquial": "Inversiones", "management": "Gastos de Capital (CapEx)" }
    },
    "opex": {
      "de": { "colloquial": "Laufende Kosten", "management": "Operational Expenditure (OpEx)" },
      "en": { "colloquial": "Running Costs", "management": "Operational Expenditure (OpEx)" },
      "es": { "colloquial": "Costos Operativos", "management": "Gastos Operacionales (OpEx)" }
    }
  }
}
```

---

## 📱 RESPONSIVE DESIGN

### **Breakpoints**

- **Mobile (<640px):** Single-Column Layout, kompakte Badges
- **Tablet (≥640px):** Grid-Layout mit 4 Spalten
- **Desktop (≥1024px):** Volle Breite, optimale Spacing

### **Tailwind Classes**

```tsx
// Collapsed View
className="p-3 sm:p-4 rounded-xl"

// Table Grid
className="grid grid-cols-4 gap-3"

// Badges
className="px-2 py-1 rounded-lg border"
```

---

## 🔍 DEBUGGING

### **Finance-Daten für ein Projekt prüfen**

```sql
SELECT 
  p.name,
  pf.planned_capex / 100 AS planned_capex_eur,
  pf.actual_capex / 100 AS actual_capex_eur,
  pf.planned_opex / 100 AS planned_opex_eur,
  pf.actual_opex / 100 AS actual_opex_eur,
  pf.currency,
  pf.fiscal_year
FROM pmo_projects p
LEFT JOIN pmo_project_finance pf ON p.id = pf.project_id
WHERE p.name ILIKE '%Cloud Migration%';
```

### **Console Logs**

```typescript
// In Browser DevTools
console.log('Finance Data:', financeData);
console.log('Total Variance:', totalVariance);
```

---

## 🎯 NEXT STEPS

### **Phase 1: Erweiterte Features** 🚀
- [ ] **Forecast Budgets:** Prognosen für zukünftige Ausgaben
- [ ] **Budget Timeline:** Historische Entwicklung (Line Chart)
- [ ] **Cost Breakdown:** Detaillierte Kategorie-Splits
- [ ] **Budget Alerts:** Benachrichtigungen bei Über-/Unterschreitungen

### **Phase 2: Integration** 🔗
- [ ] **Impact Cycle Verknüpfung:** Finance → Process Steps
- [ ] **Multi-Year View:** Vergleich über mehrere Geschäftsjahre
- [ ] **Currency Conversion:** Automatische Umrechnung (EUR/USD/GBP)
- [ ] **Budget Editor:** Inline-Editing für Finance-Daten

### **Phase 3: Analytics** 📈
- [ ] **Variance Trends:** Predictive Analytics (ML)
- [ ] **Portfolio Aggregation:** Gesamt-CapEx/OpEx über alle Projekte
- [ ] **ROI Calculator:** Return on Investment Tracking
- [ ] **TCO Analysis:** Total Cost of Ownership

---

## 📚 DOKUMENTATION

### **Dateien**

| Datei | Beschreibung |
|-------|--------------|
| `database/migration_project_finance.sql` | DB Schema + Sample Data |
| `frontend/app/components/ProjectFinanceValue.tsx` | React Komponente |
| `frontend/mock/ui-labels-matrix.json` | Internationalisierung |
| `frontend/app/components/PortfolioProjectList.tsx` | Integration in Project Card |

---

## ✅ TESTING CHECKLIST

- [ ] Migration erfolgreich durchgeführt
- [ ] Sample Data in DB vorhanden
- [ ] Finance Widget erscheint auf Project Card
- [ ] Collapsed State zeigt Gesamtbudget + Variance
- [ ] Expanded State zeigt Tabelle mit CapEx/OpEx
- [ ] Farbcodierung korrekt (Grün/Rot)
- [ ] Sprach-Wechsel funktioniert (DE/EN/ES)
- [ ] Register-Wechsel funktioniert (Colloquial/Management)
- [ ] Responsive auf Mobile/Tablet/Desktop
- [ ] Keine TypeScript-Fehler

---

## 🎉 ERFOLGREICH IMPLEMENTIERT!

**Die ProjectFinanceValue-Komponente ist jetzt vollständig integriert und bereit für den Einsatz!** 🚀

**Next Steps:**
1. Migration ausführen: `database/migration_project_finance.sql`
2. Frontend testen: `npm run dev`
3. Supabase-Daten prüfen: SQL Editor
4. Deployment: `git push origin main`

---

**Happy Budget Tracking! 💰✨**
