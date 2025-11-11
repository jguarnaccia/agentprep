'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Question } from '@/lib/types';
import { QuestionCard } from '@/components/QuestionCard';
import { FlashcardCard } from '@/components/FlashcardCard';
import StudyGuideV2 from '@/components/StudyGuideV2';
import NotesTab from '@/components/NotesTab';
import { Filter, X, TrendingUp, Shuffle, Target, Sparkles, CheckCircle, Loader2, Clock, BookOpen, FileText } from 'lucide-react';
import { getProgressStats, getIncorrectQuestionIds, getQuestionsByMastery, getRecommendedPool } from '@/lib/progress';
import type { ProgressStats } from '@/lib/types';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'Salary Cap', 'Luxury Tax', 'Aprons (First/Second)', 'Exceptions (MLE, Biannual, etc.)', 'Free Agency', 'Trades',
  'Rookie Contracts', 'Maximum Salaries', 'Minimum Salaries', 'Contract Extensions', 'Two-Way Contracts', 'Waivers',
  'Draft Picks', 'Roster Management', 'Player Contracts', 'International Players', 'G-League Contracts',
];

const CATEGORY_MAP: { [key: string]: string } = {
  'Salary Cap': 'salary-cap',
  'Luxury Tax': 'luxury-tax',
  'Aprons (First/Second)': 'aprons',
  'Exceptions (MLE, Biannual, etc.)': 'exceptions',
  'Free Agency': 'free-agency',
  'Trades': 'trades',
  'Rookie Contracts': 'rookie-scale',
  'Maximum Salaries': 'player-contracts',
  'Minimum Salaries': 'player-contracts',
  'Contract Extensions': 'contract-extensions',
  'Two-Way Contracts': 'two-way-contracts',
  'Waivers': 'waivers',
  'Draft Picks': 'draft',
  'Roster Management': 'roster-management',
  'Player Contracts': 'player-contracts',
  'International Players': 'international-players',
  'G-League Contracts': 'g-league-contracts',
};

const GENERATION_STEPS = [
  { id: 1, label: 'Preparing your test parameters', duration: 500 },
  { id: 2, label: 'Connecting to AI engine', duration: 1000 },
  { id: 3, label: 'Analyzing CBA rules and regulations', duration: 2000 },
  { id: 4, label: 'Generating high-quality questions', duration: 0 },
  { id: 5, label: 'Validating accuracy and difficulty', duration: 500 },
  { id: 6, label: 'Finalizing your custom test', duration: 500 },
];

