# LlamaParse & Vector DB Setup
# Dokumentation für die PMO Knowledge Base Extraktion

## 🚀 Quick Start

### 1. Dependencies installieren
```bash
cd extraction
pip install -r requirements_llamaparse.txt
```

### 2. API Keys konfigurieren
```bash
# Kopiere Beispiel-Config
cp env.llamaparse.example .env

# Bearbeite .env und füge deinen LlamaParse Key ein
# Get key from: https://cloud.llamaindex.ai/api-key
```

### 3. Setup ausführen
```bash
python setup_llamaparse.py
```

### 4. PDFs extrahieren
```bash
python extract_with_llamaparse.py
```

### 5. Qualität vergleichen
```bash
python compare_extraction_quality.py
```

### 6. Vector DB vorbereiten
```bash
python prepare_vector_db.py
```

---

## 📊 Workflow-Übersicht

```
knowledge_base_pdf/          → 10 PMO-PDFs (2.955 Seiten)
        ↓
[LlamaParse Extraction]      → $0 (erste 1.000 Seiten) + $5.87
        ↓
output_llamaparse/*.md       → Strukturierte Markdown-Files
        ↓
[Semantic Chunking]          → 1.024 Token Chunks mit Overlap
        ↓
[Embedding Generation]       → OpenAI oder HuggingFace
        ↓
vector_db/                   → ChromaDB (lokal, persistent)
        ↓
[RAG Query Engine]           → KI-Chatbot für PMO-Wissen
```

---

## 🔑 API Keys

### LlamaParse (ERFORDERLICH)
- **Get Key**: https://cloud.llamaindex.ai/api-key
- **Cost**: 1.000 Seiten free, dann $0.003/Seite
- **Total für 2.955 Seiten**: ~$5.87

### OpenAI (OPTIONAL, für bessere Embeddings)
- **Get Key**: https://platform.openai.com/api-keys
- **Cost**: $0.02 / 1M tokens (sehr günstig!)
- **Alternative**: Lokale HuggingFace Embeddings (kostenlos)

---

## 📁 Output-Struktur

```
extraction/
├── output_text/              # PyMuPDF (alt) - Plain Text
│   ├── pmo_practiceguide_eng.txt
│   └── ...
│
├── output_llamaparse/        # LlamaParse (neu) - Markdown
│   ├── pmo_practiceguide_eng.md
│   ├── extraction_metadata.json
│   └── quality_comparison.json
│
├── .env                      # API Keys (NICHT committen!)
└── requirements_llamaparse.txt

vector_db/                    # ChromaDB (persistent)
├── chroma.sqlite3
├── vector_db_metadata.json
└── ...
```

---

## 🎯 Use Cases

### 1. **KI-Chatbot für PMO-Wissen**
```python
from llama_index.core import VectorStoreIndex
import chromadb

# Load Vector DB
chroma_client = chromadb.PersistentClient(path="./vector_db")
collection = chroma_client.get_collection("pmo_knowledge_base")
index = VectorStoreIndex.from_vector_store(collection)

# Query
response = index.as_query_engine().query(
    "What are the top 5 KPIs for PMO strategic alignment?"
)
print(response.response)
```

### 2. **Automatische KPI-Empfehlungen**
```python
# Frage: Welche KPIs passen zu meinem Projekt?
project_description = "Cloud Migration mit 50 Mitarbeitern, Budget 2M€"

response = query_engine.query(
    f"Based on this project: {project_description}, "
    f"what are the most relevant KPIs from the PMO Practice Guide?"
)
```

### 3. **Semantic Search über alle Guides**
```python
# Finde alle Referenzen zu einem Thema
results = index.as_retriever(similarity_top_k=10).retrieve(
    "Risk management in agile projects"
)

for result in results:
    print(f"Source: {result.metadata['source_file']}")
    print(f"Text: {result.text[:200]}...")
```

---

## 💰 Kosten-Breakdown

