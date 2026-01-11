#!/usr/bin/env python3
"""
Master Workflow: PDF → Vector DB Pipeline
==========================================

Führt den kompletten Workflow aus:
1. LlamaParse Setup Check
2. PDF Extraction
3. Quality Comparison
4. Vector DB Preparation

Author: AI Assistant
Date: 2026-01-11
"""

import sys
import subprocess
from pathlib import Path
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Confirm

console = Console()

SCRIPTS = {
    "setup": "setup_llamaparse.py",
    "extract": "extract_with_llamaparse.py",
    "compare": "compare_extraction_quality.py",
    "vectordb": "prepare_vector_db.py",
}


def run_script(script_name: str, script_path: str) -> bool:
    """Führt ein Python-Script aus."""
    console.print(f"\n[bold cyan]▶ Running: {script_name}[/bold cyan]")
    console.print(f"[dim]Script: {script_path}[/dim]\n")
    
    try:
        result = subprocess.run(
            [sys.executable, script_path],
            check=True,
            capture_output=False  # Zeige Output direkt
        )
        
        console.print(f"\n[green]✅ {script_name} completed successfully![/green]")
        return True
        
    except subprocess.CalledProcessError as e:
        console.print(f"\n[red]❌ {script_name} failed with exit code {e.returncode}[/red]")
        return False
    except KeyboardInterrupt:
        console.print(f"\n[yellow]⚠️  {script_name} interrupted by user[/yellow]")
        return False


def main():
    """Master Workflow."""
    
    console.print(Panel.fit(
        "[bold magenta]🚀 PMO Value Generator - Master Workflow[/bold magenta]\n\n"
        "[dim]Komplette Pipeline: PDF → Markdown → Vector DB[/dim]\n\n"
        "Steps:\n"
        "1. ✅ Setup & API Key Check\n"
        "2. 📄 PDF Extraction mit LlamaParse\n"
        "3. 🔍 Quality Comparison (PyMuPDF vs LlamaParse)\n"
        "4. 🔮 Vector DB Preparation (RAG-Ready)",
        border_style="magenta"
    ))
    
    # Step 1: Setup
    console.print("\n" + "="*80)
    console.print("[bold]Step 1/4: Setup & API Key Check[/bold]")
    
    if not Confirm.ask("\n[yellow]Setup ausführen?[/yellow]", default=True):
        console.print("[yellow]⚠️  Überspringe Setup (stelle sicher, dass API Keys konfiguriert sind)[/yellow]")
    else:
        if not run_script("Setup", SCRIPTS["setup"]):
            console.print("\n[red]❌ Setup fehlgeschlagen. Bitte behebe die Fehler und versuche es erneut.[/red]")
            return
    
    # Step 2: Extraction
    console.print("\n" + "="*80)
    console.print("[bold]Step 2/4: PDF Extraction mit LlamaParse[/bold]")
    console.print("[yellow]⚠️  Dies kostet ~$5.87 für 2.955 Seiten (erste 1.000 Seiten free)[/yellow]")
    
    if not Confirm.ask("\n[yellow]PDF Extraction starten?[/yellow]", default=True):
        console.print("[yellow]⚠️  Überspringe Extraction[/yellow]")
    else:
        if not run_script("Extraction", SCRIPTS["extract"]):
            console.print("\n[red]❌ Extraction fehlgeschlagen.[/red]")
            if not Confirm.ask("[yellow]Trotzdem fortfahren?[/yellow]", default=False):
                return
    
    # Step 3: Quality Comparison
    console.print("\n" + "="*80)
    console.print("[bold]Step 3/4: Quality Comparison[/bold]")
    
    if not Confirm.ask("\n[yellow]Qualitäts-Vergleich durchführen?[/yellow]", default=True):
        console.print("[yellow]⚠️  Überspringe Comparison[/yellow]")
    else:
        if not run_script("Comparison", SCRIPTS["compare"]):
            console.print("\n[yellow]⚠️  Comparison fehlgeschlagen (nicht kritisch)[/yellow]")
    
    # Step 4: Vector DB
    console.print("\n" + "="*80)
    console.print("[bold]Step 4/4: Vector DB Preparation[/bold]")
    console.print("[dim]Bereitet Daten für RAG/KI-Chatbot vor[/dim]")
    
    if not Confirm.ask("\n[yellow]Vector DB erstellen?[/yellow]", default=True):
        console.print("[yellow]⚠️  Überspringe Vector DB[/yellow]")
    else:
        if not run_script("Vector DB", SCRIPTS["vectordb"]):
            console.print("\n[red]❌ Vector DB preparation fehlgeschlagen.[/red]")
            return
    
    # Success!
    console.print("\n" + "="*80)
    console.print(Panel.fit(
        "[bold green]🎉 WORKFLOW COMPLETE![/bold green]\n\n"
        "✅ PDFs extrahiert mit LlamaParse\n"
        "✅ Qualität verglichen (PyMuPDF vs LlamaParse)\n"
        "✅ Vector DB erstellt (RAG-Ready)\n\n"
        "[bold cyan]🤖 Deine PMO Knowledge Base ist bereit![/bold cyan]\n\n"
        "Next Steps:\n"
        "1. Integriere Vector DB in dein Backend\n"
        "2. Baue KI-Chatbot für PMO-Wissen\n"
        "3. Nutze für automatische KPI-Empfehlungen\n\n"
        "[dim]Siehe: extraction/README_LLAMAPARSE.md für Details[/dim]",
        border_style="green"
    ))


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        console.print("\n\n[yellow]⚠️  Workflow abgebrochen.[/yellow]")
        sys.exit(1)

