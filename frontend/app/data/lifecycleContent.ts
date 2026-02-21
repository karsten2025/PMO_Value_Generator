/**
 * Project Lifecycle - 2x3 Matrix Content (Sprache × Register)
 * DE/EN/ES × Colloquial/Management
 * 49 Projektmanagement-Prozesse + 3 Pre-Project Prozesse
 * IP-Protection: Paraphrasiert, keine PMBOK/PMI Trademarks
 */

type Lang = "de" | "en" | "es";
type Mode = "colloquial" | "management";

export const LIFECYCLE_CONTENT = {
  // UI ALLGEMEIN
  ui: {
    input_area_placeholder: {
      de: { colloquial: "Klicke oben auf einen Prozess-Stein, um loszulegen.", management: "Wählen Sie einen Prozessschritt zur Datenerfassung." },
      en: { colloquial: "Click a process brick above to get started.", management: "Select a process step for data entry." },
      es: { colloquial: "Haz clic en un bloque de proceso arriba para empezar.", management: "Seleccione un paso del proceso para la entrada de datos." },
    },
    input_area_selected: {
      de: { colloquial: "Ausgewählter Prozess:", management: "Aktiver Prozessschritt:" },
      en: { colloquial: "Selected process:", management: "Active process step:" },
      es: { colloquial: "Proceso seleccionado:", management: "Paso de proceso activo:" },
    },
    input_area_detail_placeholder: {
      de: { colloquial: "Hier erscheinen später Eingabefelder und Details zum gewählten Prozess.", management: "Datenerfassungsbereich für den gewählten Prozessschritt." },
      en: { colloquial: "Input fields and details for the selected process will appear here.", management: "Data entry area for the selected process step." },
      es: { colloquial: "Aquí aparecerán los campos de entrada y detalles del proceso elegido.", management: "Área de entrada de datos para el paso de proceso seleccionado." },
    },
    workflow_title: {
      de: { colloquial: "Workflow für:", management: "Project Lifecycle:" },
      en: { colloquial: "Workflow for:", management: "Project Lifecycle:" },
      es: { colloquial: "Flujo de trabajo para:", management: "Ciclo de vida del proyecto:" },
    },
    workflow_subtitle: {
      de: { colloquial: "Projekt-Lebenszyklus von der Idee bis zum Abschluss", management: "Projektlebenszyklus von der Portfolio-Analyse bis zum Abschluss" },
      en: { colloquial: "Project lifecycle from idea to closure", management: "Project lifecycle from portfolio analysis to closure" },
      es: { colloquial: "Ciclo de vida del proyecto de la idea al cierre", management: "Ciclo de vida del proyecto del análisis de cartera al cierre" },
    },
    projects_label: {
      de: { colloquial: "Projekte", management: "Projektliste" },
      en: { colloquial: "Projects", management: "Project List" },
      es: { colloquial: "Proyectos", management: "Lista de Proyectos" },
    },
    search_placeholder: {
      de: { colloquial: "Projekte suchen...", management: "Projekt suchen" },
      en: { colloquial: "Search projects...", management: "Search project" },
      es: { colloquial: "Buscar proyectos...", management: "Buscar proyecto" },
    },
    input_area_label: {
      de: { colloquial: "Eingabebereich", management: "Datenerfassung" },
      en: { colloquial: "Input Area", management: "Data Entry" },
      es: { colloquial: "Área de entrada", management: "Entrada de datos" },
    },
    tier_strategic: {
      de: { colloquial: "Strategisch", management: "Strategic" },
      en: { colloquial: "Strategic", management: "Strategic" },
      es: { colloquial: "Estratégico", management: "Strategic" },
    },
    tier_tactical: {
      de: { colloquial: "Taktisch", management: "Tactical" },
      en: { colloquial: "Tactical", management: "Tactical" },
      es: { colloquial: "Táctico", management: "Tactical" },
    },
    tier_operational: {
      de: { colloquial: "Operativ", management: "Operational" },
      en: { colloquial: "Operational", management: "Operational" },
      es: { colloquial: "Operacional", management: "Operational" },
    },
    tier_undefined: {
      de: { colloquial: "Nicht zugewiesen", management: "Not Assigned" },
      en: { colloquial: "Not assigned", management: "Not Assigned" },
      es: { colloquial: "Sin asignar", management: "No Asignado" },
    },
    new_draft: {
      de: { colloquial: "+ Neuer Entwurf", management: "+ Projekt initialisieren" },
      en: { colloquial: "+ New Draft", management: "+ Initialize Project" },
      es: { colloquial: "+ Nuevo Borrador", management: "+ Inicializar Proyecto" },
    },
    new_draft_default_name: {
      de: { colloquial: "Neuer Entwurf", management: "Projekt (Entwurf)" },
      en: { colloquial: "New Draft", management: "Project (Draft)" },
      es: { colloquial: "Nuevo Borrador", management: "Proyecto (Borrador)" },
    },
    save: {
      de: { colloquial: "Speichern", management: "Speichern" },
      en: { colloquial: "Save", management: "Save" },
      es: { colloquial: "Guardar", management: "Guardar" },
    },
    close: {
      de: { colloquial: "Schließen", management: "Schließen" },
      en: { colloquial: "Close", management: "Close" },
      es: { colloquial: "Cerrar", management: "Cerrar" },
    },
    delete_confirm: {
      de: { colloquial: "Möchtest du dieses Projekt wirklich unwiderruflich löschen?", management: "Möchtest du dieses Projekt wirklich unwiderruflich löschen?" },
      en: { colloquial: "Do you really want to permanently delete this project?", management: "Do you really want to permanently delete this project?" },
      es: { colloquial: "¿Realmente quieres eliminar este proyecto permanentemente?", management: "¿Realmente quieres eliminar este proyecto permanentemente?" },
    },
    rename_placeholder: {
      de: { colloquial: "Projektname...", management: "Projektname eingeben..." },
      en: { colloquial: "Project name...", management: "Enter project name..." },
      es: { colloquial: "Nombre del proyecto...", management: "Introducir nombre del proyecto..." },
    },
    approve_start: {
      de: { colloquial: "Projekt freigeben & starten", management: "Approve & Start Project" },
      en: { colloquial: "Approve & start project", management: "Approve & Start Project" },
      es: { colloquial: "Aprobar y iniciar proyecto", management: "Aprobar e Iniciar Proyecto" },
    },
    tags_label: {
      de: { colloquial: "Tags / Hashtags", management: "Tags" },
      en: { colloquial: "Tags / Hashtags", management: "Tags" },
      es: { colloquial: "Etiquetas / Hashtags", management: "Etiquetas" },
    },
    tags_placeholder: {
      de: { colloquial: "z.B. #cloud, #innovation", management: "z.B. #cloud, #strategic" },
      en: { colloquial: "e.g. #cloud, #innovation", management: "e.g. #cloud, #strategic" },
      es: { colloquial: "ej. #cloud, #innovation", management: "ej. #cloud, #strategic" },
    },
  },

  // TIERS (Governance Tier Selector - Label + Description)
  tiers: {
    strategic: {
      label: {
        de: { colloquial: "Strategisch (Big Bet)", management: "Strategic Portfolio" },
        en: { colloquial: "Strategic (Big Bet)", management: "Strategic Portfolio" },
        es: { colloquial: "Estratégico (Big Bet)", management: "Portafolio Estratégico" },
      },
      description: {
        de: { colloquial: "Chefsache. Hoher Impact.", management: "High impact, high risk, board approval required." },
        en: { colloquial: "C-level. High impact.", management: "High impact, high risk, board approval required." },
        es: { colloquial: "Asunto de dirección. Alto impacto.", management: "Alto impacto, alto riesgo, aprobación del consejo." },
      },
    },
    tactical: {
      label: {
        de: { colloquial: "Taktisch (Muss sein)", management: "Tactical Execution" },
        en: { colloquial: "Tactical (Must-have)", management: "Tactical Execution" },
        es: { colloquial: "Táctico (Debe ser)", management: "Ejecución Táctica" },
      },
      description: {
        de: { colloquial: "Wichtig für den Betrieb.", management: "Medium impact, resource optimization." },
        en: { colloquial: "Important for operations.", management: "Medium impact, resource optimization." },
        es: { colloquial: "Importante para la operación.", management: "Impacto medio, optimización de recursos." },
      },
    },
    operational: {
      label: {
        de: { colloquial: "Operativ (Quick Win)", management: "Operational Efficiency" },
        en: { colloquial: "Operational (Quick Win)", management: "Operational Efficiency" },
        es: { colloquial: "Operacional (Quick Win)", management: "Eficiencia Operacional" },
      },
      description: {
        de: { colloquial: "Tagesgeschäft & Fixes.", management: "Low risk, fast track governance." },
        en: { colloquial: "Day-to-day & fixes.", management: "Low risk, fast track governance." },
        es: { colloquial: "Operación diaria y correcciones.", management: "Bajo riesgo, gobernanza rápida." },
      },
    },
  },

  // PHASEN (Spaltenüberschriften)
  phases: {
    0: {
      title: {
        de: { colloquial: "Idee & Check", management: "Portfolio Analysis & Intake" },
        en: { colloquial: "Idea & Check", management: "Portfolio Analysis & Intake" },
        es: { colloquial: "Idea y Verificación", management: "Análisis de Cartera" },
      },
    },
    1: {
      title: {
        de: { colloquial: "Startschuss", management: "Initiating Process Group" },
        en: { colloquial: "Kick-off", management: "Initiating Process Group" },
        es: { colloquial: "Inicio", management: "Grupo de Procesos de Inicio" },
      },
    },
    2: {
      title: {
        de: { colloquial: "Der Schlachtplan", management: "Planning Process Group" },
        en: { colloquial: "The Battle Plan", management: "Planning Process Group" },
        es: { colloquial: "El Plan de Batalla", management: "Grupo de Procesos de Planificación" },
      },
    },
    3: {
      title: {
        de: { colloquial: "Ärmel hochkrempeln", management: "Execution & Control" },
        en: { colloquial: "Roll up sleeves", management: "Execution & Control" },
        es: { colloquial: "Manos a la obra", management: "Ejecución y Control" },
      },
    },
    4: {
      title: {
        de: { colloquial: "Deckel drauf", management: "Closing Process Group" },
        en: { colloquial: "Wrap it up", management: "Closing Process Group" },
        es: { colloquial: "Cierre", management: "Grupo de Procesos de Cierre" },
      },
    },
  },

  // GATES (Rauten zwischen Phasen) - gate_acceptance neu zwischen Execution & Closing
  gates: {
    0: {
      label: {
        de: { colloquial: "Lohnt sich das?", management: "Go/No-Go Decision" },
        en: { colloquial: "Worth it?", management: "Go/No-Go Decision" },
        es: { colloquial: "¿Vale la pena?", management: "Decisión Go/No-Go" },
      },
    },
    1: {
      label: {
        de: { colloquial: "Dürfen wir?", management: "Charter Authorization" },
        en: { colloquial: "Allowed?", management: "Charter Authorization" },
        es: { colloquial: "¿Permiso?", management: "Autorización del Acta" },
      },
    },
    2: {
      label: {
        de: { colloquial: "Plan steht?", management: "Baseline Approval" },
        en: { colloquial: "Plan ready?", management: "Baseline Approval" },
        es: { colloquial: "¿Plan listo?", management: "Aprobación de Línea Base" },
      },
    },
    3: {
      label: {
        de: { colloquial: "Alles fertig?", management: "Formal Acceptance / Abnahme" },
        en: { colloquial: "Ready for handover?", management: "Formal Acceptance / Handover" },
        es: { colloquial: "¿Todo listo?", management: "Aceptación Formal / Entrega" },
      },
    },
  },

  // PROZESSE: id als Key (na, bc, bmp + 4.1–8.1)
  processes: {
    // Pre-Project (3)
    na: {
      de: { colloquial: "Was brauchen wir wirklich?", management: "Needs Assessment" },
      en: { colloquial: "What do we really need?", management: "Needs Assessment" },
      es: { colloquial: "¿Qué necesitamos realmente?", management: "Evaluación de Necesidades" },
    },
    bc: {
      de: { colloquial: "Rechnet sich das?", management: "Business Case" },
      en: { colloquial: "Does it pay off?", management: "Business Case" },
      es: { colloquial: "¿Es rentable?", management: "Caso de Negocio" },
    },
    bmp: {
      de: { colloquial: "Nutzen im Blick", management: "Benefits Management Plan" },
      en: { colloquial: "Benefits in focus", management: "Benefits Management Plan" },
      es: { colloquial: "Beneficios en foco", management: "Plan de Gestión de Beneficios" },
    },
    // Initiating (2)
    "4.1": {
      de: { colloquial: "Projektauftrag schreiben", management: "Develop Project Charter" },
      en: { colloquial: "Write project order", management: "Develop Project Charter" },
      es: { colloquial: "Escribir acta de constitución", management: "Desarrollar Acta de Constitución" },
    },
    "4.2": {
      de: { colloquial: "Wer redet mit?", management: "Identify Stakeholders" },
      en: { colloquial: "Who's involved?", management: "Identify Stakeholders" },
      es: { colloquial: "¿Quién participa?", management: "Identificar Interesados" },
    },
    // Planning (24)
    "5.1": {
      de: { colloquial: "Projektplan bauen", management: "Develop Project Management Plan" },
      en: { colloquial: "Build project plan", management: "Develop Project Management Plan" },
      es: { colloquial: "Construir plan del proyecto", management: "Desarrollar Plan de Gestión" },
    },
    "5.2": {
      de: { colloquial: "Alcance planen", management: "Plan Scope Management" },
      en: { colloquial: "Plan scope approach", management: "Plan Scope Management" },
      es: { colloquial: "Planificar alcance", management: "Planificar Gestión del Alcance" },
    },
    "5.3": {
      de: { colloquial: "Was will der Kunde?", management: "Collect Requirements" },
      en: { colloquial: "What does the customer want?", management: "Collect Requirements" },
      es: { colloquial: "¿Qué quiere el cliente?", management: "Recopilar Requisitos" },
    },
    "5.4": {
      de: { colloquial: "Grenzen ziehen", management: "Define Scope" },
      en: { colloquial: "Draw the line", management: "Define Scope" },
      es: { colloquial: "Definir límites", management: "Definir Alcance" },
    },
    "5.5": {
      de: { colloquial: "Arbeit in Pakete packen", management: "Create WBS" },
      en: { colloquial: "Break work into packages", management: "Create WBS" },
      es: { colloquial: "Dividir trabajo en paquetes", management: "Crear EDT" },
    },
    "5.6": {
      de: { colloquial: "Terminplanung vorbereiten", management: "Plan Schedule Management" },
      en: { colloquial: "Prepare schedule approach", management: "Plan Schedule Management" },
      es: { colloquial: "Preparar planificación", management: "Planificar Gestión del Cronograma" },
    },
    "5.7": {
      de: { colloquial: "Aktivitäten definieren", management: "Define Activities" },
      en: { colloquial: "Define activities", management: "Define Activities" },
      es: { colloquial: "Definir actividades", management: "Definir Actividades" },
    },
    "5.8": {
      de: { colloquial: "Reihenfolge festlegen", management: "Sequence Activities" },
      en: { colloquial: "Set the order", management: "Sequence Activities" },
      es: { colloquial: "Establecer orden", management: "Secuenciar Actividades" },
    },
    "5.9": {
      de: { colloquial: "Dauern schätzen", management: "Estimate Activity Durations" },
      en: { colloquial: "Estimate durations", management: "Estimate Activity Durations" },
      es: { colloquial: "Estimar duraciones", management: "Estimar Duración de Actividades" },
    },
    "5.10": {
      de: { colloquial: "Zeitplan erstellen", management: "Develop Schedule" },
      en: { colloquial: "Create timeline", management: "Develop Schedule" },
      es: { colloquial: "Crear cronograma", management: "Desarrollar Cronograma" },
    },
    "5.11": {
      de: { colloquial: "Kostenplanung vorbereiten", management: "Plan Cost Management" },
      en: { colloquial: "Prepare cost approach", management: "Plan Cost Management" },
      es: { colloquial: "Preparar gestión de costes", management: "Planificar Gestión de Costes" },
    },
    "5.12": {
      de: { colloquial: "Kosten schätzen", management: "Estimate Costs" },
      en: { colloquial: "Estimate costs", management: "Estimate Costs" },
      es: { colloquial: "Estimar costes", management: "Estimar Costes" },
    },
    "5.13": {
      de: { colloquial: "Budget festlegen", management: "Determine Budget" },
      en: { colloquial: "Set the budget", management: "Determine Budget" },
      es: { colloquial: "Fijar presupuesto", management: "Determinar Presupuesto" },
    },
    "5.14": {
      de: { colloquial: "Qualität planen", management: "Plan Quality Management" },
      en: { colloquial: "Plan quality", management: "Plan Quality Management" },
      es: { colloquial: "Planificar calidad", management: "Planificar Gestión de Calidad" },
    },
    "5.15": {
      de: { colloquial: "Ressourcen planen", management: "Plan Resource Management" },
      en: { colloquial: "Plan resources", management: "Plan Resource Management" },
      es: { colloquial: "Planificar recursos", management: "Planificar Gestión de Recursos" },
    },
    "5.16": {
      de: { colloquial: "Ressourcenbedarf schätzen", management: "Estimate Activity Resources" },
      en: { colloquial: "Estimate resource needs", management: "Estimate Activity Resources" },
      es: { colloquial: "Estimar necesidades de recursos", management: "Estimar Recursos de Actividades" },
    },
    "5.17": {
      de: { colloquial: "Kommunikation planen", management: "Plan Communications Management" },
      en: { colloquial: "Plan communications", management: "Plan Communications Management" },
      es: { colloquial: "Planificar comunicaciones", management: "Planificar Gestión de Comunicaciones" },
    },
    "5.18": {
      de: { colloquial: "Risiko-Ansatz planen", management: "Plan Risk Management" },
      en: { colloquial: "Plan risk approach", management: "Plan Risk Management" },
      es: { colloquial: "Planificar gestión de riesgos", management: "Planificar Gestión de Riesgos" },
    },
    "5.19": {
      de: { colloquial: "Was kann schiefgehen?", management: "Identify Risks" },
      en: { colloquial: "What could go wrong?", management: "Identify Risks" },
      es: { colloquial: "¿Qué puede salir mal?", management: "Identificar Riesgos" },
    },
    "5.20": {
      de: { colloquial: "Risiken bewerten", management: "Perform Qualitative Risk Analysis" },
      en: { colloquial: "Assess risks", management: "Perform Qualitative Risk Analysis" },
      es: { colloquial: "Evaluar riesgos", management: "Análisis Cualitativo de Riesgos" },
    },
    "5.21": {
      de: { colloquial: "Risiken quantifizieren", management: "Perform Quantitative Risk Analysis" },
      en: { colloquial: "Quantify risks", management: "Perform Quantitative Risk Analysis" },
      es: { colloquial: "Cuantificar riesgos", management: "Análisis Cuantitativo de Riesgos" },
    },
    "5.22": {
      de: { colloquial: "Risiko-Maßnahmen planen", management: "Plan Risk Responses" },
      en: { colloquial: "Plan risk responses", management: "Plan Risk Responses" },
      es: { colloquial: "Planificar respuestas a riesgos", management: "Planificar Respuestas a Riesgos" },
    },
    "5.23": {
      de: { colloquial: "Beschaffung planen", management: "Plan Procurement Management" },
      en: { colloquial: "Plan procurement", management: "Plan Procurement Management" },
      es: { colloquial: "Planificar adquisiciones", management: "Planificar Gestión de Adquisiciones" },
    },
    "5.24": {
      de: { colloquial: "Stakeholder-Einbindung planen", management: "Plan Stakeholder Engagement" },
      en: { colloquial: "Plan stakeholder involvement", management: "Plan Stakeholder Engagement" },
      es: { colloquial: "Planificar involucramiento", management: "Planificar Participación de Interesados" },
    },
    // Executing (10)
    "6.1": {
      de: { colloquial: "Arbeit vorantreiben", management: "Direct and Manage Project Work" },
      en: { colloquial: "Drive the work", management: "Direct and Manage Project Work" },
      es: { colloquial: "Impulsar el trabajo", management: "Dirigir y Gestionar Trabajo" },
    },
    "6.2": {
      de: { colloquial: "Wissen teilen", management: "Manage Project Knowledge" },
      en: { colloquial: "Share knowledge", management: "Manage Project Knowledge" },
      es: { colloquial: "Compartir conocimiento", management: "Gestionar Conocimiento del Proyecto" },
    },
    "6.3": {
      de: { colloquial: "Qualität sichern", management: "Manage Quality" },
      en: { colloquial: "Ensure quality", management: "Manage Quality" },
      es: { colloquial: "Asegurar calidad", management: "Gestionar Calidad" },
    },
    "6.4": {
      de: { colloquial: "Team zusammenstellen", management: "Acquire Resources" },
      en: { colloquial: "Get the team", management: "Acquire Resources" },
      es: { colloquial: "Reunir el equipo", management: "Adquirir Recursos" },
    },
    "6.5": {
      de: { colloquial: "Team entwickeln", management: "Develop Team" },
      en: { colloquial: "Develop the team", management: "Develop Team" },
      es: { colloquial: "Desarrollar equipo", management: "Desarrollar Equipo" },
    },
    "6.6": {
      de: { colloquial: "Team führen", management: "Manage Team" },
      en: { colloquial: "Lead the team", management: "Manage Team" },
      es: { colloquial: "Liderar equipo", management: "Gestionar Equipo" },
    },
    "6.7": {
      de: { colloquial: "Alle auf dem Laufenden", management: "Manage Communications" },
      en: { colloquial: "Keep everyone in the loop", management: "Manage Communications" },
      es: { colloquial: "Mantener informados", management: "Gestionar Comunicaciones" },
    },
    "6.8": {
      de: { colloquial: "Risiken angehen", management: "Implement Risk Responses" },
      en: { colloquial: "Address risks", management: "Implement Risk Responses" },
      es: { colloquial: "Abordar riesgos", management: "Implementar Respuestas a Riesgos" },
    },
    "6.9": {
      de: { colloquial: "Einkauf durchführen", management: "Conduct Procurements" },
      en: { colloquial: "Conduct procurement", management: "Conduct Procurements" },
      es: { colloquial: "Realizar adquisiciones", management: "Realizar Adquisiciones" },
    },
    "6.10": {
      de: { colloquial: "Stakeholder einbinden", management: "Manage Stakeholder Engagement" },
      en: { colloquial: "Engage stakeholders", management: "Manage Stakeholder Engagement" },
      es: { colloquial: "Involucrar interesados", management: "Gestionar Participación de Interesados" },
    },
    // Monitoring & Controlling (12)
    "7.1": {
      de: { colloquial: "Projekt im Blick", management: "Monitor and Control Project Work" },
      en: { colloquial: "Keep project on track", management: "Monitor and Control Project Work" },
      es: { colloquial: "Mantener proyecto en curso", management: "Monitorear y Controlar Trabajo" },
    },
    "7.2": {
      de: { colloquial: "Änderungen steuern", management: "Perform Integrated Change Control" },
      en: { colloquial: "Control changes", management: "Perform Integrated Change Control" },
      es: { colloquial: "Controlar cambios", management: "Control Integrado de Cambios" },
    },
    "7.3": {
      de: { colloquial: "Abnahme prüfen", management: "Validate Scope" },
      en: { colloquial: "Validate delivery", management: "Validate Scope" },
      es: { colloquial: "Validar entrega", management: "Validar Alcance" },
    },
    "7.4": {
      de: { colloquial: "Alcance kontrollieren", management: "Control Scope" },
      en: { colloquial: "Control scope", management: "Control Scope" },
      es: { colloquial: "Controlar alcance", management: "Controlar Alcance" },
    },
    "7.5": {
      de: { colloquial: "Termine im Griff", management: "Control Schedule" },
      en: { colloquial: "Control schedule", management: "Control Schedule" },
      es: { colloquial: "Controlar cronograma", management: "Controlar Cronograma" },
    },
    "7.6": {
      de: { colloquial: "Kosten im Griff", management: "Control Costs" },
      en: { colloquial: "Control costs", management: "Control Costs" },
      es: { colloquial: "Controlar costes", management: "Controlar Costes" },
    },
    "7.7": {
      de: { colloquial: "Qualität prüfen", management: "Control Quality" },
      en: { colloquial: "Control quality", management: "Control Quality" },
      es: { colloquial: "Controlar calidad", management: "Controlar Calidad" },
    },
    "7.8": {
      de: { colloquial: "Ressourcen überwachen", management: "Control Resources" },
      en: { colloquial: "Monitor resources", management: "Control Resources" },
      es: { colloquial: "Supervisar recursos", management: "Controlar Recursos" },
    },
    "7.9": {
      de: { colloquial: "Kommunikation überwachen", management: "Monitor Communications" },
      en: { colloquial: "Monitor communications", management: "Monitor Communications" },
      es: { colloquial: "Monitorear comunicaciones", management: "Monitorear Comunicaciones" },
    },
    "7.10": {
      de: { colloquial: "Risiken überwachen", management: "Monitor Risks" },
      en: { colloquial: "Monitor risks", management: "Monitor Risks" },
      es: { colloquial: "Monitorear riesgos", management: "Monitorear Riesgos" },
    },
    "7.11": {
      de: { colloquial: "Beschaffung kontrollieren", management: "Control Procurements" },
      en: { colloquial: "Control procurement", management: "Control Procurements" },
      es: { colloquial: "Controlar adquisiciones", management: "Controlar Adquisiciones" },
    },
    "7.12": {
      de: { colloquial: "Stakeholder überwachen", management: "Monitor Stakeholder Engagement" },
      en: { colloquial: "Monitor stakeholders", management: "Monitor Stakeholder Engagement" },
      es: { colloquial: "Monitorear interesados", management: "Monitorear Participación de Interesados" },
    },
    // Closing (1)
    "8.1": {
      de: { colloquial: "Projekt abschließen", management: "Close Project or Phase" },
      en: { colloquial: "Close the project", management: "Close Project or Phase" },
      es: { colloquial: "Cerrar el proyecto", management: "Cerrar Proyecto o Fase" },
    },
  },

  // FORMULAR-FELDER pro Prozess (2x3 Matrix)
  forms: {
    na: {
      problem_statement: {
        label: {
          de: { colloquial: "Wo drückt der Schuh?", management: "Problem Statement" },
          en: { colloquial: "Where does it hurt?", management: "Problem Statement" },
          es: { colloquial: "¿Dónde duele?", management: "Declaración del Problema" },
        },
        placeholder: {
          de: { colloquial: "Beschreibe das Problem...", management: "Definieren Sie das Defizit..." },
          en: { colloquial: "Describe the problem...", management: "Define the gap..." },
          es: { colloquial: "Describe el problema...", management: "Defina el déficit..." },
        },
        type: "textarea",
      },
      desired_outcome: {
        label: {
          de: { colloquial: "Was soll besser werden?", management: "Target State / Objectives" },
          en: { colloquial: "What should improve?", management: "Target State / Objectives" },
          es: { colloquial: "¿Qué debe mejorar?", management: "Estado Objetivo / Objetivos" },
        },
        placeholder: {
          de: { colloquial: "Zielzustand beschreiben...", management: "Ziele definieren..." },
          en: { colloquial: "Describe target state...", management: "Define objectives..." },
          es: { colloquial: "Describir estado objetivo...", management: "Definir objetivos..." },
        },
        type: "textarea",
      },
      tags: {
        label: {
          de: { colloquial: "Tags / Hashtags", management: "Tags" },
          en: { colloquial: "Tags / Hashtags", management: "Tags" },
          es: { colloquial: "Etiquetas / Hashtags", management: "Etiquetas" },
        },
        placeholder: {
          de: { colloquial: "z.B. #cloud, #innovation", management: "z.B. #cloud, #strategic" },
          en: { colloquial: "e.g. #cloud, #innovation", management: "e.g. #cloud, #strategic" },
          es: { colloquial: "ej. #cloud, #innovation", management: "ej. #cloud, #strategic" },
        },
        type: "text",
      },
    },
    bc: {
      roi_estimate: {
        label: {
          de: { colloquial: "Was springt dabei raus (€)?", management: "ROI Estimation" },
          en: { colloquial: "What's in it (€)?", management: "ROI Estimation" },
          es: { colloquial: "¿Qué ganamos (€)?", management: "Estimación ROI" },
        },
        placeholder: {
          de: { colloquial: "Geschätzter Nutzen...", management: "ROI in EUR..." },
          en: { colloquial: "Estimated benefit...", management: "ROI in EUR..." },
          es: { colloquial: "Beneficio estimado...", management: "ROI en EUR..." },
        },
        type: "text",
      },
      strategic_fit: {
        label: {
          de: { colloquial: "Passt das zur Strategie?", management: "Strategic Alignment Score" },
          en: { colloquial: "Does it fit strategy?", management: "Strategic Alignment Score" },
          es: { colloquial: "¿Encaja con la estrategia?", management: "Puntuación Alineación Estratégica" },
        },
        placeholder: {
          de: { colloquial: "1–5 oder Beschreibung", management: "Score 1–5" },
          en: { colloquial: "1–5 or description", management: "Score 1–5" },
          es: { colloquial: "1–5 o descripción", management: "Puntuación 1–5" },
        },
        type: "text",
      },
      tags: {
        label: {
          de: { colloquial: "Tags / Hashtags", management: "Tags" },
          en: { colloquial: "Tags / Hashtags", management: "Tags" },
          es: { colloquial: "Etiquetas / Hashtags", management: "Etiquetas" },
        },
        placeholder: {
          de: { colloquial: "z.B. #cloud, #innovation", management: "z.B. #cloud, #strategic" },
          en: { colloquial: "e.g. #cloud, #innovation", management: "e.g. #cloud, #strategic" },
          es: { colloquial: "ej. #cloud, #innovation", management: "ej. #cloud, #strategic" },
        },
        type: "text",
      },
    },
    bmp: {
      benefits_overview: {
        label: {
          de: { colloquial: "Welche Vorteile bringt es?", management: "Benefits Overview" },
          en: { colloquial: "What benefits does it bring?", management: "Benefits Overview" },
          es: { colloquial: "¿Qué beneficios aporta?", management: "Resumen de Beneficios" },
        },
        placeholder: {
          de: { colloquial: "Nutzen auflisten...", management: "Benefits definieren..." },
          en: { colloquial: "List benefits...", management: "Define benefits..." },
          es: { colloquial: "Listar beneficios...", management: "Definir beneficios..." },
        },
        type: "textarea",
      },
      tags: {
        label: {
          de: { colloquial: "Tags / Hashtags", management: "Tags" },
          en: { colloquial: "Tags / Hashtags", management: "Tags" },
          es: { colloquial: "Etiquetas / Hashtags", management: "Etiquetas" },
        },
        placeholder: {
          de: { colloquial: "z.B. #cloud, #innovation", management: "z.B. #cloud, #strategic" },
          en: { colloquial: "e.g. #cloud, #innovation", management: "e.g. #cloud, #strategic" },
          es: { colloquial: "ej. #cloud, #innovation", management: "ej. #cloud, #strategic" },
        },
        type: "text",
      },
    },
    "4.1": {
      project_purpose: {
        label: {
          de: { colloquial: "Wozu das Projekt?", management: "Project Purpose" },
          en: { colloquial: "What's the project for?", management: "Project Purpose" },
          es: { colloquial: "¿Para qué el proyecto?", management: "Propósito del Proyecto" },
        },
        placeholder: {
          de: { colloquial: "Zweck beschreiben...", management: "Purpose statement..." },
          en: { colloquial: "Describe purpose...", management: "Purpose statement..." },
          es: { colloquial: "Describir propósito...", management: "Declaración de propósito..." },
        },
        type: "textarea",
      },
    },
    "4.2": {
      stakeholder_list: {
        label: {
          de: { colloquial: "Wer ist betroffen?", management: "Stakeholder List" },
          en: { colloquial: "Who's affected?", management: "Stakeholder List" },
          es: { colloquial: "¿Quién está afectado?", management: "Lista de Interesados" },
        },
        placeholder: {
          de: { colloquial: "Personen/Rollen auflisten...", management: "Stakeholder erfassen..." },
          en: { colloquial: "List people/roles...", management: "Capture stakeholders..." },
          es: { colloquial: "Listar personas/roles...", management: "Capturar interesados..." },
        },
        type: "textarea",
      },
    },
    // Platzhalter für alle anderen Prozesse (generisches notes-Feld)
    _default: {
      notes: {
        label: {
          de: { colloquial: "Notizen", management: "Notes / Documentation" },
          en: { colloquial: "Notes", management: "Notes / Documentation" },
          es: { colloquial: "Notas", management: "Notas / Documentación" },
        },
        placeholder: {
          de: { colloquial: "Eingaben erfassen...", management: "Dokumentation..." },
          en: { colloquial: "Capture inputs...", management: "Documentation..." },
          es: { colloquial: "Capturar entradas...", management: "Documentación..." },
        },
        type: "textarea",
      },
    },
  },
} as const;

