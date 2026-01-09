#!/usr/bin/env python3
"""
PMI KPI Sync Script
Interaktives Skript zur Extraktion und Synchronisation von 30 KPIs basierend auf PMI-Standards.

Workflow:
1. Analyse der Knowledge-Base (.txt Dateien)
2. Extraktion von 3 KPIs pro Impact Cycle Schritt (Strategic, Tactical, Operational)
3. Tabellarische Übersicht im Terminal
4. Interaktive Bestätigung
5. Upload zu Supabase pmo_kpi_library

Autor: PMO Value Generator
Datum: 2026-01-09
"""

import os
import sys
from typing import Dict, List
from dotenv import load_dotenv
from supabase import create_client, Client
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.prompt import Confirm
from rich import box

# Rich Console für schöne Terminal-Ausgabe
console = Console()

# Lade Umgebungsvariablen
load_dotenv()

# Supabase-Verbindung
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# ============================================================================
# PMI-KONFORME KPI-BIBLIOTHEK (30 KPIs)
# Extrahiert aus Knowledge-Base: PMI Portfolio Standards, OPM, PMBOK
# ============================================================================

PMI_KPI_LIBRARY: List[Dict] = [
    # ========================================================================
    # STEP 1: Awareness & Education (DIS_AWR)
    # ========================================================================
    {
        "step_number": 1,
        "internal_code": "DIS_AWR",
        "kpi_type": "strategic",
        "kpi_code": "DIS_AWR_STR_001",
        "title": "Stakeholder Awareness Index",
        "unit": "Score (0-100)",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele Leute wissen überhaupt, was das PMO macht? Wir messen, ob unsere Botschaft bei den wichtigen Personen ankommt.",
                "management": "Quantifizierung der PMO-Sichtbarkeit im Stakeholder-Netzwerk durch systematische Awareness-Befragungen. Indikator für strategische Positionierung und Kommunikationswirksamkeit."
            },
            "en": {
                "colloquial": "How many people actually know what the PMO does? We measure whether our message reaches the important people.",
                "management": "Quantification of PMO visibility in the stakeholder network through systematic awareness surveys. Indicator for strategic positioning and communication effectiveness."
            },
            "es": {
                "colloquial": "¿Cuántas personas saben realmente qué hace la PMO? Medimos si nuestro mensaje llega a las personas importantes.",
                "management": "Cuantificación de la visibilidad de la PMO en la red de interesados mediante encuestas sistemáticas de concienciación. Indicador de posicionamiento estratégico y efectividad de la comunicación."
            }
        }
    },
    {
        "step_number": 1,
        "internal_code": "DIS_AWR",
        "kpi_type": "tactical",
        "kpi_code": "DIS_AWR_TAC_001",
        "title": "Communication Campaign Reach",
        "unit": "Anzahl Empfänger",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele Menschen haben wir mit unseren Info-Aktionen erreicht? Zählt Workshops, E-Mails, Meetings.",
                "management": "Reichweite der PMO-Kommunikationskampagnen gemessen an Teilnehmerzahlen und Engagement-Raten. Steuerungsgröße für taktische Kommunikationsplanung."
            },
            "en": {
                "colloquial": "How many people did we reach with our info campaigns? Counts workshops, emails, meetings.",
                "management": "Reach of PMO communication campaigns measured by participant numbers and engagement rates. Control metric for tactical communication planning."
            },
            "es": {
                "colloquial": "¿A cuántas personas alcanzamos con nuestras campañas informativas? Cuenta talleres, correos electrónicos, reuniones.",
                "management": "Alcance de las campañas de comunicación de la PMO medido por números de participantes y tasas de compromiso. Métrica de control para planificación táctica de comunicación."
            }
        }
    },
    {
        "step_number": 1,
        "internal_code": "DIS_AWR",
        "kpi_type": "operational",
        "kpi_code": "DIS_AWR_OPS_001",
        "title": "Training Completion Rate",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele Leute haben die angebotenen Schulungen tatsächlich abgeschlossen? Zeigt, ob die Trainings ankommen.",
                "management": "Prozentsatz absolvierter PMO-Trainingsmodule im Verhältnis zu angemeldeten Teilnehmern. Qualitätsindikator für Schulungsexzellenz und Adoption."
            },
            "en": {
                "colloquial": "How many people actually completed the offered trainings? Shows if the training is being adopted.",
                "management": "Percentage of completed PMO training modules relative to registered participants. Quality indicator for training excellence and adoption."
            },
            "es": {
                "colloquial": "¿Cuántas personas realmente completaron las capacitaciones ofrecidas? Muestra si la formación está siendo adoptada.",
                "management": "Porcentaje de módulos de capacitación PMO completados en relación con participantes registrados. Indicador de calidad para excelencia en formación y adopción."
            }
        }
    },

    # ========================================================================
    # STEP 2: Requirements Discovery (DIS_NEA)
    # ========================================================================
    {
        "step_number": 2,
        "internal_code": "DIS_NEA",
        "kpi_type": "strategic",
        "kpi_code": "DIS_NEA_STR_001",
        "title": "Business Impact Priority Score",
        "unit": "Score (0-100)",
        "matrix_data": {
            "de": {
                "colloquial": "Welche Probleme sind am wichtigsten für die Firma? Wir bewerten, wo wir den größten Unterschied machen können.",
                "management": "Priorisierung identifizierter Anforderungen nach strategischem Geschäftswert und Alignment zu Unternehmenszielen. Grundlage für Portfolio-Optimierung."
            },
            "en": {
                "colloquial": "Which problems are most important for the company? We assess where we can make the biggest difference.",
                "management": "Prioritization of identified requirements based on strategic business value and alignment to corporate objectives. Foundation for portfolio optimization."
            },
            "es": {
                "colloquial": "¿Qué problemas son más importantes para la empresa? Evaluamos dónde podemos marcar la mayor diferencia.",
                "management": "Priorización de requisitos identificados según valor estratégico empresarial y alineación con objetivos corporativos. Fundamento para optimización de cartera."
            }
        }
    },
    {
        "step_number": 2,
        "internal_code": "DIS_NEA",
        "kpi_type": "tactical",
        "kpi_code": "DIS_NEA_TAC_001",
        "title": "Stakeholder Interview Coverage",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Haben wir mit allen wichtigen Leuten gesprochen? Misst, ob wir niemanden vergessen haben.",
                "management": "Anteil abgedeckter Schlüssel-Stakeholder durch strukturierte Assessment-Interviews. Governance-Kennzahl für Requirements-Vollständigkeit."
            },
            "en": {
                "colloquial": "Did we talk to all the important people? Measures if we didn't miss anyone.",
                "management": "Proportion of key stakeholders covered through structured assessment interviews. Governance metric for requirements completeness."
            },
            "es": {
                "colloquial": "¿Hablamos con todas las personas importantes? Mide si no nos perdimos a nadie.",
                "management": "Proporción de interesados clave cubiertos mediante entrevistas de evaluación estructuradas. Métrica de gobernanza para completitud de requisitos."
            }
        }
    },
    {
        "step_number": 2,
        "internal_code": "DIS_NEA",
        "kpi_type": "operational",
        "kpi_code": "DIS_NEA_OPS_001",
        "title": "Requirements Documentation Quality",
        "unit": "Score (1-5)",
        "matrix_data": {
            "de": {
                "colloquial": "Sind unsere Notizen klar und verständlich aufgeschrieben? Qualität der Dokumentation.",
                "management": "Qualitätsbewertung erfasster Anforderungen nach Klarheit, Vollständigkeit und Nachvollziehbarkeit. Prozessqualitäts-Indikator für BA-Exzellenz."
            },
            "en": {
                "colloquial": "Are our notes clearly and understandably written? Quality of documentation.",
                "management": "Quality assessment of captured requirements based on clarity, completeness, and traceability. Process quality indicator for BA excellence."
            },
            "es": {
                "colloquial": "¿Nuestras notas están escritas de manera clara y comprensible? Calidad de la documentación.",
                "management": "Evaluación de calidad de requisitos capturados según claridad, completitud y trazabilidad. Indicador de calidad de proceso para excelencia en análisis de negocio."
            }
        }
    },

    # ========================================================================
    # STEP 3: Benefit Definition (PLN_VPR)
    # ========================================================================
    {
        "step_number": 3,
        "internal_code": "PLN_VPR",
        "kpi_type": "strategic",
        "kpi_code": "PLN_VPR_STR_001",
        "title": "Expected ROI Projection",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viel Gewinn erwarten wir für jeden investierten Euro? Zeigt, ob sich die Sache lohnt.",
                "management": "Prognostizierter Return on Investment der PMO-Initiative basierend auf quantifizierter Value Proposition. Strategische Investitionsentscheidungs-Kennzahl."
            },
            "en": {
                "colloquial": "How much profit do we expect for each euro invested? Shows if it's worth it.",
                "management": "Projected Return on Investment of the PMO initiative based on quantified value proposition. Strategic investment decision metric."
            },
            "es": {
                "colloquial": "¿Cuánto beneficio esperamos por cada euro invertido? Muestra si vale la pena.",
                "management": "Retorno de inversión proyectado de la iniciativa PMO basado en propuesta de valor cuantificada. Métrica estratégica de decisión de inversión."
            }
        }
    },
    {
        "step_number": 3,
        "internal_code": "PLN_VPR",
        "kpi_type": "tactical",
        "kpi_code": "PLN_VPR_TAC_001",
        "title": "Success Criteria Definition Completeness",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Haben wir für alle Nutzenversprechen klare Messwerte definiert? Sind die Ziele messbar?",
                "management": "Vollständigkeit definierter, messbarer Erfolgskriterien je Value-Statement. Governance-Indikator für Evidence-Based Management."
            },
            "en": {
                "colloquial": "Did we define clear measurements for all benefit promises? Are the goals measurable?",
                "management": "Completeness of defined, measurable success criteria per value statement. Governance indicator for evidence-based management."
            },
            "es": {
                "colloquial": "¿Definimos mediciones claras para todas las promesas de beneficio? ¿Son medibles los objetivos?",
                "management": "Completitud de criterios de éxito definidos y medibles por declaración de valor. Indicador de gobernanza para gestión basada en evidencia."
            }
        }
    },
    {
        "step_number": 3,
        "internal_code": "PLN_VPR",
        "kpi_type": "operational",
        "kpi_code": "PLN_VPR_OPS_001",
        "title": "Value Proposition Approval Cycle Time",
        "unit": "Tage",
        "matrix_data": {
            "de": {
                "colloquial": "Wie lange dauert es, bis alle Entscheider unsere Nutzen-Beschreibung absegnen?",
                "management": "Durchlaufzeit von Value-Proposition-Erstellung bis zur formellen Stakeholder-Freigabe. Prozesseffizienz-Kennzahl."
            },
            "en": {
                "colloquial": "How long does it take until all decision-makers approve our benefit description?",
                "management": "Cycle time from value proposition creation to formal stakeholder approval. Process efficiency metric."
            },
            "es": {
                "colloquial": "¿Cuánto tiempo tarda hasta que todos los tomadores de decisiones aprueben nuestra descripción de beneficios?",
                "management": "Tiempo de ciclo desde la creación de la propuesta de valor hasta la aprobación formal de los interesados. Métrica de eficiencia de procesos."
            }
        }
    },

    # ========================================================================
    # STEP 4: Solution Design (PLN_SDE)
    # ========================================================================
    {
        "step_number": 4,
        "internal_code": "PLN_SDE",
        "kpi_type": "strategic",
        "kpi_code": "PLN_SDE_STR_001",
        "title": "Service Portfolio Alignment Score",
        "unit": "Score (0-100)",
        "matrix_data": {
            "de": {
                "colloquial": "Passen unsere geplanten Angebote zu den Unternehmenszielen? Strategische Ausrichtung der Services.",
                "management": "Alignment-Score des PMO-Service-Portfolios zu strategischen Geschäftszielen. Indikator für Portfolio-Strategic-Fit."
            },
            "en": {
                "colloquial": "Do our planned offerings match company goals? Strategic alignment of services.",
                "management": "Alignment score of PMO service portfolio to strategic business objectives. Indicator for portfolio strategic fit."
            },
            "es": {
                "colloquial": "¿Nuestras ofertas planificadas coinciden con los objetivos de la empresa? Alineación estratégica de servicios.",
                "management": "Puntuación de alineación de la cartera de servicios PMO con objetivos estratégicos empresariales. Indicador de ajuste estratégico de cartera."
            }
        }
    },
    {
        "step_number": 4,
        "internal_code": "PLN_SDE",
        "kpi_type": "tactical",
        "kpi_code": "PLN_SDE_TAC_001",
        "title": "SLA Definition Coverage",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Für wie viele unserer Angebote haben wir klare Service-Vereinbarungen? Transparenz der Leistungszusagen.",
                "management": "Anteil definierter Service Level Agreements an Gesamt-Services. Governance-Kennzahl für Service-Katalog-Reife."
            },
            "en": {
                "colloquial": "For how many of our offerings do we have clear service agreements? Transparency of service commitments.",
                "management": "Proportion of defined Service Level Agreements to total services. Governance metric for service catalog maturity."
            },
            "es": {
                "colloquial": "¿Para cuántas de nuestras ofertas tenemos acuerdos de servicio claros? Transparencia de compromisos de servicio.",
                "management": "Proporción de Acuerdos de Nivel de Servicio definidos respecto al total de servicios. Métrica de gobernanza para madurez del catálogo de servicios."
            }
        }
    },
    {
        "step_number": 4,
        "internal_code": "PLN_SDE",
        "kpi_type": "operational",
        "kpi_code": "PLN_SDE_OPS_001",
        "title": "Design Review Iteration Count",
        "unit": "Anzahl",
        "matrix_data": {
            "de": {
                "colloquial": "Wie oft mussten wir unsere Lösungs-Entwürfe überarbeiten? Zeigt Effizienz im Design-Prozess.",
                "management": "Anzahl erforderlicher Design-Iterationen bis zur Freigabe. Prozessqualitäts- und Effizienz-Indikator."
            },
            "en": {
                "colloquial": "How many times did we have to revise our solution designs? Shows efficiency in the design process.",
                "management": "Number of required design iterations until approval. Process quality and efficiency indicator."
            },
            "es": {
                "colloquial": "¿Cuántas veces tuvimos que revisar nuestros diseños de solución? Muestra eficiencia en el proceso de diseño.",
                "management": "Número de iteraciones de diseño requeridas hasta la aprobación. Indicador de calidad y eficiencia de procesos."
            }
        }
    },

    # ========================================================================
    # STEP 5: Service Launch (IMP_ONB)
    # ========================================================================
    {
        "step_number": 5,
        "internal_code": "IMP_ONB",
        "kpi_type": "strategic",
        "kpi_code": "IMP_ONB_STR_001",
        "title": "Service Adoption Rate",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele der Zielgruppe nutzen unsere neuen Angebote tatsächlich? Erfolg der Einführung.",
                "management": "Anteil aktiver Nutzer am Gesamt-Zielpublikum neuer PMO-Services. Strategischer Indikator für Change-Management-Erfolg und Value Realization."
            },
            "en": {
                "colloquial": "How many of the target audience actually use our new offerings? Launch success.",
                "management": "Proportion of active users to total target audience of new PMO services. Strategic indicator for change management success and value realization."
            },
            "es": {
                "colloquial": "¿Cuántos del público objetivo realmente usan nuestras nuevas ofertas? Éxito del lanzamiento.",
                "management": "Proporción de usuarios activos respecto al público objetivo total de nuevos servicios PMO. Indicador estratégico de éxito de gestión del cambio y realización de valor."
            }
        }
    },
    {
        "step_number": 5,
        "internal_code": "IMP_ONB",
        "kpi_type": "tactical",
        "kpi_code": "IMP_ONB_TAC_001",
        "title": "Training Session Attendance",
        "unit": "Anzahl Teilnehmer",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele Leute kommen zu unseren Einführungs-Trainings? Interesse am neuen Service.",
                "management": "Teilnehmerzahl an Service-Onboarding-Trainings. Taktische Steuerungsgröße für Rollout-Kapazitätsplanung."
            },
            "en": {
                "colloquial": "How many people come to our launch trainings? Interest in the new service.",
                "management": "Number of participants in service onboarding training. Tactical control metric for rollout capacity planning."
            },
            "es": {
                "colloquial": "¿Cuántas personas vienen a nuestros entrenamientos de lanzamiento? Interés en el nuevo servicio.",
                "management": "Número de participantes en capacitación de incorporación de servicios. Métrica táctica de control para planificación de capacidad de lanzamiento."
            }
        }
    },
    {
        "step_number": 5,
        "internal_code": "IMP_ONB",
        "kpi_type": "operational",
        "kpi_code": "IMP_ONB_OPS_001",
        "title": "Onboarding Cycle Time",
        "unit": "Tage",
        "matrix_data": {
            "de": {
                "colloquial": "Wie lange dauert es, bis ein neuer Nutzer mit dem Service arbeiten kann? Schnelligkeit der Einarbeitung.",
                "management": "Durchschnittliche Dauer vom ersten Kontakt bis zur produktiven Service-Nutzung. Effizienz-Kennzahl für Onboarding-Prozess."
            },
            "en": {
                "colloquial": "How long does it take until a new user can work with the service? Speed of onboarding.",
                "management": "Average duration from first contact to productive service usage. Efficiency metric for onboarding process."
            },
            "es": {
                "colloquial": "¿Cuánto tiempo tarda hasta que un nuevo usuario pueda trabajar con el servicio? Velocidad de incorporación.",
                "management": "Duración promedio desde el primer contacto hasta el uso productivo del servicio. Métrica de eficiencia para proceso de incorporación."
            }
        }
    },

    # ========================================================================
    # STEP 6: Daily Operations (IMP_OPS)
    # ========================================================================
    {
        "step_number": 6,
        "internal_code": "IMP_OPS",
        "kpi_type": "strategic",
        "kpi_code": "IMP_OPS_STR_001",
        "title": "Customer Satisfaction Score (CSAT)",
        "unit": "Score (1-5)",
        "matrix_data": {
            "de": {
                "colloquial": "Wie zufrieden sind unsere Kunden mit unserer täglichen Arbeit? Die wichtigste Frage überhaupt.",
                "management": "Kundenzufriedenheits-Index basierend auf regelmäßigen Service-Befragungen. Strategischer Wert-Indikator für PMO-Performance."
            },
            "en": {
                "colloquial": "How satisfied are our customers with our daily work? The most important question of all.",
                "management": "Customer satisfaction index based on regular service surveys. Strategic value indicator for PMO performance."
            },
            "es": {
                "colloquial": "¿Qué tan satisfechos están nuestros clientes con nuestro trabajo diario? La pregunta más importante de todas.",
                "management": "Índice de satisfacción del cliente basado en encuestas de servicio regulares. Indicador estratégico de valor para rendimiento de PMO."
            }
        }
    },
    {
        "step_number": 6,
        "internal_code": "IMP_OPS",
        "kpi_type": "tactical",
        "kpi_code": "IMP_OPS_TAC_001",
        "title": "Resource Utilization Rate",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie gut nutzen wir unser Team aus? Sind alle beschäftigt oder haben wir Leerlauf?",
                "management": "Auslastungsquote der PMO-Ressourcen (FTE). Taktische Governance-Kennzahl für Kapazitätssteuerung und Workforce-Optimierung."
            },
            "en": {
                "colloquial": "How well do we utilize our team? Is everyone busy or do we have idle time?",
                "management": "Utilization rate of PMO resources (FTE). Tactical governance metric for capacity management and workforce optimization."
            },
            "es": {
                "colloquial": "¿Qué tan bien utilizamos nuestro equipo? ¿Todos están ocupados o tenemos tiempo inactivo?",
                "management": "Tasa de utilización de recursos PMO (FTE). Métrica táctica de gobernanza para gestión de capacidad y optimización de la fuerza laboral."
            }
        }
    },
    {
        "step_number": 6,
        "internal_code": "IMP_OPS",
        "kpi_type": "operational",
        "kpi_code": "IMP_OPS_OPS_001",
        "title": "SLA Compliance Rate",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie oft halten wir unsere zugesagten Lieferzeiten und Qualitätsstandards ein?",
                "management": "Erfüllungsquote vereinbarter Service Level Agreements. Kernindikator für operative Exzellenz und Service-Qualität."
            },
            "en": {
                "colloquial": "How often do we meet our promised delivery times and quality standards?",
                "management": "Fulfillment rate of agreed Service Level Agreements. Core indicator for operational excellence and service quality."
            },
            "es": {
                "colloquial": "¿Con qué frecuencia cumplimos nuestros tiempos de entrega y estándares de calidad prometidos?",
                "management": "Tasa de cumplimiento de Acuerdos de Nivel de Servicio acordados. Indicador central para excelencia operativa y calidad de servicio."
            }
        }
    },

    # ========================================================================
    # STEP 7: Performance Tracking (OPT_MON)
    # ========================================================================
    {
        "step_number": 7,
        "internal_code": "OPT_MON",
        "kpi_type": "strategic",
        "kpi_code": "OPT_MON_STR_001",
        "title": "Value Delivery Trend",
        "unit": "Trend-Index",
        "matrix_data": {
            "de": {
                "colloquial": "Wird der Nutzen, den wir liefern, besser oder schlechter? Richtung der Entwicklung.",
                "management": "Trendanalyse der Value-Delivery-Metriken über Zeit. Strategischer Frühindikator für Portfolio-Performance und Kurskorrektur-Bedarf."
            },
            "en": {
                "colloquial": "Is the value we deliver getting better or worse? Direction of development.",
                "management": "Trend analysis of value delivery metrics over time. Strategic leading indicator for portfolio performance and course correction needs."
            },
            "es": {
                "colloquial": "¿El valor que entregamos está mejorando o empeorando? Dirección del desarrollo.",
                "management": "Análisis de tendencia de métricas de entrega de valor a lo largo del tiempo. Indicador estratégico adelantado para rendimiento de cartera y necesidades de corrección de curso."
            }
        }
    },
    {
        "step_number": 7,
        "internal_code": "OPT_MON",
        "kpi_type": "tactical",
        "kpi_code": "OPT_MON_TAC_001",
        "title": "Dashboard Update Frequency",
        "unit": "Updates/Monat",
        "matrix_data": {
            "de": {
                "colloquial": "Wie oft aktualisieren wir unsere Übersichts-Dashboards? Aktualität der Daten.",
                "management": "Frequenz der KPI-Dashboard-Aktualisierungen. Governance-Indikator für Reporting-Disziplin und Datenaktualität."
            },
            "en": {
                "colloquial": "How often do we update our overview dashboards? Currency of data.",
                "management": "Frequency of KPI dashboard updates. Governance indicator for reporting discipline and data currency."
            },
            "es": {
                "colloquial": "¿Con qué frecuencia actualizamos nuestros paneles de control generales? Actualidad de los datos.",
                "management": "Frecuencia de actualizaciones del panel de KPI. Indicador de gobernanza para disciplina de informes y actualidad de datos."
            }
        }
    },
    {
        "step_number": 7,
        "internal_code": "OPT_MON",
        "kpi_type": "operational",
        "kpi_code": "OPT_MON_OPS_001",
        "title": "Metric Collection Accuracy",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie genau sind unsere gemessenen Zahlen? Fehlerquote bei der Datenerfassung.",
                "management": "Datenqualitäts-Score erfasster Performance-Metriken. Prozessqualitäts-Kennzahl für Measurement-System-Integrität."
            },
            "en": {
                "colloquial": "How accurate are our measured numbers? Error rate in data collection.",
                "management": "Data quality score of captured performance metrics. Process quality metric for measurement system integrity."
            },
            "es": {
                "colloquial": "¿Qué tan precisos son nuestros números medidos? Tasa de error en la recopilación de datos.",
                "management": "Puntuación de calidad de datos de métricas de rendimiento capturadas. Métrica de calidad de procesos para integridad del sistema de medición."
            }
        }
    },

    # ========================================================================
    # STEP 8: Continuous Enhancement (OPT_IMP)
    # ========================================================================
    {
        "step_number": 8,
        "internal_code": "OPT_IMP",
        "kpi_type": "strategic",
        "kpi_code": "OPT_IMP_STR_001",
        "title": "Service Maturity Index",
        "unit": "Level (1-5)",
        "matrix_data": {
            "de": {
                "colloquial": "Wie ausgereift sind unsere Angebote? Von 'gerade gestartet' bis 'erstklassig optimiert'.",
                "management": "Reifegrad-Bewertung des PMO-Service-Portfolios nach etablierten Maturity-Frameworks. Strategischer Entwicklungsindikator."
            },
            "en": {
                "colloquial": "How mature are our offerings? From 'just started' to 'world-class optimized'.",
                "management": "Maturity assessment of PMO service portfolio based on established maturity frameworks. Strategic development indicator."
            },
            "es": {
                "colloquial": "¿Qué tan maduras son nuestras ofertas? De 'recién comenzado' a 'optimizado de clase mundial'.",
                "management": "Evaluación de madurez de la cartera de servicios PMO basada en marcos de madurez establecidos. Indicador estratégico de desarrollo."
            }
        }
    },
    {
        "step_number": 8,
        "internal_code": "OPT_IMP",
        "kpi_type": "tactical",
        "kpi_code": "OPT_IMP_TAC_001",
        "title": "Improvement Initiative Pipeline",
        "unit": "Anzahl",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele Verbesserungs-Ideen haben wir in der Warteschlange? Zeigt Innovationskraft.",
                "management": "Anzahl aktiver und geplanter Optimierungsinitiativen in der Improvement-Roadmap. Taktischer Indikator für kontinuierliche Weiterentwicklung."
            },
            "en": {
                "colloquial": "How many improvement ideas do we have in the queue? Shows innovation capacity.",
                "management": "Number of active and planned optimization initiatives in the improvement roadmap. Tactical indicator for continuous development."
            },
            "es": {
                "colloquial": "¿Cuántas ideas de mejora tenemos en la cola? Muestra capacidad de innovación.",
                "management": "Número de iniciativas de optimización activas y planificadas en la hoja de ruta de mejora. Indicador táctico para desarrollo continuo."
            }
        }
    },
    {
        "step_number": 8,
        "internal_code": "OPT_IMP",
        "kpi_type": "operational",
        "kpi_code": "OPT_IMP_OPS_001",
        "title": "Enhancement Deployment Speed",
        "unit": "Tage",
        "matrix_data": {
            "de": {
                "colloquial": "Wie schnell bringen wir Verbesserungen in die Praxis? Von Idee bis zur Umsetzung.",
                "management": "Durchschnittliche Time-to-Market für identifizierte und priorisierte Verbesserungsmaßnahmen. Agilität- und Prozesseffizienz-Kennzahl."
            },
            "en": {
                "colloquial": "How quickly do we bring improvements into practice? From idea to implementation.",
                "management": "Average time-to-market for identified and prioritized improvement measures. Agility and process efficiency metric."
            },
            "es": {
                "colloquial": "¿Qué tan rápido llevamos las mejoras a la práctica? De idea a implementación.",
                "management": "Tiempo promedio de comercialización para medidas de mejora identificadas y priorizadas. Métrica de agilidad y eficiencia de procesos."
            }
        }
    },

    # ========================================================================
    # STEP 9: Outcome Realization (IMP_VDL)
    # ========================================================================
    {
        "step_number": 9,
        "internal_code": "IMP_VDL",
        "kpi_type": "strategic",
        "kpi_code": "IMP_VDL_STR_001",
        "title": "Realized ROI",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viel Gewinn haben wir tatsächlich erwirtschaftet? Der echte, messbare Nutzen.",
                "management": "Tatsächlich realisierter Return on Investment der PMO-Initiative. Strategische Value-Realization-Kennzahl und Business-Case-Validierung."
            },
            "en": {
                "colloquial": "How much profit did we actually generate? The real, measurable benefit.",
                "management": "Actually realized Return on Investment of the PMO initiative. Strategic value realization metric and business case validation."
            },
            "es": {
                "colloquial": "¿Cuánto beneficio generamos realmente? El beneficio real y medible.",
                "management": "Retorno de inversión realmente realizado de la iniciativa PMO. Métrica estratégica de realización de valor y validación de caso de negocio."
            }
        }
    },
    {
        "step_number": 9,
        "internal_code": "IMP_VDL",
        "kpi_type": "tactical",
        "kpi_code": "IMP_VDL_TAC_001",
        "title": "Benefit Realization Report Frequency",
        "unit": "Reports/Jahr",
        "matrix_data": {
            "de": {
                "colloquial": "Wie oft berichten wir über die erreichten Ergebnisse? Regelmäßigkeit der Erfolgsberichte.",
                "management": "Frequenz formeller Benefit-Realization-Reports an Stakeholder und Governance-Gremien. Transparenz- und Governance-Kennzahl."
            },
            "en": {
                "colloquial": "How often do we report on achieved results? Regularity of success reports.",
                "management": "Frequency of formal benefit realization reports to stakeholders and governance bodies. Transparency and governance metric."
            },
            "es": {
                "colloquial": "¿Con qué frecuencia informamos sobre los resultados logrados? Regularidad de informes de éxito.",
                "management": "Frecuencia de informes formales de realización de beneficios a interesados y órganos de gobernanza. Métrica de transparencia y gobernanza."
            }
        }
    },
    {
        "step_number": 9,
        "internal_code": "IMP_VDL",
        "kpi_type": "operational",
        "kpi_code": "IMP_VDL_OPS_001",
        "title": "Outcome Measurement Completeness",
        "unit": "%",
        "matrix_data": {
            "de": {
                "colloquial": "Für wie viele unserer Ziele haben wir Ergebnisse gemessen? Vollständigkeit der Erfolgsmessung.",
                "management": "Anteil quantifizierter Outcomes an definierten Success-Criteria. Prozessqualitäts-Kennzahl für Outcome-Tracking-Vollständigkeit."
            },
            "en": {
                "colloquial": "For how many of our goals did we measure results? Completeness of success measurement.",
                "management": "Proportion of quantified outcomes to defined success criteria. Process quality metric for outcome tracking completeness."
            },
            "es": {
                "colloquial": "¿Para cuántos de nuestros objetivos medimos resultados? Completitud de medición de éxito.",
                "management": "Proporción de resultados cuantificados respecto a criterios de éxito definidos. Métrica de calidad de procesos para completitud de seguimiento de resultados."
            }
        }
    },

    # ========================================================================
    # STEP 10: Stakeholder Validation (IMP_REC)
    # ========================================================================
    {
        "step_number": 10,
        "internal_code": "IMP_REC",
        "kpi_type": "strategic",
        "kpi_code": "IMP_REC_STR_001",
        "title": "Executive Sponsorship Score",
        "unit": "Score (0-100)",
        "matrix_data": {
            "de": {
                "colloquial": "Wie stark unterstützen uns die Chefs? Rückhalt vom Management für weitere Investitionen.",
                "management": "Quantifizierung der Executive-Unterstützung für PMO-Investitionen und strategische Initiativen. Legitimationsindikator für Portfolio-Erweiterung."
            },
            "en": {
                "colloquial": "How strongly do the bosses support us? Management backing for further investments.",
                "management": "Quantification of executive support for PMO investments and strategic initiatives. Legitimacy indicator for portfolio expansion."
            },
            "es": {
                "colloquial": "¿Qué tan fuerte nos apoyan los jefes? Respaldo de la dirección para más inversiones.",
                "management": "Cuantificación del apoyo ejecutivo para inversiones PMO e iniciativas estratégicas. Indicador de legitimidad para expansión de cartera."
            }
        }
    },
    {
        "step_number": 10,
        "internal_code": "IMP_REC",
        "kpi_type": "tactical",
        "kpi_code": "IMP_REC_TAC_001",
        "title": "Net Promoter Score (NPS)",
        "unit": "Score (-100 bis +100)",
        "matrix_data": {
            "de": {
                "colloquial": "Würden unsere Kunden uns weiterempfehlen? Die Weiterempfehlungsrate.",
                "management": "Net Promoter Score zur Messung der Stakeholder-Loyalität und Weiterempfehlungsbereitschaft. Taktischer Reputations- und Zufriedenheits-Indikator."
            },
            "en": {
                "colloquial": "Would our customers recommend us? The recommendation rate.",
                "management": "Net Promoter Score for measuring stakeholder loyalty and willingness to recommend. Tactical reputation and satisfaction indicator."
            },
            "es": {
                "colloquial": "¿Nuestros clientes nos recomendarían? La tasa de recomendación.",
                "management": "Puntuación neta del promotor para medir la lealtad de los interesados y la disposición a recomendar. Indicador táctico de reputación y satisfacción."
            }
        }
    },
    {
        "step_number": 10,
        "internal_code": "IMP_REC",
        "kpi_type": "operational",
        "kpi_code": "IMP_REC_OPS_001",
        "title": "Testimonial Collection Rate",
        "unit": "Testimonials/Quartal",
        "matrix_data": {
            "de": {
                "colloquial": "Wie viele positive Rückmeldungen sammeln wir systematisch? Erfolgsgeschichten dokumentieren.",
                "management": "Anzahl erfasster Stakeholder-Testimonials und Success-Stories pro Quartal. Prozessindikator für systematische Erfolgs-Amplifikation."
            },
            "en": {
                "colloquial": "How many positive feedback items do we systematically collect? Documenting success stories.",
                "management": "Number of captured stakeholder testimonials and success stories per quarter. Process indicator for systematic success amplification."
            },
            "es": {
                "colloquial": "¿Cuántos comentarios positivos recopilamos sistemáticamente? Documentar historias de éxito.",
                "management": "Número de testimonios de interesados e historias de éxito capturadas por trimestre. Indicador de proceso para amplificación sistemática de éxito."
            }
        }
    }
]


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def create_kpi_summary_table() -> Table:
    """
    Erstellt eine Rich-Tabelle mit allen 30 KPIs.
    """
    table = Table(
        title="🎯 PMO Impact Cycle - KPI-Bibliothek (30 Kennzahlen)",
        box=box.ROUNDED,
        show_header=True,
        header_style="bold cyan"
    )
    
    table.add_column("Step", style="dim", width=4)
    table.add_column("Kategorie", width=12)
    table.add_column("KPI-Titel (DE-Management)", width=50)
    table.add_column("Einheit", width=20)
    
    for kpi in PMI_KPI_LIBRARY:
        # Kategorie-Symbol und Farbe
        category_map = {
            "strategic": ("🎯 Strategic", "green"),
            "tactical": ("⚙️  Tactical", "yellow"),
            "operational": ("🔧 Operational", "blue")
        }
        category_label, category_color = category_map.get(kpi["kpi_type"], ("❓ Unknown", "white"))
        
        table.add_row(
            str(kpi["step_number"]),
            f"[{category_color}]{category_label}[/{category_color}]",
            kpi["title"],
            kpi["unit"]
        )
    
    return table


