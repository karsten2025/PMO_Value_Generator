'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Import aller 10 Prozess-Metriken (SHOWCASE VERSION: 15 Metriken pro Prozess)
import process1Data from './process_1_metrics_showcase.json';
import process2Data from './process_2_metrics_showcase.json';
import process3Data from './process_3_metrics_showcase.json';
import process4Data from './process_4_metrics_showcase.json';
import process5Data from './process_5_metrics_showcase.json';
import process6Data from './process_6_metrics_showcase.json';
import process7Data from './process_7_metrics_showcase.json';
import process8Data from './process_8_metrics_showcase.json';
import process9Data from './process_9_metrics_showcase.json';
import process10Data from './process_10_metrics_showcase.json';

// Mapping für dynamischen Prozess-Wechsel
const PROCESS_DATA_MAP = {
  1: process1Data,
  2: process2Data,
  3: process3Data,
  4: process4Data,
  5: process5Data,
  6: process6Data,
  7: process7Data,
  8: process8Data,
  9: process9Data,
  10: process10Data,
};

type MetricCategory = 'input' | 'process' | 'output' | 'outcome' | 'feedback';
type Mode = 'colloquial' | 'management';
type Language = 'de' | 'en' | 'es';

interface Metric {
  name_en: string;
  name_de: string;
  name_es: string;
  unit: string;
  metric_type: string;
  description: {
    de: { colloquial: string; management: string };
    en: { colloquial: string; management: string };
    es: { colloquial: string; management: string };
  };
  calculation_method: string;
  recommended_for: string[];
}

const CATEGORY_INFO = {
  input: {
    icon: '📥',
    title: { de: 'INPUT-Metriken', en: 'INPUT Metrics', es: 'Métricas de ENTRADA' },
    description: {
      de: {
        colloquial: 'Ressourcen, die wir in den Prozess stecken (Budget, Zeit, Personen)',
        management: 'Ressourcenallokation und Input-Faktoren für strategische Prozesssteuerung'
      },
      en: {
        colloquial: 'Resources we put into the process (budget, time, people)',
        management: 'Resource allocation and input factors for strategic process control'
      },
      es: {
        colloquial: 'Recursos que ponemos en el proceso (presupuesto, tiempo, personas)',
        management: 'Asignación de recursos y factores de entrada para control estratégico de procesos'
      }
    },
    color: 'from-blue-500 to-cyan-500'
  },
  process: {
    icon: '⚙️',
    title: { de: 'PROCESS-Activities', en: 'PROCESS Activities', es: 'Actividades de PROCESO' },
    description: {
      de: {
        colloquial: 'Aktivitäten und Aufgaben, die wir durchführen (Workshops, Meetings)',
        management: 'Prozessuale Aktivitäten zur systematischen Wertschöpfung und Governance'
      },
      en: {
        colloquial: 'Activities and tasks we perform (workshops, meetings)',
        management: 'Process activities for systematic value creation and governance'
      },
      es: {
        colloquial: 'Actividades y tareas que realizamos (talleres, reuniones)',
        management: 'Actividades procesales para creación de valor sistemática y gobernanza'
      }
    },
    color: 'from-purple-500 to-pink-500'
  },
  output: {
    icon: '📤',
    title: { de: 'OUTPUT-Metriken', en: 'OUTPUT Metrics', es: 'Métricas de SALIDA' },
    description: {
      de: {
        colloquial: 'Direkte Ergebnisse, die rauskommen (Dokumente, geschulte Personen)',
        management: 'Quantifizierbare Deliverables und Output-Indikatoren für Performance-Messung'
      },
      en: {
        colloquial: 'Direct results that come out (documents, trained people)',
        management: 'Quantifiable deliverables and output indicators for performance measurement'
      },
      es: {
        colloquial: 'Resultados directos que salen (documentos, personas capacitadas)',
        management: 'Entregables cuantificables e indicadores de salida para medición de rendimiento'
      }
    },
    color: 'from-green-500 to-emerald-500'
  },
  outcome: {
    icon: '🎯',
    title: { de: 'OUTCOME-Metriken', en: 'OUTCOME Metrics', es: 'Métricas de RESULTADO' },
    description: {
      de: {
        colloquial: 'Mittelfristige Wirkungen und Veränderungen (besseres Wissen, höhere Akzeptanz)',
        management: 'Strategische Outcome-Realisierung und nachhaltige Wirkungsmessung'
      },
      en: {
        colloquial: 'Medium-term effects and changes (better knowledge, higher acceptance)',
        management: 'Strategic outcome realization and sustainable impact measurement'
      },
      es: {
        colloquial: 'Efectos a mediano plazo y cambios (mejor conocimiento, mayor aceptación)',
        management: 'Realización estratégica de resultados y medición de impacto sostenible'
      }
    },
    color: 'from-orange-500 to-amber-500'
  },
  feedback: {
    icon: '🔄',
    title: { de: 'FEEDBACK-Metriken', en: 'FEEDBACK Metrics', es: 'Métricas de RETROALIMENTACIÓN' },
    description: {
      de: {
        colloquial: 'Mechanismen, um zu messen wie zufrieden die Leute sind und welchen Wert sie sehen',
        management: 'Systematische Feedback-Mechanismen zur kontinuierlichen Value-Validierung'
      },
      en: {
        colloquial: 'Mechanisms to measure how satisfied people are and what value they see',
        management: 'Systematic feedback mechanisms for continuous value validation'
      },
      es: {
        colloquial: 'Mecanismos para medir qué tan satisfechas están las personas y qué valor ven',
        management: 'Mecanismos sistemáticos de retroalimentación para validación continua de valor'
      }
    },
    color: 'from-rose-500 to-red-500'
  }
};

