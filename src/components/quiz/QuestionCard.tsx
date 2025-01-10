import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
  question: {
    text: string;
    options: string[];
  };
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
  return (
    <Card className="border-primary/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-secondary text-2xl">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index ? "secondary" : "outline"}
            className="w-full text-left justify-start h-auto py-4 hover:bg-accent hover:text-accent-foreground"
            onClick={() => onAnswerSelect(index)}
          >
            {option}
          </Button>
        ))}
        
        {selectedAnswer !== null && (
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