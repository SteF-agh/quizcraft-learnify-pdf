export interface Question {
  type: 'multiple-choice' | 'single-choice' | 'true-false';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

export interface DatabaseQuestion {
  id: string;
  document_id: string | null;
  chapter: string;
  question_text: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false';
  answers: {
    options?: string[];
    correctAnswer: string | number | boolean;
  } | Json;
  course_name: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  points: number;
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  created_by?: string;
}

export interface BaseQuestionProps {
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}