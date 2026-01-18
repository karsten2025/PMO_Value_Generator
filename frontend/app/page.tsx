"use client";

/*
 * PMO Impact Cycle - Value Engine Visualisierung
 * 
 * Basiert auf: PMO Practice Guide (PMI)
 * Rechtlicher Schutz: Alle Begriffe paraphrasiert und eigene Nomenklatur verwendet
 * - "PMO Value Ring" → "PMO Impact Cycle"
 * - "Flywheel" → "Value Engine"
 * - "Steps" → "Milestones"
 * 
 * Die 10 Schritte mit vollständiger 2×3 Matrix (DE/EN/ES × Normal/Management)
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { useSearchParams } from 'next/navigation';
import '@xyflow/react/dist/style.css';
import { Languages, User, Target, TrendingUp, Users as UsersIcon, CheckCircle, LayoutGrid, Network, MessageSquare } from 'lucide-react';
import uiLabels from '../mock/ui-labels-matrix.json';
import kpiLibrary from '../mock/kpi-library-mock.json';
import ImpactNode from './components/ImpactNode';
import HealthHubNode from './components/HealthHubNode';
import PortfolioSelector from './components/PortfolioSelector';
import PortfolioProjectList from './components/PortfolioProjectList';
import ChatInterface from './components/ChatInterface';
import MobileMenu from './components/MobileMenu';
import GitHubStyleHeader from './components/GitHubStyleHeader';
import { usePortfolio } from '@/app/contexts/PortfolioContext';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { supabase, InstanceMetric } from '@/lib/supabase';
import { IMPACT_CYCLE_DATA } from './data/impactCycleData';
import { KPIValue, MilestoneCompletion } from './types';
import * as helpers from './utils/helpers';

// Die 10 Schritte des PMO Impact Cycle (importiert aus ./data/impactCycleData)

// Custom Node Types für ReactFlow
const nodeTypes = {
  impactNode: ImpactNode,
  healthHub: HealthHubNode,
};

export default function FlywheelPage() {
  // Portfolio Context
  const { selectedPortfolio } = usePortfolio();
  const { language: contextLanguage, register: contextRegister, setLanguage: setContextLanguage, setRegister: setContextRegister } = useLanguage();
  
  // URL Parameters
  const searchParams = useSearchParams();

  // FIX HYDRATION: Mounted State - verhindert Mismatch zwischen Server und Client
  const [mounted, setMounted] = useState(false);

  // UI State - Sync with LanguageContext
  const [lang, setLangState] = useState<'de' | 'en' | 'es'>('en'); // Start always with 'en'
  const [mode, setModeState] = useState<'colloquial' | 'management'>('colloquial');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedKPIs, setSelectedKPIs] = useState<string[]>([]);
  const [kpiValues, setKpiValues] = useState<KPIValue[]>([]);
  
  // View State: Impact Cycle oder Projects List
  const [view, setView] = useState<'cycle' | 'projects'>('cycle');
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot state
  
  // Check URL parameter for view on mount
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam === 'projects') {
      setView('projects');
    }
  }, [searchParams]);
  
  // Sync local state with LanguageContext
  const setLang = (newLang: 'de' | 'en' | 'es') => {
    setLangState(newLang);
    setContextLanguage(newLang.toUpperCase() as 'DE' | 'EN' | 'ES');
  };
  
  const setMode = (newMode: 'colloquial' | 'management') => {
    setModeState(newMode);
    setContextRegister(newMode);
  };
  
  // FIX HYDRATION: Sync from LanguageContext NACH Mount
  useEffect(() => {
    setMounted(true);
    setLangState(contextLanguage.toLowerCase() as 'de' | 'en' | 'es');
    setModeState(contextRegister);
  }, [contextLanguage, contextRegister]);
  
  // DB State
  const [instanceMetrics, setInstanceMetrics] = useState<InstanceMetric[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [milestoneCompletions, setMilestoneCompletions] = useState<MilestoneCompletion>({});
  
  // Health Hub Scores
  const [strategicScore, setStrategicScore] = useState(0);
  const [tacticalScore, setTacticalScore] = useState(0);
  const [operationalScore, setOperationalScore] = useState(0);
  const [totalImpactScore, setTotalImpactScore] = useState(0);

  // Lade KPI-Metriken aus Supabase für das gewählte Portfolio
  const loadMetricsForPortfolio = useCallback(async () => {
    if (!selectedPortfolio) {
      setInstanceMetrics([]);
      setMilestoneCompletions({});
      setStrategicScore(0);
      setTacticalScore(0);
      setOperationalScore(0);
      setTotalImpactScore(0);
      return;
    }

    try {
      setIsLoadingMetrics(true);
      
      const { data, error } = await supabase
        .from('pmo_kpi_values')
        .select('*')
        .eq('portfolio_id', selectedPortfolio.id);

      if (error) throw error;

      setInstanceMetrics(data || []);

      // Berechne Completion für jeden Step basierend auf echten Daten
      const completions: MilestoneCompletion = {};
      
      IMPACT_CYCLE_DATA.forEach(step => {
        const stepMetrics = (data || []).filter(m => m.step_id === parseInt(step.id));
        
        if (stepMetrics.length > 0) {
          // Berechne durchschnittliche Erreichung für alle KPIs dieses Steps
          const avgCompletion = stepMetrics.reduce((sum, metric) => {
            const achievement = metric.target_value > 0 
              ? Math.min((metric.actual_value / metric.target_value) * 100, 100)
              : 0;
            return sum + achievement;
          }, 0) / stepMetrics.length;
          
          completions[step.id] = Math.round(avgCompletion);
        } else {
          completions[step.id] = 0;
        }
      });

      setMilestoneCompletions(completions);

      // ========================================
      // HEALTH HUB SCORES BERECHNEN
      // ========================================
      const metrics = data || [];
      
      if (metrics.length === 0) {
        setStrategicScore(0);
        setTacticalScore(0);
        setOperationalScore(0);
        setTotalImpactScore(0);
      } else {
        // Gruppiere Metriken nach KPI-Kategorie
        const strategicMetrics: InstanceMetric[] = [];
        const tacticalMetrics: InstanceMetric[] = [];
        const operationalMetrics: InstanceMetric[] = [];

        metrics.forEach(metric => {
          const kpiInfo = kpiLibrary.kpis.find((k: any) => k.id === metric.kpi_id);
          if (kpiInfo) {
            if (kpiInfo.kpi_type === 'strategic') {
              strategicMetrics.push(metric);
            } else if (kpiInfo.kpi_type === 'tactical') {
              tacticalMetrics.push(metric);
            } else if (kpiInfo.kpi_type === 'operational') {
              operationalMetrics.push(metric);
            }
          }
        });

        // Berechne Durchschnitte
        const calcAverage = (metricsList: InstanceMetric[]) => {
          if (metricsList.length === 0) return 0;
          const sum = metricsList.reduce((acc, m) => {
            const achievement = m.target_value > 0
              ? Math.min((m.actual_value / m.target_value) * 100, 100)
              : 0;
            return acc + achievement;
          }, 0);
          return Math.round(sum / metricsList.length);
        };

        const strategic = calcAverage(strategicMetrics);
        const tactical = calcAverage(tacticalMetrics);
        const operational = calcAverage(operationalMetrics);
        
        // Gewichteter Durchschnitt (Strategic 40%, Tactical 30%, Operational 30%)
        const total = Math.round((strategic * 0.4) + (tactical * 0.3) + (operational * 0.3));

        console.log('🎯 Health Hub Scores berechnet:', {
          strategic,
          tactical,
          operational,
          total,
          metricsCount: metrics.length,
          strategicCount: strategicMetrics.length,
          tacticalCount: tacticalMetrics.length,
          operationalCount: operationalMetrics.length
        });

        setStrategicScore(strategic);
        setTacticalScore(tactical);
        setOperationalScore(operational);
        setTotalImpactScore(total);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Metriken:', error);
      console.log('⚠️  Fallback auf Mock-Daten (Supabase nicht verfügbar)');
      
      // FALLBACK: Setze Demo-Werte wenn Supabase nicht verfügbar
      setInstanceMetrics([]);
      
      // Demo Completion Werte für die Milestones
      const demoCompletions: MilestoneCompletion = {
        '1': 65,
        '2': 72,
        '3': 58,
        '4': 81,
        '5': 77,
        '6': 84,
        '7': 91,
        '8': 68,
        '9': 73,
        '10': 79
      };
      setMilestoneCompletions(demoCompletions);
      
      // Demo Health Hub Scores (wie in den Mock-Daten)
      setStrategicScore(52);
      setTacticalScore(81);
      setOperationalScore(89);
      setTotalImpactScore(75);
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [selectedPortfolio]);


  // Lade Metriken wenn Portfolio wechselt
  useEffect(() => {
    loadMetricsForPortfolio();
  }, [loadMetricsForPortfolio]);

  // 2. Kreis-Layout Logik (Mathe für das Value Engine)
  const nodes = useMemo(() => {
    const radius = 450; // Größerer Radius für mehr Platz
    const centerX = 500; // Zentrum des Diagramms X
    const centerY = 400; // Zentrum des Diagramms Y
  
    // Impact Cycle Nodes (auf dem Kreisumfang)
    const impactNodes = IMPACT_CYCLE_DATA.map((item, index) => {
      // Winkel berechnen (Start bei -90 Grad, damit der erste Knoten oben ist)
      const angle = (index / IMPACT_CYCLE_DATA.length) * 2 * Math.PI - Math.PI / 2;
      
      // Position auf dem Kreisumfang
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
  
      // Hole Completion-Rate für diesen Milestone
      const completion = milestoneCompletions[item.id] || 0;

      return {
        id: item.id,
        type: 'impactNode', // Verwende Custom Node Type
        // Wir ziehen 110 (halbe Breite) und 50 (halbe geschätzte Höhe) ab, 
        // damit der KNOTEN-MITTELPUNKT auf dem Kreis liegt
        position: { x: x - 110, y: y - 40 }, 
        data: { 
          label: item.matrix[lang][mode],
          completion,
          mode,
          stepNumber: parseInt(item.id)
        },
      };
    });

    // Health Hub Node (in der Mitte) - NOCH GRÖßER (500x500)!
    const healthHubNode = {
      id: 'health-hub',
      type: 'healthHub',
      position: { x: centerX - 250, y: centerY - 250 }, // Zentriert (500x500 Komponente)
      data: {
        strategicScore,
        tacticalScore,
        operationalScore,
        totalImpactScore,
        portfolioName: selectedPortfolio?.name || 'Portfolio'
      },
      draggable: false,
      selectable: false,
    };

    return [...impactNodes, healthHubNode];
  }, [lang, mode, milestoneCompletions, strategicScore, tacticalScore, operationalScore, totalImpactScore, selectedPortfolio]);

  const edges = IMPACT_CYCLE_DATA.map((item, index) => ({
    id: `e${index}`,
    source: item.id,
    target: IMPACT_CYCLE_DATA[(index + 1) % IMPACT_CYCLE_DATA.length].id,
    animated: true,
    style: { stroke: '#64748b' },
  }));

  // Handler: Knoten-Klick
  const handleNodeClick = (_event: React.MouseEvent, node: any) => {
    setSelectedNode(node.id);
  };

  // Handler: Hintergrund-Klick (schließt Sidebar)
  const handlePaneClick = () => {
    setSelectedNode(null);
  };

  // Handler: Notizen speichern
  const handleSaveNotes = () => {
    if (!selectedNode) return;

    // Berechne Durchschnitt aller Erreichungsgrade für diesen Milestone
    const selectedKPIValues = selectedKPIs.map(kpiId => calculateKPIAchievement(kpiId));
    const averageCompletion = selectedKPIValues.length > 0
      ? selectedKPIValues.reduce((sum, val) => sum + val, 0) / selectedKPIValues.length
      : 0;

    // Speichere Completion-Rate für diesen Milestone
    setMilestoneCompletions(prev => ({
      ...prev,
      [selectedNode]: Math.round(averageCompletion)
    }));

    // TODO: Aktualisiere Health Scores in Echtzeit nach Speichern
    // TODO: Hier später Speichern in Supabase oder localStorage
    console.log('KPI-Werte gespeichert für Prozess', selectedNode);
    console.log('Ausgewählte KPIs:', selectedKPIs);
    console.log('KPI-Werte:', kpiValues);
    console.log('Durchschnittlicher Erreichungsgrad:', Math.round(averageCompletion) + '%');
    
    const kpiCount = selectedKPIs.length;
    const completionText = Math.round(averageCompletion);
    const successMessage = lang === 'de' 
      ? `Notizen gespeichert! ${kpiCount} KPI(s), Erreichung: ${completionText}%`
      : lang === 'en'
      ? `Notes saved! ${kpiCount} KPI(s), Achievement: ${completionText}%`
      : `¡Notas guardadas! ${kpiCount} KPI(s), Logro: ${completionText}%`;
    
    alert(successMessage);
  };


  // Aktuell ausgewählten Milestone finden
  const selectedMilestone = selectedNode 
    ? IMPACT_CYCLE_DATA.find(item => item.id === selectedNode)
    : null;

  // KPIs für den aktuell ausgewählten Schritt filtern
  const relevantKPIs = useMemo(() => {
    if (!selectedNode) return [];
    const stepNumber = parseInt(selectedNode);
    return kpiLibrary.kpis.filter((kpi: any) => kpi.step_number === stepNumber);
  }, [selectedNode]);

  // KPI-Auswahl Toggle
  const toggleKPI = (kpiId: string) => {
    setSelectedKPIs(prev => {
      const isSelected = prev.includes(kpiId);
      if (isSelected) {
        // Entfernen: Auch KPI-Werte löschen
        setKpiValues(prevValues => prevValues.filter(v => v.kpiId !== kpiId));
        return prev.filter(id => id !== kpiId);
      } else {
        // Hinzufügen: Initialisiere KPI-Werte
        setKpiValues(prevValues => [...prevValues, { kpiId, targetValue: 0, currentValue: 0 }]);
        return [...prev, kpiId];
      }
    });
  };

  // KPI Target Value Update
  const updateKPITargetValue = (kpiId: string, value: number) => {
    setKpiValues(prev => 
      prev.map(kpi => 
        kpi.kpiId === kpiId ? { ...kpi, targetValue: value } : kpi
      )
    );
  };

  // KPI Current Value Update
  const updateKPICurrentValue = (kpiId: string, value: number) => {
    setKpiValues(prev => 
      prev.map(kpi => 
        kpi.kpiId === kpiId ? { ...kpi, currentValue: value } : kpi
      )
    );
  };

  // Berechne Erreichungsgrad für eine KPI (0-100%)
  const calculateKPIAchievement = (kpiId: string): number => {
    const kpiValue = kpiValues.find(v => v.kpiId === kpiId);
    if (!kpiValue || kpiValue.targetValue === 0) return 0;
    const achievement = (kpiValue.currentValue / kpiValue.targetValue) * 100;
    return Math.min(Math.max(achievement, 0), 100); // Clamp zwischen 0-100
  };

  // Hole KPI-Wert
  const getKPIValue = (kpiId: string): KPIValue | undefined => {
    return kpiValues.find(v => v.kpiId === kpiId);
  };


  // HYDRATION FIX: Loading State bis Client-State geladen ist
  if (!mounted) {
    return (
      <div className="w-full h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-slate-400 text-sm">Loading PMO Impact Cycle...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-slate-900 text-white flex flex-col overflow-hidden" suppressHydrationWarning>
      {/* NEW: GitHub-Style Header */}
      <GitHubStyleHeader
        brandName="PMO Impact Cycle"
        companyName="Acme Corp"
        currentView={view}
        onViewChange={(newView) => setView(newView)}
        language={lang.toUpperCase() as 'DE' | 'EN' | 'ES'}
        onLanguageChange={(newLang) => setLang(newLang.toLowerCase() as 'de' | 'en' | 'es')}
        mode={mode}
        onModeChange={setMode}
        showSearch={false}
        onAIAssistantClick={() => setIsChatOpen(true)}
      />

      {/* MOBILE HEADER - Keep existing for now */}
      <header className="lg:hidden bg-slate-800 border-b border-slate-700">
        {/* Mobile Header - Ultra Compact */}
        <div className="sm:hidden p-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-400">PMO Impact Cycle</h1>
          <MobileMenu 
            mode={mode} 
            onModeChange={setMode}
            language={lang.toUpperCase() as 'DE' | 'EN' | 'ES'}
            onLanguageChange={(newLang) => setLang(newLang.toLowerCase() as 'de' | 'en' | 'es')}
            additionalContent={
              <>
                {/* AI Assistant im Mobile Menu */}
                <button
                  onClick={() => {
                    setIsChatOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 rounded-lg transition-all shadow-lg animate-gradient text-left"
                >
                  <MessageSquare size={20} />
                  <div>
                    <div className="font-bold">AI Assistant</div>
                    <div className="text-xs opacity-75">PMO Knowledge Helper</div>
                  </div>
                </button>
              </>
            }
          />
        </div>
      </header>

      {/* Diagramm-Bereich */}
      <main className="flex-1 relative overflow-hidden">
        {view === 'cycle' && (
          <ReactFlow 
            nodes={nodes} 
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            proOptions={{ hideAttribution: true }}
          >
          <Background color="#334155" gap={20} />
          <Controls />
        </ReactFlow>
        )}

        {view === 'projects' && selectedPortfolio && (
          <PortfolioProjectList
            portfolioId={selectedPortfolio.id}
            portfolioName={selectedPortfolio.name}
            lang={lang}
            mode={mode}
            onProjectSelect={(projectId) => {
              console.log('Project selected:', projectId);
              // TODO: Switch to cycle view and load project-specific data
              // setView('cycle');
              // loadProjectImpactCycle(projectId);
            }}
          />
        )}

        {/* Sidebar - Slide-In von rechts */}
        <aside 
          className={`
            fixed right-0 top-0 h-full 
            w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 
            sm:min-w-[320px] max-w-full sm:max-w-[90vw]
            bg-slate-800 border-l border-slate-700
            shadow-2xl
            transition-transform duration-300 ease-in-out
            ${selectedNode ? 'translate-x-0' : 'translate-x-full'}
            z-50
            flex flex-col
            overflow-hidden
          `}
        >
          {selectedMilestone && (
            <>
              {/* Sidebar Header */}
              <div className="p-4 sm:p-6 border-b border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-blue-400">
                    {helpers.getMilestoneTitle(selectedMilestone.id, lang)}
                  </h2>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-slate-400 hover:text-white text-2xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {selectedMilestone.internal_code}
                </p>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Aktuelle Beschreibung */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
                    {mode === 'colloquial' ? (
                      lang === 'de' ? 'Beschreibung' : lang === 'en' ? 'Description' : 'Descripción'
                    ) : (
                      lang === 'de' ? 'Value Proposition' : lang === 'en' ? 'Value Proposition' : 'Propuesta de Valor'
                    )}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selectedMilestone.matrix[lang][mode]}
                  </p>
                </div>

                {/* Das große Ziel */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                      {lang === 'de' ? 'Das große Ziel' : lang === 'en' ? 'The Big Goal' : 'El Gran Objetivo'}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-600">
                    {mode === 'colloquial' 
                      ? (lang === 'de' ? 'Dieser Prozess hilft, das PMO bekannter zu machen und Vertrauen aufzubauen.' 
                         : lang === 'en' ? 'This process helps make the PMO better known and build trust.' 
                         : 'Este proceso ayuda a dar a conocer mejor la PMO y generar confianza.')
                      : (lang === 'de' ? 'Strategische Positionierung und Etablierung der PMO-Wertschöpfung im Unternehmenskontext.' 
                         : lang === 'en' ? 'Strategic positioning and establishment of PMO value creation in the corporate context.' 
                         : 'Posicionamiento estratégico y establecimiento de la creación de valor de PMO en el contexto corporativo.')
                    }
                  </p>
                </div>

                {/* PMO-IMPACT Sektion */}
                <div className="mb-6 border-t border-slate-700 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      {lang === 'de' ? 'PMO-Impact' : lang === 'en' ? 'PMO Impact' : 'Impacto PMO'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {mode === 'colloquial'
                      ? (lang === 'de' ? 'Diese Portfolio-KPIs profitieren von diesem Prozess:' 
                         : lang === 'en' ? 'These portfolio KPIs benefit from this process:' 
                         : 'Estos KPIs de cartera se benefician de este proceso:')
                      : (lang === 'de' ? 'Strategische Impact-Metriken auf Portfolio-Ebene:' 
                         : lang === 'en' ? 'Strategic impact metrics at portfolio level:' 
                         : 'Métricas de impacto estratégico a nivel de cartera:')
                    }
                  </p>
                  
                  {relevantKPIs.length > 0 ? (
                    <div className="space-y-3">
                      {relevantKPIs.map((kpi: any) => {
                        const isSelected = selectedKPIs.includes(kpi.id);
                        const kpiValue = getKPIValue(kpi.id);
                        const achievement = isSelected ? calculateKPIAchievement(kpi.id) : 0;

                        return (
                          <div 
                            key={kpi.id}
                            className={`
                              p-3 rounded-lg border transition-all duration-200
                              ${isSelected 
                                ? 'bg-slate-700 border-emerald-500' 
                                : 'bg-slate-900 border-slate-600 hover:border-slate-500 cursor-pointer'}
                            `}
                            onClick={!isSelected ? () => toggleKPI(kpi.id) : undefined}
                          >
                            <div className="flex items-start gap-3">
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleKPI(kpi.id)}
                                className="mt-1 w-4 h-4 rounded border-slate-500 text-emerald-500 
                                         focus:ring-2 focus:ring-emerald-500 focus:ring-offset-slate-900"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {helpers.getKPIIcon(kpi.kpi_type)}
                                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                                    {helpers.getKPITypeLabel(kpi.kpi_type, lang)}
                                  </span>
                                </div>
                                <h4 className="text-sm font-semibold text-slate-200 mb-1">
                                  {kpi.title_matrix?.[lang]?.[mode] || kpi.title}
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-1">
                                  {kpi.matrix[lang][mode]}
                                </p>
                                <span className="text-xs text-slate-500 font-mono">
                                  {kpi.unit}
                                </span>

                                {/* Eingabefelder für ausgewählte KPIs */}
                                {isSelected && kpiValue && (
                                  <div className="mt-3 space-y-2 border-t border-slate-600 pt-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <label className="text-xs text-slate-400 block mb-1">
                                          {lang === 'de' ? 'Zielwert' : lang === 'en' ? 'Target' : 'Objetivo'}
                                        </label>
                                        <input 
                                          type="number"
                                          value={kpiValue.targetValue || ''}
                                          onChange={(e) => updateKPITargetValue(kpi.id, parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded
                                                   text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                      <div>
                                        <label className="text-xs text-slate-400 block mb-1">
                                          {lang === 'de' ? 'Aktuell' : lang === 'en' ? 'Current' : 'Actual'}
                                        </label>
                                        <input 
                                          type="number"
                                          value={kpiValue.currentValue || ''}
                                          onChange={(e) => updateKPICurrentValue(kpi.id, parseFloat(e.target.value) || 0)}
                                          placeholder="0"
                                          className="w-full px-2 py-1 bg-slate-800 border border-slate-600 rounded
                                                   text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                      </div>
                                    </div>
                                    
                                    {/* Erreichungsgrad-Anzeige */}
                                    {kpiValue.targetValue > 0 && (
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">
                                          {lang === 'de' ? 'Erreichungsgrad' : lang === 'en' ? 'Achievement' : 'Logro'}:
                                        </span>
                                        <div className="flex items-center gap-2">
                                          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                              className={`h-full transition-all duration-300 ${
                                                achievement >= 80 ? 'bg-green-500' : 
                                                achievement >= 50 ? 'bg-yellow-500' : 
                                                'bg-red-500'
                                              }`}
                                              style={{ width: `${Math.min(achievement, 100)}%` }}
                                            />
                                          </div>
                                          <span className={`text-xs font-bold ${
                                            achievement >= 80 ? 'text-green-400' : 
                                            achievement >= 50 ? 'text-yellow-400' : 
                                            'text-red-400'
                                          }`}>
                                            {Math.round(achievement)}%
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      {lang === 'de' ? 'Keine KPIs verfügbar' : lang === 'en' ? 'No KPIs available' : 'No hay KPIs disponibles'}
                    </p>
                  )}
                </div>

                {/* Button: Prozess starten & Metriken festlegen */}
                <div className="mb-4 border-t border-slate-700 pt-6">
                  <a 
                    href={`/preview-metrics?process=${selectedNode}`}
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 
                             hover:from-emerald-700 hover:via-green-700 hover:to-emerald-700
                             text-white font-semibold rounded-lg
                             transition-all duration-200
                             flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/30"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                      />
                    </svg>
                    {lang === 'de' ? 'Prozess starten & Metriken festlegen' 
                     : lang === 'en' ? 'Start Process & Define Metrics' 
                     : 'Iniciar Proceso y Definir Métricas'}
                  </a>
                  <p className="text-xs text-slate-500 mt-2 text-center italic">
                    {mode === 'colloquial'
                      ? (lang === 'de' ? 'Wähle aus 50 Metriken, die zu deinem PMO passen' 
                         : lang === 'en' ? 'Choose from 50 metrics that fit your PMO' 
                         : 'Elige entre 50 métricas que se adapten a tu PMO')
                      : (lang === 'de' ? 'Law of Requisite Variety: Flexible Metrik-Selektion' 
                         : lang === 'en' ? 'Law of Requisite Variety: Flexible metric selection' 
                         : 'Ley de Variedad Requerida: Selección flexible de métricas')
                    }
                  </p>
                </div>

                {/* Speichern-Button mit dynamischem Label */}
                <button
                  onClick={handleSaveNotes}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-lg
                           transition-colors duration-200
                           flex items-center justify-center gap-2"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  {helpers.getLabel('save_button', lang, mode)}
                </button>

                {/* Zusätzliche Infos */}
                <div className="mt-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">
                    {lang === 'de' ? 'Aktuelle Ansicht' : lang === 'en' ? 'Current View' : 'Vista Actual'}
                  </h4>
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>{lang === 'de' ? 'Sprache:' : lang === 'en' ? 'Language:' : 'Idioma:'}</span>
                      <span className="font-semibold">{lang.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === 'de' ? 'Modus:' : lang === 'en' ? 'Mode:' : 'Modo:'}</span>
                      <span className="font-semibold">
                        {mode === 'colloquial' 
                          ? (lang === 'de' ? 'Normal' : lang === 'en' ? 'Normal' : 'Normal')
                          : 'Management'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </main>

      {/* Chatbot Interface */}
      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}