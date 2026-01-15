# 🌍 Multi-Language RAG: 2x3 Matrix Dokumentation

## 🎯 Was ist die 2x3 Matrix?

Dein PMO Value Generator spricht **6 verschiedene "Stimmen"**:

| | 🇩🇪 Deutsch | 🇬🇧 Englisch | 🇪🇸 Spanisch |
|---|---|---|---|
| **👥 Colloquial** (Normalsprache) | Einfach, für alle verständlich | Simple, everyday language | Lenguaje simple y cotidiano |
| **💼 Management** (Profi-Sprache) | PM-Fachbegriffe, formal | Professional PM terminology | Terminología profesional |

**= 2 Register × 3 Sprachen = 6 Kombinationen**

---

## 🏗️ ARCHITEKTUR

### **Strategie: Metadata-Driven** (Empfohlen)

```
┌─────────────────────────────────────────┐
│  Vector DB (Englisch, Management)       │  ← Source of Truth (aus PDFs)
│  • 10 PDFs                              │
│  • ~1.800 Chunks                        │
│  • Metadata: source, domain             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Multi-Language RAG Layer               │
│  • Detect User Language                 │
│  • Translate Query → EN                 │
│  • Query Vector DB                      │
│  • Translate Response → User Language   │
│  • Adapt Register (colloquial/mgmt)     │
└─────────────────────────────────────────┘
                  ↓
        User bekommt Antwort in:
        ✅ Seiner Sprache (DE/EN/ES)
        ✅ Seinem Register (colloquial/mgmt)
```

---

## 🔄 WORKFLOW (Beispiel)

### **Szenario 1: Deutscher User, Normalsprache**

```python
# User fragt (Deutsch, Normalsprache)
user_query = "Was sind PMO KPIs?"
target_lang = "DE"
target_register = "colloquial"

# ⚙️ System verarbeitet:

# 1. Detect Language
query_lang = "DE" ✅

# 2. Translate Query → EN
en_query = "What are PMO KPIs?" ✅

# 3. RAG Query (Vector DB in Englisch)
raw_answer = "PMO Key Performance Indicators include ROI, 
              resource utilization, stakeholder satisfaction..."

# 4. Translate Answer → DE
de_answer = "PMO Key Performance Indicators umfassen ROI,
             Ressourcenauslastung, Stakeholder-Zufriedenheit..."

# 5. Adapt Register → colloquial
final_answer = "PMO KPIs sind Kennzahlen, die zeigen:
                - Wie wirtschaftlich das Projekt ist (ROI)
                - Wie gut Mitarbeiter eingesetzt werden
                - Wie zufrieden die Beteiligten sind"

# ✅ User bekommt verständliche Antwort auf Deutsch!
```

### **Szenario 2: Manager, Englisch, Profi-Sprache**

```python
# Manager fragt (Englisch, Management)
user_query = "What are strategic PMO KPIs?"
target_lang = "EN"
target_register = "management"

# ⚙️ System verarbeitet:

# 1. Detect Language
query_lang = "EN" ✅

# 2. No translation needed ✅

# 3. RAG Query (Vector DB)
raw_answer = "Strategic PMO KPIs focus on alignment with 
              organizational objectives, including portfolio ROI..."

# 4. No translation needed ✅

# 5. Register already "management" ✅

final_answer = "Strategic PMO KPIs focus on organizational alignment,
                portfolio-level ROI, strategic initiative completion rates,
                and stakeholder engagement metrics..."

# ✅ Manager bekommt professionelle Antwort auf Englisch!
```

---

## 🛠️ IMPLEMENTATION

### **Setup**

```bash
# Installiere zusätzliche Dependencies
cd extraction
pip install deep-translator langdetect openai

# Oder nutze erweiterte requirements
pip install -r requirements_llamaparse.txt
```

### **Basic Usage**

```python
from extraction.multilanguage_rag import MultiLanguageRAG
from llama_index.core import VectorStoreIndex
import chromadb

# 1. Lade Vector DB
client = chromadb.PersistentClient(path="./vector_db")
collection = client.get_collection("pmo_knowledge_base")
index = VectorStoreIndex.from_vector_store(collection)

# 2. Initialize Multi-Language RAG
rag = MultiLanguageRAG()

# 3. Query mit 2x3 Matrix Support
result = rag.query(
    user_query="Was sind PMO KPIs?",
    target_lang="DE",
    target_register="colloquial",
    vector_index=index
)

print(result["answer"])
# → "PMO KPIs sind Kennzahlen wie..."
```

### **Frontend Integration (Next.js)**

