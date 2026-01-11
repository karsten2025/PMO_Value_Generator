#!/usr/bin/env python3
"""
LlamaParse Setup & Configuration Script
========================================

Dieses Script hilft dir beim Setup von LlamaParse für die PMO Knowledge Base.

Author: AI Assistant
Date: 2026-01-11
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt, Confirm

console = Console()

def check_api_key() -> bool:
    """Prüft, ob LLAMA_CLOUD_API_KEY gesetzt ist."""
    load_dotenv()
    api_key = os.getenv("LLAMA_CLOUD_API_KEY")
    
    if api_key and api_key != "llx-your-key-here":
        console.print("✅ [green]LLAMA_CLOUD_API_KEY gefunden![/green]")
        console.print(f"   Key: {api_key[:10]}...{api_key[-4:]}")
        return True
    else:
        console.print("❌ [red]LLAMA_CLOUD_API_KEY nicht gefunden![/red]")
        return False

def setup_api_key():
    """Interaktives Setup für API-Key."""
    console.print(Panel.fit(
        "[bold cyan]🔑 LlamaParse API Key Setup[/bold cyan]\n\n"
        "1. Gehe zu: https://cloud.llamaindex.ai/api-key\n"
        "2. Registriere dich (GitHub Login möglich)\n"
        "3. Erstelle einen API Key\n"
        "4. Kopiere den Key hierher",
        border_style="cyan"
    ))
    
    api_key = Prompt.ask("\n[yellow]Paste deinen LlamaParse API Key[/yellow]")
    
    # Erstelle .env file
    env_file = Path("extraction/.env")
    
    if env_file.exists():
        if not Confirm.ask(f"\n⚠️  {env_file} existiert bereits. Überschreiben?"):
            console.print("[yellow]Abgebrochen.[/yellow]")
            return False
    
    with open(env_file, "w") as f:
        f.write(f"# LlamaParse Configuration\n")
        f.write(f"LLAMA_CLOUD_API_KEY={api_key}\n")
        f.write(f"\n# Optional: OpenAI API Key (für Embeddings)\n")
        f.write(f"# OPENAI_API_KEY=sk-your-key-here\n")
    
    console.print(f"\n✅ [green]API Key gespeichert in: {env_file}[/green]")
    return True

def test_connection():
    """Testet die Verbindung zu LlamaParse."""
    console.print("\n[cyan]🔌 Teste LlamaParse Verbindung...[/cyan]")
    
    try:
        from llama_parse import LlamaParse
        
        load_dotenv()
        api_key = os.getenv("LLAMA_CLOUD_API_KEY")
        
        if not api_key:
            console.print("[red]❌ API Key nicht gefunden![/red]")
            return False
        
        # Initialisiere Parser (testet API Key)
        parser = LlamaParse(
            api_key=api_key,
            result_type="markdown",
            verbose=False
        )
        
        console.print("✅ [green]Verbindung erfolgreich![/green]")
        console.print("   [dim]Parser initialisiert und bereit.[/dim]")
        return True
        
    except ImportError:
        console.print("[red]❌ llama-parse nicht installiert![/red]")
        console.print("   Führe aus: [yellow]pip install -r extraction/requirements_llamaparse.txt[/yellow]")
        return False
    except Exception as e:
        console.print(f"[red]❌ Fehler: {e}[/red]")
        return False

def check_pdfs():
    """Prüft, ob PDFs vorhanden sind."""
    pdf_dir = Path("knowledge_base_pdf")
    
    if not pdf_dir.exists():
        console.print(f"[red]❌ {pdf_dir} nicht gefunden![/red]")
        return False
    
    pdfs = list(pdf_dir.glob("*.pdf"))
    
    if not pdfs:
        console.print(f"[red]❌ Keine PDFs in {pdf_dir} gefunden![/red]")
        return False
    
    console.print(f"\n✅ [green]{len(pdfs)} PDFs gefunden:[/green]")
    
    total_size = 0
    for pdf in pdfs:
        size_mb = pdf.stat().st_size / (1024 * 1024)
        total_size += size_mb
        console.print(f"   • {pdf.name} ({size_mb:.1f} MB)")
    
    console.print(f"\n   [cyan]Total: {total_size:.1f} MB[/cyan]")
    return True

def main():
    """Haupt-Setup-Routine."""
    console.print(Panel.fit(
        "[bold magenta]🚀 PMO Value Generator - LlamaParse Setup[/bold magenta]\n"
        "[dim]Bereitet die PDF-Extraktion mit LlamaParse vor[/dim]",
        border_style="magenta"
    ))
    
    # Step 1: API Key Check
    console.print("\n[bold]Step 1: API Key Check[/bold]")
    if not check_api_key():
        if Confirm.ask("\n[yellow]API Key jetzt einrichten?[/yellow]", default=True):
            if not setup_api_key():
                console.print("[red]Setup abgebrochen.[/red]")
                sys.exit(1)
        else:
            console.print("\n[yellow]⚠️  Setup ohne API Key nicht möglich.[/yellow]")
            console.print("   Führe später aus: [cyan]python extraction/setup_llamaparse.py[/cyan]")
            sys.exit(1)
    
    # Step 2: Dependencies Check
    console.print("\n[bold]Step 2: Dependencies Check[/bold]")
    try:
        import llama_parse
        import chromadb
        from rich import print as rprint
        console.print("✅ [green]Alle Dependencies installiert[/green]")
    except ImportError as e:
        console.print(f"[red]❌ Fehlende Dependencies: {e}[/red]")
        console.print("\n[yellow]Installiere mit:[/yellow]")
        console.print("   [cyan]pip install -r extraction/requirements_llamaparse.txt[/cyan]")
        sys.exit(1)
    
    # Step 3: Connection Test
    console.print("\n[bold]Step 3: Connection Test[/bold]")
    if not test_connection():
        console.print("[red]❌ Setup fehlgeschlagen![/red]")
        sys.exit(1)
    
    # Step 4: PDF Check
    console.print("\n[bold]Step 4: PDF Check[/bold]")
    if not check_pdfs():
        console.print("[yellow]⚠️  Lege PDFs im Ordner knowledge_base_pdf/ ab[/yellow]")
    
    # Success!
    console.print("\n" + "="*60)
    console.print(Panel.fit(
        "[bold green]✅ SETUP ERFOLGREICH![/bold green]\n\n"
        "Nächste Schritte:\n"
        "1. [cyan]python extraction/extract_with_llamaparse.py[/cyan]\n"
        "   → Extrahiert alle PDFs mit LlamaParse\n\n"
        "2. [cyan]python extraction/compare_extraction_quality.py[/cyan]\n"
        "   → Vergleicht PyMuPDF vs. LlamaParse Qualität\n\n"
        "3. [cyan]python extraction/prepare_vector_db.py[/cyan]\n"
        "   → Bereitet Daten für RAG/Chatbot vor",
        border_style="green"
    ))

if __name__ == "__main__":
    main()

