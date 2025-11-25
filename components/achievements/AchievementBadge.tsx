'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Achievement, getTierGradient } from '@/lib/achievements/definitions';
import { Lock } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

export function AchievementBadge({
  achievement,
  unlocked,
  size = 'md',
  showDetails = true,
  onClick
}: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  };

  const gradient = getTierGradient(achievement.tier);

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.05 } : {}}
      whileTap={unlocked ? { scale: 0.95 } : {}}
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-2 
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Badge Circle */}
      <div
        className={`
          ${sizeClasses[size]}
          relative rounded-full 
          flex items-center justify-center
          transition-all duration-300
          ${
            unlocked
              ? `bg-gradient-to-br ${gradient} shadow-lg`
              : 'bg-gray-200 dark:bg-gray-700 grayscale'
          }
        `}
      >
        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        )}

        {/* Icon */}
        <div className={`${iconSizes[size]} ${unlocked ? '' : 'opacity-40'}`}>
          {achievement.icon}
        </div>

        {/* Glow effect for unlocked */}
        {unlocked && (
          <div className={`
            absolute inset-0 rounded-full 
            bg-gradient-to-br ${gradient}
            blur-xl opacity-30 -z-10
          `} />
        )}
      </div>

      {/* Details */}
      {showDetails && (
        <div className="text-center max-w-[120px]">
          <h4 className={`
            font-semibold text-sm
            ${unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
          `}>
            {achievement.title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {achievement.description}
          </p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
              {achievement.points} pts
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface AchievementBadgeGridProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
  onAchievementClick?: (achievement: Achievement) => void;
}

export function AchievementBadgeGrid({
  achievements,
  unlockedIds,
  onAchievementClick
}: AchievementBadgeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          unlocked={unlockedIds.has(achievement.id)}
          onClick={() => onAchievementClick?.(achievement)}
        />
      ))}
    </div>
  );
}
