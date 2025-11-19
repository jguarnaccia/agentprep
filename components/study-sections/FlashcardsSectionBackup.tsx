'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  Tag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  AlertCircle
} from 'lucide-react';

interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  totalCards: number;
  masteredCards: number;
  reviewCards: number;
  newCards: number;
  tags: string[];
  lastStudied?: string;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isDifficult: boolean;
}

const mockSets: FlashcardSet[] = [
  {
    id: '1',
    title: 'Article VII - Salary Cap',
    description: 'Core concepts of NBA salary cap mechanics and team spending limits',
    totalCards: 124,
    masteredCards: 87,
    reviewCards: 24,
    newCards: 13,
    tags: ['Salary Cap', 'Core Concepts'],
    lastStudied: '2 hours ago'
  },
  {
    id: '2',
    title: 'Luxury Tax Calculations',
    description: 'Understanding luxury tax thresholds, aprons, and penalty calculations',
    totalCards: 96,
    masteredCards: 45,
    reviewCards: 38,
    newCards: 13,
    tags: ['Luxury Tax', 'Calculations'],
    lastStudied: 'Yesterday'
  },
  {
    id: '3',
    title: 'Exceptions & Trade Rules',
    description: 'MLE, BAE, TPE and other salary cap exceptions',
    totalCards: 156,
    masteredCards: 23,
    reviewCards: 89,
    newCards: 44,
    tags: ['Exceptions', 'Trades'],
    lastStudied: '3 days ago'
  }
];

const mockCards: Flashcard[] = [
  {
    id: '1',
    front: 'What is the NBA Salary Cap?',
    back: 'The NBA Salary Cap is a limit on the total amount of money that NBA teams are allowed to spend on player salaries. It is calculated as a percentage of Basketball Related Income (BRI) and is designed to maintain competitive balance across the league.',
    difficulty: 'medium',
    isDifficult: false
  },
  {
    id: '2',
    front: 'What is a soft cap vs hard cap?',
    back: 'A soft cap allows teams to exceed the salary cap under certain circumstances using exceptions. A hard cap is an absolute ceiling that cannot be exceeded under any circumstances. The NBA uses a soft cap system.',
    difficulty: 'hard',
    isDifficult: true
  }
];

export function FlashcardsSection() {
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentCardIndex < mockCards.length - 1) {
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

  const handleMarkDifficult = () => {
    // Toggle difficult status
    console.log('Marked as difficult');
  };

  if (studyMode && selectedSet) {
    const currentCard = mockCards[currentCardIndex];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => {
                setStudyMode(false);
                setSelectedSet(null);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Sets</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Article VII - Salary Cap
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Card {currentCardIndex + 1} of {mockCards.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentCardIndex + 1) / mockCards.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Flashcard */}
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
              {/* Front of card */}
              <div
                className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden'
                }}
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-6">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    {currentCard.front}
                  </h2>
                  <p className="text-sm text-slate-500">Click to reveal answer</p>
                </div>
              </div>

              {/* Back of card */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-8 flex items-center justify-center"
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
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkDifficult}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all hover:shadow-md ${
                  currentCard.isDifficult
                    ? 'bg-amber-100 border border-amber-300 text-amber-700'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                {currentCard.isDifficult ? 'Marked Difficult' : 'Mark Difficult'}
              </button>

              <button
                onClick={handleCardFlip}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all hover:shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                Flip
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={currentCardIndex === mockCards.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-slate-200">
            <p className="text-xs text-slate-600 text-center">
              <span className="font-medium">Keyboard shortcuts:</span> Space to flip • ← → to navigate • D to mark difficult
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Flashcards</h1>
          <p className="text-slate-600">Master CBA concepts through spaced repetition</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Cards</span>
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">376</p>
            <p className="text-xs text-slate-500 mt-1">Across all sets</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Mastered</span>
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-900">155</p>
            <p className="text-xs text-green-700 mt-1">41% complete</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-amber-700">Review</span>
              <RotateCcw className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-amber-900">151</p>
            <p className="text-xs text-amber-700 mt-1">Due for review</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">New</span>
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-900">70</p>
            <p className="text-xs text-blue-700 mt-1">Not studied yet</p>
          </motion.div>
        </div>

        {/* Flashcard Sets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSets.map((set, index) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Progress Bar */}
              <div className="h-2 bg-slate-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(set.masteredCards / set.totalCards) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {set.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">{set.totalCards}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                  {set.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-lg font-bold text-green-900">{set.masteredCards}</p>
                    <p className="text-xs text-green-700">Mastered</p>
                  </div>
                  <div className="text-center p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-lg font-bold text-amber-900">{set.reviewCards}</p>
                    <p className="text-xs text-amber-700">Review</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-lg font-bold text-blue-900">{set.newCards}</p>
                    <p className="text-xs text-blue-700">New</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {set.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSet(set.id);
                      setStudyMode(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all hover:shadow-md"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Study
                  </button>
                  <button className="px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {set.lastStudied && (
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Last studied {set.lastStudied}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
