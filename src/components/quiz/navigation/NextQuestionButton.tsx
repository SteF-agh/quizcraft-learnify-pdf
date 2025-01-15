import { Button } from "@/components/ui/button";

interface NextQuestionButtonProps {
  show: boolean;
  onClick: () => void;
  isLastQuestion: boolean;
}

export const NextQuestionButton = ({ show, onClick, isLastQuestion }: NextQuestionButtonProps) => {
  if (!show) return null;

  return (
    <Button
      onClick={onClick}
      className="w-full mt-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold py-6 text-lg transition-all duration-300 hover:-translate-y-1"
      disabled={isLastQuestion}
    >
      Nächste Frage
    </Button>
  );
};