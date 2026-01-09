#!/usr/bin/env python3
"""
PMO Data Seeder - Füllt Supabase mit initialen Testdaten

Erstellt:
- 2 Portfolios ([DUMMY])
- 6 Projekte ([DUMMY]) mit Strategic/Tactical/Operational Alignment
- PMO Impact Cycle Templates (falls nicht vorhanden)
- Instanzen für jedes Projekt
- Realistische KPI-Metriken für unterschiedliche Fortschrittslevel

Neue Features:
- Strategic Alignment (strategic/tactical/operational)
- Impact Score (low/medium/high)
- Risk Level (low/medium/high)
- Project Owner & Budget

Verwendung:
    python3 extraction/seed_pmo_data.py
"""

import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
from rich.console import Console
from rich.table import Table
from rich import print as rprint

# Lade Umgebungsvariablen
load_dotenv()

console = Console()

# Supabase Client initialisieren
SUPABASE_URL = os.getenv('SUPABASE_URL')
# Versuche zuerst SERVICE_KEY, dann ANON_KEY, dann SUPABASE_KEY (Fallback für Kompatibilität)
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_KEY') or os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    console.print("[red]❌ Fehler: SUPABASE_URL oder SUPABASE_KEY nicht in .env gefunden![/red]")
    console.print("[yellow]Suche nach: SUPABASE_SERVICE_KEY, SUPABASE_KEY, oder NEXT_PUBLIC_SUPABASE_ANON_KEY[/yellow]")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# KPI-IDs werden dynamisch aus der Datenbank geladen
KPI_IDS = {
    'strategic': [],
    'tactical': [],
    'operational': []
}

def load_kpi_ids():
    """Lade echte KPI-IDs aus der pmo_kpi_library"""
    try:
        # Lade KPIs aus der Library
        result = supabase.table('pmo_kpi_library').select('id, kpi_category').execute()
        
        if result.data and len(result.data) > 0:
            for kpi in result.data:
                category = kpi.get('kpi_category')
                if category in KPI_IDS:
                    KPI_IDS[category].append(kpi['id'])
            
            console.print(f"[dim]✓ {len(result.data)} KPIs aus Library geladen[/dim]")
            return True
        else:
            console.print("[yellow]⚠️  Keine KPIs in pmo_kpi_library gefunden![/yellow]")
            console.print("[yellow]   Erstelle Minimal-KPIs für Demo-Zwecke...[/yellow]")
            return create_minimal_kpis()
    except Exception as e:
        console.print(f"[yellow]⚠️  Fehler beim Laden der KPIs: {e}[/yellow]")
        console.print("[yellow]   Erstelle Minimal-KPIs für Demo-Zwecke...[/yellow]")
        return create_minimal_kpis()

def create_minimal_kpis():
    """Erstelle minimale KPI-Set für Demo wenn Library leer ist"""
    minimal_kpis = [
        {
            'step_number': 1,
            'kpi_category': 'strategic',
            'matrix_data': {
                'de': {'colloquial': 'Strategische Kennzahl 1', 'management': 'Strategic KPI 1'},
                'en': {'colloquial': 'Strategic Metric 1', 'management': 'Strategic KPI 1'},
                'es': {'colloquial': 'Métrica Estratégica 1', 'management': 'KPI Estratégico 1'}
            },
            'unit': '%'
        },
        {
            'step_number': 1,
            'kpi_category': 'tactical',
            'matrix_data': {
                'de': {'colloquial': 'Taktische Kennzahl 1', 'management': 'Tactical KPI 1'},
                'en': {'colloquial': 'Tactical Metric 1', 'management': 'Tactical KPI 1'},
                'es': {'colloquial': 'Métrica Táctica 1', 'management': 'KPI Táctico 1'}
            },
            'unit': '%'
        },
        {
            'step_number': 1,
            'kpi_category': 'operational',
            'matrix_data': {
                'de': {'colloquial': 'Operative Kennzahl 1', 'management': 'Operational KPI 1'},
                'en': {'colloquial': 'Operational Metric 1', 'management': 'Operational KPI 1'},
                'es': {'colloquial': 'Métrica Operativa 1', 'management': 'KPI Operativo 1'}
            },
            'unit': '%'
        }
    ]
    
    try:
        result = supabase.table('pmo_kpi_library').insert(minimal_kpis).execute()
        
        if result.data:
            for kpi in result.data:
                category = kpi.get('kpi_category')
                if category in KPI_IDS:
                    KPI_IDS[category].append(kpi['id'])
            
            console.print(f"[green]✓ {len(result.data)} Minimal-KPIs erstellt[/green]")
            return True
        else:
            console.print("[red]❌ Fehler beim Erstellen der Minimal-KPIs[/red]")
            return False
    except Exception as e:
        console.print(f"[red]❌ Fehler beim Erstellen der Minimal-KPIs: {e}[/red]")
        return False


