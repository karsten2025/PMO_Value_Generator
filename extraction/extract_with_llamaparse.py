#!/usr/bin/env python3
"""
LlamaParse PDF Extraction Script
=================================

Extrahiert alle PMO-PDFs mit LlamaParse und nutzt den Free Tier optimal aus.

KOSTENOPTIMIERUNG:
- Erste 1.000 Seiten = Free
- Danach: $0.003 pro Seite
- Total für 2.955 Seiten: ~$5.87

Author: AI Assistant
Date: 2026-01-11
"""

import os
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict
import time

from dotenv import load_dotenv
from llama_parse import LlamaParse
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeElapsedColumn
from rich.table import Table
from rich.panel import Panel

console = Console()

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")

# Configuration
PDF_DIR = Path("../knowledge_base_pdf")  # Ein Ordner höher!
OUTPUT_DIR = Path("output_llamaparse")
METADATA_FILE = OUTPUT_DIR / "extraction_metadata.json"

# PDF Priority (Free Tier optimiert: Wichtigste zuerst!)
PDF_PRIORITY = [
    # === BATCH 1: FREE TIER (1.000 Seiten) ===
    ("pmo_practiceguide_eng.pdf", 342, "critical"),
    ("pmbokguide_eighthed_eng.pdf", 401, "critical"),
    ("pmi_guide to ba.pdf", 490, "critical"),  # Nur erste 257 Seiten free
    
    # === BATCH 2: PAID ($5.87) ===
    ("Process Mining Handbook. 2022.pdf", 503, "important"),
    ("processgroupspracticeguide_eng.pdf", 367, "important"),
    ("standardforprogrammanagementfifthed.pdf", 262, "important"),
    ("AgilePracticeGuide.pdf", 184, "normal"),
    ("riskmanagementpracticeguide.pdf", 165, "normal"),
    ("ChooseYourWoW_SecondEdition.pdf", 137, "normal"),
    ("TheStandardForOPM.pdf", 104, "normal"),
]