```typescript
// frontend/app/api/chatbot/route.ts
export async function POST(request: Request) {
  const { query, language, register } = await request.json();
  
  // Call Python Backend
  const response = await fetch('http://localhost:8000/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      target_lang: language,  // "DE" | "EN" | "ES"
      target_register: register  // "colloquial" | "management"
    })
  });
  
  const result = await response.json();
  return Response.json(result);
}
```

```tsx
// frontend/app/components/ChatBot.tsx
const [language, setLanguage] = useState<"DE" | "EN" | "ES">("DE");
const [register, setRegister] = useState<"colloquial" | "management">("colloquial");

// User Preferences (aus deinem Context!)
<select value={language} onChange={(e) => setLanguage(e.target.value)}>
  <option value="DE">🇩🇪 Deutsch</option>
  <option value="EN">🇬🇧 English</option>
  <option value="ES">🇪🇸 Español</option>
</select>

<select value={register} onChange={(e) => setRegister(e.target.value)}>
  <option value="colloquial">👥 Normalsprache</option>
  <option value="management">💼 Management</option>
</select>

// Send query
const answer = await fetch('/api/chatbot', {
  method: 'POST',
  body: JSON.stringify({ query, language, register })
});
```

---

## 💰 KOSTEN

### **Übersetzung (Google Translate via deep-translator)**
- ✅ **Kostenlos** für normale Nutzung!
- ⚠️ Rate Limit: ~500 requests/hour
- 💡 Caching: Wiederholte Übersetzungen sind gecacht

### **Register-Adaptation (OpenAI GPT-3.5)**
- 💰 **$0.0015 / 1K tokens** (Input)
- 💰 **$0.002 / 1K tokens** (Output)
- 📊 **Pro Query**: ~$0.001 (sehr günstig!)

### **Beispiel-Rechnung (100 User-Queries/Tag)**
```
Translation:      $0 (kostenlos)
Register Adapt:   $0.10/Tag
Total/Monat:      ~$3
```

**→ Super günstig für dein MVP!** ✅

---

## 🎓 BEST PRACTICES

### **1. Caching nutzen**
```python
# Wiederholte Übersetzungen sind automatisch gecacht
# Keine doppelte Translation!
TRANSLATION_CACHE_DIR = "extraction/translation_cache"
```

### **2. Sprache auto-detecten**
```python
# User muss nicht explizit Sprache wählen
query_lang = rag.detect_language(user_query)
```

### **3. Register aus User-Context**
```python
# In deinem Frontend Context:
user_preferences = {
    "language": "DE",  # Aus Browser oder User-Profil
    "register": "colloquial"  # Aus User-Rolle
}
```

### **4. Fallbacks definieren**
```python
# Wenn Translation feilt: Zeige Englisch
# Wenn Register-Adapt feilt: Zeige Original
```

---

## 🚀 INTEGRATION IN DEIN PROJEKT

### **Step 1: Backend erweitern**

```python
# backend/api/rag_endpoint.py
from extraction.multilanguage_rag import MultiLanguageRAG
from llama_index.core import VectorStoreIndex
import chromadb

# Global initialisieren (beim Server-Start)
chroma_client = chromadb.PersistentClient(path="./vector_db")
collection = chroma_client.get_collection("pmo_knowledge_base")
vector_index = VectorStoreIndex.from_vector_store(collection)
rag = MultiLanguageRAG()

@app.post("/rag/query")
async def rag_query(request: RAGQueryRequest):
    """
    RAG Query mit 2x3 Matrix Support.
    
    Body: {
        "query": "Was sind PMO KPIs?",
        "target_lang": "DE",
        "target_register": "colloquial"
    }
    """
    result = rag.query(
        user_query=request.query,
        target_lang=request.target_lang,
        target_register=request.target_register,
        vector_index=vector_index
    )
    
    return result
```

### **Step 2: Frontend Context erweitern**

```tsx
// frontend/app/contexts/LanguageContext.tsx
interface LanguageContextType {
  language: "DE" | "EN" | "ES";
  register: "colloquial" | "management";
  setLanguage: (lang: "DE" | "EN" | "ES") => void;
  setRegister: (reg: "colloquial" | "management") => void;
}

// Nutze zusammen mit deinem existierenden PortfolioContext!
```

### **Step 3: UI Components**

```tsx
// frontend/app/components/LanguageSelector.tsx
export function LanguageSelector() {
  const { language, register, setLanguage, setRegister } = useLanguage();
  
  return (
    <div className="flex gap-2">
      {/* Sprache */}
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="DE">🇩🇪 Deutsch</option>
        <option value="EN">🇬🇧 English</option>
        <option value="ES">🇪🇸 Español</option>
      </select>
      
      {/* Register */}
      <select value={register} onChange={(e) => setRegister(e.target.value)}>
        <option value="colloquial">👥 Für alle</option>
        <option value="management">💼 Profi</option>
      </select>
    </div>
  );
}
```