| Service | Usage | Cost |
|---------|-------|------|
| **LlamaParse** | 2.955 Seiten | $5.87 |
| **OpenAI Embeddings** (optional) | ~500K tokens | $0.01 |
| **ChromaDB** | Lokal | $0 |
| **HuggingFace Embeddings** (Fallback) | Lokal | $0 |
| **TOTAL** | Einmalig | **~$5.88** |

---

## 🔧 Troubleshooting

### Problem: "LLAMA_CLOUD_API_KEY not found"
```bash
# Lösung: Erstelle .env file
cd extraction
cp env.llamaparse.example .env
# Füge deinen Key ein: LLAMA_CLOUD_API_KEY=llx-...
```

### Problem: "Module 'llama_parse' not found"
```bash
# Lösung: Installiere Dependencies
pip install -r requirements_llamaparse.txt
```

### Problem: "Out of Memory bei Embeddings"
```bash
# Lösung: Nutze kleineres Embedding-Modell
# In prepare_vector_db.py:
# model_name="sentence-transformers/all-MiniLM-L6-v2"  # Klein, schnell
```

### Problem: "ChromaDB collection already exists"
```bash
# Lösung: Lösche alte Collection
rm -rf vector_db/
# Dann neu erstellen
python prepare_vector_db.py
```

---

## 🚀 Integration in PMO Value Generator

### Backend (Python/FastAPI)
```python
# backend/api/chatbot.py
from llama_index.core import VectorStoreIndex
import chromadb

class PMOChatbot:
    def __init__(self):
        self.client = chromadb.PersistentClient(path="./vector_db")
        self.collection = self.client.get_collection("pmo_knowledge_base")
        self.index = VectorStoreIndex.from_vector_store(self.collection)
        self.query_engine = self.index.as_query_engine()
    
    def ask(self, question: str, context: dict = None) -> str:
        # Optional: Ergänze mit Projekt-Kontext
        if context:
            question = f"Project: {context['name']}, {question}"
        
        response = self.query_engine.query(question)
        return response.response
```

### Frontend (Next.js)
```typescript
// frontend/app/api/chatbot/route.ts
export async function POST(request: Request) {
  const { question, projectContext } = await request.json();
  
  // Call Python Backend
  const response = await fetch('http://localhost:8000/chatbot/ask', {
    method: 'POST',
    body: JSON.stringify({ question, context: projectContext })
  });
  
  const answer = await response.json();
  return Response.json(answer);
}
```

---

## 📈 Performance-Optimierung

### Schnellere Embeddings
```python
# Option 1: OpenAI (Cloud, schnell)
OPENAI_API_KEY=sk-your-key

# Option 2: Local GPU (M1/M2 Mac)
# Nutze sentence-transformers mit MPS backend

# Option 3: Batch Processing
# Verarbeite PDFs parallel (multiprocessing)
```

### Kleinere Vector DB
```python
# Reduziere Chunk-Size
CHUNK_SIZE = 512  # Statt 1024
CHUNK_OVERLAP = 64  # Statt 128

# Trade-off: Kleinere DB, aber weniger Kontext pro Chunk
```

---

## 🎓 Best Practices

1. **✅ Starte mit Free Tier**  
   → Teste mit 1-2 PDFs, bevor du alle extrahierst

2. **✅ Vergleiche Qualität**  
   → Nutze `compare_extraction_quality.py` vor Production

3. **✅ Backup deine Embeddings**  
   → `vector_db/` ist groß (~500 MB), aber kritisch!

4. **✅ Version deine Extraktion**  
   → Speichere `extraction_metadata.json` im Git

5. **✅ Optimiere für deine Queries**  
   → Passe `CHUNK_SIZE` an deine typischen Fragen an

---

## 📞 Support

Bei Fragen oder Problemen:
1. Prüfe die Logs in `extraction/output_llamaparse/`
2. Teste einzelne Schritte isoliert
3. Checke API Key Validity: https://cloud.llamaindex.ai/

---

**Erstellt**: 2026-01-11  
**Version**: 1.0  
**Autor**: AI Assistant für PMO Value Generator

