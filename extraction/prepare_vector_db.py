#!/usr/bin/env python3
"""
Vector Database Preparation für RAG
====================================

Bereitet die extrahierten Markdown-Texte für RAG (Retrieval Augmented Generation) vor:
1. Semantic Chunking (intelligente Text-Segmentierung)
2. Embedding Generation (Vector-Repräsentation)
3. ChromaDB Storage (lokale Vector Database)

Use Case: KI-Chatbot, der PMO-Wissen aus den 10 PDFs abfragen kann.

Author: AI Assistant
Date: 2026-01-11
"""

import os
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from dotenv import load_dotenv
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn
from rich.panel import Panel
from rich.table import Table

# LlamaIndex Imports
from llama_index.core import (
    Document,
    VectorStoreIndex,
    StorageContext,
    Settings,
)
from llama_index.core.node_parser import (
    SentenceSplitter,
    SemanticSplitterNodeParser,
)
from llama_index.vector_stores.chroma import ChromaVectorStore
try:
    from llama_index.embeddings.openai import OpenAIEmbedding
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False
import chromadb

console = Console()

# Load environment
load_dotenv(Path(__file__).parent / ".env")

# Configuration
LLAMAPARSE_DIR = Path("output_llamaparse")  # Relativ von extraction/
VECTOR_DB_DIR = Path("../vector_db")  # Ein Ordner höher
COLLECTION_NAME = "pmo_knowledge_base"

# Chunking Strategy
CHUNK_SIZE = 1024  # Tokens pro Chunk (optimal für RAG)
CHUNK_OVERLAP = 128  # Overlap zwischen Chunks (für Kontext)


