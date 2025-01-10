import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
        return question.options?.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "secondary" : "outline"}
            className="w-full text-left justify-start h-auto py-4 hover:bg-accent hover:text-accent-foreground"
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </Button>
        ));

      case 'true-false':
        return (
          <>
            <Button
              variant={selectedAnswer === 0 ? "secondary" : "outline"}
              className="w-full text-left justify-start h-auto py-4 mb-2"
              onClick={() => onAnswerSelect(0)}
            >
              Wahr
            </Button>
            <Button
              variant={selectedAnswer === 1 ? "secondary" : "outline"}
              className="w-full text-left justify-start h-auto py-4"
              onClick={() => onAnswerSelect(1)}
            >
              Falsch
            </Button>
          </>
        );

      case 'open':
        return (
          <Input
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Deine Antwort..."
            className="w-full p-4"
          />
        );

      case 'matching':
      case 'fill-in':
        return question.options?.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "secondary" : "outline"}
            className="w-full text-left justify-start h-auto py-4"
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </Button>
        ));

      default:
        return null;
    }
  };

  return (
    <Card className="border-primary/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-secondary text-2xl">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderQuestionContent()}
        
        {(selectedAnswer !== null || question.type === 'open') && (
          <Button
            onClick={onNextQuestion}
            className="w-full mt-6 bg-accent hover:bg-accent/80"
            disabled={isLastQuestion}
          >
            Nächste Frage
          </Button>
        )}
      </CardContent>
    </Card>
  );
};