---
Title: "Business Requirements Specification (BRS) – PMO Value Generator Chatbot"
Version: 1.0
Status: Entwurf
Language: de
Source: PMO Value Generator Projekt
Tags: BRS, Chatbot, Anforderungen, 2x3-Matrix, Sprache, RAG, Value-Engine
Traceability: ChatInterface, /api/chat, LanguageContext, staticPMOKnowledge, systemGuide
Related: 2026_01_systems_engineering_iso15288_de.md, 2026_01_systems_engineering_iso15288_en.md | BRS_en: BRS_Chatbot_Value_Generator_en.md, BRS_es: BRS_Chatbot_Value_Generator_es.md
---

# Business Requirements Specification (BRS)  
## PMO Value Generator – Chatbot (PMO Knowledge Assistant)

### 1. Zweck dieses BRS

Diese Business Requirements Specification (BRS) definiert die **Geschäftsanforderungen** für den **Chatbot** (PMO Knowledge Assistant) des PMO Value Generator. Sie dient als:

- **Grundlage für die Entwicklung**: Problemstellung und Kontext der Chatbot-Funktion innerhalb der Value Engine.
- **Definition der Anforderungen**: Geschäfts- und Nutzerbedürfnisse, die der Chatbot erfüllen muss, inkl. 2×3-Sprach-/Register-Matrix und Sprachverhalten.
- **Abgrenzung und Ziele**: In-Scope und Out-of-Scope sowie Beitrag zum Produktziel.
- **Rückverfolgbarkeit**: Verknüpfung von Geschäftsanforderungen mit bestehenden Artefakten (z. B. ChatInterface, /api/chat, LanguageContext, Wissensdokumente) und mit künftigen technischen Specs.
- **Stakeholder-Ausrichtung**: Einheitliche Referenz für Produkt, PMO und Entwicklung.
- **Qualitätsbasis**: Randbedingungen und Akzeptanzkriterien für Risikosteuerung und Lieferqualität.

Das BRS ist **kein** technisches Design-Dokument; es beschreibt, **was** das System aus Geschäfts-/Nutzerperspektive leisten soll, nicht **wie** es implementiert wird.

---

### 2. Hintergrund und Problemstellung

**Kontext:**  
Der PMO Value Generator ist eine Webanwendung zur Visualisierung und Steuerung von Portfoliowert (Impact Cycle, Portfolio Health Hub, PMP, Projekt-KPIs). Nutzer benötigen **bedarfsgerechten Zugriff auf PMO- und Value-Engine-Wissen**, ohne die Anwendung zu verlassen (z. B. Bedienung, KPI-Auswahl, Bezug zu Systems Engineering / ISO 15288).

**Problem / Bedarf:**  
Ohne integrierten Assistenten müssen Nutzer in externe Dokumentation wechseln, suchen oder Kollegen fragen. Das verzögert die Adoption, führt zu uneinheitlicher Terminologie (z. B. umgangssprachlich vs. Management) und skaliert nicht über Sprachen (DE, EN, ES) und Rollen (Team vs. Führung).

**Auftrag des Chatbots:**  
Als **PMO Knowledge Assistant** innerhalb des Value Generator agieren: Antworten in der vom Nutzer gewählten **Sprache** und **Register** (2×3-Matrix), unter Nutzung statischen Wissens und – wo verfügbar – RAG über Projektwissen (z. B. Systems-Engineering-Dokumente), unter Beachtung von IP- und Attributionsregeln (keine Formulierungen wie „trainiert auf X“ oder „basierend auf Y Practice Guides“ in nutzer sichtbaren Texten).

---

### 3. Umfang

#### 3.1 In Scope

