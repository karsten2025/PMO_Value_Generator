#!/usr/bin/env python3
"""
PMO METRIC POOL EXTRACTION - PROOF OF CONCEPT
==========================================
Extrahiert Metriken nur für PROZESS 1 als Qualitätsprüfung.

Prozess 1: Awareness & Education (Bewusstseinsbildung & Schulung)
- INPUT-Metriken (10)
- PROCESS-Activities (10)
- OUTPUT-Metriken (10)
- OUTCOME-Metriken (10)
- FEEDBACK-Metriken (10)

Total: 50 Metriken für Prozess 1
"""

import os
import json
import re
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Environment
root_dir = Path(__file__).parent.parent
load_dotenv(root_dir / ".env")
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# ========================================
# PROZESS 1 DEFINITION
# ========================================
PROCESS_1 = {
    "step_id": 1,
    "internal_code": "DIS_AWR",
    "title_en": "Awareness & Education",
    "title_de": "Bewusstseinsbildung & Schulung",
    "title_es": "Concienciación & Educación",
    "description_en": "Building awareness of PMO value through stakeholder communication and education. Strategic positioning through targeted campaigns and training programs.",
    "description_de": "Aufbau von PMO-Wertbewusstsein durch Stakeholder-Kommunikation und Schulung. Strategische Positionierung durch gezielte Kampagnen und Trainingsprogramme.",
    "description_es": "Creación de conciencia del valor de PMO mediante comunicación y educación de stakeholders. Posicionamiento estratégico mediante campañas dirigidas y programas de capacitación."
}

# ========================================
# METRIC CATEGORIES mit Kontextualisierung
# ========================================
CATEGORY_CONTEXT = {
    "input": {
        "description": "Resources that GO INTO this process",
        "examples": "budget allocated for training, hours invested by trainers, number of training materials prepared, stakeholder availability, communication channels used",
        "focus": "What resources are CONSUMED?"
    },
    "process": {
        "description": "Activities and tasks that HAPPEN DURING this process",
        "examples": "kick-off workshops, e-learning modules, town hall meetings, 1:1 coaching sessions, documentation creation, communication campaigns",
        "focus": "What ACTIVITIES are performed?"
    },
    "output": {
        "description": "Direct deliverables that COME OUT of this process",
        "examples": "number of workshops conducted, people trained, certificates issued, training materials created, communication messages sent",
        "focus": "What tangible OUTPUTS are produced?"
    },
    "outcome": {
        "description": "Medium-term effects and changes resulting from this process",
        "examples": "increased PMO awareness levels, improved stakeholder knowledge, higher acceptance rates, behavioral changes, engagement scores",
        "focus": "What CHANGES occur in people's knowledge/behavior?"
    },
    "feedback": {
        "description": "Mechanisms to collect feedback and measure perceived value",
        "examples": "training satisfaction surveys, Net Promoter Score, testimonials collected, follow-up interviews, value perception ratings",
        "focus": "How do we measure SATISFACTION and VALUE?"
    }
}

