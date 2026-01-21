# 🗺️ PMO Value Generator - Project Structure Guide

> **Dein persönliches Nachschlagewerk für effiziente Cursor-Nutzung**
> Erstellt: Januar 2026

---

## 📁 **1. PROJEKT-ÜBERSICHT**

```
PMO_Value_Generator/
├─ frontend/              ← Next.js App (Hauptanwendung)
├─ extraction/            ← Python Scripts (PDF Verarbeitung)
├─ database/              ← SQL Migrations (Supabase Schema)
├─ knowledge_base_pdf/    ← PMI Dokumente (Training Data)
└─ vector_db/             ← ChromaDB (RAG für Chatbot)
```

---

## 🎯 **2. FRONTEND STRUKTUR (Das Wichtigste!)**

```
frontend/
├─ app/                        ← Next.js App Router (≥v13)
│  ├─ page.tsx                 ← Hauptseite (Impact Cycle)
│  ├─ layout.tsx               ← Root Layout (Header, Fonts)
│  ├─ globals.css              ← Tailwind + Custom Styles
│  │
│  ├─ components/              ← React Komponenten
│  │  ├─ GitHubStyleHeader.tsx      ← Header (alle Seiten)
│  │  ├─ ImpactNode.tsx             ← Process Node (React Flow)
│  │  ├─ PortfolioProjectList.tsx   ← Projekt-Liste
│  │  ├─ ProjectDetailSidebar.tsx   ← KPI Sidebar
│  │  ├─ ChatInterface.tsx          ← AI Chatbot
│  │  └─ ...                        ← Weitere Komponenten
│  │
│  ├─ contexts/                ← React Context (Global State)
│  │  ├─ PortfolioContext.tsx       ← Selected Portfolio
│  │  └─ LanguageContext.tsx        ← Language/Register
│  │
│  ├─ utils/                   ← Helper Funktionen
│  │  ├─ scoreCalculation.ts        ← Portfolio Health Score
│  │  ├─ helpers.ts                 ← Allgemeine Utils
│  │  └─ ...
│  │
│  ├─ types/                   ← TypeScript Interfaces
│  │  ├─ index.ts                   ← Shared Types
│  │  └─ pmp.ts                     ← PMP Types
│  │
│  ├─ data/                    ← Static Data
│  │  └─ impactCycleData.ts         ← 10 Process Steps
│  │
│  ├─ portfolio/               ← Dynamic Routes
│  │  └─ [portfolioId]/
│  │     └─ project/
│  │        └─ [projectId]/
│  │           └─ page.tsx          ← Project Detail Page
│  │
│  ├─ pmp-demo/                ← Demo Pages
│  │  └─ page.tsx
│  │
│  └─ api/                     ← API Routes (Serverless)
│     └─ chat/
│        └─ route.ts                ← Chatbot Endpoint
│
├─ lib/                        ← Third-Party Integrations
│  └─ supabase.ts              ← Supabase Client
│
├─ mock/                       ← Demo/Test Data
│  ├─ ui-labels-matrix.json         ← 2x3 Matrix Labels
│  └─ kpi-library-mock.json         ← KPI Definitions
│
├─ public/                     ← Static Assets
│  └─ *.svg                    ← Icons, Images
│
└─ Configuration Files
   ├─ package.json             ← Dependencies
   ├─ tsconfig.json            ← TypeScript Config
   ├─ tailwind.config.ts       ← Tailwind Config
   ├─ next.config.ts           ← Next.js Config
   └─ vercel.json              ← Vercel Deploy Config
```

---

## 🎯 **3. WICHTIGSTE DATEIEN & IHRE ROLLE**

### **🏠 Haupt-Einstiegspunkte:**

| Datei | Beschreibung | Wann anfassen? |
|-------|-------------|----------------|
| `app/page.tsx` | **Hauptseite** (Impact Cycle Visualisierung) | Wenn du Impact Cycle ändern willst |
| `app/layout.tsx` | **Root Layout** (Header, Fonts, Metadata) | Für globale Änderungen (Title, Fonts) |
| `app/globals.css` | **Styles** (Tailwind + Custom CSS) | Für globale Styles (Scrollbar, etc.) |

