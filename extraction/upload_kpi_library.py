#!/usr/bin/env python3
"""
Upload KPI Library to Supabase
Lädt die 30 KPIs aus kpi-library-mock.json in die pmo_kpi_library Tabelle
"""

import json
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table

# Load environment variables
load_dotenv()

console = Console()

# Supabase credentials
SUPABASE_URL = os.getenv('SUPABASE_URL') or os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = (
    os.getenv('SUPABASE_SERVICE_KEY') or 
    os.getenv('SUPABASE_KEY') or 
    os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

if not SUPABASE_URL or not SUPABASE_KEY:
    console.print("[red]❌ Fehler: SUPABASE_URL oder SUPABASE_KEY nicht gefunden![/red]")
    console.print("[yellow]Bitte prüfe deine .env Datei im Projekt-Root[/yellow]")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def load_kpi_library():
    """Lade KPI Library aus JSON"""
    # Find project root
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    json_path = os.path.join(project_root, 'frontend', 'mock', 'kpi-library-mock.json')
    
    if not os.path.exists(json_path):
        console.print(f"[red]❌ Datei nicht gefunden: {json_path}[/red]")
        return None
    
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return data.get('kpis', [])

def cleanup_existing_kpis():
    """Lösche bestehende KPIs aus der Library"""
    try:
        result = supabase.table('pmo_kpi_library').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        console.print(f"[dim]✓ Alte KPIs gelöscht[/dim]")
        return True
    except Exception as e:
        console.print(f"[yellow]⚠️  Konnte alte KPIs nicht löschen: {e}[/yellow]")
        return True  # Continue anyway

def upload_kpis(kpis):
    """Upload KPIs to Supabase"""
    console.print(f"\n[bold cyan]📤 Uploade {len(kpis)} KPIs...[/bold cyan]")
    
    uploaded = []
    failed = []
    
    for kpi in kpis:
        try:
            # Prepare data for Supabase
            kpi_data = {
                'id': kpi['id'],  # Nutze die String-ID aus der JSON
                'step_number': kpi['step_number'],
                'kpi_category': kpi['kpi_type'],  # strategic/tactical/operational
                'matrix_data': kpi['matrix'],
                'unit': kpi.get('unit', '%')
            }
            
            # Insert into Supabase
            result = supabase.table('pmo_kpi_library').upsert(kpi_data).execute()
            
            if result.data:
                uploaded.append(kpi['id'])
                
                # Visual progress
                if kpi['kpi_type'] == 'strategic':
                    icon = '🟡'
                elif kpi['kpi_type'] == 'tactical':
                    icon = '🔵'
                else:
                    icon = '🟢'
                
                console.print(f"  {icon} {kpi['id']}")
            else:
                failed.append(kpi['id'])
        except Exception as e:
            console.print(f"  [red]❌ {kpi['id']}: {e}[/red]")
            failed.append(kpi['id'])
    
    # Summary
    console.print(f"\n[bold green]✅ {len(uploaded)} KPIs erfolgreich hochgeladen![/bold green]")
    if failed:
        console.print(f"[bold red]❌ {len(failed)} KPIs fehlgeschlagen[/bold red]")
    
    return uploaded, failed

def show_summary(uploaded):
    """Zeige Zusammenfassung"""
    # Count by category
    strategic = len([k for k in uploaded if '_STR_' in k])
    tactical = len([k for k in uploaded if '_TAC_' in k])
    operational = len([k for k in uploaded if '_OPE_' in k])
    
    table = Table(title="KPI Library Upload Summary")
    table.add_column("Kategorie", style="cyan")
    table.add_column("Anzahl", style="green", justify="right")
    
    table.add_row("🟡 Strategic", str(strategic))
    table.add_row("🔵 Tactical", str(tactical))
    table.add_row("🟢 Operational", str(operational))
    table.add_row("", "")
    table.add_row("Total", str(len(uploaded)), style="bold")
    
    console.print("\n")
    console.print(table)

def main():
    console.print("\n[bold magenta]📚 KPI Library Uploader[/bold magenta]")
    console.print("[dim]Lädt KPIs aus frontend/mock/kpi-library-mock.json[/dim]\n")
    
    # Load KPIs from JSON
    kpis = load_kpi_library()
    if not kpis:
        console.print("[red]❌ Keine KPIs gefunden![/red]")
        return
    
    console.print(f"[green]✓ {len(kpis)} KPIs aus JSON geladen[/green]")
    
    # Cleanup
    cleanup_existing_kpis()
    
    # Upload
    uploaded, failed = upload_kpis(kpis)
    
    # Summary
    if uploaded:
        show_summary(uploaded)
    
    console.print("\n[bold green]🎉 Upload abgeschlossen![/bold green]")
    console.print("[dim]Die KPIs sind jetzt in der pmo_kpi_library Tabelle[/dim]\n")

if __name__ == '__main__':
    main()

