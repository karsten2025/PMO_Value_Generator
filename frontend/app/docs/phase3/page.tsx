"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, AlertTriangle, Target, Zap } from "lucide-react";

const CONTENT_MATRIX = {
  de: {
    colloquial: {
      topTitle: "START & TRAINING",
      subTitle: "Wir werfen das Tool nicht über den Zaun.",
      leftCol: {
        title: "DIE HERAUSFORDERUNG",
        headline: "Ein neues Tool ohne Training ist nur teure Verwirrung.",
        reality: "Die Realität: Software wird installiert, Logins verschickt, und das Team wird allein gelassen. Das Ergebnis? Frust, Fehler und 'Früher war alles besser'.",
        fix: "Der Fix: Wir machen aus Betroffenen Beteiligte. Kein Frontalunterricht, sondern 'Guided Onboarding'. Wir gehen erst, wenn ihr sicher seid.",
        effect: "Der Value Generator Effekt: Das Team versteht nicht nur das 'Wie', sondern das 'Warum'. Akzeptanz durch Kompetenz."
      },
      rightCol: {
        title: "DER ENGINEERING ANSATZ",
        headline: "Transition Process (ISO 15288).",
        challenge: "Das Problem: Der 'Human Factor' ist das größte Risiko beim Go-Live. Bedienfehler ruinieren die Datenintegrität sofort.",
        approach: "Der Ansatz: Strukturierte Transition. Wir validieren die Einsatzbereitschaft der Operator (eures Teams), nicht nur die des Systems.",
        advantage: "Der Vorteil: Minimale 'Hypercare'-Phase. Das System liefert ab Tag 1 valide Daten, weil die User wissen, was sie tun."
      },
      cta: "Wollen Sie echte Nutzer oder nur Logins? Starten wir."
    },
    management: {
      topTitle: "TRANSITION & ENABLEMENT",
      subTitle: "Operational Readiness & Change Management",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Risikominimierung beim Go-Live.",
        reality: "Status Quo: Mangelndes Enablement führt zu einem massiven Produktivitäts-Knick ('J-Curve') nach der Einführung.",
        fix: "Die Lösung: Rollen-basiertes Training und User Acceptance Testing (UAT) als fester Bestandteil der Abnahme.",
        effect: "Impact: Schnellerer 'Time-to-Value'. Reduktion von Support-Tickets und Prozess-Abweichungen in der Startphase."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "System Transition Process.",
        challenge: "Transition Gap: Die Diskrepanz zwischen System-Fähigkeit und User-Fähigkeit.",
        approach: "Methodik: Verifikation der 'Operational Readiness' gemäß ISO 15288 Standards. Installation, Integration und Abnahme im Nutzungskontext.",
        advantage: "Vorteil: Audit-sichere Einführung. Risikoloser Übergang vom Projekt-Status in den Linien-Betrieb."
      },
      cta: "Sichern Sie den Go-Live Erfolg. Kontaktieren Sie uns."
    }
  },
  en: {
    colloquial: {
      topTitle: "START & TRAINING",
      subTitle: "We don't throw the tool over the fence.",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "A new tool without training is just expensive confusion.",
        reality: "The Reality: Software is installed, logins are sent, and the team is left alone. The result? Frustration, errors, and 'It was better before'.",
        fix: "The Fix: We turn victims into participants. No boring lectures, but 'Guided Onboarding'. We don't leave until you are confident.",
        effect: "The Value Generator Effect: The team understands not just the 'How', but the 'Why'. Acceptance through competence."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Transition Process (ISO 15288).",
        challenge: "The Problem: The 'Human Factor' is the biggest risk at Go-Live. Operator errors ruin data integrity immediately.",
        approach: "The Approach: Structured Transition. We validate the readiness of the operators (your team), not just the system.",
        advantage: "The Advantage: Minimal 'Hypercare' phase. The system delivers valid data from Day 1 because users know what they are doing."
      },
      cta: "Do you want users or just logins? Let's start."
    },
    management: {
      topTitle: "TRANSITION & ENABLEMENT",
      subTitle: "Operational Readiness & Change Management",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Risk Mitigation at Go-Live.",
        reality: "Status Quo: Lack of enablement leads to a massive productivity dip ('J-Curve') after implementation.",
        fix: "The Solution: Role-based training and User Acceptance Testing (UAT) as an integral part of sign-off.",
        effect: "Impact: Faster 'Time-to-Value'. Reduction of support tickets and process deviations in the startup phase."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "System Transition Process.",
        challenge: "Transition Gap: The discrepancy between system capability and user capability.",
        approach: "Methodology: Verification of 'Operational Readiness' according to ISO 15288. Installation, integration, and acceptance in the operational context.",
        advantage: "Advantage: Audit-proof introduction. Risk-free transition from project status to line operation."
      },
      cta: "Secure Go-Live success. Let's discuss."
    }
  },
  es: {
    colloquial: {
      topTitle: "INICIO Y FORMACIÓN",
      subTitle: "No tiramos la herramienta por encima de la valla.",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Una herramienta nueva sin formación es solo confusión cara.",
        reality: "La Realidad: Se instala el software, se envían accesos y se abandona al equipo. ¿Resultado? Frustración y errores.",
        fix: "La Solución: Convertimos a las víctimas en participantes. Nada de clases aburridas, sino 'Onboarding Guiado'. No nos vamos hasta que estéis seguros.",
        effect: "El Efecto: El equipo no solo entiende el 'Cómo', sino el 'Por qué'. Aceptación a través de la competencia."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Proceso de Transición (ISO 15288).",
        challenge: "El Problema: El 'Factor Humano' es el mayor riesgo. Los errores operativos arruinan la integridad de los datos.",
        approach: "El Enfoque: Transición Estructurada. Validamos la preparación de los operadores, no solo la del sistema.",
        advantage: "La Ventaja: Fase de 'Hypercare' mínima. El sistema entrega datos válidos desde el Día 1."
      },
      cta: "¿Queréis usuarios o solo logins? Empecemos."
    },
    management: {
      topTitle: "TRANSICIÓN Y HABILITACIÓN",
      subTitle: "Preparación Operativa y Gestión del Cambio",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Mitigación de riesgos en el Go-Live.",
        reality: "Status Quo: La falta de habilitación conduce a una caída masiva de productividad ('Curva J') tras la implementación.",
        fix: "La Solución: Formación basada en roles y Pruebas de Aceptación de Usuario (UAT) como parte del cierre.",
        effect: "Impacto: 'Time-to-Value' más rápido. Reducción de tickets de soporte y desviaciones en la fase inicial."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Proceso de Transición del Sistema.",
        challenge: "Brecha de Transición: La discrepancia entre la capacidad del sistema y la del usuario.",
        approach: "Metodología: Verificación de la 'Preparación Operativa' según ISO 15288. Instalación, integración y aceptación en el contexto operativo.",
        advantage: "Ventaja: Introducción a prueba de auditorías. Transición sin riesgos a la operación."
      },
      cta: "Asegure el éxito del lanzamiento. Hablemos."
    }
  }
} as const;