/** Mapping: Prozess-ID → artifacts_data Key */
export const PROCESS_ARTIFACT_KEYS: Record<string, string> = {
  na: "needs_assessment",
  bc: "business_case",
  bmp: "benefits_management_plan",
  "4.1": "project_charter",
  "4.2": "identify_stakeholders",
  "5.1": "project_management_plan",
  "5.2": "plan_scope",
  "5.3": "collect_requirements",
  "5.4": "define_scope",
  "5.5": "create_wbs",
  "5.6": "plan_schedule",
  "5.7": "define_activities",
  "5.8": "sequence_activities",
  "5.9": "estimate_durations",
  "5.10": "develop_schedule",
  "5.11": "plan_cost",
  "5.12": "estimate_costs",
  "5.13": "determine_budget",
  "5.14": "plan_quality",
  "5.15": "plan_resources",
  "5.16": "estimate_resources",
  "5.17": "plan_communications",
  "5.18": "plan_risk_mgmt",
  "5.19": "identify_risks",
  "5.20": "qualitative_risk",
  "5.21": "quantitative_risk",
  "5.22": "plan_risk_responses",
  "5.23": "plan_procurement",
  "5.24": "plan_stakeholder_engagement",
  "6.1": "direct_manage_work",
  "6.2": "manage_knowledge",
  "6.3": "manage_quality",
  "6.4": "acquire_resources",
  "6.5": "develop_team",
  "6.6": "manage_team",
  "6.7": "manage_communications",
  "6.8": "implement_risk_responses",
  "6.9": "conduct_procurements",
  "6.10": "manage_stakeholder_engagement",
  "7.1": "monitor_control_work",
  "7.2": "integrated_change_control",
  "7.3": "validate_scope",
  "7.4": "control_scope",
  "7.5": "control_schedule",
  "7.6": "control_costs",
  "7.7": "control_quality",
  "7.8": "control_resources",
  "7.9": "monitor_communications",
  "7.10": "monitor_risks",
  "7.11": "control_procurements",
  "7.12": "monitor_stakeholder_engagement",
  "8.1": "close_project",
};

