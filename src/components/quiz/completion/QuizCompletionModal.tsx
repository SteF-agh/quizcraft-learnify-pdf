import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuizCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
  correctAnswers: number;
  totalQuestions: number;
  onContinue: () => void;
}

export const QuizCompletionModal = ({
  isOpen,
  onClose,
  points,
  correctAnswers,
  totalQuestions,
  onContinue,
}: QuizCompletionModalProps) => {
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Quiz abgeschlossen!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">
              {points} Punkte
            </p>
            <p className="text-muted-foreground">
              {correctAnswers} von {totalQuestions} Fragen richtig beantwortet
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
            >
              Weiter spielen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => navigate("/leaderboard")}
              variant="outline"
              className="w-full"
            >
              Zum Leaderboard
              <Home className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};