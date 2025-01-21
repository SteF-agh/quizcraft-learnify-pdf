import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGenerator } from "./hooks/useQuestionGenerator";
import { Document } from "./types";
import { GenerationProgress } from "./generation-progress/GenerationProgress";
import { QuestionsDisplay } from "./questions-display/QuestionsDisplay";
import { TableFilters } from "./table-filters/TableFilters";
import { DocumentsTable } from "./table/DocumentsTable";
import { QuestionUpload } from "./question-upload/QuestionUpload";

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  console.log('DocumentTable rendered with documents:', documents);

  const {
    state: {
      isGenerating,
      currentQuestions,
      showQuestionDialog,
      generationProgress
    },
    generateQuestions,
    saveQuestions,
    setState
  } = useQuestionGenerator(onRefetch);

  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    console.log('Attempting to toggle document visibility:', documentId);
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

  const handleViewQuestions = async (documentId: string) => {
    console.log('Viewing questions for document:', documentId);
    setSelectedDocumentId(documentId);
    try {
      const { data: existingQuestions, error: fetchError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", documentId);

      if (fetchError) throw fetchError;

      console.log('Fetched questions:', existingQuestions);

      if (!existingQuestions || existingQuestions.length === 0) {
        toast.info("Keine Fragen für dieses Dokument gefunden");
        setQuestions([]);
        return;
      }

      setQuestions(existingQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Fehler beim Laden der Fragen");
      setQuestions([]);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === "all") return matchesSearch;
    
    const hasQuestions = questions.some(q => q.document_id === doc.id);
    return matchesSearch && (
      (filterStatus === "with-questions" && hasQuestions) ||
      (filterStatus === "without-questions" && !hasQuestions)
    );
  });

  console.log('Current state:', {
    selectedDocumentId,
    questionsCount: questions.length,
    isGenerating,
    showQuestionDialog,
    currentQuestionsCount: currentQuestions.length
  });

  return (
    <>
      <GenerationProgress 
        isGenerating={isGenerating} 
        generationProgress={generationProgress} 
      />

      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      <DocumentsTable
        documents={filteredDocuments}
        onTogglePublic={handleTogglePublic}
        onGenerateQuiz={generateQuestions}
        onViewQuestions={handleViewQuestions}
        isGenerating={isGenerating}
      />

      {selectedDocumentId && (
        <QuestionUpload 
          documentId={selectedDocumentId} 
          onUploadSuccess={() => handleViewQuestions(selectedDocumentId)} 
        />
      )}

      {questions.length > 0 && (
        <QuestionsDisplay 
          questions={questions} 
          documentId={selectedDocumentId} 
        />
      )}

      {showQuestionDialog && currentQuestions.length > 0 && (
        <QuestionDialog
          open={showQuestionDialog}
          onOpenChange={(open) => setState(prev => ({ ...prev, showQuestionDialog: open }))}
          questions={currentQuestions}
          onSave={saveQuestions}
        />
      )}
    </>
  );
};