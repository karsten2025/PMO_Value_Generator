# 🚀 START GUIDE: PMO Chatbot Testing

## ⚡ Schnellstart (2 Terminals)

### Terminal 1: Python RAG Backend starten

```bash
cd /Users/karsten/Documents/PMO_Value_Generator/extraction
source ../.venv/bin/activate
python start_rag_server.py
```

**Erwartete Ausgabe:**
```
======================================================================
🚀 Starting PMO Knowledge Base RAG API Server...
======================================================================
📁 Working Directory: /Users/karsten/Documents/PMO_Value_Generator/extraction
🌍 Sprachen: DE, EN, ES
💼 Register: Colloquial, Management
🔗 Frontend: http://localhost:3000
📡 API Docs: http://localhost:8000/docs
======================================================================

INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

---

### Terminal 2: Next.js Frontend starten

```bash
cd /Users/karsten/Documents/PMO_Value_Generator/frontend
npm run dev
```

**Erwartete Ausgabe:**
```
  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
  - Ready in 1.2s
```

---

## 🧪 Testing

### 1. Frontend öffnen
```
http://localhost:3000
```

### 2. Chatbot öffnen
- Klicke auf den **"AI Assistant"** Button (lila, oben rechts)

### 3. Test-Queries

**Deutsch (Einfach):**
```
Was macht ein PMO?
```

**English (Management):**
```
What are the key PMO KPIs?
```

**Español (Colloquial):**
```
¿Qué es un PMO?
```

---

## 🔍 API Testing (Optional)

### Mit curl:
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Was sind PMO KPIs?", "language": "de", "register": "colloquial"}'
```

### Mit Browser:
```
http://localhost:8000/docs
```
→ Swagger UI mit interaktiven API Tests

---

## ❌ Troubleshooting

### Backend startet nicht?
```bash
# Check dependencies
pip list | grep fastapi
pip list | grep uvicorn

# Falls fehlend:
pip install fastapi uvicorn pydantic
```

### Frontend findet Backend nicht?
→ Check: Läuft der Python Server auf Port 8000?
```bash
lsof -i :8000
```

### Vector DB Fehler?
→ Erstelle zuerst die Vector DB:
```bash
cd extraction
python prepare_vector_db.py
```

---

## ✅ Erfolgs-Kriterien

- [ ] Python Server läuft auf Port 8000
- [ ] Frontend läuft auf Port 3000
- [ ] Chatbot-Button sichtbar (lila, oben rechts)
- [ ] Chat öffnet sich beim Klick
- [ ] Welcome Message erscheint
- [ ] Test-Query funktioniert
- [ ] Antwort kommt zurück (auch wenn Mock)

---

**Viel Erfolg! 🚀**



