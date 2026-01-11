# 🤖 PMO Knowledge Base Chatbot

## ✅ Was wurde implementiert?

Die vollständige RAG (Retrieval Augmented Generation) Integration mit:
- ✅ **Multi-Language Support**: DE, EN, ES
- ✅ **2x3 Matrix**: Colloquial (Einfach) / Management (Profi)
- ✅ **Professional PMO Knowledge Base**
- ✅ **ChromaDB Vector Database** (lokal, kostenlos)
- ✅ **FastAPI Backend** für REST API
- ✅ **React Frontend** mit Chat-Interface

---

## 🚀 Quick Start

### 1. Backend Dependencies installieren

```bash
cd extraction
pip install -r requirements_llamaparse.txt
```

**Wichtig**: Installiere `fastapi`, `uvicorn`, und `pydantic` falls noch nicht vorhanden:

```bash
pip install fastapi uvicorn pydantic
```

### 2. RAG API Server starten

```bash
python start_rag_server.py
```

Der Server läuft auf: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### 3. Frontend starten

```bash
cd frontend
npm run dev
```

Frontend läuft auf: `http://localhost:3000`

### 4. Chatbot nutzen

1. Klicke auf den **"AI Assistant"** Button (lila, oben rechts)
2. Stelle deine Frage auf Deutsch, Englisch oder Spanisch
3. Der Chatbot antwortet automatisch in der richtigen Sprache & Register

---

## 📁 Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChatInterface.tsx (UI)                              │   │
│  │  - MessageSquare Button                              │   │
│  │  - Modal with Chat History                           │   │
│  │  - Language/Register from Context                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓ POST /api/chat                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  /api/chat/route.ts (API Route)                      │   │
│  │  - Forwards to Python Backend                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP
┌─────────────────────────────────────────────────────────────┐
│                 PYTHON BACKEND (FastAPI)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  rag_api.py (REST API)                               │   │
│  │  POST /query                                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  multilanguage_rag.py (RAG Logic)                    │   │
│  │  1. Detect Language                                  │   │
│  │  2. Translate Query → EN                             │   │
│  │  3. Query ChromaDB                                   │   │
│  │  4. Translate Answer → Target Lang                   │   │
│  │  5. Adapt Register (colloquial/management)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ChromaDB (Vector Database)                          │   │
│  │  - 10 PDF documents                                  │   │
│  │  - Embeddings (HuggingFace local)                    │   │
│  │  - Semantic Search                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧪 Test-Queries (Beispiele)

### Deutsch (Colloquial)
```
Was sind die wichtigsten Aufgaben eines PMO?
Welche KPIs sollte ich für mein Projekt tracken?
Erkläre mir Process Mining einfach.
```

### English (Management)
```
What are the strategic responsibilities of a PMO?
Explain the PMO Value Ring framework.
Which governance structures should a PMO implement?
```

### Español (Colloquial)
```
¿Qué hace una oficina de gestión de proyectos?
¿Cuáles son los KPIs más importantes?
```

---

## 📊 Features

### ✅ Multi-Language RAG
- **Auto-Detection**: Erkennt Sprache der User-Frage
- **Translation**: Google Translate (kostenlos, via `deep-translator`)
- **Caching**: Übersetzungen werden gecacht für Performance

### ✅ 2x3 Matrix Support
| Register     | Beschreibung                           |
|--------------|----------------------------------------|
| **Colloquial** | Einfache Sprache, keine Fachbegriffe |
| **Management** | Professionelle PM-Terminologie       |

### ✅ Knowledge Base
- Professional PMO knowledge (paraphrased, own terminology)
- Extrahiert mit LlamaParse (high quality)
- Gespeichert in ChromaDB (lokal, kostenlos)

### ✅ UI/UX
- Modernes Chat-Interface
- Welcome Message (sprachabhängig)
- Source Citations (Quellenangaben)
- Loading States
- Error Handling mit Fallback

---

## 🔧 Troubleshooting

### Problem: "RAG Backend nicht erreichbar"
**Lösung**: Starte den Python Server:
```bash
cd extraction
python start_rag_server.py
```

### Problem: "ModuleNotFoundError: No module named 'fastapi'"
**Lösung**: Installiere fehlende Dependencies:
```bash
pip install fastapi uvicorn pydantic
```

### Problem: "Vector DB nicht gefunden"
**Lösung**: Erstelle zuerst die Vector DB:
```bash
cd extraction
python prepare_vector_db.py
```

### Problem: "Übersetzung funktioniert nicht"
**Lösung**: Installiere `deep-translator`:
```bash
pip install deep-translator
```

---

## 🚀 Next Steps (Optional)

### 1. OpenAI Integration (für bessere Register-Adaptation)
Füge in `extraction/.env` hinzu:
```bash
OPENAI_API_KEY=sk-your-key-here
```

### 2. Production Deployment
Für Vercel Deployment benötigst du:
- Supabase pgvector (anstatt lokales ChromaDB)
- Serverless Function für RAG API
- Siehe: `extraction/README_MULTILANGUAGE.md`

### 3. Erweiterte Features
- [ ] Conversation History (Chat-Verlauf speichern)
- [ ] Multi-Turn Conversations (Kontext-basierte Antworten)
- [ ] Feedback System (👍 👎 für Antworten)
- [ ] Export Chat as PDF
- [ ] Voice Input (Speech-to-Text)

---

## 📚 Weitere Dokumentation

- **LlamaParse Integration**: `extraction/README_LLAMAPARSE.md`
- **Multi-Language RAG**: `extraction/README_MULTILANGUAGE.md`
- **Vector DB Setup**: `extraction/QUICKSTART.md`
- **API Docs**: http://localhost:8000/docs (wenn Server läuft)

---

## ✨ Credits

- **PMO Knowledge**: Industry best practices, paraphrased with own terminology
- **LlamaParse**: LlamaIndex für hochwertige PDF-Extraktion
- **ChromaDB**: Open-Source Vector Database
- **HuggingFace**: Kostenlose Embeddings (sentence-transformers)
- **Google Translate**: Via deep-translator

---

**Status**: ✅ MVP fertig und lokal testbar!
**Next**: Production Deployment mit Supabase pgvector

