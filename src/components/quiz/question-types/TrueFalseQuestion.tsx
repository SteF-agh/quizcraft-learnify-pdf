import { Button } from "@/components/ui/button";

interface TrueFalseQuestionProps {
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}

export const TrueFalseQuestion = ({
  selectedAnswer,
  onAnswerSelect,
}: TrueFalseQuestionProps) => {
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
};