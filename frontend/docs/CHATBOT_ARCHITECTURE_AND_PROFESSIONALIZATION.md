# Chatbot: Was wir improvisiert haben, warum, und wie wir professionalisieren

## 1. Was wir gemacht haben (Improvisation)

### Geplante Architektur
- **Frontend** (ChatInterface) → **Next.js API Route** (`/api/chat`) → **Python RAG Backend** (FastAPI, ChromaDB, Port 8000).
- RAG durchsucht 10+ PMO-PDFs (LlamaParse, Embeddings) und antwortet in DE/EN/ES × colloquial/management.

### Was tatsächlich umgesetzt wurde

| Schicht | Umsetzung | Grund |
|--------|------------|--------|
| **RAG-Anfragen** | ChatInterface ruft **direkt** `http://localhost:8000/query` auf (nicht `/api/chat`). | Schneller Prototyp; API-Route existiert, wurde für RAG aber umgangen. |
| **Vercel/Production** | Python-Backend läuft **nicht** auf Vercel (nur Frontend). `localhost:8000` ist in Production die Maschine des Users → RAG-Anfragen schlagen **immer** fehl. | Vercel ist serverless, kein dauerhaft laufender Python-Prozess. |
| **„Chatbot funktioniert trotzdem“** | 1) **Systembefehle** (/tour, /input, /output) → lokal. 2) **Statische PMO-Wissensbasis** (`staticPMOKnowledge.ts`) → viele Standardfragen werden im Browser beantwortet. 3) Trifft nichts → RAG-Versuch → **Catch** → freundliche Fallback-Nachricht mit Tipps. | **Ziel: Vercel-Deployment ohne Backend** („LinkedIn-Demo-Ready“). User bekommt immer eine sinnvolle Reaktion, nie einen rohen Fehler. |

### Kurz: Warum der Chatbot „noch nicht voll funktionsfähig“ ist

- **Voll funktionsfähig** = RAG über PDFs (Systems Engineering, Practice Guides etc.) für beliebige Fragen.
- **RAG** läuft nur, wenn das Python-Backend lokal gestartet wird (`python extraction/start_rag_server.py`).
- **Auf Vercel** gibt es dieses Backend nicht → nur Systembefehle + statisches Wissen + Fallback-Text. RAG ist in Production de facto aus.

---

## 2. Warum wir es so gemacht haben

1. **Schnelles Deployment**: Frontend auf Vercel ohne Python-Setup; Demo sofort nutzbar.
2. **Keine zusätzliche Infrastruktur**: Kein separater Host für FastAPI/ChromaDB nötig.
3. **Gute UX trotzdem**: Statische Antworten + Fallback sorgen dafür, dass der Bot nie „tot“ wirkt.
4. **Klare Priorität**: Erst „es läuft und wirkt“, dann „RAG überall“.

---

## 3. Wie wir das professionalisieren können

### A) Architektur vereinheitlichen (sofort umsetzbar)

**Problem:** ChatInterface ruft `localhost:8000` direkt auf; die API-Route `/api/chat` wird für RAG nicht genutzt.

**Lösung:**
- ChatInterface ruft **ausschließlich** `/api/chat` (relative URL) auf.
- `/api/chat` leitet an `PYTHON_RAG_URL` weiter (Env, z.B. `https://your-rag-service.up.railway.app`).
- Ist das Backend nicht erreichbar: API-Route antwortet mit **strukturiertem** Fallback (z.B. `{ backendUnavailable: true, answer: null }`), **kein** Throw.
- Frontend erkennt `backendUnavailable` und zeigt die bewährte Fallback-Nachricht (Tipps, /tour, PMO-Grundlagen) – ohne generischen Netzwerkfehler.

**Vorteil:** Ein einziger Weg für RAG (über Next.js); Production kann später durch Setzen von `PYTHON_RAG_URL` RAG aktivieren, ohne Frontend-Code zu ändern.

### B) RAG in Production verfügbar machen (mittelfristig)

**Option 1 – Gehostetes Python-Backend**
- Python RAG (FastAPI + ChromaDB bzw. persistierter Vector-Store) auf **Railway**, **Render**, **Fly.io** o.ä. deployen.
- `PYTHON_RAG_URL` in Vercel auf diese URL setzen.
- Keine Änderung an der geplanten RAG-Logik.

**Option 2 – Serverless RAG**
- RAG-Logik in eine **Vercel Serverless Function** (oder separaten Serverless-Dienst) verlagern.
- Vector-Store z.B. **Supabase pgvector** oder externer RAG-API.
- Erfordert Anpassung der RAG-Pipeline (kein dauerhaft laufender Python-Prozess).

### C) Fallback und Fehlerbehandlung klären

- API-Route: Bei Backend-Fehler **immer** strukturierte Antwort (z.B. `backendUnavailable: true`), nie nur Exception nach außen.
- Frontend: Bei `backendUnavailable` dieselbe freundliche Nachricht wie heute („Für sehr spezifische Fragen …“, Tipps, /tour, PMO-Grundlagen), ggf. kurzer Hinweis „Erweiterte Suche derzeit nicht verfügbar“.

### D) Dokumentation und BRS

- In **BRS Chatbot** (bzw. Architektur-Doc) festhalten:
  - Wann Antwort aus Systembefehl, wann aus statischem Wissen, wann aus RAG.
  - Dass RAG in Production nur bei gesetzter `PYTHON_RAG_URL` (oder Serverless-RAG) aktiv ist.
- README/START_CHATBOT: „Lokal mit vollem RAG: Backend starten; Production: aktuell statisch + Fallback, RAG optional über gehostetes Backend.“

---

## 4. Empfohlene Reihenfolge

1. **Sofort:** ChatInterface auf `/api/chat` umstellen, API-Route bei Backend-Ausfall strukturierten Fallback liefern, Frontend darauf reagieren (siehe Abschnitt 3A).  
2. **Dokumentation:** Dieses Doc + BRS/Architektur aktualisieren (Abschnitt 3D).  
3. **Später:** RAG in Production (Option 3B1 oder 3B2) und ggf. Konversationshistorie / Feedback.

Damit ist klar, **was** improvisiert wurde, **warum** es so ist, und **wie** der nächste Schritt zur Professionalisierung aussieht.
