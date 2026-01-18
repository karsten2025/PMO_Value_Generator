'use client';

// ============================================
// Project Change Management Section
// ============================================
// Change Request Tracking mit Approval Workflow
// Berücksichtigt .cursorrules: 2x3 Matrix, Responsive Design
// ============================================

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  XCircle,
  Clock,
  CheckCircle2,
  DollarSign,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { ProjectChangeRequest, PMPUILabel } from '../types/pmp';
import { Language, Register, getMatrixLabel } from '../types/pmp';

interface ProjectChangeManagementSectionProps {
  project_id: string;
  changes: ProjectChangeRequest[];
  labels: Record<string, PMPUILabel>;
  lang: Language;
  register: Register;
  onAdd?: () => void;
  onEdit?: (change: ProjectChangeRequest) => void;
  onDelete?: (changeId: string) => void;
  onApprove?: (changeId: string) => void;
  onReject?: (changeId: string, reason: string) => void;
  isEditable?: boolean;
}

export function ProjectChangeManagementSection({
  project_id,
  changes,
  labels,
  lang,
  register,
  onAdd,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  isEditable = true,
}: ProjectChangeManagementSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingChange, setEditingChange] = useState<ProjectChangeRequest | null>(null);

  // Stats
  const pending = changes.filter((c) => c.status === 'pending').length;
  const approved = changes.filter((c) => c.status === 'approved' || c.status === 'implemented')
    .length;

  // Total Impact
  const totalCostImpact = changes
    .filter((c) => c.status === 'approved' || c.status === 'implemented')
    .reduce((sum, c) => sum + (c.cost_impact || 0), 0);
  const totalTimelineImpact = changes
    .filter((c) => c.status === 'approved' || c.status === 'implemented')
    .reduce((sum, c) => sum + (c.timeline_impact || 0), 0);

  // Sort: Pending first, then by date
  const sortedChanges = [...changes].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.request_date || '').getTime() - new Date(a.request_date || '').getTime();
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-slate-700 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-slate-200">
            {lang === 'de' && 'Change Management'}
            {lang === 'en' && 'Change Management'}
            {lang === 'es' && 'Gestión de Cambios'}
          </span>
          <div className="flex items-center gap-2 text-xs">
            {pending > 0 && (
              <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                {pending}{' '}
                {lang === 'de' && 'ausstehend'}
                {lang === 'en' && 'pending'}
                {lang === 'es' && 'pendiente'}
              </span>
            )}
            <span className="text-slate-400">({changes.length})</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors flex items-center gap-1"
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
          {/* Impact Summary */}
          {(totalCostImpact !== 0 || totalTimelineImpact !== 0) && (
            <div className="p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
              <div className="text-xs font-semibold text-purple-300 mb-2">
                {lang === 'de' && 'Gesamtauswirkung (Genehmigt)'}
                {lang === 'en' && 'Total Impact (Approved)'}
                {lang === 'es' && 'Impacto Total (Aprobado)'}
              </div>
              <div className="flex items-center gap-4 text-sm">
                {totalCostImpact !== 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span
                      className={`font-semibold ${
                        totalCostImpact > 0 ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {totalCostImpact > 0 ? '+' : ''}
                      {(totalCostImpact / 1000).toFixed(0)}k€
                    </span>
                  </div>
                )}
                {totalTimelineImpact !== 0 && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span
                      className={`font-semibold ${
                        totalTimelineImpact > 0 ? 'text-red-400' : 'text-green-400'
                      }`}
                    >
                      {totalTimelineImpact > 0 ? '+' : ''}
                      {totalTimelineImpact}{' '}
                      {lang === 'de' && 'Tage'}
                      {lang === 'en' && 'days'}
                      {lang === 'es' && 'días'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Changes List */}
          <div className="space-y-2">
            {sortedChanges.length === 0 ? (
              <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50 text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p className="text-slate-500 text-sm">
                  {lang === 'de' && 'Keine Change Requests'}
                  {lang === 'en' && 'No change requests'}
                  {lang === 'es' && 'Sin solicitudes de cambio'}
                </p>
              </div>
            ) : (
              sortedChanges.map((change) => (
                <ChangeRequestCard
                  key={change.id}
                  change={change}
                  lang={lang}
                  register={register}
                  onEdit={
                    isEditable && onEdit
                      ? () => {
                          setEditingChange(change);
                        }
                      : undefined
                  }
                  onDelete={isEditable && onDelete ? () => onDelete(change.id) : undefined}
                  onApprove={
                    isEditable && onApprove && change.status === 'pending'
                      ? () => onApprove(change.id)
                      : undefined
                  }
                  onReject={
                    isEditable && onReject && change.status === 'pending'
                      ? (reason) => onReject(change.id, reason)
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingChange) && (
        <ChangeRequestModal
          projectId={project_id}
          change={editingChange}
          lang={lang}
          onClose={() => {
            setShowAddModal(false);
            setEditingChange(null);
          }}
          onSave={(change) => {
            if (editingChange && onEdit) {
              onEdit(change);
            } else if (onAdd) {
              onAdd();
            }
            setShowAddModal(false);
            setEditingChange(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Sub-Component: Change Request Card
// ============================================

interface ChangeRequestCardProps {
  change: ProjectChangeRequest;
  lang: Language;
  register: Register;
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: (reason: string) => void;
}

function ChangeRequestCard({
  change,
  lang,
  register,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: ChangeRequestCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const getStatusIcon = () => {
    switch (change.status) {
      case 'approved':
      case 'implemented':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = () => {
    switch (change.status) {
      case 'approved':
      case 'implemented':
        return 'bg-green-500/20 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const getStatusLabel = () => {
    const labels: Record<string, Record<string, string>> = {
      pending: { de: 'Genehmigung ausstehend', en: 'Pending Approval', es: 'Pendiente de aprobación' },
      approved: { de: 'Genehmigt', en: 'Approved', es: 'Aprobado' },
      rejected: { de: 'Abgelehnt', en: 'Rejected', es: 'Rechazado' },
      implemented: { de: 'Umgesetzt', en: 'Implemented', es: 'Implementado' },
    };
    return labels[change.status]?.[lang] || change.status;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(lang, { day: '2-digit', month: 'short', year: 'numeric' }).format(
      date
    );
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} transition-colors`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {change.cr_number && (
                <span className="text-xs font-mono text-slate-400">{change.cr_number}</span>
              )}
              <h4 className="font-semibold text-slate-200 truncate">{change.title}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                {getStatusLabel()}
              </span>
              {change.priority && change.priority !== 'medium' && (
                <span
                  className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    change.priority === 'critical'
                      ? 'bg-red-600 text-white'
                      : change.priority === 'high'
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-600 text-slate-300'
                  }`}
                >
                  {change.priority.toUpperCase()}
                </span>
              )}
            </div>
            {change.description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{change.description}</p>
            )}

            {/* Impact Summary */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              {change.cost_impact && change.cost_impact !== 0 && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  <span className={change.cost_impact > 0 ? 'text-red-400' : 'text-green-400'}>
                    {change.cost_impact > 0 ? '+' : ''}
                    {(change.cost_impact / 1000).toFixed(0)}k€
                  </span>
                </div>
              )}
              {change.timeline_impact && change.timeline_impact !== 0 && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className={change.timeline_impact > 0 ? 'text-red-400' : 'text-green-400'}>
                    {change.timeline_impact > 0 ? '+' : ''}
                    {change.timeline_impact}{' '}
                    {lang === 'de' ? (change.timeline_impact === 1 ? 'Tag' : 'Tage') : lang === 'en' ? (change.timeline_impact === 1 ? 'day' : 'days') : (change.timeline_impact === 1 ? 'día' : 'días')}
                  </span>
                </div>
              )}
              {change.risk_impact && (
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span className={`${change.risk_impact === 'high' ? 'text-red-400' : change.risk_impact === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {change.risk_impact.charAt(0).toUpperCase() + change.risk_impact.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Approval/Rejection Info */}
            {change.status === 'approved' && change.approval_date && (
              <div className="mt-2 text-xs text-green-400">
                ✓ {lang === 'de' && 'Genehmigt am'}
                {lang === 'en' && 'Approved on'}
                {lang === 'es' && 'Aprobado el'} {formatDate(change.approval_date)}
              </div>
            )}
            {change.status === 'rejected' && change.rejection_reason && (
              <div className="mt-2 p-2 bg-red-900/30 rounded text-xs text-red-300">
                <strong>
                  {lang === 'de' && 'Ablehnungsgrund'}
                  {lang === 'en' && 'Rejection Reason'}
                  {lang === 'es' && 'Razón de rechazo'}:
                </strong>{' '}
                {change.rejection_reason}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Approve/Reject for Pending */}
          {onApprove && onReject && change.status === 'pending' && (
            <>
              <button
                onClick={onApprove}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                title={lang === 'de' ? 'Genehmigen' : lang === 'en' ? 'Approve' : 'Aprobar'}
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowRejectDialog(true)}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors flex items-center gap-1"
                title={lang === 'de' ? 'Ablehnen' : lang === 'en' ? 'Reject' : 'Rechazar'}
              >
                <X className="w-3 h-3" />
              </button>
            </>
          )}

          {/* Edit/Delete */}
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
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="mt-3 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {lang === 'de' && 'Ablehnungsgrund'}
            {lang === 'en' && 'Rejection Reason'}
            {lang === 'es' && 'Razón de rechazo'}
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-red-500"
            placeholder={
              lang === 'de'
                ? 'Warum wird dieser Change abgelehnt?'
                : lang === 'en'
                ? 'Why is this change being rejected?'
                : '¿Por qué se rechaza este cambio?'
            }
          />
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => {
                if (rejectReason.trim()) {
                  onReject?.(rejectReason);
                  setShowRejectDialog(false);
                  setRejectReason('');
                }
              }}
              disabled={!rejectReason.trim()}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
            >
              {lang === 'de' && 'Ablehnen'}
              {lang === 'en' && 'Reject'}
              {lang === 'es' && 'Rechazar'}
            </button>
            <button
              onClick={() => {
                setShowRejectDialog(false);
                setRejectReason('');
              }}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded transition-colors"
            >
              {lang === 'de' && 'Abbrechen'}
              {lang === 'en' && 'Cancel'}
              {lang === 'es' && 'Cancelar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Sub-Component: Change Request Modal
// ============================================

interface ChangeRequestModalProps {
  projectId: string;
  change: ProjectChangeRequest | null;
  lang: Language;
  onClose: () => void;
  onSave: (change: ProjectChangeRequest) => void;
}

function ChangeRequestModal({ projectId, change, lang, onClose, onSave }: ChangeRequestModalProps) {
  const isEdit = !!change;
  const [formData, setFormData] = useState<Partial<ProjectChangeRequest>>(
    change || {
      project_id: projectId,
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      cost_impact: 0,
      timeline_impact: 0,
      risk_impact: 'low',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    onSave(formData as ProjectChangeRequest);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-200">
            {isEdit
              ? lang === 'de'
                ? 'Change Request bearbeiten'
                : lang === 'en'
                ? 'Edit Change Request'
                : 'Editar Solicitud de Cambio'
              : lang === 'de'
              ? 'Change Request hinzufügen'
              : lang === 'en'
              ? 'Add Change Request'
              : 'Agregar Solicitud de Cambio'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
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
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Priority & Risk Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Priorität'}
                {lang === 'en' && 'Priority'}
                {lang === 'es' && 'Prioridad'}
              </label>
              <select
                value={formData.priority || 'medium'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as ProjectChangeRequest['priority'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">{lang === 'de' ? 'Niedrig' : lang === 'en' ? 'Low' : 'Baja'}</option>
                <option value="medium">{lang === 'de' ? 'Mittel' : lang === 'en' ? 'Medium' : 'Media'}</option>
                <option value="high">{lang === 'de' ? 'Hoch' : lang === 'en' ? 'High' : 'Alta'}</option>
                <option value="critical">{lang === 'de' ? 'Kritisch' : lang === 'en' ? 'Critical' : 'Crítica'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Risiko-Auswirkung'}
                {lang === 'en' && 'Risk Impact'}
                {lang === 'es' && 'Impacto de Riesgo'}
              </label>
              <select
                value={formData.risk_impact || 'low'}
                onChange={(e) => setFormData({ ...formData, risk_impact: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">{lang === 'de' ? 'Niedrig' : lang === 'en' ? 'Low' : 'Bajo'}</option>
                <option value="medium">{lang === 'de' ? 'Mittel' : lang === 'en' ? 'Medium' : 'Medio'}</option>
                <option value="high">{lang === 'de' ? 'Hoch' : lang === 'en' ? 'High' : 'Alto'}</option>
              </select>
            </div>
          </div>

          {/* Cost & Timeline Impact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Kosten-Auswirkung'}
                {lang === 'en' && 'Cost Impact'}
                {lang === 'es' && 'Impacto de Costo'} (€)
              </label>
              <input
                type="number"
                value={formData.cost_impact || 0}
                onChange={(e) =>
                  setFormData({ ...formData, cost_impact: parseFloat(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Zeit-Auswirkung'}
                {lang === 'en' && 'Timeline Impact'}
                {lang === 'es' && 'Impacto de Tiempo'} ({lang === 'de' ? 'Tage' : lang === 'en' ? 'days' : 'días'})
              </label>
              <input
                type="number"
                value={formData.timeline_impact || 0}
                onChange={(e) =>
                  setFormData({ ...formData, timeline_impact: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
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
              className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
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
