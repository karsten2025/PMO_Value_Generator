'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Activity, ChevronDown, ChevronUp, Target, Zap, Package, Award, MessageSquare, Info } from 'lucide-react';
import MobileMenu from '../components/MobileMenu';
import TrendChart from '../components/TrendChart';
import CategoryWeightsSettings from '../components/CategoryWeightsSettings';
import ScoreBreakdown from '../components/ScoreBreakdown';
import {
  calculateMetricScore,
  calculateProcessScore,
  calculatePortfolioScore,
  getPerformanceColor,
  getPerformanceIcon,
  getCategoryWeights,
  MetricValue,
  MetricScore,
  ProcessScore,
  PortfolioScore,
  type MetricCategory,
} from '../utils/scoreCalculation';

// Types
type Language = 'de' | 'en' | 'es';
type Mode = 'colloquial' | 'management';

// Helper: Get Category Icon
function getCategoryIcon(category: MetricCategory) {
  switch (category) {
    case 'input': return <Target size={14} className="text-blue-400" />;
    case 'process': return <Zap size={14} className="text-purple-400" />;
    case 'output': return <Package size={14} className="text-green-400" />;
    case 'outcome': return <Award size={14} className="text-yellow-400" />;
    case 'feedback': return <MessageSquare size={14} className="text-pink-400" />;
    default: return null;
  }
}

// Helper: Get Category Name
function getCategoryName(category: MetricCategory, language: Language): string {
  const map = {
    'input': { de: 'Input', en: 'Input', es: 'Entrada' },
    'process': { de: 'Prozess', en: 'Process', es: 'Proceso' },
    'output': { de: 'Output', en: 'Output', es: 'Salida' },
    'outcome': { de: 'Outcome', en: 'Outcome', es: 'Resultado' },
    'feedback': { de: 'Feedback', en: 'Feedback', es: 'Retroalimentación' },
  };
  return map[category]?.[language] || category;
}