| ID | Anforderung / Fähigkeit |
|----|--------------------------|
| BR-C-01 | Der Chatbot soll von der Hauptanwendung (z. B. Controls-Dropdown / AI Assistant) erreichbar sein und als Overlay (Modal) geöffnet werden, ohne die Seite zu verlassen. |
| BR-C-02 | Der Chatbot soll **Texteingabe** des Nutzers (Fragen oder Befehle) akzeptieren und **Textantworten** (optional mit Quellenangaben) liefern. |
| BR-C-03 | Der Chatbot soll in **drei Sprachen** betrieben werden: **DE**, **EN**, **ES**. |
| BR-C-04 | Der Chatbot soll **zwei Register** pro Sprache unterstützen: **colloquial** (Normalsprache, „Was/Warum“) und **management** (formell, Value/KPI/Governance). |
| BR-C-05 | **2×3-Matrix**: Alle nutzersichtbaren Antworten (Begrüßung, Antworten, Fallbacks, Systembefehle) sollen in der **aktuell gewählten Sprache und im gewählten Register** (DE/EN/ES × colloquial/management) geliefert werden. |
| BR-C-06 | Sprache und Register sollen von den **globalen Einstellungen der Anwendung** (z. B. LanguageContext) gesteuert werden; der Chatbot nutzt dieselbe Sprache/Register wie der Rest der UI. |
| BR-C-07 | **Optional / künftig – automatische Spracherkennung**: Das System darf die **Sprache des Nutzers** aus dem Eingabetext erkennen und die Antwortsprache vorschlagen oder anpassen (oder die UI-Sprache wechseln); dies ersetzt nicht die explizite 2×3-Auswahl als primäres Verhalten. |
| BR-C-08 | Der Chatbot soll Antworten in folgender Reihenfolge beziehen: (1) **Systembefehle** (z. B. /tour, /input, /output), (2) **statisches PMO-Wissen** (z. B. KPIs, Best Practices, Bedienung), (3) **RAG-Backend** (falls verfügbar) über freigegebenes Wissen (z. B. Systems-Engineering-Dokumente). |
| BR-C-09 | Wenn das RAG-Backend nicht erreichbar ist, soll der Chatbot weiterhin aus statischem Wissen und Systembefehlen antworten und einen klaren, freundlichen Fallback anzeigen (keine rohen technischen Fehler an den Nutzer). |
| BR-C-10 | **Quellenzuordnung**: Kein nutzersichtbarer Text darf „basierend auf X Practice Guides“, „trainiert auf Y Dokumenten“ oder „extrahiert aus Z Frameworks“ behaupten. Nur generische Formulierungen (z. B. „PMO Knowledge Assistant“, „Branchen-Best-Practices“, „professionelles PMO-Wissen“). |
| BR-C-11 | Wissensinhalte sollen **paraphrasiert** (eigene Formulierung) sein, kein wörtliches Kopieren aus geschützten Quellen. |
| BR-C-12 | Der Chatbot soll **Mehrfach-Dialog** (Session mit Nachrichtenverlauf) innerhalb einer Overlay-Session unterstützen. |

#### 3.2 Out of Scope (für dieses BRS)

- Spracheingabe / Speech-to-Text (künftige Option; keine aktuelle Geschäftsanforderung).
- Bearbeitung von Portfolio-/Projektdaten oder Ausführung von Aktionen in der App (Chatbot ist nur lesend / beratend).
- Authentifizierungs-/Autorisierungsregeln (woanders definiert; Chatbot setzt ggf. authentifizierte Session voraus).
- Detaillierte RAG-Backend-Architektur (eigenes technisches Spec).

---

### 4. Geschäftsziele und Betriebskonzept

**Primäre Geschäftsziele:**

1. **Schnellerer Einstieg**: Neue Nutzer erhalten Antworten in ihrer Sprache und ihrem Register ohne Verlassen der App.
2. **Einheitliche Terminologie**: Dieselbe 2×3-Matrix wie im übrigen Value Generator (Labels, Tooltips, Berichte).
3. **Skalierbarkeit**: Ein Assistent für DE/EN/ES und colloquial/management ohne parallele „Versionen“ des Produkts.
4. **Vertrauen und Compliance**: Keine unzulässige Quellenzuordnung; paraphrasiertes, professionelles PMO-Wissen.

**Betriebskonzept:**

- Nutzer öffnet die App → wählt **Sprache** (DE/EN/ES) und **Register** (colloquial/management) im Header/Controls.
- Nutzer öffnet **AI Assistant** (Chatbot) aus Controls → Chatbot öffnet sich als Overlay; Begrüßung und alle weiteren Antworten nutzen die **aktuelle** Sprache und das aktuelle Register.
- Nutzer tippt Frage oder Befehl → System löst über Systembefehle → statisches Wissen → RAG (falls verfügbar); Antwort wird in derselben Sprache/Register gerendert.
- Optional später: Bei Implementierung „automatische Spracherkennung“ darf das System Sprache/Register aus dem Eingabetext vorschlagen oder wechseln, unter Einhaltung der 2×3-Matrix für die Ausgabe.

---

### 5. Stakeholder und Akzeptanz

