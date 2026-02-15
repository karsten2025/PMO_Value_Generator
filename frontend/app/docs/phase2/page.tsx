"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, AlertTriangle, Target, Zap } from "lucide-react";

const CONTENT_MATRIX = {
  de: {
    colloquial: {
      topTitle: "DER MASCHINENRAUM",
      subTitle: "Vom Flickenteppich zum Nervensystem.",
      leftCol: {
        title: "DIE HERAUSFORDERUNG",
        headline: "Ein Haufen Tools ist noch kein System.",
        reality: "Realität: Ihr nennt es 'Integration', aber eigentlich kopiert Praktikant Tim Daten von SAP nach Excel. Eure Software-Landschaft gleicht Frankensteins Monster: Alles irgendwie zusammengeklebt, aber nichts lebt wirklich.",
        fix: "Der Fix: Wir kappen die 'Luft-Schnittstellen'. In Phase 2 bauen wir echte Brücken. Keine CSV-Exporte mehr, sondern APIs, die flüstern.",
        effect: "Effekt: Daten fließen wie Wasser, nicht wie Honig. Echtzeit statt 'Stand vom letzten Montag'."
      },
      rightCol: {
        title: "DER ENGINEERING ANSATZ",
        headline: "System Development & Integration.",
        challenge: "Problem: Isolierte Datensilos verhindern skalierbare Prozesse. Manuelle Übertragungsfehler zerstören das Vertrauen in die Zahlen.",
        approach: "Ansatz: Wir implementieren die in Phase 1 definierte Architektur. Wir verbinden Subsysteme (ERP, PPM, CRM) über einen agnostischen Data-Layer.",
        advantage: "Vorteil: 'Single Source of Truth'. Das System validiert sich selbst. Wir bauen Interoperabilität by Design."
      },
      cta: "Schluss mit Basteln? Wir bauen Systeme."
    },
    management: {
      topTitle: "SYSTEM DEVELOPMENT",
      subTitle: "Implementation, Integration & Verification",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Fragmentierte IT-Landschaft & Daten-Latenz.",
        reality: "Status Quo: Fehlende Interoperabilität zwischen Legacy-Systemen und modernen Tools führt zu hohen Wartungskosten und langsamen Entscheidungszyklen.",
        fix: "Lösung: Entwicklung einer robusten Middleware-Architektur. Wir ersetzen Punkt-zu-Punkt-Verbindungen durch einen zentralen Integrations-Hub.",
        effect: "Impact: Reduktion der technischen Schulden. Erhöhung der Datenqualität und Prozessgeschwindigkeit."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Verification & Validation (V&V).",
        challenge: "Risiko: Ungetestete Schnittstellen führen im operativen Betrieb zu Dateninkonsistenzen und Ausfällen.",
        approach: "Methodik: Rigoroses Testing der Subsysteme vor dem Go-Live. Wir verifizieren gegen die Anforderungen aus Phase 1 (Traceability).",
        advantage: "Vorteil: Ein stabiles, auditierbares Gesamtsystem, das skalierbar mit der Holding wächst."
      },
      cta: "Integrieren Sie Ihre Wertschöpfung. Kontaktieren Sie uns."
    }
  },
  en: {
    colloquial: {
      topTitle: "UNDER THE HOOD",
      subTitle: "Building a nervous system, not a junkyard.",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Duct tape is not an integration strategy.",
        reality: "The Reality: You have great tools, but they don't talk to each other. Your 'integration' is usually a stressed employee copy-pasting CSV files. It's a Frankenstein system.",
        fix: "The Fix: We rip off the band-aids. In Phase 2, we build actual bridges. APIs that work silently in the background, connecting your SAP to your reality.",
        effect: "The Effect: Real-time data flow. No more 'Let me check the spreadsheet from last week'."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "System Development & Integration.",
        challenge: "The Problem: Data silos create blind spots. Manual data entry creates errors. Both destroy trust in your reporting.",
        approach: "The Approach: We implement the architecture defined in Phase 1. Connecting subsystems via an agnostic data layer.",
        advantage: "The Advantage: A self-validating system. We engineer interoperability so you can stop micromanaging data."
      },
      cta: "Ready to stop gluing things together? Let's build."
    },
    management: {
      topTitle: "SYSTEM DEVELOPMENT",
      subTitle: "Implementation, Integration & Verification",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Fragmented Ecosystems & Technical Debt.",
        reality: "Status Quo: Lack of interoperability between legacy ERPs and modern SaaS tools leads to high maintenance costs and data latency.",
        fix: "The Solution: Developing a robust middleware architecture. Replacing fragile point-to-point connections with a scalable integration hub.",
        effect: "Impact: Drastic reduction of technical debt. Increased data integrity and operational speed."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Verification & Validation (V&V).",
        challenge: "Risk: Untested interfaces lead to data corruption and operational downtime during rollout.",
        approach: "Methodology: Rigorous subsystem testing prior to deployment. Ensuring traceability back to Phase 1 requirements.",
        advantage: "Advantage: A stable, audit-ready ecosystem designed for scalability across the holding."
      },
      cta: "Integrate your value stream. Let's discuss."
    }
  },
  es: {
    colloquial: {
      topTitle: "BAJO EL CAPÓ",
      subTitle: "Construyendo un sistema nervioso, no un vertedero.",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "La cinta adhesiva no es una estrategia de integración.",
        reality: "La Realidad: Tenéis herramientas geniales, pero no se hablan. Vuestra 'integración' suele ser un empleado estresado copiando Excel. Es un sistema Frankenstein.",
        fix: "La Solución: Quitamos los parches. En la Fase 2, construimos puentes reales. APIs que trabajan en silencio, conectando vuestro SAP con la realidad.",
        effect: "El Efecto: Flujo de datos en tiempo real. Se acabó el 'Déjame mirar el reporte de la semana pasada'."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Desarrollo e Integración de Sistemas.",
        challenge: "El Problema: Los silos de datos crean puntos ciegos. La entrada manual crea errores. Ambos destruyen la confianza.",
        approach: "El Enfoque: Implementamos la arquitectura definida en la Fase 1. Conectando subsistemas vía una capa de datos agnóstica.",
        advantage: "La Ventaja: Un sistema que se autovalida. Diseñamos la interoperabilidad para que dejéis de micro-gestionar datos."
      },
      cta: "¿Listos para conectar de verdad? Hablemos."
    },
    management: {
      topTitle: "DESARROLLO DEL SISTEMA",
      subTitle: "Implementación, Integración y Verificación",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Ecosistemas Fragmentados y Deuda Técnica.",
        reality: "Status Quo: La falta de interoperabilidad entre sistemas heredados y herramientas modernas eleva los costes de mantenimiento.",
        fix: "La Solución: Desarrollo de una arquitectura middleware robusta. Reemplazo de conexiones frágiles por un hub de integración.",
        effect: "Impacto: Reducción drástica de la deuda técnica. Mayor integridad de datos y velocidad operativa."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Verificación y Validación (V&V).",
        challenge: "Riesgo: Interfaces no probadas llevan a la corrupción de datos y tiempos de inactividad.",
        approach: "Metodología: Pruebas rigurosas de subsistemas antes del despliegue. Asegurando la trazabilidad con los requisitos de la Fase 1.",
        advantage: "Ventaja: Un ecosistema estable y auditable diseñado para escalar."
      },
      cta: "Integre su flujo de valor. Hablemos."
    }
  }
} as const;

