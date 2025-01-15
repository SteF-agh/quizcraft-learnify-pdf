import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
}

export const QuizHeader = ({ currentQuestion, totalQuestions, progress }: QuizHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:-translate-x-1 transition-transform duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück
          </Button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
            LeeonQuiz
          </h1>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-lg bg-gradient-to-r from-secondary to-primary text-white">
          Frage {currentQuestion + 1} von {totalQuestions}
        </Badge>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-secondary/20" 
        indicatorClassName="bg-gradient-to-r from-secondary via-primary to-accent"
      />
    </div>
  );
};