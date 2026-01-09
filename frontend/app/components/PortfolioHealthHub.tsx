"use client";

// Portfolio Health Hub - Zentrale Visualisierung
// Zeigt aggregierte Strategic, Tactical und Operational Scores
// mit konzentrischen Ringen in der Mitte des Impact Cycles

import React from 'react';

interface PortfolioHealthHubProps {
  strategicScore: number;   // 0-100
  tacticalScore: number;    // 0-100
  operationalScore: number; // 0-100
  totalImpactScore: number; // 0-100
  portfolioName?: string;
}

export default function PortfolioHealthHub({
  strategicScore,
  tacticalScore,
  operationalScore,
  totalImpactScore,
  portfolioName = 'Portfolio'
}: PortfolioHealthHubProps) {
  
  // Pulsieren bei hoher Performance (> 90%)
  const isHighPerformance = totalImpactScore > 90;

  // Ring-Konfiguration (von innen nach außen) - NOCH GRÖßER!
  const rings = [
    {
      id: 'operational',
      label: 'Operational',
      shortLabel: 'OPS',
      score: operationalScore,
      color: '#10b981', // Grün
      glowColor: 'rgba(16, 185, 129, 0.4)',
      radius: 90, // NOCH größer: war 75
      strokeWidth: 35
    },
    {
      id: 'tactical',
      label: 'Tactical',
      shortLabel: 'TAC',
      score: tacticalScore,
      color: '#3b82f6', // Blau
      glowColor: 'rgba(59, 130, 246, 0.4)',
      radius: 133, // NOCH größer: war 118
      strokeWidth: 35
    },
    {
      id: 'strategic',
      label: 'Strategic',
      shortLabel: 'STR',
      score: strategicScore,
      color: '#f59e0b', // Gold/Gelb
      glowColor: 'rgba(245, 158, 11, 0.4)',
      radius: 176, // NOCH größer: war 161
      strokeWidth: 35
    }
  ];

  // Berechne SVG Pfad für einen Ring-Segment
  const calculateArc = (radius: number, score: number) => {
    const circumference = 2 * Math.PI * radius;
    const dashArray = circumference;
    const dashOffset = circumference - (circumference * score) / 100;
    return { dashArray, dashOffset };
  };

  // Center für SVG - GRÖßERE KOMPONENTE
  const centerX = 250;
  const centerY = 250;

  return (
    <div 
      className={`relative ${isHighPerformance ? 'animate-pulse-glow-center' : ''}`}
      style={{ width: 500, height: 500 }}
    >
      {/* SVG Container für die Ringe */}
      <svg 
        width="500" 
        height="500" 
        className="absolute inset-0"
      >
        {/* Definitionen für Text-Pfade */}
        <defs>
          {rings.map((ring) => (
            <path
              key={`text-path-${ring.id}`}
              id={`textPath-${ring.id}`}
              d={`
                M ${centerX}, ${centerY - ring.radius}
                A ${ring.radius} ${ring.radius} 0 1 1 ${centerX - 0.001} ${centerY - ring.radius}
              `}
              fill="none"
            />
          ))}
        </defs>

        {/* Background Circles (Grau) mit Glow - rotiert um -90° */}
        <g transform={`rotate(-90 ${centerX} ${centerY})`}>
          {rings.map((ring) => (
            <g key={`bg-group-${ring.id}`}>
              {/* Outer Glow */}
              <circle
                cx={centerX}
                cy={centerY}
                r={ring.radius}
                fill="none"
                stroke={ring.glowColor}
                strokeWidth={ring.strokeWidth + 6}
                opacity="0.2"
                filter="blur(10px)"
              />
              {/* Hintergrund */}
              <circle
                cx={centerX}
                cy={centerY}
                r={ring.radius}
                fill="none"
                stroke="rgba(100, 116, 139, 0.15)"
                strokeWidth={ring.strokeWidth}
              />
            </g>
          ))}

          {/* Progress Circles (Colored) mit stärkerem Glow */}
          {rings.map((ring) => {
            const { dashArray, dashOffset } = calculateArc(ring.radius, ring.score);
            return (
              <g key={`progress-group-${ring.id}`}>
                {/* Outer Glow */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.glowColor}
                  strokeWidth={ring.strokeWidth + 8}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  opacity="0.6"
                  filter="blur(15px)"
                />
                {/* Main Progress Ring */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={ring.radius}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: `drop-shadow(0 0 12px ${ring.color}AA)`
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Gekrümmter Text entlang der Ringe - WEISS mit farbigem Glow */}
        {rings.map((ring) => {
          // Text-Inhalt: Label und Prozent kombiniert
          const textContent = `${ring.shortLabel}  ${Math.round(ring.score)}%`;
          
          return (
            <text
              key={`text-${ring.id}`}
              fill="#ffffff" // WEISS statt Ringfarbe
              fontSize="20" // Etwas größer
              fontWeight="900"
              letterSpacing="3"
              style={{
                filter: `drop-shadow(0 0 10px ${ring.color}) drop-shadow(0 0 4px ${ring.color})`
              }}
            >
              <textPath
                href={`#textPath-${ring.id}`}
                startOffset="25%" // Position auf dem Kreis (oben rechts)
                textAnchor="middle"
              >
                {textContent}
              </textPath>
            </text>
          );
        })}
      </svg>

      {/* Zentrale Anzeige */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Portfolio Name - GANZ OBEN mit Abstand zum Ring */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-300 uppercase tracking-widest">
          {portfolioName}
        </div>

        {/* Total Impact Score - ZENTRUM in MAGENTA - NOCH KLEINER */}
        <div 
          className="text-5xl font-black transition-all duration-500"
          style={{ 
            color: '#ec4899', // Magenta/Pink
            textShadow: '0 0 25px #ec4899, 0 0 50px #ec4899AA',
            lineHeight: '1',
            marginTop: '0px' // Perfekt zentriert
          }}
        >
          {Math.round(totalImpactScore)}%
        </div>

        {/* Label - GANZ UNTEN mit Abstand zum Ring */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-extrabold text-slate-300 uppercase tracking-widest">
          Impact Score
        </div>
      </div>

      {/* Outer Glow Effect für High Performance */}
      {isHighPerformance && (
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
      )}

      {/* CSS Animation für Pulsieren */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}


