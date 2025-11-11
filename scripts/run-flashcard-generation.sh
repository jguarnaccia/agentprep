#!/bin/bash

# AgentPrep Flashcard Generation - Complete Setup & Generation
# This script walks through the entire process step by step

echo "🚀 AgentPrep AI Flashcard Generator"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Verify setup
echo -e "${BLUE}Step 1: Verifying setup...${NC}"
echo ""
node scripts/verify-setup.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Setup verification failed!${NC}"
    echo ""
    echo "Please fix the issues above before continuing."
    echo ""
    echo "Common fixes:"
    echo "  1. Create ai_flashcards table in Supabase SQL Editor"
    echo "  2. Check .env.local has OPENAI_API_KEY"
    echo "  3. Ensure CBA content is loaded in database"
    echo ""
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 2: Ask about test mode
echo -e "${YELLOW}Step 2: Choose generation mode${NC}"
echo ""
echo "Options:"
echo "  1) Test Mode - Generate flashcards for 5 sections only (~2 min)"
echo "  2) Full Mode - Generate flashcards for ALL sections (~30-45 min)"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo -e "${BLUE}🧪 Running in TEST MODE${NC}"
    echo "This will generate flashcards for only 5 sections to verify everything works."
    echo ""
    
    # Update script to enable test mode
    sed -i '' 's/TEST_MODE: false/TEST_MODE: true/' scripts/generate-flashcards.js
    
    echo -e "${GREEN}✅ Test mode enabled${NC}"
    echo ""
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo -e "${BLUE}🚀 Running in FULL MODE${NC}"
    echo "This will generate flashcards for ALL 283 sections."
    echo "⏱️  Estimated time: 30-45 minutes"
    echo ""
    
    # Update script to disable test mode
    sed -i '' 's/TEST_MODE: true/TEST_MODE: false/' scripts/generate-flashcards.js
    
    echo -e "${GREEN}✅ Full mode enabled${NC}"
    echo ""
    
    read -p "Press Enter to start generation..."
    echo ""
else
    echo ""
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi

# Step 3: Generate flashcards
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}Step 3: Generating flashcards...${NC}"
echo ""

node scripts/generate-flashcards.js

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Generation failed!${NC}"
    echo ""
    echo "Check the error messages above."
    echo "You can re-run this script - it will skip sections that already have flashcards."
    echo ""
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 4: Check results
echo -e "${BLUE}Step 4: Analyzing results...${NC}"
echo ""

node scripts/check-flashcards.js

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ Flashcard generation complete!${NC}"
echo ""

if [ "$choice" = "1" ]; then
    echo "🧪 Test mode completed successfully!"
    echo ""
    echo "Next steps:"
    echo "  1. Review the flashcards in your database"
    echo "  2. If they look good, run in Full Mode:"
    echo "     ./scripts/run-flashcard-generation.sh"
    echo ""
else
    echo "🎉 Full generation complete!"
    echo ""
    echo "Your flashcards are ready to use in the app!"
    echo ""
    echo "Next steps:"
    echo "  1. Integrate flashcards into the UI"
    echo "  2. Add filtering by article/topic/difficulty"
    echo "  3. Add study progress tracking"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo ""
