'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Flame,
  Award,
  BookOpen,
  Zap,
  Clock,
  CheckCircle,
  Play,
  XCircle,
  ChevronLeft,
  Lightbulb,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useSmartQuestions, usePriorityStats, useAuth, updateQuestionProgress, type Question } from '@/lib/hooks/useStudyData';

interface StudySession {
  questionsAnswered: number;
  correctAnswers: number;
  currentStreak: number;
  sessionTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export function StudyModeSection() {
  const { user } = useAuth();
  const { smartQuestions, loading } = useSmartQuestions(user?.id || '', { limit: 50 });
  const { stats: priorityStats, loading: statsLoading } = usePriorityStats(user?.id || '');
  
  // Use smart questions with priority scores
  const questions = smartQuestions.map(({ priorityScore, ...question }) => question);
  const [isStudying, setIsStudying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [session, setSession] = useState<StudySession>({
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 7,
    sessionTime: 0,
    difficulty: 'Medium'
  });

  const stats = {
    totalSessions: 24,
    totalQuestions: questions.length,
    avgAccuracy: 82,
    bestStreak: 12,
    weeklyGoal: 100,
    weeklyProgress: 67
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion || !user) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    // Update progress in database
    await updateQuestionProgress(user.id, currentQuestion.id, isCorrect);
    
    // Update session stats
    setSession(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    }));

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // End session
      setIsStudying(false);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleEndSession = () => {
    setIsStudying(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSession({
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 7,
      sessionTime: 0,
      difficulty: 'Medium'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (isStudying && currentQuestion) {
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header with Progress */}
          <div className="mb-8">
            <button
              onClick={handleEndSession}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">End Session</span>
            </button>

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                <p className="text-slate-400 text-sm mt-1">
                  {session.correctAnswers} correct • {session.questionsAnswered - session.correctAnswers} incorrect
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-400">
                  {session.questionsAnswered > 0 ? Math.round((session.correctAnswers / session.questionsAnswered) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-400">Accuracy</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-lg p-8 mb-6"
          >
            {/* Category & Difficulty Tags */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                {currentQuestion.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                currentQuestion.difficulty === 'Easy' 
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : currentQuestion.difficulty === 'Medium'
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {currentQuestion.article}
              </span>
            </div>

            {/* Question */}
            <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === currentQuestion.correct_answer;
                
                let borderColor = 'border-slate-600';
                let bgColor = 'bg-slate-800 hover:bg-slate-700';
                let textColor = 'text-white';
                
                if (showExplanation) {
                  if (isCorrectAnswer) {
                    borderColor = 'border-green-300';
                    bgColor = 'bg-green-50';
                    textColor = 'text-green-900';
                  } else if (isSelected && !isCorrectAnswer) {
                    borderColor = 'border-red-300';
                    bgColor = 'bg-red-50';
                    textColor = 'text-red-900';
                  } else {
                    bgColor = 'bg-slate-700';
                    textColor = 'text-slate-300';
                  }
                } else if (isSelected) {
                  borderColor = 'border-blue-300';
                  bgColor = 'bg-blue-50';
                  textColor = 'text-blue-900';
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showExplanation}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${borderColor} ${bgColor} ${textColor} ${
                      !showExplanation ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    whileHover={!showExplanation ? { scale: 1.01 } : {}}
                    whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showExplanation && isCorrectAnswer
                          ? 'border-green-500 bg-green-500'
                          : showExplanation && isSelected && !isCorrectAnswer
                          ? 'border-red-500 bg-red-500'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-slate-300'
                      }`}>
                        {showExplanation && isCorrectAnswer && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showExplanation && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="flex-1 font-medium">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Submit Button */}
            {!showExplanation && selectedAnswer !== null && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmit}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-red-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                Submit Answer
              </motion.button>
            )}
          </motion.div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Result Banner */}
                <div className={`rounded-2xl border-2 p-6 ${
                  isCorrect
                    ? 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-green-900">Correct!</h3>
                          <p className="text-sm text-green-700">Great work! Keep it up.</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-red-900">Not Quite</h3>
                          <p className="text-sm text-red-700">Review the explanation below.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Explanation Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Explanation</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 via-red-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-red-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Study Mode</h1>
          <p className="text-slate-300">Adaptive learning system that adjusts to your performance</p>
        </div>

        {/* Hero CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-red-600 to-blue-700 rounded-2xl p-8 mb-8 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Start Smart Study Session</h2>
                <p className="text-blue-100 text-sm">Personalized questions based on your progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">Priority Questions</span>
                </div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '-' : priorityStats?.highPriorityCount || 0}
                </p>
                <p className="text-xs text-blue-100 mt-1">High value for learning</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">New Material</span>
                </div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '-' : priorityStats?.neverSeenCount || 0}
                </p>
                <p className="text-xs text-blue-100 mt-1">Never attempted</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Needs Review</span>
                </div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '-' : priorityStats?.needsReviewCount || 0}
                </p>
                <p className="text-xs text-blue-100 mt-1">Previously incorrect</p>
              </div>
            </div>

            {questions.length > 0 ? (
              <button
                onClick={() => setIsStudying(true)}
                className="flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Begin Smart Study Session ({questions.length} priority questions)
              </button>
            ) : (
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm text-blue-100">No questions available. Please check back soon!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Sessions</span>
              <BookOpen className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalSessions}</p>
            <p className="text-xs text-slate-400 mt-1">Total completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Questions</span>
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalQuestions}</p>
            <p className="text-xs text-blue-100 mt-1">Available to study</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 border border-red-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-100">Best Streak</span>
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.bestStreak} days</p>
            <p className="text-xs text-red-100 mt-1">Personal record</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Accuracy</span>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.avgAccuracy}%</p>
            <p className="text-xs text-slate-400 mt-1">Average score</p>
          </motion.div>
        </div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Weekly Goal</h3>
              <p className="text-sm text-slate-300">
                {stats.weeklyProgress} / {stats.weeklyGoal} questions this week
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">
                {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}%
              </p>
            </div>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.weeklyProgress / stats.weeklyGoal) * 100}%` }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Study Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-sm p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Focus Areas</h3>
                <p className="text-sm text-slate-300">Topics that need more practice</p>
              </div>
            </div>

            {statsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              </div>
            ) : priorityStats && priorityStats.weakTopics.length > 0 ? (
              <div className="space-y-3">
                {priorityStats.weakTopics.map((topic, index) => {
                  const accuracy = Math.round(topic.accuracy * 100);
                  const colorClass = accuracy < 50 ? 'bg-red-50 border-red-100' : accuracy < 70 ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100';
                  const textClass = accuracy < 50 ? 'text-red-900' : accuracy < 70 ? 'text-amber-900' : 'text-green-900';
                  const badgeClass = accuracy < 50 ? 'text-red-700' : accuracy < 70 ? 'text-amber-700' : 'text-green-700';
                  
                  return (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${colorClass}`}>
                      <span className={`text-sm font-medium ${textClass}`}>{topic.category}</span>
                      <span className={`text-xs font-semibold ${badgeClass}`}>{accuracy}% accuracy</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-slate-400">No weak areas identified yet!</p>
                <p className="text-xs text-slate-500 mt-1">Keep studying to track your progress.</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 shadow-sm p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Recent Achievements</h3>
                <p className="text-sm text-slate-300">Your latest milestones</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">7-Day Streak</p>
                  <p className="text-xs text-slate-300">Studied every day this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">100 Questions</p>
                  <p className="text-xs text-slate-300">Answered this week</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Accuracy Boost</p>
                  <p className="text-xs text-slate-300">+8% improvement this month</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Smart Study Tip */}
        {!statsLoading && priorityStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl border border-blue-500 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">💡 Smart Study Recommendation</h3>
                <p className="text-sm text-blue-100 leading-relaxed">
                  {priorityStats.weakTopics.length > 0 ? (
                    <>
                      Your algorithm has identified <strong>{priorityStats.weakTopics[0].category}</strong> as a focus area 
                      ({Math.round(priorityStats.weakTopics[0].accuracy * 100)}% accuracy). We've prioritized questions in this topic 
                      along with {priorityStats.neverSeenCount} new questions you haven't seen yet. This smart mix will maximize 
                      your learning efficiency!
                    </>
                  ) : priorityStats.neverSeenCount > 0 ? (
                    <>
                      You have {priorityStats.neverSeenCount} new questions ready to explore! Starting your session now will 
                      introduce you to fresh material while reinforcing what you've already learned. Studies show mixing new 
                      and review material leads to better retention.
                    </>
                  ) : priorityStats.needsReviewCount > 0 ? (
                    <>
                      You have {priorityStats.needsReviewCount} questions that need review. Our algorithm has prioritized these 
                      to help strengthen your weak areas. Regular review is key to moving knowledge from short-term to long-term memory.
                    </>
                  ) : (
                    <>
                      Great job! You're making excellent progress. Keep up the consistency - studying for 25 minutes, 
                      then taking a 5-minute break (the Pomodoro Technique) is proven to maximize retention and prevent burnout.
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
