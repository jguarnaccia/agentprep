'use client';

import { motion } from 'framer-motion';
import { Clock, Brain, Target, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useSRSStats } from '@/lib/hooks/useStudyData';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DueForReviewWidget() {
  const { user } = useAuth();
  const { stats, loading, error } = useSRSStats(user?.id || '');

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-red-600/20 p-8 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </motion.div>
    );
  }

  if (error || !stats) {
    return null;
  }

  const totalDue = stats.questions_due + stats.flashcards_due;
  const totalDueSoon = stats.questions_due_soon + stats.flashcards_due_soon;
  const totalItems = 
    stats.new_questions + stats.learning_questions + stats.reviewing_questions + stats.mastered_questions +
    stats.new_flashcards + stats.learning_flashcards + stats.reviewing_flashcards + stats.mastered_flashcards;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-red-600/20 p-1 backdrop-blur-xl"
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 opacity-20 blur-xl animate-pulse" />
      
      <div className="relative bg-gray-900/95 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Due for Review</h2>
              <p className="text-sm text-gray-400">Smart spaced repetition system</p>
            </div>
          </div>
          
          {totalDue > 0 && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30"
            >
              <span className="text-red-400 font-bold">{totalDue} Due Now!</span>
            </motion.div>
          )}
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Questions Due */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Brain className="w-5 h-5 text-blue-400" />
              <span className="text-3xl font-bold text-blue-400">{stats.questions_due}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Questions Due</p>
            <p className="text-xs text-gray-500 mt-1">{stats.questions_due_soon} due soon</p>
          </motion.div>

          {/* Flashcards Due */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-3xl font-bold text-purple-400">{stats.flashcards_due}</span>
            </div>
            <p className="text-sm text-gray-300 font-medium">Flashcards Due</p>
            <p className="text-xs text-gray-500 mt-1">{stats.flashcards_due_soon} due soon</p>
          </motion.div>
        </div>

        {/* Mastery Breakdown */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mastery Progress
            </h3>
            <span className="text-xs text-gray-500">{totalItems} total items</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {/* New */}
            <div className="text-center p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
              <div className="text-2xl mb-1">🆕</div>
              <div className="text-lg font-bold text-white">
                {stats.new_questions + stats.new_flashcards}
              </div>
              <div className="text-xs text-gray-400">New</div>
            </div>

            {/* Learning */}
            <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-lg font-bold text-blue-400">
                {stats.learning_questions + stats.learning_flashcards}
              </div>
              <div className="text-xs text-gray-400">Learning</div>
            </div>

            {/* Reviewing */}
            <div className="text-center p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="text-2xl mb-1">🔄</div>
              <div className="text-lg font-bold text-yellow-400">
                {stats.reviewing_questions + stats.reviewing_flashcards}
              </div>
              <div className="text-xs text-gray-400">Reviewing</div>
            </div>

            {/* Mastered */}
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-lg font-bold text-green-400">
                {stats.mastered_questions + stats.mastered_flashcards}
              </div>
              <div className="text-xs text-gray-400">Mastered</div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Avg. Ease Factor</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              {stats.avg_question_ease ? stats.avg_question_ease.toFixed(2) : '2.50'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Higher = Easier to remember</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Avg. Interval</span>
            </div>
            <p className="text-2xl font-bold text-orange-400">
              {stats.avg_question_interval ? Math.round(stats.avg_question_interval) : '1'} days
            </p>
            <p className="text-xs text-gray-500 mt-1">Time between reviews</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {totalDue > 0 ? (
            <>
              <Link href="/study" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                >
                  Review Questions ({stats.questions_due})
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <Link href="/flashcards" className="flex-1">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                >
                  Review Flashcards ({stats.flashcards_due})
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
            </>
          ) : (
            <div className="flex-1 p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-green-400 font-semibold mb-1">All caught up!</p>
              <p className="text-sm text-gray-400">
                {totalDueSoon > 0 
                  ? `${totalDueSoon} items due within 24 hours`
                  : 'No items due soon. Great work!'}
              </p>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>SRS Active • Optimizing retention</span>
            </div>
            <span>Next sync in 1 hour</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