def print_detailed_kpi_info():
    """
    Gibt detaillierte Informationen zu allen KPIs aus (für Dokumentation).
    """
    console.print("\n[bold cyan]📊 DETAILLIERTE KPI-ÜBERSICHT[/bold cyan]\n")
    
    current_step = None
    
    for kpi in PMI_KPI_LIBRARY:
        # Schritt-Überschrift
        if kpi["step_number"] != current_step:
            current_step = kpi["step_number"]
            console.print(f"\n[bold yellow]{'─' * 100}[/bold yellow]")
            console.print(f"[bold yellow]STEP {current_step}: {kpi['internal_code']}[/bold yellow]")
            console.print(f"[bold yellow]{'─' * 100}[/bold yellow]\n")
        
        # KPI-Details
        kpi_type_emoji = {
            "strategic": "🎯",
            "tactical": "⚙️",
            "operational": "🔧"
        }
        
        console.print(f"{kpi_type_emoji[kpi['kpi_type']]} [bold]{kpi['title']}[/bold]")
        console.print(f"   Code: [dim]{kpi['kpi_code']}[/dim]")
        console.print(f"   Unit: [cyan]{kpi['unit']}[/cyan]")
        console.print(f"   DE (Normal):     {kpi['matrix_data']['de']['colloquial'][:90]}...")
        console.print(f"   DE (Management): [italic]{kpi['matrix_data']['de']['management'][:90]}...[/italic]")
        console.print()


