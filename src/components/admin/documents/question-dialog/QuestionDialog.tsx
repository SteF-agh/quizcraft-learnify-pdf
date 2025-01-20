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
    console.log("No question provided to QuestionDialog");
    return null;
  }

  console.log("Rendering QuestionDialog with question:", currentQuestion);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Frage überprüfen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Frage:</h3>
            <p>{currentQuestion.questionText}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Antworten:</h3>
            <ul className="space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <li
                  key={index}
                  className={`${answer.isCorrect ? "text-green-600 font-semibold" : ""}`}
                >
                  {String.fromCharCode(65 + index)}) {answer.text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Details:</h3>
            <p>Typ: {currentQuestion.type}</p>
            <p>Schwierigkeit: {currentQuestion.difficulty}</p>
            <p>Kapitel: {currentQuestion.chapter}</p>
            <p>Feedback: {currentQuestion.feedback}</p>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onRegenerate}>
            Neue Frage generieren
          </Button>
          <Button onClick={onAccept}>
            Frage akzeptieren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};