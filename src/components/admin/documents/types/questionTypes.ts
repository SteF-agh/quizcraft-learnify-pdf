export interface GeneratedQuestion {
  id?: string;
  document_id: string;
  course_name: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  question_text: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  answers: Answer[];
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, any>;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface QuestionGenerationState {
  isGenerating: boolean;
  currentQuestions: GeneratedQuestion[];
  showQuestionDialog: boolean;
  generationProgress: number;
  selectedChapter: string | null;
}