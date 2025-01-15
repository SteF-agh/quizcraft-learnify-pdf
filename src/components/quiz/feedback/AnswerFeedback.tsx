import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnswerFeedbackProps {
  showCorrectAnswer: boolean;
  correctAnswer: string;
}

export const AnswerFeedback = ({ showCorrectAnswer, correctAnswer }: AnswerFeedbackProps) => {
  if (!showCorrectAnswer) return null;

  return (
    <Alert className="mt-4 border-2 border-accent bg-white shadow-md">
      <AlertDescription className="text-foreground font-medium">
        Die richtige Antwort ist: <span className="font-bold text-accent">{correctAnswer}</span>
      </AlertDescription>
    </Alert>
  );
};