class VectorDBPreparation:
    """Bereitet Dokumente für Vector DB vor."""
    
    def __init__(self, use_openai: bool = False):
        self.use_openai = use_openai
        self.documents = []
        self.chunks = []
        
        # Setup ChromaDB
        self.chroma_client = chromadb.PersistentClient(path=str(VECTOR_DB_DIR))
        self.chroma_collection = self.chroma_client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"description": "PMO Knowledge Base from 10 Practice Guides"}
        )
        
        # Setup Embeddings
        if use_openai and HAS_OPENAI:
            openai_key = os.getenv("OPENAI_API_KEY")
            if not openai_key or openai_key.startswith("sk-your"):
                console.print("[yellow]⚠️  OpenAI API Key nicht gesetzt, nutze lokale Embeddings[/yellow]")
                self.use_openai = False
            else:
                Settings.embed_model = OpenAIEmbedding(
                    model="text-embedding-3-small",  # Günstig & gut
                    api_key=openai_key
                )
                console.print("[green]✅ OpenAI Embeddings aktiviert[/green]")
        elif use_openai and not HAS_OPENAI:
            console.print("[yellow]⚠️  OpenAI Package nicht installiert, nutze lokale Embeddings[/yellow]")
            self.use_openai = False
        
        if not self.use_openai:
            # Fallback: HuggingFace Local Embeddings (kostenlos!)
            try:
                from llama_index.embeddings.huggingface import HuggingFaceEmbedding
                Settings.embed_model = HuggingFaceEmbedding(
                    model_name="sentence-transformers/all-MiniLM-L6-v2"
                )
                console.print("[green]✅ Local HuggingFace Embeddings aktiviert[/green]")
            except ImportError:
                console.print("[red]❌ HuggingFace nicht installiert![/red]")
                console.print("   Installiere: [cyan]pip install llama-index-embeddings-huggingface[/cyan]")
    
    def load_documents(self) -> List[Document]:
        """Lädt alle Markdown-Dokumente."""
        console.print("\n[cyan]📚 Loading documents...[/cyan]")
        
        documents = []
        
        for md_file in LLAMAPARSE_DIR.glob("*.md"):
            with open(md_file, 'r', encoding='utf-8') as f:
                text = f.read()
            
            # Create LlamaIndex Document
            doc = Document(
                text=text,
                metadata={
                    "source_file": md_file.name,
                    "source_type": "pmo_practice_guide",
                    "extraction_method": "llamaparse",
                    "language": "mixed",  # DE/EN/ES
                }
            )
            
            documents.append(doc)
            console.print(f"   ✅ {md_file.name} ({len(text):,} chars)")
        
        self.documents = documents
        console.print(f"\n[green]✅ {len(documents)} documents loaded[/green]")
        return documents
    
    def chunk_documents(self, method: str = "semantic") -> List:
        """
        Chunked Dokumente in semantische Einheiten.
        
        Methoden:
        - "sentence": Fixed-size chunks (schnell, einfach)
        - "semantic": Semantic-aware chunks (langsamer, besser)
        """
        console.print(f"\n[cyan]✂️  Chunking documents (method: {method})...[/cyan]")
        
        if method == "semantic":
            # Semantic Splitter (gruppiert ähnliche Sätze)
            try:
                splitter = SemanticSplitterNodeParser(
                    buffer_size=1,
                    breakpoint_percentile_threshold=95,
                    embed_model=Settings.embed_model
                )
                console.print("   Using [green]Semantic Splitter[/green] (optimal für RAG)")
            except Exception as e:
                console.print(f"   [yellow]⚠️  Semantic Splitter failed: {e}[/yellow]")
                console.print("   Falling back to Sentence Splitter...")
                method = "sentence"
        
        if method == "sentence":
            # Sentence Splitter (fixed-size chunks)
            splitter = SentenceSplitter(
                chunk_size=CHUNK_SIZE,
                chunk_overlap=CHUNK_OVERLAP,
            )
            console.print("   Using [yellow]Sentence Splitter[/yellow] (fixed-size)")
        
        # Split all documents
        nodes = splitter.get_nodes_from_documents(self.documents, show_progress=True)
        
        self.chunks = nodes
        console.print(f"\n[green]✅ {len(nodes)} chunks created[/green]")
        
        # Statistics
        avg_chunk_size = sum(len(node.text) for node in nodes) / len(nodes)
        console.print(f"   Average chunk size: {avg_chunk_size:.0f} characters")
        
        return nodes
    
    def create_vector_index(self) -> VectorStoreIndex:
        """Erstellt Vector Store Index."""
        console.print("\n[cyan]🔮 Creating vector index...[/cyan]")
        
        # Setup ChromaDB Vector Store
        vector_store = ChromaVectorStore(chroma_collection=self.chroma_collection)
        storage_context = StorageContext.from_defaults(vector_store=vector_store)
        
        # Create index from chunks
        index = VectorStoreIndex(
            nodes=self.chunks,
            storage_context=storage_context,
            show_progress=True
        )
        
        console.print("[green]✅ Vector index created[/green]")
        return index
    
    def test_query(self, index: VectorStoreIndex, query: str):
        """Testet die RAG-Query."""
        console.print(f"\n[cyan]🔍 Testing query: \"{query}\"[/cyan]")
        
        query_engine = index.as_query_engine(similarity_top_k=3)
        response = query_engine.query(query)
        
        console.print(Panel.fit(
            f"[bold green]Response:[/bold green]\n\n{response.response}",
            border_style="green",
            title="RAG Result"
        ))
        
        # Show sources
        console.print("\n[dim]Sources:[/dim]")
        for node in response.source_nodes:
            source = node.metadata.get("source_file", "Unknown")
            score = node.score
            console.print(f"   • {source} (similarity: {score:.2f})")
    
    def save_metadata(self, stats: Dict):
        """Speichert Metadata über Vector DB."""
        metadata_file = VECTOR_DB_DIR / "vector_db_metadata.json"
        
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)
        
        console.print(f"\n💾 [green]Metadata saved: {metadata_file}[/green]")


