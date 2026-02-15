"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, AlertTriangle, Target, Zap } from "lucide-react";

const CONTENT_MATRIX = {
  de: {
    colloquial: {
      topTitle: "KONZEPT & REALITÄTS-CHECK",
      subTitle: "Erst der Plan, dann das Budget.",
      leftCol: {
        title: "DIE HERAUSFORDERUNG",
        headline: "Ein digitales Chaos wird in der Cloud nicht besser – nur schneller.",
        reality: "Die Realität: Ihr habt Jira, SAP, Teams, etc. aber Projekte werden trotzdem per Flurfunk gesteuert. Ein neues Tool zu kaufen, löst das Kultur-Problem nicht.",
        fix: "Der Fix: Wir stoppen den 'Tool-First' Reflex. In Phase 1 schreiben wir keinen Code. Wir suchen die Lecks im Geldbeutel, nicht im Serverraum.",
        effect: "Der Value Generator Effekt: Wir verhindern, dass ihr in Lösungen investiert, die keiner braucht. Proof of Value vor Proof of Concept."
      },
      rightCol: {
        title: "DER ENGINEERING ANSATZ",
        headline: "Architektur schlägt Aktionismus.",
        challenge: "Das Problem: Strategie und Operative sprechen oft verschiedene Sprachen. Das kostet Zeit, Nerven und Marge.",
        approach: "Der Ansatz: Wir nutzen die Orientierung an ISO/IEC 15288 nicht als Bürokratie-Monster, sondern als Checkliste für Erfolg. Wir übersetzen 'Wir müssten mal...' in 'Systemanforderung ID-101'.",
        advantage: "Der Vorteil: Eine Daten-Ebene, die Orientierung verleiht. Wir verbinden die ERP-Realität mit der Vision der Geschäftsführung."
      },
      cta: "Schluss mit Geldverbrennen? Lass uns reden."
    },
    management: {
      topTitle: "CONCEPT DEVELOPMENT",
      subTitle: "Strategic, Tactical & Operational Alignment & Architecture Definition",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Mangelnde Kohärenz zwischen Strategie, Taktik, Operation & IT-Execution.",
        reality: "Status Quo: Heterogene Tool-Landschaften führen oft zu Daten-Silos. Entscheidungen basieren auf veralteten Excel-Exporten statt auf Echtzeit-Daten.",
        fix: "Die Lösung: Strukturierte Anforderungsanalyse vor CAPEX/OPEX-Freigabe. Wir identifizieren Redundanzen und definieren klare Value Streams.",
        effect: "Impact: Vermeidung von 'Shelfware' und Fehlallokation von Ressourcen. Investitionssicherheit durch klare Architektur."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Stakeholder Value Assurance aligned with ISO 15288.",
        challenge: "Analysdefizit: 70% der IT-Projekte verfehlen ihre Ziele aufgrund unzureichender 'Concept Definition' Phasen.",
        approach: "Methodik: Wir mappen die Systemarchitektur direkt auf die finanziellen Ziele der Organisation. Volle Traceability vom ersten Tag an.",
        advantage: "Vorteil: Ein agnostischer Data-Layer, der bestehende Systeme (SAP/Azure/etc.) integriert, statt sie zu ersetzen."
      },
      cta: "Optimieren Sie Ihren ROI. Kontaktieren Sie uns."
    }
  },
  en: {
    colloquial: {
      topTitle: "CONCEPT & REALITY CHECK",
      subTitle: "Think first, spend later.",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Digitizing a mess just makes it run faster.",
        reality: "The Reality: You probably have five different PM tools, yet crucial decisions are made based on gut feeling. Buying another license won't fix a broken process.",
        fix: "The Fix: We stop the 'Tool-First' madness. In Phase 1, we don't build; we dissect. We look for value leaks, not just software bugs.",
        effect: "The Value Generator Effect: We stop you from spending budget on things that don't move the needle. Logic before licenses."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Architecture beats Activity.",
        challenge: "The Problem: Strategy and Execution are often disconnected. This creates friction, confusion, and burns budget.",
        approach: "The Approach: We use ISO/IEC 15288 principles to translate 'We need something better' into 'System Requirement ID-101'.",
        advantage: "The Advantage: An agnostic data layer that tells a differenttruth. We bridge the gap between your ERP reality and your strategic vision."
      },
      cta: "Want to stop guessing? Let's talk."
    },
    management: {
      topTitle: "CONCEPT DEVELOPMENT",
      subTitle: "Strategic Alignment & Architecture Definition",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Misalignment between Strategic Intent & Operations.",
        reality: "Status Quo: Fragmented tool landscapes create data silos. Decisions are often based on lagging indicators rather than real-time intelligence.",
        fix: "The Solution: Structured requirements engineering before CAPEX/OPEX approval. We identify redundancies and define clear value streams.",
        effect: "Impact: Prevention of 'shelfware' and resource misallocation. Investment security through rigorous architecture."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Stakeholder Value Assurance (ISO 15288).",
        challenge: "Analysis Deficit: The majority of project failures stem from inadequate 'Concept Definition' phases, not technology failures.",
        approach: "Methodology: We map the system architecture directly to the holding's financial goals. Full traceability from day one.",
        advantage: "Advantage: An agnostic data integration layer that enhances existing systems (SAP/Azure/etc.) rather than replacing them."
      },
      cta: "Secure your investment. Let's discuss."
    }
  },
  es: {
    colloquial: {
      topTitle: "CONCEPTO Y REALIDAD",
      subTitle: "Pensar antes de gastar.",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Automatizar el caos no lo arregla, lo acelera.",
        reality: "La Realidad: Seguramente tenéis Jira y Excel, pero las decisiones se toman por intuición. Comprar más software no arregla un proceso roto.",
        fix: "La Solución: Frenamos la locura de 'Comprar primero'. En la Fase 1, analizamos. Buscamos fugas de valor, no bugs de software.",
        effect: "El Efecto: Evitamos que gastéis presupuesto en cosas que no importan. Lógica antes que licencias."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "La arquitectura gana a la actividad.",
        challenge: "El Problema: La estrategia y la ejecución suelen estar desconectadas. Eso quema dinero y paciencia.",
        approach: "El Enfoque: Usamos un enfoque alineado con la norma ISO/IEC 15288 para traducir 'Necesitamos mejorar' en 'Requisito del Sistema ID-101'.",
        advantage: "La Ventaja: Una capa de datos que dice la verdad. Conectamos vuestro ERP con vuestra visión estratégica."
      },
      cta: "¿Listos para la verdad? Hablemos."
    },
    management: {
      topTitle: "DESARROLLO DEL CONCEPTO",
      subTitle: "Alineación Estratégica y Arquitectura",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Desalineación entre Estrategia y Operaciones.",
        reality: "Status Quo: Herramientas fragmentadas crean silos de datos. Las decisiones se basan en indicadores pasados, no en inteligencia real.",
        fix: "La Solución: Ingeniería de requisitos estructurada antes de aprobar CAPEX/OPEX. Definimos flujos de valor claros.",
        effect: "Impacto: Prevención de software no utilizado y mala asignación de recursos. Seguridad de inversión."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Aseguramiento de Valor (ISO 15288).",
        challenge: "Déficit de Análisis: La mayoría de fallos en proyectos provienen de una definición de concepto inadecuada.",
        approach: "Metodología: Mapeamos la arquitectura del sistema directamente a los objetivos financieros. Trazabilidad total.",
        advantage: "Ventaja: Una capa de integración de datos agnóstica que mejora los sistemas existentes (SAP/Azure) en lugar de reemplazarlos."
      },
      cta: "Maximice su retorno. Hablemos."
    }
  }
} as const;

type LangKey = keyof typeof CONTENT_MATRIX;
type ModeKey = "colloquial" | "management";

function Phase1DocContent() {
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
              EXECUTIVE BRIEFING | PHASE 01
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

export default function Phase1DocPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    }>
      <Phase1DocContent />
    </Suspense>
  );
}