/** Helper: Prozess-Label aus Content holen, Fallback auf technischen Namen */
export function getProcessLabel(
  processId: string,
  lang: Lang,
  mode: Mode
): string {
  const entry = LIFECYCLE_CONTENT.processes[processId as keyof typeof LIFECYCLE_CONTENT.processes];
  if (entry) {
    return entry[lang][mode];
  }
  return processId;
}

/** Helper: Gate-Label aus Content holen (0–3) */
export function getGateLabel(
  gateIndex: number,
  lang: Lang,
  mode: Mode
): string {
  const gate = LIFECYCLE_CONTENT.gates[gateIndex as 0 | 1 | 2 | 3];
  if (gate) {
    return gate.label[lang][mode];
  }
  return "";
}

/** Helper: Phasen-Titel aus Content holen */
export function getPhaseTitle(
  phaseIndex: number,
  lang: Lang,
  mode: Mode
): string {
  const phase = LIFECYCLE_CONTENT.phases[phaseIndex as 0 | 1 | 2 | 3 | 4];
  if (phase) {
    return phase.title[lang][mode];
  }
  return "";
}

/** Helper: Tier-Label für Selector (strategic, tactical, operational, undefined) */
export function getTierLabel(
  tier: "strategic" | "tactical" | "operational" | null | undefined,
  lang: Lang,
  mode: Mode
): string {
  if (!tier) return LIFECYCLE_CONTENT.ui.tier_undefined[lang][mode];
  const t = LIFECYCLE_CONTENT.tiers[tier];
  if (t) return t.label[lang][mode];
  return LIFECYCLE_CONTENT.ui.tier_undefined[lang][mode];
}

/** Helper: Formular-Felder für Prozess holen (Fallback: _default) */
export function getFormFields(processId: string) {
  const forms = LIFECYCLE_CONTENT.forms;
  const processForms = forms[processId as keyof typeof forms] ?? forms._default;
  return processForms as Record<string, { label: Record<Lang, Record<Mode, string>>; placeholder: Record<Lang, Record<Mode, string>>; type: string }>;
}
