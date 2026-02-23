'use client';

import React, { useState } from 'react';
import { AlertTriangle, Activity, Crosshair, ShieldAlert, CheckCircle2, Lock, Key, Mail, Database, FileSpreadsheet, Server, ArrowRight, Workflow, CheckCircle, Loader2 } from 'lucide-react';
import { verifyS6Password } from '@/app/actions/verifyS6Password';

interface S6VitalityMonitorProps {
  lang: 'de' | 'en' | 'es';
  mode: 'colloquial' | 'management';
}

// ==========================================
// 2x3 MATRIX DICTIONARY (DE/EN/ES x Colloquial/Management)
// ==========================================
const uiContent = {
  gatekeeper_title: {
    de: { colloquial: 'Gesperrter Bereich', management: 'Restricted Area' },
    en: { colloquial: 'Locked Area', management: 'Restricted Access' },
    es: { colloquial: 'Área Bloqueada', management: 'Acceso Restringido' }
  },
  gatekeeper_desc: {
    de: { colloquial: 'Dieser Bereich enthält sensible Sanierungsdaten. Bitte gib das Passwort ein.', management: 'Kritische IDW-S6 und Covenants-Daten. Autorisierung erforderlich.' },
    en: { colloquial: 'This area contains sensitive recovery data. Please enter the password.', management: 'Critical IDW-S6 and covenants data. Authorization required.' },
    es: { colloquial: 'Esta área contiene datos sensibles. Por favor ingresa la contraseña.', management: 'Datos críticos de IDW-S6 y covenants. Se requiere autorización.' }
  },
  gatekeeper_placeholder: {
    de: { colloquial: 'Passwort eingeben...', management: 'Zugangscode (Token)...' },
    en: { colloquial: 'Enter password...', management: 'Access token...' },
    es: { colloquial: 'Ingresar contraseña...', management: 'Token de acceso...' }
  },
  gatekeeper_btn_unlock: {
    de: { colloquial: 'Entsperren', management: 'Authentifizieren' },
    en: { colloquial: 'Unlock', management: 'Authenticate' },
    es: { colloquial: 'Desbloquear', management: 'Autenticar' }
  },
  gatekeeper_btn_loading: {
    de: { colloquial: 'Prüfen...', management: 'Validierung läuft...' },
    en: { colloquial: 'Checking...', management: 'Validation in progress...' },
    es: { colloquial: 'Verificando...', management: 'Validación en curso...' }
  },
  gatekeeper_btn_mail: {
    de: { colloquial: 'Kein Passwort? Hier anfragen', management: 'Zugangsberechtigung anfordern' },
    en: { colloquial: 'No password? Request here', management: 'Request access clearance' },
    es: { colloquial: '¿Sin contraseña? Solicitar aquí', management: 'Solicitar autorización de acceso' }
  },
  title: {
    de: { colloquial: 'S6 Sanierungs-Monitor', management: 'S6 Vitality Monitor' },
    en: { colloquial: 'S6 Recovery Monitor', management: 'S6 Vitality Monitor' },
    es: { colloquial: 'Monitor de Recuperación S6', management: 'S6 Vitality Monitor' }
  },
  subtitle: {
    de: { colloquial: 'Live-Vergleich zwischen Plan und echten SAP-Zahlen', management: 'Echtzeit-Abgleich: IDW-S6 Gutachten vs. ERP-Systemdaten' },
    en: { colloquial: 'Live comparison between plan and real SAP numbers', management: 'Real-time sync: IDW-S6 Baseline vs. ERP System Data' },
    es: { colloquial: 'Comparación en vivo entre el plan y los números reales', management: 'Sincronización en tiempo real: Baseline S6 vs ERP' }
  },
  live_badge: {
    de: { colloquial: 'Live Daten', management: 'Live Sync Active' },
    en: { colloquial: 'Live Data', management: 'Live Sync Active' },
    es: { colloquial: 'Datos en vivo', management: 'Live Sync Active' }
  },
  chart_title: {
    de: { colloquial: 'Überlebens-Korridor (Plan vs. Worst-Case)', management: 'Survival Corridor (Base vs. Worst Case Scenario)' },
    en: { colloquial: 'Survival Corridor (Plan vs. Worst-Case)', management: 'Survival Corridor (Base vs. Worst Case Scenario)' },
    es: { colloquial: 'Corredor de Supervivencia (Plan vs. Peor Caso)', management: 'Survival Corridor (Base vs. Worst Case Scenario)' }
  },
  chart_warning: {
    de: { colloquial: 'Achtung: Trend geht Richtung Worst-Case!', management: 'Warning: Trend trajectory breaking worst-case baseline' },
    en: { colloquial: 'Careful: Trend is moving towards worst-case!', management: 'Warning: Trend trajectory breaking worst-case baseline' },
    es: { colloquial: '¡Atención: La tendencia va hacia el peor caso!', management: 'Warning: Trend trajectory breaking worst-case baseline' }
  },
  covenants_title: {
    de: { colloquial: 'Banken-Grenzwerte (Covenants)', management: 'Financial Covenants (Hard Limits)' },
    en: { colloquial: 'Bank Limits (Covenants)', management: 'Financial Covenants (Hard Limits)' },
    es: { colloquial: 'Límites Bancarios (Covenants)', management: 'Financial Covenants (Hard Limits)' }
  },
  cov_distance: {
    de: { colloquial: 'Puffer', management: 'Distance to Breach' },
    en: { colloquial: 'Buffer', management: 'Distance to Breach' },
    es: { colloquial: 'Margen', management: 'Distance to Breach' }
  },
  cov_days_left: {
    de: { colloquial: 'Gefahr in ~{days} Tagen', management: 'Est. breach in ~{days} days' },
    en: { colloquial: 'Danger in ~{days} days', management: 'Est. breach in ~{days} days' },
    es: { colloquial: 'Peligro en ~{days} días', management: 'Est. breach in ~{days} days' }
  },
  scanner_title: {
    de: { colloquial: 'Realitäts-Check (Meilensteine)', management: 'Reality-Check Scanner (S6 Milestones)' },
    en: { colloquial: 'Reality Check (Milestones)', management: 'Reality-Check Scanner (S6 Milestones)' },
    es: { colloquial: 'Verificación de Realidad', management: 'Reality-Check Scanner (S6 Milestones)' }
  },
  scanner_source: {
    de: { colloquial: 'Quelle: Echte Systemdaten', management: 'Source: ERP API Sync' },
    en: { colloquial: 'Source: Real System Data', management: 'Source: ERP API Sync' },
    es: { colloquial: 'Fuente: Datos reales del sistema', management: 'Source: ERP API Sync' }
  },
  table_measure: {
    de: { colloquial: 'Maßnahme', management: 'Intervention / Measure' },
    en: { colloquial: 'Measure', management: 'Intervention / Measure' },
    es: { colloquial: 'Medida', management: 'Intervention / Measure' }
  },
  table_status: {
    de: { colloquial: 'Gemeldet vs. Echte Zahlen', management: 'Reported vs. System Verification' },
    en: { colloquial: 'Reported vs. Real Numbers', management: 'Reported vs. System Verification' },
    es: { colloquial: 'Reportado vs. Números Reales', management: 'Reported vs. System Verification' }
  },
  // NEUE PIPELINE STRINGS
  pipeline_title: {
    de: { colloquial: 'Datenverbindung (Woher kommen die Zahlen?)', management: 'Agnostic Data Integration Engine' },
    en: { colloquial: 'Data Connection (Where do numbers come from?)', management: 'Agnostic Data Integration Engine' },
    es: { colloquial: 'Conexión de Datos', management: 'Agnostic Data Integration Engine' }
  },
  pipeline_mapper_title: {
    de: { colloquial: 'Übersetzer', management: 'Semantic Mapping Hub' },
    en: { colloquial: 'Translator', management: 'Semantic Mapping Hub' },
    es: { colloquial: 'Traductor', management: 'Semantic Mapping Hub' }
  },
  pipeline_mapper_desc: {
    de: { colloquial: 'Verbindet SAP-Konten mit S6-Zielen', management: 'S6 Baseline ↔ ERP Ledger Reconciliation' },
    en: { colloquial: 'Connects SAP accounts to S6 goals', management: 'S6 Baseline ↔ ERP Ledger Reconciliation' },
    es: { colloquial: 'Conecta cuentas SAP con metas S6', management: 'S6 Baseline ↔ ERP Ledger Reconciliation' }
  },
  pipeline_dest_desc: {
    de: { colloquial: 'Geprüfte & bereinigte S6 Daten', management: 'Validated & Cleansed S6 Dataset' },
    en: { colloquial: 'Verified & cleansed S6 Data', management: 'Validated & Cleansed S6 Dataset' },
    es: { colloquial: 'Datos S6 verificados y limpios', management: 'Validated & Cleansed S6 Dataset' }
  }
};

