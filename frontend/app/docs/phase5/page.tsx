"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, AlertTriangle, Target, Zap } from "lucide-react";

const CONTENT_MATRIX = {
  de: {
    colloquial: {
      topTitle: "LERNEN & EVOLUTION",
      subTitle: "Nichts bleibt für immer.",
      leftCol: {
        title: "DIE HERAUSFORDERUNG",
        headline: "Was heute gilt, könnte morgen schon überholt sein.",
        reality: "Die Realität: Viele Firmen wünschen sich Ruhe und 'fertige' Prozesse. Aber der Markt spielt da oft nicht mit. Wer zu lange wartet, könnte den Anschluss verlieren.",
        fix: "Der Fix: Mut zur Anpassung. Wir betrachten den Ist-Zustand am besten als 'aktuelle Beta-Version'. Wenn neue Daten auftauchen, sollte sich der Plan ändern – idealerweise bevor es weh tut.",
        effect: "Der Value Generator Effekt: Wir versuchen, aus bloßen Daten echtes Wissen zu filtern. Wir bauen weniger eine statische Festung, sondern eher ein System, das mitwächst."
      },
      rightCol: {
        title: "DER ENGINEERING ANSATZ",
        headline: "Complex Adaptive Systems (CAS).",
        challenge: "Das Problem: Starre Modelle tun sich in komplexen Umgebungen (VUCA) oft schwer. Man optimiert sich eventuell in eine Sackgasse.",
        approach: "Der Ansatz: Improvement Process (ISO 15288). Wir etablieren Feedback-Loops, die das System ermutigen, sich anzupassen. Evolution statt harter Re-Organisation.",
        advantage: "Der Vorteil: Antifragilität. Das System dürfte unter Stress nicht schwächer werden, sondern könnte sogar dazulernen. Fehler werden zu Datenpunkten."
      },
      cta: "Bereit für die nächste Stufe der Evolution?"
    },
    management: {
      topTitle: "CONTINUOUS IMPROVEMENT",
      subTitle: "Adaptive Systems & Knowledge Management",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Vermeidung von Stagnation in lokalen Optima.",
        reality: "Status Quo: Organisationen tendieren zu statischen Equilibria. Prozesse werden 'in Stein gemeißelt', was die Adaptionsfähigkeit bei Markt-Disruptionen lähmt.",
        fix: "Die Lösung: Implementierung der DIKW-Hierarchie (Data-Information-Knowledge-Wisdom). Transformation von reiner Datenerfassung zu prädiktiver Weisheit.",
        effect: "Impact: Übergang zu einer 'Learning Organization'. Entscheidungen basieren auf dynamischer Evidenz, nicht auf veralteten Dogmen."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "System Improvement Process.",
        challenge: "Adaptation Deficit: Die Halbwertszeit von Prozess-Wissen sinkt dramatisch. Starre Frameworks werden zu technologischen Schulden.",
        approach: "Methodik: Double-Loop Learning. Wir hinterfragen nicht nur die Handlungen (Are we doing things right?), sondern die Prämissen (Are we doing the right things?).",
        advantage: "Vorteil: Ein 'Complex Adaptive System', das sich selbst rekonfiguriert. Maximale Resilienz durch kontinuierliche Selbst-Optimierung."
      },
      cta: "Transformieren Sie Ihr PMO in ein adaptives System."
    }
  },
  en: {
    colloquial: {
      topTitle: "LEARNING & EVOLUTION",
      subTitle: "Nothing stays forever.",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "What works today might be outdated tomorrow.",
        reality: "The Reality: Many companies hope for stability and 'finished' processes. But the market often doesn't play along. Waiting too long could mean losing the connection.",
        fix: "The Fix: The Courage to Adapt. It's best to view the status quo as a 'current Beta version'. When new data appears, the plan should change—ideally before it hurts.",
        effect: "The Value Generator Effect: We try to filter real knowledge from raw data. We build less of a static fortress and more of a system that grows with you."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Complex Adaptive Systems (CAS).",
        challenge: "The Problem: Rigid models often struggle in complex environments (VUCA). You might optimize yourself into a dead end.",
        approach: "The Approach: Improvement Process (ISO 15288). We establish feedback loops that encourage the system to adapt. Evolution instead of hard Re-organization.",
        advantage: "The Advantage: Antifragility. The system shouldn't break under stress; it could actually learn from it. Errors become data points."
      },
      cta: "Ready for the next stage of evolution?"
    },
    management: {
      topTitle: "CONTINUOUS IMPROVEMENT",
      subTitle: "Adaptive Systems & Knowledge Management",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Avoiding Stagnation in Local Optima.",
        reality: "Status Quo: Organizations tend towards static equilibria. Processes are 'set in stone', paralyzing adaptability during market disruptions.",
        fix: "The Solution: Implementation of the DIKW Hierarchy (Data-Information-Knowledge-Wisdom). Transforming raw data capture into predictive wisdom.",
        effect: "Impact: Transition to a 'Learning Organization'. Decisions are based on dynamic evidence, not outdated dogmas."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "System Improvement Process.",
        challenge: "Adaptation Deficit: The half-life of process knowledge is dropping dramatically. Rigid frameworks become technical debt.",
        approach: "Methodology: Double-Loop Learning. We don't just question actions (Are we doing things right?), but premises (Are we doing the right things?).",
        advantage: "Advantage: A 'Complex Adaptive System' that reconfigures itself. Maximum resilience through continuous self-optimization."
      },
      cta: "Transform your PMO into an adaptive system."
    }
  },
  es: {
    colloquial: {
      topTitle: "APRENDIZAJE Y EVOLUCIÓN",
      subTitle: "Nada dura para siempre.",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Lo que funciona hoy podría estar obsoleto mañana.",
        reality: "La Realidad: Muchas empresas desean estabilidad y procesos 'terminados'. Pero el mercado no suele colaborar. Esperar demasiado podría significar perder el tren.",
        fix: "La Solución: Valentía para adaptarse. Es mejor ver el estado actual como una 'versión Beta'. Si aparecen datos nuevos, el plan debería cambiar, idealmente antes de que duela.",
        effect: "El Efecto: Intentamos filtrar conocimiento real de los datos. Construimos menos una fortaleza estática y más un sistema que crece con vosotros."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Sistemas Complejos Adaptativos (CAS).",
        challenge: "El Problema: Los modelos rígidos suelen fallar en entornos complejos (VUCA). Podrías optimizarte hasta un callejón sin salida.",
        approach: "El Enfoque: Proceso de Mejora (ISO 15288). Establecemos bucles que animan al sistema a adaptarse. Evolución en lugar de reorganización dura.",
        advantage: "La Ventaja: Antifragilidad. El sistema no debería romperse bajo estrés; podría incluso aprender. Los errores se convierten en datos."
      },
      cta: "¿Listos para la siguiente etapa evolutiva?"
    },
    management: {
      topTitle: "MEJORA CONTINUA",
      subTitle: "Sistemas Adaptativos y Gestión del Conocimiento",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Evitando el estancamiento en óptimos locales.",
        reality: "Status Quo: Las organizaciones tienden a equilibrios estáticos. Los procesos 'tallados en piedra' paralizan la adaptabilidad.",
        fix: "La Solución: Implementación de la Jerarquía DIKW. Transformación de captura de datos en sabiduría predictiva.",
        effect: "Impacto: Transición a una 'Organización de Aprendizaje'. Decisiones basadas en evidencia dinámica."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Proceso de Mejora del Sistema.",
        challenge: "Déficit de Adaptación: La vida media del conocimiento de procesos cae drásticamente. Los marcos rígidos se vuelven deuda técnica.",
        approach: "Metodología: Aprendizaje de Doble Bucle. No solo cuestionamos las acciones, sino las premisas fundamentales.",
        advantage: "Ventaja: Un 'Sistema Complejo Adaptativo' que se reconfigura a sí mismo. Máxima resiliencia."
      },
      cta: "Transforme su PMO en un sistema adaptativo."
    }
  }
} as const;

type LangKey = keyof typeof CONTENT_MATRIX;
type ModeKey = "colloquial" | "management";

function Phase5DocContent() {
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
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">EXECUTIVE BRIEFING | PHASE 05</span>
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

export default function Phase5DocPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <Phase5DocContent />
    </Suspense>
  );
}
