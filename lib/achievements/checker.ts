// ============================================================================
// ACHIEVEMENT CHECKER ENGINE
// ============================================================================
// Determines when achievements should be unlocked based on user activity
// ============================================================================

import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS, Achievement } from './definitions';

export interface UserStats {
  // Questions
  questionsAnswered: number;
  questionsMastered: number;
  correctAnswers: number;
  incorrectAnswers: number;
  
  // Flashcards
  flashcardsReviewed: number;
  flashcardsMastered: number;
  
  // Tests
  testsCompleted: number;
  highScoreTests: number; // Tests with 95%+
  perfectTests: number; // Tests with 100%
  
  // Scenarios
  scenariosCompleted: number;
  
  // Notes
  notesCreated: number;
  
  // Streaks
  currentStreak: number;
  maxConsecutiveCorrect: number;
  
  // Special
  articlesRead: number;
  featuresUsed: number;
  earlyMorningStudy: boolean;
  lateNightStudy: boolean;
  weekendStudy: boolean;
  hasReturnedAfterBreak: boolean;
  
  // Session
  questionsThisSession: number;
}

/**
 * Fetch comprehensive user stats from database
 */
export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Fetch data from all tables in parallel
    const [
      progressData,
      flashcardData,
      testData,
      scenarioData,
      notesData
    ] = await Promise.all([
      // User progress (questions)
      supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId),
      
      // Flashcard progress
      supabase
        .from('flashcard_progress')
        .select('*')
        .eq('user_id', userId),
      
      // Test results
      supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId),
      
      // Scenarios progress
      supabase
        .from('scenarios_progress')
        .select('*')
        .eq('user_id', userId),
      
      // User notes
      supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
    ]);

    // Calculate question stats
    const progress = progressData.data || [];
    const questionsAnswered = progress.length;
    const questionsMastered = progress.filter(p => p.mastery_level >= 4).length;
    const correctAnswers = progress.reduce((sum, p) => sum + (p.correct_count || 0), 0);
    const incorrectAnswers = progress.reduce((sum, p) => sum + (p.incorrect_count || 0), 0);

    // Calculate flashcard stats
    const flashcards = flashcardData.data || [];
    const flashcardsReviewed = flashcards.length;
    const flashcardsMastered = flashcards.filter(f => f.confidence_level === 'high').length;

    // Calculate test stats
    const tests = testData.data || [];
    const testsCompleted = tests.length;
    const highScoreTests = tests.filter(t => {
      const score = (t.score / t.total_questions) * 100;
      return score >= 95;
    }).length;
    const perfectTests = tests.filter(t => t.score === t.total_questions).length;

    // Calculate scenario stats
    const scenarios = scenarioData.data || [];
    const scenariosCompleted = scenarios.length;

    // Calculate notes stats
    const notes = notesData.data || [];
    const notesCreated = notes.length;

    // Calculate streak
    const currentStreak = await calculateStreak(userId, progress);

    // Calculate max consecutive correct answers
    const maxConsecutiveCorrect = await calculateMaxConsecutiveCorrect(userId);

    // Calculate special achievements
    const earlyMorningStudy = await hasEarlyMorningStudy(userId);
    const lateNightStudy = await hasLateNightStudy(userId);
    const weekendStudy = await hasWeekendStudy(userId);
    const hasReturnedAfterBreak = await hasStudyComeback(userId);

    // Calculate features used (simplified - you can expand this)
    const featuresUsed = calculateFeaturesUsed({
      hasQuestions: questionsAnswered > 0,
      hasFlashcards: flashcardsReviewed > 0,
      hasTests: testsCompleted > 0,
      hasScenarios: scenariosCompleted > 0,
      hasNotes: notesCreated > 0
    });

    return {
      questionsAnswered,
      questionsMastered,
      correctAnswers,
      incorrectAnswers,
      flashcardsReviewed,
      flashcardsMastered,
      testsCompleted,
      highScoreTests,
      perfectTests,
      scenariosCompleted,
      notesCreated,
      currentStreak,
      maxConsecutiveCorrect,
      articlesRead: 0, // TODO: Implement article tracking
      featuresUsed,
      earlyMorningStudy,
      lateNightStudy,
      weekendStudy,
      hasReturnedAfterBreak,
      questionsThisSession: 0 // Updated in real-time during session
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    // Return empty stats on error
    return {
      questionsAnswered: 0,
      questionsMastered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      flashcardsReviewed: 0,
      flashcardsMastered: 0,
      testsCompleted: 0,
      highScoreTests: 0,
      perfectTests: 0,
      scenariosCompleted: 0,
      notesCreated: 0,
      currentStreak: 0,
      maxConsecutiveCorrect: 0,
      articlesRead: 0,
      featuresUsed: 0,
      earlyMorningStudy: false,
      lateNightStudy: false,
      weekendStudy: false,
      hasReturnedAfterBreak: false,
      questionsThisSession: 0
    };
  }
}

