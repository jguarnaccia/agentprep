import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  calculateNextReview, 
  createInitialSRSState, 
  PerformanceRating,
  performanceFromCorrect,
  isDueForReview,
  type SRSState 
} from '@/lib/srs-algorithm';

// Export useAuth from its own file
export { useAuth } from './useAuth';

// ============================================================================
// TYPES
// ============================================================================

export interface Scenario {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  description: string;
  situation: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  keyTakeaway: string;
  created_at?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  article: string;
  section: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  created_at?: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  correct_count: number;
  incorrect_count: number;
  last_attempted: string;
  mastery_level: 'new' | 'learning' | 'reviewing' | 'mastered';
  // SRS fields
  next_review_date?: string;
  ease_factor?: number;
  interval_days?: number;
  consecutive_correct?: number;
  last_review_date?: string;
}

export interface FlashcardProgress {
  id: string;
  user_id: string;
  flashcard_id: string;
  correct_count: number;
  incorrect_count: number;
  last_attempted: string;
  mastery_level: 'new' | 'learning' | 'reviewing' | 'mastered';
  // SRS fields
  next_review_date?: string;
  ease_factor?: number;
  interval_days?: number;
  consecutive_correct?: number;
  last_review_date?: string;
}

export interface CBAContent {
  id: string;
  article_number: number;
  article_title: string;
  section_number?: string;
  section_title?: string;
  content: string;
  order_index: number;
  level: 'article' | 'section' | 'subsection';
  parent_id?: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  score: number;
  total_questions: number;
  time_taken: number;
  questions: any[];
  answers: any[];
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
// SRS STATS INTERFACE
// ============================================================================

export interface SRSStats {
  // Questions
  questions_due: number;
  questions_due_soon: number;
  new_questions: number;
  learning_questions: number;
  reviewing_questions: number;
  mastered_questions: number;
  
  // Flashcards
  flashcards_due: number;
  flashcards_due_soon: number;
  new_flashcards: number;
  learning_flashcards: number;
  reviewing_flashcards: number;
  mastered_flashcards: number;
  
  // Averages
  avg_question_ease: number;
  avg_flashcard_ease: number;
  avg_question_interval: number;
  avg_flashcard_interval: number;
}

// ============================================================================
// SCENARIOS HOOKS
// ============================================================================

export function useScenarios() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
            console.warn('Scenarios table does not exist yet. Please create it.');
            setScenarios([]);
            setError('Scenarios table not found. Please run the database setup.');
          } else {
            throw error;
          }
        } else {
          setScenarios(data || []);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch scenarios');
        console.error('Error fetching scenarios:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScenarios();
  }, []);

  return { scenarios, loading, error };
}

export function useScenariosByDifficulty(difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null) {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!difficulty) return;

    async function fetchScenarios() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .eq('difficulty', difficulty)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setScenarios(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching scenarios by difficulty:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchScenarios();
  }, [difficulty]);

  return { scenarios, loading, error };
}

// ============================================================================
// SMART QUESTION SELECTION ALGORITHM
// ============================================================================

/**
 * Calculate priority score for a question based on user's history
 * Higher score = more important to study now
 */
