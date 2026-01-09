# PMO Impact Cycle - Interactive Preview

## 🚀 Features

### ✅ Implementiert

1. **React Flow Visualisierung**
   - Kreisförmiges Layout mit 10 Milestones
   - Animierte Verbindungen zwischen den Schritten
   - Farbcodierung nach Stages (Discovery, Planning, Implementation, Optimization, Impact)
   - Custom Nodes mit Stage-Colors

2. **Sprach-Umschaltung (DE/EN/ES)**
   - Buttons oben rechts
   - Sofortige Aktualisierung aller Knoten
   - Keine Seitenneuladung nötig

3. **Register-Umschaltung (Allgemein/Management)**
   - Toggle zwischen "colloquial" und "management" Sprache
   - Instant Update der Beschreibungen
   - Zielgruppen-spezifische Inhalte

4. **Interaktive Sidebar**
   - Öffnet sich beim Klick auf einen Knoten
   - Zeigt vollständige Details zum Milestone
   - Vorschau aller anderen Sprachen
   - Schließbar über X-Button

5. **React Flow Komponenten**
   - Background Grid
   - Zoom Controls
   - MiniMap mit farbcodierten Nodes
   - Smooth Step Connections

## 🎯 Verwendung

### Server starten
```bash
cd frontend
npm run dev
```

### URL aufrufen
```
http://localhost:3001/preview
```

## 🎨 UI-Elemente

### Header
- Template Name: "PMO Impact Cycle"
- Sprach-Buttons: DE | EN | ES
- Register-Buttons: Allgemein | Management

### Canvas
- 10 Milestones kreisförmig angeordnet
- Jeder Node zeigt:
  - Step Number (farbiger Badge)
  - Titel
  - Internal Code
  - Kurzbeschreibung (2 Zeilen)

### Sidebar (nach Node-Click)
- Milestone Header mit Step Number
- Stage Badge
- Vollständige Beschreibung
- Aktuelle Ansicht (Sprache & Register)
- Preview anderer Sprachen

### Footer
- Info Badge: "10 Milestones | Layout: circular"

## 🔧 Technische Details

### Dependencies
- `@xyflow/react` - React Flow Bibliothek
- `Next.js 16.1.1` mit App Router
- `Tailwind CSS` für Styling
- TypeScript für Type Safety

### Dateien
- `/frontend/src/app/preview/page.tsx` - Haupt-Komponente
- `/frontend/src/mock/impact-cycle-mock.json` - Datenquelle
- `/frontend/.cursorrules` - Projekt-Regeln

### State Management
- `useState` für Language & Register
- `useNodesState` & `useEdgesState` für React Flow
- `useMemo` für Performance-Optimierung
- `useCallback` für Event Handler

## 📊 Datenstruktur

### 2x3 Matrix
Jeder Milestone hat 6 Varianten:
- DE: Allgemein | Management
- EN: Allgemein | Management  
- ES: Allgemein | Management

### Stages (5)
1. Discovery (Blau) - Milestones 1-2
2. Planning (Lila) - Milestones 3-4
3. Implementation (Grün) - Milestones 5-6
4. Optimization (Orange) - Milestones 7-8
5. Impact (Rot) - Milestones 9-10

## 🛡️ Rechtlicher Schutz

Alle geschützten PMI-Begriffe wurden ersetzt:
- ❌ "PMO Value Ring" → ✅ "PMO Impact Cycle"
- ❌ "Flywheel" → ✅ "Value Engine"
- ❌ "Steps" → ✅ "Milestones"

Inhalte wurden paraphrasiert und sind urheberrechtlich geschützt.

## 🎉 Nächste Schritte

- [ ] Animations-Effekte beim Umschalten
- [ ] Export-Funktion für das Diagramm
- [ ] Filter nach Stages
- [ ] Suchfunktion für Milestones
- [ ] Dark Mode
- [ ] Mobile Responsive Design
- [ ] Backend-Integration mit Supabase

