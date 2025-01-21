import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Question } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentQuestion: Question | null;
  onAccept: () => void;
  onRegenerate: () => void;
}

export const QuestionDialog = ({
  open,
  onOpenChange,
  currentQuestion,
  onAccept,
  onRegenerate,
}: QuestionDialogProps) => {
  if (!currentQuestion) {
    console.error("No question provided to QuestionDialog");
    return null;
  }

  console.log("QuestionDialog - Current Question:", currentQuestion);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'single-choice':
        return 'Single Choice';
      case 'true-false':
        return 'Wahr/Falsch';
      default:
        return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Fragen für Kapitel: {currentQuestion.chapter}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {getTypeLabel(currentQuestion.type)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Punkte: {currentQuestion.points}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Frage:</h3>
                  <p className="text-gray-800">{currentQuestion.questionText}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Antworten:</h3>
                  <ul className="space-y-2">
                    {currentQuestion.answers.map((answer, index) => (
                      <li
                        key={index}
                        className={`p-3 rounded-lg ${
                          answer.isCorrect 
                            ? "bg-green-50 border border-green-200" 
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)})
                          </span>
                          <span>{answer.text}</span>
                          {answer.isCorrect && (
                            <span className="ml-auto text-sm text-green-600">
                              ✓ Richtige Antwort
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {currentQuestion.feedback && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-1">Feedback:</h3>
                    <p className="text-blue-900">{currentQuestion.feedback}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={() => {
              console.log("Regenerate button clicked");
              onRegenerate();
            }}
          >
            Neue Frage generieren
          </Button>
          <Button 
            onClick={() => {
              console.log("Accept button clicked");
              onAccept();
            }}
          >
            Frage akzeptieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};