**Primäre Stakeholder:**

- **Produkt / PMO**: Definiert PMO-Terminologie, Register und Themen, die der Assistent abdecken muss.
- **Endnutzer**: Projekt- und Portfoliomanager, Teammitglieder (colloquial) und Führung (management).
- **Entwicklung**: Implementierung und Betrieb von Frontend (ChatInterface, API-Route) und Backend (RAG, statisches Wissen).

**Akzeptanz:**

- Das BRS soll von Produkt und primären Stakeholdern **akzeptiert** werden, bevor Implementierungen den Umfang ändern.
- Änderungen am Sprach-/Register-Verhalten oder an Attributionsregeln sind in einer aktualisierten BRS-Version zu dokumentieren.

---

### 6. Rückverfolgbarkeit

| Geschäftsanforderung | Aktuelles Artefakt / Implementierung |
|----------------------|--------------------------------------|
| BR-C-01 | ChatInterface.tsx (Modal), GitHubStyleHeader.tsx / Controls → AI Assistant |
| BR-C-02 | ChatInterface.tsx (Eingabe, Senden), Nachrichtenliste |
| BR-C-03 bis BR-C-06 | LanguageContext.tsx (DE/EN/ES, colloquial/management), ChatInterface + /api/chat (query body: language, register) |
| BR-C-07 | Nicht implementiert; für künftige Spracherkennung aus Eingabe reserviert |
| BR-C-08 | ChatInterface.tsx: checkSystemCommand → SYSTEM_RESPONSES/SYSTEM_EXTENSIONS; matchPMOQuestion → staticPMOKnowledge; dann /api/chat → RAG-Backend |
| BR-C-09 | ChatInterface.tsx Fallback-Nachrichten (DE/EN/ES); /api/chat/route.ts Fallback bei Backend-Ausfall |
| BR-C-10, BR-C-11 | Projektregeln (z. B. .cursorrules): keine Quellenzuordnung; Paraphrasierung |
| BR-C-12 | ChatInterface.tsx (messages-State, Verlauf pro Session) |

**Verwandte Wissensdokumente:**

- frontend/docs/2026_01_systems_engineering_iso15288_de.md
- frontend/docs/2026_01_systems_engineering_iso15288_en.md  

Diese (und künftige Docs) können als RAG-Quellen genutzt werden; Inhalte müssen BR-C-10 und BR-C-11 einhalten.

---

### 7. Qualitätsmaße und Randbedingungen

**Qualität:**

- **Korrektheit**: Antworten in der gewählten Sprache und im gewählten Register; kein Sprach-/Register-Mix innerhalb einer Antwort.
- **Konsistenz**: Terminologie abgestimmt mit der 2×3-Matrix der App (z. B. ui-labels-matrix.json).
- **Verfügbarkeit**: Mit oder ohne RAG-Backend muss der Chatbot nützliche Antworten liefern (statisch + Systembefehle).
- **Nutzererlebnis**: Keine unbehandelten Fehler; freundlicher Fallback und ggf. kurze Hinweise (z. B. „Fragen zu /tour, /input, PMO-KPIs …“).

**Randbedingungen:**

- **IP / Attribution**: Strikte Einhaltung von BR-C-10 und BR-C-11 (kein „basierend auf X“ / „trainiert auf Y“; nur Paraphrasierung).
- **Performance**: Antwortzeit soll vertretbar bleiben (statisch und Systembefehle sofort; RAG abhängig vom Backend).
- **Sicherheit**: Chatbot gibt keine internen APIs oder Secrets preis; Eingabe und Antworten unterliegen denselben Sicherheitsregeln wie die übrige App.

---

### 8. Zusammenfassung

Der Chatbot des PMO Value Generator ist der **PMO Knowledge Assistant**: Er liefert bedarfsgerechte, sprach- und registergerechte Antworten (2×3-Matrix: DE/EN/ES × colloquial/management) aus Systembefehlen, statischem PMO-Wissen und – bei Verfügbarkeit – RAG. Er unterstützt die Produktmission ohne unzulässige Quellenzuordnung und bleibt nutzbar, wenn das RAG-Backend ausfällt. Dieses BRS ist die geschäftliche Grundlage für die aktuelle Implementierung und künftige Erweiterungen (z. B. automatische Spracherkennung).

---

*Dokumentversion: 1.0 | Status: Entwurf | Nächste Schritte: Stakeholder-Review und Versionierung im Repo.*
