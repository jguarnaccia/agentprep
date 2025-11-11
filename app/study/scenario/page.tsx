'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/types';
import { QuestionCard } from '@/components/QuestionCard';
import { Filter, X, TrendingUp, ArrowLeft } from 'lucide-react';
import { getProgressStats, getIncorrectQuestionIds } from '@/lib/progress';
import type { ProgressStats } from '@/lib/types';
import Link from 'next/link';

export default function ScenarioPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
  
  // Progress stats
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalAttempted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    successRate: 0,
  });
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    loadQuestions();
    loadProgressData();
  }, []);

  async function loadQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('question_type', 'scenario')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error loading questions:', error);
    }

    if (data) {
      setAllQuestions(data);
    }
    setLoading(false);
  }
  
  async function loadProgressData() {
    const stats = await getProgressStats();
    const incorrectIds = await getIncorrectQuestionIds();
    setProgressStats(stats);
    setIncorrectQuestionIds(incorrectIds);
  }

  // Get unique categories and sort them
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allQuestions.map(q => q.category))).sort();
    return cats;
  }, [allQuestions]);

  // Filter questions based on selected filters
  const filteredQuestions = useMemo(() => {
    let filtered = [...allQuestions];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    if (showIncorrectOnly) {
      filtered = filtered.filter(q => incorrectQuestionIds.includes(q.id));
    }

    return filtered;
  }, [allQuestions, selectedCategory, selectedDifficulty, showIncorrectOnly, incorrectQuestionIds]);

  // Reset to first question when filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, selectedDifficulty, showIncorrectOnly]);
  
  // Refresh progress stats when current index changes (after answering)
  useEffect(() => {
    loadProgressData();
  }, [currentIndex]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-900">Loading scenario questions...</div>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 text-center pt-20">
        <h1 className="text-2xl font-bold text-gray-900">No scenario questions available</h1>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/study"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Study Mode
          </Link>
          
          <div className="text-center pt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No questions match your filters</h1>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setShowIncorrectOnly(false);
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button and Header */}
        <div className="mb-6">
          <Link 
            href="/study"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Study Mode
          </Link>
        </div>

        {/* Header with Filter and Stats Buttons */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Scenario Mode</h1>
            <p className="text-gray-600">
              Question {currentIndex + 1} of {filteredQuestions.length}
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || showIncorrectOnly) && (
                <span className="text-blue-600 ml-2">(Filtered)</span>
              )}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-black font-semibold"
            >
              <TrendingUp className="w-5 h-5" />
              Stats
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors text-black font-semibold"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        {showStats && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              <button
                onClick={() => setShowStats(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">{progressStats.totalAttempted}</div>
                <div className="text-sm text-gray-600 mt-1">Questions Attempted</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">{progressStats.correctAnswers}</div>
                <div className="text-sm text-gray-600 mt-1">Correct</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">{progressStats.incorrectAnswers}</div>
                <div className="text-sm text-gray-600 mt-1">Incorrect</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">{progressStats.successRate}%</div>
                <div className="text-sm text-gray-600 mt-1">Success Rate</div>
              </div>
            </div>
            
            {progressStats.totalAttempted > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{progressStats.totalAttempted} / {allQuestions.length} questions</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${(progressStats.totalAttempted / allQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filter Questions</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black font-medium"
                  style={{ color: '#000000' }}
                >
                  <option value="all" className="text-black" style={{ color: '#000000' }}>
                    All Categories ({allQuestions.length})
                  </option>
                  {categories.map(cat => {
                    const count = allQuestions.filter(q => q.category === cat).length;
                    return (
                      <option key={cat} value={cat} className="text-black" style={{ color: '#000000' }}>
                        {cat} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-black font-medium"
                  style={{ color: '#000000' }}
                >
                  <option value="all" className="text-black" style={{ color: '#000000' }}>
                    All Difficulties ({allQuestions.length})
                  </option>
                  <option value="easy" className="text-black" style={{ color: '#000000' }}>
                    Easy ({allQuestions.filter(q => q.difficulty === 'easy').length})
                  </option>
                  <option value="medium" className="text-black" style={{ color: '#000000' }}>
                    Medium ({allQuestions.filter(q => q.difficulty === 'medium').length})
                  </option>
                  <option value="hard" className="text-black" style={{ color: '#000000' }}>
                    Hard ({allQuestions.filter(q => q.difficulty === 'hard').length})
                  </option>
                </select>
              </div>
            </div>
            
            {/* Review Incorrect Toggle */}
            {incorrectQuestionIds.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showIncorrectOnly}
                    onChange={(e) => setShowIncorrectOnly(e.target.checked)}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-black font-semibold">
                    Review Incorrect Only ({incorrectQuestionIds.length} questions)
                  </span>
                </label>
              </div>
            )}

            {/* Clear Filters Button */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || showIncorrectOnly) && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setShowIncorrectOnly(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Question Card */}
        <QuestionCard 
          question={filteredQuestions[currentIndex]}
          onNext={currentIndex < filteredQuestions.length - 1 ? () => setCurrentIndex(prev => prev + 1) : undefined}
          onPrevious={currentIndex > 0 ? () => setCurrentIndex(prev => prev - 1) : undefined}
          showExplanation
        />
      </div>
    </div>
  );
}
