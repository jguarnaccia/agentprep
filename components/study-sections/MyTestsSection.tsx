'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RotateCcw,
  Calendar,
  Target,
  BarChart3,
  Loader2,
  Trash2
} from 'lucide-react';
import { useTestResults, deleteTestResult, useAuth, type TestResult } from '@/lib/hooks/useStudyData';

export function MyTestsSection() {
  const { user } = useAuth();
  const { tests, loading, error } = useTestResults(user?.id || '');
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredTests = filterDifficulty === 'All' 
    ? tests 
    : tests.filter(t => t.difficulty === filterDifficulty);

  const avgScore = tests.length > 0
    ? Math.round(tests.reduce((sum, test) => sum + test.score, 0) / tests.length)
    : 0;
  const totalQuestions = tests.reduce((sum, test) => sum + test.total_questions, 0);
  const totalTime = tests.reduce((sum, test) => sum + test.time_taken, 0);

  const handleDelete = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    
    setDeletingId(testId);
    const result = await deleteTestResult(testId);
    setDeletingId(null);
    
    if (!result.success) {
      alert('Failed to delete test. Please try again.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Please Log In</h2>
          <p className="text-slate-300">You need to be logged in to view your tests</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-700 font-medium">Error loading tests</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">My Tests</h1>
          </div>
          <p className="text-slate-300">Review your test history and track your progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Tests Taken</span>
              <History className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-white">{tests.length}</p>
            <p className="text-xs text-slate-400 mt-1">All time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 border border-blue-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Avg Score</span>
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{avgScore}%</p>
            <p className="text-xs text-blue-100 mt-1">Across all tests</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 border border-red-500 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-100">Questions</span>
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{totalQuestions}</p>
            <p className="text-xs text-red-100 mt-1">Total answered</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-300">Study Time</span>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-white">{Math.round(totalTime / 60)}h</p>
            <p className="text-xs text-slate-400 mt-1">{totalTime} minutes total</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm font-medium text-slate-300">Filter by:</span>
          {['All', 'Easy', 'Medium', 'Hard', 'Mixed'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setFilterDifficulty(difficulty)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterDifficulty === difficulty
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600'
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Tests Yet</h3>
            <p className="text-slate-400">
              {filterDifficulty === 'All' 
                ? "Take your first test to see your results here!"
                : `No ${filterDifficulty} tests found. Try a different filter.`
              }
            </p>
          </div>
        )}

        {/* Test History */}
        <div className="space-y-4">
          {filteredTests.map((test, index) => {
            const scorePercentage = Math.round((test.score / test.total_questions) * 100);
            
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">
                          {test.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(test.difficulty)}`}>
                          {test.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{test.time_taken} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          <span>{test.total_questions} questions</span>
                        </div>
                        <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                          {test.topic}
                        </span>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <div className={`px-6 py-4 rounded-xl border-2 ${getScoreColor(scorePercentage)}`}>
                      <p className="text-3xl font-bold">{scorePercentage}%</p>
                      <p className="text-xs font-medium mt-1">Score</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-300">
                        {test.score} / {test.total_questions} correct
                      </span>
                      <span className="text-slate-300">
                        {scorePercentage}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${
                          scorePercentage >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          scorePercentage >= 80 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          scorePercentage >= 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                          'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${scorePercentage}%` }}
                        transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedTest(test)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Review Answers
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 border border-slate-600 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      Retake Test
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      disabled={deletingId === test.id}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 border border-red-500 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {deletingId === test.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Performance Insights */}
        {tests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl border border-blue-500 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">📊 Performance Insights</h3>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-300" />
                    <span>You've completed <strong>{tests.length}</strong> practice tests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-300" />
                    <span>Your average score is <strong>{avgScore}%</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-300" />
                    <span>Keep practicing to improve your exam readiness!</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