def main():
    """Main preparation routine."""
    
    console.print(Panel.fit(
        "[bold magenta]🔮 Vector DB Preparation für RAG[/bold magenta]\n"
        "[dim]Bereitet PMO Knowledge Base für KI-Chatbot vor[/dim]",
        border_style="magenta"
    ))
    
    # Check if LlamaParse output exists
    if not LLAMAPARSE_DIR.exists():
        console.print("\n[red]❌ LlamaParse output nicht gefunden![/red]")
        console.print("   Führe zuerst aus: [cyan]python extraction/extract_with_llamaparse.py[/cyan]")
        return
    
    # Check for API keys
    use_openai = bool(os.getenv("OPENAI_API_KEY")) and not os.getenv("OPENAI_API_KEY").startswith("sk-your")
    
    if use_openai:
        console.print("\n[green]✅ OpenAI API Key gefunden[/green]")
        console.print("   Using: text-embedding-3-small (~$0.02 / 1M tokens)")
    else:
        console.print("\n[yellow]⚠️  Kein OpenAI API Key[/yellow]")
        console.print("   Using: Local HuggingFace Embeddings (kostenlos, aber langsamer)")
    
    # Initialize
    prep = VectorDBPreparation(use_openai=use_openai)
    
    # Step 1: Load documents
    documents = prep.load_documents()
    
    if not documents:
        console.print("[red]❌ Keine Dokumente gefunden![/red]")
        return
    
    # Step 2: Chunk documents
    chunking_method = "sentence"  # "semantic" braucht mehr Zeit
    chunks = prep.chunk_documents(method=chunking_method)
    
    # Step 3: Create vector index
    index = prep.create_vector_index()
    
    # Step 4: Test queries
    console.print("\n" + "="*80)
    console.print("[bold]🧪 Testing RAG Queries:[/bold]")
    
    test_queries = [
        "What are the key responsibilities of a PMO?",
        "Welche KPIs sind wichtig für strategisches Projektmanagement?",
        "How to measure PMO effectiveness?",
    ]
    
    for query in test_queries:
        prep.test_query(index, query)
    
    # Save metadata
    stats = {
        "created_at": datetime.now().isoformat(),
        "total_documents": len(documents),
        "total_chunks": len(chunks),
        "embedding_model": "openai" if use_openai else "huggingface-local",
        "chunking_method": chunking_method,
        "chunk_size": CHUNK_SIZE,
        "chunk_overlap": CHUNK_OVERLAP,
        "vector_db_path": str(VECTOR_DB_DIR),
        "collection_name": COLLECTION_NAME,
    }
    
    prep.save_metadata(stats)
    
    # Summary
    console.print("\n" + "="*80)
    console.print(Panel.fit(
        f"[bold green]✅ VECTOR DB READY![/bold green]\n\n"
        f"Documents: {len(documents)}\n"
        f"Chunks: {len(chunks)}\n"
        f"Vector DB: [cyan]{VECTOR_DB_DIR}[/cyan]\n"
        f"Collection: [cyan]{COLLECTION_NAME}[/cyan]\n\n"
        f"[bold]🤖 Next Steps:[/bold]\n"
        f"1. Integriere in dein Frontend\n"
        f"2. Baue KI-Chatbot mit Query Engine\n"
        f"3. Nutze für automatische KPI-Empfehlungen",
        border_style="green"
    ))
    
    # Integration example
    console.print("\n[bold]📝 Integration Beispiel:[/bold]")
    console.print("""
[cyan]# In deinem Backend (FastAPI/Flask)[/cyan]
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb

# Load Vector DB
chroma_client = chromadb.PersistentClient(path="./vector_db")
chroma_collection = chroma_client.get_collection("pmo_knowledge_base")
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
index = VectorStoreIndex.from_vector_store(vector_store)

# Query
query_engine = index.as_query_engine()
response = query_engine.query("What are PMO best practices?")
print(response.response)
""")


if __name__ == "__main__":
    main()

