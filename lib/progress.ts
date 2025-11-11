import { supabase } from './supabase';
import { QuestionAttempt, ProgressStats } from './types';

// Generate or get session ID
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('agentprep_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('agentprep_session_id', sessionId);
  }
  
  return sessionId;
}

// Record an answer attempt
export async function recordAttempt(
  questionId: number,
  isCorrect: boolean
): Promise<void> {
  const sessionId = getSessionId();
  
  const { error } = await supabase
    .from('question_attempts')
    .insert({
      question_id: questionId,
      session_id: sessionId,
      is_correct: isCorrect,
    });

  if (error) {
    console.error('Error recording attempt:', error);
  }
}

// Get all attempts for current session
export async function getSessionAttempts(): Promise<QuestionAttempt[]> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching attempts:', error);
    return [];
  }

  return data || [];
}

// Get progress statistics
export async function getProgressStats(): Promise<ProgressStats> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('is_correct')
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching progress stats:', error);
    return {
      totalAttempted: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      successRate: 0,
    };
  }

  const attempts = data || [];
  const correctAnswers = attempts.filter(a => a.is_correct).length;
  const incorrectAnswers = attempts.filter(a => !a.is_correct).length;
  
  return {
    totalAttempted: attempts.length,
    correctAnswers,
    incorrectAnswers,
    successRate: attempts.length > 0 
      ? Math.round((correctAnswers / attempts.length) * 100) 
      : 0,
  };
}

// Get questions that were answered incorrectly
export async function getIncorrectQuestionIds(): Promise<number[]> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct')
    .eq('session_id', sessionId)
    .eq('is_correct', false);

  if (error) {
    console.error('Error fetching incorrect questions:', error);
    return [];
  }

  // Get unique question IDs that were answered incorrectly
  const incorrectIds = [...new Set((data || []).map(a => a.question_id))];
  return incorrectIds;
}

// Check if a specific question has been attempted
export async function hasAttemptedQuestion(questionId: number): Promise<boolean> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('id')
    .eq('session_id', sessionId)
    .eq('question_id', questionId)
    .limit(1);

  if (error) {
    console.error('Error checking question attempt:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

// NEW: Get mastery level for a question
export async function getQuestionMastery(questionId: number): Promise<'new' | 'review' | 'reinforce' | 'mastered'> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('is_correct')
    .eq('session_id', sessionId)
    .eq('question_id', questionId)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    return 'new';
  }

  const attempts = data;
  const correctCount = attempts.filter(a => a.is_correct).length;
  const totalAttempts = attempts.length;
  const lastAttempt = attempts[0].is_correct;

  // Never attempted
  if (totalAttempts === 0) return 'new';
  
  // Got it wrong at least once
  if (correctCount < totalAttempts) return 'review';
  
  // Got it right once (need to reinforce)
  if (correctCount === 1) return 'reinforce';
  
  // Got it right 2+ times (mastered)
  if (correctCount >= 2) return 'mastered';
  
  return 'new';
}

// NEW: Get all questions grouped by mastery level
export async function getQuestionsByMastery(questionIds: number[]): Promise<{
  new: number[];
  review: number[];
  reinforce: number[];
  mastered: number[];
}> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct')
    .eq('session_id', sessionId)
    .in('question_id', questionIds);

  if (error) {
    console.error('Error fetching mastery data:', error);
    return { new: questionIds, review: [], reinforce: [], mastered: [] };
  }

  const attemptMap = new Map<number, { correct: number; total: number }>();
  
  // Build attempt map
  (data || []).forEach(attempt => {
    const current = attemptMap.get(attempt.question_id) || { correct: 0, total: 0 };
    attemptMap.set(attempt.question_id, {
      correct: current.correct + (attempt.is_correct ? 1 : 0),
      total: current.total + 1
    });
  });

  const result = {
    new: [] as number[],
    review: [] as number[],
    reinforce: [] as number[],
    mastered: [] as number[]
  };

  questionIds.forEach(qid => {
    const attempts = attemptMap.get(qid);
    
    if (!attempts) {
      result.new.push(qid);
    } else if (attempts.correct < attempts.total) {
      result.review.push(qid);
    } else if (attempts.correct === 1) {
      result.reinforce.push(qid);
    } else if (attempts.correct >= 2) {
      result.mastered.push(qid);
    }
  });

  return result;
}

// NEW: Get recommended study pool
export async function getRecommendedPool(questionIds: number[]): Promise<'new' | 'review' | 'reinforce' | 'mastered'> {
  const pools = await getQuestionsByMastery(questionIds);
  
  // Priority: Review > New > Reinforce > Mastered
  if (pools.review.length > 0) return 'review';
  if (pools.new.length > 0) return 'new';
  if (pools.reinforce.length > 0) return 'reinforce';
  return 'mastered';
}

// NEW: Get performance by category
export async function getCategoryPerformance(categories: string[]): Promise<Map<string, { correct: number; total: number; rate: number }>> {
  const sessionId = getSessionId();
  
  const { data: attempts, error: attemptsError } = await supabase
    .from('question_attempts')
    .select('question_id, is_correct')
    .eq('session_id', sessionId);

  if (attemptsError || !attempts) {
    return new Map();
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, category')
    .in('id', attempts.map(a => a.question_id));

  if (questionsError || !questions) {
    return new Map();
  }

  const categoryMap = new Map<string, { correct: number; total: number; rate: number }>();

  questions.forEach(q => {
    const questionAttempts = attempts.filter(a => a.question_id === q.id);
    const correct = questionAttempts.filter(a => a.is_correct).length;
    const total = questionAttempts.length;
    
    const current = categoryMap.get(q.category) || { correct: 0, total: 0, rate: 0 };
    categoryMap.set(q.category, {
      correct: current.correct + correct,
      total: current.total + total,
      rate: 0 // Will calculate below
    });
  });

  // Calculate rates
  categoryMap.forEach((value, key) => {
    value.rate = value.total > 0 ? Math.round((value.correct / value.total) * 100) : 0;
  });

  return categoryMap;
}
