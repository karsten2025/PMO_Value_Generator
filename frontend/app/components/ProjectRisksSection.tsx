'use client';

// ============================================
// Project Risks & Issues Component
// ============================================
// Risks & Issues Tracking mit Risk Score
// Berücksichtigt .cursorrules: 2x3 Matrix, Responsive Design
// ============================================

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  CheckCircle2,
  Shield,
} from 'lucide-react';
import { ProjectRisk, PMPUILabel, calculateRiskScore, getRiskColor } from '../types/pmp';
import { Language, Register, getMatrixLabel } from '../types/pmp';

interface ProjectRisksSectionProps {
  project_id: string;
  risks: ProjectRisk[];
  labels: Record<string, PMPUILabel>;
  lang: Language;
  register: Register;
  onAdd?: () => void;
  onEdit?: (risk: ProjectRisk) => void;
  onDelete?: (riskId: string) => void;
  isEditable?: boolean;
}

export function ProjectRisksSection({
  project_id,
  risks,
  labels,
  lang,
  register,
  onAdd,
  onEdit,
  onDelete,
  isEditable = true,
}: ProjectRisksSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRisk, setEditingRisk] = useState<ProjectRisk | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'risk' | 'issue'>('all');

  // Get Label Helper
  const getLabel = (key: string): string => {
    const label = labels[key];
    if (!label) return key;
    return getMatrixLabel(label.matrix_data, lang, register) || key;
  };

  // Filter Risks/Issues
  const filteredRisks =
    filterType === 'all' ? risks : risks.filter((r) => r.type === filterType);

  // Sort: Open first, then by risk score
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (a.status === 'open' && b.status !== 'open') return -1;
    if (a.status !== 'open' && b.status === 'open') return 1;
    return (b.risk_score || 0) - (a.risk_score || 0);
  });

  // Stats
  const openRisks = risks.filter((r) => r.type === 'risk' && r.status === 'open').length;
  const openIssues = risks.filter((r) => r.type === 'issue' && r.status === 'open').length;
  const highRisks = risks.filter((r) => (r.risk_score || 0) >= 7 && r.status === 'open').length;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-slate-700 transition-colors group cursor-pointer"
      >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-slate-200">
              {lang === 'de' && 'Risiken & Handlungsbedarf'}
              {lang === 'en' && 'Risks & Action Items'}
              {lang === 'es' && 'Riesgos y Acciones'}
            </span>
          <div className="flex items-center gap-2 text-xs">
            {highRisks > 0 && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                {highRisks} High
              </span>
            )}
            <span className="text-slate-400">({risks.length})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {lang === 'de' && 'Hinzufügen'}
              {lang === 'en' && 'Add'}
              {lang === 'es' && 'Agregar'}
            </button>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
          )}
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="space-y-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'de' && 'Alle'}
              {lang === 'en' && 'All'}
              {lang === 'es' && 'Todos'} ({risks.length})
            </button>
            <button
              onClick={() => setFilterType('risk')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'risk'
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'de' && 'Risiken'}
              {lang === 'en' && 'Risks'}
              {lang === 'es' && 'Riesgos'} ({openRisks})
            </button>
            <button
              onClick={() => setFilterType('issue')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'issue'
                  ? 'bg-slate-700 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'de' && 'Handlungsbedarf'}
              {lang === 'en' && 'Action Items'}
              {lang === 'es' && 'Acciones'} ({openIssues})
            </button>
          </div>

          {/* Risks List */}
          <div className="space-y-2">
            {sortedRisks.length === 0 ? (
              <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50 text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-600/50" />
                <p className="text-slate-500 text-sm">
                  {lang === 'de' && 'Keine offenen Risiken oder Handlungsbedarf'}
                  {lang === 'en' && 'No open risks or action items'}
                  {lang === 'es' && 'Sin riesgos o acciones abiertas'}
                </p>
              </div>
            ) : (
              sortedRisks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  labels={labels}
                  lang={lang}
                  register={register}
                  onEdit={
                    isEditable && onEdit
                      ? () => {
                          setEditingRisk(risk);
                        }
                      : undefined
                  }
                  onDelete={isEditable && onDelete ? () => onDelete(risk.id) : undefined}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingRisk) && (
        <RiskModal
          projectId={project_id}
          risk={editingRisk}
          lang={lang}
          onClose={() => {
            setShowAddModal(false);
            setEditingRisk(null);
          }}
          onSave={(risk) => {
            if (editingRisk && onEdit) {
              onEdit(risk);
            } else if (onAdd) {
              onAdd();
            }
            setShowAddModal(false);
            setEditingRisk(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Sub-Component: Risk Card
// ============================================

interface RiskCardProps {
  risk: ProjectRisk;
  labels: Record<string, PMPUILabel>;
  lang: Language;
  register: Register;
  onEdit?: () => void;
  onDelete?: () => void;
}

function RiskCard({ risk, labels, lang, register, onEdit, onDelete }: RiskCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const riskColor = getRiskColor(risk.risk_score || 1);
  const colorClasses: Record<string, string> = {
    red: 'bg-red-500/20 border-red-500/40 text-red-300',
    yellow: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
    green: 'bg-green-500/20 border-green-500/40 text-green-300',
  };

  const getStatusIcon = () => {
    switch (risk.status) {
      case 'closed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'mitigated':
        return <Shield className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getLabel = (key: string): string => {
    const label = labels[key];
    if (!label) return key;
    return getMatrixLabel(label.matrix_data, lang, register) || key;
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[riskColor]} transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-200 truncate">{risk.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                {risk.type === 'risk'
                  ? lang === 'de'
                    ? 'Risiko'
                    : lang === 'en'
                    ? 'Risk'
                    : 'Riesgo'
                  : lang === 'de'
                  ? 'Handlung'
                  : lang === 'en'
                  ? 'Action Item'
                  : 'Acción'}
              </span>
              {risk.risk_score && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    risk.risk_score >= 7
                      ? 'bg-red-600 text-white'
                      : risk.risk_score >= 4
                      ? 'bg-yellow-600 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  Score: {risk.risk_score}
                </span>
              )}
            </div>
            {risk.description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{risk.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs">
              {risk.probability && risk.impact && (
                <span className="text-slate-500">
                  P: {risk.probability.charAt(0).toUpperCase()} / I:{' '}
                  {risk.impact.charAt(0).toUpperCase()}
                </span>
              )}
              <span className={`${risk.status === 'open' ? 'text-red-400' : 'text-slate-500'}`}>
                {getLabel(`risk_status_${risk.status}`)}
              </span>
            </div>
            {risk.mitigation_plan && risk.status !== 'closed' && (
              <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-400">
                <strong className="text-slate-300">
                  {lang === 'de' && 'Maßnahme'}
                  {lang === 'en' && 'Mitigation'}
                  {lang === 'es' && 'Mitigación'}:
                </strong>{' '}
                {risk.mitigation_plan}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                aria-label="Edit"
              >
                <Edit2 className="w-4 h-4 text-slate-400 hover:text-slate-200" />
              </button>
            )}
            {onDelete && (
              <>
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1.5 hover:bg-red-900/30 rounded transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={onDelete}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
                    >
                      {lang === 'de' && 'Löschen'}
                      {lang === 'en' && 'Delete'}
                      {lang === 'es' && 'Eliminar'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="p-1 hover:bg-slate-700 rounded"
                    >
                      <X className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Sub-Component: Risk Modal (Add/Edit)
// ============================================

interface RiskModalProps {
  projectId: string;
  risk: ProjectRisk | null;
  lang: Language;
  onClose: () => void;
  onSave: (risk: ProjectRisk) => void;
}

function RiskModal({ projectId, risk, lang, onClose, onSave }: RiskModalProps) {
  const isEdit = !!risk;
  const [formData, setFormData] = useState<Partial<ProjectRisk>>(
    risk || {
      project_id: projectId,
      type: 'risk',
      title: '',
      description: '',
      probability: 'medium',
      impact: 'medium',
      status: 'open',
      mitigation_plan: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    // Calculate risk score
    const score = calculateRiskScore(
      formData.probability as 'low' | 'medium' | 'high',
      formData.impact as 'low' | 'medium' | 'high'
    );

    onSave({ ...formData, risk_score: score } as ProjectRisk);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-200">
            {isEdit
              ? lang === 'de'
                ? 'Bearbeiten'
                : lang === 'en'
                ? 'Edit'
                : 'Editar'
              : lang === 'de'
              ? 'Hinzufügen'
              : lang === 'en'
              ? 'Add'
              : 'Agregar'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Typ'}
              {lang === 'en' && 'Type'}
              {lang === 'es' && 'Tipo'}
            </label>
              <select
                value={formData.type || 'risk'}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as 'risk' | 'issue' })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
              >
                <option value="risk">
                  {lang === 'de' ? 'Risiko' : lang === 'en' ? 'Risk' : 'Riesgo'}
                </option>
                <option value="issue">
                  {lang === 'de' ? 'Handlung' : lang === 'en' ? 'Action Item' : 'Acción'}
                </option>
              </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Titel'}
              {lang === 'en' && 'Title'}
              {lang === 'es' && 'Título'}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Beschreibung'}
              {lang === 'en' && 'Description'}
              {lang === 'es' && 'Descripción'}
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Probability & Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Wahrscheinlichkeit'}
                {lang === 'en' && 'Probability'}
                {lang === 'es' && 'Probabilidad'}
              </label>
              <select
                value={formData.probability || 'medium'}
                onChange={(e) =>
                  setFormData({ ...formData, probability: e.target.value as any })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
              >
                <option value="low">
                  {lang === 'de' ? 'Niedrig' : lang === 'en' ? 'Low' : 'Baja'}
                </option>
                <option value="medium">
                  {lang === 'de' ? 'Mittel' : lang === 'en' ? 'Medium' : 'Media'}
                </option>
                <option value="high">
                  {lang === 'de' ? 'Hoch' : lang === 'en' ? 'High' : 'Alta'}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Auswirkung'}
                {lang === 'en' && 'Impact'}
                {lang === 'es' && 'Impacto'}
              </label>
              <select
                value={formData.impact || 'medium'}
                onChange={(e) => setFormData({ ...formData, impact: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
              >
                <option value="low">
                  {lang === 'de' ? 'Niedrig' : lang === 'en' ? 'Low' : 'Baja'}
                </option>
                <option value="medium">
                  {lang === 'de' ? 'Mittel' : lang === 'en' ? 'Medium' : 'Media'}
                </option>
                <option value="high">
                  {lang === 'de' ? 'Hoch' : lang === 'en' ? 'High' : 'Alta'}
                </option>
              </select>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Maßnahmenplan'}
              {lang === 'en' && 'Mitigation Plan'}
              {lang === 'es' && 'Plan de Mitigación'}
            </label>
            <textarea
              value={formData.mitigation_plan || ''}
              onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Status'}
              {lang === 'en' && 'Status'}
              {lang === 'es' && 'Estado'}
            </label>
            <select
              value={formData.status || 'open'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as ProjectRisk['status'] })
              }
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-red-500"
            >
              <option value="open">
                {lang === 'de' ? 'Offen' : lang === 'en' ? 'Open' : 'Abierto'}
              </option>
              <option value="mitigated">
                {lang === 'de' ? 'Entschärft' : lang === 'en' ? 'Mitigated' : 'Mitigado'}
              </option>
              <option value="closed">
                {lang === 'de' ? 'Erledigt' : lang === 'en' ? 'Closed' : 'Cerrado'}
              </option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              {lang === 'de' && 'Abbrechen'}
              {lang === 'en' && 'Cancel'}
              {lang === 'es' && 'Cancelar'}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              {lang === 'de' && 'Speichern'}
              {lang === 'en' && 'Save'}
              {lang === 'es' && 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
