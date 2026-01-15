/**
 * HealthHubNode Component
 * 
 * Wrapper für PortfolioHealthHub als ReactFlow Custom Node
 */

import React from 'react';
import PortfolioHealthHub from './PortfolioHealthHub';

interface HealthHubNodeProps {
  data: {
    strategicScore: number;
    tacticalScore: number;
    operationalScore: number;
    totalImpactScore: number;
    portfolioName: string;
  };
}

export default function HealthHubNode({ data }: HealthHubNodeProps) {
  return (
    <div className="health-hub-wrapper">
      <PortfolioHealthHub
        strategicScore={data.strategicScore}
        tacticalScore={data.tacticalScore}
        operationalScore={data.operationalScore}
        totalImpactScore={data.totalImpactScore}
        portfolioName={data.portfolioName}
      />
    </div>
  );
}


