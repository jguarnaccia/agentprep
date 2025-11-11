#!/bin/bash

# AgentPrep - Quick Test of Flashcard Generation System
# This runs a minimal test to verify everything works

echo "🧪 AgentPrep Flashcard System - Quick Test"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Navigate to project directory
cd /Users/jeremiahg/Desktop/agentprep

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in agentprep directory"
    exit 1
fi

echo "✅ In correct directory"
echo ""

# Step 1: Verify setup
echo "Step 1: Verifying setup..."
echo "───────────────────────────────────────────────────────────"
node scripts/verify-setup.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Setup verification failed!"
    echo ""
    echo "Please fix the issues above."
    echo "Most likely: You need to create the ai_flashcards table in Supabase."
    echo ""
    echo "Instructions:"
    echo "1. Open: https://supabase.com/dashboard/project/wxidxpqdbhlchqxlapdv/sql/new"
    echo "2. Copy contents from: scripts/create-ai-flashcards-table.sql"
    echo "3. Click 'Run'"
    echo "4. Run this script again"
    echo ""
    exit 1
fi

echo ""
echo "Step 2: Checking if test mode is enabled..."
echo "───────────────────────────────────────────────────────────"

# Check if TEST_MODE is true
if grep -q "TEST_MODE: true" scripts/generate-flashcards.js; then
    echo "✅ Test mode is enabled"
    echo ""
else
    echo "⚠️  Test mode is disabled"
    echo ""
    echo "Enabling test mode for safe testing..."
    
    # Enable test mode
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's/TEST_MODE: false/TEST_MODE: true/' scripts/generate-flashcards.js
    else
        # Linux
        sed -i 's/TEST_MODE: false/TEST_MODE: true/' scripts/generate-flashcards.js
    fi
    
    echo "✅ Test mode enabled"
    echo ""
fi

echo "Step 3: Generating test flashcards (5 sections only)..."
echo "───────────────────────────────────────────────────────────"
echo ""

node scripts/generate-flashcards.js

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Generation failed!"
    echo ""
    echo "Check the error messages above."
    echo ""
    exit 1
fi

echo ""
echo "Step 4: Checking results..."
echo "───────────────────────────────────────────────────────────"
echo ""

node scripts/check-flashcards.js

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Test Complete!"
echo ""
echo "Next steps:"
echo "  1. Review the flashcards in your Supabase database"
echo "  2. If they look good, disable test mode for full generation:"
echo "     - Open scripts/generate-flashcards.js"
echo "     - Change line 23: TEST_MODE: false"
echo "     - Run: node scripts/generate-flashcards.js"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
