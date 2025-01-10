import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
}

export const QuizHeader = ({ currentQuestion, totalQuestions, progress }: QuizHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            ← Zurück zur Hauptseite
          </Button>
          <h1 className="text-3xl font-bold text-secondary">LeeonQuiz</h1>
        </div>
        <Badge variant="default" className="bg-accent">
          Frage {currentQuestion + 1} von {totalQuestions}
        </Badge>
      </div>
      <Progress value={progress} className="h-2 bg-secondary/20" />
    </div>
  );
};