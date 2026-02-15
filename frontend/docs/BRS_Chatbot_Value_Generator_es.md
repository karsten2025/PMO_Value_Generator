---
Title: "Especificación de Requisitos de Negocio (BRS) – Chatbot PMO Value Generator"
Version: 1.0
Status: Borrador
Language: es
Source: Proyecto PMO Value Generator
Tags: BRS, chatbot, requisitos, matriz-2x3, idioma, RAG, value-engine
Traceability: ChatInterface, /api/chat, LanguageContext, staticPMOKnowledge, systemGuide
Related: 2026_01_systems_engineering_iso15288_en.md, 2026_01_systems_engineering_iso15288_de.md | BRS_en: BRS_Chatbot_Value_Generator_en.md, BRS_de: BRS_Chatbot_Value_Generator_de.md
---

# Especificación de Requisitos de Negocio (BRS)  
## PMO Value Generator – Chatbot (Asistente de Conocimiento PMO)

### 1. Propósito de este BRS

Esta Especificación de Requisitos de Negocio (BRS) define los **requisitos de negocio** del **chatbot** (Asistente de Conocimiento PMO) del PMO Value Generator. Sirve como:

- **Base para el desarrollo**: Enunciado del problema y contexto de la función del chatbot dentro de la Value Engine.
- **Definición de requisitos**: Necesidades de negocio y de usuario que el chatbot debe cumplir, incluida la matriz idioma/registro 2×3 y el comportamiento lingüístico.
- **Alcance y objetivos**: Capacidades dentro y fuera del alcance, y cómo el chatbot apoya la misión global del producto.
- **Trazabilidad**: Enlaces desde los requisitos de negocio a artefactos existentes (p. ej. `ChatInterface`, `/api/chat`, `LanguageContext`, documentos de conocimiento) y hacia especificaciones técnicas futuras.
- **Alineación con stakeholders**: Referencia única para producto, PMO y desarrollo sobre qué debe entregar el chatbot.
- **Base de calidad**: Restricciones y criterios de aceptación que apoyan el control de riesgos y la calidad de entrega.

El BRS **no** es un documento de diseño técnico; describe *qué* debe hacer el sistema desde la perspectiva de negocio/usuario, no *cómo* se implementa.

---

### 2. Antecedentes y Enunciado del Problema

**Contexto:**  
El PMO Value Generator es una aplicación web que visualiza y gestiona el valor del portafolio (Impact Cycle, Portfolio Health Hub, PMP, KPIs de proyecto). Los usuarios necesitan **acceso bajo demanda al conocimiento PMO y de la Value Engine** sin salir de la aplicación (p. ej. uso de la herramienta, qué KPIs elegir o cómo se relaciona Systems Engineering, p. ej. ISO 15288, con la Value Engine).

**Problema / Necesidad:**  
Sin un asistente integrado, los usuarios deben cambiar a documentación externa, buscar o preguntar a colegas. Esto ralentiza la adopción, genera inconsistencia terminológica (p. ej. coloquial vs. management) y no escala entre idiomas (DE, EN, ES) ni roles (equipo vs. dirección).

**Misión del chatbot:**  
Actuar como **Asistente de Conocimiento PMO** dentro del Value Generator: responder en el **idioma** y **registro** elegidos por el usuario (matriz 2×3), utilizando conocimiento estático y, cuando esté disponible, RAG sobre conocimiento del proyecto (p. ej. documentos de systems engineering), respetando las reglas de IP y atribución (sin “entrenado en X” ni “basado en Y practice guides” en texto visible para el usuario).

---

### 3. Alcance

#### 3.1 Dentro del alcance

