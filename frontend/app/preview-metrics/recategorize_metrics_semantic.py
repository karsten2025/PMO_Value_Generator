#!/usr/bin/env python3
"""
Semantic Metric Re-Categorization Script
Based on PMO Guide Context + Logic Model Framework

Uses:
1. Process Description (from meta.process.description_en)
2. Metric Description (description.en.management + colloquial)
3. Semantic Pattern Recognition (not just keywords!)

Author: AI Assistant
Date: 2026-01-15
"""

import json
from pathlib import Path
from typing import Dict, List

# ===========================
# SEMANTIC CATEGORIZATION
# ===========================

def analyze_semantic_context(text: str) -> Dict[str, float]:
    """
    Analyze text for semantic indicators of each category.
    Returns confidence scores (0.0-1.0) for each category.
    """
    text_lower = text.lower()
    
    scores = {
        'input': 0.0,
        'process': 0.0,
        'output': 0.0,
        'outcome': 0.0,
        'feedback': 0.0
    }
    
    # INPUT: Resources, preparation, allocation
    input_patterns = [
        ('budget', 0.9), ('hours allocated', 0.9), ('resources', 0.8),
        ('staff allocated', 0.9), ('capacity', 0.7), ('material prepared', 0.9),
        ('tools available', 0.8), ('prepared', 0.6), ('planned', 0.5),
        ('sources used', 0.7), ('templates used', 0.7)
    ]
    for pattern, weight in input_patterns:
        if pattern in text_lower:
            scores['input'] += weight
    
    # PROCESS: Activities, conducting, holding
    process_patterns = [
        ('conducted', 0.8), ('held', 0.8), ('performed', 0.8),
        ('delivered', 0.7), ('workshops', 0.6), ('sessions', 0.5),
        ('meetings', 0.6), ('reviews', 0.6), ('processed', 0.7),
        ('handled', 0.6), ('executed', 0.7), ('organized', 0.7),
        ('implemented', 0.6), ('activities', 0.7)
    ]
    for pattern, weight in process_patterns:
        if pattern in text_lower:
            scores['process'] += weight
    
    # OUTPUT: Deliverables, created, completed, produced
    output_patterns = [
        ('created', 0.8), ('completed', 0.9), ('generated', 0.8),
        ('produced', 0.8), ('catalog', 0.7), ('document', 0.6),
        ('report', 0.7), ('definitions', 0.6), ('established', 0.7),
        ('active', 0.5), ('dashboards', 0.6)
    ]
    for pattern, weight in output_patterns:
        if pattern in text_lower:
            scores['output'] += weight
    
    # OUTCOME: Business value, engagement, adoption, impact
    outcome_patterns = [
        ('engagement', 0.9), ('adoption', 0.9), ('satisfaction', 0.8),
        ('buy-in', 0.9), ('awareness level', 0.9), ('understanding', 0.8),
        ('improvement', 0.7), ('acceptance', 0.8), ('recognition', 0.8),
        ('legitimacy', 0.9), ('sponsorship', 0.8), ('value', 0.7),
        ('impact', 0.8), ('support', 0.7), ('alignment', 0.8),
        ('knowledge improvement', 0.9), ('coverage rate', 0.7),
        ('compliance rate', 0.8), ('quality improvement', 0.8),
        ('benefits', 0.8), ('roi percentage', 0.9), ('goals achieved', 0.9),
        ('embeddedness', 0.8), ('competence level', 0.7)
    ]
    for pattern, weight in outcome_patterns:
        if pattern in text_lower:
            scores['outcome'] += weight
    
    # FEEDBACK: Scores, ratings, satisfaction scores, NPS
    feedback_patterns = [
        ('satisfaction score', 1.0), ('nps', 1.0), ('rating', 0.9),
        ('feedback', 0.9), ('score', 0.7), ('credibility', 0.7),
        ('clarity', 0.6), ('quality rating', 0.9), ('willingness', 0.7),
        ('effectiveness score', 0.9), ('criticism', 0.8)
    ]
    for pattern, weight in feedback_patterns:
        if pattern in text_lower:
            scores['feedback'] += weight
    
    return scores

