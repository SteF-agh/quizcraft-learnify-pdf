import { Button } from "@/components/ui/button";

interface MultipleChoiceQuestionProps {
  options: string[];
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}

export const MultipleChoiceQuestion = ({
  options,
  selectedAnswer,
  onAnswerSelect,
}: MultipleChoiceQuestionProps) => {
  return (
    <div className="space-y-3">
      {options?.map((option, index) => (
        <Button
          key={index}
          variant={selectedAnswer === index ? "secondary" : "outline"}
          className={`w-full text-left justify-start h-auto py-4 px-6 transition-all duration-300 ${
            selectedAnswer === index 
              ? 'bg-gradient-to-r from-secondary to-secondary/80 text-white transform scale-102'
              : 'hover:bg-accent hover:text-accent-foreground hover:-translate-y-1'
          }`}
          onClick={() => onAnswerSelect(index)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};