const MODE_LABELS = {
  colloquial: {
    de: 'Team-Sprache',
    en: 'Team Language',
    es: 'Lenguaje de Equipo'
  },
  management: {
    de: 'Management-Sprache',
    en: 'Management Language',
    es: 'Lenguaje de Gerencia'
  }
};

const CALCULATION_METHOD_LABEL = {
  de: { colloquial: 'Wie wird das gemessen?', management: 'Berechnungsmethodik' },
  en: { colloquial: 'How is this measured?', management: 'Calculation Method' },
  es: { colloquial: '¿Cómo se mide esto?', management: 'Método de Cálculo' }
};

const TAG_TRANSLATIONS = {
  large_pmo: {
    de: { colloquial: 'Großes PMO', management: 'Enterprise PMO' },
    en: { colloquial: 'Large PMO', management: 'Enterprise PMO' },
    es: { colloquial: 'PMO Grande', management: 'PMO Empresarial' }
  },
  startup_pmo: {
    de: { colloquial: 'Startup PMO', management: 'Agile Start-up PMO' },
    en: { colloquial: 'Startup PMO', management: 'Agile Start-up PMO' },
    es: { colloquial: 'PMO Startup', management: 'PMO Ágil de Inicio' }
  },
  regulated_industry: {
    de: { colloquial: 'Regulierte Branche', management: 'Compliance-kritische Organisation' },
    en: { colloquial: 'Regulated Industry', management: 'Compliance-Critical Organization' },
    es: { colloquial: 'Industria Regulada', management: 'Organización Crítica de Cumplimiento' }
  },
  agile_org: {
    de: { colloquial: 'Agile Organisation', management: 'Agile Transformation Environment' },
    en: { colloquial: 'Agile Organization', management: 'Agile Transformation Environment' },
    es: { colloquial: 'Organización Ágil', management: 'Entorno de Transformación Ágil' }
  },
  transformation_pmo: {
    de: { colloquial: 'Transformation PMO', management: 'Strategic Change Management PMO' },
    en: { colloquial: 'Transformation PMO', management: 'Strategic Change Management PMO' },
    es: { colloquial: 'PMO de Transformación', management: 'PMO de Gestión de Cambio Estratégico' }
  }
};

