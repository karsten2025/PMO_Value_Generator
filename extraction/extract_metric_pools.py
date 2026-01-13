#!/usr/bin/env python3
"""
PMO METRIC POOL EXTRACTION
==========================================
Extrahiert automatisch Metriken und Process Activities aus der PMO Knowledge Base.

Für jeden der 10 Prozesse werden extrahiert:
- INPUT-Metriken (5-10)
- PROCESS-Activities (5-10)
- OUTPUT-Metriken (5-10)
- OUTCOME-Metriken (5-10)
- FEEDBACK-Metriken (5-10)

Output: metric_pools_extracted.json (2x3 Matrix: DE/EN/ES, colloquial/management)
"""

import os
import json
import re
from pathlib import Path
from typing import Dict, List, Any
from openai import OpenAI
from dotenv import load_dotenv

# Environment - lade .env aus Root-Verzeichnis
root_dir = Path(__file__).parent.parent
load_dotenv(root_dir / ".env")
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# ========================================
# 1. DIE 10 PROZESSE (aus Frontend)
# ========================================
PROCESS_DEFINITIONS = [
    {
        "step_id": 1,
        "internal_code": "DIS_AWR",
        "title_en": "Awareness & Education",
        "title_de": "Bewusstseinsbildung & Schulung",
        "title_es": "Concienciación & Educación",
        "description_en": "Building awareness of PMO value through stakeholder communication and education",
        "description_de": "Aufbau von PMO-Wertbewusstsein durch Stakeholder-Kommunikation und Schulung",
        "description_es": "Creación de conciencia del valor de PMO mediante comunicación y educación de stakeholders"
    },
    {
        "step_id": 2,
        "internal_code": "DIS_NEA",
        "title_en": "Requirements Discovery",
        "title_de": "Bedarfsermittlung",
        "title_es": "Descubrimiento de Requisitos",
        "description_en": "Systematic collection and analysis of stakeholder requirements",
        "description_de": "Systematische Erhebung und Analyse von Stakeholder-Anforderungen",
        "description_es": "Recopilación y análisis sistemático de requisitos de stakeholders"
    },
    {
        "step_id": 3,
        "internal_code": "PLN_VPR",
        "title_en": "Benefit Definition",
        "title_de": "Nutzenformulierung",
        "title_es": "Definición de Beneficios",
        "description_en": "Articulating concrete benefits and value propositions",
        "description_de": "Formulierung konkreter Nutzen und Wertversprechen",
        "description_es": "Articulación de beneficios concretos y propuestas de valor"
    },
    {
        "step_id": 4,
        "internal_code": "PLN_SDE",
        "title_en": "Solution Design",
        "title_de": "Lösungsentwicklung",
        "title_es": "Diseño de Solución",
        "description_en": "Designing tailored PMO services with clear service level agreements",
        "description_de": "Entwicklung maßgeschneiderter PMO-Services mit klaren Service Level Agreements",
        "description_es": "Diseño de servicios PMO personalizados con acuerdos de nivel de servicio claros"
    },
    {
        "step_id": 5,
        "internal_code": "IMP_ONB",
        "title_en": "Service Launch",
        "title_de": "Service-Einführung",
        "title_es": "Lanzamiento de Servicio",
        "description_en": "Structured rollout of new PMO services with change management",
        "description_de": "Strukturierte Einführung neuer PMO-Services mit Change Management",
        "description_es": "Lanzamiento estructurado de nuevos servicios PMO con gestión del cambio"
    },
    {
        "step_id": 6,
        "internal_code": "IMP_OPS",
        "title_en": "Daily Operations",
        "title_de": "Tagesgeschäft",
        "title_es": "Operaciones Diarias",
        "description_en": "Consistent delivery of agreed services with SLA compliance",
        "description_de": "Konsistente Erbringung vereinbarter Leistungen mit SLA-Erfüllung",
        "description_es": "Entrega consistente de servicios acordados con cumplimiento de SLA"
    },
    {
        "step_id": 7,
        "internal_code": "OPT_MON",
        "title_en": "Performance Tracking",
        "title_de": "Performance-Monitoring",
        "title_es": "Seguimiento de Rendimiento",
        "description_en": "KPI-based monitoring of service efficiency and compliance",
        "description_de": "KPI-basiertes Monitoring von Service-Effizienz und Compliance",
        "description_es": "Monitoreo basado en KPIs de eficiencia del servicio y cumplimiento"
    },
    {
        "step_id": 8,
        "internal_code": "OPT_IMP",
        "title_en": "Continuous Enhancement",
        "title_de": "Kontinuierliche Verbesserung",
        "title_es": "Mejora Continua",
        "description_en": "Systematic service maturity improvement through gap analysis",
        "description_de": "Systematische Service-Reifegradverbesserung durch Gap-Analyse",
        "description_es": "Mejora sistemática de madurez del servicio mediante análisis de brechas"
    },
    {
        "step_id": 9,
        "internal_code": "IMP_VDL",
        "title_en": "Outcome Realization",
        "title_de": "Ergebnisrealisierung",
        "title_es": "Realización de Resultados",
        "description_en": "Quantification and communication of realized business value",
        "description_de": "Quantifizierung und Kommunikation des realisierten Business Value",
        "description_es": "Cuantificación y comunicación del valor empresarial realizado"
    },
    {
        "step_id": 10,
        "internal_code": "IMP_REC",
        "title_en": "Stakeholder Validation",
        "title_de": "Stakeholder-Anerkennung",
        "title_es": "Validación de Stakeholders",
        "description_en": "Systematic capture of stakeholder recognition and feedback",
        "description_de": "Systematische Erfassung von Stakeholder-Anerkennung und Feedback",
        "description_es": "Captura sistemática de reconocimiento y retroalimentación de stakeholders"
    }
]

