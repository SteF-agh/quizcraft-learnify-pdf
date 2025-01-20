import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentRow } from "./document-row/DocumentRow";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { Document } from "./types";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

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