"""
PMO Knowledge Base RAG API (FastAPI)

Bietet REST API für Multi-Language RAG mit 2x3 Matrix:
- Sprache: DE/EN/ES
- Register: colloquial/management

Endpoints:
- POST /query: RAG Query mit automatischer Übersetzung
- GET /health: Health Check
"""

import os
import sys
from pathlib import Path
from typing import Optional, List, Dict
from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Add extraction directory to path
sys.path.append(str(Path(__file__).parent))

from multilanguage_rag import MultiLanguageRAG

# Load environment
load_dotenv(Path(__file__).parent / ".env")

# Initialize FastAPI
app = FastAPI(
    title="PMO Knowledge Base RAG API",
    description="Multi-Language RAG with 2x3 Matrix (DE/EN/ES × Colloquial/Management)",
    version="1.0.0"
)

# CORS für Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002"  # Additional port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG System
VECTOR_DB_PATH = Path(__file__).parent.parent / "vector_db"

try:
    rag_system = MultiLanguageRAG(
        vector_db_path=str(VECTOR_DB_PATH),
        use_openai_llm=bool(os.getenv("OPENAI_API_KEY"))
    )
    print("✅ RAG System initialized successfully!")
except Exception as e:
    print(f"⚠️  RAG System initialization failed: {e}")
    rag_system = None


# Request/Response Models
class QueryRequest(BaseModel):
    query: str
    language: str = "de"  # de, en, es
    register: str = "colloquial"  # colloquial, management

class QueryResponse(BaseModel):
    answer: str
    sources: List[str]
    language: str
    register: str
    query_time_ms: float


# Endpoints
@app.get("/")
async def root():
    """Root endpoint mit API Info"""
    return {
        "message": "PMO Knowledge Base RAG API",
        "version": "1.0.0",
        "status": "operational" if rag_system else "degraded",
        "endpoints": {
            "query": "POST /query",
            "health": "GET /health"
        }
    }

@app.get("/health")
async def health_check():
    """Health Check Endpoint"""
    return {
        "status": "healthy" if rag_system else "unhealthy",
        "vector_db": "connected" if rag_system and rag_system.index else "disconnected",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/query", response_model=QueryResponse)
async def query_knowledge_base(request: QueryRequest):
    """
    RAG Query mit Multi-Language Support
    
    Args:
        query: User-Frage
        language: Zielsprache (de/en/es)
        register: Sprachregister (colloquial/management)
    
    Returns:
        RAG-Antwort mit Quellenangaben
    """
    if not rag_system:
        raise HTTPException(
            status_code=503,
            detail="RAG System not initialized. Check vector_db connection."
        )
    
    try:
        start_time = datetime.now()
        
        # Query RAG System
        result = rag_system.query(
            query=request.query,
            target_language=request.language,
            target_register=request.register
        )
        
        end_time = datetime.now()
        query_time_ms = (end_time - start_time).total_seconds() * 1000
        
        return QueryResponse(
            answer=result['answer'],
            sources=result.get('sources', []),
            language=request.language,
            register=request.register,
            query_time_ms=round(query_time_ms, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Query processing failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*60)
    print("🚀 Starting PMO Knowledge Base RAG API...")
    print("="*60)
    print(f"📁 Vector DB: {VECTOR_DB_PATH}")
    print(f"🌍 Languages: DE, EN, ES")
    print(f"💼 Registers: Colloquial, Management")
    print(f"🔗 Frontend: http://localhost:3000")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