type LangKey = keyof typeof CONTENT_MATRIX;
type ModeKey = "colloquial" | "management";

function Phase3DocContent() {
  const searchParams = useSearchParams();
  const langParam = (searchParams.get("lang") || "en").toLowerCase();
  const modeParam = (searchParams.get("mode") || "colloquial").toLowerCase();

  const langKey: LangKey = ["de", "en", "es"].includes(langParam) ? langParam as LangKey : "en";
  const modeKey: ModeKey = modeParam === "management" ? "management" : "colloquial";

  const content = CONTENT_MATRIX[langKey][modeKey];
  const { leftCol, rightCol } = content;

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 print:p-0 print:min-h-0 print:flex-none">
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2
                   bg-slate-900/80 backdrop-blur-md border border-slate-600/50
                   text-slate-400 hover:text-white rounded-lg
                   shadow-lg shadow-slate-900/30 transition-colors
                   print:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Dashboard
      </Link>

      <button
        onClick={handlePrint}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2
                   bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                   shadow-lg shadow-blue-500/30 transition-colors
                   print:hidden"
      >
        <Printer className="w-4 h-4" />
        Print / PDF
      </button>

      <article
        className="w-full max-w-[210mm] bg-slate-900 border border-slate-700
                   shadow-2xl shadow-slate-900/50 overflow-hidden
                   print:shadow-none print:border-0 print:w-full print:max-w-none print:overflow-visible
                   [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
        style={{ aspectRatio: "210/297", minHeight: "297mm" }}
      >
        <div className="p-8 sm:p-12 print:p-10 print:min-h-0 h-full flex flex-col">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-600/80 print:break-inside-avoid">
            <div className="flex items-center gap-4">
              <Image src="/value-engine-logo.png" alt="Symbiotic Value Engine" width={80} height={80} className="object-contain shrink-0" />
              <span className="text-lg font-bold text-white tracking-tight">PMO VALUE ENGINE</span>
            </div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">EXECUTIVE BRIEFING | PHASE 03</span>
          </header>

          <section className="mt-8 mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[0.2em] uppercase mb-2">{content.topTitle}</h1>
            <p className="text-slate-400 text-lg mb-4">{content.subTitle}</p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-medium">
              Aligned with ISO/IEC 15288 and PMI standards
            </span>
          </section>

          <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="space-y-4 p-5 rounded-lg bg-slate-800/50 border-2 border-blue-500/30 min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {leftCol.title}
              </h2>
              <h3 className="text-lg font-semibold text-white">{leftCol.headline}</h3>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{leftCol.reality}</p>
                <p>{leftCol.fix}</p>
                <p>{leftCol.effect}</p>
              </div>
            </div>

            <div className="space-y-4 p-5 rounded-lg bg-slate-800/50 border-2 border-cyan-500/30 min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
                <Target className="w-4 h-4 shrink-0" />
                {rightCol.title}
              </h2>
              <h3 className="text-lg font-semibold text-white">{rightCol.headline}</h3>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{rightCol.challenge}</p>
                <p>{rightCol.approach}</p>
                <p>{rightCol.advantage}</p>
              </div>
            </div>
          </section>

          <p className="mt-6 text-cyan-400 font-medium text-sm">👉 {content.cta}</p>

          <section className="mt-8 p-5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
            <div className="flex flex-wrap gap-6 sm:gap-10 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-sm text-slate-300"><strong className="text-white">Average Efficiency Gain:</strong> +25%</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm text-slate-300"><strong className="text-white">ROI Duration:</strong> &lt; 12 Months</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm text-slate-300"><strong className="text-white">Risk Reduction:</strong> High</span>
              </div>
            </div>
          </section>

          <footer className="mt-auto pt-8 border-t border-slate-600/80 space-y-2 print:break-inside-avoid print:pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <span className="font-semibold text-slate-200">
                Karsten Zenk
                <span className="text-amber-400/90" style={{ textShadow: "0 0 8px rgba(251,191,36,0.4)" }}>
                  {" "}– Dipl.-Ing(FH)-PMP®-PMI-ACP®-PMO-CP™-PMI-CPMAI™
                </span>
              </span>
              <span className="text-slate-400">© 2026 Zenk Systems. Confidential & Proprietary.</span>
            </div>
            <p className="text-[10px] text-slate-500">Musterstraße 1, WF | www.zenk-pm-now.de</p>
          </footer>
        </div>
      </article>
    </div>
  );
}

export default function Phase3DocPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <Phase3DocContent />
    </Suspense>
  );
}
