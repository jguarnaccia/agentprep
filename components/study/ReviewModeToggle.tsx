'use client';

import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';

interface ReviewModeToggleProps {
  reviewMode: boolean;
  onToggle: () => void;
  dueCount: number;
}

export default function ReviewModeToggle({ reviewMode, onToggle, dueCount }: ReviewModeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`relative overflow-hidden rounded-xl px-6 py-4 border-2 transition-all ${
        reviewMode
          ? 'border-blue-500 bg-gradient-to-r from-blue-600/20 to-purple-600/20'
          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {reviewMode ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
          </motion.div>
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        )}
        
        <div className="text-left">
          <div className={`font-semibold ${reviewMode ? 'text-blue-400' : 'text-white'}`}>
            {reviewMode ? '✨ Review Mode Active' : 'Review Mode'}
          </div>
          <div className="text-xs text-gray-400">
            {dueCount > 0 
              ? `${dueCount} items due for review`
              : 'All caught up!'}
          </div>
        </div>

        {/* Toggle indicator */}
        <div className="ml-auto">
          <div className={`w-12 h-6 rounded-full transition-all relative ${
            reviewMode ? 'bg-blue-500' : 'bg-gray-600'
          }`}>
            <motion.div
              animate={{ x: reviewMode ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-0 left-0 w-6 h-6 rounded-full bg-white shadow-lg"
            />
          </div>
        </div>
      </div>

      {reviewMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
      )}
    </motion.button>
  );
}
