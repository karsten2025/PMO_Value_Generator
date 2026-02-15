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

    // Python RAG Backend: lokal Port 8000, Production z.B. PYTHON_RAG_URL auf Railway/Render/Fly.io setzen
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
    // Strukturierter Fallback: Frontend kann freundliche Nachricht anzeigen statt rohem Fehler
    return NextResponse.json({
      answer: null,
      sources: [],
      language: 'en',
      register: 'colloquial',
      backendUnavailable: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 200 });
  }
}



