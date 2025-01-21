import { Answer } from "../../types";

interface QuestionAnswersProps {
  answers: Answer[];
}

export const QuestionAnswers = ({ answers }: QuestionAnswersProps) => {
  return (
    <div className="space-y-1">
      {answers.map((answer, index) => (
        <div 
          key={index} 
          className={`text-sm ${answer.isCorrect ? 'text-green-600 font-medium' : 'text-gray-500'}`}
        >
          {answer.text} {answer.isCorrect && '✓'}
        </div>
      ))}
    </div>
  );
};