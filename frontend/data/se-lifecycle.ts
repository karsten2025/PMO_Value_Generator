// data/se-lifecycle.ts

export type SEPhase = {
  id: string;
  color: string; // Tailwind color classes for the border/glow
  icon: string; // Lucide icon name placeholder
  titles: {
    de: { colloquial: string; management: string };
    en: { colloquial: string; management: string };
    es: { colloquial: string; management: string };
  };
  description: {
    de: { colloquial: string; management: string };
    en: { colloquial: string; management: string };
    es: { colloquial: string; management: string };
  };
  downloadLink: string; // Pfad zum PDF
};

export const SE_LIFECYCLE_DATA: SEPhase[] = [
  {
    id: "concept",
    color: "border-orange-500 shadow-orange-500/20",
    icon: "Lightbulb",
    titles: {
      de: { colloquial: "Der Plan & Die Idee", management: "Concept Development" },
      en: { colloquial: "The Plan & Idea", management: "Concept Development" },
      es: { colloquial: "El Plan y la Idea", management: "Desarrollo del Concepto" }
    },
    description: {
      de: {
        colloquial: "Bevor wir Code schreiben, klären wir das 'Warum'. Wir analysieren eure echten Probleme, nicht nur die Symptome.",
        management: "Definition der Business Mission, Stakeholder Requirements und Systemarchitektur angelehnt an ISO 15288."
      },
      en: {
        colloquial: "Before writing code, we define the 'Why'. We analyze real problems, not just symptoms.",
        management: "Definition of business mission, stakeholder requirements, and system architecture ISO 15288 aligned."
      },
      es: {
        colloquial: "Antes de escribir código, definimos el 'Por qué'. Analizamos problemas reales.",
        management: "Definición de la misión y requisitos de los interesados, alineada con los procesos de la norma ISO 15288."
      }
    },
    downloadLink: "/docs/phase1"
  },
  {
    id: "development",
    color: "border-blue-500 shadow-blue-500/20",
    icon: "Cpu",
    titles: {
      de: { colloquial: "Der Bau der Maschine", management: "System Development" },
      en: { colloquial: "Building the Engine", management: "System Development" },
      es: { colloquial: "Construyendo el Motor", management: "Desarrollo del Sistema" }
    },
    description: {
      de: {
        colloquial: "Hier verbinden wir eure Datenquellen (SAP, Azure) mit unserer Logik. Aus Einzelteilen wird ein System.",
        management: "Implementation, Integration und Verifizierung der Subsysteme. Aufbau der Schnittstellen (APIs)."
      },
      en: {
        colloquial: "Connecting your data sources (SAP, Azure) with our logic. Turning parts into a system.",
        management: "Implementation, integration, and verification of subsystems. API construction."
      },
      es: {
        colloquial: "Conectando sus fuentes de datos con nuestra lógica. Convirtiendo partes en un sistema.",
        management: "Implementación, integración y verificación de subsistemas."
      }
    },
    downloadLink: "/docs/phase2"
  },
  {
    id: "production",
    color: "border-green-500 shadow-green-500/20",
    icon: "Rocket",
    titles: {
      de: { colloquial: "Start & Training", management: "System Production" },
      en: { colloquial: "Launch & Training", management: "System Production" },
      es: { colloquial: "Lanzamiento y Formación", management: "Producción del Sistema" }
    },
    description: {
      de: {
        colloquial: "Wir werfen das Tool nicht über den Zaun. Wir sorgen dafür, dass euer Team es versteht und nutzt.",
        management: "Transition in die operative Umgebung, Validierung der Funktionalität und User Enablement."
      },
      en: {
        colloquial: "We don't just hand it over. We ensure your team understands and uses it.",
        management: "Transition to operational environment, validation of functionality, and user enablement."
      },
      es: {
        colloquial: "No solo lo entregamos. Aseguramos que su equipo lo entienda y lo use.",
        management: "Transición al entorno operativo, validación y habilitación de usuarios."
      }
    },
    downloadLink: "/docs/se-phase-3-production.pdf"
  },
  {
    id: "utilization",
    color: "border-yellow-500 shadow-yellow-500/20",
    icon: "Activity",
    titles: {
      de: { colloquial: "Täglicher Nutzen", management: "Utilization & Support" },
      en: { colloquial: "Daily Value", management: "Utilization & Support" },
      es: { colloquial: "Valor Diario", management: "Utilización y Soporte" }
    },
    description: {
      de: {
        colloquial: "Das System läuft. Es generiert Daten, warnt vor Risiken und macht euer Leben einfacher.",
        management: "Operativer Betrieb, Systemüberwachung und Realisierung des ROI (Value Generation)."
      },
      en: {
        colloquial: "The system runs. It generates data, warns of risks, and simplifies your life.",
        management: "Operational execution, system monitoring, and realization of ROI (Value Generation)."
      },
      es: {
        colloquial: "El sistema funciona. Genera datos, advierte de riesgos y simplifica su vida.",
        management: "Ejecución operativa, monitoreo del sistema y realización del ROI."
      }
    },
    downloadLink: "/docs/se-phase-4-utilization.pdf"
  },
  {
    id: "retirement",
    color: "border-indigo-500 shadow-indigo-500/20",
    icon: "RefreshCw", // Symbolizing Evolution instead of trash
    titles: {
      de: { colloquial: "Lernen & Verbessern", management: "Evolution (Retirement)" },
      en: { colloquial: "Learn & Improve", management: "Evolution (Retirement)" },
      es: { colloquial: "Aprender y Mejorar", management: "Evolución (Retiro)" }
    },
    description: {
      de: {
        colloquial: "Nichts bleibt für immer. Wir lernen aus den Daten und bauen das nächste Update.",
        management: "Analyse der Systemleistung, Refactoring und geplanter Austausch veralteter Komponenten."
      },
      en: {
        colloquial: "Nothing lasts forever. We learn from data and build the next update.",
        management: "System performance analysis, refactoring, and planned replacement of legacy components."
      },
      es: {
        colloquial: "Nada es para siempre. Aprendemos de los datos y construimos la próxima actualización.",
        management: "Análisis del rendimiento del sistema, refactorización y reemplazo planificado."
      }
    },
    downloadLink: "/docs/se-phase-5-retirement.pdf"
  }
];
