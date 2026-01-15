'use client';

import { Target, Zap, Package, Award, MessageSquare, Settings } from 'lucide-react';
import { getCategoryWeights, type MetricCategory } from '../utils/scoreCalculation';

type Language = 'de' | 'en' | 'es';

interface CategoryScore {
  category: MetricCategory;
  score: number;
  weight: number;
  points: number;
}

interface ScoreBreakdownProps {
  categoryScores: Record<MetricCategory, number>;
  overallScore: number;
  language: Language;
  onAdjustWeights: () => void;
}

export default function ScoreBreakdown({ categoryScores, overallScore, language, onAdjustWeights }: ScoreBreakdownProps) {
  const weights = getCategoryWeights();

  // Calculate points contribution for each category
  const breakdown: CategoryScore[] = [
    { category: 'input', score: categoryScores.input || 0, weight: weights.input, points: (categoryScores.input || 0) * weights.input },
    { category: 'process', score: categoryScores.process || 0, weight: weights.process, points: (categoryScores.process || 0) * weights.process },
    { category: 'output', score: categoryScores.output || 0, weight: weights.output, points: (categoryScores.output || 0) * weights.output },
    { category: 'outcome', score: categoryScores.outcome || 0, weight: weights.outcome, points: (categoryScores.outcome || 0) * weights.outcome },
    { category: 'feedback', score: categoryScores.feedback || 0, weight: weights.feedback, points: (categoryScores.feedback || 0) * weights.feedback },
  ];

  const totalPoints = breakdown.reduce((sum, item) => sum + item.points, 0);

  // Helper: Get Category Icon
  function getCategoryIconComponent(category: MetricCategory) {
    switch (category) {
      case 'input': return <Target size={16} className="text-blue-400" />;
      case 'process': return <Zap size={16} className="text-purple-400" />;
      case 'output': return <Package size={16} className="text-green-400" />;
      case 'outcome': return <Award size={16} className="text-yellow-400" />;
      case 'feedback': return <MessageSquare size={16} className="text-pink-400" />;
    }
  }

  // Helper: Get Category Name
  function getCategoryName(category: MetricCategory): string {
    const names = {
      de: {
        input: 'Input',
        process: 'Prozess',
        output: 'Output',
        outcome: 'Outcome',
        feedback: 'Feedback',
      },
      es: {
        input: 'Entrada',
        process: 'Proceso',
        output: 'Salida',
        outcome: 'Resultado',
        feedback: 'Retroalimentación',
      },
      en: {
        input: 'Input',
        process: 'Process',
        output: 'Output',
        outcome: 'Outcome',
        feedback: 'Feedback',
      },
    };
    return names[language][category];
  }

  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          📊 {language === 'de' ? 'Score-Berechnung' :
              language === 'es' ? 'Cálculo de Puntuación' :
              'Score Calculation'}
        </h3>
        <button
          onClick={onAdjustWeights}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition"
          title={language === 'de' ? 'Gewichtungen anpassen' :
                 language === 'es' ? 'Ajustar pesos' :
                 'Adjust Weights'}
        >
          <Settings size={16} />
          <span className="hidden sm:inline">
            {language === 'de' ? 'Anpassen' :
             language === 'es' ? 'Ajustar' :
             'Adjust'}
          </span>
        </button>
      </div>

      {/* Overall Score */}
      <div className="bg-slate-900/50 rounded-lg p-3 mb-4 border border-slate-700">
        <div className="text-sm text-slate-400 mb-1">
          {language === 'de' ? 'Portfolio Score:' :
           language === 'es' ? 'Puntuación del Portafolio:' :
           'Portfolio Score:'}
        </div>
        <div className="text-3xl font-bold text-blue-400">
          {overallScore}%
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-2">
        {breakdown.map((item) => {
          const isHighest = item.weight === Math.max(...breakdown.map(b => b.weight));
          
          return (
            <div
              key={item.category}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-lg transition ${
                isHighest ? 'bg-yellow-900/20 border border-yellow-700/50' : 'bg-slate-900/30'
              }`}
            >
              <div className="flex items-center gap-2 flex-1">
                {getCategoryIconComponent(item.category)}
                <span className="text-sm font-medium text-slate-300">
                  {getCategoryName(item.category)}:
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-white font-semibold">
                  {item.score}%
                </span>
                <span className="text-slate-500">×</span>
                <span className="text-slate-400">
                  {Math.round(item.weight * 100)}%
                </span>
                <span className="text-slate-500">=</span>
                <span className={`font-bold w-16 text-right ${
                  isHighest ? 'text-yellow-400' : 'text-blue-400'
                }`}>
                  {item.points.toFixed(1)} {language === 'de' ? 'Pkt' :
                                            language === 'es' ? 'pts' :
                                            'pts'}
                </span>
                {isHighest && <span className="text-yellow-400">⭐</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            {language === 'de' ? 'Gesamt:' :
             language === 'es' ? 'Total:' :
             'Total:'}
          </span>
          <span className="text-xl font-bold text-blue-400">
            {totalPoints.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-4 text-xs text-slate-500 bg-slate-900/30 rounded p-2">
        {language === 'de' ? 
          '💡 Outcome hat die höchste Gewichtung (35%), da es den direkten Business Impact misst.' :
         language === 'es' ? 
          '💡 Resultado tiene el mayor peso (35%) porque mide el impacto empresarial directo.' :
          '💡 Outcome has the highest weight (35%) as it measures direct business impact.'}
      </div>
    </div>
  );
}