export default function MetricsPreviewPage() {
  // URL-Parameter auslesen
  const searchParams = useSearchParams();
  const processParam = searchParams.get('process');
  
  // Eigener lokaler State - unabhängig vom Context
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<Mode>('colloquial');
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('input');
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [selectedProcess, setSelectedProcess] = useState<number>(() => {
    // Initialisiere mit URL-Parameter, falls vorhanden
    if (processParam) {
      const num = parseInt(processParam);
      if (num >= 1 && num <= 10) return num;
    }
    return 1; // Default: Prozess 1
  });

  // Dynamisch die richtigen Daten für den gewählten Prozess laden
  const metricsData = PROCESS_DATA_MAP[selectedProcess as keyof typeof PROCESS_DATA_MAP];
  const metrics = metricsData.metrics[selectedCategory] as Metric[];

  const getMetricName = (metric: Metric) => {
    let name;
    switch (language) {
      case 'de': name = metric.name_de; break;
      case 'es': name = metric.name_es; break;
      default: name = metric.name_en; break;
    }
    console.log('📝 getMetricName:', language, '→', name);
    return name;
  };

  const getDescription = (metric: Metric) => {
    const lang = language as 'de' | 'en' | 'es';
    // Fallback zu 'en' wenn Sprache nicht existiert
    const desc = metric.description[lang] || metric.description['en'];
    return desc?.[mode] || 'Description not available';
  };

  const translateTag = (tag: string) => {
    const lang = language as 'de' | 'en' | 'es';
    const translation = TAG_TRANSLATIONS[tag as keyof typeof TAG_TRANSLATIONS];
    if (translation) {
      // Defensive: Fallback zu 'en' wenn Sprache nicht existiert
      const langTranslation = translation[lang] || translation['en'];
      if (langTranslation) {
        return langTranslation[mode] || langTranslation.colloquial;
      }
    }
    // Fallback: Tag lesbar machen
    return tag.replace(/_/g, ' ');
  };

  const getCategoryDescription = () => {
    const lang = language as 'de' | 'en' | 'es';
    const categoryDesc = CATEGORY_INFO[selectedCategory].description;
    
    // Defensive Programmierung: Fallback zu 'en' wenn Sprache nicht existiert
    const langDesc = categoryDesc[lang] || categoryDesc['en'];
    
    // Fallback zu 'colloquial' wenn Mode nicht existiert
    return langDesc?.[mode] || langDesc?.colloquial || 'Description not available';
  };

  const toggleMetricSelection = (metricName: string) => {
    const newSelected = new Set(selectedMetrics);
    if (newSelected.has(metricName)) {
      newSelected.delete(metricName);
    } else {
      newSelected.add(metricName);
    }
    setSelectedMetrics(newSelected);
  };

  const selectedCount = selectedMetrics.size;

  const getProcessTitle = () => {
    const meta = metricsData.meta.process;
    switch (language) {
      case 'de': return `Prozess ${selectedProcess}: ${meta.title_de}`;
      case 'es': return `Proceso ${selectedProcess}: ${meta.title_es}`;
      default: return `Process ${selectedProcess}: ${meta.title_en}`;
    }
  };

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col">
      {/* Header - EXAKT wie Hauptseite */}
      <header className="p-4 flex justify-between items-center bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-blue-400">🔍 Metric Pool Preview</h1>
          
          {/* Process Selector - NEU */}
          <div className="relative">
            <select
              value={selectedProcess}
              onChange={(e) => {
                setSelectedProcess(Number(e.target.value));
                setSelectedMetrics(new Set()); // Reset selection bei Prozess-Wechsel
              }}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 hover:border-blue-500 transition cursor-pointer appearance-none pr-10 font-medium"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const data = PROCESS_DATA_MAP[num as keyof typeof PROCESS_DATA_MAP];
                const title = language === 'de' ? data.meta.process.title_de :
                             language === 'es' ? data.meta.process.title_es :
                             data.meta.process.title_en;
                return (
                  <option key={num} value={num}>
                    {language === 'de' ? 'Prozess' : language === 'es' ? 'Proceso' : 'Process'} {num}: {title}
                  </option>
                );
              })}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
              ▼
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <span className="text-blue-400">
              {selectedCount} / 15 {language === 'de' ? 'ausgewählt' : language === 'es' ? 'seleccionado' : 'selected'}
            </span>
            <span className="mx-2">•</span>
            <span className="text-slate-500">
              {language === 'de' ? '(5 Kategorien × 3 Metriken)' : 
               language === 'es' ? '(5 Categorías × 3 Métricas)' :
               '(5 Categories × 3 Metrics)'}
            </span>
          </div>
        </div>

        {/* Controls - EXAKT wie Hauptseite */}
        <div className="flex items-center gap-4">
          {/* Language */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            {(['de', 'en', 'es'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  console.log('✅ Sprache wechseln zu:', l, 'Aktuell:', language);
                  setLanguage(l);
                }}
                className={`px-3 py-1 rounded-md transition ${language === l ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Mode */}
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setMode('colloquial')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${mode === 'colloquial' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
            >
              👥 Normal
            </button>
            <button
              onClick={() => setMode('management')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${mode === 'management' ? 'bg-blue-600' : 'hover:bg-slate-600'}`}
            >
              💼 Management
            </button>
          </div>
        </div>
      </header>

      {/* Category Tabs */}
      <div className="border-b border-slate-700 bg-slate-800 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {Object.entries(CATEGORY_INFO).map(([key, info]) => {
            const isActive = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as MetricCategory)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{info.icon}</span>
                  <div className="text-left">
                    <div>{info.title[language]}</div>
                    <div className="text-xs opacity-75 font-normal">
                      {metricsData.metrics[key as MetricCategory].length} {language === 'de' ? 'Metriken' : language === 'es' ? 'Métricas' : 'Metrics'}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Description - 2x3 Matrix */}
      <div className="bg-slate-800/70 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-blue-400 uppercase">
            {mode === 'colloquial' ? '👥' : '💼'} {(MODE_LABELS[mode] || MODE_LABELS['colloquial'])[language as 'de' | 'en' | 'es']}
          </span>
        </div>
        <p className="text-sm text-slate-300">
          {getCategoryDescription()}
        </p>
      </div>

      {/* Metrics Grid */}
      <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
          {metrics.map((metric, index) => {
            const metricKey = `${selectedCategory}-${index}`;
            const isSelected = selectedMetrics.has(metricKey);
            
            return (
              <div
                key={index}
                className={`bg-slate-800 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                    : 'border-slate-700 hover:border-slate-600'
                } p-4 cursor-pointer`}
                onClick={() => toggleMetricSelection(metricKey)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Checkbox */}
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'border-slate-500 hover:border-blue-400'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-2xl">{CATEGORY_INFO[selectedCategory].icon}</span>
                      <h3 className="text-lg font-bold text-white">
                        {getMetricName(metric)}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 ml-9">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white">
                        {metric.unit}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                        {metric.metric_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-600">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>

                {/* Description - 2x3 Matrix aktiv */}
                <div className="mb-4 ml-9">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-400 uppercase">
                      {mode === 'colloquial' ? '👥' : '💼'} {(MODE_LABELS[mode] || MODE_LABELS['colloquial'])[language as 'de' | 'en' | 'es']}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {getDescription(metric)}
                  </p>
                </div>

                {/* Calculation Method - 2x3 Matrix Label */}
                <div className="mb-4 p-3 rounded-lg bg-slate-900 border border-slate-700 ml-9">
                  <div className="text-xs font-medium text-slate-400 uppercase mb-1">
                    📊 {(CALCULATION_METHOD_LABEL[language as 'de' | 'en' | 'es'] || CALCULATION_METHOD_LABEL['en'])[mode]}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    {metric.calculation_method}
                  </p>
                </div>

                {/* Tags - 2x3 Matrix translated */}
                <div className="flex flex-wrap gap-2 ml-9">
                  {metric.recommended_for.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-slate-700 text-slate-400 border border-slate-600"
                    >
                      {translateTag(tag)}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