### **🧩 Wichtigste Komponenten:**

| Komponente | Beschreibung | Wiederverwendbar? |
|-----------|-------------|-------------------|
| `GitHubStyleHeader.tsx` | Header mit Language/Mode Switcher | ✅ Ja (auf allen Seiten) |
| `ImpactNode.tsx` | Process Node im Impact Cycle | ✅ Ja (React Flow Custom Node) |
| `PortfolioProjectList.tsx` | Liste aller Projekte | ❌ Nein (spezifisch) |
| `ProjectDetailSidebar.tsx` | KPI Sidebar | ✅ Ja (mit Props) |
| `ChatInterface.tsx` | AI Chatbot | ✅ Ja (überall einsetzbar) |

### **⚙️ Business Logic:**

| Datei | Beschreibung | Wann nutzen? |
|-------|-------------|--------------|
| `utils/scoreCalculation.ts` | **Portfolio Health Berechnung** | Wenn Score-Logik ändern |
| `utils/helpers.ts` | Allgemeine Helper (Date, Format, etc.) | Für neue Helper-Funktionen |
| `lib/supabase.ts` | Supabase Client + Types | Für DB-Queries |

### **🗂️ TypeScript Types:**

| Datei | Beschreibung | Wann nutzen? |
|-------|-------------|--------------|
| `types/index.ts` | Shared Types (Portfolio, Project, KPI) | Neue Types hinzufügen |
| `types/pmp.ts` | PMP-spezifische Types | PMP-Features erweitern |

### **🌐 Context (Global State):**

| Context | Beschreibung | Wo genutzt? |
|---------|-------------|-------------|
| `PortfolioContext` | Selected Portfolio (welches Portfolio aktiv?) | Überall wo Portfolio-Daten |
| `LanguageContext` | Language/Register (DE/EN/ES, Normal/Management) | Überall wo Text angezeigt wird |

---

## 🎯 **4. NAMING CONVENTIONS (Wie du Dateien benennst)**

### **Komponenten:**
```
✅ PascalCase: Header.tsx, ImpactNode.tsx
✅ Beschreibend: PortfolioProjectList.tsx (nicht List.tsx)
✅ Keine Abkürzungen: ProjectDetailSidebar.tsx (nicht ProjDetSB.tsx)
```

### **Utils/Helper:**
```
✅ camelCase: scoreCalculation.ts, helpers.ts
✅ Funktionen: getPortfolioHealth(), formatDate()
```

### **Types:**
```typescript
✅ PascalCase Interface: Portfolio, ProjectKPI, PortfolioScore
✅ Type Suffix: ProjectKPIType, LanguageType
```

### **Ordner:**
```
✅ Plural: components/, utils/, types/ (nicht component/)
✅ Lowercase: app/, lib/, public/
```

---

## 🎯 **5. WIE DU DATEIEN FINDEST (Für Cursor-Requests)**

### **Scenario 1: "Ich will den Header ändern"**
```
📍 Datei: frontend/app/components/GitHubStyleHeader.tsx
📍 Request: "Ändere frontend/app/components/GitHubStyleHeader.tsx,
            füge einen Logout-Button nach Zeile 45 ein"
```

### **Scenario 2: "Ich will neue KPI-Berechnung"**
```
📍 Datei: frontend/app/utils/scoreCalculation.ts
📍 Request: "In frontend/app/utils/scoreCalculation.ts,
            ändere calculatePortfolioScore() Funktion..."
```

### **Scenario 3: "Ich will neues TypeScript Interface"**
```
📍 Datei: frontend/app/types/index.ts (für shared types)
        ODER frontend/app/types/pmp.ts (für PMP-spezifisch)
📍 Request: "Füge in frontend/app/types/index.ts
            ein neues Interface ApprovalWorkflow hinzu..."
```

### **Scenario 4: "Ich will neue Komponente erstellen"**
```
📍 Ort: frontend/app/components/
📍 Request: "Erstelle neue Datei 
            frontend/app/components/ApprovalModal.tsx
            mit folgenden Props..."
```

