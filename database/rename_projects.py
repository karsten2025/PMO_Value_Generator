#!/usr/bin/env python3
"""
Rename Projects Script
======================
Removes [DUMMY] tag from all projects EXCEPT Cloud Migration Program

Usage:
    python rename_projects.py
"""

import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    # Initialize Supabase client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ ERROR: SUPABASE_URL and SUPABASE_KEY not found in .env file!")
        print("Please create .env file with your Supabase credentials.")
        sys.exit(1)
    
    supabase: Client = create_client(url, key)
    
    print("🚀 Starting Project Rename Migration...")
    print("=" * 60)
    
    # Step 1: Get all projects
    print("\n📊 Current Projects:")
    response = supabase.table('pmo_projects').select('id, name').order('name').execute()
    projects = response.data
    
    for project in projects:
        print(f"   • {project['name']}")
    
    print(f"\n   Total: {len(projects)} projects")
    
    # Step 2: Remove [DUMMY] from all except Cloud Migration
    print("\n🔄 Removing [DUMMY] tags...")
    
    updated_count = 0
    for project in projects:
        if '[DUMMY]' in project['name'] and 'Cloud Migration' not in project['name']:
            new_name = project['name'].replace(' [DUMMY]', '')
            
            supabase.table('pmo_projects').update({
                'name': new_name
            }).eq('id', project['id']).execute()
            
            print(f"   ✅ {project['name']} → {new_name}")
            updated_count += 1
    
    # Step 3: Ensure Cloud Migration keeps [DUMMY]
    print("\n✨ Ensuring Cloud Migration keeps [DUMMY] tag...")
    
    for project in projects:
        if 'Cloud Migration' in project['name']:
            if '[DUMMY]' not in project['name']:
                new_name = project['name'] + ' [DUMMY]'
            else:
                new_name = 'Cloud Migration Program [DUMMY]'
            
            supabase.table('pmo_projects').update({
                'name': new_name
            }).eq('id', project['id']).execute()
            
            print(f"   ✅ {project['name']} → {new_name}")
    
    # Step 4: Verify changes
    print("\n" + "=" * 60)
    print("📊 Updated Projects:")
    response = supabase.table('pmo_projects').select('id, name, strategic_alignment').order('strategic_alignment', desc=True).execute()
    projects = response.data
    
    dummy_count = 0
    for project in projects:
        icon = "🎯" if "[DUMMY]" in project['name'] else "📋"
        alignment = project.get('strategic_alignment', 'unknown')
        print(f"   {icon} {project['name']} ({alignment})")
        if "[DUMMY]" in project['name']:
            dummy_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Migration Complete!")
    print(f"   • Updated: {updated_count} projects")
    print(f"   • DUMMY projects: {dummy_count} (should be 1)")
    print(f"   • Total projects: {len(projects)}")
    
    if dummy_count == 1:
        print("\n🎉 Perfect! Only Cloud Migration has [DUMMY] tag!")
        print("   → Refresh your browser: http://localhost:3000/")
    else:
        print(f"\n⚠️  Warning: Expected 1 DUMMY project, found {dummy_count}")
    
    print("=" * 60)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
