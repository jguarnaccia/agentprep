# 🏀 CBA DATABASE PROJECT - EXECUTION GUIDE

## 📋 WHAT WE'RE DOING
Transform the Study Guide from AI-generated content to a comprehensive, structured database containing the full NBA Collective Bargaining Agreement.

## ✅ FILES CREATED
1. `scripts/create_cba_table.sql` - Database migration
2. `scripts/parse-cba.js` - Parses CBA .txt file into JSON
3. `scripts/import-cba-to-supabase.js` - Imports parsed data to Supabase

---

## 🚀 STEP-BY-STEP EXECUTION

### **STEP 1: Create the Database Table**

1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Select your AgentPrep project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `scripts/create_cba_table.sql`
6. Paste it into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. You should see: "CBA content table created successfully!"

---

### **STEP 2: Parse the CBA File**

Open your terminal and run:

```bash
cd /Users/jeremiahg/Desktop/agentprep
node scripts/parse-cba.js
```

**Expected Output:**
```
🏀 NBA CBA PARSER - Starting...

📄 File loaded: XX,XXX lines

✅ Found start of actual content at line XXX
📖 Parsing I: DEFINITIONS
📖 Parsing II: UNIFORM PLAYER CONTRACT
... (more articles) ...

✅ PARSING COMPLETE!

📊 Total entries parsed: XXX
📝 Output saved to: /Users/jeremiahg/Desktop/agentprep/scripts/cba-parsed.json

📈 Breakdown:
   Articles: XX
   Sections: XXX
   Exhibits: XX

🎯 Next step: Import this JSON into Supabase!
```

This creates `scripts/cba-parsed.json` with all the structured CBA data.

---

### **STEP 3: Import to Supabase**

After parsing is complete, run:

```bash
node scripts/import-cba-to-supabase.js
```

**Expected Output:**
```
🏀 NBA CBA IMPORTER - Starting...

📄 Loaded XXX CBA entries

🗑️  Clearing existing CBA content...
✅ Existing content cleared

🔄 Processing and categorizing content...
✅ Content processed and categorized

📤 Importing XXX entries in batches of 100...

   ✓ Imported 100/XXX entries
   ✓ Imported 200/XXX entries
   ... (continues) ...

✅ IMPORT COMPLETE!

📊 Successfully imported XXX CBA entries to Supabase

📈 Summary:
   Articles: XX
   Sections: XXX
   Exhibits: XX
   Auto-categorized: XXX entries

🎯 Next step: Build the new Study Guide UI!
```

---

## 🎯 NEXT STEPS AFTER IMPORT

Once the data is in Supabase, we'll build:

1. **Enhanced Study Guide UI**
   - Article browser with expandable tree structure
   - Full text display with professional formatting
   - Search across all CBA content
   - Bookmark/favorite sections

2. **"Explain This" AI Feature**
   - Button to get AI-generated simple explanations
   - Cache explanations in database for speed
   - Toggle between "Full Text" and "Simplified"

3. **Category Integration**
   - Link CBA sections to existing study categories
   - Practice questions for each section
   - Related flashcards

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot find module '@supabase/supabase-js'"
**Solution:** Run `npm install` in the agentprep directory

### Error: "Supabase credentials not found"
**Solution:** Make sure `.env.local` exists with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Error: "CBA file not found"
**Solution:** Make sure the CBA file is at:
`/Users/jeremiahg/Downloads/25da5eb0-15eb-11ee-b5b3-fbd321202bdf-Final-2023-NBA-Collective-Bargaining-Agreement-6-28-23.txt`

### Error: "Table already exists"
**Solution:** The SQL migration handles this - it will DROP the existing table first

---

## 📊 DATABASE STRUCTURE

The `cba_content` table stores:

- **id**: Unique UUID for each entry
- **type**: 'article', 'section', 'subsection', or 'exhibit'
- **article_number**: 'I', 'II', 'VII', etc.
- **article_title**: Full article title
- **section_number**: '1', '2', '3', etc.
- **title**: Section or subsection title
- **content**: Full CBA text
- **category**: Auto-linked to existing study categories
- **keywords**: Searchable keywords
- **order_index**: Maintains document order
- **parent_id**: For hierarchical relationships

---

## ✅ READY TO GO!

Run the steps above in order and you'll have the complete CBA in your database!

**Questions? Issues? Let me know and we'll fix them immediately!** 🔥