/**
 * Check which achievements user has earned based on their stats
 */
export function checkEarnedAchievements(stats: UserStats): Achievement[] {
  const earned: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (hasEarnedAchievement(achievement, stats)) {
      earned.push(achievement);
    }
  }

  return earned;
}

/**
 * Check if a single achievement has been earned
 */
function hasEarnedAchievement(achievement: Achievement, stats: UserStats): boolean {
  const { requirement } = achievement;
  const { type, target, metric } = requirement;

  switch (metric) {
    // Questions
    case 'questions_answered':
      return stats.questionsAnswered >= target;
    case 'questions_mastered':
      return stats.questionsMastered >= target;
    
    // Flashcards
    case 'flashcards_reviewed':
      return stats.flashcardsReviewed >= target;
    case 'flashcards_mastered':
      return stats.flashcardsMastered >= target;
    
    // Tests
    case 'tests_completed':
      return stats.testsCompleted >= target;
    case 'high_score_tests':
      return stats.highScoreTests >= target;
    case 'test_score':
      return stats.perfectTests > 0; // For 100% test achievement
    
    // Scenarios
    case 'scenarios_completed':
      return stats.scenariosCompleted >= target;
    
    // Notes
    case 'notes_created':
      return stats.notesCreated >= target;
    
    // Streaks
    case 'study_streak':
      return stats.currentStreak >= target;
    case 'correct_streak':
      return stats.maxConsecutiveCorrect >= target;
    
    // Performance
    case 'questions_per_session':
      return stats.questionsThisSession >= target;
    
    // Special
    case 'articles_read':
      return stats.articlesRead >= target;
    case 'features_used':
      return stats.featuresUsed >= target;
    case 'early_morning_study':
      return stats.earlyMorningStudy;
    case 'late_night_study':
      return stats.lateNightStudy;
    case 'weekend_study':
      return stats.weekendStudy;
    case 'study_comeback':
      return stats.hasReturnedAfterBreak;
    
    default:
      console.warn(`Unknown metric: ${metric}`);
      return false;
  }
}

/**
 * Get newly unlocked achievements (not yet saved to database)
 */
export async function getNewlyUnlockedAchievements(
  userId: string,
  currentStats: UserStats
): Promise<Achievement[]> {
  try {
    // Get all achievements user has earned based on stats
    const earnedAchievements = checkEarnedAchievements(currentStats);

    // Get achievements already unlocked from database
    const { data: unlockedData, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching unlocked achievements:', error);
      return earnedAchievements; // Return all earned if can't check DB
    }

    const unlockedIds = new Set(unlockedData?.map(a => a.achievement_id) || []);

    // Filter to only newly earned achievements
    return earnedAchievements.filter(achievement => !unlockedIds.has(achievement.id));
  } catch (error) {
    console.error('Error getting newly unlocked achievements:', error);
    return [];
  }
}

/**
 * Unlock achievement and save to database
 */
