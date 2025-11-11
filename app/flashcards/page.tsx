'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BookOpen, Filter, Shuffle, RotateCcw, ChevronLeft, ChevronRight, CheckCircle, XCircle, BarChart3, Sparkles, GraduationCap } from 'lucide-react';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  source: 'ai_generated' | 'bobby_marks';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  article_number?: string;
  article_title?: string;
  citation?: string;
  source_document?: string;
  batch?: number;
}

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
  'benefits': 'Player Benefits',
  'definitions': 'CBA Definitions',
  'agent-regulations': 'Agent Regulations',
  'general': 'General'
};

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());
  const [unknownCards, setUnknownCards] = useState<Set<string>>(new Set());
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAllFlashcards();
  }, []);

  const loadAllFlashcards = async () => {
    try {
      setLoading(true);
      console.log('Loading all flashcards...');

      // Load AI flashcards and Bobby Marks questions
      const [aiResult, bobbyResult] = await Promise.all([
        supabase.from('balanced_flashcards').select('*').order('article_number'),
        supabase.from('questions').select('*').order('id')
      ]);

      const allCards: Flashcard[] = [];

      // Process AI flashcards
      if (aiResult.data) {
        aiResult.data.forEach(card => {
          allCards.push({
            id: card.id,
            question: card.question || 'No question',
            answer: card.answer || 'No answer',
            source: 'ai_generated',
            difficulty: card.difficulty || 'medium',
            topic: card.topic || 'general',
            article_number: card.article_number,
            article_title: card.article_title,
            citation: card.citation
          });
        });
      }

      // Process Bobby Marks questions - convert to simple flashcards
      if (bobbyResult.data) {
        bobbyResult.data.forEach(q => {
          let question = q.question || 'No question';
          let answer = q.explanation || 'No explanation';

          // Convert multiple choice to simple Q&A
          if (q.options && Array.isArray(q.options) && q.correct !== undefined) {
            question = q.question;
            const correctAnswer = q.options[q.correct];
            answer = `${correctAnswer}

${q.explanation || 'No explanation provided.'}`;
          }

          allCards.push({
            id: q.id.toString(),
            question: question,
            answer: answer,
            source: 'bobby_marks',
            difficulty: q.difficulty || 'medium',
            topic: q.category || 'general',
            source_document: q.source,
            batch: q.batch
          });
        });
      }

      // Shuffle all cards together initially
      const shuffledCards = allCards.sort(() => Math.random() - 0.5);

      console.log(`Loaded and shuffled ${shuffledCards.length} total flashcards`);
      console.log(`AI: ${shuffledCards.filter(c => c.source === 'ai_generated').length}`);
      console.log(`Bobby Marks: ${shuffledCards.filter(c => c.source === 'bobby_marks').length}`);

      setFlashcards(shuffledCards);
      setFilteredCards(shuffledCards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters (NO SOURCE FILTER)
  useEffect(() => {
    let filtered = [...flashcards];

    if (selectedArticles.length > 0) {
      filtered = filtered.filter(card => {
        if (card.source === 'ai_generated') {
          return selectedArticles.includes(card.article_number || '');
        }
        return false; // Bobby Marks cards don't have articles
      });
    }

    if (selectedTopics.length > 0) {
      filtered = filtered.filter(card => selectedTopics.includes(card.topic));
    }

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(card => selectedDifficulties.includes(card.difficulty));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card => 
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query)
      );
    }

    setFilteredCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [flashcards, selectedArticles, selectedTopics, selectedDifficulties, searchQuery]);

  // Get unique values for filters
  const uniqueArticles = Array.from(new Set(
    flashcards
      .filter(card => card.source === 'ai_generated')
      .map(card => card.article_number)
      .filter(Boolean)
  )).sort((a, b) => {
    // Convert Roman numerals to numbers for proper sorting
    const romanToNum = (roman: string) => {
      const cleanRoman = roman.replace('Article ', '');
      const values: Record<string, number> = { 'I': 1, 'V': 5, 'X': 10, 'L': 50 };
      let total = 0;
      for (let i = 0; i < cleanRoman.length; i++) {
        const current = values[cleanRoman[i]];
        const next = values[cleanRoman[i + 1]];
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

  const currentCard = filteredCards[currentIndex];

  // Navigation
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
    if (currentCard) {
      setKnownCards(prev => new Set([...prev, currentCard.id]));
      setUnknownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentCard.id);
        return newSet;
      });
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
      goToNext();
    }
  };

  const markAsUnknown = () => {
    if (currentCard) {
      setUnknownCards(prev => new Set([...prev, currentCard.id]));
      setKnownCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentCard.id);
        return newSet;
      });
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
      goToNext();
    }
  };

  const shuffleCards = () => {
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
    setFilteredCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const resetFilters = () => {
    setSelectedArticles([]);
    setSelectedTopics([]);
    setSelectedDifficulties([]);
    setSearchQuery('');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
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
        case 's':
          e.preventDefault();
          shuffleCards();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, filteredCards]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">No flashcards found with current filters.</p>
          <button onClick={resetFilters} className="mt-4 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 hover:shadow-lg text-white rounded-lg transition-all">
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-red-400" />
            <h1 className="text-5xl font-bold text-white">🏀 NBA Agent Study Cards</h1>
          </div>
          <p className="text-xl text-red-200 mb-2">
            Study {flashcards.length.toLocaleString()} flashcards mixed from multiple sources
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-blue-300">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span>{flashcards.filter(c => c.source === 'ai_generated').length} AI Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>{flashcards.filter(c => c.source === 'bobby_marks').length} Bobby Marks Expert</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 border-2 border-red-300 hover:bg-red-50/20 text-white rounded-lg transition-all"
          >
            <Filter className="w-5 h-5" />
            Filters {(selectedArticles.length + selectedTopics.length + selectedDifficulties.length > 0 || searchQuery) && 
              `(${selectedArticles.length + selectedTopics.length + selectedDifficulties.length + (searchQuery ? 1 : 0)})`}
          </button>
          
          <button
            onClick={shuffleCards}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg text-white rounded-lg transition-all"
          >
            <Shuffle className="w-5 h-5" />
            Shuffle (S)
          </button>
          
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg">
            <BarChart3 className="w-5 h-5" />
            {studiedCards.size} studied • {knownCards.size} known • {unknownCards.size} review
          </div>
        </div>

        {/* Filters Panel - NO SOURCE FILTER */}
        {showFilters && (
          <div className="mb-8 bg-gradient-to-br from-white/95 via-red-50/80 to-blue-50/90 backdrop-blur-lg rounded-2xl p-6 border border-red-200/30">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search */}
              <div>
                <label className="block text-gray-800 font-medium mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions/answers..."
                  className="w-full px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Articles */}
              <div>
                <label className="block text-gray-800 font-medium mb-2">Articles</label>
                <select 
                  multiple
                  value={selectedArticles}
                  onChange={(e) => setSelectedArticles(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full h-24 px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-gray-900 text-xs"
                >
                  {uniqueArticles.map(article => (
                    <option key={article} value={article} className="bg-white">
                      {article}
                    </option>
                  ))}
                </select>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-gray-800 font-medium mb-2">Topics</label>
                <select 
                  multiple
                  value={selectedTopics}
                  onChange={(e) => setSelectedTopics(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full h-24 px-3 py-2 bg-white/60 border border-gray-300 rounded-lg text-gray-900 text-xs"
                >
                  {uniqueTopics.map(topic => (
                    <option key={topic} value={topic} className="bg-white">
                      {TOPICS[topic as keyof typeof TOPICS] || topic}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-gray-800 font-medium mb-2">Difficulty</label>
                <div className="space-y-2">
                  {['easy', 'medium', 'hard'].map(difficulty => (
                    <label key={difficulty} className="flex items-center text-gray-800">
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

        {/* Progress */}
        <div className="mb-6 text-center text-white">
          <p className="text-lg">Card {currentIndex + 1} of {filteredCards.length}</p>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-red-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredCards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="mb-8 flex justify-center">
          <div className="w-full max-w-2xl h-96">
            {!isFlipped ? (
              /* Front */
              <div 
                className={`w-full h-full ${currentCard.source === 'ai_generated' ? 'bg-gradient-to-br from-red-600 to-blue-600' : 'bg-gradient-to-br from-blue-600 to-red-600'} rounded-2xl p-8 flex flex-col justify-center cursor-pointer shadow-xl hover:scale-105 transition-transform`}
                onClick={() => setIsFlipped(true)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${currentCard.difficulty === 'easy' ? 'bg-green-500' : currentCard.difficulty === 'hard' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {currentCard.difficulty.toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/80">
                      {currentCard.source === 'ai_generated' ? <Sparkles className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                      <span>{currentCard.source === 'ai_generated' ? 'AI Generated' : 'Bobby Marks'}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs text-white/80">
                    {currentCard.source === 'ai_generated' ? currentCard.article_number : `Batch ${currentCard.batch}`}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <h2 className="text-2xl font-bold text-white text-center leading-relaxed whitespace-pre-line">
                    {currentCard.question}
                  </h2>
                </div>
                
                <div className="text-center text-white/80 text-sm mt-4">
                  Click to reveal answer • Space bar
                </div>
              </div>
            ) : (
              /* Back */
              <div 
                className={`w-full h-full ${currentCard.source === 'ai_generated' ? 'bg-gradient-to-br from-blue-600 to-red-600' : 'bg-gradient-to-br from-red-600 to-blue-600'} rounded-2xl p-8 flex flex-col justify-center cursor-pointer shadow-xl hover:scale-105 transition-transform`}
                onClick={() => setIsFlipped(false)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-white/90">
                    {TOPICS[currentCard.topic as keyof typeof TOPICS] || currentCard.topic}
                  </div>
                  <div className="text-sm text-white/90">
                    {currentCard.source === 'ai_generated' ? currentCard.citation : currentCard.source_document}
                  </div>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-lg leading-relaxed whitespace-pre-line">
                      {currentCard.answer}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
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
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              Know It (K)
            </button>
            
            <button
              onClick={markAsUnknown}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
            >
              <XCircle className="w-5 h-5" />
              Review (U)
            </button>
          </div>

          <button
            onClick={goToNext}
            disabled={currentIndex === filteredCards.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Help */}
        <div className="text-center text-sm text-red-300">
          <p>
            <kbd className="px-2 py-1 bg-white/10 rounded">Space</kbd> Flip card •
            <kbd className="px-2 py-1 bg-white/10 rounded">←→</kbd> Navigate •
            <kbd className="px-2 py-1 bg-white/10 rounded">K</kbd> Know it •
            <kbd className="px-2 py-1 bg-white/10 rounded">U</kbd> Review •
            <kbd className="px-2 py-1 bg-white/10 rounded">S</kbd> Shuffle
          </p>
        </div>
      </div>
    </div>
  );
}
