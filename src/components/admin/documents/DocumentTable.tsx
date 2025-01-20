import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentRow } from "./document-row/DocumentRow";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { Document } from "./types";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const {
    isGenerating,
    currentQuestion,
    showQuestionDialog,
    setShowQuestionDialog,
    handleGenerateQuiz,
    handleAcceptQuestion,
    handleRegenerateQuestion,
    generationProgress
  } = useQuestionGeneration(onRefetch);

  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("documents")
        .update({ is_public: !currentState })
        .eq("id", documentId);

      if (error) throw error;

      toast.success(`Dokument ist jetzt ${!currentState ? "öffentlich" : "privat"}`);
      onRefetch();
    } catch (error) {
      console.error("Error toggling document visibility:", error);
      toast.error("Fehler beim Ändern der Sichtbarkeit");
    }
  };

  const handleQuizGeneration = async (documentId: string) => {
    toast.info("Starte Quiz-Generierung...");
    try {
      await handleGenerateQuiz(documentId);
    } catch (error) {
      console.error("Error in quiz generation:", error);
      toast.error("Fehler bei der Quiz-Generierung. Bitte versuchen Sie es erneut.");
    }
  };

  const handleViewQuestions = async (documentId: string) => {
    setSelectedDocumentId(documentId);
    try {
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", documentId);

      if (error) throw error;

      setQuestions(data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Fehler beim Laden der Fragen");
    }
  };

  return (
    <>
      {isGenerating && (
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Generiere Quizfragen...</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Bitte haben Sie etwas Geduld, während die KI Quizfragen für das ausgewählte Skript erstellt.
            Dies kann einige Minuten dauern.
          </p>
          <Progress value={generationProgress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {generationProgress}% abgeschlossen
          </p>
        </Card>
      )}

      <div className="overflow-x-auto">
        <div className="w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Größe</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead>Öffentlich</TableHead>
                  <TableHead>Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    onTogglePublic={handleTogglePublic}
                    onGenerateQuiz={handleQuizGeneration}
                    onViewQuestions={() => handleViewQuestions(doc.id)}
                    isGenerating={isGenerating}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {selectedDocumentId && questions.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="text-xl font-semibold mb-4">Generierte Fragen</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Frage</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Schwierigkeit</TableHead>
                  <TableHead>Punkte</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>{question.question_text}</TableCell>
                    <TableCell>{question.type}</TableCell>
                    <TableCell>{question.difficulty}</TableCell>
                    <TableCell>{question.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {showQuestionDialog && currentQuestion && (
        <QuestionDialog
          open={showQuestionDialog}
          onOpenChange={setShowQuestionDialog}
          currentQuestion={currentQuestion}
          onAccept={handleAcceptQuestion}
          onRegenerate={handleRegenerateQuestion}
        />
      )}
    </>
  );
};