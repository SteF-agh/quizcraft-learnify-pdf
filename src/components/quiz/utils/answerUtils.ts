import { Question } from "../types/QuestionTypes";

export const checkAnswer = (
  question: Question,
  selectedIndex: number
): boolean => {
  switch (question.type) {
    case 'multiple-choice':
    case 'matching':
    case 'fill-in':
      return selectedIndex === question.correctAnswer;
    case 'true-false':
      return selectedIndex === (question.correctAnswer ? 0 : 1);
    default:
      return false;
  }
};

export const getCorrectAnswerText = (question: Question): string => {
  switch (question.type) {
    case 'multiple-choice':
    case 'matching':
    case 'fill-in':
      return question.options?.[question.correctAnswer as number] || '';
    case 'true-false':
      return question.correctAnswer ? "Wahr" : "Falsch";
    case 'open':
      return question.correctAnswer as string;
    default:
      return "";
  }
};