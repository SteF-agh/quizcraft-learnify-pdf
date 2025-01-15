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
            className={`w-full text-left justify-start h-auto py-4 px-6 mb-3 transition-all duration-300 ${
              selectedAnswer === index 
                ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
                : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </Button>
        ));

      case 'true-false':
        return (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedAnswer === 0 ? "secondary" : "outline"}
              className={`h-auto py-4 transition-all duration-300 ${
                selectedAnswer === 0 
                  ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
                  : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
              }`}
              onClick={() => onAnswerSelect(0)}
            >
              Wahr
            </Button>
            <Button
              variant={selectedAnswer === 1 ? "secondary" : "outline"}
              className={`h-auto py-4 transition-all duration-300 ${
                selectedAnswer === 1 
                  ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
                  : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
              }`}
              onClick={() => onAnswerSelect(1)}
            >
              Falsch
            </Button>
          </div>
        );

      case 'open':
        return (
          <Input
            value={openAnswer}
            onChange={(e) => setOpenAnswer(e.target.value)}
            placeholder="Deine Antwort..."
            className="w-full p-4 text-lg border-2 focus:border-secondary"
          />
        );

      case 'matching':
        return question.options?.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "secondary" : "outline"}
            className={`w-full text-left justify-start h-auto py-4 px-6 mb-3 transition-all duration-300 ${
              selectedAnswer === index 
                ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
                : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </Button>
        ));

      case 'fill-in':
        return question.options?.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "secondary" : "outline"}
            className={`w-full text-left justify-start h-auto py-4 px-6 mb-3 transition-all duration-300 ${
              selectedAnswer === index 
                ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
                : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
            }`}
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