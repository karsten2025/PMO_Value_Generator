/**
 * System Guide Responses
 * 
 * Vordefinierte Antworten für Tutorial-Bot
 * Pattern Matching für Commands: /tour, /help, /input, /output, /nutzen
 */

export type Language = 'DE' | 'EN' | 'ES';

export interface SystemResponse {
  de: string;
  en: string;
  es: string;
}

export const SYSTEM_PATTERNS = {
  tour: /\/tour|tour|tutorial|anleitung|wie bedien|führung|guide me|guía|cómo usar|how.*use.*tool|wie.*tool.*bedien/i,
  help: /\/help|hilfe|befehle|commands|comandos|what.*can.*do|was.*kannst.*du/i,
  input: /\/input|was kann ich eingeben|welche daten|what can i enter|qué puedo ingresar|eingabe|what.*data|welche.*werte/i,
  output: /\/output|was bekomme ich|ergebnis|what do i get|resultado|outcome|qué obtengo|what.*result|welche.*ergebnis/i,
  nutzen: /\/nutzen|wozu|warum|business case|roi|value|benefit|valor|utilidad|why.*tool|warum.*tool|wofür/i,
  beispiel: /\/beispiel|use case|example|ejemplo|anwendung|how.*use|wie.*verwend/i,
  // Tool-specific questions
  language: /sprache.*wechsel|change.*language|cambiar.*idioma|language.*switch|wie.*sprache/i,
  impactscore: /impact.*score|was.*impact|what.*impact|qué.*impact|75%|health.*score/i,
  cycle: /impact.*cycle|was.*cycle|flywheel|value.*ring|10.*steps|milestones/i,
};

