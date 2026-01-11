/**
 * System Guide Extensions - Additional Pattern Responses
 * 
 * Erweitert systemGuide.ts mit Antworten auf Tool-spezifische Fragen
 */

import type { SystemResponse } from './systemGuide';

export const SYSTEM_EXTENSIONS: Record<string, SystemResponse> = {
  language: {
    de: `🌍 **SPRACHE WECHSELN**

So änderst du die Sprache:

1. **Oben rechts**: Buttons **DE / EN / ES**
2. **Klick** auf gewünschte Sprache
3. Alle Texte ändern sich sofort!

Zusätzlich: 2 Register wählbar:
- **👥 Normal**: Einfache Sprache
- **💼 Management**: Profi-Terminologie

💡 Chatbot übernimmt automatisch deine Sprache!`,

    en: `🌍 **CHANGE LANGUAGE**

How to change the language:

1. **Top right**: Buttons **DE / EN / ES**
2. **Click** on desired language
3. All texts change instantly!

Additionally: 2 registers available:
- **👥 Normal**: Simple language
- **💼 Management**: Professional terminology

💡 Chatbot automatically adopts your language!`,

    es: `🌍 **CAMBIAR IDIOMA**

Cómo cambiar el idioma:

1. **Arriba a la derecha**: Botones **DE / EN / ES**
2. **Haz clic** en idioma deseado
3. ¡Todos los textos cambian instantáneamente!

Además: 2 registros disponibles:
- **👥 Normal**: Lenguaje simple
- **💼 Management**: Terminología profesional

💡 ¡El chatbot adopta automáticamente tu idioma!`
  },

  impactscore: {
    de: `💎 **IMPACT SCORE - DER 75% WERT**

Der **75%** in der Mitte = **Portfolio Health Score**

📊 **BERECHNUNG:**
Aggregiert alle KPIs über 3 Dimensionen:
- 🔵 **STR** (Strategic): Strategische Ausrichtung
- 🟠 **TAC** (Tactical): Taktische Effizienz
- 🟢 **OPS** (Operational): Operative Exzellenz

**Score = Durchschnitt** aller 3

💡 **BEDEUTUNG:**
• **75-100%**: Hervorragend! 🎉
• **50-75%**: Gut, Optimierungspotenzial
• **< 50%**: Handlungsbedarf!

🎯 **VERBESSERN:**
Klick Milestone → Trage KPI-Werte ein → Score aktualisiert sich!`,

    en: `💎 **IMPACT SCORE - THE 75% VALUE**

The **75%** in the center = **Portfolio Health Score**

📊 **CALCULATION:**
Aggregates all KPIs across 3 dimensions:
- 🔵 **STR** (Strategic): Strategic Alignment
- 🟠 **TAC** (Tactical): Tactical Efficiency
- 🟢 **OPS** (Operational): Operational Excellence

**Score = Average** of all 3

💡 **MEANING:**
• **75-100%**: Excellent! 🎉
• **50-75%**: Good, room for optimization
• **< 50%**: Action needed!

🎯 **IMPROVE:**
Click Milestone → Enter KPI values → Score updates!`,

    es: `💎 **IMPACT SCORE - EL VALOR 75%**

El **75%** en el centro = **Puntuación de Salud de Cartera**

📊 **CÁLCULO:**
Agrega todos los KPIs en 3 dimensiones:
- 🔵 **STR** (Estratégico): Alineación Estratégica
- 🟠 **TAC** (Táctico): Eficiencia Táctica
- 🟢 **OPS** (Operativo): Excelencia Operativa

**Puntuación = Promedio** de las 3

💡 **SIGNIFICADO:**
• **75-100%**: ¡Excelente! 🎉
• **50-75%**: Bien, margen de optimización
• **< 50%**: ¡Acción necesaria!

🎯 **MEJORAR:**
Clic en Hito → Ingresa valores KPI → ¡Puntuación actualiza!`
  },

  cycle: {
    de: `🔄 **PMO IMPACT CYCLE**

Die 10 Schlüssel-Prozesse eines PMO

💡 **NUTZUNG:**
• Klick **Milestone** → Sidebar öffnet sich
• Trage **KPI-Werte** ein (Target & Current)
• Grüner Ring = **Fortschritt** (0-100%)
• Durchschnitt aller 10 = **PMO-Reifegrad**

🎯 **ZIEL:** Alle 10 auf 80%+ bringen!

💬 Tipp: \`/tour\` für detaillierte Einführung!`,

    en: `🔄 **PMO IMPACT CYCLE**

The 10 key processes of a PMO

💡 **USAGE:**
• Click **Milestone** → Sidebar opens
• Enter **KPI values** (Target & Current)
• Green ring = **Progress** (0-100%)
• Average of all 10 = **PMO maturity**

🎯 **GOAL:** Bring all 10 to 80%+!

💬 Tip: \`/tour\` for detailed introduction!`,

    es: `🔄 **PMO IMPACT CYCLE**

Los 10 procesos clave de una PMO

💡 **USO:**
• Clic en **Hito** → Se abre barra lateral
• Ingresa **valores KPI** (Target y Current)
• Anillo verde = **Progreso** (0-100%)
• Promedio de los 10 = **Madurez PMO**

🎯 **OBJETIVO:** ¡Llevar los 10 al 80%+!

💬 Consejo: \`/tour\` para introducción detallada!`
  }
};
