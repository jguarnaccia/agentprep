'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Check, 
  PlayCircle,
  Loader2
} from 'lucide-react';

// We import the hooks. If you see red lines here, it means the 
// 'lib/hooks' folder or files don't exist yet.
import { useFlashcardSets, useFlashcards } from '@/lib/hooks/useFlashcards';
import { useAuth } from '@/lib/hooks/useAuth';

// --- DEFINITIONS (Fixes "any" errors) ---
interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  total_cards: number;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function FlashcardsSection() {
  const { user } = useAuth();
  
  // We allow the hook to return 'any' initially to prevent crashing, 
  // but we type the data below.
  const { sets, loading: setsLoading } = useFlashcardSets();
  
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  
  const { cards } = useFlashcards(selectedSetId);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardFlip = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (cards && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // --- LOADING STATE ---
  if (setsLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // --- STUDY MODE ---
  if (studyMode && selectedSetId && cards && cards.length > 0) {
    const currentCard = cards[currentCardIndex] as Flashcard;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={() => {
                setStudyMode(false);
                setSelectedSetId(null);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Sets</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Studying...</h1>
                <p className="text-sm text-slate-300 mt-1">
                  Card {currentCardIndex + 1} of {cards.length}
                </p>
              </div>
              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* The Card */}
          <motion.div 
            className="perspective-1000 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="relative w-full h-96 cursor-pointer"
              onClick={handleCardFlip}
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8 flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-6">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    {currentCard.front}
                  </h2>
                  <p className="text-sm text-slate-400">Click to reveal answer</p>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-red-600 rounded-2xl shadow-lg p-8 flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-6">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg text-white leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentCardIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleCardFlip}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all hover:shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              Flip
            </button>

            <button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:via-red-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (FIXED TYPES HERE) ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Flashcards</h1>
          <p className="text-slate-300">Master CBA concepts through spaced repetition</p>
        </div>

        {/* Check if sets exist */}
        {!sets || sets.length === 0 ? (
           <div className="text-center py-20 bg-slate-800 rounded-xl border border-dashed border-slate-600">
             <p className="text-slate-300">No flashcard sets found.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* HERE IS THE FIX: explicitly typing 'set' and 'index' */}
            {sets.map((set: FlashcardSet, index: number) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {set.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-300">{set.total_cards} cards</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 mb-4 line-clamp-2">
                    {set.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedSetId(set.id);
                        setStudyMode(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:via-red-700 hover:to-blue-800 transition-all hover:shadow-md"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Study
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}