'use client';

// ============================================
// Project Milestones Component
// ============================================
// Add/Edit/Delete Milestones für Projektplan
// Berücksichtigt .cursorrules: 2x3 Matrix, Responsive Design
// ============================================

import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Flag,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  X,
} from 'lucide-react';
import { ProjectMilestone, PMPUILabel, PMP_LABEL_KEYS } from '../types/pmp';
import { Language, Register, getMatrixLabel } from '../types/pmp';

interface ProjectMilestonesSectionProps {
  project_id: string;
  milestones: ProjectMilestone[];
  labels: Record<string, PMPUILabel>;
  lang: Language;
  register: Register;
  onAdd?: () => void;
  onEdit?: (milestone: ProjectMilestone) => void;
  onDelete?: (milestoneId: string) => void;
  isEditable?: boolean;
}

export function ProjectMilestonesSection({
  project_id,
  milestones,
  labels,
  lang,
  register,
  onAdd,
  onEdit,
  onDelete,
  isEditable = true,
}: ProjectMilestonesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | null>(null);

  // Helper: Get Label
  const getLabel = (key: string): string => {
    const label = labels[key];
    if (!label) return key;
    return getMatrixLabel(label.matrix_data, lang, register) || key;
  };

  // Sort milestones by due date
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  );

  return (
    <div className="space-y-3">
      {/* Toggle Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-slate-700 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-orange-400" />
          <span className="font-semibold text-slate-200">
            {lang === 'de' && (register === 'colloquial' ? 'Meilensteine' : 'Projektmeilensteine')}
            {lang === 'en' && (register === 'colloquial' ? 'Milestones' : 'Project Milestones')}
            {lang === 'es' && (register === 'colloquial' ? 'Hitos' : 'Hitos del Proyecto')}
          </span>
          <span className="text-sm text-slate-400">({milestones.length})</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditable && onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
              className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1"
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

      {/* Milestones List */}
      {isExpanded && (
        <div className="space-y-2">
          {sortedMilestones.length === 0 ? (
            <div className="p-6 bg-slate-800/30 rounded-lg border border-slate-700/50 text-center">
              <Flag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <p className="text-slate-500 text-sm">
                {lang === 'de' && 'Noch keine Meilensteine definiert'}
                {lang === 'en' && 'No milestones defined yet'}
                {lang === 'es' && 'Aún no hay hitos definidos'}
              </p>
            </div>
          ) : (
            sortedMilestones.map((milestone) => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                labels={labels}
                lang={lang}
                register={register}
                onEdit={
                  isEditable && onEdit
                    ? () => {
                        setEditingMilestone(milestone);
                      }
                    : undefined
                }
                onDelete={isEditable && onDelete ? () => onDelete(milestone.id) : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingMilestone) && (
        <MilestoneModal
          projectId={project_id}
          milestone={editingMilestone}
          lang={lang}
          onClose={() => {
            setShowAddModal(false);
            setEditingMilestone(null);
          }}
          onSave={(milestone) => {
            if (editingMilestone && onEdit) {
              onEdit(milestone);
            } else if (onAdd) {
              onAdd();
            }
            setShowAddModal(false);
            setEditingMilestone(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================
// Sub-Component: Milestone Card
// ============================================

interface MilestoneCardProps {
  milestone: ProjectMilestone;
  labels: Record<string, PMPUILabel>;
  lang: Language;
  register: Register;
  onEdit?: () => void;
  onDelete?: () => void;
}

function MilestoneCard({
  milestone,
  labels,
  lang,
  register,
  onEdit,
  onDelete,
}: MilestoneCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Status Icon & Color
  const getStatusIcon = () => {
    switch (milestone.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = () => {
    switch (milestone.status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30';
      case 'in_progress':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'delayed':
        return 'bg-red-500/20 border-red-500/30';
      default:
        return 'bg-slate-700/20 border-slate-600/30';
    }
  };

  // Get Status Label
  const getStatusLabel = (status: string): string => {
    const key = `milestone_status_${status}`;
    const label = labels[key];
    if (!label) return status;
    return getMatrixLabel(label.matrix_data, lang, register) || status;
  };

  // Format Date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat(lang, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className={`p-4 rounded-lg border ${getStatusColor()} transition-colors hover:border-slate-600`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon + Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-slate-200 truncate">{milestone.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                {getStatusLabel(milestone.status)}
              </span>
            </div>
            {milestone.description && (
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{milestone.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(milestone.due_date)}</span>
              </div>
              {milestone.completion_date && (
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle className="w-3 h-3" />
                  <span>{formatDate(milestone.completion_date)}</span>
                </div>
              )}
            </div>
            {/* Progress Bar */}
            {milestone.percentage_complete > 0 && milestone.status !== 'completed' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${milestone.percentage_complete}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 min-w-[40px]">
                  {milestone.percentage_complete}%
                </span>
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
// Sub-Component: Milestone Modal (Add/Edit)
// ============================================

interface MilestoneModalProps {
  projectId: string;
  milestone: ProjectMilestone | null; // null = Add, non-null = Edit
  lang: Language;
  onClose: () => void;
  onSave: (milestone: ProjectMilestone) => void;
}

function MilestoneModal({ projectId, milestone, lang, onClose, onSave }: MilestoneModalProps) {
  const isEdit = !!milestone;
  const [formData, setFormData] = useState<Partial<ProjectMilestone>>(
    milestone || {
      project_id: projectId,
      name: '',
      description: '',
      due_date: '',
      status: 'pending',
      percentage_complete: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.due_date) return;

    onSave(formData as ProjectMilestone);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <h2 className="text-lg sm:text-xl font-bold text-slate-200">
            {isEdit
              ? lang === 'de'
                ? 'Meilenstein bearbeiten'
                : lang === 'en'
                ? 'Edit Milestone'
                : 'Editar Hito'
              : lang === 'de'
              ? 'Meilenstein hinzufügen'
              : lang === 'en'
              ? 'Add Milestone'
              : 'Agregar Hito'}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Name'}
              {lang === 'en' && 'Name'}
              {lang === 'es' && 'Nombre'}
              <span className="text-red-400 ml-1">*</span>
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Due Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Fälligkeitsdatum'}
                {lang === 'en' && 'Due Date'}
                {lang === 'es' && 'Fecha de Vencimiento'}
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="date"
                value={formData.due_date || ''}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                {lang === 'de' && 'Status'}
                {lang === 'en' && 'Status'}
                {lang === 'es' && 'Estado'}
              </label>
              <select
                value={formData.status || 'pending'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as ProjectMilestone['status'],
                  })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">
                  {lang === 'de' && 'Ausstehend'}
                  {lang === 'en' && 'Pending'}
                  {lang === 'es' && 'Pendiente'}
                </option>
                <option value="in_progress">
                  {lang === 'de' && 'In Arbeit'}
                  {lang === 'en' && 'In Progress'}
                  {lang === 'es' && 'En progreso'}
                </option>
                <option value="completed">
                  {lang === 'de' && 'Abgeschlossen'}
                  {lang === 'en' && 'Completed'}
                  {lang === 'es' && 'Completado'}
                </option>
                <option value="delayed">
                  {lang === 'de' && 'Verzögert'}
                  {lang === 'en' && 'Delayed'}
                  {lang === 'es' && 'Retrasado'}
                </option>
              </select>
            </div>
          </div>

          {/* Progress */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              {lang === 'de' && 'Fortschritt'}
              {lang === 'en' && 'Progress'}
              {lang === 'es' && 'Progreso'}: {formData.percentage_complete || 0}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.percentage_complete || 0}
              onChange={(e) =>
                setFormData({ ...formData, percentage_complete: parseInt(e.target.value) })
              }
              className="w-full"
            />
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
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