export const SYSTEM_RESPONSES: Record<string, SystemResponse> = {
  welcome: {
    de: `👋 **Hi! Ich bin dein PMO-Assistent!**

Ich kann dir auf **2 Arten** helfen:

═══════════════════════════════════════════════════

📚 **PMO-Wissen:** Frag mich über Projektmanagement, KPIs, Best Practices
   _Beispiel: "Was sind die wichtigsten PMO KPIs?"_

═══════════════════════════════════════════════════

🎓 **System-Tutorial:** Ich erkläre dir, wie dieses Tool funktioniert

**Verfügbare Commands:**

\`/tour\`
   → Geführte Tour durch alle Features
   → Schritt-für-Schritt Einführung ins Tool

\`/input\`
   → Was kann ich eingeben?
   → Portfolios, KPIs, Werte

\`/output\`
   → Was bekomme ich als Ergebnis?
   → Health Score, Reports, Insights

\`/nutzen\`
   → Warum ist das Tool wertvoll?
   → Business Case & ROI

\`/help\`
   → Alle Commands im Detail

═══════════════════════════════════════════════════

Was möchtest du wissen?`,
    
    en: `👋 **Hi! I'm your PMO Assistant!**

I can help you in **2 ways**:

═══════════════════════════════════════════════════

📚 **PMO Knowledge:** Ask me about project management, KPIs, best practices
   _Example: "What are the most important PMO KPIs?"_

═══════════════════════════════════════════════════

🎓 **System Tutorial:** I'll explain how this tool works

**Available Commands:**

\`/tour\`
   → Guided tour through all features
   → Step-by-step introduction to the tool

\`/input\`
   → What can I enter?
   → Portfolios, KPIs, values

\`/output\`
   → What do I get as results?
   → Health score, reports, insights

\`/nutzen\`
   → Why is this tool valuable?
   → Business case & ROI

\`/help\`
   → All commands in detail

═══════════════════════════════════════════════════

What would you like to know?`,
    
    es: `👋 **¡Hola! Soy tu Asistente PMO!**

Puedo ayudarte de **2 formas**:

═══════════════════════════════════════════════════

📚 **Conocimiento PMO:** Pregúntame sobre gestión de proyectos, KPIs, mejores prácticas
   _Ejemplo: "¿Cuáles son los KPIs más importantes de PMO?"_

═══════════════════════════════════════════════════

🎓 **Tutorial del Sistema:** Te explico cómo funciona esta herramienta

**Comandos Disponibles:**

\`/tour\`
   → Tour guiado por todas las funciones
   → Introducción paso a paso a la herramienta

\`/input\`
   → ¿Qué puedo ingresar?
   → Carteras, KPIs, valores

\`/output\`
   → ¿Qué obtengo como resultados?
   → Puntuación de salud, informes, insights

\`/nutzen\`
   → ¿Por qué es valiosa esta herramienta?
   → Caso de negocio y ROI

\`/help\`
   → Todos los comandos en detalle

═══════════════════════════════════════════════════

¿Qué te gustaría saber?`
  },

  tour: {
    de: `🎬 **WILLKOMMEN ZUM PMO VALUE GENERATOR!**

═══════════════════════════════════════════════════

📍 **SCHRITT 1: DAS PORTFOLIO HEALTH HUB**
   → Siehst du die bunten konzentrischen Kreise? Das ist dein Dashboard!
   
   🔵 **Blau (STR):** Strategische Ziele - Wie gut sind Projekte mit Unternehmensstrategie aligned?
   🟠 **Orange (TAC):** Taktische Ausrichtung - Werden Ressourcen optimal eingesetzt?
   🟢 **Grün (OPS):** Operative Effizienz - Laufen Projekte reibungslos?
   
   💜 **Mitte (75%):** Gesamt-Impact-Score über alle Projekte
   
   💡 _Klick drauf → Sidebar mit allen Projekten öffnet sich_

═══════════════════════════════════════════════════

📍 **SCHRITT 2: DER IMPACT CYCLE (10 MILESTONES)**
   → Die 10 Knotenpunkte rund um den Health Hub
   
   Jeder repräsentiert einen PMO-Prozessschritt:
   - Awareness & Education
   - Requirements Discovery
   - Benefit Definition
   - Solution Design
   - ... und 6 weitere
   
   💡 _Klick einen an → Sidebar zeigt Details + zugehörige KPIs_
   
   Grüner Fortschrittsring = Wie weit bist du in diesem Schritt?

═══════════════════════════════════════════════════

📍 **SCHRITT 3: PROJEKTE & KPIs VERWALTEN**
   → Oben rechts: Button **"Projects"** View
   
   - Siehst du alle Projekte deines Portfolios
   - Klick auf Projekt → Alle KPIs im Detail
   - **Target** vs. **Current** → Fortschritt tracken
   - Achievement % wird automatisch berechnet

═══════════════════════════════════════════════════

📍 **SCHRITT 4: SPRACHE & REGISTER**
   → Oben rechts: **DE/EN/ES** + **Normal/Management**
   
   - Wähle deine Sprache
   - **Normal:** Einfache Sprache (für alle)
   - **Management:** Profi-Terminologie (für C-Level)
   - Alle Texte ändern sich sofort!

═══════════════════════════════════════════════════

💬 Möchtest du zu einem Thema mehr wissen?
   • \`/input\` - Was kann ich eingeben?
   • \`/output\` - Was bekomme ich raus?
   • \`/nutzen\` - Wozu ist das gut?
   • \`/help\` - Alle Commands`,

    en: `🎬 **WELCOME TO PMO VALUE GENERATOR!**

═══════════════════════════════════════════════════

📍 **STEP 1: THE PORTFOLIO HEALTH HUB**
   → See those colorful concentric circles? That's your dashboard!
   
   🔵 **Blue (STR):** Strategic Goals - How well are projects aligned with company strategy?
   🟠 **Orange (TAC):** Tactical Alignment - Are resources optimally deployed?
   🟢 **Green (OPS):** Operational Efficiency - Are projects running smoothly?
   
   💜 **Center (75%):** Total Impact Score across all projects
   
   💡 _Click on it → Sidebar with all projects opens_

═══════════════════════════════════════════════════

📍 **STEP 2: THE IMPACT CYCLE (10 MILESTONES)**
   → The 10 nodes around the Health Hub
   
   Each represents a PMO process step:
   - Awareness & Education
   - Requirements Discovery
   - Benefit Definition
   - Solution Design
   - ... and 6 more
   
   💡 _Click one → Sidebar shows details + related KPIs_
   
   Green progress ring = How far are you in this step?

═══════════════════════════════════════════════════

📍 **STEP 3: MANAGE PROJECTS & KPIs**
   → Top right: **"Projects"** View button
   
   - See all projects in your portfolio
   - Click project → All KPIs in detail
   - **Target** vs. **Current** → Track progress
   - Achievement % calculated automatically

═══════════════════════════════════════════════════

📍 **STEP 4: LANGUAGE & REGISTER**
   → Top right: **DE/EN/ES** + **Normal/Management**
   
   - Choose your language
   - **Normal:** Simple language (for everyone)
   - **Management:** Professional terminology (for C-Level)
   - All texts change instantly!

═══════════════════════════════════════════════════

💬 Want to know more about a topic?
   • \`/input\` - What can I enter?
   • \`/output\` - What do I get?
   • \`/nutzen\` - What's the benefit?
   • \`/help\` - All commands`,

    es: `🎬 **¡BIENVENIDO AL PMO VALUE GENERATOR!**

═══════════════════════════════════════════════════

📍 **PASO 1: EL PORTFOLIO HEALTH HUB**
   → ¿Ves esos círculos concéntricos de colores? ¡Es tu panel de control!
   
   🔵 **Azul (STR):** Objetivos Estratégicos - ¿Qué tan bien están alineados los proyectos?
   🟠 **Naranja (TAC):** Alineación Táctica - ¿Se usan los recursos de forma óptima?
   🟢 **Verde (OPS):** Eficiencia Operativa - ¿Los proyectos funcionan sin problemas?
   
   💜 **Centro (75%):** Puntuación de Impacto Total de todos los proyectos
   
   💡 _Haz clic → Barra lateral con todos los proyectos se abre_

═══════════════════════════════════════════════════

📍 **PASO 2: EL CICLO DE IMPACTO (10 HITOS)**
   → Los 10 nodos alrededor del Health Hub
   
   Cada uno representa un paso del proceso PMO:
   - Concienciación y Educación
   - Descubrimiento de Requisitos
   - Definición de Beneficios
   - Diseño de Soluciones
   - ... y 6 más
   
   💡 _Haz clic en uno → La barra lateral muestra detalles + KPIs_
   
   Anillo de progreso verde = ¿Qué tan avanzado estás en este paso?

═══════════════════════════════════════════════════

📍 **PASO 3: GESTIONAR PROYECTOS Y KPIs**
   → Arriba a la derecha: Botón de vista **"Projects"**
   
   - Ve todos los proyectos de tu cartera
   - Haz clic en proyecto → Todos los KPIs en detalle
   - **Target** vs. **Current** → Rastrea progreso
   - % de logro calculado automáticamente

═══════════════════════════════════════════════════

📍 **PASO 4: IDIOMA Y REGISTRO**
   → Arriba a la derecha: **DE/EN/ES** + **Normal/Management**
   
   - Elige tu idioma
   - **Normal:** Lenguaje simple (para todos)
   - **Management:** Terminología profesional (para C-Level)
   - ¡Todos los textos cambian instantáneamente!

═══════════════════════════════════════════════════

💬 ¿Quieres saber más sobre un tema?
   • \`/input\` - ¿Qué puedo ingresar?
   • \`/output\` - ¿Qué obtengo?
   • \`/nutzen\` - ¿Cuál es el beneficio?
   • \`/help\` - Todos los comandos`
  },

  help: {
    de: `📖 **HILFE: VERFÜGBARE COMMANDS**

═══════════════════════════════════════════════════

🎓 **System-Tutorial Commands:**

\`/tour\`
   → Geführte Tour durch alle Features des Tools
   → Zeigt dir Schritt für Schritt, wie das Tool funktioniert

\`/help\`
   → Diese Hilfe (du bist hier!)
   → Übersicht aller verfügbaren Befehle

\`/input\`
   → Erklärt, welche Daten du eingeben kannst
   → Portfolios, KPIs, Target/Current Values

\`/output\`
   → Zeigt, welche Ergebnisse du erhältst
   → Portfolio Health Score, KPI-Tracking, Reports

\`/nutzen\`
   → Business Case & ROI des Tools
   → Warum ist das Tool für dich wertvoll?

\`/beispiel\`
   → Praxis-Anwendungen & Use Cases
   → 5 konkrete Beispiele aus der Praxis

═══════════════════════════════════════════════════

📚 **PMO-Wissen (Freitext):**
   Stelle einfach deine Frage in natürlicher Sprache!
   
   _Beispiele:_
   • "Was sind die wichtigsten PMO KPIs?"
   • "Erkläre mir Process Mining einfach"
   • "Wie messe ich Projekt-ROI?"
   • "Welche Governance-Strukturen braucht ein PMO?"

💡 **TIPP:** Du kannst auf Deutsch, Englisch oder Spanisch fragen!

═══════════════════════════════════════════════════

🔧 **Technischer Support:**
   • GitHub: github.com/karsten2025/PMO_Value_Generator
   • Docs: Siehe README.md im Projekt`,

    en: `📖 **HELP: AVAILABLE COMMANDS**

═══════════════════════════════════════════════════

🎓 **System Tutorial Commands:**

\`/tour\`
   → Guided tour through all tool features
   → Step-by-step walkthrough of how the tool works

\`/help\`
   → This help (you are here!)
   → Overview of all available commands

\`/input\`
   → Explains what data you can enter
   → Portfolios, KPIs, Target/Current Values

\`/output\`
   → Shows what results you get
   → Portfolio Health Score, KPI tracking, reports

\`/nutzen\`
   → Business case & ROI of the tool
   → Why is this tool valuable for you?

\`/beispiel\`
   → Practical applications & use cases
   → 5 real-world examples

═══════════════════════════════════════════════════

📚 **PMO Knowledge (Free Text):**
   Just ask your question in natural language!
   
   _Examples:_
   • "What are the most important PMO KPIs?"
   • "Explain process mining simply"
   • "How do I measure project ROI?"
   • "What governance structures does a PMO need?"

💡 **TIP:** You can ask in German, English, or Spanish!

═══════════════════════════════════════════════════

🔧 **Technical Support:**
   • GitHub: github.com/karsten2025/PMO_Value_Generator
   • Docs: See README.md in project`,

    es: `📖 **AYUDA: COMANDOS DISPONIBLES**

═══════════════════════════════════════════════════

🎓 **Comandos de Tutorial del Sistema:**

\`/tour\`
   → Tour guiado por todas las funciones
   → Recorrido paso a paso de cómo funciona la herramienta

\`/help\`
   → Esta ayuda (¡estás aquí!)
   → Resumen de todos los comandos disponibles

\`/input\`
   → Explica qué datos puedes ingresar
   → Carteras, KPIs, valores objetivo/actuales

\`/output\`
   → Muestra qué resultados obtienes
   → Puntuación de salud de cartera, seguimiento de KPI, informes

\`/nutzen\`
   → Caso de negocio y ROI de la herramienta
   → ¿Por qué es valiosa esta herramienta para ti?

\`/beispiel\`
   → Aplicaciones prácticas y casos de uso
   → 5 ejemplos del mundo real

═══════════════════════════════════════════════════

📚 **Conocimiento PMO (Texto Libre):**
   ¡Simplemente haz tu pregunta en lenguaje natural!
   
   _Ejemplos:_
   • "¿Cuáles son los KPIs más importantes de PMO?"
   • "Explica la minería de procesos de forma simple"
   • "¿Cómo mido el ROI del proyecto?"
   • "¿Qué estructuras de gobernanza necesita una PMO?"

💡 **CONSEJO:** ¡Puedes preguntar en alemán, inglés o español!

═══════════════════════════════════════════════════

🔧 **Soporte Técnico:**
   • GitHub: github.com/karsten2025/PMO_Value_Generator
   • Docs: Ver README.md en el proyecto`
  },

  input: {
    de: `📥 **INPUT: WAS KANNST DU IM TOOL MACHEN?**

═══════════════════════════════════════════════════

1️⃣ **PORTFOLIO AUSWÄHLEN**
   → Dropdown oben links
   → Wähle z.B. "IT-Strategie 2025"
   → Alle Daten werden für dieses Portfolio geladen

2️⃣ **KPI-WERTE EINGEBEN**
   → Klick auf **Milestone** im Impact Cycle ODER
   → Klick auf **Projekt** in der Projects-Liste
   → Sidebar öffnet sich rechts
   
   **Eingabe pro KPI:**
   • **Target Value** (Zielwert): Was willst du erreichen?
   • **Current Value** (Ist-Wert): Wo stehst du aktuell?
   
   → System berechnet automatisch **Achievement %**

3️⃣ **SPRACHE & REGISTER WÄHLEN**
   → Oben rechts: **DE / EN / ES**
   → Oben rechts: **Normal / Management**
   
   **Normal:** Einfache Sprache ohne Fachbegriffe
   **Management:** Professionelle PM-Terminologie
   
   → Alle Texte ändern sich sofort live!

4️⃣ **VIEW UMSCHALTEN**
   → Button "Cycle" → Impact Cycle Visualisierung
   → Button "Projects" → Projekt-Liste mit Details

5️⃣ **CHATBOT NUTZEN**
   → Das bin ich! 😊
   → Button "AI Assistant" oben rechts
   → Frag mich alles über PMO oder das Tool

═══════════════════════════════════════════════════

💾 **SPEICHERUNG:**
   Alle Eingaben werden lokal im Browser gespeichert (LocalStorage)
   → Keine Sorge um Datenverlust beim Reload!

📊 **DUMMY-DATEN:**
   Das Tool kommt mit 6 Beispiel-Projekten
   → Perfekt zum Ausprobieren!
   → Später kannst du echte Daten verbinden (Supabase)`,

    en: `📥 **INPUT: WHAT CAN YOU DO IN THE TOOL?**

═══════════════════════════════════════════════════

1️⃣ **SELECT PORTFOLIO**
   → Dropdown top left
   → Choose e.g., "IT Strategy 2025"
   → All data loaded for this portfolio

2️⃣ **ENTER KPI VALUES**
   → Click on **Milestone** in Impact Cycle OR
   → Click on **Project** in Projects list
   → Sidebar opens on the right
   
   **Input per KPI:**
   • **Target Value**: What do you want to achieve?
   • **Current Value**: Where are you now?
   
   → System automatically calculates **Achievement %**

3️⃣ **CHOOSE LANGUAGE & REGISTER**
   → Top right: **DE / EN / ES**
   → Top right: **Normal / Management**
   
   **Normal:** Simple language without jargon
   **Management:** Professional PM terminology
   
   → All texts change instantly live!

4️⃣ **SWITCH VIEW**
   → Button "Cycle" → Impact Cycle Visualization
   → Button "Projects" → Project list with details

5️⃣ **USE CHATBOT**
   → That's me! 😊
   → Button "AI Assistant" top right
   → Ask me anything about PMO or the tool

═══════════════════════════════════════════════════

💾 **STORAGE:**
   All inputs saved locally in browser (LocalStorage)
   → No worry about data loss on reload!

📊 **DUMMY DATA:**
   Tool comes with 6 example projects
   → Perfect for trying out!
   → Later you can connect real data (Supabase)`,

    es: `📥 **ENTRADA: ¿QUÉ PUEDES HACER EN LA HERRAMIENTA?**

═══════════════════════════════════════════════════

1️⃣ **SELECCIONAR CARTERA**
   → Menú desplegable arriba a la izquierda
   → Elige p. ej., "Estrategia TI 2025"
   → Todos los datos cargados para esta cartera

2️⃣ **INGRESAR VALORES DE KPI**
   → Haz clic en **Hito** en el Ciclo de Impacto O
   → Haz clic en **Proyecto** en la lista de Proyectos
   → Barra lateral se abre a la derecha
   
   **Entrada por KPI:**
   • **Target Value**: ¿Qué quieres lograr?
   • **Current Value**: ¿Dónde estás ahora?
   
   → Sistema calcula automáticamente **% de Logro**

3️⃣ **ELEGIR IDIOMA Y REGISTRO**
   → Arriba a la derecha: **DE / EN / ES**
   → Arriba a la derecha: **Normal / Management**
   
   **Normal:** Lenguaje simple sin jerga
   **Management:** Terminología PM profesional
   
   → ¡Todos los textos cambian instantáneamente en vivo!

4️⃣ **CAMBIAR VISTA**
   → Botón "Cycle" → Visualización del Ciclo de Impacto
   → Botón "Projects" → Lista de proyectos con detalles

5️⃣ **USAR CHATBOT**
   → ¡Ese soy yo! 😊
   → Botón "AI Assistant" arriba a la derecha
   → Pregúntame cualquier cosa sobre PMO o la herramienta

═══════════════════════════════════════════════════

💾 **ALMACENAMIENTO:**
   Todas las entradas guardadas localmente en el navegador (LocalStorage)
   → ¡No te preocupes por la pérdida de datos al recargar!

📊 **DATOS DE EJEMPLO:**
   La herramienta viene con 6 proyectos de ejemplo
   → ¡Perfecto para probar!
   → Luego puedes conectar datos reales (Supabase)`
  },

  output: {
    de: `📤 **OUTPUT: WAS BEKOMMST DU ALS ERGEBNIS?**

═══════════════════════════════════════════════════

1️⃣ **PORTFOLIO HEALTH SCORE (z.B. 75%)**
   ✅ Aggregierter Impact-Score über alle Projekte
   ✅ Aufgeteilt in 3 Dimensionen:
   
   🔵 **STR (Strategic):** Strategische Ausrichtung
      → Sind Projekte mit Unternehmensstrategie aligned?
      
   🟠 **TAC (Tactical):** Taktische Effizienz
      → Werden Ressourcen optimal eingesetzt?
      
   🟢 **OPS (Operational):** Operative Exzellenz
      → Laufen Prozesse reibungslos?
   
   ✅ **Echtzeit-Berechnung** bei jeder KPI-Änderung

═══════════════════════════════════════════════════

2️⃣ **PROJEKT-LEVEL INSIGHTS**
   Für jedes Projekt siehst du:
   
   📊 **Achievement %** pro Projekt
      → Durchschnitt aller KPIs
      
   📈 **KPI-Tracking** mit Progress Bars
      → Target vs. Current visuell
      
   ⚠️ **Risk Level** (Low/Medium/High)
      → Automatisch berechnet aus Achievement
      
   💎 **Impact Score** (0-100)
      → Strategischer Wert des Projekts

═══════════════════════════════════════════════════

3️⃣ **MILESTONE COMPLETION**
   Die 10 PMO-Prozessschritte visualisiert:
   
   🟢 **Grüner Fortschrittsring** (0-100%)
      → Zeigt: Wie weit bist du in diesem Schritt?
      
   📝 **KPI-Liste pro Milestone**
      → Welche KPIs gehören zu diesem Schritt?
      
   ✅ **Gesamt-Reifegrad**
      → Durchschnitt über alle 10 Milestones
      → Zeigt PMO-Reife auf einen Blick

═══════════════════════════════════════════════════

4️⃣ **MULTI-LANGUAGE REPORTS**
   Alle Daten in **3 Sprachen** × **2 Registern**:
   
   🇩🇪 **Deutsch:**
      • Colloquial: "Das PMO hilft Teams..."
      • Management: "Strategische PMO-Governance..."
      
   🇬🇧 **English:**
      • Colloquial: "The PMO helps teams..."
      • Management: "Strategic PMO governance..."
      
   🇪🇸 **Español:**
      • Colloquial: "La PMO ayuda a equipos..."
      • Management: "Gobernanza estratégica de PMO..."
   
   → **1 Klick** und alle Texte ändern sich!

═══════════════════════════════════════════════════

5️⃣ **KI-GESTÜTZTE INSIGHTS**
   Dein Chatbot-Assistent liefert:
   
   🤖 **Antworten** aus professionellem PMO-Wissen
      → 1000+ Seiten PMO-Wissen sofort verfügbar
      
   💡 **Best Practices** & Empfehlungen
      → Kontextabhängig für deine Situation
      
   📚 **Quellenangaben**
      → Jede Antwort mit Referenz zum Guide

═══════════════════════════════════════════════════

🎯 **ZUSAMMENGEFASST:**
   Du bekommst ein **Live-Dashboard** mit:
   • Echtzeit Portfolio Health (75%)
   • Projekt-Level KPI-Tracking
   • PMO-Reifegrad-Visualisierung
   • Multi-Language Support
   • KI-Coach für PMO-Fragen

📊 **EXPORT (Coming Soon):**
   • PDF-Report generieren
   • Excel-Export für Stakeholder
   • PowerPoint-Slides für Management`,

    en: `📤 **OUTPUT: WHAT DO YOU GET AS A RESULT?**

═══════════════════════════════════════════════════

1️⃣ **PORTFOLIO HEALTH SCORE (e.g., 75%)**
   ✅ Aggregated impact score across all projects
   ✅ Split into 3 dimensions:
   
   🔵 **STR (Strategic):** Strategic Alignment
      → Are projects aligned with company strategy?
      
   🟠 **TAC (Tactical):** Tactical Efficiency
      → Are resources optimally deployed?
      
   🟢 **OPS (Operational):** Operational Excellence
      → Do processes run smoothly?
   
   ✅ **Real-time calculation** with every KPI change

═══════════════════════════════════════════════════

2️⃣ **PROJECT-LEVEL INSIGHTS**
   For each project you see:
   
   📊 **Achievement %** per project
      → Average of all KPIs
      
   📈 **KPI Tracking** with progress bars
      → Target vs. Current visual
      
   ⚠️ **Risk Level** (Low/Medium/High)
      → Automatically calculated from achievement
      
   💎 **Impact Score** (0-100)
      → Strategic value of project

═══════════════════════════════════════════════════

3️⃣ **MILESTONE COMPLETION**
   The 10 PMO process steps visualized:
   
   🟢 **Green progress ring** (0-100%)
      → Shows: How far are you in this step?
      
   📝 **KPI list per milestone**
      → Which KPIs belong to this step?
      
   ✅ **Overall maturity**
      → Average across all 10 milestones
      → Shows PMO maturity at a glance

═══════════════════════════════════════════════════

4️⃣ **MULTI-LANGUAGE REPORTS**
   All data in **3 languages** × **2 registers**:
   
   🇩🇪 **German:**
      • Colloquial: "Das PMO hilft Teams..."
      • Management: "Strategische PMO-Governance..."
      
   🇬🇧 **English:**
      • Colloquial: "The PMO helps teams..."
      • Management: "Strategic PMO governance..."
      
   🇪🇸 **Spanish:**
      • Colloquial: "La PMO ayuda a equipos..."
      • Management: "Gobernanza estratégica de PMO..."
   
   → **1 click** and all texts change!

═══════════════════════════════════════════════════

5️⃣ **AI-POWERED INSIGHTS**
   Your chatbot assistant delivers:
   
   🤖 **Answers** from professional PMO knowledge
      → 1000+ pages of PMO knowledge instantly available
      
   💡 **Best practices** & recommendations
      → Context-dependent for your situation
      
   📚 **Source citations**
      → Every answer with reference to guide

═══════════════════════════════════════════════════

🎯 **IN SUMMARY:**
   You get a **live dashboard** with:
   • Real-time portfolio health (75%)
   • Project-level KPI tracking
   • PMO maturity visualization
   • Multi-language support
   • AI coach for PMO questions

📊 **EXPORT (Coming Soon):**
   • Generate PDF report
   • Excel export for stakeholders
   • PowerPoint slides for management`,

    es: `📤 **SALIDA: ¿QUÉ OBTIENES COMO RESULTADO?**

═══════════════════════════════════════════════════

1️⃣ **PUNTUACIÓN DE SALUD DE CARTERA (p. ej., 75%)**
   ✅ Puntuación de impacto agregada en todos los proyectos
   ✅ Dividida en 3 dimensiones:
   
   🔵 **STR (Estratégico):** Alineación Estratégica
      → ¿Los proyectos están alineados con la estrategia de la empresa?
      
   🟠 **TAC (Táctico):** Eficiencia Táctica
      → ¿Los recursos se implementan de manera óptima?
      
   🟢 **OPS (Operativo):** Excelencia Operativa
      → ¿Los procesos funcionan sin problemas?
   
   ✅ **Cálculo en tiempo real** con cada cambio de KPI

═══════════════════════════════════════════════════

2️⃣ **INFORMACIÓN A NIVEL DE PROYECTO**
   Para cada proyecto ves:
   
   📊 **% de Logro** por proyecto
      → Promedio de todos los KPIs
      
   📈 **Seguimiento de KPI** con barras de progreso
      → Target vs. Current visual
      
   ⚠️ **Nivel de Riesgo** (Bajo/Medio/Alto)
      → Calculado automáticamente del logro
      
   💎 **Puntuación de Impacto** (0-100)
      → Valor estratégico del proyecto

═══════════════════════════════════════════════════

3️⃣ **COMPLETACIÓN DE HITOS**
   Los 10 pasos del proceso PMO visualizados:
   
   🟢 **Anillo de progreso verde** (0-100%)
      → Muestra: ¿Qué tan avanzado estás en este paso?
      
   📝 **Lista de KPI por hito**
      → ¿Qué KPIs pertenecen a este paso?
      
   ✅ **Madurez general**
      → Promedio en todos los 10 hitos
      → Muestra madurez PMO de un vistazo

═══════════════════════════════════════════════════

4️⃣ **INFORMES MULTILINGÜES**
   Todos los datos en **3 idiomas** × **2 registros**:
   
   🇩🇪 **Alemán:**
      • Coloquial: "Das PMO hilft Teams..."
      • Gestión: "Strategische PMO-Governance..."
      
   🇬🇧 **Inglés:**
      • Coloquial: "The PMO helps teams..."
      • Gestión: "Strategic PMO governance..."
      
   🇪🇸 **Español:**
      • Coloquial: "La PMO ayuda a equipos..."
      • Gestión: "Gobernanza estratégica de PMO..."
   
   → ¡**1 clic** y todos los textos cambian!

═══════════════════════════════════════════════════

5️⃣ **INFORMACIÓN IMPULSADA POR IA**
   Tu asistente de chatbot entrega:
   
   🤖 **Respuestas** de 10 Guías de Práctica PMI
      → 1000+ páginas de conocimiento PMO disponible instantáneamente
      
   💡 **Mejores prácticas** y recomendaciones
      → Dependiente del contexto para tu situación
      
   📚 **Citas de fuentes**
      → Cada respuesta con referencia a la guía

═══════════════════════════════════════════════════

🎯 **EN RESUMEN:**
   Obtienes un **panel en vivo** con:
   • Salud de cartera en tiempo real (75%)
   • Seguimiento de KPI a nivel de proyecto
   • Visualización de madurez PMO
   • Soporte multilingüe
   • Coach de IA para preguntas PMO

📊 **EXPORTAR (Próximamente):**
   • Generar informe PDF
   • Exportación Excel para interesados
   • Diapositivas PowerPoint para gestión`
  },

  nutzen: {
    de: `💰 **NUTZEN: WARUM PMO VALUE GENERATOR?**

═══════════════════════════════════════════════════
🎯 **DAS PROBLEM (ohne Tool):**

❌ PMO-Wert schwer messbar
   → Management fragt: "Wozu brauchen wir euch?"
   → Kein Nachweis über Impact & ROI

❌ Projektdaten verstreut
   → Excel, E-Mails, SharePoint, Post-Its
   → Niemand hat den Überblick

❌ Keine Echtzeit-Transparenz
   → Monatsreports veraltet bei Erstellung
   → Reaktion zu langsam

❌ Kommunikation schwierig
   → DE-Team vs. EN-Manager vs. ES-Stakeholder
   → Ständig übersetzen & anpassen

❌ PMO-Wissen verstaubt
   → 10 PDFs à 100+ Seiten
   → Keiner liest sie, jeder googelt

═══════════════════════════════════════════════════
✅ **DIE LÖSUNG (mit Tool):**

✅ **TRANSPARENZ**
   Portfolio Health auf einen Blick (75% Score)
   → C-Level: "Wie läuft's?" → 1 Klick: Dashboard!

✅ **AGILITÄT**
   Echtzeit-Updates, keine Monatsreports mehr
   → Änderung im KPI → Sofort im Dashboard sichtbar

✅ **ALIGNMENT**
   STR/TAC/OPS zeigt: Sind wir auf Kurs?
   → Rot in STR? → Strategische Ausrichtung prüfen!

✅ **KOMMUNIKATION**
   Jeder in seiner Sprache & Register
   → DE-Team: Colloquial, EN-Manager: Management
   → Keine Missverständnisse mehr

✅ **KI-COACH**
   10 Practice Guides immer griffbereit
   → Frage → Antwort in 3 Sekunden
   → Mit Quellenangaben!

✅ **ROI-NACHWEIS**
   Zahlen, Daten, Fakten für Management
   → "Wir haben 8/10 Milestones erreicht"
   → "Portfolio Health von 60% auf 75% gesteigert"

═══════════════════════════════════════════════════
📊 **MESSBARER IMPACT:**

⏱️ **Zeit-Ersparnis:** 10h/Woche weniger Excel-Akrobatik
   → Mehr Zeit für strategische Arbeit

📈 **Projekt-Erfolg:** +25% durch besseres Alignment
   → Weniger Fehlstarts, mehr Fokus

💬 **Stakeholder-Zufriedenheit:** +40%
   → Klare Kommunikation, volle Transparenz

🎓 **Onboarding:** Neue PMO-Mitglieder produktiv in 1 Woche statt 3 Monaten
   → KI-Coach erklärt alles

💰 **ROI:** Tool zahlt sich in 3 Monaten aus
   → Durch Zeit-Ersparnis & bessere Projekt-Erfolgsrate

═══════════════════════════════════════════════════
🚀 **USE CASES:**

**1. C-Level Reporting**
   Situation: "Board Meeting in 10 Minuten"
   Lösung: 1 Klick → Dashboard mit 75% Score + STR/TAC/OPS
   Ergebnis: Management happy, PMO bekommt mehr Budget

**2. Quarterly Review**
   Situation: "Wo stehen wir im PMO Reifegrad?"
   Lösung: Impact Cycle zeigt: 8/10 Milestones completed
   Ergebnis: Klarer Fortschritt sichtbar

**3. Neues Projekt**
   Situation: "Welche KPIs soll ich tracken?"
   Lösung: Chatbot: "Für strategisches Alignment: ROI, Stakeholder Satisfaction..."
   Ergebnis: Projekt startet mit richtigen Metriken

**4. Internationales Team**
   Situation: "Kann das jeder verstehen?"
   Lösung: DE-Team: Colloquial, EN-Manager: Management, ES-Stakeholder: Español
   Ergebnis: Alle sprechen die gleiche (unterschiedliche) Sprache!

═══════════════════════════════════════════════════
🎁 **BONUS:**

✅ Open Source → Keine Vendor Lock-in
✅ Lokal lauffähig → Keine Cloud-Kosten
✅ Erweiterbar → API für Integrationen
✅ Beautiful UI → Macht Spaß zu nutzen!

💡 **NEXT LEVEL (V2.0):**
   • Predictive Analytics (KI sagt voraus: Projekt wird scheitern!)
   • Auto-Reports (Generiert PPT für Board Meeting)
   • Voice Input (Sprach-Fragen möglich)
   • Mobile App (Portfolio Health unterwegs)`,

    en: `💰 **VALUE: WHY PMO VALUE GENERATOR?**

═══════════════════════════════════════════════════
🎯 **THE PROBLEM (without tool):**

❌ PMO value hard to measure
   → Management asks: "Why do we need you?"
   → No proof of impact & ROI

❌ Project data scattered
   → Excel, emails, SharePoint, sticky notes
   → No one has overview

❌ No real-time transparency
   → Monthly reports outdated when created
   → Reaction too slow

❌ Communication difficult
   → DE team vs. EN manager vs. ES stakeholder
   → Constantly translating & adapting

❌ PMO knowledge gathering dust
   → 10 PDFs à 100+ pages
   → Nobody reads them, everyone googles

═══════════════════════════════════════════════════
✅ **THE SOLUTION (with tool):**

✅ **TRANSPARENCY**
   Portfolio health at a glance (75% score)
   → C-Level: "How's it going?" → 1 click: Dashboard!

✅ **AGILITY**
   Real-time updates, no monthly reports anymore
   → Change in KPI → Immediately visible in dashboard

✅ **ALIGNMENT**
   STR/TAC/OPS shows: Are we on track?
   → Red in STR? → Check strategic alignment!

✅ **COMMUNICATION**
   Everyone in their language & register
   → DE team: Colloquial, EN manager: Management
   → No more misunderstandings

✅ **AI COACH**
   10 practice guides always at hand
   → Question → Answer in 3 seconds
   → With source citations!

✅ **ROI PROOF**
   Numbers, data, facts for management
   → "We reached 8/10 milestones"
   → "Increased portfolio health from 60% to 75%"

═══════════════════════════════════════════════════
📊 **MEASURABLE IMPACT:**

⏱️ **Time Savings:** 10h/week less Excel acrobatics
   → More time for strategic work

📈 **Project Success:** +25% through better alignment
   → Fewer false starts, more focus

💬 **Stakeholder Satisfaction:** +40%
   → Clear communication, full transparency

🎓 **Onboarding:** New PMO members productive in 1 week instead of 3 months
   → AI coach explains everything

💰 **ROI:** Tool pays for itself in 3 months
   → Through time savings & better project success rate

═══════════════════════════════════════════════════
🚀 **USE CASES:**

**1. C-Level Reporting**
   Situation: "Board meeting in 10 minutes"
   Solution: 1 click → Dashboard with 75% score + STR/TAC/OPS
   Result: Management happy, PMO gets more budget

**2. Quarterly Review**
   Situation: "Where are we in PMO maturity?"
   Solution: Impact cycle shows: 8/10 milestones completed
   Result: Clear progress visible

**3. New Project**
   Situation: "Which KPIs should I track?"
   Solution: Chatbot: "For strategic alignment: ROI, stakeholder satisfaction..."
   Result: Project starts with right metrics

**4. International Team**
   Situation: "Can everyone understand this?"
   Solution: DE team: Colloquial, EN manager: Management, ES stakeholder: Español
   Result: Everyone speaks the same (different) language!

═══════════════════════════════════════════════════
🎁 **BONUS:**

✅ Open source → No vendor lock-in
✅ Runs locally → No cloud costs
✅ Extensible → API for integrations
✅ Beautiful UI → Fun to use!

💡 **NEXT LEVEL (V2.0):**
   • Predictive analytics (AI predicts: Project will fail!)
   • Auto-reports (Generates PPT for board meeting)
   • Voice input (Voice questions possible)
   • Mobile app (Portfolio health on the go)`,

    es: `💰 **VALOR: ¿POR QUÉ PMO VALUE GENERATOR?**

═══════════════════════════════════════════════════
🎯 **EL PROBLEMA (sin herramienta):**

❌ Valor de PMO difícil de medir
   → Gestión pregunta: "¿Por qué te necesitamos?"
   → Sin prueba de impacto y ROI

❌ Datos de proyecto dispersos
   → Excel, correos, SharePoint, notas adhesivas
   → Nadie tiene visión general

❌ Sin transparencia en tiempo real
   → Informes mensuales obsoletos al crearlos
   → Reacción demasiado lenta

❌ Comunicación difícil
   → Equipo DE vs. gerente EN vs. interesado ES
   → Constantemente traduciendo y adaptando

❌ Conocimiento PMO acumulando polvo
   → 10 PDFs de 100+ páginas
   → Nadie los lee, todos buscan en Google

═══════════════════════════════════════════════════
✅ **LA SOLUCIÓN (con herramienta):**

✅ **TRANSPARENCIA**
   Salud de cartera de un vistazo (75% puntuación)
   → C-Level: "¿Cómo va?" → 1 clic: ¡Panel!

✅ **AGILIDAD**
   Actualizaciones en tiempo real, no más informes mensuales
   → Cambio en KPI → Inmediatamente visible en panel

✅ **ALINEACIÓN**
   STR/TAC/OPS muestra: ¿Estamos en el camino?
   → ¿Rojo en STR? → ¡Verificar alineación estratégica!

✅ **COMUNICACIÓN**
   Todos en su idioma y registro
   → Equipo DE: Coloquial, gerente EN: Gestión
   → No más malentendidos

✅ **COACH DE IA**
   10 guías de práctica siempre a mano
   → Pregunta → Respuesta en 3 segundos
   → ¡Con citas de fuentes!

✅ **PRUEBA DE ROI**
   Números, datos, hechos para gestión
   → "Alcanzamos 8/10 hitos"
   → "Aumentamos salud de cartera de 60% a 75%"

═══════════════════════════════════════════════════
📊 **IMPACTO MEDIBLE:**

⏱️ **Ahorro de Tiempo:** 10h/semana menos acrobacias de Excel
   → Más tiempo para trabajo estratégico

📈 **Éxito de Proyecto:** +25% a través de mejor alineación
   → Menos arranques en falso, más enfoque

💬 **Satisfacción de Interesados:** +40%
   → Comunicación clara, transparencia total

🎓 **Incorporación:** Nuevos miembros PMO productivos en 1 semana en lugar de 3 meses
   → Coach de IA explica todo

💰 **ROI:** Herramienta se paga sola en 3 meses
   → A través de ahorro de tiempo y mejor tasa de éxito de proyecto

═══════════════════════════════════════════════════
🚀 **CASOS DE USO:**

**1. Informes de C-Level**
   Situación: "Reunión de junta en 10 minutos"
   Solución: 1 clic → Panel con 75% puntuación + STR/TAC/OPS
   Resultado: Gestión feliz, PMO obtiene más presupuesto

**2. Revisión Trimestral**
   Situación: "¿Dónde estamos en madurez PMO?"
   Solución: Ciclo de impacto muestra: 8/10 hitos completados
   Resultado: Progreso claro visible

**3. Nuevo Proyecto**
   Situación: "¿Qué KPIs debo rastrear?"
   Solución: Chatbot: "Para alineación estratégica: ROI, satisfacción de interesados..."
   Resultado: Proyecto comienza con métricas correctas

**4. Equipo Internacional**
   Situación: "¿Todos pueden entender esto?"
   Solución: Equipo DE: Coloquial, gerente EN: Gestión, interesado ES: Español
   Resultado: ¡Todos hablan el mismo idioma (diferente)!

═══════════════════════════════════════════════════
🎁 **BONUS:**

✅ Código abierto → Sin bloqueo de proveedor
✅ Se ejecuta localmente → Sin costos de nube
✅ Extensible → API para integraciones
✅ UI hermosa → ¡Divertido de usar!

💡 **SIGUIENTE NIVEL (V2.0):**
   • Análisis predictivo (¡IA predice: Proyecto fallará!)
   • Informes automáticos (Genera PPT para reunión de junta)
   • Entrada de voz (Preguntas de voz posibles)
   • Aplicación móvil (Salud de cartera en movimiento)`
  },

  beispiel: {
    de: `📋 **USE CASES & ANWENDUNGSBEISPIELE**

═══════════════════════════════════════════════════

🏢 **USE CASE 1: IT-TRANSFORMATION BEI ENTERPRISE**

**Situation:**
   Großunternehmen mit 50+ IT-Projekten
   → Portfolio völlig intransparent
   → C-Level fordert: "Zeigt uns den Impact!"

**Lösung mit PMO Value Generator:**
   1. Alle 50 Projekte importiert
   2. Pro Projekt: 5-8 KPIs definiert (STR/TAC/OPS)
   3. Target & Current Values eingegeben
   4. Portfolio Health Hub zeigt: 62% Score

**Ergebnis:**
   ✅ C-Level sieht sofort: Strategische Ausrichtung (STR) nur 45%!
   ✅ Deep Dive: Projekte ohne Business Case identifiziert
   ✅ 12 Projekte gestoppt, Ressourcen umverteilt
   ✅ Nach 6 Monaten: Portfolio Health auf 78%
   ✅ ROI des PMO nachgewiesen → Budget verdoppelt!

═══════════════════════════════════════════════════

🌍 **USE CASE 2: INTERNATIONALE PMO-TEAM-KOORDINATION**

**Situation:**
   PMO-Team in 4 Ländern (DE, UK, ES, USA)
   → Sprachbarrieren, Missverständnisse
   → Jeder nutzt eigene KPI-Definitionen

**Lösung mit PMO Value Generator:**
   1. Ein zentrales Tool für alle
   2. Jeder nutzt seine Sprache (DE/EN/ES)
   3. KPI-Definitionen standardisiert (aus etablierten PM-Frameworks)
   4. Register: Team nutzt "Colloquial", C-Level bekommt "Management"

**Ergebnis:**
   ✅ Deutsche Teammitglieder: "Das PMO hilft Teams..."
   ✅ UK Manager: "Strategic PMO governance ensures..."
   ✅ Spanische Stakeholder: "La PMO ayuda a equipos..."
   ✅ Alle sehen die gleichen Zahlen (75% Score)
   ✅ Kommunikation klar, keine Übersetzungsfehler mehr!

═══════════════════════════════════════════════════

🚀 **USE CASE 3: PMO-REIFEGRAD-ENTWICKLUNG**

**Situation:**
   Neues PMO, gerade gestartet
   → Management fragt: "Wann seid ihr 'reif'?"
   → Team weiß nicht, wo anfangen

**Lösung mit PMO Value Generator:**
   1. Impact Cycle mit 10 Milestones als Roadmap
   2. Pro Milestone: KPIs definiert
   3. Quartal 1: Nur Milestone 1-3 aktiv
   4. Dashboard zeigt: 30% Completion
   5. Nach 1 Jahr: 8/10 Milestones completed

**Ergebnis:**
   ✅ Klare Roadmap für PMO-Aufbau
   ✅ Management sieht Fortschritt (Grafik!)
   ✅ Team weiß immer: "Was ist der nächste Schritt?"
   ✅ PMO-Reifegrad von 0 auf Level 4 in 18 Monaten
   ✅ Chatbot als Onboarding-Tool für neue Teammitglieder

═══════════════════════════════════════════════════

💼 **USE CASE 4: C-LEVEL REPORTING AUTOMATION**

**Situation:**
   PMO-Manager verbringt 2 Tage/Monat mit PowerPoint
   → Board Meeting braucht "schöne Slides"
   → Zahlen aus 20 Excel-Files zusammengesucht

**Lösung mit PMO Value Generator:**
   1. Alle KPIs im Tool gepflegt (1x/Woche Update)
   2. Dashboard immer aktuell
   3. Board Meeting: 1 Klick → Screenshot vom Dashboard
   4. Multi-Language: EN für Board, DE für Team

**Ergebnis:**
   ✅ Reporting-Zeit: 2 Tage → 30 Minuten
   ✅ Zahlen immer aktuell (nicht 2 Wochen alt)
   ✅ Board beeindruckt von Transparenz
   ✅ PMO-Manager: Mehr Zeit für strategische Arbeit

═══════════════════════════════════════════════════

🎓 **USE CASE 5: PMO-WISSENS-COACHING**

**Situation:**
   Junior PMO Analyst fragt: "Was ist eigentlich Benefit Realization?"
   → Niemand hat Zeit zu erklären
   → 300-Seiten PDF zum Selbststudium

**Lösung mit PMO Value Generator:**
   1. Analyst öffnet Chatbot
   2. Fragt: "Was ist Benefit Realization? Erkläre einfach."
   3. Bot antwortet in 3 Sekunden (Colloquial Register)
   4. Follow-Up: "Wie messe ich das?"
   5. Bot gibt konkrete KPI-Beispiele

**Ergebnis:**
   ✅ Analyst produktiv in Tagen statt Wochen
   ✅ Seniors müssen nicht ständig erklären
   ✅ Professionelles PMO-Wissen immer verfügbar
   ✅ Team-Produktivität steigt

═══════════════════════════════════════════════════

📊 **WEITERE ANWENDUNGEN:**

• **Projekt-Kick-off:** Welche KPIs für neues Projekt?
• **Risk Management:** Früherkennung durch Dashboard (rot = Alarm!)
• **Stakeholder-Management:** Jeder bekommt "seine" Sprache
• **PMO Marketing:** Zeig Management den Impact (75% Score!)
• **Audit & Compliance:** Nachweisbare Metriken für ISO 21500

💬 Frag mich gerne nach einem spezifischen Use Case für deine Situation!`,

    en: `📋 **USE CASES & APPLICATION EXAMPLES**

═══════════════════════════════════════════════════

🏢 **USE CASE 1: IT TRANSFORMATION AT ENTERPRISE**

**Situation:**
   Large enterprise with 50+ IT projects
   → Portfolio completely opaque
   → C-Level demands: "Show us the impact!"

**Solution with PMO Value Generator:**
   1. All 50 projects imported
   2. Per project: 5-8 KPIs defined (STR/TAC/OPS)
   3. Target & current values entered
   4. Portfolio health hub shows: 62% score

**Result:**
   ✅ C-Level immediately sees: Strategic alignment (STR) only 45%!
   ✅ Deep dive: Projects without business case identified
   ✅ 12 projects stopped, resources redistributed
   ✅ After 6 months: Portfolio health at 78%
   ✅ PMO ROI proven → Budget doubled!

═══════════════════════════════════════════════════

🌍 **USE CASE 2: INTERNATIONAL PMO TEAM COORDINATION**

**Situation:**
   PMO team in 4 countries (DE, UK, ES, USA)
   → Language barriers, misunderstandings
   → Everyone uses own KPI definitions

**Solution with PMO Value Generator:**
   1. One central tool for all
   2. Everyone uses their language (DE/EN/ES)
   3. KPI definitions standardized (from established PM frameworks)
   4. Register: Team uses "Colloquial", C-Level gets "Management"

**Result:**
   ✅ German team members: "Das PMO hilft Teams..."
   ✅ UK manager: "Strategic PMO governance ensures..."
   ✅ Spanish stakeholders: "La PMO ayuda a equipos..."
   ✅ All see same numbers (75% score)
   ✅ Communication clear, no translation errors!

═══════════════════════════════════════════════════

🚀 **USE CASE 3: PMO MATURITY DEVELOPMENT**

**Situation:**
   New PMO, just started
   → Management asks: "When will you be 'mature'?"
   → Team doesn't know where to start

**Solution with PMO Value Generator:**
   1. Impact cycle with 10 milestones as roadmap
   2. Per milestone: KPIs defined
   3. Quarter 1: Only milestone 1-3 active
   4. Dashboard shows: 30% completion
   5. After 1 year: 8/10 milestones completed

**Result:**
   ✅ Clear roadmap for PMO setup
   ✅ Management sees progress (chart!)
   ✅ Team always knows: "What's the next step?"
   ✅ PMO maturity from 0 to level 4 in 18 months
   ✅ Chatbot as onboarding tool for new team members

═══════════════════════════════════════════════════

💼 **USE CASE 4: C-LEVEL REPORTING AUTOMATION**

**Situation:**
   PMO manager spends 2 days/month on PowerPoint
   → Board meeting needs "nice slides"
   → Numbers collected from 20 Excel files

**Solution with PMO Value Generator:**
   1. All KPIs maintained in tool (1x/week update)
   2. Dashboard always current
   3. Board meeting: 1 click → Screenshot of dashboard
   4. Multi-language: EN for board, DE for team

**Result:**
   ✅ Reporting time: 2 days → 30 minutes
   ✅ Numbers always current (not 2 weeks old)
   ✅ Board impressed by transparency
   ✅ PMO manager: More time for strategic work

═══════════════════════════════════════════════════

🎓 **USE CASE 5: PMO KNOWLEDGE COACHING**

**Situation:**
   Junior PMO analyst asks: "What is benefit realization anyway?"
   → Nobody has time to explain
   → 300-page PDF for self-study

**Solution with PMO Value Generator:**
   1. Analyst opens chatbot
   2. Asks: "What is benefit realization? Explain simply."
   3. Bot answers in 3 seconds (colloquial register)
   4. Follow-up: "How do I measure it?"
   5. Bot gives concrete KPI examples

**Result:**
   ✅ Analyst productive in days instead of weeks
   ✅ Seniors don't have to constantly explain
   ✅ Professional PMO knowledge always available
   ✅ Team productivity increases

═══════════════════════════════════════════════════

📊 **MORE APPLICATIONS:**

• **Project kick-off:** Which KPIs for new project?
• **Risk management:** Early detection through dashboard (red = alarm!)
• **Stakeholder management:** Everyone gets "their" language
• **PMO marketing:** Show management the impact (75% score!)
• **Audit & compliance:** Provable metrics for ISO 21500

💬 Feel free to ask me about a specific use case for your situation!`,

    es: `📋 **CASOS DE USO Y EJEMPLOS DE APLICACIÓN**

═══════════════════════════════════════════════════

🏢 **CASO DE USO 1: TRANSFORMACIÓN TI EN EMPRESA**

**Situación:**
   Gran empresa con 50+ proyectos TI
   → Cartera completamente opaca
   → C-Level exige: "¡Muéstranos el impacto!"

**Solución con PMO Value Generator:**
   1. Todos los 50 proyectos importados
   2. Por proyecto: 5-8 KPIs definidos (STR/TAC/OPS)
   3. Valores objetivo y actuales ingresados
   4. Centro de salud de cartera muestra: 62% puntuación

**Resultado:**
   ✅ C-Level ve inmediatamente: ¡Alineación estratégica (STR) solo 45%!
   ✅ Análisis profundo: Proyectos sin caso de negocio identificados
   ✅ 12 proyectos detenidos, recursos redistribuidos
   ✅ Después de 6 meses: Salud de cartera al 78%
   ✅ ROI de PMO demostrado → ¡Presupuesto duplicado!

═══════════════════════════════════════════════════

🌍 **CASO DE USO 2: COORDINACIÓN DE EQUIPO PMO INTERNACIONAL**

**Situación:**
   Equipo PMO en 4 países (DE, UK, ES, USA)
   → Barreras idiomáticas, malentendidos
   → Todos usan sus propias definiciones de KPI

**Solución con PMO Value Generator:**
   1. Una herramienta central para todos
   2. Todos usan su idioma (DE/EN/ES)
   3. Definiciones de KPI estandarizadas (de Guías de Práctica PMI)
   4. Registro: Equipo usa "Coloquial", C-Level obtiene "Gestión"

**Resultado:**
   ✅ Miembros del equipo alemán: "Das PMO hilft Teams..."
   ✅ Gerente UK: "Strategic PMO governance ensures..."
   ✅ Interesados españoles: "La PMO ayuda a equipos..."
   ✅ Todos ven los mismos números (75% puntuación)
   ✅ Comunicación clara, ¡sin errores de traducción!

═══════════════════════════════════════════════════

🚀 **CASO DE USO 3: DESARROLLO DE MADUREZ PMO**

**Situación:**
   Nueva PMO, recién comenzada
   → Gestión pregunta: "¿Cuándo serán 'maduros'?"
   → Equipo no sabe por dónde empezar

**Solución con PMO Value Generator:**
   1. Ciclo de impacto con 10 hitos como hoja de ruta
   2. Por hito: KPIs definidos
   3. Trimestre 1: Solo hitos 1-3 activos
   4. Panel muestra: 30% de finalización
   5. Después de 1 año: 8/10 hitos completados

**Resultado:**
   ✅ Hoja de ruta clara para configuración de PMO
   ✅ Gestión ve progreso (¡gráfico!)
   ✅ Equipo siempre sabe: "¿Cuál es el próximo paso?"
   ✅ Madurez PMO de 0 a nivel 4 en 18 meses
   ✅ Chatbot como herramienta de incorporación para nuevos miembros

═══════════════════════════════════════════════════

💼 **CASO DE USO 4: AUTOMATIZACIÓN DE INFORMES C-LEVEL**

**Situación:**
   Gerente de PMO pasa 2 días/mes en PowerPoint
   → Reunión de junta necesita "diapositivas bonitas"
   → Números recopilados de 20 archivos Excel

**Solución con PMO Value Generator:**
   1. Todos los KPIs mantenidos en herramienta (actualización 1x/semana)
   2. Panel siempre actual
   3. Reunión de junta: 1 clic → Captura de pantalla del panel
   4. Multilingüe: EN para junta, DE para equipo

**Resultado:**
   ✅ Tiempo de informes: 2 días → 30 minutos
   ✅ Números siempre actuales (no 2 semanas viejos)
   ✅ Junta impresionada por transparencia
   ✅ Gerente de PMO: Más tiempo para trabajo estratégico

═══════════════════════════════════════════════════

🎓 **CASO DE USO 5: COACHING DE CONOCIMIENTO PMO**

**Situación:**
   Analista junior de PMO pregunta: "¿Qué es la realización de beneficios?"
   → Nadie tiene tiempo para explicar
   → PDF de 300 páginas para autoestudio

**Solución con PMO Value Generator:**
   1. Analista abre chatbot
   2. Pregunta: "¿Qué es la realización de beneficios? Explica simplemente."
   3. Bot responde en 3 segundos (registro coloquial)
   4. Seguimiento: "¿Cómo lo mido?"
   5. Bot da ejemplos concretos de KPI

**Resultado:**
   ✅ Analista productivo en días en lugar de semanas
   ✅ Seniors no tienen que explicar constantemente
   ✅ Conocimiento de 10 guías PMI siempre disponible
   ✅ Productividad del equipo aumenta

═══════════════════════════════════════════════════

📊 **MÁS APLICACIONES:**

• **Inicio de proyecto:** ¿Qué KPIs para nuevo proyecto?
• **Gestión de riesgos:** Detección temprana a través del panel (¡rojo = alarma!)
• **Gestión de interesados:** Todos obtienen "su" idioma
• **Marketing de PMO:** Muestra a la gestión el impacto (¡75% puntuación!)
• **Auditoría y cumplimiento:** Métricas demostrables para ISO 21500

💬 ¡Pregúntame sobre un caso de uso específico para tu situación!`
  }
};

