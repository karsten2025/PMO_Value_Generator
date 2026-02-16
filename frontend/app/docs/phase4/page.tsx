"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Printer, ArrowLeft, AlertTriangle, Target, Zap } from "lucide-react";

const CONTENT_MATRIX = {
  de: {
    colloquial: {
      topTitle: "EXECUTION & OPTIMIERUNG",
      subTitle: "PS auf die Straße bringen.",
      leftCol: {
        title: "DIE HERAUSFORDERUNG",
        headline: "Ein ungenutztes Tool ist kein Asset, sondern ein Abo auf Geldverbrennung.",
        reality: "Die Realität: Nach dem Go-Live fällt die Euphorie. Teams fallen in alte Muster zurück. Excel-Listen werden wieder heimlich per Mail verschickt ('Schatten-Buchhaltung').",
        fix: "Der Fix: Wir machen 'Compliance' zum einfachsten Weg. Wenn das System nervt, ist das System schuld, nicht der User. Wir optimieren die UX, bis der Widerstand bricht.",
        effect: "Der Value Generator Effekt: Daten fließen automatisch. Reports müssen nicht 'gebaut' werden, sie sind einfach da. Die Wahrheit in Echtzeit."
      },
      rightCol: {
        title: "DER ENGINEERING ANSATZ",
        headline: "Adoption by Design.",
        challenge: "Das Problem: Prozess-Disziplin lässt sich nicht herbeibeten. Manuelle Dateneingabe ist der Feind der Datenqualität.",
        approach: "Der Ansatz: Closed-Loop Systems gemäß ISO 15288. Wir implementieren Feedback-Schleifen. Jede Abweichung triggert eine Korrektur, kein Meeting.",
        advantage: "Der Vorteil: Ein selbst-korrigierendes System. Wir messen den 'Process Health Index' live, statt am Jahresende überrascht zu sein."
      },
      cta: "Bereit für echte Ergebnisse? Starten wir."
    },
    management: {
      topTitle: "VALUE REALIZATION",
      subTitle: "Operational Excellence & Governance Scaling",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Negativer ROI durch Diskrepanz zwischen Lizenzkosten und Adoptionsrate.",
        reality: "Status Quo: Mangelnde User-Akzeptanz führt zu Datenlücken. Der ROI der Implementierung wird durch inkonsequente Nutzung gefährdet ('Shelfware-Risiko').",
        fix: "Die Lösung: KPI-gesteuertes Change Management. Wir überwachen Nutzungsmetriken und Datenqualität quantitativ.",
        effect: "Impact: Maximierung des Business Value. Sicherstellung der 'Single Source of Truth' durch technische Durchsetzung der Governance."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Measurement & Analysis Process (ISO 15288).",
        challenge: "Control Deficit: Ohne valide Telemetrie ist eine Steuerung des Portfolios unmöglich. 'You can't manage what you don't measure.'",
        approach: "Methodik: Implementierung von Leading Indicators und automatisierten Quality Gates. Übergang von 'Reporting' zu 'Monitoring'.",
        advantage: "Vorteil: Prädiktive Steuerung statt reaktives Krisenmanagement. Validierte Datenbasis für C-Level Entscheidungen."
      },
      cta: "Sichern Sie den Betriebserfolg. Kontaktieren Sie uns."
    }
  },
  en: {
    colloquial: {
      topTitle: "EXECUTION & OPTIMIZATION",
      subTitle: "Putting horsepower on the road.",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "An unused tool isn't an asset; it's a subscription to burning cash.",
        reality: "The Reality: Post-launch excitement fades. Teams slide back into old habits. Secret Excel sheets start circulating again via email ('Shadow Accounting').",
        fix: "The Fix: We make compliance the path of least resistance. If the system is annoying, the system is wrong, not the user. We optimize UX until resistance crumbles.",
        effect: "The Value Generator Effect: Data flows automatically. Reports aren't 'built', they simply exist. Truth in real-time."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Adoption by Design.",
        challenge: "The Problem: You can't pray for process discipline. Manual data entry is the enemy of data quality.",
        approach: "The Approach: Closed-Loop Systems per ISO 15288. We implement feedback loops. Deviations trigger corrections, not meetings.",
        advantage: "The Advantage: A self-correcting system. We measure the 'Process Health Index' live, instead of being surprised at year-end."
      },
      cta: "Ready for real results? Let's start."
    },
    management: {
      topTitle: "VALUE REALIZATION",
      subTitle: "Operational Excellence & Governance Scaling",
      leftCol: {
        title: "THE CHALLENGE",
        headline: "Negative ROI due to discrepancy between licensing costs and adoption rate.",
        reality: "Status Quo: Lack of user acceptance leads to data gaps. The implementation ROI is threatened by inconsistent usage ('Shelfware Risk').",
        fix: "The Solution: KPI-driven Change Management. We quantitatively monitor usage metrics and data quality.",
        effect: "Impact: Maximization of Business Value. Ensuring a 'Single Source of Truth' through technical enforcement of governance."
      },
      rightCol: {
        title: "THE ENGINEERING APPROACH",
        headline: "Measurement & Analysis Process (ISO 15288).",
        challenge: "Control Deficit: Without valid telemetry, portfolio steering is impossible. 'You can't manage what you don't measure.'",
        approach: "Methodology: Implementation of leading indicators and automated Quality Gates. Transition from 'Reporting' to 'Monitoring'.",
        advantage: "Advantage: Predictive control instead of reactive crisis management. Validated data basis for C-Level decisions."
      },
      cta: "Secure operational success. Let's discuss."
    }
  },
  es: {
    colloquial: {
      topTitle: "EJECUCIÓN Y OPTIMIZACIÓN",
      subTitle: "Poner la potencia en la carretera.",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "Una herramienta sin uso no es un activo, es una suscripción a quemar dinero.",
        reality: "La Realidad: La euforia del lanzamiento se desvanece. Los equipos vuelven a viejos hábitos. Las hojas de Excel secretas circulan de nuevo ('Contabilidad en la sombra').",
        fix: "La Solución: Hacemos que el cumplimiento sea el camino más fácil. Si el sistema molesta, el sistema está mal, no el usuario. Optimizamos hasta romper la resistencia.",
        effect: "El Efecto: Los datos fluyen automáticamente. Los informes no se 'construyen', simplemente existen. La verdad en tiempo real."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Adopción por Diseño.",
        challenge: "El Problema: La disciplina de procesos no se pide por favor. La entrada manual de datos es el enemigo de la calidad.",
        approach: "El Enfoque: Sistemas de Bucle Cerrado según ISO 15288. Implementamos retroalimentación. Las desviaciones activan correcciones, no reuniones.",
        advantage: "La Ventaja: Un sistema que se autocorrige. Medimos el 'Índice de Salud del Proceso' en vivo, en lugar de sorprendernos a fin de año."
      },
      cta: "¿Listos para resultados reales? Empecemos."
    },
    management: {
      topTitle: "REALIZACIÓN DE VALOR",
      subTitle: "Excelencia Operativa y Escalado de Gobernanza",
      leftCol: {
        title: "EL DESAFÍO",
        headline: "ROI negativo debido a la discrepancia entre costes de licencia y tasa de adopción.",
        reality: "Status Quo: La falta de aceptación del usuario crea lagunas de datos. El ROI se ve amenazado por el uso inconsistente.",
        fix: "La Solución: Gestión del cambio basada en KPIs. Monitoreamos cuantitativamente las métricas de uso y la calidad de los datos.",
        effect: "Impacto: Maximización del valor empresarial. Aseguramiento de la 'Fuente Única de Verdad' mediante gobernanza técnica."
      },
      rightCol: {
        title: "ENFOQUE DE INGENIERÍA",
        headline: "Proceso de Medición y Análisis (ISO 15288).",
        challenge: "Déficit de Control: Sin telemetría válida, dirigir el portafolio es imposible. 'No puedes gestionar lo que no mides'.",
        approach: "Metodología: Implementación de indicadores adelantados y Quality Gates automatizados. Transición de 'Reporting' a 'Monitoreo'.",
        advantage: "Ventaja: Control predictivo en lugar de gestión de crisis reactiva. Base de datos validada para decisiones de C-Level."
      },
      cta: "Asegure el éxito operativo. Hablemos."
    }
  }
} as const;

type LangKey = keyof typeof CONTENT_MATRIX;
type ModeKey = "colloquial" | "management";

function Phase4DocContent() {
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
            <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">EXECUTIVE BRIEFING | PHASE 04</span>
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

export default function Phase4DocPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-slate-400">Loading...</div></div>}>
      <Phase4DocContent />
    </Suspense>
  );
}