def create_portfolios():
    """Erstelle 2 Test-Portfolios"""
    console.print("\n[bold cyan]📂 Erstelle Portfolios...[/bold cyan]")
    
    portfolios = [
        {
            'name': 'Digital Transformation [DUMMY]',
            'description': 'Digitalisierung der Kernprozesse und Einführung neuer Cloud-Technologien'
        },
        {
            'name': 'Product Launch [DUMMY]',
            'description': 'Launch der neuen Produktlinie Q2 2026'
        }
    ]
    
    created_portfolios = []
    for p in portfolios:
        try:
            result = supabase.table('pmo_portfolios').insert(p).execute()
            created_portfolios.append(result.data[0])
            console.print(f"  ✓ Portfolio erstellt: [green]{p['name']}[/green]")
        except Exception as e:
            console.print(f"  ⚠ Fehler beim Erstellen von {p['name']}: {e}")
    
    return created_portfolios


def create_projects(portfolio_ids):
    """Erstelle 6 Test-Projekte mit Strategic/Tactical/Operational Alignment + 2x3 Matrix"""
    console.print("\n[bold cyan]📋 Erstelle Projekte...[/bold cyan]")
    
    projects = [
        # STRATEGIC Projects (2x für Portfolio 1)
        {
            'name': 'Cloud-Migration Programm [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'Cloud-Migration Programm [DUMMY]',
                    'management': 'Cloud Transformation Initiative [DUMMY]'
                },
                'en': {
                    'colloquial': 'Cloud Migration Program [DUMMY]',
                    'management': 'Enterprise Cloud Transformation Initiative [DUMMY]'
                },
                'es': {
                    'colloquial': 'Programa de Migración a la Nube [DUMMY]',
                    'management': 'Iniciativa de Transformación Cloud Empresarial [DUMMY]'
                }
            },
            'description': 'Umzug wichtiger Arbeitslasten in die AWS-Cloud mit Multi-Cloud-Strategie',
            'description_matrix': {
                'de': {
                    'colloquial': 'Umzug wichtiger Arbeitslasten in die AWS-Cloud mit Multi-Cloud-Strategie',
                    'management': 'Strategische Migration kritischer Workloads in AWS-Cloud-Infrastruktur zur Optimierung der IT-Kostenstruktur und Verbesserung der Skalierbarkeit'
                },
                'en': {
                    'colloquial': 'Moving important work tasks to AWS cloud with multi-cloud strategy',
                    'management': 'Strategic migration of critical workloads to AWS cloud infrastructure for IT cost optimization and scalability enhancement'
                },
                'es': {
                    'colloquial': 'Traslado de cargas de trabajo importantes a la nube AWS con estrategia multi-nube',
                    'management': 'Migración estratégica de cargas de trabajo críticas a infraestructura cloud AWS para optimización de costos TI y mejora de escalabilidad'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'strategic',
            'impact_score': 'high',
            'risk_level': 'medium',
            'project_owner': 'Johann Schmidt',
            'budget': 2300000,  # 2.3M EUR
            'start_date': (datetime.now() - timedelta(days=90)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=180)).date().isoformat(),
            'tags': ['cloud', 'infrastruktur', 'strategisch']
        },
        {
            'name': 'Digitaler Arbeitsplatz Initiative [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'Digitaler Arbeitsplatz Initiative [DUMMY]',
                    'management': 'Digital Workplace Transformation Program [DUMMY]'
                },
                'en': {
                    'colloquial': 'Digital Workplace Initiative [DUMMY]',
                    'management': 'Strategic Digital Workplace Transformation Program [DUMMY]'
                },
                'es': {
                    'colloquial': 'Iniciativa de Lugar de Trabajo Digital [DUMMY]',
                    'management': 'Programa Estratégico de Transformación Digital del Espacio de Trabajo [DUMMY]'
                }
            },
            'description': 'Einführung moderner Zusammenarbeits-Tools und Home-Office-Infrastruktur',
            'description_matrix': {
                'de': {
                    'colloquial': 'Einführung moderner Zusammenarbeits-Tools und Home-Office-Infrastruktur',
                    'management': 'Implementierung einer integrierten Collaboration-Plattform zur Steigerung der Mitarbeiterproduktivität und Enablement hybrider Arbeitsmodelle'
                },
                'en': {
                    'colloquial': 'Introduction of modern collaboration tools and home office infrastructure',
                    'management': 'Implementation of integrated collaboration platform for employee productivity enhancement and hybrid work model enablement'
                },
                'es': {
                    'colloquial': 'Introducción de herramientas modernas de colaboración e infraestructura de oficina en casa',
                    'management': 'Implementación de plataforma de colaboración integrada para mejora de productividad y habilitación de modelos de trabajo híbridos'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'strategic',
            'impact_score': 'medium',
            'risk_level': 'high',
            'project_owner': 'Sarah Müller',
            'budget': 1500000,  # 1.5M EUR
            'start_date': (datetime.now() - timedelta(days=60)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=210)).date().isoformat(),
            'tags': ['arbeitsplatz', 'kollaboration', 'strategisch']
        },
        
        # TACTICAL Projects (2x)
        {
            'name': 'PMO-Tool Einführung [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'PMO-Tool Einführung [DUMMY]',
                    'management': 'PMO Software Implementation Program [DUMMY]'
                },
                'en': {
                    'colloquial': 'PMO Tool Rollout [DUMMY]',
                    'management': 'Enterprise PMO Software Implementation Program [DUMMY]'
                },
                'es': {
                    'colloquial': 'Introducción de Herramienta PMO [DUMMY]',
                    'management': 'Programa de Implementación de Software PMO Empresarial [DUMMY]'
                }
            },
            'description': 'Implementierung zentraler PMO-Software für Portfolio-Überwachung',
            'description_matrix': {
                'de': {
                    'colloquial': 'Implementierung zentraler PMO-Software für Portfolio-Überwachung',
                    'management': 'Deployment einer integrierten PMO-Plattform zur Optimierung des Portfolio-Monitorings und Governance-Prozesse'
                },
                'en': {
                    'colloquial': 'Implementation of central PMO software for portfolio monitoring',
                    'management': 'Deployment of integrated PMO platform for portfolio monitoring optimization and governance process enhancement'
                },
                'es': {
                    'colloquial': 'Implementación de software PMO central para supervisión de cartera',
                    'management': 'Despliegue de plataforma PMO integrada para optimización de monitoreo de cartera y procesos de gobernanza'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'tactical',
            'impact_score': 'low',
            'risk_level': 'high',
            'project_owner': 'Michael Chen',
            'budget': 500000,  # 500K EUR
            'start_date': (datetime.now() - timedelta(days=120)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=90)).date().isoformat(),
            'tags': ['pmo', 'werkzeuge', 'taktisch']
        },
        {
            'name': 'Team-Onboarding Programm [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'Team-Onboarding Programm [DUMMY]',
                    'management': 'PM Capability Development Initiative [DUMMY]'
                },
                'en': {
                    'colloquial': 'Team Onboarding Program [DUMMY]',
                    'management': 'Project Management Capability Development Initiative [DUMMY]'
                },
                'es': {
                    'colloquial': 'Programa de Incorporación de Equipo [DUMMY]',
                    'management': 'Iniciativa de Desarrollo de Capacidades en Gestión de Proyectos [DUMMY]'
                }
            },
            'description': 'Strukturierte Einarbeitungs-Prozesse für neue Projektmanagement-Teammitglieder',
            'description_matrix': {
                'de': {
                    'colloquial': 'Strukturierte Einarbeitungs-Prozesse für neue Projektmanagement-Teammitglieder',
                    'management': 'Systematisches Onboarding-Framework zur Steigerung der Time-to-Productivity neuer PM-Ressourcen'
                },
                'en': {
                    'colloquial': 'Structured onboarding processes for new project management team members',
                    'management': 'Systematic onboarding framework for time-to-productivity enhancement of new PM resources'
                },
                'es': {
                    'colloquial': 'Procesos estructurados de incorporación para nuevos miembros del equipo de gestión de proyectos',
                    'management': 'Marco sistemático de onboarding para mejora del tiempo de productividad de nuevos recursos PM'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'tactical',
            'impact_score': 'high',
            'risk_level': 'low',
            'project_owner': 'Anna Weber',
            'budget': 300000,  # 300K EUR
            'start_date': (datetime.now() - timedelta(days=45)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=150)).date().isoformat(),
            'tags': ['personal', 'training', 'taktisch']
        },
        
        # OPERATIONAL Projects (2x)
        {
            'name': 'Monats-Reporting Automatisierung [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'Monats-Reporting Automatisierung [DUMMY]',
                    'management': 'Management Reporting Automation Initiative [DUMMY]'
                },
                'en': {
                    'colloquial': 'Monthly Reporting Automation [DUMMY]',
                    'management': 'Management Reporting Process Automation Initiative [DUMMY]'
                },
                'es': {
                    'colloquial': 'Automatización de Informes Mensuales [DUMMY]',
                    'management': 'Iniciativa de Automatización de Procesos de Reporting Gerencial [DUMMY]'
                }
            },
            'description': 'Automatisierung wiederkehrender Management-Berichte und Kennzahlen',
            'description_matrix': {
                'de': {
                    'colloquial': 'Automatisierung wiederkehrender Management-Berichte und Kennzahlen',
                    'management': 'Automatisierung repetitiver Reporting-Prozesse zur Effizienzsteigerung und Reduktion manueller Fehlerquellen'
                },
                'en': {
                    'colloquial': 'Automation of recurring management reports and metrics',
                    'management': 'Automation of repetitive reporting processes for efficiency enhancement and manual error reduction'
                },
                'es': {
                    'colloquial': 'Automatización de informes de gestión recurrentes y métricas',
                    'management': 'Automatización de procesos de reporting repetitivos para mejora de eficiencia y reducción de errores manuales'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'operational',
            'impact_score': 'high',
            'risk_level': 'low',
            'project_owner': 'Thomas Wagner',
            'budget': 150000,  # 150K EUR
            'start_date': (datetime.now() - timedelta(days=30)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=60)).date().isoformat(),
            'tags': ['automatisierung', 'reporting', 'operativ']
        },
        {
            'name': 'Dashboard-Optimierung [DUMMY]',
            'name_matrix': {
                'de': {
                    'colloquial': 'Dashboard-Optimierung [DUMMY]',
                    'management': 'PMO Dashboard Performance Enhancement [DUMMY]'
                },
                'en': {
                    'colloquial': 'Dashboard Optimization [DUMMY]',
                    'management': 'PMO Dashboard Performance & UX Enhancement Program [DUMMY]'
                },
                'es': {
                    'colloquial': 'Optimización de Dashboard [DUMMY]',
                    'management': 'Programa de Mejora de Rendimiento y UX del Dashboard PMO [DUMMY]'
                }
            },
            'description': 'Leistungs-Verbesserung und Benutzerfreundlichkeits-Optimierung der PMO-Dashboards',
            'description_matrix': {
                'de': {
                    'colloquial': 'Leistungs-Verbesserung und Benutzerfreundlichkeits-Optimierung der PMO-Dashboards',
                    'management': 'Performance-Optimierung und UX-Enhancement der PMO-Dashboard-Plattform zur Steigerung der User Adoption'
                },
                'en': {
                    'colloquial': 'Performance improvement and user-friendliness optimization of PMO dashboards',
                    'management': 'Performance optimization and UX enhancement of PMO dashboard platform for user adoption increase'
                },
                'es': {
                    'colloquial': 'Mejora de rendimiento y optimización de usabilidad de dashboards PMO',
                    'management': 'Optimización de rendimiento y mejora de UX de plataforma de dashboard PMO para incremento de adopción de usuarios'
                }
            },
            'portfolio_id': portfolio_ids[0],
            'status': 'active',
            'strategic_alignment': 'operational',
            'impact_score': 'medium',
            'risk_level': 'low',
            'project_owner': 'Lisa Schneider',
            'budget': 200000,  # 200K EUR
            'start_date': (datetime.now() - timedelta(days=20)).date().isoformat(),
            'end_date': (datetime.now() + timedelta(days=90)).date().isoformat(),
            'tags': ['dashboard', 'ux', 'operativ']
        }
    ]
    
    created_projects = []
    for p in projects:
        try:
            result = supabase.table('pmo_projects').insert(p).execute()
            created_projects.append(result.data[0])
            alignment_emoji = {'strategic': '🟡', 'tactical': '🔵', 'operational': '🟢'}.get(p.get('strategic_alignment', ''), '⚪')
            console.print(f"  ✓ {alignment_emoji} Projekt erstellt: [green]{p['name']}[/green] ({p.get('strategic_alignment', 'N/A')})")
        except Exception as e:
            console.print(f"  ⚠ Fehler beim Erstellen von {p['name']}: {e}")
    
    return created_projects


