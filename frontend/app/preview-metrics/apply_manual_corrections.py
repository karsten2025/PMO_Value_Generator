#!/usr/bin/env python3
"""
Apply Manual Metric Corrections
Based on 100% validated Logic Model categorizations

Author: AI Assistant + Manual Review
Date: 2026-01-15
"""

import json
from pathlib import Path
from typing import Dict

def load_corrections():
    """Load manual corrections JSON."""
    corrections_path = Path(__file__).parent / 'manual_corrections.json'
    with open(corrections_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def apply_corrections_to_file(filepath: Path, process_corrections: Dict):
    """Apply corrections to a single JSON file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    changes_made = []
    
    # Create new metrics structure
    new_metrics = {
        'input': [],
        'process': [],
        'output': [],
        'outcome': [],
        'feedback': []
    }
    
    # Process each metric
    for old_category, metrics_list in data['metrics'].items():
        for metric in metrics_list:
            metric_name = metric['name_en']
            
            # Check if this metric needs correction
            if metric_name in process_corrections:
                correction = process_corrections[metric_name]
                correct_category = correction['correct']
                
                if old_category != correct_category:
                    changes_made.append({
                        'name': metric_name,
                        'old': old_category,
                        'new': correct_category,
                        'reason': correction['reason']
                    })
                    
                    # Add to correct category
                    new_metrics[correct_category].append(metric)
                else:
                    # Already in correct category
                    new_metrics[old_category].append(metric)
            else:
                # No correction needed - keep in original category
                new_metrics[old_category].append(metric)
    
    return {
        'data': data,
        'new_metrics': new_metrics,
        'changes': changes_made
    }

def main():
    """Main execution."""
    print("=" * 80)
    print("APPLYING MANUAL CORRECTIONS")
    print("Based on 100% Logic Model Framework Validation")
    print("=" * 80)
    print()
    
    # Load corrections
    corrections_data = load_corrections()
    corrections = corrections_data['corrections']
    
    print(f"📋 Loaded {corrections_data['summary']['total_changes_proposed']} validated corrections")
    print(f"✅ Script accuracy: {corrections_data['summary']['accuracy']}")
    print()
    
    # Process mapping
    process_map = {
        'process_1': 'process_1_metrics_showcase.json',
        'process_2': 'process_2_metrics_showcase.json',
        'process_3': 'process_3_metrics_showcase.json',
        'process_4': 'process_4_metrics_showcase.json',
        'process_5': 'process_5_metrics_showcase.json',
        'process_6': 'process_6_metrics_showcase.json',
        'process_7': 'process_7_metrics_showcase.json',
        'process_8': 'process_8_metrics_showcase.json',
        'process_9': 'process_9_metrics_showcase.json',
        'process_10': 'process_10_metrics_showcase.json',
    }
    
    all_changes = []
    
    # Apply corrections to each file
    for process_key, filename in process_map.items():
        if process_key not in corrections:
            continue
        
        filepath = Path(__file__).parent / filename
        process_corrections = corrections[process_key]
        
        print(f"📄 Processing: {filename}")
        
        result = apply_corrections_to_file(filepath, process_corrections)
        
        if result['changes']:
            # Backup original
            backup_path = filepath.with_suffix('.json.bak2')
            with open(filepath, 'r', encoding='utf-8') as f:
                original = f.read()
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.write(original)
            
            # Write corrected version
            corrected_data = {
                'meta': result['data']['meta'],
                'metrics': result['new_metrics']
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(corrected_data, f, indent=2, ensure_ascii=False)
            
            print(f"  ✅ Applied {len(result['changes'])} corrections")
            for change in result['changes']:
                print(f"    • {change['name']}")
                print(f"      {change['old'].upper():10} → {change['new'].upper():10}")
            
            all_changes.extend(result['changes'])
        else:
            print(f"  ℹ️  No changes needed")
        
        print()
    
    # Summary
    print("=" * 80)
    print(f"✅ COMPLETE! Applied {len(all_changes)} corrections across all processes")
    print("=" * 80)
    print()
    print("📁 Backups saved with .bak2 extension")
    print()
    print("🧪 NEXT STEP: Test dashboard to validate scores!")

if __name__ == '__main__':
    main()


