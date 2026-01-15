'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MobileMenu from '../../components/MobileMenu';

// Import Metric Data
import process1Data from '../../preview-metrics/process_1_metrics_showcase.json';
import process2Data from '../../preview-metrics/process_2_metrics_showcase.json';
import process3Data from '../../preview-metrics/process_3_metrics_showcase.json';
import process4Data from '../../preview-metrics/process_4_metrics_showcase.json';
import process5Data from '../../preview-metrics/process_5_metrics_showcase.json';
import process6Data from '../../preview-metrics/process_6_metrics_showcase.json';
import process7Data from '../../preview-metrics/process_7_metrics_showcase.json';
import process8Data from '../../preview-metrics/process_8_metrics_showcase.json';
import process9Data from '../../preview-metrics/process_9_metrics_showcase.json';
import process10Data from '../../preview-metrics/process_10_metrics_showcase.json';

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

type Language = 'de' | 'en' | 'es';
type Mode = 'colloquial' | 'management';
type MetricCategory = 'input' | 'process' | 'output' | 'outcome' | 'feedback';

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

interface MetricValue {
  metricKey: string;
  targetValue: string;
  currentValue: string;
}

// Inner component that uses useSearchParams
function ProcessInstanceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const processParam = searchParams.get('process');
  const [selectedProcess, setSelectedProcess] = useState<number>(
    processParam ? parseInt(processParam) : 1
  );
  
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<Mode>('colloquial');

  // Hole gespeicherte Metrik-Auswahl aus LocalStorage
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  
  // State für Werte-Eingabe
  const [metricValues, setMetricValues] = useState<Record<string, MetricValue>>({});
  
  // State für Entry-Level Date & Note (gilt für ALLE Metriken)
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryNote, setEntryNote] = useState('');
  
  // State für Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string }>({
    title: '',
    subtitle: ''
  });
  
  // State für Historie
  const [savedEntries, setSavedEntries] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  
  // Get process data dynamically
  const metricsData = PROCESS_DATA_MAP[selectedProcess as keyof typeof PROCESS_DATA_MAP];

  useEffect(() => {
    // Load metric selection
    const saved = localStorage.getItem(`metric_selection_p${selectedProcess}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedMetrics(data.metrics || []);
        
        // Initialize metricValues for each selected metric
        const initialValues: Record<string, MetricValue> = {};
        (data.metrics || []).forEach((metricKey: string) => {
          initialValues[metricKey] = {
            metricKey,
            targetValue: '',
            currentValue: ''
          };
        });
        setMetricValues(initialValues);
      } catch (e) {
        console.error('Failed to load metric selection:', e);
      }
    }
    
    // Load saved entries (history)
    const entriesKey = `metric_values_p${selectedProcess}`;
    const savedEntries = localStorage.getItem(entriesKey);
    if (savedEntries) {
      try {
        const entries = JSON.parse(savedEntries);
        setSavedEntries(entries);
      } catch (e) {
        console.error('Failed to load saved entries:', e);
      }
    }
  }, [selectedProcess]);
  
  // Helper: Get metric details from metricKey (e.g. "input-0")
  const getMetricDetails = (metricKey: string): Metric | null => {
    const [category, indexStr] = metricKey.split('-');
    const index = parseInt(indexStr);
    const categoryMetrics = metricsData.metrics[category as MetricCategory];
    if (categoryMetrics && categoryMetrics[index]) {
      return categoryMetrics[index] as Metric;
    }
    return null;
  };
  
  // Helper: Extract category from metric key
  const getCategoryFromKey = (metricKey: string): MetricCategory => {
    const [category] = metricKey.split('-');
    return category as MetricCategory;
  };

  // Helper: Sort metrics by category order (Input → Process → Output → Outcome → Feedback)
  const sortMetricsByCategory = (metricKeys: string[]): string[] => {
    const categoryOrder: MetricCategory[] = ['input', 'process', 'output', 'outcome', 'feedback'];
    
    return [...metricKeys].sort((a, b) => {
      const catA = getCategoryFromKey(a);
      const catB = getCategoryFromKey(b);
      return categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
    });
  };

  // Helper: Get category icon
  const getCategoryIcon = (category: MetricCategory): string => {
    const icons = {
      input: '🎯',
      process: '⚡',
      output: '📦',
      outcome: '🏆',
      feedback: '💬'
    };
    return icons[category];
  };

  // Helper: Get category name in current language
  const getCategoryName = (category: MetricCategory): string => {
    const names = {
      de: {
        input: 'INPUT',
        process: 'PROZESS',
        output: 'OUTPUT',
        outcome: 'OUTCOME',
        feedback: 'FEEDBACK'
      },
      es: {
        input: 'ENTRADA',
        process: 'PROCESO',
        output: 'SALIDA',
        outcome: 'RESULTADO',
        feedback: 'RETROALIMENTACIÓN'
      },
      en: {
        input: 'INPUT',
        process: 'PROCESS',
        output: 'OUTPUT',
        outcome: 'OUTCOME',
        feedback: 'FEEDBACK'
      }
    };
    return names[language][category];
  };
  
  // Helper: Get metric name in current language
  const getMetricName = (metric: Metric) => {
    switch (language) {
      case 'de': return metric.name_de;
      case 'es': return metric.name_es;
      default: return metric.name_en;
    }
  };
  
  // Helper: Get metric description in current language/mode
  const getMetricDescription = (metric: Metric) => {
    return metric.description[language][mode];
  };
  
  // Helper: Format date consistently (DD.MM.YYYY for DE, MM/DD/YYYY for EN, DD/MM/YYYY for ES)
  const formatDate = (isoDateString: string) => {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    switch (language) {
      case 'de':
        return `${day}.${month}.${year}`;  // 14.06.2026
      case 'es':
        return `${day}/${month}/${year}`;  // 14/06/2026
      default:
        return `${month}/${day}/${year}`;  // 06/14/2026
    }
  };
  
  // Helper: Format date with month name
  const formatDateLong = (isoDateString: string) => {
    const date = new Date(isoDateString);
    return date.toLocaleDateString(
      language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    );
  };
  
  // Update metric value
  const updateMetricValue = (metricKey: string, field: keyof MetricValue, value: string) => {
    setMetricValues(prev => ({
      ...prev,
      [metricKey]: {
        ...prev[metricKey],
        [field]: value
      }
    }));
  };
  
  // Save metric values to LocalStorage (Time-Series Support)
  // DEVELOPMENT HELPER: Fill Demo Data! 🔥
  const fillDemoData = () => {
    const demoData: Record<string, MetricValue> = {};
    
    // Category-based Score Ranges (für realistische Verteilung)
    // Basierend auf Logic Model Weights:
    // INPUT (10%), PROCESS (15%), OUTPUT (20%), OUTCOME (35%), FEEDBACK (20%)
    const categoryScoreRanges: Record<MetricCategory, { min: number; max: number }> = {
      input:    { min: 0.50, max: 0.75 },  // 50-75%  → Niedrigere Scores (weniger wichtig)
      process:  { min: 0.65, max: 0.90 },  // 65-90%  → Gute Scores
      output:   { min: 0.70, max: 0.92 },  // 70-92%  → Sehr gute Scores
      outcome:  { min: 0.75, max: 0.95 },  // 75-95%  → HÖCHSTE Scores (35% Impact!)
      feedback: { min: 0.60, max: 0.88 },  // 60-88%  → Gute Scores
    };
    
    selectedMetrics.forEach((metricKey) => {
      const category = getCategoryFromKey(metricKey);
      const scoreRange = categoryScoreRanges[category];
      
      // Get metric details to check for special cases
      const metric = getMetricByKey(metricKey);
      const isNPS = metric?.name_en.includes('Net Promoter Score') || false;
      
      let targetValue: number;
      let currentValue: number;
      
      if (isNPS) {
        // NPS: Range -100 to +100
        // Target: 30-70 (good PMO benchmark)
        // Current: 15-60 (realistically below target)
        targetValue = Math.floor(Math.random() * 40) + 30;  // 30-70
        currentValue = Math.floor(Math.random() * 45) + 15; // 15-60
      } else {
        // Ziel-Score für diese Category (mit Varianz)
        const targetScore = scoreRange.min + Math.random() * (scoreRange.max - scoreRange.min);
        
        // Generiere Target Value (10k-60k)
        targetValue = Math.floor(Math.random() * 50000) + 10000;
        
        // Berechne Current Value basierend auf Target Score
        currentValue = Math.floor(targetValue * targetScore);
      }
      
      demoData[metricKey] = {
        metricKey,
        metric_name: metricKey,
        targetValue: targetValue.toString(),
        currentValue: currentValue.toString(),
      };
    });
    
    setMetricValues(demoData);
    
    // Toast zeigen
    setToastMessage({
      title: language === 'de' ? '✅ Demo-Daten eingefügt!' :
            language === 'es' ? '¡Datos de demostración insertados!' :
            '✅ Demo Data Filled!',
      subtitle: language === 'de' ? `${selectedMetrics.length} Metriken mit Logic Model Verteilung` :
                language === 'es' ? `${selectedMetrics.length} métricas con distribución Logic Model` :
                `${selectedMetrics.length} metrics with Logic Model distribution`
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const saveMetricValues = () => {
    // Validate: At least one metric must have values
    const hasValues = Object.values(metricValues).some(
      v => v.targetValue || v.currentValue
    );
    
    if (!hasValues) {
      alert(language === 'de' ? 'Bitte mindestens einen Wert eingeben!' :
            language === 'es' ? '¡Por favor ingrese al menos un valor!' :
            'Please enter at least one value!');
      return;
    }
    
    // Get existing entries from LocalStorage
    const storageKey = `metric_values_p${selectedProcess}`;
    const existing = localStorage.getItem(storageKey);
    let allEntries: any[] = [];
    
    if (existing) {
      try {
        allEntries = JSON.parse(existing);
      } catch (e) {
        console.error('Failed to parse existing entries:', e);
      }
    }
    
    // Create new entry with timestamp
    const newEntry = {
      timestamp: new Date().toISOString(),
      date: entryDate,  // Entry-level date for ALL metrics
      processId: selectedProcess,
      note: entryNote,  // Entry-level note for ALL metrics
      metrics: metricValues
    };
    
    // Add to history
    allEntries.push(newEntry);
    
    // Save back to LocalStorage
    localStorage.setItem(storageKey, JSON.stringify(allEntries));
    
    // Update saved entries state
    setSavedEntries(allEntries);
    
    // Reset form for next entry
    setEntryDate(new Date().toISOString().split('T')[0]);
    setEntryNote('');
    
    // Show toast
    setToastMessage({
      title: language === 'de' ? 'Erfolgreich gespeichert!' :
             language === 'es' ? '¡Guardado exitosamente!' :
             'Successfully saved!',
      subtitle: language === 'de' ? `Werte für Prozess ${selectedProcess} erfasst` :
                language === 'es' ? `Valores capturados para proceso ${selectedProcess}` :
                `Values captured for process ${selectedProcess}`
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  // Check if we can save (at least one value entered)
  const canSave = Object.values(metricValues).some(
    v => v.targetValue || v.currentValue
  );
  
  // Soft-Delete: Mark entry as deleted (AUDIT-TRAIL!)
  const deleteEntry = (indexToDelete: number) => {
    const confirmMsg = language === 'de' 
      ? 'Eintrag als gelöscht markieren? (Kann wiederhergestellt werden - Audit-Trail bleibt erhalten!)'
      : language === 'es'
      ? '¿Marcar entrada como eliminada? (¡Se puede restaurar - el registro de auditoría se mantiene!)'
      : 'Mark entry as deleted? (Can be restored - audit trail preserved!)';
    
    if (!confirm(confirmMsg)) {
      return;
    }
    
    const storageKey = `metric_values_p${selectedProcess}`;
    const updatedEntries = [...savedEntries];
    
    // Soft-delete: Add deletion metadata
    updatedEntries[indexToDelete] = {
      ...updatedEntries[indexToDelete],
      deleted_at: new Date().toISOString(),
      deleted_by: 'current_user', // TODO: Replace with actual user ID in Phase 3
      deleted_reason: 'user_action'
    };
    
    // Save to LocalStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Update state
    setSavedEntries(updatedEntries);
    
    // Show toast
    setToastMessage({
      title: language === 'de' ? 'Eintrag gelöscht!' :
             language === 'es' ? '¡Entrada eliminada!' :
             'Entry deleted!',
      subtitle: language === 'de' ? `Eintrag #${savedEntries.length - indexToDelete} (kann wiederhergestellt werden)` :
                language === 'es' ? `Entrada #${savedEntries.length - indexToDelete} (se puede restaurar)` :
                `Entry #${savedEntries.length - indexToDelete} (can be restored)`
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };
  
  // Restore a deleted entry
  const restoreEntry = (indexToRestore: number) => {
    const storageKey = `metric_values_p${selectedProcess}`;
    const updatedEntries = [...savedEntries];
    
    // Remove deletion metadata
    delete updatedEntries[indexToRestore].deleted_at;
    delete updatedEntries[indexToRestore].deleted_by;
    delete updatedEntries[indexToRestore].deleted_reason;
    
    // Save to LocalStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedEntries));
    
    // Update state
    setSavedEntries(updatedEntries);
    
    // Show toast
    setToastMessage({
      title: language === 'de' ? 'Eintrag wiederhergestellt!' :
             language === 'es' ? '¡Entrada restaurada!' :
             'Entry restored!',
      subtitle: language === 'de' ? `Eintrag #${savedEntries.length - indexToRestore} ist wieder aktiv` :
                language === 'es' ? `Entrada #${savedEntries.length - indexToRestore} está activa nuevamente` :
                `Entry #${savedEntries.length - indexToRestore} is active again`
    });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const getPageTitle = () => {
    switch (language) {
      case 'de': return `Prozess ${selectedProcess}: Werte erfassen`;
      case 'es': return `Proceso ${selectedProcess}: Capturar valores`;
      default: return `Process ${selectedProcess}: Capture Values`;
    }
  };

  const getOverviewDescription = () => {
    const count = selectedMetrics.length;
    const descriptions = {
      de: {
        colloquial: `Du hast ${count} Kennzahlen ausgewählt. Jetzt kannst du die konkreten Werte eingeben (z.B. Budget, Stunden).`,
        management: `${count} Performance-Indikatoren wurden definiert. Erfassen Sie nun die quantitativen Baseline- und Zielwerte für die strategische Messung.`
      },
      en: {
        colloquial: `You have selected ${count} metrics. Now you can capture the actual values (e.g. budget, hours).`,
        management: `${count} performance indicators have been defined. Capture the quantitative baseline and target values for strategic measurement.`
      },
      es: {
        colloquial: `Has seleccionado ${count} métricas. Ahora puedes capturar los valores reales (ej. presupuesto, horas).`,
        management: `Se han definido ${count} indicadores de rendimiento. Capture los valores de referencia y objetivos cuantitativos para la medición estratégica.`
      }
    };
    return descriptions[language][mode];
  };

  const getNoMetricsWarning = () => {
    const warnings = {
      de: {
        colloquial: 'Du hast noch keine Kennzahlen ausgewählt! Gehe zurück zur Metrik-Auswahl.',
        management: 'Es wurden keine Performance-Indikatoren definiert. Bitte navigieren Sie zur Metrik-Selektion zurück.'
      },
      en: {
        colloquial: 'You haven\'t selected any metrics yet! Go back to metric selection.',
        management: 'No performance indicators have been defined. Please navigate back to metric selection.'
      },
      es: {
        colloquial: '¡Aún no has seleccionado ninguna métrica! Vuelve a la selección de métricas.',
        management: 'No se han definido indicadores de rendimiento. Navegue de regreso a la selección de métricas.'
      }
    };
    return warnings[language][mode];
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      {/* Header */}
      {/* HEADER - MOBILE MINIMIZED */}
      <header className="bg-slate-800 border-b border-slate-700">
        {/* Mobile Header - Ultra Compact */}
        <div className="sm:hidden p-2 flex items-center justify-between gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-base font-bold text-blue-400 flex-1 truncate">
            📊 Value Capture
          </h1>

          <MobileMenu 
            mode={mode} 
            onModeChange={setMode}
            language={language.toUpperCase() as 'DE' | 'EN' | 'ES'}
            onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as Language)}
          />
        </div>

        {/* Desktop Header - Full Controls */}
        <div className="hidden sm:flex p-4 justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">
                {language === 'de' ? 'Zurück' : language === 'es' ? 'Volver' : 'Back'}
              </span>
            </button>
            
            <h1 className="text-xl font-bold text-blue-400">
              📊 {getPageTitle()}
            </h1>
          </div>

          {/* Controls: Language + Mode */}
          <div className="flex gap-4 items-center">
            {/* Language Switcher */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              {(['de', 'en', 'es'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-3 py-1 rounded-md transition ${
                    language === l ? 'bg-blue-600' : 'hover:bg-slate-600'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Mode Switcher (2x3 Matrix) */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setMode('colloquial')}
                className={`px-3 py-1 rounded-md transition text-sm ${
                  mode === 'colloquial' ? 'bg-blue-600' : 'hover:bg-slate-600'
                }`}
              >
                {mode === 'colloquial' ? '👥' : ''} {language === 'de' ? 'Normal' : language === 'es' ? 'Normal' : 'Normal'}
              </button>
              <button
                onClick={() => setMode('management')}
                className={`px-3 py-1 rounded-md transition text-sm ${
                  mode === 'management' ? 'bg-blue-600' : 'hover:bg-slate-600'
                }`}
              >
                {mode === 'management' ? '💼' : ''} {language === 'de' ? 'Management' : language === 'es' ? 'Gerencia' : 'Management'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 sm:p-6 max-w-4xl mx-auto">
        {/* Info Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">
                {language === 'de' ? 'Übersicht' :
                 language === 'es' ? 'Resumen' :
                 'Overview'}
              </h2>
              <span className="text-xs text-slate-500">
                {mode === 'colloquial' ? '👥 Team' : '💼 Management'}
              </span>
            </div>
            
            {/* DEVELOPMENT HELPER: Fill Demo Data Button! 🔥 */}
            {selectedMetrics.length > 0 && (
              <button
                onClick={fillDemoData}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-medium rounded-lg transition shadow-lg"
                title={language === 'de' ? 'Fülle alle Felder mit Demo-Daten' :
                       language === 'es' ? 'Rellenar con datos de demostración' :
                       'Fill all fields with demo data'}
              >
                🎲 {language === 'de' ? 'Demo-Daten' :
                    language === 'es' ? 'Datos Demo' :
                    'Demo Data'}
              </button>
            )}
          </div>
          <p className="text-slate-400 text-sm mb-4">
            {getOverviewDescription()}
          </p>
          
          {selectedMetrics.length === 0 && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <span>⚠️</span>
                <span className="font-medium">
                  {language === 'de' ? 'Keine Metriken ausgewählt!' :
                   language === 'es' ? '¡No hay métricas seleccionadas!' :
                   'No metrics selected!'}
                </span>
              </div>
              <p className="text-sm text-yellow-300 mt-2">
                {getNoMetricsWarning()}
              </p>
            </div>
          )}

          {selectedMetrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-700 rounded p-2">
                <div className="text-slate-400">
                  {language === 'de' ? 'Ausgewählte Metriken' :
                   language === 'es' ? 'Métricas seleccionadas' :
                   'Selected Metrics'}
                </div>
                <div className="text-xl font-bold text-blue-400">
                  {selectedMetrics.length}
                </div>
              </div>
              <div className="bg-slate-700 rounded p-2">
                <div className="text-slate-400">
                  {language === 'de' ? 'Prozess' :
                   language === 'es' ? 'Proceso' :
                   'Process'}
                </div>
                <div className="text-xl font-bold text-blue-400">
                  #{selectedProcess}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Value Capture Forms */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {language === 'de' ? 'Werte-Erfassung' :
               language === 'es' ? 'Captura de valores' :
               'Value Capture'}
            </h2>
            
            {savedEntries.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition text-sm font-medium flex items-center gap-2"
                >
                  {showHistory ? '📝' : '📊'}
                  {showHistory 
                    ? (language === 'de' ? 'Erfassung anzeigen' : language === 'es' ? 'Mostrar captura' : 'Show Capture')
                    : (language === 'de' ? `Historie anzeigen (${savedEntries.filter(e => !e.deleted_at).length})` : 
                       language === 'es' ? `Mostrar historial (${savedEntries.filter(e => !e.deleted_at).length})` : 
                       `Show History (${savedEntries.filter(e => !e.deleted_at).length})`)}
                </button>
                
                {showHistory && savedEntries.some(e => e.deleted_at) && (
                  <button
                    onClick={() => setShowDeleted(!showDeleted)}
                    className={`px-3 py-2 rounded-lg transition text-xs font-medium ${
                      showDeleted 
                        ? 'bg-yellow-600 hover:bg-yellow-500' 
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  >
                    {showDeleted ? '👁️' : '🚫'} 
                    {language === 'de' ? ` Gelöschte ${showDeleted ? 'verbergen' : `anzeigen (${savedEntries.filter(e => e.deleted_at).length})`}` :
                     language === 'es' ? ` ${showDeleted ? 'Ocultar' : `Mostrar`} eliminadas (${savedEntries.filter(e => e.deleted_at).length})` :
                     ` ${showDeleted ? 'Hide' : `Show`} deleted (${savedEntries.filter(e => e.deleted_at).length})`}
                  </button>
                )}
              </div>
            )}
          </div>
          
          {showHistory ? (
            /* HISTORY VIEW */
            <div className="space-y-4">
              <h3 className="text-md font-bold text-blue-400">
                {language === 'de' ? '📊 Erfasste Werte (Verlauf)' :
                 language === 'es' ? '📊 Valores capturados (historial)' :
                 '📊 Captured Values (History)'}
              </h3>
              
              {savedEntries.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
                  <p className="text-slate-400">
                    {language === 'de' ? 'Noch keine Werte erfasst.' :
                     language === 'es' ? 'Aún no se han capturado valores.' :
                     'No values captured yet.'}
                  </p>
                </div>
              ) : (
                savedEntries
                  .map((entry, idx) => ({ entry, idx }))
                  .filter(({ entry }) => showDeleted || !entry.deleted_at)
                  .map(({ entry, idx }) => {
                    const isDeleted = !!entry.deleted_at;
                    return (
                      <div 
                        key={idx} 
                        className={`border rounded-lg p-6 ${
                          isDeleted 
                            ? 'bg-slate-900/50 border-red-900/50 opacity-60' 
                            : 'bg-slate-800 border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className={`text-2xl font-bold ${isDeleted ? 'text-red-700' : 'text-slate-600'}`}>
                              #{savedEntries.length - idx}
                            </span>
                            <div>
                              <div className={`text-sm font-medium ${isDeleted ? 'text-red-500 line-through' : 'text-blue-400'}`}>
                                {formatDateLong(entry.date || entry.timestamp)}
                              </div>
                              <div className="text-xs text-slate-500">
                                {formatDate(entry.date || entry.timestamp)} • {new Date(entry.timestamp).toLocaleTimeString(
                                  language === 'de' ? 'de-DE' : language === 'es' ? 'es-ES' : 'en-US'
                                )}
                              </div>
                              {isDeleted && (
                                <div className="text-xs text-red-400 mt-1">
                                  🗑️ {language === 'de' ? 'Gelöscht:' : language === 'es' ? 'Eliminado:' : 'Deleted:'} {formatDateLong(entry.deleted_at)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Entry Note (if exists) */}
                          {entry.note && (
                            <div className={`px-3 py-2 rounded-lg mb-3 border ${
                              isDeleted 
                                ? 'bg-slate-900/30 border-slate-800' 
                                : 'bg-blue-900/20 border-blue-700'
                            }`}>
                              <div className="flex items-start gap-2">
                                <span className="text-lg">📝</span>
                                <div className="flex-1">
                                  <div className="text-xs text-slate-500 mb-1">
                                    {language === 'de' ? 'Notiz:' : language === 'es' ? 'Nota:' : 'Note:'}
                                  </div>
                                  <div className={`text-sm font-medium ${
                                    isDeleted ? 'text-slate-500' : 'text-blue-300'
                                  }`}>
                                    {entry.note}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {isDeleted ? (
                              <button
                                onClick={() => restoreEntry(idx)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
                                title={language === 'de' ? 'Wiederherstellen' : language === 'es' ? 'Restaurar' : 'Restore'}
                              >
                                ♻️ {language === 'de' ? 'Wiederherstellen' : language === 'es' ? 'Restaurar' : 'Restore'}
                              </button>
                            ) : (
                              <button
                                onClick={() => deleteEntry(idx)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-sm font-medium flex items-center gap-2"
                                title={language === 'de' ? 'Löschen' : language === 'es' ? 'Eliminar' : 'Delete'}
                              >
                                🗑️ {language === 'de' ? 'Löschen' : language === 'es' ? 'Eliminar' : 'Delete'}
                              </button>
                            )}
                          </div>
                        </div>
                    
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(entry.metrics).map(([metricKey, metricData]: [string, any]) => {
                            const metric = getMetricDetails(metricKey);
                            if (!metric) return null;
                            
                            const percentage = metricData.targetValue && metricData.currentValue
                              ? ((parseFloat(metricData.currentValue) / parseFloat(metricData.targetValue)) * 100).toFixed(1)
                              : null;
                            
                            return (
                              <div 
                                key={metricKey} 
                                className={`rounded-lg p-4 ${
                                  isDeleted ? 'bg-slate-800' : 'bg-slate-700'
                                }`}
                              >
                                <div className={`text-sm font-medium mb-2 ${
                                  isDeleted ? 'text-slate-500' : 'text-white'
                                }`}>
                                  {getMetricName(metric)}
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Target:</span>
                                    <span className={`font-medium ${isDeleted ? 'text-slate-500' : 'text-white'}`}>
                                      {metricData.targetValue || '-'} {metric.unit}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-400">Current:</span>
                                    <span className={`font-medium ${isDeleted ? 'text-slate-500' : 'text-white'}`}>
                                      {metricData.currentValue || '-'} {metric.unit}
                                    </span>
                                  </div>
                                  {percentage && (
                                    <div className="flex justify-between pt-1 border-t border-slate-600">
                                      <span className="text-slate-400">%:</span>
                                      <span className={`font-bold ${isDeleted ? 'text-slate-500' : 'text-blue-400'}`}>
                                        {percentage}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          ) : selectedMetrics.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-center">
              <p className="text-slate-400">
                {language === 'de' ? 'Keine Metriken zum Erfassen.' :
                 language === 'es' ? 'No hay métricas para capturar.' :
                 'No metrics to capture.'}
              </p>
            </div>
          ) : (
            sortMetricsByCategory(selectedMetrics).map((metricKey) => {
              const metric = getMetricDetails(metricKey);
              if (!metric) return null;
              
              const category = getCategoryFromKey(metricKey);
              
              const values = metricValues[metricKey] || {
                metricKey,
                targetValue: '',
                currentValue: ''
              };
              
              return (
                <div key={metricKey} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  {/* Metric Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {getMetricName(metric)}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-slate-700 text-slate-300 border border-slate-600">
                          {getCategoryIcon(category)} {getCategoryName(category)}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-600 text-white">
                          {metric.unit}
                        </span>
                        <span className="text-xs text-slate-500">
                          {mode === 'colloquial' ? '👥' : '💼'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {getMetricDescription(metric)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {/* Target Value */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'de' ? '🎯 Zielwert' :
                         language === 'es' ? '🎯 Valor objetivo' :
                         '🎯 Target Value'}
                      </label>
                      <input
                        type="number"
                        value={values.targetValue}
                        onChange={(e) => updateMetricValue(metricKey, 'targetValue', e.target.value)}
                        placeholder={language === 'de' ? 'z.B. 10000' : language === 'es' ? 'ej. 10000' : 'e.g. 10000'}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'de' ? 'Geplanter/Budget-Wert' :
                         language === 'es' ? 'Valor planificado/presupuesto' :
                         'Planned/Budget value'}
                      </p>
                    </div>
                    
                    {/* Current Value */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {language === 'de' ? '📊 Aktueller Wert' :
                         language === 'es' ? '📊 Valor actual' :
                         '📊 Current Value'}
                      </label>
                      <input
                        type="number"
                        value={values.currentValue}
                        onChange={(e) => updateMetricValue(metricKey, 'currentValue', e.target.value)}
                        placeholder={language === 'de' ? 'z.B. 7500' : language === 'es' ? 'ej. 7500' : 'e.g. 7500'}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {language === 'de' ? 'Tatsächlich erreicht/ausgegeben' :
                         language === 'es' ? 'Realmente alcanzado/gastado' :
                         'Actually achieved/spent'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Auto-Calculated Result (if both values entered) */}
                  {values.targetValue && values.currentValue && (
                    <div className="mt-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-blue-300">
                            {language === 'de' ? '⚡ Auto-berechnet:' :
                             language === 'es' ? '⚡ Auto-calculado:' :
                             '⚡ Auto-calculated:'}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-400">
                          {((parseFloat(values.currentValue) / parseFloat(values.targetValue)) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <p className="text-xs text-blue-300 mt-1">
                        {metric.calculation_method}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
          
          {/* Global Date & Note Fields (for all metrics in this entry) */}
          {!showHistory && selectedMetrics.length > 0 && (
            <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {language === 'de' ? '📅 Erfassungsdetails für alle Metriken' :
                 language === 'es' ? '📅 Detalles de captura para todas las métricas' :
                 '📅 Capture Details for All Metrics'}
              </h3>
              
              {/* Date Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === 'de' ? '📅 Erfassungsdatum' :
                   language === 'es' ? '📅 Fecha de captura' :
                   '📅 Capture Date'}
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => {
                    console.log('Entry date (ISO):', e.target.value);
                    setEntryDate(e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {language === 'de' ? `📆 Zeitpunkt der Erfassung (ISO: ${entryDate}) - z.B. Quartalsende 30.06.2026` :
                   language === 'es' ? `📆 Momento de captura (ISO: ${entryDate}) - ej. fin de trimestre 30/06/2026` :
                   `📆 Capture timestamp (ISO: ${entryDate}) - e.g. quarter end 06/30/2026`}
                </p>
              </div>
              
              {/* Note Field */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === 'de' ? '📝 Notiz (optional)' :
                   language === 'es' ? '📝 Nota (opcional)' :
                   '📝 Note (optional)'}
                </label>
                <input
                  type="text"
                  value={entryNote}
                  onChange={(e) => setEntryNote(e.target.value)}
                  placeholder={language === 'de' ? 'z.B. "Q2 2026 SAP Kostenstellenbericht"' : 
                               language === 'es' ? 'ej. "Q2 2026 Informe de centro de costos SAP"' : 
                               'e.g. "Q2 2026 SAP Cost Center Report"'}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {language === 'de' ? '💡 Quelle oder Kontext für Audit/Controlling-Nachweise' :
                   language === 'es' ? '💡 Fuente o contexto para pruebas de auditoría/control' :
                   '💡 Source or context for audit/controlling evidence'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Bar - Bottom */}
      {/* Action Bar - MOBILE OPTIMIZED */}
      <div className="sticky bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          {/* Info Bar - Nur auf Desktop */}
          <div className="hidden sm:block px-4 py-2 border-b border-slate-700 bg-slate-800/50">
            <div className="text-sm text-slate-400">
              {language === 'de' ? 
                'Erfasse die Werte für deine ausgewählten Metriken' :
               language === 'es' ?
                'Captura los valores de tus métricas seleccionadas' :
                'Capture values for your selected metrics'}
            </div>
          </div>

          {/* Action Buttons - GROSSE Touch-Targets auf Mobile */}
          <div className="p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => router.push(`/preview-metrics?process=${selectedProcess}`)}
              className="px-4 py-3 sm:py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-medium text-base sm:text-sm min-h-[48px] sm:min-h-0"
            >
              <span className="sm:hidden">🔙 {language === 'de' ? 'Zurück' : language === 'es' ? 'Volver' : 'Back'}</span>
              <span className="hidden sm:inline">🔙 {language === 'de' ? 'Zurück zur Auswahl' : language === 'es' ? 'Volver a selección' : 'Back to Selection'}</span>
            </button>
            <button
              onClick={saveMetricValues}
              disabled={!canSave}
              className={`px-4 py-3 sm:py-2 rounded-lg font-medium transition text-base sm:text-sm min-h-[48px] sm:min-h-0 flex-1 sm:flex-none ${
                canSave
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-lg shadow-pink-500/50 animate-gradient'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              💾 {language === 'de' ? 'Speichern' : language === 'es' ? 'Guardar' : 'Save'}
            </button>
            <button
              onClick={() => {
                // Navigate to Dashboard with current process
                router.push(`/dashboard?process=${selectedProcess}`);
              }}
              disabled={savedEntries.filter(e => !e.deleted_at).length === 0}
              className={`px-4 py-3 sm:py-2 rounded-lg font-medium transition text-base sm:text-sm min-h-[48px] sm:min-h-0 flex-1 sm:flex-none ${
                savedEntries.filter(e => !e.deleted_at).length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
              title={savedEntries.filter(e => !e.deleted_at).length === 0 
                ? (language === 'de' ? 'Erst Werte speichern!' : language === 'es' ? '¡Primero guardar valores!' : 'Save values first!')
                : undefined}
            >
              <span className="sm:hidden">▶️ {language === 'de' ? 'Dashboard' : language === 'es' ? 'Panel' : 'Dashboard'}</span>
              <span className="hidden sm:inline">▶️ {language === 'de' ? 'Weiter zum Dashboard' : language === 'es' ? 'Continuar al panel' : 'Continue to Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slideUp">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient text-white px-6 py-4 rounded-lg shadow-2xl shadow-pink-500/50 flex items-center gap-3 border border-pink-400">
            <div className="text-2xl">{toastMessage.title.includes('gelöscht') || toastMessage.title.includes('deleted') || toastMessage.title.includes('eliminada') ? '🗑️' : '✅'}</div>
            <div>
              <div className="font-bold">
                {toastMessage.title}
              </div>
              <div className="text-sm text-pink-100">
                {toastMessage.subtitle}
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="ml-4 text-white hover:text-pink-200 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function ProcessInstancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading process data...</div>
      </div>
    }>
      <ProcessInstanceContent />
    </Suspense>
  );
}