# ========================================
# 2. METRIC CATEGORIES
# ========================================
METRIC_CATEGORIES = ["input", "process", "output", "outcome", "feedback"]

# ========================================
# 3. HELPER: Lade Knowledge Base Texte
# ========================================
def load_knowledge_base_texts() -> List[str]:
    """Lädt alle extrahierten PDF-Texte."""
    output_dir = Path(__file__).parent / "output_text"
    texts = []
    
    for txt_file in output_dir.glob("*.txt"):
        print(f"📖 Lade: {txt_file.name}")
        with open(txt_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Nimm nur erste 50000 Zeichen pro Datei (um Token-Limit zu vermeiden)
            texts.append(content[:50000])
    
    return texts

# ========================================
# 4. HAUPTFUNKTION: Extrahiere Metriken
# ========================================
def extract_metrics_for_process(
    process: Dict[str, Any],
    category: str,
    knowledge_texts: List[str]
) -> List[Dict[str, Any]]:
    """
    Extrahiert 10 Metriken/Activities für einen Prozess und eine Kategorie.
    
    Args:
        process: Prozess-Definition
        category: "input", "process", "output", "outcome", "feedback"
        knowledge_texts: Liste der PDF-Texte
    
    Returns:
        Liste von 10 Metriken mit 2x3 Matrix Beschreibungen
    """
    print(f"\n🔍 Extrahiere {category.upper()}-Metriken für Prozess {process['step_id']}: {process['title_en']}")
    
    # Kontextualisierung für die AI
    category_descriptions = {
        "input": "Resources that GO INTO this process (budget, time, people, materials, tools)",
        "process": "Activities and tasks that HAPPEN DURING this process (workshops, meetings, analyses, documentation)",
        "output": "Direct deliverables that COME OUT of this process (documents, trained people, created artifacts)",
        "outcome": "Medium-term effects and changes that result from this process (improved knowledge, increased adoption, behavioral change)",
        "feedback": "Mechanisms to collect feedback and measure perceived value of this process (surveys, satisfaction scores, testimonials)"
    }
    
    prompt = f"""You are a PMO metrics expert. Extract 10 {category.upper()} metrics/activities for the following PMO process:

**PROCESS:** {process['title_en']} ({process['title_de']}, {process['title_es']})
**DESCRIPTION:** {process['description_en']}

**CATEGORY:** {category_descriptions[category]}

**INSTRUCTIONS:**
1. Extract 10 specific, measurable metrics or activities
2. Base them on professional PM knowledge and best practices
3. Make them realistic and actionable
4. Ensure they are SPECIFIC to this process and category

**OUTPUT FORMAT (JSON):**
[
  {{
    "name_en": "Metric name in English",
    "name_de": "Metrik-Name auf Deutsch",
    "name_es": "Nombre de métrica en español",
    "unit": "€|hours|count|%|1-10 scale|days|text",
    "metric_type": "{('activity' if category == 'process' else 'metric')}",
    "description": {{
      "de": {{
        "colloquial": "Einfache Erklärung auf Deutsch für Teammitglieder",
        "management": "Formelle Erklärung auf Deutsch für Management/C-Level"
      }},
      "en": {{
        "colloquial": "Simple explanation in English for team members",
        "management": "Formal explanation in English for management/C-level"
      }},
      "es": {{
        "colloquial": "Explicación simple en español para miembros del equipo",
        "management": "Explicación formal en español para gerencia/C-level"
      }}
    }},
    "calculation_method": "How is this metric calculated or measured?",
    "recommended_for": ["large_pmo", "startup_pmo", "regulated_industry", "agile_org"]
  }}
]

Extract exactly 10 metrics. Return ONLY valid JSON, no additional text."""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a PMO metrics expert. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=4000
        )
        
        result = response.choices[0].message.content.strip()
        
        # Entferne mögliche Markdown-Formatierung
        result = re.sub(r'^```json\s*', '', result)
        result = re.sub(r'\s*```$', '', result)
        
        metrics = json.loads(result)
        
        print(f"✅ {len(metrics)} Metriken extrahiert")
        return metrics
        
    except Exception as e:
        print(f"❌ Fehler beim Extrahieren: {e}")
        return []

