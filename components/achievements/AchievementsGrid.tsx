'use client';

import React, { useState } from 'react';
import { Achievement, AchievementCategory, AchievementTier } from '@/lib/achievements/definitions';
import { AchievementBadgeGrid } from './AchievementBadge';
import { Trophy, Target, Flame, Brain, Star, CreditCard, Sparkles } from 'lucide-react';

interface AchievementsGridProps {
  allAchievements: Achievement[];
  unlockedAchievements: Achievement[];
}

const CATEGORY_INFO: Record<AchievementCategory, { label: string; icon: React.ReactNode }> = {
  beginner: { label: 'Getting Started', icon: <Target className="w-5 h-5" /> },
  streak: { label: 'Streaks', icon: <Flame className="w-5 h-5" /> },
  questions: { label: 'Question Milestones', icon: <Brain className="w-5 h-5" /> },
  mastery: { label: 'Mastery', icon: <Star className="w-5 h-5" /> },
  performance: { label: 'Performance', icon: <Trophy className="w-5 h-5" /> },
  flashcards: { label: 'Flashcards', icon: <CreditCard className="w-5 h-5" /> },
  special: { label: 'Special', icon: <Sparkles className="w-5 h-5" /> }
};

export function AchievementsGrid({ allAchievements, unlockedAchievements }: AchievementsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [selectedTier, setSelectedTier] = useState<AchievementTier | 'all'>('all');

  const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

  // Group achievements by category
  const achievementsByCategory = allAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<AchievementCategory, Achievement[]>);

  // Filter achievements
  const filteredAchievements = allAchievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const tierMatch = selectedTier === 'all' || achievement.tier === selectedTier;
    return categoryMatch && tierMatch;
  });

  // Calculate stats
  const totalAchievements = allAchievements.length;
  const unlockedCount = unlockedAchievements.length;
  const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Achievements Unlocked"
          value={`${unlockedCount} / ${totalAchievements}`}
          icon={<Trophy className="w-5 h-5" />}
        />
        <StatCard
          label="Completion"
          value={`${completionPercentage}%`}
          icon={<Target className="w-5 h-5" />}
        />
        <StatCard
          label="Total Points"
          value={totalPoints.toLocaleString()}
          icon={<Star className="w-5 h-5" />}
        />
        <StatCard
          label="Rarest Achievement"
          value="Coming Soon"
          icon={<Sparkles className="w-5 h-5" />}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as AchievementCategory | 'all')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_INFO).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tier
          </label>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value as AchievementTier | 'all')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Tiers</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Achievements Display */}
      {selectedCategory === 'all' ? (
        // Show by category
        <div className="space-y-8">
          {Object.entries(achievementsByCategory).map(([category, achievements]) => {
            const categoryInfo = CATEGORY_INFO[category as AchievementCategory];
            const categoryUnlocked = achievements.filter(a => unlockedIds.has(a.id)).length;
            
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {categoryInfo.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {categoryInfo.label}
                    </h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({categoryUnlocked}/{achievements.length})
                    </span>
                  </div>
                </div>

                <AchievementBadgeGrid
                  achievements={achievements}
                  unlockedIds={unlockedIds}
                />
              </div>
            );
          })}
        </div>
      ) : (
        // Show filtered
        <AchievementBadgeGrid
          achievements={filteredAchievements}
          unlockedIds={unlockedIds}
        />
      )}

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No achievements match your filters.
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
        <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}
