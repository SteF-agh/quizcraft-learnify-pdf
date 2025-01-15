export interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

export interface BaseQuestionProps {
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}