export interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

export interface DatabaseQuestion {
  id: string;
  document_id: string;
  chapter: string;
  question_text: string;
  type: 'multiple-choice' | 'true-false';
  answers: {
    options?: string[];
    correctAnswer: string | number | boolean;
  };
}

export interface BaseQuestionProps {
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}