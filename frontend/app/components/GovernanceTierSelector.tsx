"use client";

/**
 * GovernanceTierSelector - Badge mit Dropdown
 * Strategisch (Amber), Taktisch (Blue), Operativ (Emerald), Undefiniert (Slate)
 */

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { LIFECYCLE_CONTENT, getTierLabel } from "@/app/data/lifecycleContent";

type Lang = "de" | "en" | "es";
type Mode = "colloquial" | "management";
type Tier = "strategic" | "tactical" | "operational" | null;

interface GovernanceTierSelectorProps {
  tier: Tier;
  lang: Lang;
  mode: Mode;
  projectId: string;
  onTierChange: (projectId: string, tier: Tier) => Promise<void>;
  disabled?: boolean;
}

const TIER_COLORS: Record<NonNullable<Tier>, string> = {
  strategic: "text-amber-400 border-amber-400/70 hover:bg-amber-500/10",
  tactical: "text-blue-400 border-blue-400/70 hover:bg-blue-500/10",
  operational: "text-emerald-400 border-emerald-400/70 hover:bg-emerald-500/10",
};

export default function GovernanceTierSelector({
  tier,
  lang,
  mode,
  projectId,
  onTierChange,
  disabled = false,
}: GovernanceTierSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = async (newTier: Tier) => {
    await onTierChange(projectId, newTier);
    setIsOpen(false);
  };

  const colorClass = tier ? TIER_COLORS[tier] : "text-slate-400 border-slate-500/70 hover:bg-slate-600/30";
  const label = getTierLabel(tier ?? undefined, lang, mode);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-sm font-medium transition ${colorClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 min-w-[180px] py-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50">
          <button
            type="button"
            onClick={() => handleSelect(null)}
            className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:bg-slate-700/50 hover:text-white transition"
          >
            {LIFECYCLE_CONTENT.ui.tier_undefined[lang][mode]}
          </button>
          <button
            type="button"
            onClick={() => handleSelect("strategic")}
            className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 transition flex flex-col"
          >
            <span className="font-medium">{LIFECYCLE_CONTENT.tiers.strategic.label[lang][mode]}</span>
            <span className="text-xs text-slate-500">{LIFECYCLE_CONTENT.tiers.strategic.description[lang][mode]}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect("tactical")}
            className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 transition flex flex-col"
          >
            <span className="font-medium">{LIFECYCLE_CONTENT.tiers.tactical.label[lang][mode]}</span>
            <span className="text-xs text-slate-500">{LIFECYCLE_CONTENT.tiers.tactical.description[lang][mode]}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelect("operational")}
            className="w-full text-left px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-500/10 transition flex flex-col"
          >
            <span className="font-medium">{LIFECYCLE_CONTENT.tiers.operational.label[lang][mode]}</span>
            <span className="text-xs text-slate-500">{LIFECYCLE_CONTENT.tiers.operational.description[lang][mode]}</span>
          </button>
        </div>
      )}
    </div>
  );
}
