export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;
  batch: number;
  question_type?: 'multiple_choice' | 'scenario';
}

export interface QuestionAttempt {
  id: number;
  question_id: number;
  session_id: string;
  is_correct: boolean;
  created_at: string;
}

export interface ProgressStats {
  totalAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  successRate: number;
}
