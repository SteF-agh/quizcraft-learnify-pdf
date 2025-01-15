import { Question, BaseQuestionProps } from "../types/QuestionTypes";
import { MultipleChoiceQuestion } from "../question-types/MultipleChoiceQuestion";
import { TrueFalseQuestion } from "../question-types/TrueFalseQuestion";
import { OpenQuestion } from "../question-types/OpenQuestion";

interface QuestionContentProps extends BaseQuestionProps {
  question: Question;
  openAnswer: string;
  setOpenAnswer: (value: string) => void;
}

export const QuestionContent = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  openAnswer,
  setOpenAnswer
}: QuestionContentProps) => {
  switch (question.type) {
    case 'multiple-choice':
    case 'matching':
    case 'fill-in':
      return (
        <MultipleChoiceQuestion
          options={question.options || []}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );

    case 'true-false':
      return (
        <TrueFalseQuestion
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
        />
      );

    case 'open':
      return (
        <OpenQuestion
          value={openAnswer}
          onChange={setOpenAnswer}
        />
      );

    default:
      return null;
  }
};