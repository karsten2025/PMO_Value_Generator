---
Title: "Business Requirements Specification (BRS) – PMO Value Generator Chatbot"
Version: 1.0
Status: Draft
Language: en
Source: PMO Value Generator Project
Tags: BRS, chatbot, requirements, 2x3-matrix, language, RAG, value-engine
Traceability: ChatInterface, /api/chat, LanguageContext, staticPMOKnowledge, systemGuide
Related: 2026_01_systems_engineering_iso15288_en.md, 2026_01_systems_engineering_iso15288_de.md, BRS_Chatbot_Value_Generator_de.md, BRS_Chatbot_Value_Generator_es.md
---

# Business Requirements Specification (BRS)  
## PMO Value Generator – Chatbot (PMO Knowledge Assistant)

### 1. Purpose of this BRS

This Business Requirements Specification (BRS) defines the **business requirements** for the **chatbot** (PMO Knowledge Assistant) of the PMO Value Generator. It provides:

- **Foundation for development**: Problem statement and context for the chatbot feature within the Value Engine.
- **Definition of requirements**: Business and user needs that the chatbot must fulfil, including the 2×3 language/register matrix and language behaviour.
- **Scope and objectives**: In-scope and out-of-scope capabilities, and how the chatbot supports the overall product mission.
- **Traceability**: Links from business requirements to existing artefacts (e.g. `ChatInterface`, `/api/chat`, `LanguageContext`, knowledge docs) and forward to future technical specs.
- **Stakeholder alignment**: A single reference for product, PMO, and development to agree on what the chatbot shall deliver.
- **Quality basis**: Constraints and acceptance criteria that support risk control and delivery quality.

The BRS is **not** a technical design document; it states *what* the system shall do from a business/user perspective, not *how* it is implemented.

---

### 2. Background and Problem Statement

**Context:**  
The PMO Value Generator is a web application that visualises and manages portfolio value (Impact Cycle, Portfolio Health Hub, PMP, project KPIs). Users need **on-demand access to PMO and Value Engine knowledge** without leaving the application—e.g. how to use the tool, what KPIs to choose, or how Systems Engineering (e.g. ISO 15288) relates to the Value Engine.

**Problem / Need:**  
Without an integrated assistant, users must switch to external documentation, search, or ask colleagues. This slows adoption, creates inconsistency in terminology (e.g. colloquial vs. management), and does not scale across languages (DE, EN, ES) or roles (team vs. leadership).

**Mission of the chatbot:**  
To act as the **PMO Knowledge Assistant** within the Value Generator: answering questions in the user’s chosen **language** and **register** (2×3 matrix), using static knowledge and—where available—RAG over project knowledge (e.g. systems engineering docs), while respecting IP and attribution rules (no “trained on X” or “based on Y practice guides” in user-facing text).

---

### 3. Scope

#### 3.1 In scope

| ID | Requirement / Capability |
|----|---------------------------|
| BR-C-01 | The chatbot shall be available from the main application (e.g. Controls dropdown / AI Assistant) and open as an overlay (modal) without navigating away. |
| BR-C-02 | The chatbot shall accept **text input** from the user (questions or commands) and return **text responses** (and optional source references). |
| BR-C-03 | The chatbot shall operate in **three languages**: **DE**, **EN**, **ES**. |
| BR-C-04 | The chatbot shall support **two registers** per language: **colloquial** (plain language, “what/why”) and **management** (formal, value/KPI/governance). |
| BR-C-05 | **2×3 matrix**: All user-facing responses (welcome, answers, fallbacks, system commands) shall be delivered in the **currently selected language and register** (DE/EN/ES × colloquial/management). |
| BR-C-06 | Language and register shall be **driven by the application’s global settings** (e.g. LanguageContext), so the chatbot reflects the same language/register as the rest of the UI. |
| BR-C-07 | **Optional / future – automatic language recognition**: The system may **detect** the user’s language from the input text and suggest or align the response language (or switch UI language) to improve accessibility; this shall not replace the explicit 2×3 selection as the primary behaviour. |
| BR-C-08 | The chatbot shall answer from, in order of preference: (1) **system commands** (e.g. `/tour`, `/input`, `/output`), (2) **static PMO knowledge** (e.g. KPIs, best practices, tool usage), (3) **RAG backend** (when available) over approved knowledge (e.g. systems engineering docs). |
| BR-C-09 | When the RAG backend is unavailable, the chatbot shall still answer from static knowledge and system commands and show a clear, friendly fallback (no raw technical errors to the user). |
| BR-C-10 | **Source attribution**: No user-facing text shall claim “based on X practice guides”, “trained on Y documents”, or “extracted from Z frameworks”. Generic phrasing only (e.g. “PMO Knowledge Assistant”, “industry best practices”, “professional PMO knowledge”). |
| BR-C-11 | Knowledge content shall be **paraphrased** (own wording), not verbatim copy from protected sources. |
| BR-C-12 | The chatbot shall support **multi-turn conversation** (session with message history) within one overlay session. |