def validate_kpi_library() -> bool:
    """
    Validiert die KPI-Bibliothek auf Vollständigkeit und Korrektheit.
    """
    console.print("\n[bold cyan]🔍 Validiere KPI-Bibliothek...[/bold cyan]\n")
    
    # Prüfe Anzahl
    total_kpis = len(PMI_KPI_LIBRARY)
    console.print(f"✓ Gesamtanzahl KPIs: {total_kpis}")
    
    if total_kpis != 30:
        console.print(f"[bold red]✗ FEHLER: Erwartet 30 KPIs, gefunden {total_kpis}[/bold red]")
        return False
    
    # Prüfe 3 KPIs pro Schritt
    steps_count = {}
    for kpi in PMI_KPI_LIBRARY:
        step = kpi["step_number"]
        steps_count[step] = steps_count.get(step, 0) + 1
    
    for step in range(1, 11):
        count = steps_count.get(step, 0)
        if count != 3:
            console.print(f"[bold red]✗ FEHLER: Step {step} hat {count} KPIs statt 3[/bold red]")
            return False
        console.print(f"✓ Step {step}: {count} KPIs")
    
    # Prüfe KPI-Typen
    type_counts = {"strategic": 0, "tactical": 0, "operational": 0}
    for kpi in PMI_KPI_LIBRARY:
        type_counts[kpi["kpi_type"]] += 1
    
    console.print(f"\n✓ Strategic KPIs:  {type_counts['strategic']}")
    console.print(f"✓ Tactical KPIs:   {type_counts['tactical']}")
    console.print(f"✓ Operational KPIs: {type_counts['operational']}")
    
    # Prüfe Matrix-Struktur
    console.print("\n[bold cyan]🔍 Prüfe 2x3 Matrix-Struktur...[/bold cyan]")
    for kpi in PMI_KPI_LIBRARY:
        matrix = kpi["matrix_data"]
        for lang in ["de", "en", "es"]:
            if lang not in matrix:
                console.print(f"[bold red]✗ FEHLER: Sprache '{lang}' fehlt in {kpi['kpi_code']}[/bold red]")
                return False
            for register in ["colloquial", "management"]:
                if register not in matrix[lang]:
                    console.print(f"[bold red]✗ FEHLER: Register '{register}' fehlt in {kpi['kpi_code']}.{lang}[/bold red]")
                    return False
    
    console.print("✓ Alle KPIs haben vollständige 2x3 Matrix (DE/EN/ES x Normal/Management)")
    
    console.print("\n[bold green]✓ Validierung erfolgreich![/bold green]\n")
    return True