| ID | Requisito / Capacidad |
|----|------------------------|
| BR-C-01 | El chatbot estará disponible desde la aplicación principal (p. ej. menú Controls / AI Assistant) y se abrirá como overlay (modal) sin navegar fuera. |
| BR-C-02 | El chatbot aceptará **entrada de texto** del usuario (preguntas o comandos) y devolverá **respuestas de texto** (y referencias de fuentes opcionales). |
| BR-C-03 | El chatbot operará en **tres idiomas**: **DE**, **EN**, **ES**. |
| BR-C-04 | El chatbot soportará **dos registros** por idioma: **colloquial** (lenguaje llano, “qué/por qué”) y **management** (formal, valor/KPI/gobierno). |
| BR-C-05 | **Matriz 2×3**: Todas las respuestas visibles para el usuario (bienvenida, respuestas, fallbacks, comandos de sistema) se entregarán en el **idioma y registro actualmente seleccionados** (DE/EN/ES × colloquial/management). |
| BR-C-06 | El idioma y el registro serán **controlados por la configuración global de la aplicación** (p. ej. LanguageContext), de modo que el chatbot refleje el mismo idioma/registro que el resto de la UI. |
| BR-C-07 | **Opcional / futuro – reconocimiento automático de idioma**: El sistema podrá **detectar** el idioma del usuario a partir del texto de entrada y sugerir o alinear el idioma de la respuesta (o cambiar el idioma de la UI) para mejorar la accesibilidad; esto no sustituirá la selección explícita 2×3 como comportamiento principal. |
| BR-C-08 | El chatbot responderá, por orden de preferencia: (1) **comandos de sistema** (p. ej. `/tour`, `/input`, `/output`), (2) **conocimiento PMO estático** (p. ej. KPIs, mejores prácticas, uso de la herramienta), (3) **backend RAG** (cuando esté disponible) sobre conocimiento aprobado (p. ej. documentos de systems engineering). |
| BR-C-09 | Cuando el backend RAG no esté disponible, el chatbot seguirá respondiendo desde conocimiento estático y comandos de sistema y mostrará un fallback claro y amigable (sin errores técnicos crudos al usuario). |
| BR-C-10 | **Atribución de fuentes**: Ningún texto visible para el usuario afirmará “basado en X practice guides”, “entrenado en Y documentos” o “extraído de Z frameworks”. Solo formulaciones genéricas (p. ej. “Asistente de Conocimiento PMO”, “mejores prácticas de la industria”, “conocimiento PMO profesional”). |
| BR-C-11 | El contenido de conocimiento será **parafraseado** (redacción propia), no copia literal de fuentes protegidas. |
| BR-C-12 | El chatbot soportará **conversación multi-turno** (sesión con historial de mensajes) dentro de una sesión de overlay. |

#### 3.2 Fuera del alcance (para este BRS)

- Entrada de voz / speech-to-text (opción futura; no es un requisito de negocio actual).
- Edición de datos de portafolio/proyecto o ejecución de acciones en la app (el chatbot es solo lectura / asesor).
- Reglas de autenticación/autorización (definidas en otro lugar; el chatbot asume sesión autenticada cuando aplique).
- Arquitectura detallada del backend RAG (especificación técnica aparte).

---

### 4. Objetivos de Negocio y Concepto Operativo

**Objetivos de negocio principales:**

1. **Onboarding más rápido**: Los nuevos usuarios obtienen respuestas en su idioma y registro sin salir de la app.
2. **Terminología consistente**: Misma matriz 2×3 que el resto del Value Generator (etiquetas, tooltips, informes).
3. **Escalabilidad**: Un asistente sirve DE/EN/ES y colloquial/management sin mantener “versiones” separadas del producto.
4. **Confianza y cumplimiento**: Sin atribución de fuentes inapropiada; conocimiento PMO profesional y parafraseado.

**Concepto operativo:**

- El usuario abre la app → selecciona **idioma** (DE/EN/ES) y **registro** (colloquial/management) en el header/Controls.
- El usuario abre **AI Assistant** (chatbot) desde Controls → el chatbot se abre como overlay; el mensaje de bienvenida y todas las respuestas posteriores usan el **actual** idioma y registro.
- El usuario escribe una pregunta o comando → el sistema resuelve vía comandos de sistema → conocimiento estático → RAG (si está disponible); la respuesta se renderiza en el mismo idioma/registro.
- Opcional más adelante: si se implementa “reconocimiento automático de idioma”, el sistema podrá sugerir o cambiar idioma/registro según el texto de entrada, respetando siempre la matriz 2×3 en la salida.

---

### 5. Stakeholders y Aceptación

**Stakeholders principales:**

