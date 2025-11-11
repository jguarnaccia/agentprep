'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/types';
import { QuestionCard } from '@/components/QuestionCard';
import { Filter, X, TrendingUp, Shuffle, Target, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProgressStats, getIncorrectQuestionIds, getQuestionsByMastery, getRecommendedPool } from '@/lib/progress';
import type { ProgressStats } from '@/lib/types';

const CATEGORIES = [
  'Salary Cap', 'Luxury Tax', 'Aprons (First/Second)', 'Exceptions (MLE, Biannual, etc.)', 'Free Agency', 'Trades',
  'Rookie Contracts', 'Maximum Salaries', 'Minimum Salaries', 'Contract Extensions', 'Two-Way Contracts', 'Waivers',
  'Draft Picks', 'Roster Management', 'Player Contracts', 'International Players', 'G-League Contracts',
];

export default function ScenariosPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [selectedPool, setSelectedPool] = useState<'all' | 'new' | 'review' | 'reinforce' | 'mastered'>('all');
  const [questionPools, setQuestionPools] = useState<{
    new: number[];
    review: number[];
    reinforce: number[];
    mastered: number[];
  }>({ new: [], review: [], reinforce: [], mastered: [] });
  const [recommendedPool, setRecommendedPool] = useState<'new' | 'review' | 'reinforce' | 'mastered'>('new');
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
  
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    totalAttempted: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    successRate: 0,
  });
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<number[]>([]);

  useEffect(() => {
    const initialLoad = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('question_type', 'scenario')
        .order('id', { ascending: true });

      if (error) console.error('Error loading scenario questions:', error);

      if (data) {
        setAllQuestions(data);
        const questionIds = data.map(q => q.id);
        const pools = await getQuestionsByMastery(questionIds);
        setQuestionPools(pools);
        const recommended = await getRecommendedPool(questionIds);
        setRecommendedPool(recommended);
      }
      setLoading(false);
    };
    
    initialLoad();
    loadProgressData();
  }, []);

  async function loadProgressData() {
    const stats = await getProgressStats();
    const incorrectIds = await getIncorrectQuestionIds();
    setProgressStats(stats);
    setIncorrectQuestionIds(incorrectIds);
    
    if (allQuestions.length > 0) {
      const questionIds = allQuestions.map(q => q.id);
      const pools = await getQuestionsByMastery(questionIds);
      setQuestionPools(pools);
      const recommended = await getRecommendedPool(questionIds);
      setRecommendedPool(recommended);
    }
  }

  const categories = useMemo(() => Array.from(new Set(allQuestions.map(q => q.category))).sort(), [allQuestions]);

  const filteredQuestions = useMemo(() => {
    let filtered = [...allQuestions];
    if (selectedCategory !== 'all') filtered = filtered.filter(q => q.category === selectedCategory);
    if (selectedDifficulty !== 'all') filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    if (showIncorrectOnly) filtered = filtered.filter(q => incorrectQuestionIds.includes(q.id));
    if (selectedPool !== 'all') {
      const poolIds = questionPools[selectedPool];
      filtered = filtered.filter(q => poolIds.includes(q.id));
    }
    if (isShuffled) {
      const shuffled = [...filtered];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    return filtered;
  }, [allQuestions, selectedCategory, selectedDifficulty, showIncorrectOnly, incorrectQuestionIds, isShuffled, selectedPool, questionPools]);

  useEffect(() => { setCurrentIndex(0); }, [selectedCategory, selectedDifficulty, showIncorrectOnly]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
        <div className="text-xl text-white">Loading scenario questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-12 h-12 text-red-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Scenario-Based Questions</h1>
              <p className="text-lg text-red-200">Practice with real-world NBA agent situations</p>
            </div>
          </div>
          
          {/* Back to Home */}
          <div className="mb-6">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-white hover:text-red-300 transition-colors font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>

        {allQuestions.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">No scenario questions available</h2>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/90 backdrop-blur-lg rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No questions match your filters</h2>
            <button 
              onClick={() => { 
                setSelectedCategory('all'); 
                setSelectedDifficulty('all'); 
                setShowIncorrectOnly(false); 
              }} 
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Smart Study Pools */}
            <div className="mb-6 bg-gradient-to-br from-white/95 via-red-50/90 to-blue-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">Smart Study Pools</h3>
                {recommendedPool && selectedPool === 'all' && (
                  <span className="ml-auto text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                    Recommended: {recommendedPool.charAt(0).toUpperCase() + recommendedPool.slice(1)}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button 
                  onClick={() => { setSelectedPool('all'); setCurrentIndex(0); }} 
                  className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                    selectedPool === 'all' 
                      ? 'bg-gray-700 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
                  }`}
                >
                  All<div className="text-xs mt-1">{allQuestions.length}</div>
                </button>
                {[
                  { pool: 'new', label: 'New', color: 'bg-blue-600', bgLight: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                  { pool: 'review', label: 'Review', color: 'bg-red-600', bgLight: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                  { pool: 'reinforce', label: 'Reinforce', color: 'bg-yellow-600', bgLight: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
                  { pool: 'mastered', label: 'Mastered', color: 'bg-green-600', bgLight: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                ].map(({ pool, label, color, bgLight, text, border }) => (
                  <button 
                    key={pool} 
                    onClick={() => { setSelectedPool(pool as any); setCurrentIndex(0); }} 
                    className={`px-4 py-3 rounded-lg font-semibold transition-all relative ${
                      selectedPool === pool 
                        ? `${color} text-white shadow-md` 
                        : `${bgLight} ${text} hover:opacity-80 border-2 ${border}`
                    }`}
                  >
                    {label}<div className="text-xs mt-1">{questionPools[pool as keyof typeof questionPools].length}</div>
                    {recommendedPool === pool && selectedPool !== pool && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="font-semibold">New:</span> Never attempted • <span className="font-semibold ml-2">Review:</span> Got wrong • <span className="font-semibold ml-2">Reinforce:</span> Got right once • <span className="font-semibold ml-2">Mastered:</span> Got right 2+ times
              </div>
            </div>

            {/* Controls */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-blue-200 p-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Question {currentIndex + 1} of {filteredQuestions.length}</div>
                <div className="text-sm text-gray-600">
                  {selectedCategory !== 'all' && <span className="text-purple-600">Filtered by category</span>}
                  {selectedDifficulty !== 'all' && <span className="text-purple-600 ml-2">• {selectedDifficulty}</span>}
                  {isShuffled && <span className="text-purple-600 ml-2">• Shuffled</span>}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={() => { setIsShuffled(!isShuffled); setCurrentIndex(0); }} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                    isShuffled 
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50'
                  }`}
                >
                  <Shuffle className="w-5 h-5" />{isShuffled ? 'Shuffled' : 'Shuffle'}
                </button>
                <button 
                  onClick={() => { if (!showStats) loadProgressData(); setShowStats(!showStats); }} 
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-700 font-semibold"
                >
                  <TrendingUp className="w-5 h-5" />Stats
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-red-700 font-semibold"
                >
                  <Filter className="w-5 h-5" />Filters
                </button>
              </div>
            </div>

            {/* Stats Panel */}
            {showStats && (
              <div className="mb-6 bg-gradient-to-br from-white/98 via-blue-50/95 to-red-50/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                  <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Attempted', value: progressStats.totalAttempted, bg: 'bg-blue-50', text: 'text-blue-900', num: 'text-blue-600' },
                    { label: 'Correct', value: progressStats.correctAnswers, bg: 'bg-green-50', text: 'text-green-900', num: 'text-green-600' },
                    { label: 'Incorrect', value: progressStats.incorrectAnswers, bg: 'bg-red-50', text: 'text-red-900', num: 'text-red-600' },
                    { label: 'Success Rate', value: `${progressStats.successRate}%`, bg: 'bg-purple-50', text: 'text-purple-900', num: 'text-purple-600' },
                  ].map((stat) => (
                    <div key={stat.label} className={`${stat.bg} p-4 rounded-lg text-center`}>
                      <div className={`text-3xl font-bold ${stat.num}`}>{stat.value}</div>
                      <div className={`text-sm ${stat.text} mt-1 font-medium`}>{stat.label}</div>
                    </div>
                  ))}
                </div>
                {progressStats.totalAttempted > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Overall Progress</span>
                      <span>{progressStats.totalAttempted} / {allQuestions.length} questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-red-600 to-blue-600 h-3 rounded-full transition-all" 
                        style={{ width: `${(progressStats.totalAttempted / allQuestions.length) * 100}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 bg-gradient-to-br from-white/98 via-red-50/95 to-blue-50/90 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Filter Questions</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="all">All Categories ({allQuestions.length})</option>
                      {categories.map(cat => {
                        const count = allQuestions.filter(q => q.category === cat).length;
                        return <option key={cat} value={cat}>{cat} ({count})</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Difficulty</label>
                    <select 
                      value={selectedDifficulty} 
                      onChange={(e) => setSelectedDifficulty(e.target.value)} 
                      className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 font-medium"
                    >
                      <option value="all">All Difficulties ({allQuestions.length})</option>
                      <option value="easy">Easy ({allQuestions.filter(q => q.difficulty === 'easy').length})</option>
                      <option value="medium">Medium ({allQuestions.filter(q => q.difficulty === 'medium').length})</option>
                      <option value="hard">Hard ({allQuestions.filter(q => q.difficulty === 'hard').length})</option>
                    </select>
                  </div>
                </div>
                {incorrectQuestionIds.length > 0 && (
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={showIncorrectOnly} 
                        onChange={(e) => setShowIncorrectOnly(e.target.checked)} 
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500" 
                      />
                      <span className="ml-3 text-gray-900 font-semibold">
                        Review Incorrect Only ({incorrectQuestionIds.length} questions)
                      </span>
                    </label>
                  </div>
                )}
                {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || showIncorrectOnly) && (
                  <div className="mt-4">
                    <button 
                      onClick={() => { 
                        setSelectedCategory('all'); 
                        setSelectedDifficulty('all'); 
                        setShowIncorrectOnly(false); 
                      }} 
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
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
          </>
        )}
      </div>
    </div>
  );
}
