'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Check,
  Tag,
  BarChart3,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface FlashcardSet {
  id: string;
  title: string;
  category: string;
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  lastStudied?: string;
}

const mockSets: FlashcardSet[] = [
  {
    id: '1',
    title: 'Salary Cap Fundamentals',
    category: 'Article VII',
    totalCards: 45,
    studiedCards: 32,
    masteredCards: 18,
    tags: ['Salary Cap', 'Basics'],
    difficulty: 'Easy',
    lastStudied: '2 hours ago'
  },
  {
    id: '2',
    title: 'Luxury Tax Calculations',
    category: 'Article VII',
    totalCards: 38,
    studiedCards: 15,
    masteredCards: 8,
    tags: ['Luxury Tax', 'Math'],
    difficulty: 'Hard',
    lastStudied: 'Yesterday'
  },
  {
    id: '3',
    title: 'Free Agency Rules',
    category: 'Article XI',
    totalCards: 52,
    studiedCards: 52,
    masteredCards: 45,
    tags: ['Free Agency', 'Rights'],
    difficulty: 'Medium',
    lastStudied: '3 days ago'
  },
];

export function FlashcardsSection() {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const getProgressColor = (set: FlashcardSet) => {
    const percentage = (set.studiedCards / set.totalCards) * 100;
    if (percentage >= 75) return 'from-emerald-500 to-emerald-700';
    if (percentage >= 50) return 'from-blue-600 to-blue-800';
    if (percentage >= 25) return 'from-amber-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Hard': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isStudying && selectedSet) {
    return (
      <div className="max-w-5xl mx-auto p-8">
        <button
          onClick={() => setIsStudying(false)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Sets
        </button>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{selectedSet.title}</h2>
          <div className="text-3xl font-bold text-gray-900 mt-4">
            {currentCardIndex + 1} / {selectedSet.totalCards}
          </div>
        </div>

        <motion.div
          className="relative h-96 mb-8 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="absolute inset-0 bg-white rounded-2xl shadow-xl border border-gray-200 p-8 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-gray-900 leading-relaxed text-center">
              {isFlipped ? 'Answer: $136,021,000' : 'What is the maximum salary cap in the 2023-24 NBA season?'}
            </p>
          </div>
        </motion.div>

        <div className="flex items-center justify-between gap-4">
          <motion.button
            onClick={() => setCurrentCardIndex(Math.max(0, currentCardIndex - 1))}
            disabled={currentCardIndex === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </motion.button>

          <motion.button
            onClick={() => setCurrentCardIndex(Math.min(selectedSet.totalCards - 1, currentCardIndex + 1))}
            disabled={currentCardIndex === selectedSet.totalCards - 1}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white font-medium hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100" whileHover={{ scale: 1.02 }}>
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">247</div>
          <div className="text-sm text-gray-600">Cards Studied</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSets.map((set, index) => {
          const progress = (set.studiedCards / set.totalCards) * 100;
          
          return (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className={`h-1 bg-gradient-to-r ${getProgressColor(set)}`} />
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{set.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{set.category}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{set.totalCards}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-700">{set.studiedCards}</div>
                    <div className="text-xs text-blue-600">Studied</div>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <div className="text-xl font-bold text-emerald-700">{set.masteredCards}</div>
                    <div className="text-xs text-emerald-600">Mastered</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getProgressColor(set)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    setSelectedSet(set);
                    setIsStudying(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  {set.studiedCards === 0 ? 'Start Studying' : 'Resume'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