- **Producto / PMO**: Define terminología PMO, registro y temas que el asistente debe cubrir.
- **Usuarios finales**: Gestores de proyecto y portafolio, miembros del equipo (colloquial) y dirección (management).
- **Desarrollo**: Implementa y mantiene frontend (ChatInterface, ruta API) y backend (RAG, conocimiento estático).

**Aceptación:**

- El BRS debe ser **aceptado** por producto y stakeholders principales antes de implementar nuevas funcionalidades que cambien el alcance.
- Los cambios en el comportamiento de idioma/registro o en las reglas de atribución se reflejarán en una versión actualizada del BRS.

---

### 6. Trazabilidad

| Requisito de negocio | Artefacto / implementación actual |
|----------------------|-----------------------------------|
| BR-C-01 | `ChatInterface.tsx` (modal), `GitHubStyleHeader.tsx` / Controls → AI Assistant |
| BR-C-02 | `ChatInterface.tsx` (entrada, envío), lista de mensajes |
| BR-C-03, BR-C-04, BR-C-05, BR-C-06 | `LanguageContext.tsx` (DE/EN/ES, colloquial/management), `ChatInterface` + `/api/chat` (cuerpo query: `language`, `register`) |
| BR-C-07 | No implementado; reservado para futuro (p. ej. detección de idioma desde entrada) |
| BR-C-08 | `ChatInterface.tsx`: `checkSystemCommand` → `SYSTEM_RESPONSES` / `SYSTEM_EXTENSIONS`; `matchPMOQuestion` → `staticPMOKnowledge`; luego `/api/chat` → backend RAG |
| BR-C-09 | Mensajes fallback en `ChatInterface.tsx` (DE/EN/ES); fallback en `/api/chat/route.ts` cuando falla el backend |
| BR-C-10, BR-C-11 | Reglas del proyecto (p. ej. .cursorrules): sin atribución de fuentes; parafraseo |
| BR-C-12 | `ChatInterface.tsx` (estado messages, historial en sesión) |

**Documentos de conocimiento relacionados:**

- `frontend/docs/2026_01_systems_engineering_iso15288_en.md`
- `frontend/docs/2026_01_systems_engineering_iso15288_de.md`  
Estos (y futuros docs) pueden usarse como fuentes RAG; el contenido debe cumplir BR-C-10 y BR-C-11.

---

### 7. Medidas de Calidad y Restricciones

**Calidad:**

- **Corrección**: Respuestas en el idioma y registro seleccionados; sin mezcla de idioma/registro en una misma respuesta.
- **Consistencia**: Terminología alineada con la matriz 2×3 usada en el resto de la app (p. ej. `ui-labels-matrix.json`).
- **Disponibilidad**: Con o sin backend RAG, el chatbot debe seguir ofreciendo respuestas útiles (estático + comandos de sistema).
- **Experiencia de usuario**: Sin errores no manejados; fallback amigable y, si hace falta, guía breve (p. ej. “Pregunta sobre /tour, /input, KPIs PMO…”).

**Restricciones:**

- **IP / atribución**: Cumplimiento estricto de BR-C-10 y BR-C-11 (sin “basado en X” / “entrenado en Y”; solo parafraseo).
- **Rendimiento**: El tiempo de respuesta debe ser aceptable (estático y comandos inmediatos; RAG dependiente del backend).
- **Seguridad**: El chatbot no expone APIs internas ni secretos; entrada y respuestas siguen la misma seguridad que el resto de la app.

---

### 8. Resumen

El chatbot del PMO Value Generator es el **Asistente de Conocimiento PMO**: ofrece respuestas bajo demanda, conscientes del idioma y del registro (matriz 2×3: DE/EN/ES × colloquial/management), a partir de comandos de sistema, conocimiento PMO estático y, cuando esté disponible, RAG. Apoya la misión del producto sin atribución de fuentes inapropiada y sigue siendo usable cuando el backend RAG no está disponible. Este BRS es la base de negocio para la implementación actual y mejoras futuras (p. ej. reconocimiento automático de idioma).

---

*Versión del documento: 1.0 | Estado: Borrador | Siguiente: Revisión por stakeholders y versionado en el repositorio.*
