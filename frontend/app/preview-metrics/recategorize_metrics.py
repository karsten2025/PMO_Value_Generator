#!/usr/bin/env python3
"""
Automated Metric Re-Categorization Script
Based on Logic Model Framework (PMO Impact Cycle)

Categories:
- INPUT:    Resources, Budget, Material Prepared
- PROCESS:  Activities, Sessions Conducted, Workshops Held
- OUTPUT:   Deliverables, Documents Created, People Trained
- OUTCOME:  Business Value, Engagement, Adoption Rate
- FEEDBACK: Satisfaction Scores, NPS, Ratings

Author: AI Assistant
Date: 2026-01-15
"""

import json
import os
from typing import Dict, List, Tuple
from pathlib import Path

# ===========================
# CATEGORIZATION RULES
# ===========================

INPUT_KEYWORDS = [
    'budget', 'hours allocated', 'staff allocated', 'capacity',
    'material prepared', 'tools available', 'resources',
    'hours invested', 'hours planned', 'sources used',
    'templates used', 'data sources connected'
]

PROCESS_KEYWORDS = [
    'conducted', 'held', 'performed', 'delivered',
    'sessions', 'workshops', 'reviews', 'meetings',
    'processed', 'handled', 'executed', 'launched',
    'implemented', 'organized', 'documented'
]

OUTPUT_KEYWORDS = [
    'created', 'completed', 'generated', 'trained',
    'produced', 'established', 'activated', 'achieved',
    'catalog', 'document', 'plan', 'report',
    'definitions', 'dashboards active', 'identified'
]

OUTCOME_KEYWORDS = [
    'engagement', 'satisfaction', 'adoption', 'buy-in',
    'improvement', 'acceptance', 'awareness level',
    'knowledge improvement', 'understanding', 'recognition',
    'legitimacy', 'sponsorship', 'embeddedness',
    'compliance rate', 'response time', 'quality improvement',
    'roi percentage', 'benefits', 'goals achieved',
    'value', 'impact', 'competence level', 'resistance index'
]

FEEDBACK_KEYWORDS = [
    'satisfaction score', 'nps', 'rating', 'feedback',
    'response rate', 'clarity', 'credibility', 'quality rating',
    'effectiveness score', 'willingness', 'criticism'
]

def categorize_metric(name_en: str, name_de: str, name_es: str, description: Dict) -> str:
    """
    Categorize a metric based on semantic rules.
    
    Priority Order:
    1. FEEDBACK (most specific)
    2. OUTCOME (business value)
    3. OUTPUT (deliverables)
    4. PROCESS (activities)
    5. INPUT (resources - default)
    """
    # Combine all text for analysis
    combined_text = f"{name_en} {name_de} {name_es}".lower()
    
    # Add description for context (colloquial + management)
    for lang in ['de', 'en', 'es']:
        if lang in description:
            for mode in ['colloquial', 'management']:
                if mode in description[lang]:
                    combined_text += f" {description[lang][mode]}"
    
    # FEEDBACK: Most specific (contains "score", "rating", "nps")
    for keyword in FEEDBACK_KEYWORDS:
        if keyword in combined_text:
            return 'feedback'
    
    # OUTCOME: Business value indicators
    # Special handling for "engagement" + "sessions"
    if 'engagement' in combined_text and 'stakeholder' in combined_text:
        return 'outcome'
    
    for keyword in OUTCOME_KEYWORDS:
        if keyword in combined_text:
            return 'outcome'
    
    # OUTPUT: Deliverables, created items, trained people
    # BUT: Exclude if it's clearly a PROCESS activity
    if any(kw in combined_text for kw in OUTPUT_KEYWORDS):
        # Check if it's NOT a process activity
        process_indicators = ['conducted', 'held', 'performed', 'delivered']
        if not any(pi in combined_text for pi in process_indicators):
            return 'output'
    
    # PROCESS: Activities (conducted, held, performed)
    for keyword in PROCESS_KEYWORDS:
        if keyword in combined_text:
            return 'process'
    
    # INPUT: Resources (default)
    for keyword in INPUT_KEYWORDS:
        if keyword in combined_text:
            return 'input'
    
    # Default: INPUT (wenn unklar)
    return 'input'

