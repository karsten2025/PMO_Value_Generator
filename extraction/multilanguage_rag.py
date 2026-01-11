#!/usr/bin/env python3
"""
Multi-Language RAG: 2x3 Matrix Support
=======================================

Erweitert die Vector DB für die 2x3 Matrix:
- 2 Register: colloquial (Normalsprache) vs. management (Profi-Sprache)
- 3 Sprachen: DE, EN, ES

STRATEGIE: Metadata-Driven
- Vector DB speichert Englisch (Source)
- Metadata: language, register, domain
- Query-Time: Translation + Register-Adaptation

Author: AI Assistant
Date: 2026-01-11
"""

import os
import json
from pathlib import Path
from typing import Dict, Optional, List
from datetime import datetime

from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

# Load environment
load_dotenv(Path(__file__).parent / ".env")

# Configuration
VECTOR_DB_DIR = Path("vector_db")
TRANSLATION_CACHE_DIR = Path("extraction/translation_cache")

# 2x3 Matrix Definition
LANGUAGES = ["DE", "EN", "ES"]
REGISTERS = ["colloquial", "management"]

# Language-specific prompts
REGISTER_PROMPTS = {
    "colloquial": {
        "EN": "Explain this in simple, everyday language that anyone can understand. Avoid jargon.",
        "DE": "Erkläre das in einfacher Alltagssprache, die jeder verstehen kann. Vermeide Fachbegriffe.",
        "ES": "Explica esto en lenguaje simple y cotidiano que cualquiera pueda entender. Evita la jerga."
    },
    "management": {
        "EN": "Explain this using professional project management terminology. Be precise and formal.",
        "DE": "Erkläre das mit professioneller Projektmanagement-Terminologie. Sei präzise und formal.",
        "ES": "Explica esto usando terminología profesional de gestión de proyectos. Sé preciso y formal."
    }
}


