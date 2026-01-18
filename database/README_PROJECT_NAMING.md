# Project Naming Convention

## 🎯 Strategy

**Only ONE DUMMY project** for demonstration purposes:
- ✅ **Cloud Migration Program [DUMMY]** → Full demo data (PMP, KPIs, Milestones, Risks, Changes)

**All other projects** are for real usage:
- ❌ **No [DUMMY] suffix**
- ❌ **No demo data in sidebar** → Empty State + "Add KPIs" Button

---

## 📊 Current Projects

### Demo Project (with sample data):
```
Cloud Migration Program [DUMMY]
```
- **Sidebar**: 9 Demo Project-KPIs (SPI, CPI, Quality, etc.)
- **PMP Page**: Full W-Fragen, Milestones, Risks, Change Management
- **Purpose**: Show potential users what the tool can do

### Real Projects (empty, for user input):
```
E-Commerce Platform Overhaul
Data Analytics Initiative  
Customer Portal Redesign
Mobile App Development
Infrastructure Upgrade
```
- **Sidebar**: Empty State → "Add KPIs" Button → KPI Editor (Coming Soon)
- **PMP Page**: Empty States → Manual data entry
- **Purpose**: Real project tracking for actual PMO work

---

## 🔧 How to Apply

### Option A: SQL Migration (Recommended)
```bash
cd database
psql <your_supabase_connection_string> -f migration_rename_projects.sql
```

### Option B: Supabase Dashboard
1. Go to Supabase → SQL Editor
2. Paste `migration_rename_projects.sql` content
3. Run

### Option C: Manual (not recommended)
Edit each project name in Supabase Table Editor

---

## 🎨 Visual Indicators

### In UI:
- **[DUMMY]** tag visible only for Cloud Migration
- **No tag** for all other projects

### In Code:
```typescript
// ProjectDetailSidebar.tsx
const isDummyProject = project.name?.includes('Cloud Migration') || 
                       project.name?.includes('DUMMY');

if (isDummyProject) {
  loadDemoKPIs(); // Show 9 sample KPIs
} else {
  loadProjectKPIs(); // Empty State + "Add KPIs" Button
}
```

---

## ✅ Benefits

1. **Clear Onboarding**: New users see ONE example project with full data
2. **Real Usage**: All other projects are empty canvases for actual work
3. **No Confusion**: [DUMMY] tag clearly marks demo project
4. **Scalable**: Easy to add more real projects without cluttering UI

---

## 🚀 Next Steps

After running the migration:
1. ✅ Refresh frontend (`http://localhost:3000/`)
2. ✅ Click Cloud Migration [DUMMY] → Sidebar shows 9 KPIs
3. ✅ Click any other project → Empty State + "Add KPIs" Button
4. ✅ Click [📋 Plan] on Cloud Migration → Full PMP demo data
5. ✅ Click [📋 Plan] on other project → Empty PMP (manual entry)

---

Last updated: 2026-01-17