def analyze_json_file(filepath: Path) -> Dict:
    """Load and analyze a single JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes = []
    metrics_by_category = {
        'input': [],
        'process': [],
        'output': [],
        'outcome': [],
        'feedback': []
    }
    
    # Analyze each metric
    for old_category, metrics_list in data['metrics'].items():
        for metric in metrics_list:
            name_en = metric.get('name_en', '')
            name_de = metric.get('name_de', '')
            name_es = metric.get('name_es', '')
            description = metric.get('description', {})
            
            # Determine new category
            new_category = categorize_metric(name_en, name_de, name_es, description)
            
            # Track change
            if old_category != new_category:
                changes.append({
                    'name': name_en,
                    'old': old_category,
                    'new': new_category
                })
            
            # Add to new category
            metrics_by_category[new_category].append(metric)
    
    return {
        'filepath': filepath,
        'process_id': data['meta']['process']['step_id'],
        'process_name': data['meta']['process']['title_en'],
        'changes': changes,
        'new_metrics': metrics_by_category,
        'meta': data['meta']
    }

def generate_preview_report(results: List[Dict]) -> str:
    """Generate a human-readable preview report."""
    report = []
    report.append("=" * 80)
    report.append("METRIC RE-CATEGORIZATION PREVIEW REPORT")
    report.append("=" * 80)
    report.append("")
    
    total_changes = 0
    
    for result in results:
        changes = result['changes']
        if not changes:
            continue
        
        total_changes += len(changes)
        
        report.append(f"PROCESS {result['process_id']}: {result['process_name']}")
        report.append("-" * 80)
        
        for change in changes:
            old_cat = change['old'].upper()
            new_cat = change['new'].upper()
            report.append(f"  • {change['name']}")
            report.append(f"    {old_cat:10} → {new_cat:10}")
        
        report.append("")
    
    report.append("=" * 80)
    report.append(f"TOTAL CHANGES: {total_changes}")
    report.append("=" * 80)
    
    return "\n".join(report)

def apply_changes(results: List[Dict], preview_only: bool = True):
    """Apply changes to JSON files."""
    for result in results:
        if not result['changes']:
            continue
        
        filepath = result['filepath']
        
        # Reconstruct JSON
        new_data = {
            'meta': result['meta'],
            'metrics': result['new_metrics']
        }
        
        if preview_only:
            print(f"[PREVIEW] Would update: {filepath.name}")
        else:
            # Backup original
            backup_path = filepath.with_suffix('.json.bak')
            with open(filepath, 'r', encoding='utf-8') as f:
                original = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original)
            
            # Write new version
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, indent=2, ensure_ascii=False)
            
            print(f"[APPLIED] Updated: {filepath.name} (backup: {backup_path.name})")

def main():
    """Main execution."""
    script_dir = Path(__file__).parent
    json_files = sorted(script_dir.glob('process_*_metrics_showcase.json'))
    
    if not json_files:
        print("ERROR: No JSON files found!")
        return
    
    print(f"Found {len(json_files)} JSON files to analyze...")
    print("")
    
    # Analyze all files
    results = []
    for filepath in json_files:
        print(f"Analyzing: {filepath.name}")
        result = analyze_json_file(filepath)
        results.append(result)
    
    print("")
    print("=" * 80)
    print("ANALYSIS COMPLETE!")
    print("=" * 80)
    print("")
    
    # Generate preview report
    report = generate_preview_report(results)
    print(report)
    print("")
    
    # Save report to file
    report_path = script_dir / 'recategorization_report.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"📄 Report saved to: {report_path.name}")
    print("")
    
    # Ask for confirmation
    print("=" * 80)
    print("READY TO APPLY CHANGES?")
    print("=" * 80)
    print("This will:")
    print("  1. Create .json.bak backups of original files")
    print("  2. Update all JSON files with new categorizations")
    print("")
    response = input("Apply changes? [yes/NO]: ").strip().lower()
    
    if response == 'yes':
        print("")
        print("Applying changes...")
        apply_changes(results, preview_only=False)
        print("")
        print("✅ ALL CHANGES APPLIED!")
        print("📁 Original files backed up with .bak extension")
    else:
        print("")
        print("❌ Changes NOT applied (preview only)")

if __name__ == '__main__':
    main()