# ========================================
# EXTRACTION FUNKTION
# ========================================
def extract_metrics_for_category(category: str) -> list:
    """Extrahiert 10 Metriken für eine Kategorie."""
    
    context = CATEGORY_CONTEXT[category]
    metric_type = "activity" if category == "process" else "metric"
    
    prompt = f"""You are a PMO metrics expert. Extract 10 professional {category.upper()} {"activities" if category == "process" else "metrics"} for this PMO process:

**PROCESS:** {PROCESS_1['title_en']}
**DESCRIPTION:** {PROCESS_1['description_en']}

**CATEGORY DEFINITION:**
{context['description']}

**EXAMPLES:** {context['examples']}
**FOCUS:** {context['focus']}

**REQUIREMENTS:**
1. Extract exactly 10 specific, measurable {"activities" if category == "process" else "metrics"}
2. Base them on professional PM knowledge and industry best practices
3. Make them realistic and actionable for a real PMO
4. Each should have a clear unit of measurement
5. Provide 2x3 matrix descriptions:
   - DE/EN/ES (languages)
   - colloquial (simple, team-friendly) vs management (formal, C-level)

**OUTPUT FORMAT (JSON array with 10 items):**
[
  {{
    "name_en": "Clear metric name in English",
    "name_de": "Klarer Metrik-Name auf Deutsch",
    "name_es": "Nombre claro de métrica en español",
    "unit": "{('text' if category == 'process' else '€|hours|count|%|1-10 scale|days')}",
    "metric_type": "{metric_type}",
    "description": {{
      "de": {{
        "colloquial": "Einfache, verständliche Erklärung für Teammitglieder (1-2 Sätze)",
        "management": "Formelle, strategische Erklärung für Management/C-Level mit Business-Fokus (1-2 Sätze)"
      }},
      "en": {{
        "colloquial": "Simple, understandable explanation for team members (1-2 sentences)",
        "management": "Formal, strategic explanation for management/C-level with business focus (1-2 sentences)"
      }},
      "es": {{
        "colloquial": "Explicación simple y comprensible para miembros del equipo (1-2 frases)",
        "management": "Explicación formal y estratégica para gerencia/C-level con enfoque empresarial (1-2 frases)"
      }}
    }},
    "calculation_method": "How is this metric calculated or measured?",
    "recommended_for": ["large_pmo", "startup_pmo", "regulated_industry", "agile_org", "transformation_pmo"]
  }}
]

**IMPORTANT:** 
- Return ONLY valid JSON (no markdown, no extra text)
- Exactly 10 items
- All fields required
- Descriptions should be concise (1-2 sentences each)

Generate the 10 {"activities" if category == "process" else "metrics"} now:"""

    try:
        print(f"\n🔍 Extrahiere {category.upper()}-{'Activities' if category == 'process' else 'Metriken'}...")
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a PMO metrics expert. Always return valid JSON only."},
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
        
        print(f"✅ {len(metrics)} {category.upper()}-{'Activities' if category == 'process' else 'Metriken'} extrahiert")
        
        # Validierung
        if len(metrics) != 10:
            print(f"⚠️  Warnung: Erwartete 10, erhielt {len(metrics)}")
        
        return metrics
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON Parse Error: {e}")
        print(f"Response war:\n{result[:500]}...")
        return []
    except Exception as e:
        print(f"❌ Fehler: {e}")
        return []

# ========================================
# MAIN
# ========================================
def main():
    print("="*70)
    print("🚀 PMO METRIC POOL EXTRACTION - PROOF OF CONCEPT")
    print("="*70)
    print(f"\n📊 Prozess 1: {PROCESS_1['title_en']}")
    print(f"   ({PROCESS_1['title_de']} / {PROCESS_1['title_es']})")
    print(f"\n🎯 Extrahiere 5 Kategorien × 10 Metriken = 50 Metriken\n")
    
    result = {
        "meta": {
            "generated_at": "2026-01-12",
            "process": PROCESS_1,
            "total_metrics": 50
        },
        "metrics": {}
    }
    
    categories = ["input", "process", "output", "outcome", "feedback"]
    
    for i, category in enumerate(categories, 1):
        print(f"\n{'─'*70}")
        print(f"[{i}/5] {category.upper()}")
        print(f"{'─'*70}")
        
        metrics = extract_metrics_for_category(category)
        result["metrics"][category] = metrics
        
        # Kurze Pause zwischen API Calls
        if i < len(categories):
            import time
            time.sleep(2)
    
    # Speichere Resultat
    output_file = Path(__file__).parent / "process_1_metrics_poc.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    # Statistik
    total = sum(len(result["metrics"][cat]) for cat in categories)
    
    print(f"\n{'='*70}")
    print(f"✅ PROOF OF CONCEPT COMPLETE!")
    print(f"{'='*70}")
    print(f"📁 Saved to: {output_file}")
    print(f"\n📊 STATISTIK:")
    print(f"   • INPUT:    {len(result['metrics']['input'])} Metriken")
    print(f"   • PROCESS:  {len(result['metrics']['process'])} Activities")
    print(f"   • OUTPUT:   {len(result['metrics']['output'])} Metriken")
    print(f"   • OUTCOME:  {len(result['metrics']['outcome'])} Metriken")
    print(f"   • FEEDBACK: {len(result['metrics']['feedback'])} Metriken")
    print(f"   ─────────────────")
    print(f"   TOTAL:      {total} Metriken/Activities")
    print(f"\n🎯 Nächster Schritt: Qualität prüfen, dann auf alle 10 Prozesse ausrollen!")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    main()

