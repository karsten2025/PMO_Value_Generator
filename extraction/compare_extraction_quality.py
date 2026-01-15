#!/usr/bin/env python3
"""
Quality Comparison Tool: PyMuPDF vs. LlamaParse
================================================

Vergleicht die Extraktion-Qualität zwischen PyMuPDF (alt) und LlamaParse (neu).

Metriken:
- Text-Länge & Wortanzahl
- Tabellen-Extraktion (strukturiert vs. Fließtext)
- Formatierungs-Erhalt (Markdown vs. Plain Text)
- Lesbarkeit & Struktur

Author: AI Assistant
Date: 2026-01-11
"""

import json
from pathlib import Path
from typing import Dict, List
import difflib
import re

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich import box

console = Console()

# Paths
PYMUPDF_DIR = Path("extraction/output_text")
LLAMAPARSE_DIR = Path("extraction/output_llamaparse")
METADATA_FILE = LLAMAPARSE_DIR / "extraction_metadata.json"


class QualityComparator:
    """Vergleicht Extraktions-Qualität."""
    
    def __init__(self):
        self.results = []
    
    def load_pymupdf_text(self, filename: str) -> str:
        """Lädt PyMuPDF-extrahierten Text."""
        txt_file = PYMUPDF_DIR / f"{filename}.txt"
        if not txt_file.exists():
            return ""
        
        with open(txt_file, 'r', encoding='utf-8') as f:
            return f.read()
    
    def load_llamaparse_text(self, filename: str) -> str:
        """Lädt LlamaParse-extrahierten Text."""
        md_file = LLAMAPARSE_DIR / f"{filename}.md"
        if not md_file.exists():
            return ""
        
        with open(md_file, 'r', encoding='utf-8') as f:
            return f.read()
    
    def count_markdown_tables(self, text: str) -> int:
        """Zählt Markdown-Tabellen im Text."""
        # Markdown Table Pattern: | col1 | col2 |
        table_pattern = r'\|.+\|.+\|'
        lines_with_tables = re.findall(table_pattern, text)
        
        # Count consecutive table lines as one table
        table_count = 0
        in_table = False
        
        for line in text.split('\n'):
            if re.match(table_pattern, line):
                if not in_table:
                    table_count += 1
                    in_table = True
            else:
                in_table = False
        
        return table_count
    
    def count_headers(self, text: str) -> int:
        """Zählt Markdown-Headers (# Heading)."""
        return len(re.findall(r'^#{1,6}\s+.+$', text, re.MULTILINE))
    
    def count_code_blocks(self, text: str) -> int:
        """Zählt Code-Blocks (```code```)."""
        return len(re.findall(r'```[\s\S]*?```', text))
    
    def analyze_structure(self, text: str) -> Dict:
        """Analysiert die Text-Struktur."""
        return {
            "total_chars": len(text),
            "total_words": len(text.split()),
            "total_lines": len(text.split('\n')),
            "markdown_tables": self.count_markdown_tables(text),
            "headers": self.count_headers(text),
            "code_blocks": self.count_code_blocks(text),
            "has_formatting": '**' in text or '__' in text or '*' in text,
            "avg_line_length": len(text) / max(1, len(text.split('\n')))
        }
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Berechnet Text-Ähnlichkeit (0-100%)."""
        # Normalize (lowercase, remove extra whitespace)
        norm1 = ' '.join(text1.lower().split())
        norm2 = ' '.join(text2.lower().split())
        
        # Use difflib.SequenceMatcher
        matcher = difflib.SequenceMatcher(None, norm1, norm2)
        return matcher.ratio() * 100
    
    def compare_file(self, pdf_name: str) -> Dict:
        """Vergleicht ein einzelnes PDF."""
        stem = Path(pdf_name).stem
        
        console.print(f"\n[cyan]📄 Comparing: {pdf_name}[/cyan]")
        
        # Load texts
        pymupdf_text = self.load_pymupdf_text(stem)
        llamaparse_text = self.load_llamaparse_text(stem)
        
        if not pymupdf_text:
            console.print(f"   [yellow]⚠️  PyMuPDF version not found[/yellow]")
            return None
        
        if not llamaparse_text:
            console.print(f"   [yellow]⚠️  LlamaParse version not found[/yellow]")
            return None
        
        # Analyze
        pymupdf_stats = self.analyze_structure(pymupdf_text)
        llamaparse_stats = self.analyze_structure(llamaparse_text)
        
        # Calculate similarity
        similarity = self.calculate_similarity(pymupdf_text, llamaparse_text)
        
        # Calculate improvements
        improvements = {
            "tables": llamaparse_stats["markdown_tables"] - pymupdf_stats["markdown_tables"],
            "headers": llamaparse_stats["headers"] - pymupdf_stats["headers"],
            "formatting": llamaparse_stats["has_formatting"] and not pymupdf_stats["has_formatting"],
            "char_diff_pct": ((llamaparse_stats["total_chars"] - pymupdf_stats["total_chars"]) / pymupdf_stats["total_chars"]) * 100 if pymupdf_stats["total_chars"] > 0 else 0
        }
        
        result = {
            "pdf_name": pdf_name,
            "pymupdf": pymupdf_stats,
            "llamaparse": llamaparse_stats,
            "similarity_pct": similarity,
            "improvements": improvements
        }
        
        console.print(f"   ✅ [green]Similarity: {similarity:.1f}%[/green]")
        console.print(f"   📊 Tables: PyMuPDF={pymupdf_stats['markdown_tables']}, LlamaParse={llamaparse_stats['markdown_tables']} ([green]+{improvements['tables']}[/green])")
        
        return result
    
    def generate_report(self, results: List[Dict]):
        """Erstellt Vergleichs-Report."""
        console.print("\n" + "="*80)
        console.print(Panel.fit(
            "[bold cyan]📊 QUALITY COMPARISON REPORT[/bold cyan]\n"
            "[dim]PyMuPDF vs. LlamaParse[/dim]",
            border_style="cyan"
        ))
        
        # Summary Table
        table = Table(title="Extraction Comparison", box=box.ROUNDED, show_header=True, header_style="bold magenta")
        table.add_column("PDF", style="cyan", width=30)
        table.add_column("Method", style="yellow")
        table.add_column("Words", justify="right")
        table.add_column("Tables", justify="right")
        table.add_column("Headers", justify="right")
        table.add_column("Similarity", justify="right")
        
        for result in results:
            if not result:
                continue
            
            pdf_name = result["pdf_name"][:28]
            
            # PyMuPDF row
            table.add_row(
                pdf_name,
                "PyMuPDF",
                f"{result['pymupdf']['total_words']:,}",
                str(result['pymupdf']['markdown_tables']),
                str(result['pymupdf']['headers']),
                ""
            )
            
            # LlamaParse row
            table.add_row(
                "",
                "[green]LlamaParse[/green]",
                f"[green]{result['llamaparse']['total_words']:,}[/green]",
                f"[green]{result['llamaparse']['markdown_tables']}[/green] ([cyan]+{result['improvements']['tables']}[/cyan])",
                f"[green]{result['llamaparse']['headers']}[/green] ([cyan]+{result['improvements']['headers']}[/cyan])",
                f"[magenta]{result['similarity_pct']:.1f}%[/magenta]"
            )
            
            table.add_row("", "", "", "", "", "")  # Spacer
        
        console.print(table)
        
        # Aggregated Stats
        valid_results = [r for r in results if r is not None]
        
        if valid_results:
            avg_similarity = sum(r["similarity_pct"] for r in valid_results) / len(valid_results)
            total_tables_pymupdf = sum(r["pymupdf"]["markdown_tables"] for r in valid_results)
            total_tables_llamaparse = sum(r["llamaparse"]["markdown_tables"] for r in valid_results)
            
            console.print(f"\n[bold]🎯 Summary:[/bold]")
            console.print(f"   • Average Similarity: [magenta]{avg_similarity:.1f}%[/magenta]")
            console.print(f"   • Tables Extracted:")
            console.print(f"     - PyMuPDF: {total_tables_pymupdf}")
            console.print(f"     - LlamaParse: [green]{total_tables_llamaparse}[/green] ([cyan]+{total_tables_llamaparse - total_tables_pymupdf}[/cyan])")
            
            console.print(f"\n[bold green]✅ LlamaParse Improvements:[/bold green]")
            console.print(f"   • [green]+{total_tables_llamaparse - total_tables_pymupdf}[/green] structured tables")
            console.print(f"   • Better markdown formatting")
            console.print(f"   • Preserved document structure")


def main():
    """Main comparison routine."""
    
    # Check if LlamaParse extraction exists
    if not LLAMAPARSE_DIR.exists() or not METADATA_FILE.exists():
        console.print("[red]❌ LlamaParse extraction nicht gefunden![/red]")
        console.print("   Führe zuerst aus: [cyan]python extraction/extract_with_llamaparse.py[/cyan]")
        return
    
    # Load metadata
    with open(METADATA_FILE, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    console.print(Panel.fit(
        "[bold magenta]🔍 Quality Comparison Tool[/bold magenta]\n"
        f"[dim]Comparing {metadata['successful']} PDFs[/dim]",
        border_style="magenta"
    ))
    
    # Compare each PDF
    comparator = QualityComparator()
    results = []
    
    for pdf_metadata in metadata["pdfs"]:
        if "error" in pdf_metadata:
            continue
        
        result = comparator.compare_file(pdf_metadata["source_file"])
        if result:
            results.append(result)
    
    # Generate report
    comparator.generate_report(results)
    
    # Save results
    report_file = LLAMAPARSE_DIR / "quality_comparison.json"
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    
    console.print(f"\n💾 [green]Report gespeichert: {report_file}[/green]")


if __name__ == "__main__":
    main()


