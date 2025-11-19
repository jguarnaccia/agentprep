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
 * NEW: Get questions due for review using SRS
 */
export function useDueQuestions(userId: string) {
  const [dueQuestions, setDueQuestions] = useState<(Question & { progress: UserProgress })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchDueQuestions() {
      try {
        const now = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            questions:question_id (*)
          `)
          .eq('user_id', userId)
          .lte('next_review_date', now)
          .order('next_review_date', { ascending: true });

        if (error) throw error;
        
        // Transform data to include question details
        const transformed = (data || []).map((item: any) => ({
          ...item.questions,
          progress: {
            id: item.id,
            user_id: item.user_id,
            question_id: item.question_id,
            correct_count: item.correct_count,
            incorrect_count: item.incorrect_count,
            last_attempted: item.last_attempted,
            mastery_level: item.mastery_level,
            next_review_date: item.next_review_date,
            ease_factor: item.ease_factor,
            interval_days: item.interval_days,
            consecutive_correct: item.consecutive_correct,
            last_review_date: item.last_review_date,
          }
        }));

        setDueQuestions(transformed);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching due questions:', err);
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
 */
export function useSRSStats(userId: string) {
  const [stats, setStats] = useState<SRSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('user_srs_stats')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) throw error;
        setStats(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching SRS stats:', err);
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
