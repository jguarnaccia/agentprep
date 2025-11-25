'use client';

import { motion } from 'framer-motion';
import { ThumbsDown, Meh, ThumbsUp } from 'lucide-react';

interface DifficultyRatingProps {
  onRate: (wasHard: boolean, wasEasy: boolean) => void;
  disabled?: boolean;
}

export default function DifficultyRating({ onRate, disabled }: DifficultyRatingProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-400 text-center mb-2">
        How difficult was this question?
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {/* Hard */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onRate(true, false)}
          disabled={disabled}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsDown className="w-6 h-6 text-red-400" />
          <span className="text-sm font-medium text-red-400">Hard</span>
          <span className="text-xs text-gray-500">Review in 1 day</span>
        </motion.button>

        {/* Good */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onRate(false, false)}
          disabled={disabled}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Meh className="w-6 h-6 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Good</span>
          <span className="text-xs text-gray-500">Standard interval</span>
        </motion.button>

        {/* Easy */}
        <motion.button
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          onClick={() => !disabled && onRate(false, true)}
          disabled={disabled}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-500/10 border-2 border-green-500/30 hover:border-green-500 hover:bg-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ThumbsUp className="w-6 h-6 text-green-400" />
          <span className="text-sm font-medium text-green-400">Easy</span>
          <span className="text-xs text-gray-500">Longer interval</span>
        </motion.button>
      </div>

      <p className="text-xs text-gray-600 text-center mt-2">
        Your rating helps optimize when you'll see this question again
      </p>
    </div>
  );
}
