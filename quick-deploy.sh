#!/bin/bash

echo "🚀 AgentPrep Enhanced Flashcard Quick Deploy"
echo "═══════════════════════════════════════════════"
echo ""

# Create required scripts directory if it doesn't exist
mkdir -p scripts

# Create the SQL table script
cat > scripts/create-balanced-table.sql << 'EOF'
-- Create balanced_flashcards table for enhanced flashcard system
DROP TABLE IF EXISTS balanced_flashcards;

CREATE TABLE balanced_flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cba_section_id UUID,
  article_number TEXT NOT NULL,
  article_title TEXT NOT NULL,
  section_number TEXT,
  section_title TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  citation TEXT,
  topic TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'ai_generated'
);

-- Create indexes
CREATE INDEX idx_balanced_flashcards_article ON balanced_flashcards(article_number);
CREATE INDEX idx_balanced_flashcards_topic ON balanced_flashcards(topic);
CREATE INDEX idx_balanced_flashcards_difficulty ON balanced_flashcards(difficulty);
CREATE INDEX idx_balanced_flashcards_source ON balanced_flashcards(source);

-- Enable RLS
ALTER TABLE balanced_flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to balanced_flashcards" ON balanced_flashcards FOR SELECT USING (true);
CREATE POLICY "Allow insert access to balanced_flashcards" ON balanced_flashcards FOR INSERT WITH CHECK (true);

SELECT 'balanced_flashcards table created successfully' AS status;
EOF

echo "✅ Created scripts/create-balanced-table.sql"