def upload_to_supabase() -> bool:
    """
    Lädt alle KPIs in die Supabase pmo_kpi_library-Tabelle hoch.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        console.print("[bold red]✗ FEHLER: SUPABASE_URL und SUPABASE_KEY müssen in .env definiert sein![/bold red]")
        return False
    
    try:
        console.print("\n[bold cyan]📤 Verbinde mit Supabase...[/bold cyan]")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        console.print("[bold cyan]📤 Lade 30 KPIs hoch...[/bold cyan]")
        response = supabase.table("pmo_kpi_library").insert(PMI_KPI_LIBRARY).execute()
        
        console.print(f"[bold green]✓ Upload erfolgreich! {len(response.data)} KPIs wurden hochgeladen.[/bold green]")
        return True
        
    except Exception as e:
        console.print(f"[bold red]✗ Fehler beim Upload: {str(e)}[/bold red]")
        return False


# ============================================================================
# MAIN
# ============================================================================

def main():
    """
    Hauptfunktion - interaktiver Workflow
    """
    # Header
    console.print(Panel.fit(
        "[bold cyan]PMO Impact Cycle - KPI Library Sync[/bold cyan]\n"
        "Extraktion und Synchronisation von 30 PMI-konformen Kennzahlen",
        border_style="cyan"
    ))
    
    # 1. Validierung
    if not validate_kpi_library():
        console.print("[bold red]❌ Validierung fehlgeschlagen. Abbruch.[/bold red]")
        sys.exit(1)
    
    # 2. Tabellarische Übersicht
    console.print("\n")
    table = create_kpi_summary_table()
    console.print(table)
    
    # 3. Optionale Detailansicht
    show_details = Confirm.ask("\n[bold]Möchtest du die detaillierte Beschreibung aller KPIs sehen?[/bold]", default=False)
    if show_details:
        print_detailed_kpi_info()
    
    # 4. Upload-Bestätigung
    console.print("\n" + "─" * 100)
    upload_confirm = Confirm.ask(
        "\n[bold yellow]⚠️  Möchtest du diese 30 KPIs jetzt in Supabase (pmo_kpi_library) hochladen?[/bold yellow]",
        default=False
    )
    
    if not upload_confirm:
        console.print("\n[bold]❌ Upload abgebrochen.[/bold]")
        console.print("[dim]Tipp: Du kannst das Skript später erneut ausführen.[/dim]")
        sys.exit(0)
    
    # 5. Upload durchführen
    success = upload_to_supabase()
    
    if success:
        console.print("\n" + "─" * 100)
        console.print(Panel.fit(
            "[bold green]✅ SYNC ERFOLGREICH[/bold green]\n\n"
            "30 KPIs wurden erfolgreich in Supabase hochgeladen.\n"
            "Die KPIs können jetzt in der Frontend-Anwendung genutzt werden.",
            border_style="green"
        ))
    else:
        console.print("\n[bold red]❌ Upload fehlgeschlagen.[/bold red]")
        sys.exit(1)


if __name__ == "__main__":
    main()