export default function StudyPage() {
  const router = useRouter();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [activeTab, setActiveTab] = useState<'study' | 'scenario' | 'flashcard' | 'guide' | 'ai-test' | 'notes'>('study');
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

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generationError, setGenerationError] = useState('');
  const [aiTopic, setAiTopic] = useState(CATEGORIES[0]);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [aiQuestionCount, setAiQuestionCount] = useState(10);
  const [aiQuestionFormat, setAiQuestionFormat] = useState<'multiple_choice' | 'true_false' | 'scenario'>('multiple_choice');

  useEffect(() => {
    const shouldSwitchTab = sessionStorage.getItem('switchToStudyTab');
    if (shouldSwitchTab === 'true') {
      setActiveTab('study');
      sessionStorage.removeItem('switchToStudyTab');
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'ai-test' && activeTab !== 'guide' && activeTab !== 'notes') {
      const initialLoad = async () => {
        let questionType = 'multiple_choice';
        if (activeTab === 'scenario') questionType = 'scenario';
        if (activeTab === 'flashcard') questionType = 'multiple_choice';
        
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('question_type', questionType)
          .order('id', { ascending: true });

        if (error) console.error('Error loading questions:', error);

        if (data) {
          setAllQuestions(data);
          const questionIds = data.map(q => q.id);
          const pools = await getQuestionsByMastery(questionIds);
          setQuestionPools(pools);
          const recommended = await getRecommendedPool(questionIds);
          setRecommendedPool(recommended);
          
          const filterCategory = sessionStorage.getItem('filterCategory');
          if (filterCategory && filterCategory !== 'all') {
            const dbCategory = CATEGORY_MAP[filterCategory] || filterCategory;
            setSelectedCategory(dbCategory);
            setShowFilters(true);
            sessionStorage.removeItem('filterCategory');
          }
        }
        setLoading(false);
      };
      
      initialLoad();
      loadProgressData();
    } else {
      setLoading(false);
    }
  }, [activeTab]);

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

  const handleGenerateTest = async () => {
    setIsGenerating(true);
    setCurrentStep(0);
    setGenerationError('');

    try {
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[0].duration));
      setCurrentStep(2);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[1].duration));
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[2].duration));
      setCurrentStep(4);
      
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          difficulty: aiDifficulty,
          questionCount: aiQuestionCount,
          questionFormat: aiQuestionFormat,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate test');
      }

      const data = await response.json();
      setCurrentStep(5);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[4].duration));
      setCurrentStep(6);
      await new Promise(resolve => setTimeout(resolve, GENERATION_STEPS[5].duration));
      
      sessionStorage.setItem('aiTestData', JSON.stringify({
        questions: data.questions,
        config: { topic: aiTopic, difficulty: aiDifficulty, questionCount: aiQuestionCount, questionFormat: aiQuestionFormat },
      }));
      
      router.push('/ai-test/take');
    } catch (err) {
      console.error('Error generating test:', err);
      setGenerationError(err instanceof Error ? err.message : 'Failed to generate test');
      setCurrentStep(0);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const progressPercentage = currentStep > 0 ? (currentStep / GENERATION_STEPS.length) * 100 : 0;

  if (loading && activeTab !== 'ai-test' && activeTab !== 'guide' && activeTab !== 'notes') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
        <div className="text-xl text-white">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-800 to-blue-900 stars-overlay">
      {isGenerating && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full border border-red-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Test</h2>
              <p className="text-gray-600">Please wait while we create your custom questions...</p>
            </div>
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
            <div className="space-y-3">
              {GENERATION_STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isComplete = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;
                return (
                  <div key={step.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isComplete ? 'bg-green-50 border border-green-200' : isCurrent ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${isComplete ? 'bg-green-600 text-white' : isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {isComplete ? <CheckCircle className="w-5 h-5" /> : isCurrent ? <Loader2 className="w-5 h-5 animate-spin" /> : stepNumber}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${isComplete ? 'text-green-900' : isCurrent ? 'text-blue-900' : 'text-gray-600'}`}>{step.label}</div>
                    </div>
                    {isCurrent && stepNumber === 4 && <Clock className="w-5 h-5 text-blue-600 animate-pulse" />}
                  </div>
                );
              })}
            </div>
            {currentStep === 4 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                <Clock className="w-4 h-4 inline mr-1" />
                This may take 15-30 seconds for {aiQuestionCount} questions
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AgentPrep Study Platform</h1>
          <p className="text-lg text-red-200">Master the NBA CBA for your agent certification</p>
        </div>

        <div className="mb-6 bg-gradient-to-br from-white/95 via-red-50/95 to-blue-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-2 flex gap-2 overflow-x-auto">
          {[
            { tab: 'study', label: 'Study Mode', color: 'bg-blue-600', icon: null },
            { tab: 'scenario', label: 'Scenarios', color: 'bg-red-600', icon: null },
            { tab: 'flashcard', label: 'Flashcards', color: 'bg-blue-600', icon: null },
            { tab: 'guide', label: 'Study Guide', color: 'bg-red-600', icon: BookOpen },
            { tab: 'ai-test', label: 'AI Test', color: 'bg-gradient-to-r from-red-600 to-blue-600', icon: Sparkles },
            { tab: 'notes', label: 'My Notes', color: 'bg-blue-600', icon: FileText },
          ].map(({ tab, label, color, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-fit px-6 py-3 font-semibold rounded-lg transition-all ${activeTab === tab ? `${color} text-white shadow-md` : 'text-gray-700 hover:bg-gray-100'} ${Icon ? 'flex items-center justify-center gap-2' : ''}`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'notes' ? (
          <NotesTab />
        ) : activeTab === 'guide' ? (
          <StudyGuideV2 />
        ) : activeTab === 'ai-test' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-red-600" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">AI Test Generator</h2>
                  <p className="text-gray-600">Create custom practice tests on any CBA topic</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Select Topic</label>
                  <select value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} disabled={isGenerating} className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none text-gray-900 disabled:bg-gray-100">
                    {CATEGORIES.map((category) => (<option key={category} value={category}>{category}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button key={level} onClick={() => setAiDifficulty(level)} disabled={isGenerating} className={`p-3 rounded-lg border-2 transition-all font-medium ${aiDifficulty === level ? 'border-red-600 bg-red-50 text-red-900' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Questions: {aiQuestionCount}</label>
                  <input type="range" min="5" max="50" step="5" value={aiQuestionCount} onChange={(e) => setAiQuestionCount(Number(e.target.value))} disabled={isGenerating} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span><span>25</span><span>50</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Question Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ value: 'multiple_choice', label: 'Multiple Choice' }, { value: 'true_false', label: 'True/False' }, { value: 'scenario', label: 'Scenarios' }].map((format) => (
                      <button key={format.value} onClick={() => setAiQuestionFormat(format.value as any)} disabled={isGenerating} className={`p-3 rounded-lg border-2 transition-all font-medium ${aiQuestionFormat === format.value ? 'border-blue-600 bg-blue-50 text-blue-900' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                        {format.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {generationError && (<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"><p className="text-red-900 font-medium">{generationError}</p></div>)}
              <button onClick={handleGenerateTest} disabled={isGenerating} className="mt-6 w-full bg-gradient-to-r from-red-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isGenerating ? (<><Loader2 className="w-5 h-5 animate-spin" />Generating...</>) : (<><Sparkles className="w-5 h-5" />Generate Test</>)}
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-semibold text-red-900 mb-3">How It Works</h3>
              <ul className="space-y-2 text-red-800">
                {['Select your topic and customize test parameters', 'AI generates unique, CBA-accurate questions instantly', 'Take the test with timer and instant feedback', 'Review detailed explanations for each answer'].map((text, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-red-600 mt-0.5">•</span><span>{text}</span></li>
                ))}
              </ul>
            </div>
          </div>
        ) : allQuestions.length === 0 ? (
          <div className="text-center py-20"><h2 className="text-2xl font-bold text-white">No questions available</h2></div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/90 backdrop-blur-lg rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No questions match your filters</h2>
            <button onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); setShowIncorrectOnly(false); }} className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-gradient-to-br from-white/95 via-red-50/90 to-blue-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-gray-900">Smart Study Pools</h3>
                {recommendedPool && selectedPool === 'all' && (
                  <span className="ml-auto text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">Recommended: {recommendedPool.charAt(0).toUpperCase() + recommendedPool.slice(1)}</span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <button onClick={() => { setSelectedPool('all'); setCurrentIndex(0); }} className={`px-4 py-3 rounded-lg font-semibold transition-all ${selectedPool === 'all' ? 'bg-gray-700 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'}`}>
                  All<div className="text-xs mt-1">{allQuestions.length}</div>
                </button>
                {[
                  { pool: 'new', label: 'New', color: 'bg-blue-600', bgLight: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                  { pool: 'review', label: 'Review', color: 'bg-red-600', bgLight: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
                  { pool: 'reinforce', label: 'Reinforce', color: 'bg-yellow-600', bgLight: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
                  { pool: 'mastered', label: 'Mastered', color: 'bg-green-600', bgLight: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                ].map(({ pool, label, color, bgLight, text, border }) => (
                  <button key={pool} onClick={() => { setSelectedPool(pool as any); setCurrentIndex(0); }} className={`px-4 py-3 rounded-lg font-semibold transition-all relative ${selectedPool === pool ? `${color} text-white shadow-md` : `${bgLight} ${text} hover:opacity-80 border-2 ${border}`}`}>
                    {label}<div className="text-xs mt-1">{questionPools[pool as keyof typeof questionPools].length}</div>
                    {recommendedPool === pool && selectedPool !== pool && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>)}
                  </button>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <span className="font-semibold">New:</span> Never attempted • <span className="font-semibold ml-2">Review:</span> Got wrong • <span className="font-semibold ml-2">Reinforce:</span> Got right once • <span className="font-semibold ml-2">Mastered:</span> Got right 2+ times
              </div>
            </div>
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-white/95 via-blue-50/90 to-red-50/95 backdrop-blur-lg rounded-xl shadow-lg border border-blue-200 p-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Question {currentIndex + 1} of {filteredQuestions.length}</div>
                <div className="text-sm text-gray-600">
                  {selectedCategory !== 'all' && <span className="text-red-600">Filtered by category</span>}
                  {selectedDifficulty !== 'all' && <span className="text-red-600 ml-2">• {selectedDifficulty}</span>}
                  {isShuffled && <span className="text-blue-600 ml-2">• Shuffled</span>}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => { setIsShuffled(!isShuffled); setCurrentIndex(0); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${isShuffled ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg' : 'bg-white border-2 border-red-300 text-red-700 hover:border-red-500 hover:bg-red-50'}`}>
                  <Shuffle className="w-5 h-5" />{isShuffled ? 'Shuffled' : 'Shuffle'}
                </button>
                <button onClick={() => { if (!showStats) loadProgressData(); setShowStats(!showStats); }} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-blue-700 font-semibold">
                  <TrendingUp className="w-5 h-5" />Stats
                </button>
                <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-red-700 font-semibold">
                  <Filter className="w-5 h-5" />Filters
                </button>
              </div>
            </div>
            {showStats && (
              <div className="mb-6 bg-gradient-to-br from-white/98 via-blue-50/95 to-red-50/90 backdrop-blur-lg rounded-xl shadow-lg border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
                  <button onClick={() => setShowStats(false)} className="text-gray-500 hover:text-gray-700 transition-colors"><X className="w-6 h-6" /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Attempted', value: progressStats.totalAttempted, bg: 'bg-blue-50', text: 'text-blue-900', num: 'text-blue-600' },
                    { label: 'Correct', value: progressStats.correctAnswers, bg: 'bg-green-50', text: 'text-green-900', num: 'text-green-600' },
                    { label: 'Incorrect', value: progressStats.incorrectAnswers, bg: 'bg-red-50', text: 'text-red-900', num: 'text-red-600' },
                    { label: 'Success Rate', value: `${progressStats.successRate}%`, bg: 'bg-blue-50', text: 'text-blue-900', num: 'text-blue-600' },
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
                      <div className="bg-gradient-to-r from-red-600 to-blue-600 h-3 rounded-full transition-all" style={{ width: `${(progressStats.totalAttempted / allQuestions.length) * 100}%` }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            {showFilters && (
              <div className="mb-6 bg-gradient-to-br from-white/98 via-red-50/95 to-blue-50/90 backdrop-blur-lg rounded-xl shadow-lg border border-red-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Filter Questions</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700"><X className="w-6 h-6" /></button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-white text-gray-900 font-medium">
                      <option value="all">All Categories ({allQuestions.length})</option>
                      {categories.map(cat => {
                        const count = allQuestions.filter(q => q.category === cat).length;
                        return <option key={cat} value={cat}>{cat} ({count})</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Difficulty</label>
                    <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white text-gray-900 font-medium">
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
                      <input type="checkbox" checked={showIncorrectOnly} onChange={(e) => setShowIncorrectOnly(e.target.checked)} className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                      <span className="ml-3 text-gray-900 font-semibold">Review Incorrect Only ({incorrectQuestionIds.length} questions)</span>
                    </label>
                  </div>
                )}
                {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || showIncorrectOnly) && (
                  <div className="mt-4">
                    <button onClick={() => { setSelectedCategory('all'); setSelectedDifficulty('all'); setShowIncorrectOnly(false); }} className="px-6 py-2 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold">
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'flashcard' ? (
              <FlashcardCard question={filteredQuestions[currentIndex]} onNext={currentIndex < filteredQuestions.length - 1 ? () => setCurrentIndex(prev => prev + 1) : undefined} onPrevious={currentIndex > 0 ? () => setCurrentIndex(prev => prev - 1) : undefined} />
            ) : (
              <QuestionCard question={filteredQuestions[currentIndex]} onNext={currentIndex < filteredQuestions.length - 1 ? () => setCurrentIndex(prev => prev + 1) : undefined} onPrevious={currentIndex > 0 ? () => setCurrentIndex(prev => prev - 1) : undefined} showExplanation />
            )}
          </>
        )}
      </div>
    </div>
  );
}