/**
 * PMO Impact Cycle Data
 * 
 * Die 10 Schritte des PMO Impact Cycle mit 2x3 Matrix (DE/EN/ES × Colloquial/Management)
 * 
 * Rechtlicher Schutz: Alle Begriffe paraphrasiert, eigene Nomenklatur
 * - "PMO Value Ring" → "PMO Impact Cycle"
 * - "Flywheel" → "Value Engine"
 * - "Steps" → "Milestones"
 */

export const IMPACT_CYCLE_DATA = [
  { 
    id: '1', 
    internal_code: 'DIS_AWR',
    title: 'Awareness & Education',
    matrix: {
      de: { 
        colloquial: "Wir zeigen allen Beteiligten, was das PMO macht und wie es ihnen helfen kann. Es geht darum, Vertrauen aufzubauen und zu erklären, welchen Nutzen unsere Arbeit bringt.", 
        management: "Strategische Positionierung des PMO durch gezielte Stakeholder-Kommunikation. Entwicklung von Awareness-Kampagnen zur Steigerung der PMO-Sichtbarkeit und Etablierung als wertschöpfender Geschäftspartner." 
      },
      en: { 
        colloquial: "We show everyone involved what the PMO does and how it can help them. It's about building trust and explaining the benefits our work brings.", 
        management: "Strategic positioning of the PMO through targeted stakeholder communication. Development of awareness campaigns to increase PMO visibility and establish it as a value-adding business partner." 
      },
      es: { 
        colloquial: "Mostramos a todos los involucrados qué hace la PMO y cómo puede ayudarles. Se trata de generar confianza y explicar los beneficios que aporta nuestro trabajo.", 
        management: "Posicionamiento estratégico de la PMO mediante comunicación dirigida a los interesados. Desarrollo de campañas de concienciación para aumentar la visibilidad de la PMO y establecerla como socio empresarial que agrega valor." 
      }
    }
  },
  { 
    id: '2', 
    internal_code: 'DIS_NEA',
    title: 'Requirements Discovery',
    matrix: {
      de: { 
        colloquial: "Wir hören genau zu, was die Teams wirklich brauchen. Durch Gespräche und Workshops finden wir heraus, wo der Schuh drückt und welche Probleme gelöst werden müssen.", 
        management: "Systematische Erhebung und Analyse von Stakeholder-Anforderungen mittels strukturierter Assessments. Identifikation von Optimierungspotenzialen und Priorisierung nach Business Impact." 
      },
      en: { 
        colloquial: "We listen carefully to what teams really need. Through conversations and workshops, we discover pain points and which problems need to be solved.", 
        management: "Systematic collection and analysis of stakeholder requirements through structured assessments. Identification of optimization potential and prioritization based on business impact." 
      },
      es: { 
        colloquial: "Escuchamos atentamente lo que los equipos realmente necesitan. A través de conversaciones y talleres, descubrimos los puntos problemáticos y qué problemas deben resolverse.", 
        management: "Recopilación y análisis sistemático de requisitos de los interesados mediante evaluaciones estructuradas. Identificación de potencial de optimización y priorización según el impacto empresarial." 
      }
    }
  },
  { 
    id: '3', 
    internal_code: 'PLN_VPR',
    title: 'Benefit Definition',
    matrix: {
      de: { 
        colloquial: "Wir formulieren klar und verständlich, welchen konkreten Nutzen unsere Lösungen bringen. Dabei zeigen wir auf, wie wir die erkannten Probleme angehen werden.", 
        management: "Entwicklung einer evidenzbasierten Value Proposition, die PMO-Services mit strategischen Unternehmenszielen verknüpft. Quantifizierung des erwarteten ROI und Definition messbarer Erfolgskriterien." 
      },
      en: { 
        colloquial: "We clearly articulate what concrete benefits our solutions bring. We show how we'll address the identified problems.", 
        management: "Development of an evidence-based value proposition linking PMO services to strategic business objectives. Quantification of expected ROI and definition of measurable success criteria." 
      },
      es: { 
        colloquial: "Formulamos claramente qué beneficios concretos aportan nuestras soluciones. Mostramos cómo abordaremos los problemas identificados.", 
        management: "Desarrollo de una propuesta de valor basada en evidencia que vincula los servicios de PMO con los objetivos estratégicos empresariales. Cuantificación del ROI esperado y definición de criterios de éxito medibles." 
      }
    }
  },
  { 
    id: '4', 
    internal_code: 'PLN_SDE',
    title: 'Solution Design',
    matrix: {
      de: { 
        colloquial: "Wir entwickeln konkrete Angebote und Arbeitsweisen, die genau zu den Bedürfnissen der Teams passen. Dabei achten wir darauf, dass alles praktisch umsetzbar ist.", 
        management: "Konzeption maßgeschneiderter PMO-Services mit klaren Service Level Agreements (SLAs). Definition von Prozessen, Governance-Strukturen und Ressourcenallokation zur Sicherstellung nachhaltiger Leistungserbringung." 
      },
      en: { 
        colloquial: "We develop concrete offerings and ways of working that match team needs exactly. We ensure everything is practically implementable.", 
        management: "Design of tailored PMO services with clear Service Level Agreements (SLAs). Definition of processes, governance structures, and resource allocation to ensure sustainable service delivery." 
      },
      es: { 
        colloquial: "Desarrollamos ofertas concretas y formas de trabajo que se ajustan exactamente a las necesidades de los equipos. Nos aseguramos de que todo sea prácticamente implementable.", 
        management: "Diseño de servicios PMO personalizados con Acuerdos de Nivel de Servicio (SLAs) claros. Definición de procesos, estructuras de gobernanza y asignación de recursos para garantizar la prestación sostenible de servicios." 
      }
    }
  },
  { 
    id: '5', 
    internal_code: 'IMP_ONB',
    title: 'Service Launch',
    matrix: {
      de: { 
        colloquial: "Wir führen neue Angebote schrittweise ein und begleiten die Teams dabei. Mit Schulungen und Unterstützung sorgen wir dafür, dass alle gut damit arbeiten können.", 
        management: "Implementierung eines strukturierten Change-Management-Prozesses für Service-Rollouts. Durchführung von Trainings, Kommunikationskampagnen und Bereitstellung von Support-Strukturen zur Maximierung der Adoption-Rate." 
      },
      en: { 
        colloquial: "We introduce new offerings step by step and support teams along the way. With training and assistance, we ensure everyone can work well with them.", 
        management: "Implementation of a structured change management process for service rollouts. Execution of training, communication campaigns, and provision of support structures to maximize adoption rates." 
      },
      es: { 
        colloquial: "Introducimos nuevas ofertas paso a paso y acompañamos a los equipos en el camino. Con capacitación y apoyo, nos aseguramos de que todos puedan trabajar bien con ellas.", 
        management: "Implementación de un proceso estructurado de gestión del cambio para el lanzamiento de servicios. Ejecución de capacitaciones, campañas de comunicación y provisión de estructuras de soporte para maximizar las tasas de adopción." 
      }
    }
  },
  { 
    id: '6', 
    internal_code: 'IMP_OPS',
    title: 'Daily Operations',
    matrix: {
      de: { 
        colloquial: "Wir stellen sicher, dass alle vereinbarten Leistungen zuverlässig erbracht werden. Dabei bleiben wir im engen Austausch mit den Teams und reagieren schnell auf Fragen.", 
        management: "Operative Exzellenz durch kontinuierliche SLA-Erfüllung und Performance-Management. Etablierung effizienter Eskalationsprozesse und Ressourcen-Steuerung zur Gewährleistung konsistenter Service-Qualität." 
      },
      en: { 
        colloquial: "We ensure all agreed services are delivered reliably. We stay in close contact with teams and respond quickly to questions.", 
        management: "Operational excellence through continuous SLA compliance and performance management. Establishment of efficient escalation processes and resource management to ensure consistent service quality." 
      },
      es: { 
        colloquial: "Nos aseguramos de que todos los servicios acordados se entreguen de manera confiable. Mantenemos contacto cercano con los equipos y respondemos rápidamente a las preguntas.", 
        management: "Excelencia operativa mediante el cumplimiento continuo de SLA y gestión del rendimiento. Establecimiento de procesos de escalación eficientes y gestión de recursos para garantizar una calidad de servicio consistente." 
      }
    }
  },
  { 
    id: '7', 
    internal_code: 'OPT_MON',
    title: 'Performance Tracking',
    matrix: {
      de: { 
        colloquial: "Wir behalten im Blick, wie gut unsere Angebote funktionieren. Mit Kennzahlen und Feedback prüfen wir regelmäßig, ob wir auf dem richtigen Weg sind.", 
        management: "Implementierung eines KPI-basierten Performance-Monitoring-Systems. Nutzung von Dashboards und Reporting-Mechanismen zur Echtzeitverfolgung von Service-Effizienz und Compliance-Kennzahlen." 
      },
      en: { 
        colloquial: "We keep track of how well our offerings are performing. With metrics and feedback, we regularly check if we're on the right path.", 
        management: "Implementation of a KPI-based performance monitoring system. Use of dashboards and reporting mechanisms for real-time tracking of service efficiency and compliance metrics." 
      },
      es: { 
        colloquial: "Hacemos seguimiento de qué tan bien están funcionando nuestras ofertas. Con métricas y retroalimentación, verificamos regularmente si estamos en el camino correcto.", 
        management: "Implementación de un sistema de monitoreo de rendimiento basado en KPIs. Uso de paneles y mecanismos de informes para el seguimiento en tiempo real de la eficiencia del servicio y métricas de cumplimiento." 
      }
    }
  },
  { 
    id: '8', 
    internal_code: 'OPT_IMP',
    title: 'Continuous Enhancement',
    matrix: {
      de: { 
        colloquial: "Wir verbessern unsere Arbeitsweise kontinuierlich. Basierend auf Erfahrungen und Rückmeldungen passen wir Prozesse an und entwickeln unsere Angebote weiter.", 
        management: "Systematisches Service-Maturity-Management durch Gap-Analysen und Optimierungsroadmaps. Priorisierung von Verbesserungsmaßnahmen nach Wertbeitrag und strategischer Alignment." 
      },
      en: { 
        colloquial: "We continuously improve our way of working. Based on experience and feedback, we adjust processes and further develop our offerings.", 
        management: "Systematic service maturity management through gap analyses and optimization roadmaps. Prioritization of improvement measures based on value contribution and strategic alignment." 
      },
      es: { 
        colloquial: "Mejoramos continuamente nuestra forma de trabajo. Basándonos en la experiencia y la retroalimentación, ajustamos procesos y desarrollamos aún más nuestras ofertas.", 
        management: "Gestión sistemática de madurez del servicio mediante análisis de brechas y hojas de ruta de optimización. Priorización de medidas de mejora según la contribución de valor y alineación estratégica." 
      }
    }
  },
  { 
    id: '9', 
    internal_code: 'IMP_VDL',
    title: 'Outcome Realization',
    matrix: {
      de: { 
        colloquial: "Wir messen und zeigen, welche positiven Ergebnisse unsere Arbeit gebracht hat. Dabei nutzen wir konkrete Beispiele und Zahlen, die für alle nachvollziehbar sind.", 
        management: "Quantifizierung und Kommunikation des realisierten Business Value durch Outcome-basierte Metriken. Nachweis der Zielerreichung mittels ROI-Analysen, Benefit-Realisierungs-Reports und Strategic-Alignment-Scores." 
      },
      en: { 
        colloquial: "We measure and demonstrate what positive results our work has delivered. We use concrete examples and numbers that everyone can understand.", 
        management: "Quantification and communication of realized business value through outcome-based metrics. Evidence of goal achievement via ROI analyses, benefit realization reports, and strategic alignment scores." 
      },
      es: { 
        colloquial: "Medimos y demostramos qué resultados positivos ha aportado nuestro trabajo. Utilizamos ejemplos concretos y cifras que todos puedan entender.", 
        management: "Cuantificación y comunicación del valor empresarial realizado mediante métricas basadas en resultados. Evidencia del logro de objetivos a través de análisis de ROI, informes de realización de beneficios y puntuaciones de alineación estratégica." 
      }
    }
  },
  { 
    id: '10', 
    internal_code: 'IMP_REC',
    title: 'Stakeholder Validation',
    matrix: {
      de: { 
        colloquial: "Wir stellen sicher, dass alle Beteiligten den Wert unserer Arbeit erkennen und schätzen. Das Feedback nutzen wir, um noch besser zu werden und neue Verbesserungszyklen zu starten.", 
        management: "Systematische Erfassung und Amplifikation von Stakeholder-Anerkennung. Nutzung von Satisfaction-Scores, Testimonials und Executive-Sponsorship zur Legitimation weiterer PMO-Investitionen und Initiierung neuer Optimierungszyklen." 
      },
      en: { 
        colloquial: "We ensure all stakeholders recognize and appreciate the value of our work. We use feedback to improve further and start new improvement cycles.", 
        management: "Systematic capture and amplification of stakeholder recognition. Use of satisfaction scores, testimonials, and executive sponsorship to legitimize further PMO investments and initiate new optimization cycles." 
      },
      es: { 
        colloquial: "Nos aseguramos de que todos los interesados reconozcan y aprecien el valor de nuestro trabajo. Utilizamos la retroalimentación para mejorar aún más e iniciar nuevos ciclos de mejora.", 
        management: "Captura y amplificación sistemática del reconocimiento de los interesados. Uso de puntuaciones de satisfacción, testimonios y patrocinio ejecutivo para legitimar más inversiones en PMO e iniciar nuevos ciclos de optimización." 
      }
    }
  }
];

