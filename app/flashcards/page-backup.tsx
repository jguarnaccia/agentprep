'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Filter, Shuffle, RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

// Types
interface Flashcard {
  id: string;
  article_number: string;
  article_title: string;
  section_number: string;
  section_title: string;
  question: string;
  answer: string;
  citation: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

// Available topics
const TOPICS = {
  'salary-cap': 'Salary Cap System',
  'luxury-tax': 'Luxury Tax',
  'aprons': 'Apron Restrictions', 
  'exceptions': 'Salary Cap Exceptions',
  'free-agency': 'Free Agency Rules',
  'trades': 'Trade Rules',
  'rookie-scale': 'Rookie Contracts',
  'max-salary': 'Maximum Salaries',
  'min-salary': 'Minimum Salaries',
  'extensions': 'Contract Extensions',
  'two-way': 'Two-Way Contracts',
  'draft': 'NBA Draft',
  'health': 'Player Health & Safety',
  'conduct': 'Player Conduct',
  'g-league': 'G League',
  'arbitration': 'Dispute Resolution',
  'benefits': 'Player Benefits'
};

export default function FlashcardsPage() {
  // State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  
  // Filter states
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Study session state
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());

  // Load flashcards from database
  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_flashcards')
        .select('*')
        .order('article_number', { ascending: true });

      if (error) throw error;
      
