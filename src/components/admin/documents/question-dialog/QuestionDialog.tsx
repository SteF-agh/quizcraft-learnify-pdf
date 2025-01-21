import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedQuestion } from "../types/questionTypes";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: GeneratedQuestion[];
  onSave: (questions: GeneratedQuestion[]) => void;
}

export const QuestionDialog = ({
  open,
  onOpenChange,
  questions,
  onSave,
}: QuestionDialogProps) => {
  if (!questions.length) {
    console.error("No questions provided to QuestionDialog");
    return null;
  }

  // Group questions by chapter
  const questionsByChapter = questions.reduce((acc: Record<string, GeneratedQuestion[]>, question) => {
    if (!acc[question.chapter]) {
      acc[question.chapter] = [];
    }
    acc[question.chapter].push(question);
    return acc;
  }, {});

  console.log('Questions grouped by chapter:', questionsByChapter);

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
          <DialogTitle>Generierte Fragen nach Kapiteln</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-8">
            {Object.entries(questionsByChapter).map(([chapter, chapterQuestions]) => (
              <div key={chapter} className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Kapitel: {chapter}</h2>
                <div className="space-y-6">
                  {chapterQuestions.map((question, index) => (
                    <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {getTypeLabel(question.type)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Punkte: {question.points}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Frage:</h3>
                          <p className="text-gray-800">{question.question_text}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Antworten:</h3>
                          <ul className="space-y-2">
                            {question.answers.map((answer, answerIndex) => (
                              <li
                                key={answerIndex}
                                className={`p-3 rounded-lg ${
                                  answer.isCorrect 
                                    ? "bg-green-50 border border-green-200" 
                                    : "bg-gray-50 border border-gray-100"
                                }`}
                              >
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + answerIndex)})
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

                        {question.feedback && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-1">Feedback:</h3>
                            <p className="text-blue-900">{question.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-end mt-6">
          <Button 
            onClick={() => {
              console.log('Saving all questions:', questions);
              onSave(questions);
            }}
          >
            Alle Fragen übernehmen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};