export interface Question {
  id: string;
  courseName: string;
  chapter: string;
  topic: string;
  difficulty: string;
  questionText: string;
  type: string;
  points: number;
  answers: any[];
  feedback?: string;
  learningObjectiveId?: string;
  metadata?: Record<string, any>;
  documentId: string;
}

export interface QuestionGenerationState {
  isGenerating: boolean;
  currentQuestion: Question | null;
  generatedQuestions: Question[];
  showQuestionDialog: boolean;
  generationProgress: number;
}