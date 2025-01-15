import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { MultipleChoiceQuestion } from "./question-types/MultipleChoiceQuestion";
import { TrueFalseQuestion } from "./question-types/TrueFalseQuestion";
import { OpenQuestion } from "./question-types/OpenQuestion";

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  isLastQuestion,
}: QuestionCardProps) => {
  const [openAnswer, setOpenAnswer] = useState("");

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
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

      case 'matching':
      case 'fill-in':
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={onAnswerSelect}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestionContent()}
        
        {(selectedAnswer !== null || question.type === 'open') && (
          <Button
            onClick={onNextQuestion}
            className="w-full mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold py-6 text-lg transition-all duration-300 hover:-translate-y-1"
            disabled={isLastQuestion}
          >
            Nächste Frage
          </Button>
        )}
      </CardContent>
    </Card>
  );
};