'use client';

import { useState, useEffect } from 'react';
import { Settings, RotateCcw, X } from 'lucide-react';
import { DEFAULT_CATEGORY_WEIGHTS, type MetricCategory } from '../utils/scoreCalculation';

// Types
type Language = 'de' | 'en' | 'es';

interface CategoryWeightsSettingsProps {
  language: Language;
  onWeightsChange?: (weights: Record<MetricCategory, number>) => void;
}

// Translations
const CATEGORY_NAMES = {
  input: { de: 'Input', en: 'Input', es: 'Entrada' },
  process: { de: 'Prozess', en: 'Process', es: 'Proceso' },
  output: { de: 'Output', en: 'Output', es: 'Salida' },
  outcome: { de: 'Outcome', en: 'Outcome', es: 'Resultado' },
  feedback: { de: 'Feedback', en: 'Feedback', es: 'Retroalimentación' },
};

const CATEGORY_DESCRIPTIONS = {
  input: {
    de: 'Ressourcen & Budget',
    en: 'Resources & Budget',
    es: 'Recursos y Presupuesto'
  },
  process: {
    de: 'Aktivitäten & Prozesse',
    en: 'Activities & Processes',
    es: 'Actividades y Procesos'
  },
  output: {
    de: 'Deliverables & Ergebnisse',
    en: 'Deliverables & Outputs',
    es: 'Entregables y Resultados'
  },
  outcome: {
    de: 'Business Value & Impact',
    en: 'Business Value & Impact',
    es: 'Valor de Negocio e Impacto'
  },
  feedback: {
    de: 'Stakeholder Feedback',
    en: 'Stakeholder Feedback',
    es: 'Retroalimentación de Partes Interesadas'
  },
};

export default function CategoryWeightsSettings({ language, onWeightsChange }: CategoryWeightsSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [weights, setWeights] = useState<Record<MetricCategory, number>>(DEFAULT_CATEGORY_WEIGHTS);
  const [isDirty, setIsDirty] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('category_weights');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setWeights(parsed);
        } catch (e) {
          console.error('Failed to parse category weights:', e);
        }
      }
    }
  }, []);

  // Calculate total percentage
  const totalPercentage = Object.values(weights).reduce((sum, w) => sum + w, 0) * 100;
  const isValid = Math.abs(totalPercentage - 100) < 0.01; // Allow tiny floating point errors

  // Handle weight change
  const handleWeightChange = (category: MetricCategory, value: number) => {
    const newWeights = { ...weights, [category]: value / 100 };
    setWeights(newWeights);
    setIsDirty(true);
  };

  // Save to LocalStorage
  const handleSave = () => {
    if (!isValid) return;
    
    localStorage.setItem('category_weights', JSON.stringify(weights));
    setIsDirty(false);
    
    // Notify parent
    if (onWeightsChange) {
      onWeightsChange(weights);
    }

    // Show success toast (optional)
    const message = language === 'de' ? '✅ Gewichtungen gespeichert!' :
                   language === 'es' ? '✅ Ponderaciones guardadas!' :
                   '✅ Weights saved!';
    
    // Simple alert for now (can be replaced with toast)
    alert(message);
    setIsOpen(false);
  };

  // Reset to defaults
  const handleReset = () => {
    setWeights(DEFAULT_CATEGORY_WEIGHTS);
    setIsDirty(true);
  };

  const getText = (key: 'title' | 'total' | 'warning' | 'save' | 'reset' | 'close') => {
    const texts = {
      de: {
        title: 'Kategorie-Gewichtungen',
        total: 'Gesamt',
        warning: 'Summe muss 100% ergeben!',
        save: 'Speichern',
        reset: 'Zurücksetzen',
        close: 'Schließen'
      },
      es: {
        title: 'Ponderaciones de Categoría',
        total: 'Total',
        warning: '¡La suma debe ser 100%!',
        save: 'Guardar',
        reset: 'Restablecer',
        close: 'Cerrar'
      },
      en: {
        title: 'Category Weights',
        total: 'Total',
        warning: 'Sum must equal 100%!',
        save: 'Save',
        reset: 'Reset',
        close: 'Close'
      }
    };
    return texts[language][key];
  };

  return (
    <>
      {/* SETTINGS BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm"
        title={getText('title')}
      >
        <Settings size={16} />
        <span className="hidden sm:inline">{getText('title')}</span>
      </button>

      {/* MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Settings size={20} />
                {getText('title')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* WEIGHT SLIDERS */}
              <div className="space-y-4">
                {(Object.keys(weights) as MetricCategory[]).map((category) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {CATEGORY_NAMES[category][language]}
                        </div>
                        <div className="text-xs text-slate-400">
                          {CATEGORY_DESCRIPTIONS[category][language]}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-400 min-w-[60px] text-right">
                        {Math.round(weights[category] * 100)}%
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round(weights[category] * 100)}
                      onChange={(e) => handleWeightChange(category, parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${weights[category] * 100}%, #334155 ${weights[category] * 100}%, #334155 100%)`
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* TOTAL & VALIDATION */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-300">
                    {getText('total')}:
                  </span>
                  <span className={`text-2xl font-bold ${
                    isValid ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {totalPercentage.toFixed(0)}%
                  </span>
                </div>
                {!isValid && (
                  <div className="mt-2 text-xs text-red-400 text-center">
                    ⚠️ {getText('warning')}
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-slate-700">
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
              >
                <RotateCcw size={16} />
                {getText('reset')}
              </button>
              <div className="flex-1" />
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
              >
                {getText('close')}
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || !isDirty}
                className={`px-6 py-2 rounded-lg transition text-sm font-semibold ${
                  isValid && isDirty
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {getText('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

