'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, getTierGradient } from '@/lib/achievements/definitions';
import { Trophy, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementUnlockToastProps {
  achievement: Achievement;
  onClose: () => void;
  autoCloseDelay?: number;
}

export function AchievementUnlockToast({
  achievement,
  onClose,
  autoCloseDelay = 5000
}: AchievementUnlockToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 🎉 TRIGGER CONFETTI!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32']
    });

    // Auto-close after delay
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose]);

  const gradient = getTierGradient(achievement.tier);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-20 right-6 z-[100] max-w-sm w-full"
        >
          <div className={`
            rounded-2xl shadow-2xl 
            border-4
            bg-gradient-to-br ${gradient} p-1
          `}>
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className={`
                    w-16 h-16 rounded-full 
                    bg-gradient-to-br ${gradient}
                    flex items-center justify-center
                    flex-shrink-0
                    shadow-lg
                  `}
                >
                  <span className="text-3xl">{achievement.icon}</span>
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                      Achievement Unlocked!
                    </span>
                  </div>

                  <h3 className="font-bold text-xl text-white mb-1">
                    {achievement.title}
                  </h3>

                  <p className="text-sm text-gray-300 mb-3">
                    {achievement.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs">
                    <span className={`
                      px-2 py-1 rounded-full font-medium
                      bg-gradient-to-r ${gradient} text-white
                    `}>
                      {achievement.tier.toUpperCase()}
                    </span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">
                      +{achievement.points} points
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(onClose, 300);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// ACHIEVEMENT NOTIFICATION MANAGER
// ============================================================================

interface AchievementNotificationManagerProps {
  achievements: Achievement[];
}

export function AchievementNotificationManager({ achievements }: AchievementNotificationManagerProps) {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [current, setCurrent] = useState<Achievement | null>(null);

  // Add new achievements to queue
  useEffect(() => {
    if (achievements.length > 0) {
      setQueue(prev => [...prev, ...achievements]);
    }
  }, [achievements]);

  // Show next achievement from queue
  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  }, [current, queue]);

  const handleClose = () => {
    setCurrent(null);
  };

  return (
    <>
      {current && (
        <AchievementUnlockToast
          achievement={current}
          onClose={handleClose}
        />
      )}
    </>
  );
}
