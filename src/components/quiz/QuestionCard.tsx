import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerSelect = (index: number) => {
    onAnswerSelect(index);
    
    // Überprüfe, ob die Antwort falsch ist
    let isCorrect = false;
    if (question.type === 'multiple-choice' || question.type === 'matching' || question.type === 'fill-in') {
      isCorrect = index === question.correctAnswer;
    } else if (question.type === 'true-false') {
      isCorrect = index === (question.correctAnswer ? 0 : 1);
    }
    
    setShowCorrectAnswer(!isCorrect);
  };

  const getCorrectAnswerText = () => {
    switch (question.type) {
      case 'multiple-choice':
      case 'matching':
      case 'fill-in':
        return question.options?.[question.correctAnswer as number];
      case 'true-false':
        return question.correctAnswer ? "Wahr" : "Falsch";
      case 'open':
        return question.correctAnswer as string;
      default:
        return "";
    }
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <MultipleChoiceQuestion
            options={question.options || []}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
          />
        );

      case 'true-false':
        return (
          <TrueFalseQuestion
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
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
            onAnswerSelect={handleAnswerSelect}
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
        
        {showCorrectAnswer && (
          <Alert className="mt-4 border-2 border-accent bg-white shadow-md">
            <AlertDescription className="text-foreground font-medium">
              Die richtige Antwort ist: <span className="font-bold text-accent">{getCorrectAnswerText()}</span>
            </AlertDescription>
          </Alert>
        )}
        
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