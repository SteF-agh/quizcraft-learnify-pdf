import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

interface Question {
  id?: string;
  courseName: string;
  chapter: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  questionText: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false';
  points: number;
  answers: Array<{
    text: string;
    isCorrect: boolean;
  }>;
  feedback: string;
  learningObjectiveId?: string;
  metadata?: Record<string, unknown>;
}

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);

  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ is_public: !currentState })
        .eq('id', documentId);

      if (error) throw error;

      toast.success(`Dokument ist jetzt ${!currentState ? 'öffentlich' : 'privat'}`);
      onRefetch();
    } catch (error) {
      console.error('Error toggling document visibility:', error);
      toast.error('Fehler beim Ändern der Sichtbarkeit');
    }
  };

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      setIsGenerating(true);
      const response = await supabase.functions.invoke('generate-questions', {
        body: { documentId },
      });

      if (response.error) throw response.error;

      const questions = response.data.questions;
      setGeneratedQuestions(questions);
      setCurrentQuestion(questions[0]);
      setShowQuestionDialog(true);
      toast.success('Fragen wurden erfolgreich generiert');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Fehler beim Generieren des Quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAcceptQuestion = async () => {
    if (!currentQuestion) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .insert({
          course_name: currentQuestion.courseName,
          chapter: currentQuestion.chapter,
          topic: currentQuestion.topic,
          difficulty: currentQuestion.difficulty,
          question_text: currentQuestion.questionText,
          type: currentQuestion.type,
          points: currentQuestion.points,
          answers: currentQuestion.answers,
          feedback: currentQuestion.feedback,
          learning_objective_id: currentQuestion.learningObjectiveId,
          metadata: currentQuestion.metadata as Json,
          document_id: documents.find(d => d.name === currentQuestion.courseName)?.id
        });

      if (error) throw error;

      // Move to next question
      const currentIndex = generatedQuestions.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentQuestion(generatedQuestions[currentIndex + 1]);
      } else {
        setShowQuestionDialog(false);
        toast.success('Alle Fragen wurden erfolgreich gespeichert');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Fehler beim Speichern der Frage');
    }
  };

  const handleRegenerateQuestion = async () => {
    // For now, just skip to the next question
    // In a future implementation, we could call the API again to generate a new question
    const currentIndex = generatedQuestions.findIndex(q => q.id === currentQuestion?.id);
    if (currentIndex < generatedQuestions.length - 1) {
      setCurrentQuestion(generatedQuestions[currentIndex + 1]);
    } else {
      setShowQuestionDialog(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="w-full">
          <div className="rounded-md border">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Größe</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Datum</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Öffentlich</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">{doc.name}</td>
                    <td className="p-4 align-middle">
                      {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={doc.is_public}
                          onCheckedChange={() => handleTogglePublic(doc.id, doc.is_public || false)}
                        />
                        <Globe className={`h-4 w-4 ${doc.is_public ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </td>
                    <td className="p-4 align-middle space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateQuiz(doc.id)}
                        disabled={isGenerating}
                        className="mr-2"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        {isGenerating ? 'Generiere...' : 'Quiz generieren'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Frage überprüfen</DialogTitle>
          </DialogHeader>
          {currentQuestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Frage:</h3>
                <p>{currentQuestion.questionText}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Antworten:</h3>
                <ul className="space-y-2">
                  {currentQuestion.answers.map((answer, index) => (
                    <li key={index} className={`${answer.isCorrect ? 'text-green-600 font-semibold' : ''}`}>
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
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={handleRegenerateQuestion}>
              Neue Frage generieren
            </Button>
            <Button onClick={handleAcceptQuestion}>
              Frage akzeptieren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};