export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId
      });

    if (error) {
      // Ignore duplicate errors (achievement already unlocked)
      if (error.code === '23505') {
        return true;
      }
      console.error('Error unlocking achievement:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
}

/**
 * Unlock multiple achievements at once
 */
export async function unlockAchievements(
  userId: string,
  achievementIds: string[]
): Promise<number> {
  let unlocked = 0;

  for (const id of achievementIds) {
    const success = await unlockAchievement(userId, id);
    if (success) unlocked++;
  }

  return unlocked;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate current study streak
 */
async function calculateStreak(userId: string, progress: any[]): Promise<number> {
  if (!progress || progress.length === 0) return 0;

  // Get unique dates
  const uniqueDates = new Set(
    progress
      .filter(p => p.last_attempted)
      .map(p => new Date(p.last_attempted).toDateString())
  );

  if (uniqueDates.size === 0) return 0;

  // Count consecutive days from today backwards
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const today = currentDate.toDateString();
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // If user hasn't studied today or yesterday, streak is 0
  if (!uniqueDates.has(today) && !uniqueDates.has(yesterdayStr)) {
    return 0;
  }

  // Start counting from yesterday if user hasn't studied today
  if (!uniqueDates.has(today)) {
    currentDate = yesterday;
  }

  // Count consecutive days
  while (uniqueDates.has(currentDate.toDateString())) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * Calculate max consecutive correct answers
 */
async function calculateMaxConsecutiveCorrect(userId: string): Promise<number> {
  try {
    // Get all question attempts ordered by time
    const { data, error } = await supabase
      .from('user_progress')
      .select('correct_count, incorrect_count, last_attempted')
      .eq('user_id', userId)
      .order('last_attempted', { ascending: true });

    if (error || !data) return 0;

    // Calculate consecutive correct
    let maxStreak = 0;
    let currentStreak = 0;

    for (const record of data) {
      const correct = record.correct_count || 0;
      const incorrect = record.incorrect_count || 0;

      // If last attempt was correct
      if (correct > 0 && incorrect === 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (incorrect > 0) {
        currentStreak = 0;
      }
    }

    return maxStreak;
  } catch (error) {
    console.error('Error calculating consecutive correct:', error);
    return 0;
  }
}

/**
 * Check if user has studied before 8 AM
 */
async function hasEarlyMorningStudy(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_attempted')
      .eq('user_id', userId);

    if (error || !data) return false;

    return data.some(record => {
      const date = new Date(record.last_attempted);
      return date.getHours() < 8;
    });
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has studied after 10 PM
 */
async function hasLateNightStudy(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_attempted')
      .eq('user_id', userId);

    if (error || !data) return false;

    return data.some(record => {
      const date = new Date(record.last_attempted);
      return date.getHours() >= 22;
    });
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has studied on weekend
 */
async function hasWeekendStudy(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_attempted')
      .eq('user_id', userId);

    if (error || !data) return false;

    const hasSaturday = data.some(record => {
      const date = new Date(record.last_attempted);
      return date.getDay() === 6;
    });

    const hasSunday = data.some(record => {
      const date = new Date(record.last_attempted);
      return date.getDay() === 0;
    });

    return hasSaturday && hasSunday;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has returned after 7+ day break
 */
async function hasStudyComeback(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('last_attempted')
      .eq('user_id', userId)
      .order('last_attempted', { ascending: true });

    if (error || !data || data.length < 2) return false;

    // Check for any 7+ day gap followed by return
    for (let i = 1; i < data.length; i++) {
      const prevDate = new Date(data[i - 1].last_attempted);
      const currDate = new Date(data[i].last_attempted);
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff >= 7) {
        return true;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate number of features used
 */
function calculateFeaturesUsed(features: {
  hasQuestions: boolean;
  hasFlashcards: boolean;
  hasTests: boolean;
  hasScenarios: boolean;
  hasNotes: boolean;
}): number {
  let count = 0;
  if (features.hasQuestions) count++;
  if (features.hasFlashcards) count++;
  if (features.hasTests) count++;
  if (features.hasScenarios) count++;
  if (features.hasNotes) count++;
  // TODO: Add study guide and AI generator when tracking is implemented
  return count;
}
