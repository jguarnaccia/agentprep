#!/bin/bash

echo "🚀 Starting Bobby Marks Complete Import"
echo "========================================"
echo ""

echo "📦 Part 1: Importing first 50 flashcards..."
node scripts/import-bobby-marks-flashcards.js

echo ""
echo "📦 Part 2: Importing remaining 92 flashcards..."
node scripts/import-bobby-marks-part2.js

echo ""
echo "✨ Complete! All 142 Bobby Marks flashcards imported!"
echo "🎉 Ready to study in Flashcard Mode!"