const t = (key: keyof typeof uiContent, lang: 'de'|'en'|'es', mode: 'colloquial'|'management') => {
  return uiContent[key][lang][mode];
};

export default function S6VitalityMonitor({ lang, mode }: S6VitalityMonitorProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorAnim, setErrorAnim] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // E-Mail Konfiguration
  const adminEmail = "admin@dein-unternehmen.com";

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUnlocking(true);

    try {
      const isValid = await verifyS6Password(passwordInput);

      if (isValid) {
        setIsAuthorized(true);
      } else {
        setErrorAnim(true);
        setTimeout(() => setErrorAnim(false), 500);
        setPasswordInput('');
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorAnim(true);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleMailRequest = () => {
    const subject = encodeURIComponent("Zugangsanfrage: S6 Vitality Monitor");
    const body = encodeURIComponent("Hallo,\n\nich benötige bitte das Passwort (Access Token) für den S6 Vitality Monitor im PMO Value Generator.\n\nVielen Dank!");
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
  };

  // --- GATEKEEPER VIEW ---
  if (!isAuthorized) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="w-16 h-16 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('gatekeeper_title', lang, mode)}</h2>
              <p className="text-sm text-slate-400">{t('gatekeeper_desc', lang, mode)}</p>
            </div>
            <form onSubmit={handleUnlock} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={t('gatekeeper_placeholder', lang, mode)}
                  className={`w-full pl-10 pr-4 py-3 bg-slate-900 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errorAnim ? 'border-red-500 focus:ring-red-500 animate-[shake_0.2s_ease-in-out_2]' : 'border-slate-600 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isUnlocking}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isUnlocking ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t('gatekeeper_btn_loading', lang, mode)}
                  </>
                ) : (
                  t('gatekeeper_btn_unlock', lang, mode)
                )}
              </button>
            </form>
            <div className="w-full border-t border-slate-700 pt-4 mt-2">
              <button onClick={handleMailRequest} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                {t('gatekeeper_btn_mail', lang, mode)}
              </button>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }`}} />
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  const covenants = [
    { name: 'Liquidity Floor', threshold: 4500, current: 5300, unit: 'kEUR', daysLeft: 14, status: 'warning' },
    { name: 'Equity Ratio', threshold: 15, current: 18.2, unit: '%', daysLeft: 45, status: 'safe' }
  ];

  const realityChecks = [
    { id: 'M-01', name: 'Headcount Reduction', reported: 90, system: 45, hasGap: true },
    { id: 'M-02', name: 'Capex Freeze', reported: 100, system: 95, hasGap: false },
    { id: 'M-03', name: 'Site Closure', reported: 80, system: 0, hasGap: true },
  ];

  return (
    <div className="w-full h-full overflow-y-auto p-4 sm:p-6 space-y-6 animate-fade-in pb-24">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            {t('title', lang, mode)}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{t('subtitle', lang, mode)}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {t('live_badge', lang, mode)}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Widget 1: The Survival Corridor */}
        <div className="xl:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">{t('chart_title', lang, mode)}</h3>
          <div className="relative w-full h-48 sm:h-64 bg-slate-900/50 rounded-lg border border-slate-700/50 p-4">
            <svg viewBox="0 0 1000 300" className="w-full h-full preserve-3d" preserveAspectRatio="none">
              <defs>
                <linearGradient id="corridorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(59, 130, 246, 0.2)" />
                  <stop offset="100%" stopColor="rgba(234, 179, 8, 0.2)" />
                </linearGradient>
                <linearGradient id="dangerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.0)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.3)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="1000" y2="50" stroke="#334155" strokeDasharray="4 4" />
              <line x1="0" y1="150" x2="1000" y2="150" stroke="#334155" strokeDasharray="4 4" />
              <line x1="0" y1="250" x2="1000" y2="250" stroke="#334155" strokeDasharray="4 4" />
              <polygon points="0,50 200,60 400,80 600,120 800,100 1000,70 1000,250 800,280 600,270 400,240 200,210 0,200" fill="url(#corridorGrad)" />
              <polyline points="0,50 200,60 400,80 600,120 800,100 1000,70" fill="none" stroke="#3b82f6" strokeWidth="2" />
              <polyline points="0,200 200,210 400,240 600,270 800,280 1000,250" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="6 4" />
              <polygon points="0,200 200,210 400,240 600,270 800,280 1000,250 1000,300 0,300" fill="url(#dangerGrad)" />
              <polyline points="0,70 200,90 400,110 600,190 700,260" fill="none" stroke="#ffffff" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <circle cx="700" cy="260" r="6" fill="#ef4444" className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,1)]" />
            </svg>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-red-500/20 border border-red-500/50 text-red-400 text-[10px] sm:text-xs px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg backdrop-blur-sm flex items-center gap-1.5 sm:gap-2 max-w-[200px] sm:max-w-none">
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="leading-tight">{t('chart_warning', lang, mode)}</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Covenants */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-xl flex flex-col">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            {t('covenants_title', lang, mode)}
          </h3>
          <div className="flex-1 space-y-4">
            {covenants.map((cov, i) => {
              const distance = cov.current - cov.threshold;
              const isWarning = cov.status === 'warning';
              const daysText = t('cov_days_left', lang, mode).replace('{days}', cov.daysLeft.toString());
              
              return (
                <div key={i} className="p-3 sm:p-4 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden">
                  {isWarning && <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse"></div>}
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-slate-300 truncate pr-2">{cov.name}</span>
                    <span className="text-xs font-mono text-slate-500 flex-shrink-0">Limit: {cov.threshold}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className={`text-xl sm:text-2xl font-bold ${isWarning ? 'text-red-400' : 'text-emerald-400'}`}>{cov.current}</span>
                    <span className="text-sm text-slate-500">{cov.unit}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${isWarning ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min((cov.threshold / cov.current) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between text-xs gap-1 sm:gap-0">
                    <span className={isWarning ? 'text-red-400' : 'text-emerald-400'}>{t('cov_distance', lang, mode)}: +{distance} {cov.unit}</span>
                    {isWarning && <span className="text-orange-400 font-medium">{daysText}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Widget 3: Reality-Check */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-purple-400" />
            {t('scanner_title', lang, mode)}
          </h3>
          <span className="text-[10px] sm:text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">{t('scanner_source', lang, mode)}</span>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase">
                <th className="pb-3 font-medium">{t('table_measure', lang, mode)}</th>
                <th className="pb-3 font-medium w-1/2">{t('table_status', lang, mode)}</th>
                <th className="pb-3 font-medium text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {realityChecks.map((check, i) => (
                <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 sm:py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-200">{check.name}</span>
                      <span className="text-xs text-slate-500 font-mono">{check.id}</span>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 pr-4 sm:pr-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[10px] sm:text-xs text-slate-400 w-12 sm:w-16">Reported</span>
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-500" style={{ width: `${check.reported}%` }}></div>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-400 font-mono w-6 sm:w-8 text-right">{check.reported}%</span>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-[10px] sm:text-xs text-blue-400 w-12 sm:w-16 font-medium">System</span>
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${check.hasGap ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${check.system}%` }}></div>
                        </div>
                        <span className={`text-[10px] sm:text-xs font-mono w-6 sm:w-8 text-right font-medium ${check.hasGap ? 'text-red-400' : 'text-blue-400'}`}>{check.system}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 sm:py-4 text-right">
                    {check.hasGap ? (
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] sm:text-xs font-medium">
                        <AlertTriangle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Reality Gap</span>
                        <span className="sm:hidden">Gap</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Verified</span>
                        <span className="sm:hidden">OK</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Widget 4: NEU - Agnostic Data Integration Hub */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-xl">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-6 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          {t('pipeline_title', lang, mode)}
        </h3>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Data Sources */}
          <div className="flex flex-col gap-3 w-full lg:w-1/3">
            {/* Source 1: API */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <Server className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">SAP S/4HANA</h4>
                  <p className="text-[10px] text-slate-500">OData REST API</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-[10px] text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live
              </div>
            </div>

            {/* Source 2: Flat File / SFTP */}
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Legacy ERP / HR</h4>
                  <p className="text-[10px] text-slate-500">SFTP CSV Dropzone</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-400 border border-slate-700">
                Nightly Batch
              </div>
            </div>
          </div>

          {/* Center: Semantic Mapping Hub (The "Brain") */}
          <div className="hidden lg:flex flex-col items-center justify-center w-1/3">
            <ArrowRight className="text-slate-600 w-6 h-6 animate-pulse mb-3"/>
            <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4 text-center shadow-[0_0_20px_rgba(168,85,247,0.15)] relative">
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-purple-500 rounded-full"></div>
              
              <Workflow className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <span className="text-sm font-bold text-purple-300 block">{t('pipeline_mapper_title', lang, mode)}</span>
              <p className="text-[10px] text-slate-400 mt-1 max-w-[140px] leading-tight mx-auto">
                {t('pipeline_mapper_desc', lang, mode)}
              </p>
              <div className="mt-3 text-[9px] bg-slate-800 rounded px-2 py-1 text-slate-400 font-mono border border-slate-700">
                2 unmapped orphans
              </div>
            </div>
            <ArrowRight className="text-slate-600 w-6 h-6 animate-pulse mt-3"/>
          </div>

          {/* Mobile Down-Arrows (Hidden on Desktop) */}
          <div className="flex lg:hidden justify-center text-slate-600 py-2">
            <ArrowRight className="w-6 h-6 rotate-90 animate-pulse" />
          </div>

          {/* Right: Destination (Value Engine) */}
          <div className="w-full lg:w-1/3 bg-slate-900 border border-blue-500/30 rounded-xl p-5 flex items-center gap-4 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex flex-shrink-0 items-center justify-center border border-blue-500/40 relative">
              {/* Outer rotating ring effect */}
              <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin opacity-50"></div>
              <Activity className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">Value Engine</h4>
              <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{t('pipeline_dest_desc', lang, mode)}</p>
              <div className="mt-2.5 flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 w-fit font-medium tracking-wide">
                <CheckCircle className="w-3.5 h-3.5" />
                99.8% Integrity
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
