"use client";

/*
 * PMO Impact Cycle - Value Engine Visualisierung
 * 
 * Basiert auf: PMO Practice Guide (PMI)
 * Rechtlicher Schutz: Alle Begriffe paraphrasiert und eigene Nomenklatur verwendet
 * - "PMO Value Ring" → "PMO Impact Cycle"
 * - "Flywheel" → "Value Engine"
 * - "Steps" → "Milestones"
 * 
 * Die 10 Schritte mit vollständiger 2×3 Matrix (DE/EN/ES × Normal/Management)
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Languages, User, Target, Layers, Settings, TrendingUp, Users as UsersIcon, CheckCircle, LayoutGrid, Network } from 'lucide-react';
import uiLabels from '../mock/ui-labels-matrix.json';
import kpiLibrary from '../mock/kpi-library-mock.json';
import ImpactNode from './components/ImpactNode';
import PortfolioHealthHub from './components/PortfolioHealthHub';
import PortfolioSelector from './components/PortfolioSelector';
import PortfolioProjectList from './components/PortfolioProjectList';
import { usePortfolio } from '@/app/contexts/PortfolioContext';
import { supabase, InstanceMetric } from '@/lib/supabase';

// 1. Die 2x3 Matrix Daten (Rechtlich sicher: "PMO Impact Cycle")
// Basierend auf den 10 Schritten des PMO Practice Guide, paraphrasiert
const IMPACT_CYCLE_DATA = [
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

// Typen für KPI-Werte
interface KPIValue {
  kpiId: string;
  targetValue: number;
  currentValue: number;
}

interface MilestoneCompletion {
  [milestoneId: string]: number; // 0-100%
}

// Custom Node Wrapper für Health Hub
function HealthHubNode({ data }: any) {
  return (
    <div className="health-hub-wrapper">
      <PortfolioHealthHub
        strategicScore={data.strategicScore}
        tacticalScore={data.tacticalScore}
        operationalScore={data.operationalScore}
        totalImpactScore={data.totalImpactScore}
        portfolioName={data.portfolioName}
      />
    </div>
  );
}

// Custom Node Types für ReactFlow
const nodeTypes = {
  impactNode: ImpactNode,
  healthHub: HealthHubNode,
};

export default function FlywheelPage() {
  // Portfolio Context
  const { selectedPortfolio } = usePortfolio();

  // UI State
  const [lang, setLang] = useState<'de' | 'en' | 'es'>('de');
  const [mode, setMode] = useState<'colloquial' | 'management'>('colloquial');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [strategicNotes, setStrategicNotes] = useState<string>('');
  const [tacticalNotes, setTacticalNotes] = useState<string>('');
  const [operationalNotes, setOperationalNotes] = useState<string>('');
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
  const [kpiValues, setKpiValues] = useState<KPIValue[]>([]);
  
  // View State: Impact Cycle oder Projects List
  const [view, setView] = useState<'cycle' | 'projects'>('cycle');
  
  // DB State
  const [instanceMetrics, setInstanceMetrics] = useState<InstanceMetric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [milestoneCompletions, setMilestoneCompletions] = useState<MilestoneCompletion>({});
  
  // Health Hub Scores
  const [strategicScore, setStrategicScore] = useState(0);
  const [tacticalScore, setTacticalScore] = useState(0);
  const [operationalScore, setOperationalScore] = useState(0);
  const [totalImpactScore, setTotalImpactScore] = useState(0);

  // Lade KPI-Metriken aus Supabase für das gewählte Portfolio
  const loadMetricsForPortfolio = useCallback(async () => {
    if (!selectedPortfolio) {
      setInstanceMetrics([]);
      setMilestoneCompletions({});
      setStrategicScore(0);
      setTacticalScore(0);
      setOperationalScore(0);
      setTotalImpactScore(0);
      return;
    }

    try {
      setIsLoadingMetrics(true);
      
      const { data, error } = await supabase
        .from('pmo_kpi_values')
        .select('*')
        .eq('portfolio_id', selectedPortfolio.id);

      if (error) throw error;

      setInstanceMetrics(data || []);

      // Berechne Completion für jeden Step basierend auf echten Daten
      const completions: MilestoneCompletion = {};
      
      IMPACT_CYCLE_DATA.forEach(step => {
        const stepMetrics = (data || []).filter(m => m.step_id === parseInt(step.id));
        
        if (stepMetrics.length > 0) {
          // Berechne durchschnittliche Erreichung für alle KPIs dieses Steps
          const avgCompletion = stepMetrics.reduce((sum, metric) => {
            const achievement = metric.target_value > 0 
              ? Math.min((metric.actual_value / metric.target_value) * 100, 100)
              : 0;
            return sum + achievement;
          }, 0) / stepMetrics.length;
          
          completions[step.id] = Math.round(avgCompletion);
        } else {
          completions[step.id] = 0;
        }
      });

      setMilestoneCompletions(completions);

      // ========================================
      // HEALTH HUB SCORES BERECHNEN
      // ========================================
      const metrics = data || [];
      
      if (metrics.length === 0) {
        setStrategicScore(0);
        setTacticalScore(0);
        setOperationalScore(0);
        setTotalImpactScore(0);
      } else {
        // Gruppiere Metriken nach KPI-Kategorie
        const strategicMetrics: InstanceMetric[] = [];
        const tacticalMetrics: InstanceMetric[] = [];
        const operationalMetrics: InstanceMetric[] = [];

        metrics.forEach(metric => {
          const kpiInfo = kpiLibrary.kpis.find((k: any) => k.id === metric.kpi_id);
          if (kpiInfo) {
            if (kpiInfo.kpi_type === 'strategic') {
              strategicMetrics.push(metric);
            } else if (kpiInfo.kpi_type === 'tactical') {
              tacticalMetrics.push(metric);
            } else if (kpiInfo.kpi_type === 'operational') {
              operationalMetrics.push(metric);
            }
          }
        });

        // Berechne Durchschnitte
        const calcAverage = (metricsList: InstanceMetric[]) => {
          if (metricsList.length === 0) return 0;
          const sum = metricsList.reduce((acc, m) => {
            const achievement = m.target_value > 0
              ? Math.min((m.actual_value / m.target_value) * 100, 100)
              : 0;
            return acc + achievement;
          }, 0);
          return Math.round(sum / metricsList.length);
        };

        const strategic = calcAverage(strategicMetrics);
        const tactical = calcAverage(tacticalMetrics);
        const operational = calcAverage(operationalMetrics);
        
        // Gewichteter Durchschnitt (Strategic 40%, Tactical 30%, Operational 30%)
        const total = Math.round((strategic * 0.4) + (tactical * 0.3) + (operational * 0.3));

        console.log('🎯 Health Hub Scores berechnet:', {
          strategic,
          tactical,
          operational,
          total,
          metricsCount: metrics.length,
          strategicCount: strategicMetrics.length,
          tacticalCount: tacticalMetrics.length,
          operationalCount: operationalMetrics.length
        });

        setStrategicScore(strategic);
        setTacticalScore(tactical);
        setOperationalScore(operational);
        setTotalImpactScore(total);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Metriken:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [selectedPortfolio]);


  // Lade Metriken wenn Portfolio wechselt
  useEffect(() => {
    loadMetricsForPortfolio();
  }, [loadMetricsForPortfolio]);

  // 2. Kreis-Layout Logik (Mathe für das Value Engine)
  const nodes = useMemo(() => {
    const radius = 450; // Größerer Radius für mehr Platz
    const centerX = 500; // Zentrum des Diagramms X
    const centerY = 400; // Zentrum des Diagramms Y
  
    // Impact Cycle Nodes (auf dem Kreisumfang)
    const impactNodes = IMPACT_CYCLE_DATA.map((item, index) => {
      // Winkel berechnen (Start bei -90 Grad, damit der erste Knoten oben ist)
      const angle = (index / IMPACT_CYCLE_DATA.length) * 2 * Math.PI - Math.PI / 2;
      
      // Position auf dem Kreisumfang
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
      // Hole Completion-Rate für diesen Milestone
      const completion = milestoneCompletions[item.id] || 0;

      return {
        id: item.id,
        type: 'impactNode', // Verwende Custom Node Type
        // Wir ziehen 110 (halbe Breite) und 50 (halbe geschätzte Höhe) ab, 
        // damit der KNOTEN-MITTELPUNKT auf dem Kreis liegt
        position: { x: x - 110, y: y - 40 }, 
        data: { 
          label: item.matrix[lang][mode],
          completion,
          mode,
          stepNumber: parseInt(item.id)
        },
      };
    });

    // Health Hub Node (in der Mitte) - NOCH GRÖßER (500x500)!
    const healthHubNode = {
      id: 'health-hub',
      type: 'healthHub',
      position: { x: centerX - 250, y: centerY - 250 }, // Zentriert (500x500 Komponente)
      data: {
        strategicScore,
        tacticalScore,
        operationalScore,
        totalImpactScore,
        portfolioName: selectedPortfolio?.name || 'Portfolio'
      },
      draggable: false,
      selectable: false,
    };

    return [...impactNodes, healthHubNode];
  }, [lang, mode, milestoneCompletions, strategicScore, tacticalScore, operationalScore, totalImpactScore, selectedPortfolio]);

  const edges = IMPACT_CYCLE_DATA.map((item, index) => ({
    id: `e${index}`,
    source: item.id,
    target: IMPACT_CYCLE_DATA[(index + 1) % IMPACT_CYCLE_DATA.length].id,
    animated: true,
    style: { stroke: '#64748b' },
  }));

  // Handler: Knoten-Klick
  const handleNodeClick = (_event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  };

  // Handler: Hintergrund-Klick (schließt Sidebar)
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  // Handler: Notizen speichern
  const handleSaveNotes = () => {
    if (!selectedNode) return;

    // Berechne Durchschnitt aller Erreichungsgrade für diesen Milestone
    const selectedKPIValues = selectedKPIs.map(kpiId => calculateKPIAchievement(kpiId));
    const averageCompletion = selectedKPIValues.length > 0
      ? selectedKPIValues.reduce((sum, val) => sum + val, 0) / selectedKPIValues.length
      : 0;

    // Speichere Completion-Rate für diesen Milestone
    setMilestoneCompletions(prev => ({
      ...prev,
      [selectedNode]: Math.round(averageCompletion)
    }));

    // TODO: Aktualisiere Health Scores in Echtzeit nach Speichern
    // TODO: Hier später Speichern in Supabase oder localStorage
    console.log('Notizen gespeichert für Node', selectedNode);
    console.log('Strategic:', strategicNotes);
    console.log('Tactical:', tacticalNotes);
    console.log('Operational:', operationalNotes);
    console.log('Ausgewählte KPIs:', selectedKPIs);
    console.log('KPI-Werte:', kpiValues);
    console.log('Durchschnittlicher Erreichungsgrad:', Math.round(averageCompletion) + '%');
    
    const kpiCount = selectedKPIs.length;
    const completionText = Math.round(averageCompletion);
    const successMessage = lang === 'de' 
      ? `Notizen gespeichert! ${kpiCount} KPI(s), Erreichung: ${completionText}%`
      : lang === 'en'
      ? `Notes saved! ${kpiCount} KPI(s), Achievement: ${completionText}%`
      : `¡Notas guardadas! ${kpiCount} KPI(s), Logro: ${completionText}%`;
    
    alert(successMessage);
  };

  // Dynamische Labels aus der Matrix laden
  const getLabel = (category: keyof typeof uiLabels.alignment_widget) => {
    return uiLabels.alignment_widget[category][lang][mode];
  };

  // Mehrsprachige Titel für die 10 Milestones
  const getMilestoneTitle = (id: string): string => {
    const titles: Record<string, Record<'de' | 'en' | 'es', string>> = {
      '1': { de: 'Bewusstseinsbildung & Schulung', en: 'Awareness & Education', es: 'Concienciación y Educación' },
      '2': { de: 'Anforderungsermittlung', en: 'Requirements Discovery', es: 'Descubrimiento de Requisitos' },
      '3': { de: 'Nutzen-Definition', en: 'Benefit Definition', es: 'Definición de Beneficios' },
      '4': { de: 'Lösungsdesign', en: 'Solution Design', es: 'Diseño de Solución' },
      '5': { de: 'Service-Einführung', en: 'Service Launch', es: 'Lanzamiento de Servicio' },
      '6': { de: 'Täglicher Betrieb', en: 'Daily Operations', es: 'Operaciones Diarias' },
      '7': { de: 'Leistungsverfolgung', en: 'Performance Tracking', es: 'Seguimiento de Rendimiento' },
      '8': { de: 'Kontinuierliche Verbesserung', en: 'Continuous Enhancement', es: 'Mejora Continua' },
      '9': { de: 'Ergebnis-Realisierung', en: 'Outcome Realization', es: 'Realización de Resultados' },
      '10': { de: 'Stakeholder-Validierung', en: 'Stakeholder Validation', es: 'Validación de Stakeholders' }
    };
    return titles[id]?.[lang] || titles[id]?.['en'] || 'Unknown';
  };

  // Aktuell ausgewählten Milestone finden
  const selectedMilestone = selectedNode 
    ? IMPACT_CYCLE_DATA.find(item => item.id === selectedNode)
    : null;

  // KPIs für den aktuell ausgewählten Schritt filtern
  const relevantKPIs = useMemo(() => {
    if (!selectedNode) return [];
    const stepNumber = parseInt(selectedNode);
    return kpiLibrary.kpis.filter((kpi: any) => kpi.step_number === stepNumber);
  }, [selectedNode]);

  // KPI-Auswahl Toggle
  const toggleKPI = (kpiId: string) => {
    setSelectedKPIs(prev => {
      const isSelected = prev.includes(kpiId);
      if (isSelected) {
        // Entfernen: Auch KPI-Werte löschen
        setKpiValues(prevValues => prevValues.filter(v => v.kpiId !== kpiId));
        return prev.filter(id => id !== kpiId);
      } else {
        // Hinzufügen: Initialisiere KPI-Werte
        setKpiValues(prevValues => [...prevValues, { kpiId, targetValue: 0, currentValue: 0 }]);
        return [...prev, kpiId];
      }
    });
  };

  // KPI Target Value Update
  const updateKPITargetValue = (kpiId: string, value: number) => {
    setKpiValues(prev => 
      prev.map(kpi => 
        kpi.kpiId === kpiId ? { ...kpi, targetValue: value } : kpi
      )
    );
  };

  // KPI Current Value Update
  const updateKPICurrentValue = (kpiId: string, value: number) => {
    setKpiValues(prev => 
      prev.map(kpi => 
        kpi.kpiId === kpiId ? { ...kpi, currentValue: value } : kpi
      )
    );
  };

  // Berechne Erreichungsgrad für eine KPI (0-100%)
  const calculateKPIAchievement = (kpiId: string): number => {
    const kpiValue = kpiValues.find(v => v.kpiId === kpiId);
    if (!kpiValue || kpiValue.targetValue === 0) return 0;
    const achievement = (kpiValue.currentValue / kpiValue.targetValue) * 100;
    return Math.min(Math.max(achievement, 0), 100); // Clamp zwischen 0-100
  };

  // Hole KPI-Wert
  const getKPIValue = (kpiId: string): KPIValue | undefined => {
    return kpiValues.find(v => v.kpiId === kpiId);
  };

  // Icon für KPI-Typ
  const getKPIIcon = (kpiType: string) => {
    switch (kpiType) {
      case 'strategic': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'tactical': return <UsersIcon className="w-4 h-4 text-yellow-400" />;
      case 'operational': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default: return null;
    }
  };

  // Label für KPI-Typ
  const getKPITypeLabel = (kpiType: string): string => {
    const labels: Record<string, Record<'de' | 'en' | 'es', string>> = {
      strategic: { de: 'Strategisch', en: 'Strategic', es: 'Estratégico' },
      tactical: { de: 'Taktisch', en: 'Tactical', es: 'Táctico' },
      operational: { de: 'Operativ', en: 'Operational', es: 'Operativo' }
    };
    return labels[kpiType]?.[lang] || kpiType;
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col">
      {/* Header mit Steuerung */}
      <header className="p-4 flex justify-between items-center bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-blue-400">PMO Impact Cycle</h1>
          {isLoadingMetrics && (
            <span className="text-xs text-slate-400 animate-pulse">
              Lade Metriken...
            </span>
          )}
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Portfolio Selector */}
          <PortfolioSelector />

          {/* View Switcher */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button 
              onClick={() => setView('cycle')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${view === 'cycle' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
              title="Impact Cycle View"
            >
              <Network size={16} /> Cycle
            </button>
            <button 
              onClick={() => setView('projects')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md transition ${view === 'projects' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
              title="Projects List View"
            >
              <LayoutGrid size={16} /> Projects
            </button>
          </div>

          {/* Sprach-Umschalter */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            {(['de', 'en', 'es'] as const).map((l) => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md transition ${lang === l ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Register-Umschalter */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button 
              onClick={() => setMode('colloquial')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${mode === 'colloquial' ? 'bg-blue-600' : ''}`}
            >
              <User size={16} /> Normal
            </button>
            <button 
              onClick={() => setMode('management')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${mode === 'management' ? 'bg-blue-600' : ''}`}
            >
              <Languages size={16} /> Management
            </button>
          </div>
        </div>
      </header>

      {/* Diagramm-Bereich */}
      <main className="flex-1 relative">
        {view === 'cycle' && (
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            proOptions={{ hideAttribution: true }}
          >
          <Background color="#334155" gap={20} />
          <Controls />
        </ReactFlow>
        )}

        {view === 'projects' && selectedPortfolio && (
          <PortfolioProjectList
            portfolioId={selectedPortfolio.id}
            portfolioName={selectedPortfolio.name}
            lang={lang}
            mode={mode}
            onProjectSelect={(projectId) => {
              console.log('Project selected:', projectId);
              // TODO: Switch to cycle view and load project-specific data
              // setView('cycle');
              // loadProjectImpactCycle(projectId);
            }}
          />
        )}

        {/* Sidebar - Slide-In von rechts */}
        <aside 
          className={`
            fixed right-0 top-0 h-full w-1/4 min-w-[320px]
            bg-slate-800 border-l border-slate-700
            shadow-2xl
            transition-transform duration-300 ease-in-out
            ${selectedNode ? 'translate-x-0' : 'translate-x-full'}
            z-50
            flex flex-col
          `}
        >
          {selectedMilestone && (
            <>
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-blue-400">
                    {getMilestoneTitle(selectedMilestone.id)}
                  </h2>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedMilestone.internal_code}
                </p>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Aktuelle Beschreibung */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                    {mode === 'colloquial' ? (
                      lang === 'de' ? 'Beschreibung' : lang === 'en' ? 'Description' : 'Descripción'
                    ) : (
                      lang === 'de' ? 'Value Proposition' : lang === 'en' ? 'Value Proposition' : 'Propuesta de Valor'
                    )}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedMilestone.matrix[lang][mode]}
                  </p>
                </div>

                {/* Strategic Alignment */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      {getLabel('strategic')}
                    </h3>
                  </div>
                  <textarea
                    value={strategicNotes}
                    onChange={(e) => setStrategicNotes(e.target.value)}
                    placeholder={
                      mode === 'colloquial' 
                        ? (lang === 'de' ? 'Wie unterstützt dieser Schritt eure Hauptziele?' 
                           : lang === 'en' ? 'How does this step support your main goals?' 
                           : '¿Cómo apoya este paso sus objetivos principales?')
                        : (lang === 'de' ? 'Strategic Alignment & Portfolio Value Assessment' 
                           : lang === 'en' ? 'Strategic Alignment & Portfolio Value Assessment' 
                           : 'Evaluación de Alineación Estratégica y Valor de Cartera')
                    }
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg
                             text-slate-200 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             placeholder-slate-500"
                  />
                </div>

                {/* Tactical Alignment */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      {getLabel('tactical')}
                    </h3>
                  </div>
                  <textarea
                    value={tacticalNotes}
                    onChange={(e) => setTacticalNotes(e.target.value)}
                    placeholder={
                      mode === 'colloquial' 
                        ? (lang === 'de' ? 'Welche Ressourcen & Fähigkeiten braucht ihr?' 
                           : lang === 'en' ? 'What resources & skills do you need?' 
                           : '¿Qué recursos y habilidades necesitan?')
                        : (lang === 'de' ? 'Resource Allocation & Capability Assessment' 
                           : lang === 'en' ? 'Resource Allocation & Capability Assessment' 
                           : 'Asignación de Recursos y Evaluación de Capacidades')
                    }
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg
                             text-slate-200 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             placeholder-slate-500"
                  />
                </div>

                {/* Operational Alignment */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-green-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      {getLabel('operational')}
                    </h3>
                  </div>
                  <textarea
                    value={operationalNotes}
                    onChange={(e) => setOperationalNotes(e.target.value)}
                    placeholder={
                      mode === 'colloquial' 
                        ? (lang === 'de' ? 'Wie setzt ihr das konkret um?' 
                           : lang === 'en' ? 'How will you implement this?' 
                           : '¿Cómo implementarán esto?')
                        : (lang === 'de' ? 'Execution Planning & KPI Definition' 
                           : lang === 'en' ? 'Execution Planning & KPI Definition' 
                           : 'Planificación de Ejecución y Definición de KPIs')
                    }
                    className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg
                             text-slate-200 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                             placeholder-slate-500"
                  />
                </div>

                {/* KPI-Auswahl Sektion */}
                <div className="mb-6 border-t border-slate-700 pt-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wide flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-400" />
                    {lang === 'de' ? 'Empfohlene Kennzahlen' : lang === 'en' ? 'Recommended KPIs' : 'KPIs Recomendados'}
                  </h3>
                  
                  {relevantKPIs.length > 0 ? (
                    <div className="space-y-3">
                      {relevantKPIs.map((kpi: any) => {
                        const isSelected = selectedKPIs.includes(kpi.id);
                        const kpiValue = getKPIValue(kpi.id);
                        const achievement = isSelected ? calculateKPIAchievement(kpi.id) : 0;

                        return (
                          <div 
                            key={kpi.id}
                            className={`
                              p-3 rounded-lg border transition-all duration-200
                              ${isSelected 
                                ? 'bg-slate-700 border-emerald-500' 
                                : 'bg-slate-900 border-slate-600 hover:border-slate-500 cursor-pointer'}
                            `}
                            onClick={!isSelected ? () => toggleKPI(kpi.id) : undefined}
                          >
                            <div className="flex items-start gap-3">
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleKPI(kpi.id)}
                                className="mt-1 w-4 h-4 rounded border-slate-500 text-emerald-500 
                                         focus:ring-2 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getKPIIcon(kpi.kpi_type)}
                                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                                    {getKPITypeLabel(kpi.kpi_type)}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                                  {kpi.title_matrix?.[lang]?.[mode] || kpi.title}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-1">
                                  {kpi.matrix[lang][mode]}
                                </p>
                                <span className="text-xs text-slate-500 font-mono">
                                  {kpi.unit}
                                </span>

                                {/* Eingabefelder für ausgewählte KPIs */}
                                {isSelected && kpiValue && (
                                  <div className="mt-3 space-y-2 border-t border-slate-600 pt-3">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-slate-400 block mb-1">
                                          {lang === 'de' ? 'Zielwert' : lang === 'en' ? 'Target' : 'Objetivo'}
                                        </label>
                                        <input 
                                          type="number"
                                          value={kpiValue.targetValue || ''}
                                          onChange={(e) => updateKPITargetValue(kpi.id, parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded
                                                   text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-slate-400 block mb-1">
                                          {lang === 'de' ? 'Aktuell' : lang === 'en' ? 'Current' : 'Actual'}
                                        </label>
                                        <input 
                                          type="number"
                                          value={kpiValue.currentValue || ''}
                                          onChange={(e) => updateKPICurrentValue(kpi.id, parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded
                                                   text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Erreichungsgrad-Anzeige */}
                                    {kpiValue.targetValue > 0 && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">
                                          {lang === 'de' ? 'Erreichungsgrad' : lang === 'en' ? 'Achievement' : 'Logro'}:
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full transition-all duration-300 ${
                                                achievement >= 80 ? 'bg-green-500' : 
                                                achievement >= 50 ? 'bg-yellow-500' : 
                                                'bg-red-500'
                                              }`}
                                              style={{ width: `${Math.min(achievement, 100)}%` }}
                                            />
                                          </div>
                                          <span className={`text-xs font-bold ${
                                            achievement >= 80 ? 'text-green-400' : 
                                            achievement >= 50 ? 'text-yellow-400' : 
                                            'text-red-400'
                                          }`}>
                                            {Math.round(achievement)}%
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      {lang === 'de' ? 'Keine KPIs verfügbar' : lang === 'en' ? 'No KPIs available' : 'No hay KPIs disponibles'}
                    </p>
                  )}
                </div>

                {/* Speichern-Button mit dynamischem Label */}
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-lg
                           transition-colors duration-200
                           flex items-center justify-center gap-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  {getLabel('save_button')}
                </button>

                {/* Zusätzliche Infos */}
                <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">
                    {lang === 'de' ? 'Aktuelle Ansicht' : lang === 'en' ? 'Current View' : 'Vista Actual'}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>{lang === 'de' ? 'Sprache:' : lang === 'en' ? 'Language:' : 'Idioma:'}</span>
                      <span className="font-semibold">{lang.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'de' ? 'Modus:' : lang === 'en' ? 'Mode:' : 'Modo:'}</span>
                      <span className="font-semibold">
                        {mode === 'colloquial' 
                          ? (lang === 'de' ? 'Normal' : lang === 'en' ? 'Normal' : 'Normal')
                          : 'Management'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}