type LangKey = keyof typeof CONTENT_MATRIX;
type ModeKey = "colloquial" | "management";

function Phase2DocContent() {
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
      {/* Zurück zum Dashboard - nur auf Bildschirm sichtbar */}
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

      {/* Print Button - nur auf Bildschirm sichtbar */}
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

      {/* A4 Document Container */}
      <article
        className="w-full max-w-[210mm] bg-slate-900 border border-slate-700
                   shadow-2xl shadow-slate-900/50 overflow-hidden
                   print:shadow-none print:border-0 print:w-full print:max-w-none print:overflow-visible
                   [print-color-adjust:exact] [-webkit-print-color-adjust:exact]"
        style={{
          aspectRatio: "210/297",
          minHeight: "297mm",
        }}
      >
        <div className="p-8 sm:p-12 print:p-10 print:min-h-0 h-full flex flex-col">
          {/* ─── HEADER ─── */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-600/80 print:break-inside-avoid">
            <div className="flex items-center gap-4">
              <Image
                src="/value-engine-logo.png"
                alt="Symbiotic Value Engine"
                width={80}
                height={80}
                className="object-contain shrink-0"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                PMO VALUE ENGINE
              </span>
            </div>
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
              EXECUTIVE BRIEFING | PHASE 02
            </span>
          </header>

          {/* ─── HERO SECTION ─── */}
          <section className="mt-8 mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[0.2em] uppercase mb-2">
              {content.topTitle}
            </h1>
            <p className="text-slate-400 text-lg mb-4">
              {content.subTitle}
            </p>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                            bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-medium">
              Aligned with ISO/IEC 15288 and PMI standards
            </span>
          </section>

          {/* ─── MAIN CONTENT: 2-Spalten-Layout ─── */}
          <section className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            {/* Linke Spalte: THE CHALLENGE */}
            <div className="space-y-4 p-5 rounded-lg bg-slate-800/50 border-2 border-blue-500/30 min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {leftCol.title}
              </h2>
              <h3 className="text-lg font-semibold text-white">
                {leftCol.headline}
              </h3>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{leftCol.reality}</p>
                <p>{leftCol.fix}</p>
                <p>{leftCol.effect}</p>
              </div>
            </div>

            {/* Rechte Spalte: THE ENGINEERING APPROACH */}
            <div className="space-y-4 p-5 rounded-lg bg-slate-800/50 border-2 border-cyan-500/30 min-w-0">
              <h2 className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider">
                <Target className="w-4 h-4 shrink-0" />
                {rightCol.title}
              </h2>
              <h3 className="text-lg font-semibold text-white">
                {rightCol.headline}
              </h3>
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                <p>{rightCol.challenge}</p>
                <p>{rightCol.approach}</p>
                <p>{rightCol.advantage}</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <p className="mt-6 text-cyan-400 font-medium text-sm">
            👉 {content.cta}
          </p>

          {/* ─── KEY METRICS ─── */}
          <section className="mt-8 p-5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30">
            <div className="flex flex-wrap gap-6 sm:gap-10 justify-center sm:justify-start">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Average Efficiency Gain:</strong> +25%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">ROI Duration:</strong> &lt; 12 Months
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm text-slate-300">
                  <strong className="text-white">Risk Reduction:</strong> High
                </span>
              </div>
            </div>
          </section>

          {/* ─── FOOTER ─── */}
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
            <p className="text-[10px] text-slate-500">
              Musterstraße 1, WF | www.zenk-pm-now.de
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
}

export default function Phase2DocPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <Phase2DocContent />
    </Suspense>
  );
}
