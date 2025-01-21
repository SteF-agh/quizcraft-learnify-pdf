import { Json } from "@/integrations/supabase/types";

export interface BaseQuestionProps {
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}

export interface Question {
  id?: string;
  document_id?: string;
  course_name: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  question_text: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  options?: string[];
  correctAnswer?: string | number | boolean;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, any>;
}

export interface DatabaseQuestion {
  id: string;
  document_id: string;
  course_name: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  question_text: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  answers: {
    [key: string]: string;
  };
  feedback: string | null;
  learning_objective_id: string | null;
  metadata: Json | null;
  created_at: string;
  created_by: string | null;
}