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
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}