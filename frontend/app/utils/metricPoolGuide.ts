/**
 * Metric Pool Guide - Greenhorn-freundliche Erklärung
 * Dient gleichzeitig als Wissensquelle für den AI-Chatbot
 * 
 * 2x3 Matrix: DE/EN/ES × Colloquial/Management
 */

export const METRIC_POOL_GUIDE = {
  title: {
    de: {
      colloquial: "So funktioniert die Metrik-Auswahl",
      management: "Logic Model Framework: Metrik-Kategorien"
    },
    en: {
      colloquial: "How Metric Selection Works",
      management: "Logic Model Framework: Metric Categories"
    },
    es: {
      colloquial: "Cómo funciona la selección de métricas",
      management: "Marco de Modelo Lógico: Categorías de Métricas"
    }
  },

  introduction: {
    de: {
      colloquial: "Du siehst oben 5 farbige Buttons (Tabs). Jeder Button steht für eine Phase deines PMO-Prozesses. Klicke auf einen Button, um die passenden Metriken zu sehen. Du kannst bis zu 5 Metriken pro Phase auswählen.",
      management: "Die horizontale Tab-Leiste repräsentiert die 5 Phasen des Logic Model Frameworks. Durch Klick auf einen Tab werden die zugehörigen Metriken-Pools geladen. Pro Phase können bis zu 5 Metriken selektiert werden zur Prozess-Instanziierung."
    },
    en: {
      colloquial: "You see 5 colored buttons (tabs) at the top. Each button represents a phase of your PMO process. Click a button to see the matching metrics. You can select up to 5 metrics per phase.",
      management: "The horizontal tab bar represents the 5 phases of the Logic Model Framework. Clicking a tab loads the associated metric pools. Up to 5 metrics per phase can be selected for process instantiation."
    },
    es: {
      colloquial: "Ves 5 botones de colores (pestañas) arriba. Cada botón representa una fase de tu proceso PMO. Haz clic en un botón para ver las métricas correspondientes. Puedes seleccionar hasta 5 métricas por fase.",
      management: "La barra de pestañas horizontal representa las 5 fases del Marco de Modelo Lógico. Al hacer clic en una pestaña, se cargan los pools de métricas asociados. Se pueden seleccionar hasta 5 métricas por fase para la instanciación del proceso."
    }
  },

  categories: [
    {
      id: "input",
      icon: "📥",
      color: "Blau / Blue / Azul",
      title: {
        de: "INPUT-Metriken",
        en: "INPUT Metrics",
        es: "Métricas de ENTRADA"
      },
      explanation: {
        de: {
          colloquial: "Was stecke ich rein? Hier wählst du Metriken, die messen, welche Ressourcen du in deinen Prozess investierst. Zum Beispiel: Budget für Schulungen, Zeitaufwand, Anzahl der Trainer.",
          management: "Input-Metriken quantifizieren die Ressourcenallokation für die Prozessinitiierung. Erfasst werden finanzielle, temporale und personelle Investments zur Etablierung strategischer Prozess-Governance."
        },
        en: {
          colloquial: "What do I put in? Here you choose metrics that measure which resources you invest in your process. For example: training budget, time spent, number of trainers.",
          management: "Input metrics quantify resource allocation for process initiation. Financial, temporal, and personnel investments for establishing strategic process governance are captured."
        },
        es: {
          colloquial: "¿Qué pongo? Aquí eliges métricas que miden qué recursos inviertes en tu proceso. Por ejemplo: presupuesto de capacitación, tiempo invertido, número de capacitadores.",
          management: "Las métricas de entrada cuantifican la asignación de recursos para la iniciación del proceso. Se capturan inversiones financieras, temporales y de personal para establecer la gobernanza estratégica del proceso."
        }
      },
      example: {
        de: "Beispiel: 'Schulungsbudget: 5.000€ eingeplant'",
        en: "Example: 'Training budget: €5,000 planned'",
        es: "Ejemplo: 'Presupuesto de capacitación: €5,000 planificado'"
      }
    },
    {
      id: "process",
      icon: "⚙️",
      color: "Lila / Purple / Púrpura",
      title: {
        de: "PROCESS-Activities",
        en: "PROCESS Activities",
        es: "Actividades de PROCESO"
      },
      explanation: {
        de: {
          colloquial: "Was mache ich konkret? Hier trackst du die Aktivitäten, die du durchführst. Zum Beispiel: Anzahl Workshops, durchgeführte Meetings, verschickte E-Mails.",
          management: "Process-Metriken erfassen die systematische Durchführung von Governance-Aktivitäten. KPIs dokumentieren die operative Exzellenz in der Prozess-Execution und Stakeholder-Interaktion."
        },
        en: {
          colloquial: "What do I actually do? Here you track the activities you perform. For example: number of workshops, meetings held, emails sent.",
          management: "Process metrics capture the systematic execution of governance activities. KPIs document operational excellence in process execution and stakeholder interaction."
        },
        es: {
          colloquial: "¿Qué hago realmente? Aquí rastreas las actividades que realizas. Por ejemplo: número de talleres, reuniones realizadas, correos electrónicos enviados.",
          management: "Las métricas de proceso capturan la ejecución sistemática de actividades de gobernanza. Los KPI documentan la excelencia operativa en la ejecución del proceso y la interacción con las partes interesadas."
        }
      },
      example: {
        de: "Beispiel: '3 Workshops durchgeführt, 45 Teilnehmer erreicht'",
        en: "Example: '3 workshops conducted, 45 participants reached'",
        es: "Ejemplo: '3 talleres realizados, 45 participantes alcanzados'"
      }
    },
    {
      id: "output",
      icon: "📤",
      color: "Grün / Green / Verde",
      title: {
        de: "OUTPUT-Metriken",
        en: "OUTPUT Metrics",
        es: "Métricas de SALIDA"
      },
      explanation: {
        de: {
          colloquial: "Was kommt dabei raus? Hier misst du die direkten Ergebnisse deiner Arbeit. Zum Beispiel: Anzahl erstellter Dokumente, geschulte Personen, produzierte Materialien.",
          management: "Output-Metriken quantifizieren die tangiblen Deliverables der Prozess-Execution. Erfasst werden quantitative Performance-Indikatoren zur Messung der unmittelbaren Wertschöpfung."
        },
        en: {
          colloquial: "What comes out? Here you measure the direct results of your work. For example: number of documents created, people trained, materials produced.",
          management: "Output metrics quantify the tangible deliverables of process execution. Quantitative performance indicators are captured to measure immediate value creation."
        },
        es: {
          colloquial: "¿Qué sale? Aquí mides los resultados directos de tu trabajo. Por ejemplo: número de documentos creados, personas capacitadas, materiales producidos.",
          management: "Las métricas de salida cuantifican los entregables tangibles de la ejecución del proceso. Se capturan indicadores de rendimiento cuantitativos para medir la creación de valor inmediato."
        }
      },
      example: {
        de: "Beispiel: '25 Personen geschult, 5 Handbücher erstellt'",
        en: "Example: '25 people trained, 5 handbooks created'",
        es: "Ejemplo: '25 personas capacitadas, 5 manuales creados'"
      }
    },
    {
      id: "outcome",
      icon: "🎯",
      color: "Orange / Orange / Naranja",
      title: {
        de: "OUTCOME-Metriken",
        en: "OUTCOME Metrics",
        es: "Métricas de RESULTADO"
      },
      explanation: {
        de: {
          colloquial: "Was hat sich verändert? Hier misst du die mittelfristige Wirkung deiner Arbeit. Zum Beispiel: Wissensstand hat sich verbessert, Akzeptanz ist gestiegen, Teams arbeiten besser zusammen.",
          management: "Outcome-Metriken erfassen die strategische Wirkung der PMO-Intervention auf Organisationsebene. KPIs dokumentieren nachhaltige Verhaltensänderungen und Performance-Verbesserungen im Stakeholder-Portfolio."
        },
        en: {
          colloquial: "What has changed? Here you measure the medium-term impact of your work. For example: knowledge level improved, acceptance increased, teams work better together.",
          management: "Outcome metrics capture the strategic impact of PMO intervention at the organizational level. KPIs document sustainable behavioral changes and performance improvements in the stakeholder portfolio."
        },
        es: {
          colloquial: "¿Qué ha cambiado? Aquí mides el impacto a mediano plazo de tu trabajo. Por ejemplo: nivel de conocimiento mejorado, aceptación aumentada, equipos trabajan mejor juntos.",
          management: "Las métricas de resultado capturan el impacto estratégico de la intervención de PMO a nivel organizacional. Los KPI documentan cambios de comportamiento sostenibles y mejoras de rendimiento en la cartera de partes interesadas."
        }
      },
      example: {
        de: "Beispiel: 'Wissenstest: von 45% auf 78% gestiegen'",
        en: "Example: 'Knowledge test: increased from 45% to 78%'",
        es: "Ejemplo: 'Prueba de conocimiento: aumentó del 45% al 78%'"
      }
    },
    {
      id: "feedback",
      icon: "🔄",
      color: "Türkis / Turquoise / Turquesa",
      title: {
        de: "FEEDBACK-Metriken",
        en: "FEEDBACK Metrics",
        es: "Métricas de RETROALIMENTACIÓN"
      },
      explanation: {
        de: {
          colloquial: "Was sagen die Leute? Hier sammelst du Rückmeldungen und Verbesserungsvorschläge. Zum Beispiel: Zufriedenheitswerte, NPS-Score, Anzahl Verbesserungsideen.",
          management: "Feedback-Metriken implementieren eine kontinuierliche Verbesserungsschleife (PDCA-Zyklus). Erfasst werden Stakeholder-Satisfaction-Scores und qualitative Insights zur Prozessoptimierung."
        },
        en: {
          colloquial: "What do people say? Here you collect feedback and suggestions for improvement. For example: satisfaction scores, NPS score, number of improvement ideas.",
          management: "Feedback metrics implement a continuous improvement loop (PDCA cycle). Stakeholder satisfaction scores and qualitative insights for process optimization are captured."
        },
        es: {
          colloquial: "¿Qué dice la gente? Aquí recopilas comentarios y sugerencias de mejora. Por ejemplo: puntuaciones de satisfacción, puntuación NPS, número de ideas de mejora.",
          management: "Las métricas de retroalimentación implementan un ciclo de mejora continua (ciclo PDCA). Se capturan puntuaciones de satisfacción de las partes interesadas y conocimientos cualitativos para la optimización del proceso."
        }
      },
      example: {
        de: "Beispiel: 'Zufriedenheit: 4.2/5 Sterne, 12 Verbesserungsideen'",
        en: "Example: 'Satisfaction: 4.2/5 stars, 12 improvement ideas'",
        es: "Ejemplo: 'Satisfacción: 4.2/5 estrellas, 12 ideas de mejora'"
      }
    }
  ],

  howToUse: {
    de: {
      colloquial: [
        "1️⃣ Klicke auf einen der 5 farbigen Buttons oben (z.B. 'INPUT-Metriken')",
        "2️⃣ Du siehst jetzt 10 Metrik-Karten mit Beschreibungen",
        "3️⃣ Klicke auf eine Karte, um sie auszuwählen (blauer Rahmen = ausgewählt)",
        "4️⃣ Wähle bis zu 5 Metriken pro Kategorie aus",
        "5️⃣ Wiederhole das für alle 5 Kategorien",
        "6️⃣ Am Ende hast du maximal 25 Metriken für deinen Prozess"
      ],
      management: [
        "1️⃣ Tab-Selektion: Klick auf Kategorie-Tab zur Aktivierung des entsprechenden Metrik-Pools",
        "2️⃣ Metrik-Review: Analyse der 10 vorgeschlagenen Metriken inkl. Calculation Method",
        "3️⃣ Metrik-Selektion: Click-to-Select Mechanismus (max. 5 pro Kategorie)",
        "4️⃣ Iterative Konfiguration: Wiederholung für alle 5 Logic Model Phasen",
        "5️⃣ Validation: Finale Review der ausgewählten Metrik-Konstellation",
        "6️⃣ Instantiation: Prozess-Start mit konfigurierten Metriken (max. 25 KPIs)"
      ]
    },
    en: {
      colloquial: [
        "1️⃣ Click one of the 5 colored buttons at the top (e.g., 'INPUT Metrics')",
        "2️⃣ You now see 10 metric cards with descriptions",
        "3️⃣ Click a card to select it (blue border = selected)",
        "4️⃣ Choose up to 5 metrics per category",
        "5️⃣ Repeat for all 5 categories",
        "6️⃣ In the end, you have a maximum of 25 metrics for your process"
      ],
      management: [
        "1️⃣ Tab Selection: Click category tab to activate corresponding metric pool",
        "2️⃣ Metric Review: Analysis of 10 proposed metrics incl. calculation method",
        "3️⃣ Metric Selection: Click-to-select mechanism (max. 5 per category)",
        "4️⃣ Iterative Configuration: Repetition for all 5 Logic Model phases",
        "5️⃣ Validation: Final review of selected metric constellation",
        "6️⃣ Instantiation: Process start with configured metrics (max. 25 KPIs)"
      ]
    },
    es: {
      colloquial: [
        "1️⃣ Haz clic en uno de los 5 botones de colores en la parte superior (p. ej., 'Métricas de ENTRADA')",
        "2️⃣ Ahora ves 10 tarjetas de métricas con descripciones",
        "3️⃣ Haz clic en una tarjeta para seleccionarla (borde azul = seleccionado)",
        "4️⃣ Elige hasta 5 métricas por categoría",
        "5️⃣ Repite para las 5 categorías",
        "6️⃣ Al final, tienes un máximo de 25 métricas para tu proceso"
      ],
      management: [
        "1️⃣ Selección de Pestaña: Clic en pestaña de categoría para activar el pool de métricas correspondiente",
        "2️⃣ Revisión de Métricas: Análisis de 10 métricas propuestas incl. método de cálculo",
        "3️⃣ Selección de Métricas: Mecanismo de clic para seleccionar (máx. 5 por categoría)",
        "4️⃣ Configuración Iterativa: Repetición para todas las 5 fases del Modelo Lógico",
        "5️⃣ Validación: Revisión final de la constelación de métricas seleccionadas",
        "6️⃣ Instanciación: Inicio del proceso con métricas configuradas (máx. 25 KPIs)"
      ]
    }
  },

  whyFiveCategories: {
    de: {
      colloquial: "Warum 5 Kategorien? Weil jeder Prozess diese 5 Phasen durchläuft: Du investierst etwas (Input), machst Aktivitäten (Process), produzierst Ergebnisse (Output), siehst Wirkungen (Outcome) und holst Feedback ein, um besser zu werden (Feedback). Das ist wie beim Kochen: Zutaten kaufen → Kochen → Essen servieren → Alle sind satt & glücklich → 'War lecker, nächstes Mal mehr Salz!'",
      management: "Die 5-Kategorien-Struktur basiert auf dem etablierten Logic Model Framework der Wirkungsmessung. Dieses Framework ermöglicht eine End-to-End-Prozess-Transparenz von Ressourcen-Input bis zur nachhaltigen Outcome-Realisierung. Die Feedback-Schleife implementiert einen kontinuierlichen Verbesserungszyklus (Kaizen-Prinzip)."
    },
    en: {
      colloquial: "Why 5 categories? Because every process goes through these 5 phases: You invest something (Input), do activities (Process), produce results (Output), see effects (Outcome), and get feedback to improve (Feedback). It's like cooking: Buy ingredients → Cook → Serve food → Everyone is full & happy → 'Was tasty, more salt next time!'",
      management: "The 5-category structure is based on the established Logic Model Framework for impact measurement. This framework enables end-to-end process transparency from resource input to sustainable outcome realization. The feedback loop implements a continuous improvement cycle (Kaizen principle)."
    },
    es: {
      colloquial: "¿Por qué 5 categorías? Porque cada proceso pasa por estas 5 fases: Inviertes algo (Entrada), haces actividades (Proceso), produces resultados (Salida), ves efectos (Resultado) y obtienes retroalimentación para mejorar (Retroalimentación). Es como cocinar: Comprar ingredientes → Cocinar → Servir comida → Todos están llenos y felices → '¡Estaba rico, la próxima vez más sal!'",
      management: "La estructura de 5 categorías se basa en el Marco de Modelo Lógico establecido para la medición de impacto. Este marco permite la transparencia del proceso de extremo a extremo desde la entrada de recursos hasta la realización sostenible del resultado. El ciclo de retroalimentación implementa un ciclo de mejora continua (principio Kaizen)."
    }
  },

  lawOfRequisiteVariety: {
    de: {
      colloquial: "Du kannst aus vielen Metriken wählen, weil jedes PMO anders ist. Was für eine Firma wichtig ist (z.B. Budget), ist für eine andere weniger wichtig (z.B. mehr Fokus auf Feedback). Das Tool passt sich an DEIN PMO an, nicht umgekehrt!",
      management: "Das System implementiert Ashby's Law of Requisite Variety: Die Flexibilität des Systems (50 Metriken zur Auswahl) entspricht der Komplexität der PMO-Landschaft (unterschiedliche Organisationsstrukturen, Reifegrade, Branchen). Skalierbarkeit von 5→10→15 Metriken pro Kategorie ohne Code-Änderungen."
    },
    en: {
      colloquial: "You can choose from many metrics because every PMO is different. What's important for one company (e.g., budget) is less important for another (e.g., more focus on feedback). The tool adapts to YOUR PMO, not the other way around!",
      management: "The system implements Ashby's Law of Requisite Variety: The system's flexibility (50 metrics to choose from) matches the complexity of the PMO landscape (different organizational structures, maturity levels, industries). Scalability from 5→10→15 metrics per category without code changes."
    },
    es: {
      colloquial: "Puedes elegir entre muchas métricas porque cada PMO es diferente. Lo que es importante para una empresa (p. ej., presupuesto) es menos importante para otra (p. ej., más enfoque en retroalimentación). ¡La herramienta se adapta a TU PMO, no al revés!",
      management: "El sistema implementa la Ley de Variedad Requerida de Ashby: La flexibilidad del sistema (50 métricas para elegir) coincide con la complejidad del panorama de PMO (diferentes estructuras organizacionales, niveles de madurez, industrias). Escalabilidad de 5→10→15 métricas por categoría sin cambios de código."
    }
  },

  commonQuestions: [
    {
      question: {
        de: "Muss ich alle 5 Kategorien ausfüllen?",
        en: "Do I have to fill all 5 categories?",
        es: "¿Tengo que completar las 5 categorías?"
      },
      answer: {
        de: {
          colloquial: "Nein! Du kannst mit 1-2 Kategorien starten (z.B. nur Input + Output) und später mehr hinzufügen, wenn du bereit bist.",
          management: "Nein, die Metrik-Selektion ist modular. Ein minimaler MVP kann mit Input- und Output-Metriken starten. Outcome- und Feedback-Metriken können iterativ ergänzt werden (Agile Approach)."
        },
        en: {
          colloquial: "No! You can start with 1-2 categories (e.g., only Input + Output) and add more later when you're ready.",
          management: "No, metric selection is modular. A minimal MVP can start with input and output metrics. Outcome and feedback metrics can be added iteratively (Agile Approach)."
        },
        es: {
          colloquial: "¡No! Puedes comenzar con 1-2 categorías (p. ej., solo Entrada + Salida) y agregar más más tarde cuando estés listo.",
          management: "No, la selección de métricas es modular. Un MVP mínimo puede comenzar con métricas de entrada y salida. Las métricas de resultado y retroalimentación se pueden agregar iterativamente (Enfoque Ágil)."
        }
      }
    },
    {
      question: {
        de: "Was bedeutet 'Law of Requisite Variety'?",
        en: "What does 'Law of Requisite Variety' mean?",
        es: "¿Qué significa 'Ley de Variedad Requerida'?"
      },
      answer: {
        de: {
          colloquial: "Das bedeutet: Je komplexer deine Situation, desto mehr Auswahlmöglichkeiten brauchst du. Wenn dein PMO einfach ist, wählst du 5 Metriken. Wenn es komplex ist, wählst du 25. Das Tool zwingt dich zu nichts!",
          management: "Ashby's Law: 'Only variety can destroy variety.' Ein System muss mindestens so viel Flexibilität bieten, wie die Vielfalt der zu bewältigenden Herausforderungen. Die 50-Metrik-Auswahl ermöglicht Anpassung an unterschiedliche PMO-Reifegrade, Branchen und Organisationsstrukturen."
        },
        en: {
          colloquial: "It means: The more complex your situation, the more options you need. If your PMO is simple, choose 5 metrics. If it's complex, choose 25. The tool doesn't force you to do anything!",
          management: "Ashby's Law: 'Only variety can destroy variety.' A system must offer at least as much flexibility as the variety of challenges to be mastered. The 50-metric selection enables adaptation to different PMO maturity levels, industries, and organizational structures."
        },
        es: {
          colloquial: "Significa: Cuanto más compleja sea tu situación, más opciones necesitas. Si tu PMO es simple, elige 5 métricas. Si es complejo, elige 25. ¡La herramienta no te obliga a nada!",
          management: "Ley de Ashby: 'Solo la variedad puede destruir la variedad.' Un sistema debe ofrecer al menos tanta flexibilidad como la variedad de desafíos a dominar. La selección de 50 métricas permite la adaptación a diferentes niveles de madurez de PMO, industrias y estructuras organizacionales."
        }
      }
    },
    {
      question: {
        de: "Kann ich später Metriken ändern?",
        en: "Can I change metrics later?",
        es: "¿Puedo cambiar las métricas más tarde?"
      },
      answer: {
        de: {
          colloquial: "Ja! Das System ist flexibel. Du kannst jederzeit zurückkommen, Metriken abwählen oder neue hinzufügen. Das Tool lernt mit dir mit!",
          management: "Ja, das System implementiert einen iterativen Metrik-Refinement-Prozess. Metriken können pro Prozess-Instanz angepasst werden. Historische Daten bleiben erhalten (Audit Trail), neue Metriken werden prospektiv erfasst."
        },
        en: {
          colloquial: "Yes! The system is flexible. You can come back anytime, deselect metrics, or add new ones. The tool learns with you!",
          management: "Yes, the system implements an iterative metric refinement process. Metrics can be adjusted per process instance. Historical data is retained (audit trail), new metrics are captured prospectively."
        },
        es: {
          colloquial: "¡Sí! El sistema es flexible. Puedes volver en cualquier momento, deseleccionar métricas o agregar nuevas. ¡La herramienta aprende contigo!",
          management: "Sí, el sistema implementa un proceso iterativo de refinamiento de métricas. Las métricas se pueden ajustar por instancia de proceso. Los datos históricos se conservan (pista de auditoría), las nuevas métricas se capturan prospectivamente."
        }
      }
    }
  ]
};


