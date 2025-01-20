import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentRow } from "./document-row/DocumentRow";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { Document } from "./types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GenerationProgress } from "./generation-progress/GenerationProgress";
import { QuestionsDisplay } from "./questions-display/QuestionsDisplay";

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
      console.log('Fetching questions for document:', documentId);
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", documentId);

      if (error) {
        console.error("Error fetching questions:", error);
        throw error;
      }

      console.log('Fetched questions:', data);
      setQuestions(data || []);
      
      if (!data || data.length === 0) {
        toast.info("Keine Fragen für dieses Dokument gefunden");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Fehler beim Laden der Fragen");
    }
  };

  return (
    <>
      <GenerationProgress 
        isGenerating={isGenerating} 
        generationProgress={generationProgress} 
      />

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
                    onViewQuestions={handleViewQuestions}
                    isGenerating={isGenerating}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <QuestionsDisplay 
        questions={questions} 
        documentId={selectedDocumentId} 
      />

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