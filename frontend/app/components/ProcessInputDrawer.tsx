"use client";

/**
 * ProcessInputDrawer - Slide-Over von rechts
 * Dynamische Formularfelder basierend auf Prozess (2x3 Matrix)
 */

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  LIFECYCLE_CONTENT,
  getProcessLabel,
  getFormFields,
  PROCESS_ARTIFACT_KEYS,
} from "@/app/data/lifecycleContent";

type Lang = "de" | "en" | "es";
type Mode = "colloquial" | "management";

interface ProcessInputDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  processId: string;
  projectId: string;
  projectName: string;
  lang: Lang;
  mode: Mode;
  initialData?: Record<string, unknown>;
  onSave: (processId: string, data: Record<string, unknown>) => Promise<void>;
}

export default function ProcessInputDrawer({
  isOpen,
  onClose,
  processId,
  projectId,
  projectName,
  lang,
  mode,
  initialData = {},
  onSave,
}: ProcessInputDrawerProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const formFields = getFormFields(processId);
  const processTitle = getProcessLabel(processId, lang, mode);

  useEffect(() => {
    if (isOpen) {
      const mapped: Record<string, string> = {};
      Object.keys(formFields).forEach((k) => {
        const v = initialData[k];
        mapped[k] = typeof v === "string" ? v : String(v ?? "");
      });
      setFormData(mapped);
    }
  }, [isOpen, processId, initialData]);

  const handleChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(processId, formData);
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full w-full sm:w-[85%] sm:max-w-[480px] bg-slate-800 border-l border-slate-700 shadow-2xl z-50 flex flex-col overflow-hidden"
        role="dialog"
        aria-label={processTitle}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-cyan-400">
              {processTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">{projectName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition"
            aria-label={LIFECYCLE_CONTENT.ui.close[lang][mode]}
          >
            <X size={20} />
          </button>
        </div>

        <form
          id="process-input-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {Object.entries(formFields).map(([fieldKey, fieldDef]) => {
            const label = fieldDef.label[lang][mode];
            const placeholder = fieldDef.placeholder[lang][mode];
            const value = formData[fieldKey] ?? "";

            if (fieldDef.type === "textarea") {
              return (
                <div key={fieldKey}>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    {label}
                  </label>
                  <textarea
                    value={value}
                    onChange={(e) => handleChange(fieldKey, e.target.value)}
                    placeholder={placeholder}
                    rows={4}
                    className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y min-h-[80px]"
                  />
                </div>
              );
            }

            return (
              <div key={fieldKey}>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(fieldKey, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            );
          })}
        </form>

        <div className="p-4 sm:p-6 border-t border-slate-700 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition font-medium"
          >
            {LIFECYCLE_CONTENT.ui.close[lang][mode]}
          </button>
          <button
            type="submit"
            form="process-input-form"
            disabled={isSaving}
            className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition font-medium"
          >
            {isSaving ? "…" : LIFECYCLE_CONTENT.ui.save[lang][mode]}
          </button>
        </div>
      </aside>
    </>
  );
}