### **Scenario 5: "Ich will neue Page (Route)"**
```
📍 Ort: frontend/app/ROUTE_NAME/page.tsx
📍 Beispiel: frontend/app/approvals/page.tsx
📍 Request: "Erstelle neue Page unter frontend/app/approvals/page.tsx..."
```

---

## 🎯 **6. REACT PATTERNS (Die du kennen solltest)**

### **Pattern 1: Komponente mit Props**
```typescript
// frontend/app/components/Button.tsx

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export default function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}>
      {label}
    </button>
  );
}

// Nutzung:
import Button from '@/app/components/Button';
<Button label="Klick mich" onClick={() => alert('Hi')} />
```

**Wann nutzen?** Wiederverwendbare UI-Elemente (Buttons, Inputs, Cards)

### **Pattern 2: Page Component**
```typescript
// frontend/app/dashboard/page.tsx

'use client'; // Wenn du Client-Side Features brauchst (useState, useEffect)

import { useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState([]);
  
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Content */}
    </div>
  );
}
```

**Wann nutzen?** Für neue Seiten/Routes

### **Pattern 3: Context nutzen**
```typescript
// Irgendwo in einer Komponente:
import { useLanguage } from '@/app/contexts/LanguageContext';

function MyComponent() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button onClick={() => setLanguage('DE')}>
      Current: {language}
    </button>
  );
}
```

**Wann nutzen?** Wenn du global state brauchst (Language, Portfolio, User)

### **Pattern 4: Supabase Query**
```typescript
import { supabase } from '@/lib/supabase';

async function fetchProjects() {
  const { data, error } = await supabase
    .from('pmo_projects')
    .select('*')
    .eq('portfolio_id', portfolioId);
    
  if (error) console.error(error);
  return data;
}
```

**Wann nutzen?** Immer wenn du Daten aus der DB holst

---

## 🎯 **7. TAILWIND CSS PATTERNS**

### **Standard Layout:**
```tsx
<div className="container mx-auto p-4">
  {/* Content zentriert, mit Padding */}
</div>
```

### **Responsive Grid:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 Column auf Mobile, 2 auf Tablet, 3 auf Desktop */}
</div>
```

### **Flex Layout:**
```tsx
<div className="flex flex-col md:flex-row items-center justify-between gap-4">
  {/* Vertikal auf Mobile, Horizontal auf Desktop */}
</div>
```

### **Button Styles:**
```tsx
<button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
  {/* Standard Button */}
</button>
```

---

## 🎯 **8. TYPISCHE REQUESTS (Vorlagen für dich)**

### **Neue Komponente erstellen:**
```
"Erstelle neue Komponente frontend/app/components/ApprovalCard.tsx mit:
- Props: title (string), status (string), onApprove (function)
- Tailwind Styling: Card mit Border, Shadow
- Button für Approve/Reject
- TypeScript Interface für Props"
```

### **Existierende Komponente ändern:**
```
"In frontend/app/components/Header.tsx:
- Füge nach Zeile 45 einen Logout-Button ein
- Style: text-sm px-4 py-2 bg-red-500
- onClick: supabase.auth.signOut()
- Icon: LogOut from lucide-react"
```

### **Neue Page erstellen:**
```
"Erstelle neue Page frontend/app/approvals/page.tsx:
- Liste aller Approval-Requests aus Supabase
- Table mit Columns: Project, Status, Approver
- Approve/Reject Buttons
- Nutze PortfolioContext für Portfolio-Filter"
```

### **Utility Funktion hinzufügen:**
```
"In frontend/app/utils/helpers.ts:
- Füge Funktion calculateROI(cost, benefit, years) hinzu
- Return: { roi: number, payback: number }
- TypeScript typen"
```

### **Type hinzufügen:**
```
"In frontend/app/types/index.ts:
- Füge Interface ApprovalRequest hinzu mit:
  - id: string
  - project_id: string
  - status: 'pending' | 'approved' | 'rejected'
  - approver_email: string
  - created_at: Date"
