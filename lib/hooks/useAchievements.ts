'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements/definitions';
import { 
  getUserStats, 
  getNewlyUnlockedAchievements,
  unlockAchievements,
  UserStats 
} from '@/lib/achievements/checker';

interface UseAchievementsReturn {
  // User's unlocked achievements
  unlockedAchievements: Achievement[];
  
  // All available achievements
  allAchievements: Achievement[];
  
  // User's current stats
  stats: UserStats | null;
  
  // Progress metrics
  totalPoints: number;
  unlockedCount: number;
  totalCount: number;
  completionPercentage: number;
  
  // State
  loading: boolean;
  error: string | null;
  
  // Actions
  checkForNewAchievements: () => Promise<Achievement[]>;
  refreshAchievements: () => Promise<void>;
}

export function useAchievements(): UseAchievementsReturn {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user's unlocked achievements from database
   */
  const fetchUnlockedAchievements = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', user.id)
        .order('unlocked_at', { ascending: false });

      if (error) throw error;

      // Map achievement IDs to full achievement objects
      const unlocked = (data || [])
        .map(record => ACHIEVEMENTS.find(a => a.id === record.achievement_id))
        .filter(Boolean) as Achievement[];

      return unlocked;
    } catch (err: any) {
      console.error('Error fetching unlocked achievements:', err);
      throw err;
    }
  }, [user]);

  /**
   * Fetch user stats and achievements
   */
  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch user stats and unlocked achievements in parallel
      const [userStats, unlocked] = await Promise.all([
        getUserStats(user.id),
        fetchUnlockedAchievements()
      ]);

      setStats(userStats);
      setUnlockedAchievements(unlocked);
    } catch (err: any) {
      console.error('Error fetching achievements:', err);
      setError(err.message || 'Failed to load achievements');
    } finally {
      setLoading(false);
    }
  }, [user, fetchUnlockedAchievements]);

  /**
   * Check for newly unlocked achievements and save them
   */
  const checkForNewAchievements = useCallback(async (): Promise<Achievement[]> => {
    if (!user) return [];

    try {
      // Get current stats (refresh them)
      const currentStats = await getUserStats(user.id);
      setStats(currentStats);

      // Find newly unlocked achievements
      const newAchievements = await getNewlyUnlockedAchievements(user.id, currentStats);

      if (newAchievements.length > 0) {
        // Save to database
        const newIds = newAchievements.map(a => a.id);
        await unlockAchievements(user.id, newIds);

        // Update local state
        setUnlockedAchievements(prev => [...newAchievements, ...prev]);

        return newAchievements;
      }

      return [];
    } catch (err) {
      console.error('Error checking for new achievements:', err);
      return [];
    }
  }, [user]);

  /**
   * Force refresh all achievement data
   */
  const refreshAchievements = useCallback(async () => {
    await fetchAchievements();
  }, [fetchAchievements]);

  // Fetch on mount and when user changes
  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // Calculate progress metrics
  const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = totalCount > 0 
    ? Math.round((unlockedCount / totalCount) * 100) 
    : 0;

  return {
    unlockedAchievements,
    allAchievements: ACHIEVEMENTS,
    stats,
    totalPoints,
    unlockedCount,
    totalCount,
    completionPercentage,
    loading,
    error,
    checkForNewAchievements,
    refreshAchievements
  };
}