def categorize_metric_semantic(
    name_en: str,
    description: Dict,
    process_description: str
) -> str:
    """
    Categorize metric using semantic analysis of context.
    
    Priority:
    1. Analyze metric description (management + colloquial)
    2. Analyze metric name
    3. Consider process context
    4. Return category with highest confidence
    """
    
    # Combine all relevant text
    text_parts = [name_en]
    
    # Add metric descriptions (weighted higher!)
    if 'en' in description:
        if 'management' in description['en']:
            # Add twice for double weight
            mgmt_desc = description['en']['management']
            text_parts.append(mgmt_desc)
            text_parts.append(mgmt_desc)
        if 'colloquial' in description['en']:
            text_parts.append(description['en']['colloquial'])
    
    # Add process context (normal weight - semantic analysis will consider it)
    text_parts.append(process_description)
    
    combined_text = ' '.join(text_parts)
    
    # Get semantic scores
    scores = analyze_semantic_context(combined_text)
    
    # Special rules for ambiguous cases
    name_lower = name_en.lower()
    
    # RULE 1: "Stakeholder Engagement" + "Sessions" = OUTCOME
    if 'engagement' in name_lower and 'stakeholder' in name_lower:
        scores['outcome'] += 2.0  # Strong boost
    
    # RULE 2: "Workshops Conducted" / "Sessions Held" = PROCESS
    if ('workshops' in name_lower or 'sessions' in name_lower) and \
       ('conducted' in name_lower or 'held' in name_lower):
        scores['process'] += 1.5
    
    # RULE 3: "People Trained" / "Users Trained" = OUTPUT
    if 'trained' in name_lower and ('people' in name_lower or 'users' in name_lower):
        scores['output'] += 1.5
    
    # RULE 4: "Score" / "Rating" in name = FEEDBACK (unless outcome indicator)
    if 'score' in name_lower or 'rating' in name_lower:
        if any(kw in name_lower for kw in ['satisfaction', 'quality', 'effectiveness', 'clarity']):
            scores['feedback'] += 2.0
    
    # RULE 5: "Rate" (Adoption Rate, Coverage Rate) = OUTCOME
    if 'rate' in name_lower and not 'response rate' in name_lower:
        if any(kw in name_lower for kw in ['adoption', 'coverage', 'compliance', 'approval']):
            scores['outcome'] += 1.5
    
    # RULE 6: "Hours" / "Budget" / "Staff" + "Allocated/Planned" = INPUT
    if any(kw in name_lower for kw in ['hours', 'budget', 'staff', 'capacity']):
        if any(kw in name_lower for kw in ['allocated', 'planned', 'available']):
            scores['input'] += 1.5
    
    # Return category with highest score
    max_category = max(scores, key=scores.get)
    max_score = scores[max_category]
    
    # If no clear winner (score < 0.5), default to INPUT
    if max_score < 0.5:
        return 'input'
    
    return max_category

def analyze_json_file_semantic(filepath: Path) -> Dict:
    """Load and analyze a single JSON file using semantic analysis."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Get process description (with fallback)
    process_meta = data['meta']['process']
    process_description = process_meta.get('description_en', '') or process_meta.get('title_en', '')
    
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
            description = metric.get('description', {})
            
            # Determine new category using semantic analysis
            new_category = categorize_metric_semantic(
                name_en,
                description,
                process_description
            )
            
            # Track change
            if old_category != new_category:
                changes.append({
                    'name': name_en,
                    'old': old_category,
                    'new': new_category,
                    'reason': 'semantic_analysis'
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
    report.append("SEMANTIC METRIC RE-CATEGORIZATION PREVIEW REPORT")
    report.append("Based on PMO Guide Context + Logic Model Framework")
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
            report.append(f"  ✓ {change['name']}")
            report.append(f"    {old_cat:10} → {new_cat:10}")
        
        report.append("")
    
    report.append("=" * 80)
    report.append(f"TOTAL CHANGES: {total_changes}")
    report.append("=" * 80)
    
    return "\n".join(report)

def apply_changes(results: List[Dict], backup: bool = True):
    """Apply changes to JSON files."""
    for result in results:
        if not result['changes']:
            continue
        
        filepath = result['filepath']
        
        # Backup original
        if backup:
            backup_path = filepath.with_suffix('.json.bak')
            with open(filepath, 'r', encoding='utf-8') as f:
                original = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original)
        
        # Reconstruct JSON
        new_data = {
            'meta': result['meta'],
            'metrics': result['new_metrics']
        }
        
        # Write new version
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(new_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Updated: {filepath.name}")

def main():
    """Main execution."""
    script_dir = Path(__file__).parent
    json_files = sorted(script_dir.glob('process_*_metrics_showcase.json'))
    
    if not json_files:
        print("ERROR: No JSON files found!")
        return
    
    print("=" * 80)
    print("SEMANTIC METRIC RE-CATEGORIZATION")
    print("=" * 80)
    print(f"Found {len(json_files)} JSON files to analyze...")
    print("")
    
    # Analyze all files
    results = []
    for filepath in json_files:
        print(f"📄 Analyzing: {filepath.name}")
        result = analyze_json_file_semantic(filepath)
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
    report_path = script_dir / 'recategorization_report_semantic.txt'
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"📄 Report saved to: {report_path.name}")
    print("")
    
    # Apply changes automatically (non-interactive)
    print("=" * 80)
    print("APPLYING CHANGES...")
    print("=" * 80)
    print("")
    apply_changes(results, backup=True)
    print("")
    print("✅ ALL CHANGES APPLIED!")
    print("📁 Original files backed up with .bak extension")
    print("")
    print("🧪 TEST: Reload dashboard to see corrected scores!")

if __name__ == '__main__':
    main()

