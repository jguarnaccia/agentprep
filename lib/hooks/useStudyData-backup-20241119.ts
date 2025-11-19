import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

// ... rest of original file
