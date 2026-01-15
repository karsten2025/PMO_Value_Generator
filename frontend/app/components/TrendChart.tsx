'use client';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
type Language = 'de' | 'en' | 'es';

interface TrendDataPoint {
  date: string; // ISO date or formatted date
  score: number; // 0-100
  target?: number; // Optional target line
}

interface TrendChartProps {
  data: TrendDataPoint[];
  title: string;
  language: Language;
  height?: number;
  showTarget?: boolean;
  chartType?: 'line' | 'area';
}

/**
 * Trend Chart Komponente
 * 
 * Zeigt zeitliche Entwicklung von Scores als Line oder Area Chart
 */
export default function TrendChart({
  data,
  title,
  language,
  height = 300,
  showTarget = false,
  chartType = 'area'
}: TrendChartProps) {
  
  // Empty State
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-slate-300 mb-4">{title}</h4>
        <div className="flex items-center justify-center h-[200px] text-slate-500 text-sm">
          {language === 'de' ? 'Keine Daten verfügbar' :
           language === 'es' ? 'No hay datos disponibles' :
           'No data available'}
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const month = date.toLocaleDateString(
        language === 'de' ? 'de-DE' :
        language === 'es' ? 'es-ES' :
        'en-US',
        { month: 'short' }
      );
      const day = date.getDate();
      return `${day} ${month}`;
    } catch {
      return dateString;
    }
  };

  // Format data for chart
  const chartData = data.map(d => ({
    ...d,
    formattedDate: formatDate(d.date)
  }));

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-300 text-xs mb-1">{payload[0].payload.formattedDate}</p>
          <p className="text-blue-400 font-bold text-sm">
            Score: {payload[0].value}%
          </p>
          {showTarget && payload[1] && (
            <p className="text-green-400 font-bold text-sm">
              Target: {payload[1].value}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const Chart = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 sm:p-6">
      <h4 className="text-sm sm:text-base font-semibold text-slate-300 mb-4">{title}</h4>
      <ResponsiveContainer width="100%" height={height}>
        <Chart
          data={chartData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#64748b"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '11px' }}
            tick={{ fill: '#94a3b8' }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
            iconType="line"
          />
          <DataComponent
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={3}
            fill={chartType === 'area' ? "url(#scoreGradient)" : undefined}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name={language === 'de' ? 'Score' : language === 'es' ? 'Puntuación' : 'Score'}
          />
          {showTarget && (
            <Line
              type="monotone"
              dataKey="target"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name={language === 'de' ? 'Ziel' : language === 'es' ? 'Objetivo' : 'Target'}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}