// Inner component that uses useSearchParams
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processParam = searchParams.get('process');

  // State
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [mode, setMode] = useState<Mode>('colloquial');
  const [selectedProcess, setSelectedProcess] = useState<number>(() => {
    if (processParam) {
      const num = parseInt(processParam);
      if (num >= 1 && num <= 10) return num;
    }
    return 1;
  });
  const [expandedProcesses, setExpandedProcesses] = useState<Set<number>>(new Set());
  const [weightsUpdateTrigger, setWeightsUpdateTrigger] = useState(0);

  // FIX HYDRATION: Nach Mount Language aus LocalStorage laden
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('user_language');
      if (savedLang && ['de', 'en', 'es'].includes(savedLang.toLowerCase())) {
        setLanguage(savedLang.toLowerCase() as Language);
      }
      const savedMode = localStorage.getItem('user_register');
      if (savedMode && ['colloquial', 'management'].includes(savedMode)) {
        setMode(savedMode as Mode);
      }
    }
  }, []);

  // Load Metric Values from LocalStorage
  const [portfolioScore, setPortfolioScore] = useState<PortfolioScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trendData, setTrendData] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    if (!mounted) return;

    // Lade alle gespeicherten Metric Values aus LocalStorage
    // Format: process_{processId}_metrics_history
    const loadPortfolioData = () => {
      setIsLoading(true);

      try {
        const allProcessScores: ProcessScore[] = [];

        // Iteriere durch alle 10 Prozesse
        for (let processId = 1; processId <= 10; processId++) {
          // STORAGE KEY: metric_values_p{processId}
          const historyKey = `metric_values_p${processId}`;
          const historyData = localStorage.getItem(historyKey);

          if (historyData) {
            const history = JSON.parse(historyData);
            
            // Nehme nur die neuesten (nicht gelöschten) Einträge
            const latestEntry = history
              .filter((entry: any) => !entry.deleted_at)
              .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

            if (latestEntry && latestEntry.metrics) {
              // Konvertiere gespeicherte Metriken zu MetricValue Format
              const metrics: MetricValue[] = Object.entries(latestEntry.metrics).map(([metricId, data]: [string, any]) => {
                // Bestimme Category aus Metric Key (enthält Category-Namen!)
                // Format: "input-0", "process-training", "output-0", etc.
                let category: MetricCategory = 'output';
                const metricIdLower = metricId.toLowerCase();
                
                if (metricIdLower.includes('input')) category = 'input';
                else if (metricIdLower.includes('process')) category = 'process';
                else if (metricIdLower.includes('output')) category = 'output';
                else if (metricIdLower.includes('outcome')) category = 'outcome';
                else if (metricIdLower.includes('feedback')) category = 'feedback';

                // Bestimme Scoring Direction
                // ANNAHME: Die meisten sind "higher_is_better"
                // "lower_is_better" nur bei Kosten/Zeit-Metriken
                const nameAndId = ((data.metric_name || '') + metricId).toLowerCase();
                const scoring_direction: 'higher_is_better' | 'lower_is_better' = 
                  nameAndId.includes('cost') ||
                  nameAndId.includes('delay') ||
                  nameAndId.includes('time') ||
                  nameAndId.includes('budget') ||
                  nameAndId.includes('utilization')
                    ? 'lower_is_better'
                    : 'higher_is_better';

                return {
                  metric_id: metricId,
                  metric_name: data.metric_name || metricId,
                  category,
                  scoring_direction,
                  target_value: parseFloat(data.targetValue || data.target_value) || 0,
                  current_value: parseFloat(data.currentValue || data.current_value) || 0,
                  unit: data.unit,
                };
              });

              // Berechne Process Score
              if (metrics.length > 0) {
                const processScore = calculateProcessScore(
                  processId,
                  `Process ${processId}`,
                  metrics
                );
                allProcessScores.push(processScore);
              }
            }
          }
        }

        // Berechne Portfolio Score
        if (allProcessScores.length > 0) {
          const portfolio = calculatePortfolioScore(
            'portfolio_1',
            'Digital Transformation [DUMMY]',
            allProcessScores
          );
          setPortfolioScore(portfolio);

          // LOAD TREND DATA: Extrahiere historische Scores
          const trend = loadTrendData();
          setTrendData(trend);
        } else {
          setPortfolioScore(null);
          setTrendData([]);
        }
      } catch (error) {
        console.error('Error loading portfolio data:', error);
        setPortfolioScore(null);
        setTrendData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load Trend Data from History
    const loadTrendData = () => {
      // Sammle ALLE Einträge aus ALLEN Prozessen, gruppiert nach Datum
      const entriesByDate: Record<string, Record<number, any>> = {};

      // Iteriere durch alle Prozesse
      for (let processId = 1; processId <= 10; processId++) {
        const historyKey = `metric_values_p${processId}`;
        const historyData = localStorage.getItem(historyKey);

        if (historyData) {
          const history = JSON.parse(historyData);
          
          // Für jeden Entry
          history
            .filter((entry: any) => !entry.deleted_at)
            .forEach((entry: any) => {
              const date = entry.date || entry.timestamp;
              
              if (!entriesByDate[date]) {
                entriesByDate[date] = {};
              }
              
              // Speichere Entry für diesen Prozess und dieses Datum
              entriesByDate[date][processId] = entry;
            });
        }
      }

      // Jetzt berechne für jedes Datum den Portfolio Score
      const trendData = Object.entries(entriesByDate).map(([date, processEntries]) => {
        const processScores: ProcessScore[] = [];

        // Berechne Score für jeden Prozess an diesem Datum
        Object.entries(processEntries).forEach(([processIdStr, entry]: [string, any]) => {
          const processId = parseInt(processIdStr);

          if (entry.metrics) {
            // Konvertiere zu MetricValue Format
            const metrics: MetricValue[] = Object.entries(entry.metrics).map(([metricId, data]: [string, any]) => {
              let category: MetricCategory = 'output';
              const metricIdLower = metricId.toLowerCase();
              
              if (metricIdLower.includes('input')) category = 'input';
              else if (metricIdLower.includes('process')) category = 'process';
              else if (metricIdLower.includes('output')) category = 'output';
              else if (metricIdLower.includes('outcome')) category = 'outcome';
              else if (metricIdLower.includes('feedback')) category = 'feedback';

              const nameAndId = ((data.metric_name || '') + metricId).toLowerCase();
              const scoring_direction: 'higher_is_better' | 'lower_is_better' = 
                nameAndId.includes('cost') ||
                nameAndId.includes('delay') ||
                nameAndId.includes('time') ||
                nameAndId.includes('budget') ||
                nameAndId.includes('utilization')
                  ? 'lower_is_better'
                  : 'higher_is_better';

              return {
                metric_id: metricId,
                metric_name: data.metric_name || metricId,
                category,
                scoring_direction,
                target_value: parseFloat(data.targetValue || data.target_value) || 0,
                current_value: parseFloat(data.currentValue || data.current_value) || 0,
              };
            });

            if (metrics.length > 0) {
              const processScore = calculateProcessScore(processId, `Process ${processId}`, metrics);
              processScores.push(processScore);
            }
          }
        });

        // Berechne Portfolio Score für dieses Datum
        if (processScores.length > 0) {
          const portfolioScore = calculatePortfolioScore('portfolio_1', 'Portfolio', processScores);
          return {
            date,
            score: portfolioScore.overall_score
          };
        }

        return null;
      }).filter((entry): entry is { date: string; score: number } => entry !== null)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return trendData;
    };

    loadPortfolioData();
  }, [mounted, selectedProcess, weightsUpdateTrigger]);

  // Translations
  const getPageTitle = () => {
    switch (language) {
      case 'de': return 'PMO Dashboard';
      case 'es': return 'Panel PMO';
      default: return 'PMO Dashboard';
    }
  };

  const getEmptyStateText = () => {
    switch (language) {
      case 'de': return 'Keine Daten verfügbar. Bitte erfasse zuerst Metrik-Werte.';
      case 'es': return 'No hay datos disponibles. Primero captura valores de métricas.';
      default: return 'No data available. Please capture metric values first.';
    }
  };

  // Handler: Weights wurden geändert → Neu berechnen
  const handleWeightsChange = () => {
    setWeightsUpdateTrigger(prev => prev + 1);
  };

  // Loading State bis mounted
  if (!mounted) {
    return (
      <div className="w-full h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col" suppressHydrationWarning>
      {/* HEADER - MOBILE MINIMIZED */}
      <header className="bg-slate-800 border-b border-slate-700">
        {/* Mobile Header */}
        <div className="sm:hidden p-2 flex items-center justify-between gap-2">
          <button
            onClick={() => router.push('/')}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          
          <h1 className="text-base font-bold text-blue-400 flex-1 truncate">
            📊 {getPageTitle()}
          </h1>

          <MobileMenu 
            mode={mode} 
            onModeChange={setMode}
            language={language.toUpperCase() as 'DE' | 'EN' | 'ES'}
            onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as Language)}
            additionalContent={
              <div className="pt-4 border-t border-slate-700">
                <CategoryWeightsSettings 
                  language={language} 
                  onWeightsChange={handleWeightsChange}
                />
              </div>
            }
          />
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex p-4 justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">
                {language === 'de' ? 'Zurück zum Impact Cycle' : 
                 language === 'es' ? 'Volver al Ciclo de Impacto' : 
                 'Back to Impact Cycle'}
              </span>
            </button>
            
            <h1 className="text-xl font-bold text-blue-400">
              📊 {getPageTitle()}
            </h1>
          </div>

          {/* Controls */}
          <div className="flex gap-4 items-center">
            {/* Language */}
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

            {/* Mode */}
            <div className="flex bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setMode('colloquial')}
                className={`px-3 py-1 rounded-md transition text-sm ${
                  mode === 'colloquial' ? 'bg-blue-600' : 'hover:bg-slate-600'
                }`}
              >
                👥 {language === 'de' ? 'Normal' : language === 'es' ? 'Normal' : 'Normal'}
              </button>
              <button
                onClick={() => setMode('management')}
                className={`px-3 py-1 rounded-md transition text-sm ${
                  mode === 'management' ? 'bg-blue-600' : 'hover:bg-slate-600'
                }`}
              >
                💼 {language === 'de' ? 'Management' : language === 'es' ? 'Gerencia' : 'Management'}
              </button>
            </div>

            {/* Category Weights Settings */}
            <CategoryWeightsSettings 
              language={language} 
              onWeightsChange={handleWeightsChange}
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {isLoading ? (
            // Loading State
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-slate-400 text-sm">
                  {language === 'de' ? 'Lade Dashboard-Daten...' :
                   language === 'es' ? 'Cargando datos del panel...' :
                   'Loading dashboard data...'}
                </div>
              </div>
            </div>
          ) : portfolioScore ? (
            <>
              {/* PORTFOLIO HEALTH SCORE - BIG CARD */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg font-bold text-slate-300 mb-2">
                      {language === 'de' ? 'Portfolio Gesundheit' :
                       language === 'es' ? 'Salud del Portafolio' :
                       'Portfolio Health'}
                    </h2>
                    <p className="text-3xl sm:text-5xl font-bold text-blue-400 mb-2">
                      {portfolioScore.overall_score}%
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-4xl">{getPerformanceIcon(portfolioScore.health_status)}</span>
                      <span className={`text-lg font-semibold capitalize ${getPerformanceColor(portfolioScore.health_status).text}`}>
                        {portfolioScore.health_status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="text-sm text-slate-400 mb-2">
                      {language === 'de' ? 'Aktive Prozesse:' :
                       language === 'es' ? 'Procesos Activos:' :
                       'Active Processes:'}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {portfolioScore.processes.length} / 10
                    </div>
                  </div>
                </div>
              </div>

              {/* SCORE BREAKDOWN */}
              <ScoreBreakdown
                categoryScores={portfolioScore.category_scores}
                overallScore={portfolioScore.overall_score}
                language={language}
                onAdjustWeights={() => setShowWeightsSettings(true)}
              />

              {/* PROCESS SCORES GRID */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === 'de' ? 'Prozess-Scores' :
                   language === 'es' ? 'Puntuaciones de Proceso' :
                   'Process Scores'}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {portfolioScore.processes.map((process) => {
                    const performance = process.overall_score >= 90 ? 'excellent' :
                                      process.overall_score >= 70 ? 'good' :
                                      process.overall_score >= 50 ? 'warning' : 'critical';
                    const colors = getPerformanceColor(performance);
                    const isExpanded = expandedProcesses.has(process.process_id);

                    return (
                      <div
                        key={process.process_id}
                        className={`bg-slate-800 border-2 ${colors.border} rounded-lg overflow-hidden transition-all`}
                      >
                        {/* PROCESS HEADER (CLICKABLE) */}
                        <div
                          className="p-4 cursor-pointer hover:bg-slate-700/50 transition"
                          onClick={() => {
                            const newExpanded = new Set(expandedProcesses);
                            if (isExpanded) {
                              newExpanded.delete(process.process_id);
                            } else {
                              newExpanded.add(process.process_id);
                            }
                            setExpandedProcesses(newExpanded);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-slate-400">
                                  {language === 'de' ? 'Prozess' :
                                   language === 'es' ? 'Proceso' :
                                   'Process'} {process.process_id}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({process.metrics.length} {language === 'de' ? 'Metriken' :
                                                              language === 'es' ? 'Métricas' :
                                                              'Metrics'})
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-white">
                                {process.overall_score}%
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl">{getPerformanceIcon(performance)}</span>
                              {isExpanded ? (
                                <ChevronUp size={20} className="text-slate-400" />
                              ) : (
                                <ChevronDown size={20} className="text-slate-400" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* METRIC DETAILS (COLLAPSIBLE) */}
                        {isExpanded && (
                          <div className="border-t border-slate-700 bg-slate-900/50">
                            <div className="p-4 space-y-3">
                              {process.metrics.map((metric) => {
                                const metricPerformance = metric.score >= 90 ? 'excellent' :
                                                        metric.score >= 70 ? 'good' :
                                                        metric.score >= 50 ? 'warning' : 'critical';
                                const metricColors = getPerformanceColor(metricPerformance);

                                return (
                                  <div
                                    key={metric.metric_id}
                                    className="bg-slate-800 rounded-lg p-3 border border-slate-700"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {getCategoryIcon(metric.category)}
                                          <span className="text-xs font-medium text-slate-300">
                                            {getCategoryName(metric.category, language)}
                                          </span>
                                          <div className="relative group">
                                            <Info size={12} className="text-slate-500 hover:text-blue-400 cursor-help transition" />
                                            <div className="absolute left-0 top-6 hidden group-hover:block z-50 w-48 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 shadow-xl">
                                              <div className="font-semibold text-blue-400 mb-1">
                                                {language === 'de' ? 'Gewichtung:' :
                                                 language === 'es' ? 'Peso:' :
                                                 'Weight:'}
                                              </div>
                                              <div>
                                                {getCategoryName(metric.category, language)}: {Math.round(getCategoryWeights()[metric.category] * 100)}%
                                              </div>
                                              <div className="text-slate-500 mt-1">
                                                {language === 'de' ? 'Beiträgt zum Gesamtscore' :
                                                 language === 'es' ? 'Contribuye a la puntuación total' :
                                                 'Contributes to overall score'}
                                              </div>
                                            </div>
                                          </div>
                                          {metric.scoring_direction === 'lower_is_better' && (
                                            <TrendingDown size={12} className="text-orange-400" aria-label="Lower is better" />
                                          )}
                                          {metric.scoring_direction === 'higher_is_better' && (
                                            <TrendingUp size={12} className="text-green-400" aria-label="Higher is better" />
                                          )}
                                        </div>
                                        <div className="text-sm font-medium text-white">
                                          {metric.metric_name || metric.metric_id}
                                        </div>
                                      </div>
                                      <div className={`text-lg font-bold ${metricColors.text}`}>
                                        {metric.score}%
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div>
                                        <div className="text-slate-500">Target</div>
                                        <div className="text-slate-300 font-medium">{metric.target_value}</div>
                                      </div>
                                      <div>
                                        <div className="text-slate-500">Current</div>
                                        <div className="text-slate-300 font-medium">{metric.current_value}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TREND CHARTS */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {language === 'de' ? 'Performance-Trend' :
                   language === 'es' ? 'Tendencia de Rendimiento' :
                   'Performance Trend'}
                </h3>
                
                {trendData.length > 0 ? (
                  <TrendChart
                    data={trendData}
                    title={language === 'de' ? 'Portfolio Score über Zeit' :
                           language === 'es' ? 'Puntuación de Portfolio a lo largo del tiempo' :
                           'Portfolio Score Over Time'}
                    language={language}
                    height={300}
                    chartType="area"
                  />
                ) : (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="text-center py-12">
                      <Activity size={48} className="mx-auto text-slate-600 mb-4" />
                      <h3 className="text-lg font-bold text-slate-400 mb-2">
                        {language === 'de' ? 'Noch keine Trend-Daten' :
                         language === 'es' ? 'Aún no hay datos de tendencia' :
                         'No Trend Data Yet'}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {language === 'de' ? 'Erfasse Metriken über mehrere Zeitpunkte, um Trends zu sehen' :
                         language === 'es' ? 'Captura métricas en múltiples momentos para ver tendencias' :
                         'Capture metrics over multiple time points to see trends'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty State
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                {language === 'de' ? 'Noch keine Daten' :
                 language === 'es' ? 'Sin Datos Aún' :
                 'No Data Yet'}
              </h3>
              <p className="text-slate-400 mb-6">
                {getEmptyStateText()}
              </p>
              <button
                onClick={() => router.push('/preview-metrics?process=1')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
              >
                {language === 'de' ? 'Metriken erfassen' :
                 language === 'es' ? 'Capturar Métricas' :
                 'Capture Metrics'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Main component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading...</div>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