def create_project_kpi_values(projects, portfolio_id):
    """
    Erstelle realistische KPI-Werte für jedes Projekt
    Mit unterschiedlichen Fortschritts-Leveln für visuell ansprechende Ansicht
    """
    console.print(f"\n[bold cyan]📊 Erstelle KPI-Werte für Projekte...[/bold cyan]")
    
    import random
    
    # Definiere spezifische Progress-Level für jedes der 6 Projekte
    # Format: (target_progress%, actual_progress%) für Varianz
    project_progress_levels = [
        85,  # Cloud-Migration: 85% (Grün) ✅
        75,  # Digitaler Arbeitsplatz: 75% (Gelb) ⚠️
        30,  # PMO-Tool Einführung: 30% (Rot) 🔴
        70,  # Team-Onboarding: 70% (Gelb) ⚠️
        95,  # Reporting Automation: 95% (Grün) ✅
        85,  # Dashboard-Optimierung: 85% (Grün) ✅
    ]
    
    all_metrics = []
    
    for idx, project in enumerate(projects):
        target_progress = project_progress_levels[idx]
        project_id = project['id']
        project_name = project['name'].replace(' [DUMMY]', '')
        
        # Erstelle 3-5 KPIs pro Projekt (für realistischen Durchschnitt)
        num_kpis = random.randint(3, 5)
        
        project_metric_values = []  # Track values for this specific project
        
        for kpi_idx in range(num_kpis):
            # Variiere die Werte leicht um den Ziel-Progress (±5%)
            variation = random.randint(-5, 5)
            actual_progress = max(0, min(100, target_progress + variation))
            
            # Target ist immer 100 für Prozent-KPIs
            target_value = 100
            actual_value = actual_progress
            
            # Wähle passende KPI basierend auf Strategic Alignment
            alignment = project['strategic_alignment']
            kpi_list = KPI_IDS.get(alignment, [])
            
            if not kpi_list:
                console.print(f"[yellow]⚠️  Keine KPIs für {alignment} gefunden, überspringe...[/yellow]")
                continue
            
            kpi_id = kpi_list[kpi_idx % len(kpi_list)]
            
            # Erstelle Metrik
            metric = {
                'portfolio_id': portfolio_id,
                'instance_id': None,  # Optional: Wird später bei Bedarf gesetzt
                'project_id': project_id,  # Verknüpfung zum Projekt
                'kpi_id': kpi_id,
                'step_id': str((idx % 10) + 1),  # Verteile auf Steps 1-10
                'target_value': target_value,
                'actual_value': actual_value,
                'updated_at': datetime.now().isoformat()
            }
            
            all_metrics.append(metric)
            project_metric_values.append(actual_value)
        
        # Berechne tatsächlichen Durchschnitt für dieses Projekt
        avg_progress = sum(project_metric_values) / len(project_metric_values) if project_metric_values else 0
        
        # Status-Emoji basierend auf Progress
        if avg_progress >= 80:
            status_emoji = '✅'
            color = 'green'
        elif avg_progress >= 50:
            status_emoji = '⚠️ '
            color = 'yellow'
        else:
            status_emoji = '🔴'
            color = 'red'
        
        console.print(f"  {status_emoji} [{color}]{project_name}: {avg_progress:.0f}%[/{color}]")
    
    # Batch Insert
    try:
        result = supabase.table('pmo_kpi_values').insert(all_metrics).execute()
        console.print(f"\n  ✓ [green]{len(all_metrics)} KPI-Werte für {len(projects)} Projekte erstellt[/green]")
        return result.data
    except Exception as e:
        console.print(f"  ❌ Fehler beim Erstellen der KPI-Werte: {e}")
        console.print(f"     Details: {str(e)}")
        return []