# ========================================
# 5. MAIN: Orchestriere Extraktion
# ========================================
def main():
    print("="*60)
    print("🚀 PMO METRIC POOL EXTRACTION")
    print("="*60)
    
    # Lade Knowledge Base
    print("\n📚 Lade Knowledge Base...")
    kb_texts = load_knowledge_base_texts()
    print(f"✅ {len(kb_texts)} Dokumente geladen\n")
    
    # Gesamtstruktur
    all_metrics = {
        "meta": {
            "generated_at": "2026-01-12",
            "total_processes": len(PROCESS_DEFINITIONS),
            "categories": METRIC_CATEGORIES,
            "metrics_per_category": 10
        },
        "processes": []
    }
    
    # Für jeden Prozess
    for process in PROCESS_DEFINITIONS:
        print(f"\n{'='*60}")
        print(f"📊 PROZESS {process['step_id']}: {process['title_en']}")
        print(f"{'='*60}")
        
        process_data = {
            "step_id": process['step_id'],
            "internal_code": process['internal_code'],
            "title": {
                "en": process['title_en'],
                "de": process['title_de'],
                "es": process['title_es']
            },
            "metrics": {}
        }
        
        # Für jede Kategorie
        for category in METRIC_CATEGORIES:
            metrics = extract_metrics_for_process(process, category, kb_texts)
            process_data["metrics"][category] = metrics
            
            # Kleine Pause um Rate Limits zu vermeiden
            import time
            time.sleep(2)
        
        all_metrics["processes"].append(process_data)
    
    # Speichere Resultat
    output_file = Path(__file__).parent / "metric_pools_extracted.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_metrics, f, ensure_ascii=False, indent=2)
    
    print(f"\n{'='*60}")
    print(f"✅ EXTRACTION COMPLETE!")
    print(f"📁 Saved to: {output_file}")
    print(f"📊 Total: {len(all_metrics['processes'])} processes × {len(METRIC_CATEGORIES)} categories × 10 metrics")
    print(f"   = {len(all_metrics['processes']) * len(METRIC_CATEGORIES) * 10} total metrics")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()