class LlamaParseExtractor:
    """Wrapper für LlamaParse mit Kostenoptimierung."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.parser = LlamaParse(
            api_key=api_key,
            result_type="markdown",
            language="mixed",  # Auto-detect DE/EN/ES
            verbose=True,
            show_progress=True,
            premium_mode=False,  # False = günstiger, True = bessere Qualität
        )
        self.total_pages_processed = 0
        self.free_tier_remaining = 1000
    
    def extract_pdf(self, pdf_path: Path) -> Dict:
        """Extrahiert ein einzelnes PDF."""
        console.print(f"\n[cyan]📄 Processing: {pdf_path.name}[/cyan]")
        
        start_time = time.time()
        
        try:
            # Parse PDF
            documents = self.parser.load_data(str(pdf_path))
            
            # Combine all pages
            full_text = "\n\n".join([doc.text for doc in documents])
            
            # Extract metadata
            metadata = {
                "source_file": pdf_path.name,
                "extraction_date": datetime.now().isoformat(),
                "num_documents": len(documents),
                "num_characters": len(full_text),
                "num_words": len(full_text.split()),
                "processing_time_seconds": time.time() - start_time,
                "extractor": "LlamaParse",
                "result_type": "markdown"
            }
            
            # Estimate pages (nicht immer verfügbar)
            if documents and hasattr(documents[0], 'metadata'):
                estimated_pages = documents[0].metadata.get('total_pages', 'unknown')
                metadata['estimated_pages'] = estimated_pages
            
            console.print(f"   ✅ [green]Extracted {len(full_text):,} characters[/green]")
            console.print(f"   ⏱️  [dim]Time: {metadata['processing_time_seconds']:.1f}s[/dim]")
            
            return {
                "text": full_text,
                "metadata": metadata,
                "success": True
            }
            
        except Exception as e:
            console.print(f"   ❌ [red]Error: {e}[/red]")
            return {
                "text": "",
                "metadata": {
                    "source_file": pdf_path.name,
                    "extraction_date": datetime.now().isoformat(),
                    "error": str(e)
                },
                "success": False
            }
    
    def calculate_cost(self, pages: int) -> float:
        """Berechnet Kosten für gegebene Seitenzahl."""
        if pages <= self.free_tier_remaining:
            return 0.0
        else:
            paid_pages = pages - max(0, self.free_tier_remaining)
            return paid_pages * 0.003


def main():
    """Haupt-Extraction-Routine."""
    
    # Setup
    console.print(Panel.fit(
        "[bold magenta]🚀 LlamaParse Batch Extraction[/bold magenta]\n"
        "[dim]Extrahiert alle PMO-PDFs mit optimaler Kostennutzung[/dim]",
        border_style="magenta"
    ))
    
    # Check API Key
    api_key = os.getenv("LLAMA_CLOUD_API_KEY")
    if not api_key or api_key == "llx-your-key-here":
        console.print("\n[red]❌ LLAMA_CLOUD_API_KEY nicht gesetzt![/red]")
        console.print("   Führe zuerst aus: [cyan]python extraction/setup_llamaparse.py[/cyan]")
        return
    
    # Create output directory
    OUTPUT_DIR.mkdir(exist_ok=True, parents=True)
    
    # Initialize extractor
    extractor = LlamaParseExtractor(api_key)
    
    # Cost calculation
    console.print("\n[bold]📊 Kostenanalyse:[/bold]")
    total_pages = sum(pages for _, pages, _ in PDF_PRIORITY)
    free_pages = min(1000, total_pages)
    paid_pages = max(0, total_pages - 1000)
    total_cost = paid_pages * 0.003
    
    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Kategorie", style="cyan")
    table.add_column("Seiten", justify="right")
    table.add_column("Kosten", justify="right")
    
    table.add_row("Free Tier", f"{free_pages:,}", "$0.00")
    table.add_row("Paid", f"{paid_pages:,}", f"${paid_pages * 0.003:.2f}")
    table.add_row("[bold]TOTAL[/bold]", f"[bold]{total_pages:,}[/bold]", f"[bold green]${total_cost:.2f}[/bold green]")
    
    console.print(table)
    
    if not console.input("\n[yellow]⚠️  Fortfahren? (y/n):[/yellow] ").lower().startswith('y'):
        console.print("[red]Abgebrochen.[/red]")
        return
    
    # Process PDFs
    results = []
    pages_processed = 0
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.completed}/{task.total}"),
        TimeElapsedColumn(),
        console=console
    ) as progress:
        
        task = progress.add_task("[cyan]Extracting PDFs...", total=len(PDF_PRIORITY))
        
        for pdf_name, estimated_pages, priority in PDF_PRIORITY:
            pdf_path = PDF_DIR / pdf_name
            
            if not pdf_path.exists():
                console.print(f"\n[yellow]⚠️  {pdf_name} nicht gefunden, überspringe...[/yellow]")
                progress.advance(task)
                continue
            
            # Update free tier
            extractor.free_tier_remaining = max(0, 1000 - pages_processed)
            cost_for_this = extractor.calculate_cost(estimated_pages)
            
            console.print(f"\n[dim]Free Tier remaining: {extractor.free_tier_remaining} pages[/dim]")
            console.print(f"[dim]Cost for this PDF: ${cost_for_this:.2f}[/dim]")
            
            # Extract
            result = extractor.extract_pdf(pdf_path)
            
            if result["success"]:
                # Save markdown
                output_file = OUTPUT_DIR / f"{pdf_path.stem}.md"
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(f"# {pdf_path.stem}\n\n")
                    f.write(f"**Extracted with LlamaParse on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}**\n\n")
                    f.write(f"---\n\n")
                    f.write(result["text"])
                
                console.print(f"   💾 [green]Saved: {output_file}[/green]")
                
                # Update metadata
                result["metadata"]["output_file"] = str(output_file)
                result["metadata"]["estimated_pages"] = estimated_pages
                result["metadata"]["priority"] = priority
                result["metadata"]["cost_usd"] = cost_for_this
                
                pages_processed += estimated_pages
            
            results.append(result)
            progress.advance(task)
    
    # Save metadata
    metadata_summary = {
        "extraction_date": datetime.now().isoformat(),
        "total_pdfs": len(PDF_PRIORITY),
        "successful": sum(1 for r in results if r["success"]),
        "failed": sum(1 for r in results if not r["success"]),
        "total_pages_processed": pages_processed,
        "free_tier_used": min(1000, pages_processed),
        "paid_pages": max(0, pages_processed - 1000),
        "total_cost_usd": max(0, pages_processed - 1000) * 0.003,
        "pdfs": [r["metadata"] for r in results]
    }
    
    with open(METADATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(metadata_summary, f, indent=2, ensure_ascii=False)
    
    console.print(f"\n💾 [green]Metadata gespeichert: {METADATA_FILE}[/green]")
    
    # Summary
    console.print("\n" + "="*60)
    console.print(Panel.fit(
        f"[bold green]✅ EXTRACTION COMPLETE![/bold green]\n\n"
        f"PDFs processed: {metadata_summary['successful']}/{metadata_summary['total_pdfs']}\n"
        f"Total pages: {pages_processed:,}\n"
        f"Free tier used: {metadata_summary['free_tier_used']:,} pages\n"
        f"Paid pages: {metadata_summary['paid_pages']:,}\n"
        f"[bold cyan]Total cost: ${metadata_summary['total_cost_usd']:.2f}[/bold cyan]\n\n"
        f"Output: [cyan]{OUTPUT_DIR}[/cyan]",
        border_style="green"
    ))
    
    # Next steps
    console.print("\n[bold]🎯 Nächste Schritte:[/bold]")
    console.print("1. [cyan]python extraction/compare_extraction_quality.py[/cyan]")
    console.print("   → Vergleiche Qualität mit PyMuPDF")
    console.print("\n2. [cyan]python extraction/prepare_vector_db.py[/cyan]")
    console.print("   → Bereite für Vector DB / RAG vor")


if __name__ == "__main__":
    main()