def show_summary(portfolios):
    """Zeige Zusammenfassung der erstellten Daten"""
    console.print("\n[bold green]✅ Seeding abgeschlossen![/bold green]\n")
    
    table = Table(title="Erstellte Portfolios", show_header=True, header_style="bold magenta")
    table.add_column("Name", style="cyan", width=50)
    table.add_column("Description", style="yellow", width=50)
    table.add_column("ID", style="dim", width=36)
    
    for p in portfolios:
        table.add_row(
            p['name'],
            p.get('description', '-')[:50],  # Kürze auf 50 Zeichen
            p['id']
        )
    
    console.print(table)
    
    console.print("\n[bold cyan]Nächste Schritte:[/bold cyan]")
    console.print("1. Öffne die App: [link]http://localhost:3002[/link]")
    console.print("2. Wähle ein Portfolio im Dropdown aus")
    console.print("3. Beobachte den Portfolio Health Hub in der Mitte!")
    console.print("\n[dim]Zum Löschen aller Testdaten: DELETE FROM pmo_portfolios WHERE name LIKE '%[DUMMY]%';[/dim]")


def cleanup_dummy_data():
    """Lösche alle bestehenden [DUMMY] Daten"""
    console.print("\n[bold yellow]🧹 Lösche bestehende [DUMMY] Daten...[/bold yellow]")
    
    try:
        # Lösche Metriken (via CASCADE)
        result = supabase.table('pmo_portfolios').delete().like('name', '%[DUMMY]%').execute()
        deleted_count = len(result.data) if result.data else 0
        console.print(f"  ✓ {deleted_count} Dummy-Portfolios gelöscht (inkl. abhängige Daten)")
    except Exception as e:
        console.print(f"  ⚠ Fehler beim Löschen: {e}")


