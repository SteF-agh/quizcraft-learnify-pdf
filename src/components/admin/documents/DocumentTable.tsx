import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentRow } from "./document-row/DocumentRow";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { Document } from "./types";

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const {
    isGenerating,
    currentQuestion,
    showQuestionDialog,
    setShowQuestionDialog,
    handleGenerateQuiz,
    handleAcceptQuestion,
    handleRegenerateQuestion,
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
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Öffentlich
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    document={doc}
                    onTogglePublic={handleTogglePublic}
                    onGenerateQuiz={handleGenerateQuiz}
                    isGenerating={isGenerating}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <QuestionDialog
        open={showQuestionDialog}
        onOpenChange={setShowQuestionDialog}
        currentQuestion={currentQuestion}
        onAccept={handleAcceptQuestion}
        onRegenerate={handleRegenerateQuestion}
      />
    </>
  );
};