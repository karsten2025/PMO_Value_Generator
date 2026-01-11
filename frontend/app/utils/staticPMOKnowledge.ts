/**
 * Static PMO Knowledge Base
 * 
 * ZWECK: Ermöglicht Vercel-Deployment OHNE Backend!
 * 
 * Häufige PMO-Fragen mit Antworten - funktioniert 100% im Browser
 * 
 * LinkedIn-Demo-Ready: User bekommt IMMER eine Antwort!
 */

export interface StaticAnswer {
  de: string;
  en: string;
  es: string;
}

export const PMO_KNOWLEDGE: Record<string, StaticAnswer> = {
  // KPIs
  kpis: {
    de: `📊 **Die wichtigsten PMO KPIs**

**STRATEGISCHE KPIs:**
- 🎯 **Strategic Alignment Rate**: % der Projekte aligned mit Unternehmensstrategie
  → Benchmark: 70%+ ist gut
- 💰 **Portfolio ROI**: Return on Investment über alle Projekte
  → Benchmark: 15%+ ist solide
- 🎨 **Innovation Rate**: % Budget für innovative Projekte
  → Benchmark: 10-20% des Portfolios

**TAKTISCHE KPIs:**
- ⏱️ **Resource Utilization**: Auslastung der Ressourcen
  → Ziel: 75-85% (nicht 100%! Puffer wichtig)
- 💵 **Budget Variance**: Abweichung vom geplanten Budget
  → Benchmark: ±10% akzeptabel
- 📈 **Project Success Rate**: % erfolgreich abgeschlossener Projekte
  → Benchmark: 60%+ ist gut, 80%+ ist exzellent

**OPERATIVE KPIs:**
- 🚀 **On-Time Delivery**: % Projekte pünktlich abgeschlossen
  → Benchmark: 70%+ ist solide
- ✅ **Quality Metrics**: Fehlerrate, Nacharbeiten
  → Ziel: <5% Nacharbeiten
- 📋 **Process Compliance**: Einhaltung der PM-Standards
  → Ziel: 90%+ Compliance

═══════════════════════════════════════════════════

**TOP 3 KPIs für den START:**

1. **Project Success Rate** (60%+ ist gut)
   → Misst: Wurden Ziele erreicht?
   
2. **On-Time Delivery** (70%+ ist gut)
   → Misst: Sind wir pünktlich?
   
3. **Budget Variance** (<10% ist gut)
   → Misst: Halten wir das Budget?

═══════════════════════════════════════════════════

💡 **PROFI-TIPP:** 
Starte mit 3-5 KPIs, nicht allen auf einmal! 
Zu viele KPIs = Analyse-Paralyse.

🎯 **QUICK WIN:**
Wähle 1 KPI pro Dimension (Strategic/Tactical/Operational)`,

    en: `📊 **The Most Important PMO KPIs**

**STRATEGIC KPIs:**
- 🎯 **Strategic Alignment Rate**: % of projects aligned with company strategy
  → Benchmark: 70%+ is good
- 💰 **Portfolio ROI**: Return on Investment across all projects
  → Benchmark: 15%+ is solid
- 🎨 **Innovation Rate**: % budget for innovative projects
  → Benchmark: 10-20% of portfolio

**TACTICAL KPIs:**
- ⏱️ **Resource Utilization**: Resource capacity usage
  → Target: 75-85% (not 100%! Buffer important)
- 💵 **Budget Variance**: Deviation from planned budget
  → Benchmark: ±10% acceptable
- 📈 **Project Success Rate**: % of successfully completed projects
  → Benchmark: 60%+ is good, 80%+ is excellent

**OPERATIONAL KPIs:**
- 🚀 **On-Time Delivery**: % projects completed on time
  → Benchmark: 70%+ is solid
- ✅ **Quality Metrics**: Error rate, rework
  → Target: <5% rework
- 📋 **Process Compliance**: Adherence to PM standards
  → Target: 90%+ compliance

═══════════════════════════════════════════════════

**TOP 3 KPIs to START:**

1. **Project Success Rate** (60%+ is good)
   → Measures: Were objectives achieved?
   
2. **On-Time Delivery** (70%+ is good)
   → Measures: Are we on time?
   
3. **Budget Variance** (<10% is good)
   → Measures: Are we within budget?

═══════════════════════════════════════════════════

💡 **PRO TIP:** 
Start with 3-5 KPIs, not all at once! 
Too many KPIs = Analysis paralysis.

🎯 **QUICK WIN:**
Choose 1 KPI per dimension (Strategic/Tactical/Operational)`,

    es: `📊 **Los KPIs PMO más importantes**

**KPIs ESTRATÉGICOS:**
- 🎯 **Tasa de Alineación Estratégica**: % proyectos alineados con estrategia
  → Referencia: 70%+ es bueno
- 💰 **ROI de Cartera**: Retorno de inversión en todos los proyectos
  → Referencia: 15%+ es sólido
- 🎨 **Tasa de Innovación**: % presupuesto para proyectos innovadores
  → Referencia: 10-20% de la cartera

**KPIs TÁCTICOS:**
- ⏱️ **Utilización de Recursos**: Uso de capacidad de recursos
  → Meta: 75-85% (¡no 100%! Margen importante)
- 💵 **Variación de Presupuesto**: Desviación del presupuesto planificado
  → Referencia: ±10% aceptable
- 📈 **Tasa de Éxito de Proyectos**: % proyectos completados con éxito
  → Referencia: 60%+ es bueno, 80%+ es excelente

**KPIs OPERATIVOS:**
- 🚀 **Entrega a Tiempo**: % proyectos completados a tiempo
  → Referencia: 70%+ es sólido
- ✅ **Métricas de Calidad**: Tasa de errores, retrabajos
  → Meta: <5% retrabajos
- 📋 **Cumplimiento de Procesos**: Cumplimiento de estándares PM
  → Meta: 90%+ cumplimiento

═══════════════════════════════════════════════════

**TOP 3 KPIs para COMENZAR:**

1. **Tasa de Éxito** (60%+ es bueno)
   → Mide: ¿Se lograron los objetivos?
   
2. **Entrega a Tiempo** (70%+ es bueno)
   → Mide: ¿Estamos a tiempo?
   
3. **Variación de Presupuesto** (<10% es bueno)
   → Mide: ¿Estamos dentro del presupuesto?

═══════════════════════════════════════════════════

💡 **CONSEJO PRO:** 
¡Comienza con 3-5 KPIs, no todos a la vez! 
Demasiados KPIs = Parálisis de análisis.

🎯 **VICTORIA RÁPIDA:**
Elige 1 KPI por dimensión (Estratégico/Táctico/Operativo)`
  },

  // Value/ROI
  value: {
    de: `💎 **Der messbare Wert eines PMO**

**HARTE FACTS (Studien-basiert):**

📉 **15-30% WENIGER gescheiterte Projekte**
   → Von 40% Failure Rate auf 25%
   → Bei 50 Projekten/Jahr = 7,5 Projekte gerettet!

⏱️ **20-40% SCHNELLERE Durchlaufzeiten**
   → Projekte fertig in 6 statt 10 Monaten
   → Faster Time-to-Market = Competitive Advantage

💰 **10-25% KOSTENERSPARNIS**
   → Durch Standardisierung & Best Practices
   → Weniger Nacharbeiten, weniger Chaos

🎯 **2-3x HÖHERE Strategieumsetzung**
   → Von 40% auf 80-90% erfolgreich umgesetzte Strategie-Initiativen

═══════════════════════════════════════════════════

**ROI-RECHNUNG (Real-World Beispiel):**

**Firma:** Mittelstand, 50 Projekte/Jahr
**Durchschnitts-Budget pro Projekt:** 500k€
**Gesamt-Portfolio:** 25M€

**PMO-INVESTITION:**
- 2 FTE PMO Manager: 200k€
- Tools (MS Project, PPM): 50k€
- Training & Setup: 100k€
- **TOTAL:** 350k€/Jahr

**PMO-EINSPARUNG (konservativ 15%):**
- 15% von 25M€ = **3,75M€**

**ROI:**
- (3,75M€ - 0,35M€) / 0,35M€ = **971%** 🚀
- **Break-Even:** Nach 1,4 Monaten!

═══════════════════════════════════════════════════

**INDIREKTE BENEFITS (Unbezahlbar):**

🧠 **Wissensmanagement**
   → Lessons Learned werden NICHT vergessen
   → Neue PMs lernen aus Fehlern anderer

👥 **Ressourcen-Optimierung**
   → Keine Über-/Unterauslastung
   → Richtiger Mensch am richtigen Projekt

🎯 **Portfolio-Transparenz**
   → C-Level sieht Gesamtbild in Echtzeit
   → Bessere Entscheidungen, schneller

🚀 **Change Enablement**
   → Organisation wird agiler
   → Neue Initiativen schneller umgesetzt

💼 **Karriere-Entwicklung**
   → Klare PM-Karrierepfade
   → Höhere Mitarbeiter-Zufriedenheit

═══════════════════════════════════════════════════

**TIMELINE bis ROI:**

**Monat 1-3:** Setup & Quick Wins
→ Kosten: 100k€, Savings: 200k€ ✅

**Monat 4-6:** Prozesse etablieren
→ Kosten: 100k€, Savings: 500k€ ✅

**Monat 7-12:** Skalieren & Optimieren
→ Kosten: 150k€, Savings: 1,5M€ ✅

**Year 1 Total:** 350k€ → **2,2M€ Savings = 529% ROI**

═══════════════════════════════════════════════════

**KERNAUSSAGE für C-Level:**

Ein professionelles PMO zahlt sich in **6-12 Monaten** aus.
Nach Year 2 ist es pure Profit-Generation.

**ABER:** Nur wenn richtig aufgesetzt!
(Siehe: "Wie setze ich ein PMO auf?")`,

    en: `💎 **The Measurable Value of a PMO**

**HARD FACTS (Study-based):**

📉 **15-30% FEWER Failed Projects**
   → From 40% failure rate to 25%
   → With 50 projects/year = 7.5 projects saved!

⏱️ **20-40% FASTER Cycle Times**
   → Projects done in 6 instead of 10 months
   → Faster Time-to-Market = Competitive Advantage

💰 **10-25% COST SAVINGS**
   → Through standardization & best practices
   → Less rework, less chaos

🎯 **2-3x HIGHER Strategy Execution**
   → From 40% to 80-90% successfully executed strategy initiatives

═══════════════════════════════════════════════════

**ROI CALCULATION (Real-World Example):**

**Company:** Mid-market, 50 projects/year
**Average Budget per Project:** 500k€
**Total Portfolio:** 25M€

**PMO INVESTMENT:**
- 2 FTE PMO Managers: 200k€
- Tools (MS Project, PPM): 50k€
- Training & Setup: 100k€
- **TOTAL:** 350k€/year

**PMO SAVINGS (conservative 15%):**
- 15% of 25M€ = **3.75M€**

**ROI:**
- (3.75M€ - 0.35M€) / 0.35M€ = **971%** 🚀
- **Break-Even:** After 1.4 months!

═══════════════════════════════════════════════════

**INDIRECT BENEFITS (Priceless):**

🧠 **Knowledge Management**
   → Lessons Learned are NOT forgotten
   → New PMs learn from others' mistakes

👥 **Resource Optimization**
   → No over/underutilization
   → Right person on right project

🎯 **Portfolio Transparency**
   → C-Level sees big picture in real-time
   → Better decisions, faster

🚀 **Change Enablement**
   → Organization becomes more agile
   → New initiatives implemented faster

💼 **Career Development**
   → Clear PM career paths
   → Higher employee satisfaction

═══════════════════════════════════════════════════

**TIMELINE to ROI:**

**Month 1-3:** Setup & Quick Wins
→ Cost: 100k€, Savings: 200k€ ✅

**Month 4-6:** Establish Processes
→ Cost: 100k€, Savings: 500k€ ✅

**Month 7-12:** Scale & Optimize
→ Cost: 150k€, Savings: 1.5M€ ✅

**Year 1 Total:** 350k€ → **2.2M€ Savings = 529% ROI**

═══════════════════════════════════════════════════

**KEY MESSAGE for C-Level:**

A professional PMO pays for itself in **6-12 months**.
After Year 2, it's pure profit generation.

**BUT:** Only when properly set up!
(See: "How do I set up a PMO?")`,

    es: `💎 **El Valor Medible de una PMO**

**HECHOS DUROS (Basados en estudios):**

📉 **15-30% MENOS Proyectos Fallidos**
   → De 40% tasa de fallo a 25%
   → Con 50 proyectos/año = ¡7,5 proyectos salvados!

⏱️ **20-40% MÁS RÁPIDOS Tiempos de Ciclo**
   → Proyectos terminados en 6 en lugar de 10 meses
   → Tiempo al Mercado Más Rápido = Ventaja Competitiva

💰 **10-25% AHORRO DE COSTOS**
   → A través de estandarización y mejores prácticas
   → Menos retrabajo, menos caos

🎯 **2-3x MAYOR Ejecución de Estrategia**
   → De 40% a 80-90% iniciativas estratégicas ejecutadas con éxito

═══════════════════════════════════════════════════

**CÁLCULO ROI (Ejemplo del Mundo Real):**

**Empresa:** Mercado medio, 50 proyectos/año
**Presupuesto Promedio por Proyecto:** 500k€
**Cartera Total:** 25M€

**INVERSIÓN PMO:**
- 2 FTE Gerentes PMO: 200k€
- Herramientas (MS Project, PPM): 50k€
- Capacitación y Configuración: 100k€
- **TOTAL:** 350k€/año

**AHORRO PMO (conservador 15%):**
- 15% de 25M€ = **3,75M€**

**ROI:**
- (3,75M€ - 0,35M€) / 0,35M€ = **971%** 🚀
- **Punto de Equilibrio:** ¡Después de 1,4 meses!

═══════════════════════════════════════════════════

**BENEFICIOS INDIRECTOS (Invaluables):**

🧠 **Gestión del Conocimiento**
   → Las Lecciones Aprendidas NO se olvidan
   → Nuevos PMs aprenden de errores de otros

👥 **Optimización de Recursos**
   → Sin sobre/subutilización
   → Persona correcta en proyecto correcto

🎯 **Transparencia de Cartera**
   → C-Level ve panorama completo en tiempo real
   → Mejores decisiones, más rápido

🚀 **Facilitación del Cambio**
   → Organización se vuelve más ágil
   → Nuevas iniciativas implementadas más rápido

💼 **Desarrollo de Carrera**
   → Caminos de carrera PM claros
   → Mayor satisfacción de empleados

═══════════════════════════════════════════════════

**LÍNEA DE TIEMPO hasta ROI:**

**Mes 1-3:** Configuración y Victorias Rápidas
→ Costo: 100k€, Ahorro: 200k€ ✅

**Mes 4-6:** Establecer Procesos
→ Costo: 100k€, Ahorro: 500k€ ✅

**Mes 7-12:** Escalar y Optimizar
→ Costo: 150k€, Ahorro: 1,5M€ ✅

**Total Año 1:** 350k€ → **2,2M€ Ahorro = 529% ROI**

═══════════════════════════════════════════════════

**MENSAJE CLAVE para C-Level:**

Una PMO profesional se paga en **6-12 meses**.
Después del Año 2, es pura generación de beneficios.

**PERO:** ¡Solo cuando se configura correctamente!
(Ver: "¿Cómo configuro una PMO?")`
  },

  // PMO Setup
  setup: {
    de: `🚀 **PMO aufsetzen - Die ersten Schritte**

**PHASE 1: FOUNDATION (Monat 1-2)**
1. **Stakeholder Mapping**: Wer sind die Key Players?
2. **Mandate definieren**: Was darf/soll das PMO?
3. **Quick Wins identifizieren**: Was können wir SOFORT verbessern?

**PHASE 2: PROCESSES (Monat 3-4)**
1. **Projekt-Lifecycle**: Wie laufen Projekte ab?
2. **Templates erstellen**: Charters, Plans, Reports
3. **Governance-Modell**: Wer entscheidet was?

**PHASE 3: TOOLS & METRICS (Monat 5-6)**
1. **PM-Tool auswählen**: MS Project, Jira, etc.
2. **KPI-Dashboard**: Welche 5-7 Metriken tracken?
3. **Reporting-Rhythmus**: Wöchentlich? Monatlich?

**PHASE 4: SCALE (ab Monat 6)**
1. **Training & Coaching**: PM-Zertifizierungen
2. **Community aufbauen**: Lessons Learned Sessions
3. **Continuous Improvement**: Prozesse optimieren

**KRITISCHE ERFOLGSFAKTOREN:**
✅ **Executive Sponsorship**: C-Level muss dahinter stehen
✅ **Start Small**: Nicht alle Projekte auf einmal
✅ **Value First**: Zeige Benefits schnell (Quick Wins!)
✅ **Culture**: PMO ist Service-Provider, nicht Polizist!

💡 **Faustregel:** 6 Monate Setup, dann 12 Monate Ramp-up = 18 Monate bis "mature PMO"`,

    en: `🚀 **Setting up a PMO - First Steps**

**PHASE 1: FOUNDATION (Month 1-2)**
1. **Stakeholder Mapping**: Who are the key players?
2. **Define Mandate**: What can/should the PMO do?
3. **Identify Quick Wins**: What can we improve IMMEDIATELY?

**PHASE 2: PROCESSES (Month 3-4)**
1. **Project Lifecycle**: How do projects run?
2. **Create Templates**: Charters, Plans, Reports
3. **Governance Model**: Who decides what?

**PHASE 3: TOOLS & METRICS (Month 5-6)**
1. **Select PM Tool**: MS Project, Jira, etc.
2. **KPI Dashboard**: Which 5-7 metrics to track?
3. **Reporting Rhythm**: Weekly? Monthly?

**PHASE 4: SCALE (from Month 6)**
1. **Training & Coaching**: PM certifications
2. **Build Community**: Lessons Learned Sessions
3. **Continuous Improvement**: Optimize processes

**CRITICAL SUCCESS FACTORS:**
✅ **Executive Sponsorship**: C-Level must support
✅ **Start Small**: Not all projects at once
✅ **Value First**: Show benefits quickly (Quick Wins!)
✅ **Culture**: PMO is service provider, not police!

💡 **Rule of Thumb:** 6 months setup, then 12 months ramp-up = 18 months to "mature PMO"`,

    es: `🚀 **Configurar una PMO - Primeros Pasos**

**FASE 1: FUNDACIÓN (Mes 1-2)**
1. **Mapeo de Stakeholders**: ¿Quiénes son los jugadores clave?
2. **Definir Mandato**: ¿Qué puede/debe hacer la PMO?
3. **Identificar Victorias Rápidas**: ¿Qué podemos mejorar YA?

**FASE 2: PROCESOS (Mes 3-4)**
1. **Ciclo de Vida del Proyecto**: ¿Cómo funcionan los proyectos?
2. **Crear Plantillas**: Charters, Planes, Informes
3. **Modelo de Gobernanza**: ¿Quién decide qué?

**FASE 3: HERRAMIENTAS Y MÉTRICAS (Mes 5-6)**
1. **Seleccionar Herramienta PM**: MS Project, Jira, etc.
2. **Panel KPI**: ¿Qué 5-7 métricas rastrear?
3. **Ritmo de Informes**: ¿Semanal? ¿Mensual?

**FASE 4: ESCALAR (desde Mes 6)**
1. **Capacitación y Coaching**: Certificaciones PM
2. **Construir Comunidad**: Sesiones de Lecciones Aprendidas
3. **Mejora Continua**: Optimizar procesos

**FACTORES CRÍTICOS DE ÉXITO:**
✅ **Patrocinio Ejecutivo**: C-Level debe apoyar
✅ **Comenzar Pequeño**: No todos los proyectos a la vez
✅ **Valor Primero**: Mostrar beneficios rápido (¡Victorias Rápidas!)
✅ **Cultura**: ¡PMO es proveedor de servicios, no policía!

💡 **Regla General:** 6 meses configuración, luego 12 meses crecimiento = 18 meses hasta "PMO madura"`
  },

  // Best Practices
  bestpractices: {
    de: `⭐ **PMO Best Practices**

**1. GOVERNANCE & STRUCTURE**
- 🎯 PMO-Charter mit klarem Mandate
- 📋 Standardisierte Projektklassifizierung (S/M/L)
- 🔄 Stage-Gate Prozess mit klaren Decision Points

**2. STAKEHOLDER MANAGEMENT**
- 👥 Monatlicher Steering Committee
- 📊 Executive Dashboard (1 Seite, 5 KPIs)
- 🗣️ Regelmäßige PM Community Calls

**3. RESSOURCEN-MANAGEMENT**
- 📅 Zentrale Ressourcenplanung
- 🎯 Skill-Matrix aller Mitarbeiter
- ⚖️ Capacity Planning (3-6 Monate voraus)

**4. RISIKO-MANAGEMENT**
- 🚨 Projekt-Health-Checks (Red/Amber/Green)
- 📈 Trend-Analyse über Portfolio
- 🔔 Early Warning System (automatisiert)

**5. KNOWLEDGE MANAGEMENT**
- 📚 Lessons Learned Database
- 🎓 PM Training & Zertifizierungen
- 🏆 Best Practice Sharing Sessions

**6. KONTINUIERLICHE VERBESSERUNG**
- 📊 Quarterly PMO Reviews
- 🔄 Prozess-Optimierung basierend auf Feedback
- 🎯 OKRs für das PMO selbst!

**DIE GOLDENE REGEL:**
📌 **"Value first, Process second"**
→ Wenn ein Prozess keinen Mehrwert liefert: WEG DAMIT!

**ANTI-PATTERNS (vermeiden!):**
❌ PMO als "Project Police"
❌ Zu viel Bürokratie (Forms, Forms, Forms...)
❌ Keine Flexibilität (One Size Fits All)
❌ Keine Erfolgsmessung (Wir machen das schon...)`,

    en: `⭐ **PMO Best Practices**

**1. GOVERNANCE & STRUCTURE**
- 🎯 PMO Charter with clear mandate
- 📋 Standardized project classification (S/M/L)
- 🔄 Stage-Gate process with clear decision points

**2. STAKEHOLDER MANAGEMENT**
- 👥 Monthly Steering Committee
- 📊 Executive Dashboard (1 page, 5 KPIs)
- 🗣️ Regular PM Community Calls

**3. RESOURCE MANAGEMENT**
- 📅 Central resource planning
- 🎯 Skill matrix of all employees
- ⚖️ Capacity planning (3-6 months ahead)

**4. RISK MANAGEMENT**
- 🚨 Project health checks (Red/Amber/Green)
- 📈 Trend analysis across portfolio
- 🔔 Early warning system (automated)

**5. KNOWLEDGE MANAGEMENT**
- 📚 Lessons Learned Database
- 🎓 PM Training & Certifications
- 🏆 Best Practice Sharing Sessions

**6. CONTINUOUS IMPROVEMENT**
- 📊 Quarterly PMO Reviews
- 🔄 Process optimization based on feedback
- 🎯 OKRs for the PMO itself!

**THE GOLDEN RULE:**
📌 **"Value first, Process second"**
→ If a process doesn't deliver value: GET RID OF IT!

**ANTI-PATTERNS (avoid!):**
❌ PMO as "Project Police"
❌ Too much bureaucracy (Forms, Forms, Forms...)
❌ No flexibility (One Size Fits All)
❌ No success measurement (We're doing fine...)`,

    es: `⭐ **Mejores Prácticas PMO**

**1. GOBERNANZA Y ESTRUCTURA**
- 🎯 Charter PMO con mandato claro
- 📋 Clasificación estandarizada de proyectos (S/M/L)
- 🔄 Proceso Stage-Gate con puntos de decisión claros

**2. GESTIÓN DE STAKEHOLDERS**
- 👥 Comité de Dirección mensual
- 📊 Panel Ejecutivo (1 página, 5 KPIs)
- 🗣️ Llamadas regulares de Comunidad PM

**3. GESTIÓN DE RECURSOS**
- 📅 Planificación central de recursos
- 🎯 Matriz de habilidades de empleados
- ⚖️ Planificación de capacidad (3-6 meses adelante)

**4. GESTIÓN DE RIESGOS**
- 🚨 Controles de salud del proyecto (Rojo/Ámbar/Verde)
- 📈 Análisis de tendencias en cartera
- 🔔 Sistema de alerta temprana (automatizado)

**5. GESTIÓN DEL CONOCIMIENTO**
- 📚 Base de datos de Lecciones Aprendidas
- 🎓 Capacitación y Certificaciones PM
- 🏆 Sesiones de Compartir Mejores Prácticas

**6. MEJORA CONTINUA**
- 📊 Revisiones trimestrales PMO
- 🔄 Optimización de procesos basada en feedback
- 🎯 ¡OKRs para la PMO misma!

**LA REGLA DE ORO:**
📌 **"Valor primero, Proceso segundo"**
→ Si un proceso no entrega valor: ¡ELIMÍNALO!

**ANTI-PATRONES (¡evitar!):**
❌ PMO como "Policía de Proyectos"
❌ Demasiada burocracia (Formularios, Formularios...)
❌ Sin flexibilidad (Talla Única Para Todos)
❌ Sin medición de éxito (Estamos bien...)`
  }
};

/**
 * Erkennt, welche Frage gestellt wurde und gibt die passende Antwort zurück
 */
export function matchPMOQuestion(question: string): keyof typeof PMO_KNOWLEDGE | null {
  const q = question.toLowerCase();
  
  // KPI-Fragen
  if (q.match(/kpi|kennzahl|metr|indicator|wichtigst.*pmo/i)) {
    return 'kpis';
  }
  
  // Value/Nutzen-Fragen
  if (q.match(/wert|nutzen|benefit|value|roi|warum.*pmo|lohnt.*sich|business.*case/i)) {
    return 'value';
  }
  
  // Setup/Implementierung-Fragen
  if (q.match(/aufsetzen|implementier|starten|setup|start|aufbau|wie.*pmo.*anfang|first.*step/i)) {
    return 'setup';
  }
  
  // Best Practices
  if (q.match(/best.*practice|empfehlung|tip|erfolg|wie.*macht.*man|dos.*don/i)) {
    return 'bestpractices';
  }
  
  return null;
}