# Create the import script
cat > scripts/import-balanced-data.js << 'EOF'
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function importData() {
  try {
    console.log('📂 Loading perfect-1000-flashcards.json...');
    
    if (!fs.existsSync('perfect-1000-flashcards.json')) {
      console.error('❌ perfect-1000-flashcards.json not found!');
      process.exit(1);
    }
    
    const rawData = fs.readFileSync('perfect-1000-flashcards.json', 'utf8');
    const { cards } = JSON.parse(rawData);
    
    console.log(`📊 Loaded ${cards.length} cards`);
    
    // Prepare cards for import
    const cardsForImport = cards.map(card => ({
      ...card,
      source: 'ai_generated',
      created_at: card.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Import in batches
    const batchSize = 500;
    const totalBatches = Math.ceil(cardsForImport.length / batchSize);
    let successCount = 0;

    for (let i = 0; i < totalBatches; i++) {
      const start = i * batchSize;
      const end = Math.min(start + batchSize, cardsForImport.length);
      const batch = cardsForImport.slice(start, end);

      console.log(`📤 Batch ${i + 1}/${totalBatches}: Importing ${batch.length} cards...`);

      const { data, error } = await supabase
        .from('balanced_flashcards')
        .upsert(batch, { onConflict: 'id' })
        .select('id');

      if (error) {
        console.error(`❌ Batch ${i + 1} failed:`, error.message);
      } else {
        console.log(`✅ Batch ${i + 1} success: ${data?.length || batch.length} cards imported`);
        successCount += data?.length || batch.length;
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🎉 Import complete! ${successCount} cards imported`);
    
    // Verify final count
    const { count } = await supabase
      .from('balanced_flashcards')
      .select('id', { count: 'exact', head: true });
    
    console.log(`📊 Total cards in database: ${count}`);
    
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    process.exit(1);
  }
}

importData();
EOF

echo "✅ Created scripts/import-balanced-data.js"

# Create enhanced flashcard page
echo "🎨 Creating enhanced flashcard page..."

# Backup existing page if it exists
if [ -f "app/flashcards/page.tsx" ]; then
    cp app/flashcards/page.tsx app/flashcards/page-backup-$(date +%Y%m%d_%H%M%S).tsx
    echo "💾 Backed up existing page"
fi

# Create enhanced page (abbreviated version for deployment)
cat > app/flashcards/page.tsx << 'EOF'
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, XCircle, Sparkles, GraduationCap } from 'lucide-react';

interface BaseFlashcard {
  id: string;
  question: string;
  answer: string;
  source: 'ai_generated' | 'bobby_marks';
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

interface AIFlashcard extends BaseFlashcard {
  source: 'ai_generated';
  article_number: string;
  article_title: string;
  section_number?: string;
  section_title?: string;
  citation: string;
  topic: string;
}

interface BobbyMarksCard extends BaseFlashcard {
  source: 'bobby_marks';
  source_document: string;
  page_number?: number;
  topic: string;
}

type UnifiedFlashcard = AIFlashcard | BobbyMarksCard;

export default function EnhancedFlashcardsPage() {
  const [flashcards, setFlashcards] = useState<UnifiedFlashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAllFlashcards();
  }, []);

  const loadAllFlashcards = async () => {
    try {
      setLoading(true);
      
      const [balancedResult, aiResult, bobbyResult] = await Promise.all([
        supabase.from('balanced_flashcards').select('*').order('article_number'),
        supabase.from('ai_flashcards').select('*').order('article_number'),
        supabase.from('questions').select('*').order('id')
      ]);

      const aiCards: AIFlashcard[] = [];
      
      if (balancedResult.data && balancedResult.data.length > 0) {
        console.log(`📚 Loaded ${balancedResult.data.length} balanced AI flashcards`);
        aiCards.push(...balancedResult.data.map(card => ({ ...card, source: 'ai_generated' as const })));
      } else if (aiResult.data && aiResult.data.length > 0) {
        console.log(`📚 Loaded ${aiResult.data.length} original AI flashcards`);
        aiCards.push(...aiResult.data.map(card => ({ ...card, source: 'ai_generated' as const })));
      }

      const bobbyCards: BobbyMarksCard[] = [];
      if (bobbyResult.data && bobbyResult.data.length > 0) {
        console.log(`📚 Loaded ${bobbyResult.data.length} Bobby Marks questions`);
        bobbyCards.push(...bobbyResult.data.map(q => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          source: 'bobby_marks' as const,
          source_document: q.source_document || 'Bobby Marks Study Guide',
          page_number: q.page_number || 0,
          topic: q.topic || 'general',
          difficulty: q.difficulty || 'medium',
          created_at: q.created_at || new Date().toISOString()
        })));
      }

      const allCards: UnifiedFlashcard[] = [...aiCards, ...bobbyCards];
      console.log(`🎯 Total loaded: ${allCards.length} flashcards`);
      
      setFlashcards(allCards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = useCallback(() => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, flashcards.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const markAsKnown = () => {
    if (flashcards[currentIndex]) {
      const cardId = flashcards[currentIndex].id;
      setKnownCards(prev => new Set([...prev, cardId]));
      setUnknownCards(prev => { const newSet = new Set(prev); newSet.delete(cardId); return newSet; });
      goToNext();
    }
  };

  const markAsUnknown = () => {
    if (flashcards[currentIndex]) {
      const cardId = flashcards[currentIndex].id;
      setUnknownCards(prev => new Set([...prev, cardId]));
      setKnownCards(prev => { const newSet = new Set(prev); newSet.delete(cardId); return newSet; });
      goToNext();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceInfo = (card: UnifiedFlashcard) => {
    if (card.source === 'ai_generated') {
      const aiCard = card as AIFlashcard;
      return {
        icon: Sparkles,
        label: 'AI Generated',
        detail: `Article ${aiCard.article_number}`,
        color: 'text-blue-400'
      };
    } else {
      return {
        icon: GraduationCap,
        label: 'Bobby Marks',
        detail: `Expert Questions`,
        color: 'text-green-400'
      };
    }
  };

  const currentCard = flashcards[currentIndex];
  const sourceInfo = currentCard ? getSourceInfo(currentCard) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading enhanced flashcards...</p>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">No flashcards found</h2>
          <p>Please import the balanced dataset first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">Enhanced Flashcards</h1>
          </div>
          <p className="text-xl text-blue-200 mb-2">
            Study {flashcards.length.toLocaleString()} flashcards from multiple sources
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-blue-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{flashcards.filter(c => c.source === 'ai_generated').length} AI Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-green-400" />
              <span>{flashcards.filter(c => c.source === 'bobby_marks').length} Bobby Marks</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 text-center text-white">
          <p className="text-lg">Card {currentIndex + 1} of {flashcards.length}</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-2xl h-96">
            <div
              className={`absolute inset-0 w-full h-full transition-transform duration-500 cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div 
                className={`absolute inset-0 w-full h-full ${
                  currentCard?.source === 'ai_generated' 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-br from-green-600 to-blue-600'
                } rounded-2xl p-8 flex flex-col justify-center`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(currentCard?.difficulty || 'medium')}`}>
                      {currentCard?.difficulty?.toUpperCase()}
                    </div>
                    {sourceInfo && (
                      <div className={`flex items-center gap-1 text-xs ${sourceInfo.color}`}>
                        <sourceInfo.icon className="w-3 h-3" />
                        <span>{sourceInfo.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right text-xs text-white/80">
                    {sourceInfo?.detail}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white text-center leading-relaxed">
                    {currentCard?.question}
                  </h2>
                </div>
                
                <div className="text-center text-white/80 text-sm mt-4">
                  Click to reveal answer • Space bar
                </div>
              </div>

              {/* Back */}
              <div 
                className={`absolute inset-0 w-full h-full ${
                  currentCard?.source === 'ai_generated' 
                    ? 'bg-gradient-to-br from-green-600 to-blue-600' 
                    : 'bg-gradient-to-br from-emerald-600 to-teal-600'
                } rounded-2xl p-8 flex flex-col justify-center`}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/90">{currentCard?.topic}</div>
                  <div className="text-sm text-white/90">
                    {currentCard?.source === 'ai_generated' 
                      ? (currentCard as AIFlashcard).citation 
                      : (currentCard as BobbyMarksCard).source_document
                    }
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-lg leading-relaxed mb-4">{currentCard?.answer}</p>
                    {currentCard?.source === 'ai_generated' && (
                      <p className="text-sm text-white/80 italic">{(currentCard as AIFlashcard).article_title}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            <button
              onClick={markAsKnown}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Know It
            </button>
            
            <button
              onClick={markAsUnknown}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <XCircle className="w-5 h-5" />
              Review
            </button>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center text-sm text-blue-300">
          <p>Known: {knownCards.size} • Review: {unknownCards.size}</p>
        </div>
      </div>

      <style jsx>{`
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
}
EOF

echo "✅ Created enhanced flashcard page"

echo ""
echo "🎉 SETUP COMPLETE!"
echo "═══════════════════════════════════════════════"
echo ""
echo "📋 Next steps to complete the deployment:"
echo ""
echo "1️⃣ Create the database table:"
echo "   • Go to your Supabase dashboard"
echo "   • Open SQL Editor"
echo "   • Copy and paste contents of: scripts/create-balanced-table.sql"
echo "   • Click 'Run'"
echo ""
echo "2️⃣ Import the balanced dataset:"
echo "   node scripts/import-balanced-data.js"
echo ""
echo "3️⃣ Start your development server:"
echo "   npm run dev"
echo ""
echo "4️⃣ Navigate to:"
echo "   http://localhost:3000/flashcards"
echo ""
echo "✨ You now have an enhanced flashcard system with:"
echo "   • Dual-source support (AI + Bobby Marks)"
echo "   • Professional 3D animations"
echo "   • Visual source indicators"
echo "   • Enhanced user experience"
echo ""
echo "🚀 Ready to test your enhanced flashcard system!"
EOF

echo "✅ Created quick-deploy.sh"
chmod +x quick-deploy.sh

echo ""
echo "🚀 Quick Deploy Script Created!"
echo "═══════════════════════════════════════════════"
echo ""
echo "Run this to set up everything:"
echo "   bash quick-deploy.sh"
echo ""
