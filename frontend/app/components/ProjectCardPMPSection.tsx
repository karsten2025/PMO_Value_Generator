'use client';

// ============================================
// Project Card Component
// ============================================
// Zeigt Projekt-Info mit erweiterbarem PMP
// Berücksichtigt .cursorrules: 2x3 Matrix
// ============================================

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calendar, DollarSign, Users, MapPin, Target, Hammer, HelpCircle } from 'lucide-react';
import { ProjectManagementPlan, PMPUILabel, PMP_LABEL_KEYS } from '../types/pmp';
import { Language, Register, getMatrixLabel } from '../types/pmp';

interface ProjectCardPMPSectionProps {
  pmp: ProjectManagementPlan | null;
  labels: Record<string, PMPUILabel>; // Label lookup by key
  lang: Language;
  register: Register;
  onEdit?: () => void;
}

export function ProjectCardPMPSection({
  pmp,
  labels,
  lang,
  register,
  onEdit,
}: ProjectCardPMPSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!pmp) {
    return (
      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-center text-slate-400">
          <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">
            {lang === 'de' && 'Kein Projektmanagementplan vorhanden'}
            {lang === 'en' && 'No Project Management Plan available'}
            {lang === 'es' && 'No hay Plan de Gestión de Proyecto'}
          </p>
          {onEdit && (
            <button
              onClick={onEdit}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              {lang === 'de' && 'PMP erstellen'}
              {lang === 'en' && 'Create PMP'}
              {lang === 'es' && 'Crear PMP'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Helper: Get Label
  const getLabel = (key: string): string => {
    const label = labels[key];
    if (!label) return key;
    return getMatrixLabel(label.matrix_data, lang, register) || key;
  };

  // Helper: Format Currency
  const formatCurrency = (amount?: number, currency: string = '€'): string => {
    if (amount === undefined) return '—';
    return `${(amount / 1000).toFixed(1)}k${currency}`;
  };

  // Helper: Format Date Range
  const formatDateRange = (start?: string, end?: string): string => {
    if (!start || !end) return '—';
    const startDate = new Date(start);
    const endDate = new Date(end);
    const monthFormatter = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric' });
    return `${monthFormatter.format(startDate)} → ${monthFormatter.format(endDate)}`;
  };

  // Calculate Budget Percentage
  const budgetPercentage =
    pmp.budget?.total_budget && pmp.budget?.spent
      ? Math.round((pmp.budget.spent / pmp.budget.total_budget) * 100)
      : 0;

  return (
    <div className="space-y-3">
      {/* Toggle Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-slate-700 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-slate-200">
            {lang === 'de' && (register === 'colloquial' ? 'Projektplan (W-Fragen)' : 'Projektmanagementplan')}
            {lang === 'en' && (register === 'colloquial' ? 'Project Plan (W-Questions)' : 'Project Management Plan')}
            {lang === 'es' && (register === 'colloquial' ? 'Plan del Proyecto' : 'Plan de Gestión de Proyecto')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
            >
              {lang === 'de' && 'Bearbeiten'}
              {lang === 'en' && 'Edit'}
              {lang === 'es' && 'Editar'}
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          )}
        </div>
      </div>

      {/* Collapsed View: Quick Summary */}
      {!isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <DollarSign className="w-4 h-4" />
            <span>
              {formatCurrency(pmp.budget?.total_budget, pmp.budget?.currency || '€')}
              {pmp.budget?.spent && (
                <span className="ml-1 text-xs">({budgetPercentage}%)</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDateRange(pmp.timeline?.start_date, pmp.timeline?.end_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span>
              {pmp.team_structure?.owner_name || '—'}
              {pmp.team_structure?.team_members && ` +${pmp.team_structure.team_members.length}`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Hammer className="w-4 h-4" />
            <span className="capitalize">{pmp.methodology || '—'}</span>
          </div>
        </div>
      )}

      {/* Expanded View: Full W-Questions */}
      {isExpanded && (
        <div className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
          {/* WHY */}
          <WQuestionItem
            icon={<HelpCircle className="w-5 h-5 text-purple-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_WHY)}
            content={pmp.business_case_why}
            listItems={pmp.business_objectives}
          />

          {/* WHAT */}
          <WQuestionItem
            icon={<Target className="w-5 h-5 text-blue-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_WHAT)}
            content={pmp.scope_what}
            listItems={pmp.scope_deliverables}
          />

          {/* HOW */}
          <WQuestionItem
            icon={<Hammer className="w-5 h-5 text-green-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_HOW)}
            content={pmp.approach_how}
            badge={pmp.methodology ? <MethodologyBadge method={pmp.methodology} /> : undefined}
          />

          {/* WHO */}
          <WQuestionItem
            icon={<Users className="w-5 h-5 text-yellow-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_WHO)}
            content={
              pmp.team_structure?.owner_name
                ? `${
                    lang === 'de'
                      ? 'Projektleiter'
                      : lang === 'en'
                      ? 'Project Lead'
                      : 'Director del Proyecto'
                  }: ${pmp.team_structure.owner_name}`
                : undefined
            }
            listItems={pmp.team_structure?.team_members?.map(
              (tm) => `${tm.name} (${tm.role})`
            )}
          />

          {/* WHEN */}
          <WQuestionItem
            icon={<Calendar className="w-5 h-5 text-orange-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_WHEN)}
            content={formatDateRange(pmp.timeline?.start_date, pmp.timeline?.end_date)}
          />

          {/* WHERE */}
          <WQuestionItem
            icon={<MapPin className="w-5 h-5 text-red-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_WHERE)}
            listItems={[
              ...(pmp.locations || []),
              ...(pmp.affected_systems?.map((s) => `System: ${s}`) || []),
            ]}
          />

          {/* HOW MUCH */}
          <WQuestionItem
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            label={getLabel(PMP_LABEL_KEYS.W_QUESTION_HOW_MUCH)}
            content={
              pmp.budget?.total_budget
                ? `${formatCurrency(pmp.budget.total_budget, pmp.budget.currency)} ${
                    lang === 'de' ? 'Gesamt' : lang === 'en' ? 'Total' : 'Total'
                  }`
                : undefined
            }
            badge={
              pmp.budget?.spent ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budgetPercentage > 100
                          ? 'bg-red-500'
                          : budgetPercentage > 90
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 min-w-[60px]">
                    {formatCurrency(pmp.budget.spent, pmp.budget.currency)} ({budgetPercentage}%)
                  </span>
                </div>
              ) : undefined
            }
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// Sub-Component: W-Question Item
// ============================================

interface WQuestionItemProps {
  icon: React.ReactNode;
  label: string;
  content?: string;
  listItems?: string[];
  badge?: React.ReactNode;
}

function WQuestionItem({ icon, label, content, listItems, badge }: WQuestionItemProps) {
  const hasContent = content || (listItems && listItems.length > 0);

  if (!hasContent) {
    return (
      <div className="flex items-start gap-3 opacity-50">
        {icon}
        <div className="flex-1">
          <div className="font-semibold text-slate-300 text-sm">{label}</div>
          <div className="text-slate-500 text-sm italic mt-1">—</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {icon}
      <div className="flex-1">
        <div className="font-semibold text-slate-300 text-sm mb-1">{label}</div>
        {content && <div className="text-slate-400 text-sm">{content}</div>}
        {listItems && listItems.length > 0 && (
          <ul className="mt-2 space-y-1">
            {listItems.map((item, idx) => (
              <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        {badge && <div className="mt-2">{badge}</div>}
      </div>
    </div>
  );
}

// ============================================
// Sub-Component: Methodology Badge
// ============================================

function MethodologyBadge({ method }: { method: 'agile' | 'waterfall' | 'hybrid' }) {
  const colors = {
    agile: 'bg-green-500/20 text-green-400 border-green-500/30',
    waterfall: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    hybrid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${colors[method]}`}
    >
      {method.charAt(0).toUpperCase() + method.slice(1)}
    </span>
  );
}
