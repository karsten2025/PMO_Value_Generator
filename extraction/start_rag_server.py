#!/usr/bin/env python3
"""
Quick Start Script: RAG API Server

Startet den FastAPI Server für den PMO Knowledge Base Chatbot.
"""

import os
import sys
from pathlib import Path

# Wechsle ins extraction Verzeichnis
os.chdir(Path(__file__).parent)

# Füge extraction zum Python Path hinzu
sys.path.insert(0, str(Path(__file__).parent))

# Starte den Server
if __name__ == "__main__":
    import uvicorn
    from rag_api import app
    
    print("\n" + "="*70)
    print("🚀 Starting PMO Knowledge Base RAG API Server...")
    print("="*70)
    print(f"📁 Working Directory: {Path.cwd()}")
    print(f"🌍 Sprachen: DE, EN, ES")
    print(f"💼 Register: Colloquial, Management")
    print(f"🔗 Frontend: http://localhost:3000")
    print(f"📡 API Docs: http://localhost:8000/docs")
    print("="*70 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

