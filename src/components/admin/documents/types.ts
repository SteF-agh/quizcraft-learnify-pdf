export interface Question {
  id?: string;
  documentId?: string;
  courseName: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  questionText: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  feedback: string;
  learningObjectiveId?: string;
  metadata?: Record<string, unknown>;
}

export interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}