function calculateQuestionPriority(
  question: Question,
  progress: UserProgress | null,
  allProgress: UserProgress[],
  categoryAccuracy: Record<string, { correct: number; total: number }>
): number {
  let score = 0;
  const now = new Date();

  // FACTOR 1: Never attempted before (+100 points)
  if (!progress) {
    score += 100;
  } else {
    // FACTOR 2: Got wrong last time (+80 points)
    const lastAttemptCorrect = progress.correct_count > 0;
    const lastAttemptIncorrect = progress.incorrect_count > 0;
    if (lastAttemptIncorrect && progress.incorrect_count >= progress.correct_count) {
      score += 80;
    }

    // FACTOR 3: Got wrong 2+ times recently (+30 points)
    if (progress.incorrect_count >= 2) {
      score += 30;
    }

    // FACTOR 4: Not seen in 7+ days (+40 points)
    if (progress.last_attempted) {
      const lastAttemptDate = new Date(progress.last_attempted);
      const daysSinceLastAttempt = Math.floor(
        (now.getTime() - lastAttemptDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastAttempt >= 7) {
        score += 40;
      } else if (daysSinceLastAttempt >= 3) {
        score += 20;
      }
    }

    // FACTOR 5: Low mastery level (+50/30/10 points)
    if (progress.mastery_level === 'new') {
      score += 50;
    } else if (progress.mastery_level === 'learning') {
      score += 30;
    } else if (progress.mastery_level === 'reviewing') {
      score += 10;
    }
    // mastered gets 0 bonus
  }

  // FACTOR 6: Weak category (<70% accuracy) (+60 points)
  const categoryStats = categoryAccuracy[question.category];
  if (categoryStats && categoryStats.total > 0) {
    const accuracy = categoryStats.correct / categoryStats.total;
    if (accuracy < 0.70) {
      score += 60;
    } else if (accuracy < 0.80) {
      score += 30;
    }
  }

  // FACTOR 7: Difficulty bonus (Easy +10, Medium +20, Hard +30)
  if (question.difficulty === 'Hard') {
    score += 30;
  } else if (question.difficulty === 'Medium') {
    score += 20;
  } else {
    score += 10;
  }

  // FACTOR 8: Random variation (+0-20 points for variety)
  score += Math.floor(Math.random() * 21);

  return score;
}

/**
 * Calculate category accuracy statistics
 */
function calculateCategoryAccuracy(
  progress: UserProgress[],
  questions: Question[]
): Record<string, { correct: number; total: number }> {
  const categoryStats: Record<string, { correct: number; total: number }> = {};

  // Create a map of question_id to question for quick lookup
  const questionMap = new Map(questions.map(q => [q.id, q]));

  progress.forEach(p => {
    const question = questionMap.get(p.question_id);
    if (question) {
      if (!categoryStats[question.category]) {
        categoryStats[question.category] = { correct: 0, total: 0 };
      }
      categoryStats[question.category].correct += p.correct_count;
      categoryStats[question.category].total += p.correct_count + p.incorrect_count;
    }
  });

  return categoryStats;
}

/**
 * Smart question selection hook - Returns questions prioritized by learning value
 */
export function useSmartQuestions(userId: string, filters?: {
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  article?: string;
  limit?: number;
}) {
  const [smartQuestions, setSmartQuestions] = useState<(Question & { priorityScore: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchSmartQuestions() {
      setLoading(true);
      try {
        // Fetch all questions
        let query = supabase.from('questions').select('*');

        if (filters?.category) {
          query = query.eq('category', filters.category);
        }
        if (filters?.difficulty) {
          query = query.eq('difficulty', filters.difficulty);
        }
        if (filters?.article) {
          query = query.eq('article', filters.article);
        }

        const { data: questions, error: questionsError } = await query;
        if (questionsError) throw questionsError;

        // Fetch user progress
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);

        if (progressError) throw progressError;

        // Calculate category accuracy
        const categoryAccuracy = calculateCategoryAccuracy(progress || [], questions || []);

        // Create a map for quick progress lookup
        const progressMap = new Map(
          (progress || []).map(p => [p.question_id, p])
        );

        // Calculate priority score for each question
        const questionsWithScores = (questions || []).map(question => {
          const questionProgress = progressMap.get(question.id) || null;
          const priorityScore = calculateQuestionPriority(
            question,
            questionProgress,
            progress || [],
            categoryAccuracy
          );

          return {
            ...question,
            priorityScore
          };
        });

        // Sort by priority score (highest first)
        questionsWithScores.sort((a, b) => b.priorityScore - a.priorityScore);

        // Apply limit if specified
        const limited = filters?.limit
          ? questionsWithScores.slice(0, filters.limit)
          : questionsWithScores;

        setSmartQuestions(limited);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching smart questions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSmartQuestions();
  }, [userId, filters?.category, filters?.difficulty, filters?.article, filters?.limit]);

  return { smartQuestions, loading, error };
}

/**
 * Get priority question statistics for dashboard
 */
export function usePriorityStats(userId: string, refreshKey?: number) {
  const [stats, setStats] = useState<{
    highPriorityCount: number;
    neverSeenCount: number;
    needsReviewCount: number;
    weakTopics: Array<{ category: string; accuracy: number; count: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchPriorityStats() {
      try {
        setLoading(true);
        
        // Fetch all questions
        const { data: questions, error: questionsError } = await supabase
          .from('questions')
          .select('*');

        if (questionsError) throw questionsError;
        
        // Fetch user progress
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);

        if (progressError) throw progressError;
        
        // Calculate statistics
        // IMPORTANT: Convert question_id to string for comparison since they're stored as TEXT in DB
        const progressMap = new Map((progress || []).map(p => [String(p.question_id), p]));
        const categoryAccuracy = calculateCategoryAccuracy(progress || [], questions || []);

        let highPriorityCount = 0;
        let neverSeenCount = 0;
        let needsReviewCount = 0;

        (questions || []).forEach(question => {
          const questionProgress = progressMap.get(String(question.id)); // Convert to string for lookup
          const priorityScore = calculateQuestionPriority(
            question,
            questionProgress || null,
            progress || [],
            categoryAccuracy
          );

          if (priorityScore >= 150) highPriorityCount++;
          if (!questionProgress) neverSeenCount++;
          if (questionProgress && questionProgress.incorrect_count > questionProgress.correct_count) {
            needsReviewCount++;
          }
        });
        
        // Find weak topics (< 70% accuracy)
        const weakTopics = Object.entries(categoryAccuracy)
          .filter(([_, stats]) => stats.total >= 3) // At least 3 attempts
          .map(([category, stats]) => ({
            category,
            accuracy: stats.correct / stats.total,
            count: stats.total
          }))
          .filter(topic => topic.accuracy < 0.70)
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, 5); // Top 5 weakest topics

        setStats({
          highPriorityCount,
          neverSeenCount,
          needsReviewCount,
          weakTopics
        });
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching priority stats:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPriorityStats();
  }, [userId, refreshKey]);

  return { stats, loading, error };
}

// ============================================================================
// QUESTIONS HOOKS (Study Mode) - WITH SRS
// ============================================================================

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setQuestions(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  return { questions, loading, error };
}

export function useQuestionsByFilters(filters: {
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  article?: string;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        let query = supabase.from('questions').select('*');

        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.difficulty) {
          query = query.eq('difficulty', filters.difficulty);
        }
        if (filters.article) {
          query = query.eq('article', filters.article);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setQuestions(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching filtered questions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [filters.category, filters.difficulty, filters.article]);

  return { questions, loading, error };
}

export function useUserProgress(userId: string) {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchProgress() {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setProgress(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching user progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [userId]);

  return { progress, loading, error };
}

/**
 * NEW: Get questions due for review using SRS + fallback logic
 */
export function useDueQuestions(userId: string) {
  const [dueQuestions, setDueQuestions] = useState<(Question & { progress: UserProgress })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchDueQuestions() {
      try {
        console.log('Fetching due questions for user:', userId);
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
        
        // Get ALL progress records for this user
        const { data: progressData, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId);

        if (progressError) {
          console.error('Error fetching progress:', progressError);
          throw progressError;
        }

        console.log(`Found ${progressData?.length || 0} total progress records`);
        console.log('Sample progress records:', progressData?.slice(0, 3));

        if (!progressData || progressData.length === 0) {
          console.log('No progress data found, returning empty array');
          setDueQuestions([]);
          return;
        }

        // Filter for questions that need review based on multiple criteria:
        const dueProgressRecords = progressData.filter((p, index) => {
          let matched = false;
          let matchedCriteria: string[] = [];
          
          // Criterion 1: Has next_review_date and it's in the past
          if (p.next_review_date) {
            const reviewDate = new Date(p.next_review_date);
            if (reviewDate <= now) {
              matched = true;
              matchedCriteria.push(`SRS (next_review: ${reviewDate.toISOString()})`);
            }
          }
          
          // Criterion 2: More incorrect than correct attempts (needs practice)
          if (p.incorrect_count > p.correct_count) {
            matched = true;
            matchedCriteria.push(`Performance (${p.incorrect_count} incorrect > ${p.correct_count} correct)`);
          }
          
          // Criterion 3: Not attempted in last 3 days and has at least one attempt
          if (p.last_attempted) {
            const lastAttempt = new Date(p.last_attempted);
            const totalAttempts = (p.correct_count || 0) + (p.incorrect_count || 0);
            if (lastAttempt < threeDaysAgo && totalAttempts > 0) {
              matched = true;
              matchedCriteria.push(`Time-based (last: ${lastAttempt.toISOString()})`);
            }
          }
          
          // Log first 3 matches for debugging
          if (matched && index < 3) {
            console.log(`✓ Question ${p.question_id} matched:`, matchedCriteria.join(', '));
          }
          
          return matched;
        });

        console.log(`Filtered to ${dueProgressRecords.length} due progress records`);
        
        if (dueProgressRecords.length === 0) {
          console.log('⚠️ NO QUESTIONS MATCHED ANY CRITERIA');
          console.log('Sample of unmatched progress (first 3):');
          progressData.slice(0, 3).forEach(p => {
            console.log({
              question_id: p.question_id,
              next_review_date: p.next_review_date,
              correct_count: p.correct_count,
              incorrect_count: p.incorrect_count,
              last_attempted: p.last_attempted,
            });
          });
        }

        if (dueProgressRecords.length === 0) {
          setDueQuestions([]);
          return;
        }

        // Extract question IDs and convert to strings (questions.id is TEXT type)
        const questionIds = dueProgressRecords.map(p => String(p.question_id));
        console.log('Fetching questions with IDs (as strings):', questionIds.slice(0, 5), '...');

        // Fetch the corresponding questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .in('id', questionIds);

        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        console.log(`Found ${questionsData?.length || 0} questions`);

        // Create a map for quick lookup (ensure both keys are strings)
        const questionsMap = new Map(
          (questionsData || []).map(q => [String(q.id), q])
        );

        // Combine progress and question data
        const combined = dueProgressRecords
          .map(progressItem => {
            const question = questionsMap.get(String(progressItem.question_id));
            if (!question) {
              console.warn(`Question not found for ID: ${progressItem.question_id}`);
              return null;
            }

            return {
              ...question,
              progress: {
                id: progressItem.id,
                user_id: progressItem.user_id,
                question_id: progressItem.question_id,
                correct_count: progressItem.correct_count,
                incorrect_count: progressItem.incorrect_count,
                last_attempted: progressItem.last_attempted,
                mastery_level: progressItem.mastery_level,
                next_review_date: progressItem.next_review_date,
                ease_factor: progressItem.ease_factor,
                interval_days: progressItem.interval_days,
                consecutive_correct: progressItem.consecutive_correct,
                last_review_date: progressItem.last_review_date,
              }
            };
          })
          .filter(Boolean) as (Question & { progress: UserProgress })[];

        console.log(`Successfully combined ${combined.length} questions with progress`);
        setDueQuestions(combined);
      } catch (err: any) {
        const errorMessage = err?.message || err?.toString() || 'Unknown error fetching due questions';
        setError(errorMessage);
        console.error('Error fetching due questions:', {
          error: err,
          message: errorMessage,
          stack: err?.stack
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDueQuestions();
  }, [userId]);

  return { dueQuestions, loading, error };
}

/**
 * UPDATED: Update question progress with SRS calculation
 */
export async function updateQuestionProgress(
  userId: string,
  questionId: string,
  isCorrect: boolean,
  wasHard: boolean = false
) {
  try {
    console.log('Updating progress with SRS for:', { userId, questionId, isCorrect, wasHard });

    // Get existing progress
    const { data: existing, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('question_id', questionId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching existing progress:', fetchError);
      throw fetchError;
    }

    console.log('Existing progress:', existing);

    // Determine performance rating
    const performance = performanceFromCorrect(isCorrect, wasHard);

    if (existing) {
      // Calculate SRS update
      const currentSRSState: SRSState = {
        easeFactor: existing.ease_factor || 2.50,
        intervalDays: existing.interval_days || 1,
        consecutiveCorrect: existing.consecutive_correct || 0,
        nextReviewDate: existing.next_review_date ? new Date(existing.next_review_date) : new Date(),
        lastReviewDate: existing.last_review_date ? new Date(existing.last_review_date) : new Date(),
        masteryLevel: existing.mastery_level || 'new',
      };

      const srsUpdate = calculateNextReview(currentSRSState, performance);

      // Update counts
      const correctCount = existing.correct_count + (isCorrect ? 1 : 0);
      const incorrectCount = existing.incorrect_count + (isCorrect ? 0 : 1);

      const updateData = {
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        mastery_level: srsUpdate.masteryLevel,
        last_attempted: new Date().toISOString(),
        // SRS fields
        next_review_date: srsUpdate.nextReviewDate.toISOString(),
        ease_factor: srsUpdate.easeFactor,
        interval_days: srsUpdate.intervalDays,
        consecutive_correct: srsUpdate.consecutiveCorrect,
        last_review_date: new Date().toISOString(),
      };

      console.log('Updating with SRS data:', updateData);

      const { error } = await supabase
        .from('user_progress')
        .update(updateData)
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating existing progress:', error);
        throw error;
      }

      console.log('Successfully updated with SRS');
    } else {
      // Create new progress record with initial SRS state
      const initialSRS = createInitialSRSState();

      const insertData = {
        user_id: userId,
        question_id: questionId,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
        mastery_level: 'new',
        last_attempted: new Date().toISOString(),
        // SRS fields
        next_review_date: initialSRS.nextReviewDate.toISOString(),
        ease_factor: initialSRS.easeFactor,
        interval_days: initialSRS.intervalDays,
        consecutive_correct: initialSRS.consecutiveCorrect,
        last_review_date: new Date().toISOString(),
      };

      console.log('Inserting new progress with SRS:', insertData);

      const { error } = await supabase
        .from('user_progress')
        .insert(insertData);

      if (error) {
        console.error('Error inserting new progress:', error);
        throw error;
      }

      console.log('Successfully created new progress with SRS');
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating question progress:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

// ============================================================================
// FLASHCARD PROGRESS - WITH SRS
// ============================================================================

export function useFlashcardProgress(userId: string) {
  const [progress, setProgress] = useState<FlashcardProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchProgress() {
      try {
        const { data, error } = await supabase
          .from('flashcard_progress')
          .select('*')
          .eq('user_id', userId);

        if (error) throw error;
        setProgress(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching flashcard progress:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, [userId]);

  return { progress, loading, error };
}

/**
 * NEW: Get flashcards due for review using SRS
 */
export function useDueFlashcards(userId: string) {
  const [dueFlashcards, setDueFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchDueFlashcards() {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('flashcard_progress')
          .select(`
            *,
            flashcards:flashcard_id (*)
          `)
          .eq('user_id', userId)
          .lte('next_review_date', now)
          .order('next_review_date', { ascending: true });

        if (error) throw error;
        setDueFlashcards(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching due flashcards:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDueFlashcards();
  }, [userId]);

  return { dueFlashcards, loading, error };
}

/**
 * NEW: Update flashcard progress with SRS calculation
 */
export async function updateFlashcardProgress(
  userId: string,
  flashcardId: string,
  isCorrect: boolean,
  wasHard: boolean = false
) {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('flashcard_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('flashcard_id', flashcardId)
      .maybeSingle();

    if (fetchError) throw fetchError;

    const performance = performanceFromCorrect(isCorrect, wasHard);

    if (existing) {
      const currentSRSState: SRSState = {
        easeFactor: existing.ease_factor || 2.50,
        intervalDays: existing.interval_days || 1,
        consecutiveCorrect: existing.consecutive_correct || 0,
        nextReviewDate: existing.next_review_date ? new Date(existing.next_review_date) : new Date(),
        lastReviewDate: existing.last_review_date ? new Date(existing.last_review_date) : new Date(),
        masteryLevel: existing.mastery_level || 'new',
      };

      const srsUpdate = calculateNextReview(currentSRSState, performance);

      const updateData = {
        correct_count: existing.correct_count + (isCorrect ? 1 : 0),
        incorrect_count: existing.incorrect_count + (isCorrect ? 0 : 1),
        mastery_level: srsUpdate.masteryLevel,
        last_attempted: new Date().toISOString(),
        next_review_date: srsUpdate.nextReviewDate.toISOString(),
        ease_factor: srsUpdate.easeFactor,
        interval_days: srsUpdate.intervalDays,
        consecutive_correct: srsUpdate.consecutiveCorrect,
        last_review_date: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('flashcard_progress')
        .update(updateData)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      const initialSRS = createInitialSRSState();

      const insertData = {
        user_id: userId,
        flashcard_id: flashcardId,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
        mastery_level: 'new',
        last_attempted: new Date().toISOString(),
        next_review_date: initialSRS.nextReviewDate.toISOString(),
        ease_factor: initialSRS.easeFactor,
        interval_days: initialSRS.intervalDays,
        consecutive_correct: initialSRS.consecutiveCorrect,
        last_review_date: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('flashcard_progress')
        .insert(insertData);

      if (error) throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error updating flashcard progress:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}

// ============================================================================
// SRS STATISTICS
// ============================================================================

/**
 * NEW: Get comprehensive SRS statistics for dashboard
 * CALCULATES stats directly from user_progress and flashcard_progress tables
 */
export function useSRSStats(userId: string) {
  const [stats, setStats] = useState<SRSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        console.log('[useSRSStats] Calculating SRS stats for user:', userId);
        const now = new Date();
        const oneDayFromNow = new Date(now.getTime() + (24 * 60 * 60 * 1000));

        // Fetch all progress data in parallel
        const [
          { data: questionProgress, error: qError },
          { data: flashcardProgress, error: fError }
        ] = await Promise.all([
          supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', userId),
          supabase
            .from('flashcard_progress')
            .select('*')
            .eq('user_id', userId)
        ]);

        if (qError) throw qError;
        if (fError) throw fError;

        console.log('[useSRSStats] Found:', {
          questionProgress: questionProgress?.length || 0,
          flashcardProgress: flashcardProgress?.length || 0
        });

        // Calculate question stats
        let questions_due = 0;
        let questions_due_soon = 0;
        let new_questions = 0;
        let learning_questions = 0;
        let reviewing_questions = 0;
        let mastered_questions = 0;
        let total_question_ease = 0;
        let total_question_interval = 0;
        let question_ease_count = 0;
        let question_interval_count = 0;

        (questionProgress || []).forEach(p => {
          // Count by mastery level
          if (p.mastery_level === 'new') new_questions++;
          else if (p.mastery_level === 'learning') learning_questions++;
          else if (p.mastery_level === 'reviewing') reviewing_questions++;
          else if (p.mastery_level === 'mastered') mastered_questions++;

          // Calculate ease and interval averages
          if (p.ease_factor) {
            total_question_ease += p.ease_factor;
            question_ease_count++;
          }
          if (p.interval_days) {
            total_question_interval += p.interval_days;
            question_interval_count++;
          }

          // Count due items (same logic as useDueQuestions)
          let isDue = false;
          let isDueSoon = false;

          // Check if due now
          if (p.next_review_date) {
            const reviewDate = new Date(p.next_review_date);
            if (reviewDate <= now) {
              isDue = true;
            } else if (reviewDate <= oneDayFromNow) {
              isDueSoon = true;
            }
          }

          // Or needs practice (more incorrect than correct)
          if (p.incorrect_count > p.correct_count) {
            isDue = true;
          }

          // Or not attempted in 3+ days
          if (p.last_attempted) {
            const lastAttempt = new Date(p.last_attempted);
            const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
            const totalAttempts = (p.correct_count || 0) + (p.incorrect_count || 0);
            if (lastAttempt < threeDaysAgo && totalAttempts > 0) {
              isDue = true;
            }
          }

          if (isDue) questions_due++;
          if (isDueSoon) questions_due_soon++;
        });

        // Calculate flashcard stats
        let flashcards_due = 0;
        let flashcards_due_soon = 0;
        let new_flashcards = 0;
        let learning_flashcards = 0;
        let reviewing_flashcards = 0;
        let mastered_flashcards = 0;
        let total_flashcard_ease = 0;
        let total_flashcard_interval = 0;
        let flashcard_ease_count = 0;
        let flashcard_interval_count = 0;

        (flashcardProgress || []).forEach(p => {
          // Count by mastery level
          if (p.mastery_level === 'new') new_flashcards++;
          else if (p.mastery_level === 'learning') learning_flashcards++;
          else if (p.mastery_level === 'reviewing') reviewing_flashcards++;
          else if (p.mastery_level === 'mastered') mastered_flashcards++;

          // Calculate ease and interval averages
          if (p.ease_factor) {
            total_flashcard_ease += p.ease_factor;
            flashcard_ease_count++;
          }
          if (p.interval_days) {
            total_flashcard_interval += p.interval_days;
            flashcard_interval_count++;
          }

          // Count due items
          if (p.next_review_date) {
            const reviewDate = new Date(p.next_review_date);
            if (reviewDate <= now) {
              flashcards_due++;
            } else if (reviewDate <= oneDayFromNow) {
              flashcards_due_soon++;
            }
          }
        });

        const calculatedStats: SRSStats = {
          questions_due,
          questions_due_soon,
          new_questions,
          learning_questions,
          reviewing_questions,
          mastered_questions,
          flashcards_due,
          flashcards_due_soon,
          new_flashcards,
          learning_flashcards,
          reviewing_flashcards,
          mastered_flashcards,
          avg_question_ease: question_ease_count > 0 ? total_question_ease / question_ease_count : 2.50,
          avg_flashcard_ease: flashcard_ease_count > 0 ? total_flashcard_ease / flashcard_ease_count : 2.50,
          avg_question_interval: question_interval_count > 0 ? total_question_interval / question_interval_count : 1,
          avg_flashcard_interval: flashcard_interval_count > 0 ? total_flashcard_interval / flashcard_interval_count : 1,
        };

        console.log('[useSRSStats] Calculated stats:', calculatedStats);
        setStats(calculatedStats);
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to calculate SRS stats';
        setError(errorMessage);
        console.error('[useSRSStats] Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}

// ============================================================================
// CBA CONTENT HOOKS (Study Guide)
// ============================================================================

export function useCBAContent() {
  const [content, setContent] = useState<CBAContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCBAContent() {
      try {
        const { data, error } = await supabase
          .from('cba_content')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        setContent(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching CBA content:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCBAContent();
  }, []);

  return { content, loading, error };
}

export function useCBAArticle(articleNumber: number) {
  const [article, setArticle] = useState<CBAContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('cba_content')
          .select('*')
          .eq('article_number', articleNumber)
          .order('order_index', { ascending: true });

        if (error) throw error;
        setArticle(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching CBA article:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [articleNumber]);

  return { article, loading, error };
}

export async function searchCBAContent(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('cba_content')
      .select('*')
      .or(`article_title.ilike.%${searchTerm}%,section_title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('order_index', { ascending: true })
      .limit(50);

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: any) {
    console.error('Error searching CBA content:', err);
    return { data: [], error: err.message };
  }
}

// ============================================================================
// TEST RESULTS HOOKS (My Tests)
// ============================================================================

export function useTestResults(userId: string) {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchTests() {
      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTests(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching test results:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTests();
  }, [userId]);

  return { tests, loading, error };
}

export async function saveTestResult(testData: Omit<TestResult, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .insert(testData)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('Error saving test result:', err);
    return { data: null, error: err.message };
  }
}

export async function deleteTestResult(testId: string) {
  try {
    const { error } = await supabase
      .from('test_results')
      .delete()
      .eq('id', testId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error deleting test result:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// NOTES HOOKS
// ============================================================================

export function useNotes(userId: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchNotes() {
      try {
        const { data, error } = await supabase
          .from('user_notes')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setNotes(data || []);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching notes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [userId]);

  return { notes, loading, error, refetch: async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }};
}

export async function createNote(noteData: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('user_notes')
      .insert({
        ...noteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('Error creating note:', err);
    return { data: null, error: err.message };
  }
}

export async function updateNote(noteId: string, updates: Partial<Note>) {
  try {
    const { data, error } = await supabase
      .from('user_notes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', noteId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.error('Error updating note:', err);
    return { data: null, error: err.message };
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { error } = await supabase
      .from('user_notes')
      .delete()
      .eq('id', noteId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    console.error('Error deleting note:', err);
    return { success: false, error: err.message };
  }
}

// ============================================================================
// AI TEST GENERATOR
// ============================================================================

export async function generateAITest(params: {
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  numQuestions: number;
  userId: string;
}) {
  try {
    let query = supabase
      .from('questions')
      .select('*')
      .limit(params.numQuestions);

    if (params.difficulty !== 'Mixed') {
      query = query.eq('difficulty', params.difficulty);
    }

    if (params.topic !== 'All Topics') {
      query = query.eq('category', params.topic);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data: data || [], error: null };
  } catch (err: any) {
    console.error('Error generating AI test:', err);
    return { data: [], error: err.message };
  }
}
