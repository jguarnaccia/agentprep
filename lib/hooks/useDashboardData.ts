'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  questionsAnswered: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  flashcardsReviewed: number;
  flashcardsMastered: number;
  testsCompleted: number;
  averageTestScore: number;
  totalStudyTime: number;
  studyStreak: number;
  notesCount: number;
  scenariosCompleted: number;
  masteryBreakdown: {
    new: number;
    learning: number;
    reviewing: number;
    mastered: number;
  };
}

interface RecentActivity {
  id: string;
  type: 'question' | 'flashcard' | 'test' | 'note' | 'scenario';
  description: string;
  timestamp: Date;
  metadata?: any;
}

export function useDashboardData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [
          progressData,
          flashcardData,
          testData,
          notesData,
          scenariosData,
        ] = await Promise.all([
          // User progress (questions)
          supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id),
          
          // Flashcard progress
          supabase
            .from('flashcard_progress')
            .select('*')
            .eq('user_id', user.id),
          
          // Test results
          supabase
            .from('test_results')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false }),
          
          // Notes
          supabase
            .from('notes')
            .select('*')
            .eq('user_id', user.id),
          
          // Scenarios progress
          supabase
            .from('scenarios_progress')
            .select('*')
            .eq('user_id', user.id),
        ]);

        // Calculate question stats
        const totalQuestions = progressData.data?.length || 0;
        const correctQuestions = progressData.data?.filter(q => q.is_correct)?.length || 0;
        const incorrectQuestions = totalQuestions - correctQuestions;

        // Calculate mastery breakdown
        const masteryBreakdown = {
          new: progressData.data?.filter(q => q.mastery_level === 'New')?.length || 0,
          learning: progressData.data?.filter(q => q.mastery_level === 'Learning')?.length || 0,
          reviewing: progressData.data?.filter(q => q.mastery_level === 'Reviewing')?.length || 0,
          mastered: progressData.data?.filter(q => q.mastery_level === 'Mastered')?.length || 0,
        };

        // Calculate flashcard stats
        const totalFlashcards = flashcardData.data?.length || 0;
        const masteredFlashcards = flashcardData.data?.filter(f => f.confidence_level >= 4)?.length || 0;

        // Calculate test stats
        const totalTests = testData.data?.length || 0;
        const avgScore = totalTests > 0
          ? Math.round(testData.data!.reduce((sum, test) => sum + test.score, 0) / totalTests)
          : 0;

        // Calculate study streak (simplified - checks last 7 days)
        const studyStreak = await calculateStudyStreak(user.id);

        // Calculate total study time (in hours)
        const totalStudyTime = await calculateTotalStudyTime(user.id);

        // Set stats
        setStats({
          questionsAnswered: totalQuestions,
          questionsCorrect: correctQuestions,
          questionsIncorrect: incorrectQuestions,
          flashcardsReviewed: totalFlashcards,
          flashcardsMastered: masteredFlashcards,
          testsCompleted: totalTests,
          averageTestScore: avgScore,
          totalStudyTime: totalStudyTime,
          studyStreak: studyStreak,
          notesCount: notesData.data?.length || 0,
          scenariosCompleted: scenariosData.data?.length || 0,
          masteryBreakdown,
        });

        // Build recent activity feed
        const activities = buildRecentActivity(
          progressData.data || [],
          flashcardData.data || [],
          testData.data || [],
          notesData.data || [],
          scenariosData.data || []
        );
        setRecentActivity(activities);

      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  return { stats, recentActivity, loading, error };
}

// Helper: Calculate study streak
async function calculateStudyStreak(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_attempted')
      .eq('user_id', userId)
      .order('last_attempted', { ascending: false });

    if (error || !data || data.length === 0) return 0;

    // Get unique dates
    const dates = new Set(
      data.map(item => new Date(item.last_attempted).toDateString())
    );

    // Count consecutive days from today backwards
    let streak = 0;
    let currentDate = new Date();
    
    while (dates.has(currentDate.toDateString())) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

// Helper: Calculate total study time
async function calculateTotalStudyTime(userId: string): Promise<number> {
  try {
    // This is a simplified version - you might have a study_sessions table
    // For now, we'll estimate based on questions answered (3 mins per question)
    const { data, error } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId);

    if (error || !data) return 0;

    // Estimate: 3 minutes per question, convert to hours
    const totalMinutes = data.length * 3;
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal

    return totalHours;
  } catch (error) {
    console.error('Error calculating study time:', error);
    return 0;
  }
}

// Helper: Build recent activity feed
function buildRecentActivity(
  progress: any[],
  flashcards: any[],
  tests: any[],
  notes: any[],
  scenarios: any[]
): RecentActivity[] {
  const activities: RecentActivity[] = [];

  // Add question activities
  progress.slice(0, 5).forEach(item => {
    activities.push({
      id: item.id,
      type: 'question',
      description: item.is_correct 
        ? 'Answered a question correctly' 
        : 'Attempted a question',
      timestamp: new Date(item.last_attempted),
      metadata: item,
    });
  });

  // Add flashcard activities
  flashcards.slice(0, 5).forEach(item => {
    activities.push({
      id: item.id,
      type: 'flashcard',
      description: `Reviewed flashcard (confidence: ${item.confidence_level}/5)`,
      timestamp: new Date(item.last_reviewed),
      metadata: item,
    });
  });

  // Add test activities
  tests.slice(0, 5).forEach(item => {
    activities.push({
      id: item.id,
      type: 'test',
      description: `Completed test - ${item.score}%`,
      timestamp: new Date(item.completed_at),
      metadata: item,
    });
  });

  // Add note activities
  notes.slice(0, 3).forEach(item => {
    activities.push({
      id: item.id,
      type: 'note',
      description: `Created note: "${item.title}"`,
      timestamp: new Date(item.created_at),
      metadata: item,
    });
  });

  // Add scenario activities
  scenarios.slice(0, 3).forEach(item => {
    activities.push({
      id: item.id,
      type: 'scenario',
      description: 'Completed a scenario',
      timestamp: new Date(item.completed_at),
      metadata: item,
    });
  });

  // Sort by timestamp and return top 10
  return activities
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);
}
