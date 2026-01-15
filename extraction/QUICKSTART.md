# 🚀 QUICK START: LlamaParse Integration

**Ziel**: Extrahiere alle 10 PMO-PDFs mit LlamaParse und bereite sie für RAG/KI-Chatbot vor.

**Zeit**: ~1 Stunde  
**Kosten**: ~$5.87 (erste 1.000 Seiten free)

---

## ⚡ 5-MINUTEN SETUP

```bash
# 1. Installiere Dependencies
cd extraction
pip install -r requirements_llamaparse.txt

# 2. Hole deinen API Key
# → https://cloud.llamaindex.ai/api-key
# → Registriere dich (GitHub Login möglich)
# → Erstelle API Key

# 3. Konfiguriere API Key
cp env.llamaparse.example .env
nano .env  # Oder VS Code / TextEdit
# → Füge ein: LLAMA_CLOUD_API_KEY=llx-dein-key

# 4. Test Setup
python setup_llamaparse.py

# ✅ Wenn alles grün ist: Weiter zu "FULL PIPELINE"
```

---

## 🔥 FULL PIPELINE (AUTOMATISCH)

**Option A: Alles auf einmal**
```bash
python run_full_pipeline.py
```

Das führt aus:
1. ✅ Setup Check
2. 📄 PDF Extraction (~30 Minuten, $5.87)
3. 🔍 Quality Comparison
4. 🔮 Vector DB Creation

---

## 🎯 STEP-BY-STEP (MANUELL)

### Schritt 1: Setup
```bash
python setup_llamaparse.py
```
✅ Prüft API Key, Dependencies, PDFs

### Schritt 2: PDF Extraction
```bash
python extract_with_llamaparse.py
```
- ⏱️ Dauer: ~30-45 Minuten (10 PDFs, 2.955 Seiten)
- 💰 Kosten: $5.87 (erste 1.000 Seiten free)
- 📁 Output: `extraction/output_llamaparse/*.md`

### Schritt 3: Qualitäts-Vergleich
```bash
python compare_extraction_quality.py
```
- Vergleicht PyMuPDF vs. LlamaParse
- Zeigt Verbesserungen (Tabellen, Struktur)
- Speichert Report: `output_llamaparse/quality_comparison.json`

### Schritt 4: Vector DB
```bash
python prepare_vector_db.py
```
- ⏱️ Dauer: ~10-20 Minuten
- 💰 Kosten: 
  - **Mit OpenAI**: ~$0.01 (optional, bessere Qualität)
  - **Ohne OpenAI**: $0 (lokale HuggingFace Embeddings)
- 📁 Output: `vector_db/` (ChromaDB)

---

## 💡 EMPFEHLUNG FÜR DICH

### **STRATEGIE 1: Budget ($0)**
```bash
# Nutze nur Free Tier
python extract_with_llamaparse.py  
# → Wähle nur 1.000 Seiten (erste 3 PDFs)
# → Rest mit PyMuPDF (kostenlos)

python prepare_vector_db.py
# → Ohne OPENAI_API_KEY (lokale Embeddings)
```
**Total: $0** ✅

### **STRATEGIE 2: Optimal ($5.87)** ⭐ EMPFOHLEN
```bash
# Alle PDFs mit LlamaParse
python run_full_pipeline.py

# Vector DB mit lokalen Embeddings
# (kein OpenAI Key nötig)
```
**Total: $5.87** ✅

### **STRATEGIE 3: Premium ($5.88)**
```bash
# Alle PDFs + OpenAI Embeddings
# In .env:
LLAMA_CLOUD_API_KEY=llx-...
OPENAI_API_KEY=sk-...

python run_full_pipeline.py
```
**Total: $5.88** ✅ (beste Qualität)

---

## 🎯 WAS DU DANACH HAST

### ✅ Strukturierte Markdown-Files
```
extraction/output_llamaparse/
├── pmo_practiceguide_eng.md          # 342 Seiten, sauber formatiert
├── pmbokguide_eighthed_eng.md        # 401 Seiten, mit Tabellen
├── Process Mining Handbook. 2022.md  # 503 Seiten, strukturiert
└── ...
```

### ✅ Vector Database (RAG-Ready)
```
vector_db/
├── chroma.sqlite3                    # Embeddings für alle Dokumente
├── vector_db_metadata.json           # Statistiken
└── ...
```

### ✅ Integration Code (Ready to Use)
```python
# Backend: Lade Vector DB
from llama_index.core import VectorStoreIndex
import chromadb

client = chromadb.PersistentClient(path="./vector_db")
collection = client.get_collection("pmo_knowledge_base")
index = VectorStoreIndex.from_vector_store(collection)

# Query
engine = index.as_query_engine()
response = engine.query("What are the top 5 PMO KPIs?")
print(response.response)
```

---

## 🆘 TROUBLESHOOTING

### Problem: "API Key not found"
```bash
# Lösung:
cd extraction
cat .env  # Prüfe ob Key drin ist
# Falls nicht:
echo "LLAMA_CLOUD_API_KEY=llx-dein-key" > .env
```

### Problem: "Out of Memory"
```bash
# Lösung: Verarbeite PDFs einzeln
# In extract_with_llamaparse.py:
# Kommentiere alle außer 1 PDF aus in PDF_PRIORITY
```

### Problem: "No PDFs found"
```bash
# Lösung: PDFs liegen falsch
ls knowledge_base_pdf/*.pdf  # Sollte 10 PDFs zeigen
# Falls leer: Verschiebe PDFs in diesen Ordner
```

---

## 📊 KOSTEN-ÜBERSICHT

| Service | Free Tier | Paid | Dein Case |
|---------|-----------|------|-----------|
| **LlamaParse** | 1.000 Seiten | $0.003/Seite | **$5.87** |
| **OpenAI Embeddings** | - | $0.02/1M tokens | $0.01 (optional) |
| **ChromaDB** | ∞ (lokal) | - | **$0** |
| **HuggingFace** | ∞ (lokal) | - | **$0** |
| **TOTAL** | | | **$5.87** |

**ROI**: Einmalige Investition → Unbegrenzte RAG-Queries 🚀

---

## ⏱️ ZEIT-ÜBERSICHT

| Step | Dauer | Was passiert |
|------|-------|--------------|
| Setup | 5 min | API Key, Dependencies |
| Extraction | 30-45 min | 10 PDFs → Markdown |
| Comparison | 5 min | Qualitäts-Report |
| Vector DB | 10-20 min | Embeddings, ChromaDB |
| **TOTAL** | **~1 Stunde** | Production-ready RAG |

---

## 🎉 NEXT STEPS

Nach der Pipeline:

### 1. **Teste die Vector DB**
```bash
python prepare_vector_db.py
# → Am Ende werden 3 Test-Queries ausgeführt
# → Prüfe die Antworten
```

### 2. **Integriere in dein Projekt**
- Siehe: `extraction/README_LLAMAPARSE.md` → "Integration" Section
- Copy-Paste Integration Code in dein Backend

### 3. **Baue Features**
- ✅ KI-Chatbot für PMO-Wissen
- ✅ Automatische KPI-Empfehlungen
- ✅ Semantic Search über alle Guides
- ✅ Context-Aware Projekt-Analysen

---

## 📞 HILFE

- **Dokumentation**: `extraction/README_LLAMAPARSE.md`
- **API Docs**: https://docs.cloud.llamaindex.ai/
- **Community**: https://discord.gg/dGcwcsnxhU (LlamaIndex Discord)

---

**Ready?** → `python run_full_pipeline.py` 🚀