def main():
    """Hauptfunktion"""
    console.print("\n[bold magenta]🌱 PMO Data Seeder[/bold magenta]")
    console.print("[dim]Erstellt Testdaten für das PMO Impact Cycle System[/dim]\n")
    
    # 0. Lade KPI-IDs aus der Library (erstellt Minimal-KPIs falls leer)
    if not load_kpi_ids():
        console.print("[red]❌ Abbruch: Konnte keine KPIs laden oder erstellen![/red]")
        return
    
    # Cleanup bestehende Dummy-Daten
    cleanup_dummy_data()
    
    # 1. Portfolios erstellen
    portfolios = create_portfolios()
    if len(portfolios) < 2:
        console.print("[red]❌ Fehler: Nicht genug Portfolios erstellt![/red]")
        return
    
    # 2. Projekte erstellen
    portfolio_ids = [p['id'] for p in portfolios]
    projects = create_projects(portfolio_ids)
    
    if len(projects) < 6:
        console.print("[red]❌ Fehler: Nicht genug Projekte erstellt![/red]")
        return
    
    # 3. KPI-Werte für Projekte erstellen (mit unterschiedlichen Progress-Leveln)
    create_project_kpi_values(projects, portfolios[0]['id'])
    
    # 4. Zusammenfassung
    show_summary(portfolios)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n\n[yellow]⚠ Abgebrochen durch Benutzer[/yellow]")
        sys.exit(0)
    except Exception as e:
        console.print(f"\n[red]❌ Unerwarteter Fehler: {e}[/red]")
        import traceback
        traceback.print_exc()
        sys.exit(1)

