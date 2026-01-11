/**
 * Chat API Route
 * 
 * Leitet Anfragen an das Python RAG Backend weiter
 * Backend: FastAPI mit LlamaParse + ChromaDB
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, language, register } = body;

    if (!query || !language || !register) {
      return NextResponse.json(
        { error: 'Missing required fields: query, language, register' },
        { status: 400 }
      );
    }

    // Python RAG Backend URL (läuft lokal auf Port 8000)
    const PYTHON_RAG_URL = process.env.PYTHON_RAG_URL || 'http://localhost:8000';

    // Forward request to Python backend
    const response = await fetch(`${PYTHON_RAG_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        language,
        register
      })
    });

    if (!response.ok) {
      throw new Error(`Python backend error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      answer: data.answer,
      sources: data.sources || [],
      language: data.language,
      register: data.register
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback für Development (wenn Backend nicht läuft)
    return NextResponse.json({
      answer: '🚧 **Development Mode**: Das Python RAG Backend ist nicht erreichbar.\n\nBitte starte den Server mit:\n```bash\npython extraction/rag_api.py\n```\n\nDer Server sollte auf Port 8000 laufen.',
      sources: [],
      language: 'en',
      register: 'colloquial',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