```

---

## 🎯 **9. DEBUGGING PATTERNS**

### **Wenn TypeScript Error:**
```
1. Lies Error genau (welche Datei, welche Zeile?)
2. Check: Ist das Interface definiert? (types/*.ts)
3. Check: Sind Imports korrekt?

Request: 
"TypeScript Error in frontend/app/page.tsx Zeile 123:
Property 'category_scores' does not exist on type 'PortfolioScore'

Bitte fixe das Interface in frontend/app/utils/scoreCalculation.ts"
```

### **Wenn Komponente nicht rendert:**
```
1. Check Browser Console (F12)
2. Check: Ist Import korrekt?
3. Check: Sind Props richtig übergeben?

Request:
"ApprovalCard rendert nicht. 
Datei: frontend/app/components/ApprovalCard.tsx
Console Error: [Screenshot]
Bitte debug"
```

---

## 🎯 **10. QUICK REFERENCE (Spickzettel)**

### **Ich will...**

| Was | Wo | Request-Template |
|-----|-----|------------------|
| Header ändern | `components/GitHubStyleHeader.tsx` | "In GitHubStyleHeader.tsx Zeile X..." |
| Neue Komponente | `components/NEUER_NAME.tsx` | "Erstelle components/NAME.tsx mit..." |
| Score-Logik ändern | `utils/scoreCalculation.ts` | "In scoreCalculation.ts, Funktion X..." |
| Neue Page | `app/ROUTE/page.tsx` | "Erstelle app/ROUTE/page.tsx..." |
| DB Query | `lib/supabase.ts` | "Füge Query in supabase.ts hinzu..." |
| Neuen Type | `types/index.ts` | "In types/index.ts, Interface X..." |
| Global State | `contexts/*.tsx` | "Nutze LanguageContext/PortfolioContext" |
| Styling ändern | `globals.css` ODER inline Tailwind | "Ändere Tailwind Classes in..." |

---

## 🎯 **11. NÄCHSTE SCHRITTE (Dein Lernplan)**

### **Woche 1: Struktur verstehen**
- [ ] Lies diese Datei 2× komplett durch
- [ ] Öffne jede Datei aus "WICHTIGSTE DATEIEN" kurz
- [ ] Schau dir 3 Komponenten an: Header, ImpactNode, ProjectList

### **Woche 2: Patterns anwenden**
- [ ] Ändere Header (eigenen Button hinzufügen)
- [ ] Erstelle neue einfache Komponente (z.B. Badge)
- [ ] Füge eine Utility-Funktion hinzu

### **Woche 3: Features bauen**
- [ ] Erstelle neue Page (mit meiner Hilfe)
- [ ] Integriere Supabase Query
- [ ] Nutze Context für global state

### **Woche 4: Selbstständig**
- [ ] Feature von Anfang bis Ende (mit minimaler Hilfe)
- [ ] Du gibst mir spezifische File-Pfade
- [ ] Du verstehst TypeScript Errors

---

## 📚 **ZUSÄTZLICHE RESSOURCEN**

### **Must-Read (1-2 Stunden):**
1. **Next.js Docs - App Router**: https://nextjs.org/docs/app
2. **React Patterns**: https://react.dev/learn
3. **Tailwind CSS**: https://tailwindcss.com/docs

### **Video-Tutorials (optional):**
- "Next.js 14 Full Course" (YouTube)
- "TypeScript for React Developers" (YouTube)

### **Cheat Sheets:**
- Tailwind CSS Cheat Sheet: https://nerdcave.com/tailwind-cheat-sheet
- React Hooks Cheat Sheet: https://react.dev/reference/react

---

## 🎯 **FAZIT: Dein Workflow ab jetzt**

```
1. Klare Idee: "Ich will X ändern/erstellen"
2. Diese Datei checken: "Wo liegt das?"
3. Request mit File-Pfad: "In frontend/app/components/X.tsx..."
4. Ich implementiere effizient
5. Du lernst beim Zuschauen/Testen

= 60% Kosten-Ersparnis + Lernen! 🎉
```

---

**Speichere diese Datei als Lesezeichen! 📌**
**Bei jedem Request: Erst hier nachschauen, dann spezifisch fragen.**

---

*Erstellt von Cursor AI für Karsten Zenk*  
*Version 1.0 - Januar 2026*
