// Supabase Client für Frontend
// Konfiguration für Browser-basierte Anfragen

import { createClient } from '@supabase/supabase-js';

// Safe-Check: Stelle sicher, dass wir gültige Strings haben
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

// Validation
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('https://');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 20;

if (!isValidUrl || !isValidKey) {
  console.error('❌ [Supabase] KRITISCHER FEHLER - Ungültige Konfiguration:');
  console.error('  - URL vorhanden:', !!supabaseUrl);
  console.error('  - URL gültig:', isValidUrl);
  console.error('  - URL Wert:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'LEER');
  console.error('  - Key vorhanden:', !!supabaseAnonKey);
  console.error('  - Key gültig:', isValidKey);
  console.error('  - Key Länge:', supabaseAnonKey.length);
  console.error('');
  console.error('🔧 [Supabase] LÖSUNG:');
  console.error('  1. Erstelle/Prüfe frontend/.env.local');
  console.error('  2. Füge hinzu:');
  console.error('     NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co');
  console.error('     NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key');
  console.error('  3. Starte den Dev-Server neu: npm run dev');
} else {
  console.log('✅ [Supabase] Client konfiguriert:', {
    url: supabaseUrl.substring(0, 30) + '...',
    keyLength: supabaseAnonKey.length,
    hasUrl: true,
    hasKey: true,
    isValidUrl,
    isValidKey
  });
}

// Fail-Safe: Nutze Dummy-Werte wenn Konfiguration fehlt (verhindert Crash)
const safeUrl = isValidUrl ? supabaseUrl : 'https://dummy.supabase.co';
const safeKey = isValidKey ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkdW1teSIsInJvbGUiOiJhbm9uIn0.dummy';

if (!isValidUrl || !isValidKey) {
  console.warn('⚠️ [Supabase] Nutze Dummy-Werte (alle Anfragen werden fehlschlagen)');
}

export const supabase = createClient(safeUrl, safeKey);

// Typen für unsere Datenbank-Strukturen
export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
}

export interface MatrixData {
  de: {
    colloquial: string;
    management: string;
  };
  en: {
    colloquial: string;
    management: string;
  };
  es: {
    colloquial: string;
    management: string;
  };
}

export interface Project {
  id: string;
  name: string;
  name_matrix?: MatrixData; // 2x3 Matrix für Projektnamen
  description: string | null;
  description_matrix?: MatrixData; // 2x3 Matrix für Beschreibungen
  portfolio_id: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled' | 'planning';
  strategic_alignment: 'strategic' | 'tactical' | 'operational';
  impact_score: 'low' | 'medium' | 'high';
  risk_level: 'low' | 'medium' | 'high';
  project_owner: string;
  budget: number; // In EUR cents
  start_date: string | null;
  end_date: string | null;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface KPIValue {
  id: string;
  portfolio_id: string;
  instance_id: string;
  kpi_id: string;
  step_id: string; // TEXT in der DB (z.B. 'milestone_1')
  target_value: number;
  actual_value: number;
  updated_at: string;
}

// Legacy alias für Rückwärtskompatibilität
export type InstanceMetric = KPIValue;

export interface StepProgress {
  step_id: number;
  completion: number; // 0-100
  kpi_count: number;
}

