"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';

interface ImpactNodeProps {
  data: {
    label: string;
    completion: number; // 0-100
    mode: 'colloquial' | 'management';
    stepNumber: number;
  };
}

export default function ImpactNode({ data }: ImpactNodeProps) {
  const { label, completion, mode, stepNumber } = data;
  const hasProgress = completion > 0;
  const isLowProgress = hasProgress && completion < 50;
  const progressColor = completion >= 80 ? '#10b981' : completion >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div 
      className={`relative w-[220px] min-h-[80px] rounded-xl p-3 
                  ${mode === 'management' ? 'bg-slate-800' : 'bg-blue-600'}
                  ${isLowProgress ? 'animate-pulse-glow' : ''}
                  border-2 transition-all duration-300`}
      style={{
        borderColor: hasProgress ? progressColor : '#64748b',
        boxShadow: hasProgress 
          ? `0 0 20px ${progressColor}40, 0 4px 15px rgba(0,0,0,0.3)`
          : '0 4px 15px rgba(0,0,0,0.3)'
      }}
    >
      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Step Number Badge */}
        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-slate-900/50 
                        flex items-center justify-center text-xs font-bold text-slate-300">
          {stepNumber}
        </div>

        {/* Main Label */}
        <div className="text-center text-white text-[11px] leading-tight px-2 mt-2">
          {label}
        </div>

        {/* Management Mode: Large Percentage in Center */}
        {mode === 'management' && hasProgress && (
          <div className="text-center">
            <div 
              className="text-3xl font-bold"
              style={{ color: progressColor }}
            >
              {completion}%
            </div>
            <div className="text-[8px] text-slate-400 uppercase tracking-wide">
              Achievement
            </div>
          </div>
        )}

        {/* Colloquial Mode: Completion Badge */}
        {mode === 'colloquial' && hasProgress && (
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: progressColor,
              color: 'white',
              boxShadow: `0 2px 8px ${progressColor}80`
            }}
          >
            {completion}%
          </div>
        )}
      </div>

      {/* Progress Bar at Bottom */}
      {hasProgress && (
        <>
          {/* Circular Progress Ring (Background) */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={progressColor}
              strokeWidth="3"
              strokeDasharray={`${completion * 2.8}, 280`}
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                filter: `drop-shadow(0 0 4px ${progressColor})`
              }}
            />
          </svg>

          {/* Linear Progress Bar at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900/50 rounded-b-xl overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${completion}%`,
                backgroundColor: progressColor,
                boxShadow: `0 0 8px ${progressColor}`
              }}
            />
          </div>
        </>
      )}

      {/* Pulsing Glow Effect for Low Progress */}
      {isLowProgress && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none animate-pulse opacity-50"
          style={{
            background: `radial-gradient(circle, ${progressColor}20 0%, transparent 70%)`
          }}
        />
      )}
    </div>
  );
}

