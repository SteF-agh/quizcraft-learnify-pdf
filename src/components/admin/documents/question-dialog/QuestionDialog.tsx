import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Question } from "../types";

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
  console.log("QuestionDialog - Question Text:", currentQuestion.question_text);
  console.log("QuestionDialog - Answers:", currentQuestion.answers);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Frage überprüfen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Frage:</h3>
            <p className="text-lg">{currentQuestion.question_text}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Antworten:</h3>
            <ul className="space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <li
                  key={index}
                  className={`p-2 rounded ${
                    answer.isCorrect 
                      ? "bg-green-100 text-green-800 border border-green-300" 
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {String.fromCharCode(65 + index)}) {answer.text}
                  {answer.isCorrect && (
                    <span className="ml-2 text-sm text-green-600">(Richtige Antwort)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold mb-2">Details:</h3>
            <p><span className="font-medium">Typ:</span> {currentQuestion.type}</p>
            <p><span className="font-medium">Schwierigkeit:</span> {currentQuestion.difficulty}</p>
            <p><span className="font-medium">Kapitel:</span> {currentQuestion.chapter}</p>
            {currentQuestion.feedback && (
              <div>
                <span className="font-medium">Feedback:</span>
                <p className="mt-1 text-gray-600">{currentQuestion.feedback}</p>
              </div>
            )}
          </div>
        </div>
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