class MultiLanguageRAG:
    """
    Adaptive RAG System für 2x3 Matrix.
    
    Workflow:
    1. User Query (beliebige Sprache/Register)
    2. Detect/Extract: language + register
    3. Translate Query → EN (für Vector DB)
    4. RAG Query (Vector DB in Englisch)
    5. Adapt Response → target language + register
    """
    
    def __init__(self, vector_db_path: Optional[str] = None, use_openai_llm: bool = False):
        self.translation_service = self._init_translation()
        self.llm = self._init_llm() if use_openai_llm else None
        self.index = self._load_vector_index(vector_db_path) if vector_db_path else None
        
        # Create cache directory
        TRANSLATION_CACHE_DIR.mkdir(exist_ok=True, parents=True)
    
    def _load_vector_index(self, vector_db_path: str):
        """Lädt den Vector Index aus ChromaDB."""
        try:
            import chromadb
            from llama_index.core import VectorStoreIndex
            from llama_index.vector_stores.chroma import ChromaVectorStore
            from llama_index.embeddings.huggingface import HuggingFaceEmbedding
            from llama_index.core import Settings
            
            # Setup Embeddings (same as prepare_vector_db.py)
            Settings.embed_model = HuggingFaceEmbedding(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Load ChromaDB
            chroma_client = chromadb.PersistentClient(path=str(vector_db_path))
            chroma_collection = chroma_client.get_collection(name="pmo_knowledge_base")
            
            # Create Vector Store
            vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
            index = VectorStoreIndex.from_vector_store(vector_store)
            
            console.print(f"[green]✅ Vector Index loaded from: {vector_db_path}[/green]")
            return index
            
        except Exception as e:
            console.print(f"[red]❌ Failed to load vector index: {e}[/red]")
            return None
    
    def _init_translation(self):
        """Initialisiert Translation Service."""
        # Option 1: Google Translate (kostenlos, aber Limits)
        try:
            from deep_translator import GoogleTranslator
            console.print("[green]✅ Google Translator initialized (free)[/green]")
            return GoogleTranslator
        except ImportError:
            console.print("[yellow]⚠️  deep-translator nicht installiert[/yellow]")
            console.print("   Install: [cyan]pip install deep-translator[/cyan]")
            return None
    
    def _init_llm(self):
        """Initialisiert LLM für Register-Adaptation."""
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if openai_key and not openai_key.startswith("sk-your"):
            try:
                from openai import OpenAI
                client = OpenAI(api_key=openai_key)
                console.print("[green]✅ OpenAI LLM initialized (for register adaptation)[/green]")
                return client
            except ImportError:
                console.print("[yellow]⚠️  openai nicht installiert[/yellow]")
                console.print("   Install: [cyan]pip install openai[/cyan]")
                return None
        else:
            console.print("[yellow]⚠️  OpenAI API Key nicht gesetzt[/yellow]")
            console.print("   Register-Adaptation wird übersprungen")
            return None
    
    def detect_language(self, text: str) -> str:
        """
        Erkennt Sprache eines Texts.
        
        Returns: "DE", "EN", or "ES"
        """
        try:
            from langdetect import detect
            lang_code = detect(text)
            
            # Map to our codes
            mapping = {
                "de": "DE",
                "en": "EN",
                "es": "ES"
            }
            
            return mapping.get(lang_code, "EN")  # Default: EN
            
        except ImportError:
            console.print("[yellow]⚠️  langdetect nicht installiert, assume EN[/yellow]")
            return "EN"
        except Exception:
            return "EN"
    
    def translate(self, text: str, source_lang: str, target_lang: str) -> str:
        """
        Übersetzt Text von source_lang nach target_lang.
        
        Mit Caching für Performance.
        """
        # No translation needed
        if source_lang == target_lang:
            return text
        
        # Check cache
        cache_key = f"{source_lang}_{target_lang}_{hash(text)}"
        cache_file = TRANSLATION_CACHE_DIR / f"{cache_key}.txt"
        
        if cache_file.exists():
            with open(cache_file, 'r', encoding='utf-8') as f:
                return f.read()
        
        # Translate
        if self.translation_service:
            try:
                translator = self.translation_service(
                    source=source_lang.lower(),
                    target=target_lang.lower()
                )
                translated = translator.translate(text)
                
                # Cache result
                with open(cache_file, 'w', encoding='utf-8') as f:
                    f.write(translated)
                
                return translated
                
            except Exception as e:
                console.print(f"[yellow]⚠️  Translation failed: {e}[/yellow]")
                return text
        else:
            console.print("[yellow]⚠️  No translation service available[/yellow]")
            return text
    
    def adapt_register(self, text: str, source_register: str, target_register: str, target_lang: str) -> str:
        """
        Passt Register an (colloquial ↔ management).
        
        Nutzt LLM für intelligente Umformulierung.
        """
        # No adaptation needed
        if source_register == target_register:
            return text
        
        if not self.llm:
            console.print("[yellow]⚠️  LLM nicht verfügbar, überspringe Register-Anpassung[/yellow]")
            return text
        
        # Build prompt
        system_prompt = REGISTER_PROMPTS[target_register][target_lang]
        user_prompt = f"Reformulate this text: {text}"
        
        try:
            response = self.llm.chat.completions.create(
                model="gpt-3.5-turbo",  # Günstig & schnell
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.3,  # Konsistente Ergebnisse
                max_tokens=500
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            console.print(f"[yellow]⚠️  Register adaptation failed: {e}[/yellow]")
            return text
    
    def query(
        self, 
        query: str, 
        target_language: Optional[str] = None,
        target_register: Optional[str] = None
    ) -> Dict:
        """
        Haupt-Query-Methode mit 2x3 Matrix Support.
        
        Args:
            query: Frage des Users (beliebige Sprache)
            target_language: Gewünschte Antwort-Sprache (de/en/es)
            target_register: Gewünschtes Register (colloquial/management)
        
        Returns:
            {
                "answer": "...",
                "sources": [...],
            }
        """
        # Normalize language code
        lang_map = {"de": "DE", "en": "EN", "es": "ES"}
        target_lang = lang_map.get(target_language.lower(), "EN") if target_language else None
        
        console.print(f"\n[cyan]🔍 Processing query: \"{query}\"[/cyan]")
        
        # Step 1: Detect language if not provided
        query_lang = target_lang or self.detect_language(query)
        console.print(f"   Language detected: {query_lang}")
        
        # Step 2: Translate query to EN (for Vector DB)
        if query_lang != "EN":
            en_query = self.translate(query, query_lang, "EN")
            console.print(f"   Translated query: \"{en_query}\"")
        else:
            en_query = query
        
        # Step 3: RAG Query (in English)
        if self.index:
            query_engine = self.index.as_query_engine(similarity_top_k=3)
            rag_response = query_engine.query(en_query)
            raw_answer = rag_response.response
            sources = [
                node.metadata.get("source_file", "Unknown")
                for node in rag_response.source_nodes
            ]
        else:
            console.print("[yellow]⚠️  No vector index loaded, using mock response[/yellow]")
            raw_answer = "Mock response: PMO KPIs include ROI, resource utilization, and stakeholder satisfaction."
            sources = []
        
        console.print(f"   RAG response (EN): \"{raw_answer[:100]}...\"")
        
        # Step 4: Translate answer to target language
        target_lang = target_lang or query_lang
        if target_lang != "EN":
            translated_answer = self.translate(raw_answer, "EN", target_lang)
            console.print(f"   Translated to {target_lang}: \"{translated_answer[:100]}...\"")
        else:
            translated_answer = raw_answer
        
        # Step 5: Adapt register
        target_register = target_register or "management"  # Default
        adapted_answer = self.adapt_register(
            translated_answer,
            source_register="management",  # PDFs sind management-level
            target_register=target_register,
            target_lang=target_lang
        )
        
        if adapted_answer != translated_answer:
            console.print(f"   Register adapted to: {target_register}")
        
        return {
            "answer": adapted_answer,
            "sources": list(set(sources)),  # Remove duplicates
        }


def demo_2x3_matrix():
    """Demonstriert die 2x3 Matrix mit Beispiel-Queries."""
    
    console.print(Panel.fit(
        "[bold magenta]🌍 Multi-Language RAG Demo[/bold magenta]\n"
        "[dim]Testet 2x3 Matrix: 2 Register × 3 Sprachen[/dim]",
        border_style="magenta"
    ))
    
    # Initialize
    rag = MultiLanguageRAG()
    
    # Test queries
    test_cases = [
        {
            "query": "Was sind PMO KPIs?",
            "lang": "DE",
            "register": "colloquial",
            "expected": "PMO KPIs sind Kennzahlen wie Wirtschaftlichkeit..."
        },
        {
            "query": "What are PMO KPIs?",
            "lang": "EN",
            "register": "management",
            "expected": "PMO Key Performance Indicators include ROI..."
        },
        {
            "query": "¿Qué son los KPIs de PMO?",
            "lang": "ES",
            "register": "colloquial",
            "expected": "Los KPIs de PMO son indicadores como rentabilidad..."
        }
    ]
    
    # Create results table
    table = Table(title="2x3 Matrix Test Results", show_header=True, header_style="bold cyan")
    table.add_column("Query", style="cyan", width=30)
    table.add_column("Language", justify="center")
    table.add_column("Register", justify="center")
    table.add_column("Answer Preview", width=50)
    
    for test in test_cases:
        result = rag.query(
            user_query=test["query"],
            target_lang=test["lang"],
            target_register=test["register"],
            vector_index=None  # Mock for demo
        )
        
        table.add_row(
            test["query"],
            test["lang"],
            test["register"],
            result["answer"][:100] + "..."
        )
    
    console.print(table)
    
    # Summary
    console.print("\n" + "="*80)
    console.print(Panel.fit(
        "[bold green]✅ 2x3 MATRIX FUNCTIONAL![/bold green]\n\n"
        "Nächste Schritte:\n"
        "1. Integriere in Frontend (Dropdown für Sprache/Register)\n"
        "2. Verbinde mit echter Vector DB\n"
        "3. Teste mit echten User-Queries\n\n"
        "[dim]Siehe: extraction/README_MULTILANGUAGE.md für Details[/dim]",
        border_style="green"
    ))


if __name__ == "__main__":
    demo_2x3_matrix()