---

## 🧪 TESTING

### **Test Script ausführen**

```bash
cd extraction
python multilanguage_rag.py
```

**Output:**
```
🌍 Multi-Language RAG Demo
┌─────────────────────────────────────────────────────────┐
│ Query                   │ Lang │ Register   │ Answer    │
├─────────────────────────────────────────────────────────┤
│ Was sind PMO KPIs?      │ DE   │ colloquial │ PMO KPIs  │
│                         │      │            │ sind...   │
│ What are PMO KPIs?      │ EN   │ management │ PMO Key   │
│                         │      │            │ Perform...│
│ ¿Qué son los KPIs?      │ ES   │ colloquial │ Los KPIs  │
│                         │      │            │ son...    │
└─────────────────────────────────────────────────────────┘

✅ 2x3 MATRIX FUNCTIONAL!
```

### **Unit Tests**

```python
# tests/test_multilanguage.py
def test_language_detection():
    rag = MultiLanguageRAG()
    assert rag.detect_language("Was sind KPIs?") == "DE"
    assert rag.detect_language("What are KPIs?") == "EN"
    assert rag.detect_language("¿Qué son KPIs?") == "ES"

def test_translation():
    rag = MultiLanguageRAG()
    result = rag.translate("Hello", "EN", "DE")
    assert "Hallo" in result
```

---

## 🔮 V2.0 FEATURES

Mit dieser Multi-Language RAG kannst du bauen:

### **1. Adaptive Chatbot**
```
User (Deutsch, Normalsprache):
  "Was kostet ein PMO?"

Bot (Deutsch, Normalsprache):
  "Ein PMO kostet je nach Größe zwischen 100.000€ und 500.000€ pro Jahr..."
```

### **2. Automatic KPI-Recommendations (Multi-Language)**
```python
project = {"name": "Cloud Migration", "budget": "2M€"}

# Empfehlung auf Deutsch, Normalsprache
result = rag.query(
    f"Welche KPIs passen zu: {project}?",
    target_lang="DE",
    target_register="colloquial"
)
```

### **3. Context-Aware Help System**
```tsx
// Hilfe-Text passt sich an User-Sprache/Register an
<HelpTooltip>
  {rag.query("What is strategic alignment?", lang, register)}
</HelpTooltip>
```

---

## 🎯 ROADMAP

### ✅ **PHASE 1: DONE (Heute)**
- ✅ Multi-Language RAG Script
- ✅ 2x3 Matrix Support
- ✅ Translation + Register-Adaptation

### 🔄 **PHASE 2: NEXT**
- 🔄 Backend API Endpoint
- 🔄 Frontend Language Selector
- 🔄 Integration mit Vector DB

### 🔮 **PHASE 3: FUTURE**
- 🔮 Fine-Tuning für bessere Übersetzungen
- 🔮 Domain-spezifische Translation Models
- 🔮 Voice Input (Multi-Language)

---

## 🆘 TROUBLESHOOTING

### **Problem: Translation API Limit**
```
Error: Too many requests to Google Translate
```
**Lösung:**
```python
# Option A: Nutze kostenpflichtigen Service
from deep_translator import MyMemoryTranslator  # Unlimited

# Option B: Implementiere Rate Limiting
import time
time.sleep(1)  # 1 Sekunde warten zwischen Requests
```

### **Problem: Register-Adaptation zu teuer**
```
OpenAI Costs steigen
```
**Lösung:**
```python
# Nur für "wichtige" Queries nutzen
if user.is_premium:
    adapted = rag.adapt_register(...)
else:
    adapted = translated_answer  # Ohne Adaptation
```

---

## 📦 ZUSAMMENFASSUNG

**Was du hast:**
- ✅ `multilanguage_rag.py` - Production-Ready Script
- ✅ 2x3 Matrix Support (2 Register × 3 Sprachen)
- ✅ Auto-Translation (kostenlos!)
- ✅ Register-Adaptation (OpenAI, günstig)
- ✅ Caching für Performance
- ✅ Integration Examples

**Was du brauchst:**
- 🔑 Keine extra API Keys (Google Translate ist free!)
- 🔑 Optional: OpenAI Key für Register-Adaptation
- ⏱️ ~10 Minuten Integration

**Was du bekommst:**
- 🌍 Dein Chatbot spricht DE/EN/ES
- 👥 Anpassbar für normale User & Profis
- 🚀 Basis für internationales SaaS

---

**Ready?** → `python extraction/multilanguage_rag.py` 🚀