#### 3.2 Out of scope (for this BRS)

- Voice input / speech-to-text (future option; not a current business requirement).
- Editing portfolio/project data or executing actions in the app (chatbot is read-only / advisory).
- Authentication/authorization rules (covered elsewhere; chatbot assumes authenticated session where applicable).
- Detailed RAG backend architecture (separate technical spec).

---

### 4. Business Objectives and Operational Concept

**Primary business objectives:**

1. **Faster onboarding**: New users get answers in their language and register without leaving the app.
2. **Consistent terminology**: Same 2×3 matrix as the rest of the Value Generator (labels, tooltips, reports).
3. **Scalability**: One assistant serves DE/EN/ES and colloquial/management without maintaining separate “versions” of the product.
4. **Trust and compliance**: No inappropriate source attribution; paraphrased, professional PMO knowledge.

**Operational concept:**

- User opens the app → selects **language** (DE/EN/ES) and **register** (colloquial/management) in the header/Controls.
- User opens **AI Assistant** (chatbot) from Controls → chatbot opens as overlay; welcome message and all subsequent answers use the **current** language and register.
- User types a question or command → system resolves via system commands → static knowledge → RAG (if available); response is rendered in the same language/register.
- Optional later: if “automatic language recognition” is implemented, the system may suggest or switch language/register based on input text, while still respecting the 2×3 matrix for output.

---

### 5. Stakeholders and Acceptance

**Primary stakeholders:**

- **Product / PMO**: Defines PMO terminology, register, and which topics the assistant must cover.
- **End users**: Project managers, portfolio managers, team members (colloquial) and leadership (management).
- **Development**: Implements and maintains frontend (ChatInterface, API route) and backend (RAG, static knowledge).

**Acceptance:**

- The BRS should be **accepted** by product and primary stakeholders before implementation of new features that change scope.
- Changes to language/register behaviour or attribution rules shall be reflected in an updated BRS version.

---

### 6. Traceability

| Business requirement | Current artefact / implementation |
|----------------------|-----------------------------------|
| BR-C-01 | `ChatInterface.tsx` (modal), `GitHubStyleHeader.tsx` / Controls → AI Assistant |
| BR-C-02 | `ChatInterface.tsx` (input, send), message list |
| BR-C-03, BR-C-04, BR-C-05, BR-C-06 | `LanguageContext.tsx` (DE/EN/ES, colloquial/management), `ChatInterface` + `/api/chat` (query body: `language`, `register`) |
| BR-C-07 | Not implemented; reserved for future (e.g. language detection from input) |
| BR-C-08 | `ChatInterface.tsx`: `checkSystemCommand` → `SYSTEM_RESPONSES` / `SYSTEM_EXTENSIONS`; `matchPMOQuestion` → `staticPMOKnowledge`; then `/api/chat` → RAG backend |
| BR-C-09 | `ChatInterface.tsx` fallback messages (DE/EN/ES); `/api/chat/route.ts` fallback when backend fails |
| BR-C-10, BR-C-11 | Project rules (e.g. .cursorrules): no source attribution; paraphrasing |
| BR-C-12 | `ChatInterface.tsx` (messages state, history in session) |

**Related knowledge documents:**

- `frontend/docs/2026_01_systems_engineering_iso15288_en.md`
- `frontend/docs/2026_01_systems_engineering_iso15288_de.md`  
These (and future docs) can be used as RAG sources; content must still comply with BR-C-10 and BR-C-11.

---

### 7. Quality Measures and Constraints

**Quality:**

- **Correctness**: Answers in the selected language and register; no language/register mix within one response.
- **Consistency**: Terminology aligned with the 2×3 matrix used elsewhere in the app (e.g. `ui-labels-matrix.json`).
- **Availability**: With or without RAG backend, the chatbot must still provide useful answers (static + system commands).
- **User experience**: No unhandled errors; friendly fallback and, if needed, short guidance (e.g. “Ask about /tour, /input, PMO KPIs…”).

**Constraints:**

- **IP / attribution**: Strict adherence to BR-C-10 and BR-C-11 (no “based on X” / “trained on Y”; paraphrasing only).
- **Performance**: Response time should remain acceptable (static and system commands immediate; RAG dependent on backend).
- **Security**: Chatbot does not expose internal APIs or secrets; user input and responses follow same security as the rest of the app.

---

### 8. Summary

The PMO Value Generator chatbot is the **PMO Knowledge Assistant**: it provides on-demand, language- and register-aware answers (2×3 matrix: DE/EN/ES × colloquial/management) from system commands, static PMO knowledge, and—when available—RAG. It supports the product’s mission without inappropriate source attribution and remains usable even when the RAG backend is down. This BRS is the business foundation for current implementation and future enhancements (e.g. automatic language recognition).

---

*Document version: 1.0 | Status: Draft | Next: Stakeholder review and versioning in repo.*