      setFlashcards(data || []);
      setFilteredCards(data || []);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...flashcards];

    // Article filter
    if (selectedArticles.length > 0) {
      filtered = filtered.filter(card => selectedArticles.includes(card.article_number));
    }

    // Topic filter  
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(card => selectedTopics.includes(card.topic));
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(card => selectedDifficulties.includes(card.difficulty));
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query) ||
        card.article_title.toLowerCase().includes(query) ||
        card.section_title.toLowerCase().includes(query)
      );
    }

    setFilteredCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards, selectedArticles, selectedTopics, selectedDifficulties, searchQuery]);

  // Get unique values for filters
  const uniqueArticles = Array.from(new Set(flashcards.map(card => card.article_number)))
    .sort((a, b) => {
      // Convert Roman numerals to numbers for proper sorting
      const romanToNum = (roman: string) => {
        const values: Record<string, number> = { 'I': 1, 'V': 5, 'X': 10, 'L': 50 };
        let total = 0;
        for (let i = 0; i < roman.length; i++) {
          const current = values[roman[i]];
          const next = values[roman[i + 1]];
          if (next && current < next) {
            total += next - current;
            i++;
          } else {
            total += current;
          }
        }
        return total;
      };
      return romanToNum(a) - romanToNum(b);
    });

  const uniqueTopics = Array.from(new Set(flashcards.map(card => card.topic)));

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return; // Don't trigger when typing in search
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'k':
          e.preventDefault();
          markAsKnown();
          break;
        case 'u':
          e.preventDefault();
          markAsUnknown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, filteredCards]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  }, [currentIndex, filteredCards.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const markAsKnown = () => {
    if (filteredCards[currentIndex]) {
      const cardId = filteredCards[currentIndex].id;
      setKnownCards(prev => new Set([...prev, cardId]));
      setUnknownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      setStudiedCards(prev => new Set([...prev, cardId]));
      goToNext();
    }
  };

  const markAsUnknown = () => {
    if (filteredCards[currentIndex]) {
      const cardId = filteredCards[currentIndex].id;
      setUnknownCards(prev => new Set([...prev, cardId]));
      setKnownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(cardId);
        return newSet;
      });
      setStudiedCards(prev => new Set([...prev, cardId]));
      goToNext();
    }
  };

  // Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedArticles([]);
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSearchQuery('');
    setIsShuffled(false);
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const currentCard = filteredCards[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">AI Flashcards</h1>
          </div>
          <p className="text-xl text-blue-200">
            Study {flashcards.length.toLocaleString()} AI-generated NBA CBA flashcards
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            <Filter className="w-5 h-5" />
            Filters {(selectedArticles.length + selectedTopics.length + selectedDifficulties.length > 0 || searchQuery) && 
              `(${selectedArticles.length + selectedTopics.length + selectedDifficulties.length + (searchQuery ? 1 : 0)})`}
          </button>
          
          <button
            onClick={shuffleCards}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
          >
            <Shuffle className="w-5 h-5" />
            Shuffle
          </button>
          
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg">
            <BarChart3 className="w-5 h-5" />
            {studiedCards.size} studied • {knownCards.size} known • {unknownCards.size} review
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-white font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions/answers..."
                  className="w-full px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50"
                />
              </div>

              {/* Articles */}
              <div>
                <label className="block text-white font-medium mb-2">Articles</label>
                <select 
                  multiple
                  value={selectedArticles}
                  onChange={(e) => setSelectedArticles(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full h-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                >
                  {uniqueArticles.map(article => (
                    <option key={article} value={article} className="bg-slate-800">
                      Article {article}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-white font-medium mb-2">Topics</label>
                <select 
                  multiple
                  value={selectedTopics}
                  onChange={(e) => setSelectedTopics(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full h-24 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                >
                  {uniqueTopics.map(topic => (
                    <option key={topic} value={topic} className="bg-slate-800">
                      {TOPICS[topic as keyof typeof TOPICS] || topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-white font-medium mb-2">Difficulty</label>
                <div className="space-y-2">
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <label key={difficulty} className="flex items-center text-white">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(difficulty)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDifficulties([...selectedDifficulties, difficulty]);
                          } else {
                            setSelectedDifficulties(selectedDifficulties.filter(d => d !== difficulty));
                          }
                        }}
                        className="mr-2"
                      />
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredCards.length === 0 ? (
          <div className="text-center text-white">
            <p className="text-xl">No flashcards found with current filters.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* Progress */}
            <div className="mb-6 text-center text-white">
              <p className="text-lg">
                Card {currentIndex + 1} of {filteredCards.length}
                {isShuffled && <span className="text-purple-300"> (shuffled)</span>}
              </p>
              <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Flashcard */}
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-2xl h-96">
                <div
                  className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d cursor-pointer ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of card */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 flex flex-col justify-center backface-hidden"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor(currentCard?.difficulty || 'medium')}`}>
                        {currentCard?.difficulty?.toUpperCase()}
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-blue-100">Article {currentCard?.article_number}</div>
                        <div className="text-xs text-blue-200">{currentCard?.section_number}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="text-2xl font-bold text-white text-center leading-relaxed">
                        {currentCard?.question}
                      </h2>
                    </div>
                    
                    <div className="text-center text-blue-200 text-sm mt-4">
                      Click to reveal answer • Space bar • Swipe
                    </div>
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 flex flex-col justify-center rotate-y-180 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm text-green-100">{currentCard?.topic}</div>
                      <div className="text-sm text-green-100">{currentCard?.citation}</div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-lg leading-relaxed mb-4">{currentCard?.answer}</p>
                        <p className="text-sm text-green-200 italic">{currentCard?.article_title}</p>
                        {currentCard?.section_title && (
                          <p className="text-xs text-green-300 mt-1">{currentCard?.section_title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation and Actions */}
            <div className="flex justify-center items-center gap-4 mb-8">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
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
                  Know It (K)
                </button>
                
                <button
                  onClick={markAsUnknown}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  <XCircle className="w-5 h-5" />
                  Review (U)
                </button>
              </div>

              <button
                onClick={goToNext}
                disabled={currentIndex === filteredCards.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Keyboard shortcuts help */}
            <div className="text-center text-sm text-blue-300">
              <p>
                <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Flip card •
                <kbd className="px-2 py-1 bg-white/10 rounded">←→</kbd> Navigate •
                <kbd className="px-2 py-1 bg-white/10 rounded">K</kbd> Know it •
                <kbd className="px-2 py-1 bg-white/10 rounded">U</kbd> Review
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}