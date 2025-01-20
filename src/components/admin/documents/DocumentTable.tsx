import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGeneration } from "./hooks/useQuestionGeneration";
import { Document } from "./types";
import { GenerationProgress } from "./generation-progress/GenerationProgress";
import { QuestionsDisplay } from "./questions-display/QuestionsDisplay";
import { TableFilters } from "./table-filters/TableFilters";
import { DocumentsTable } from "./table/DocumentsTable";

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

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

  const handleViewQuestions = async (documentId: string) => {
    setSelectedDocumentId(documentId);
    try {
      console.log('Fetching questions for document:', documentId);
      
      const { data: document, error: documentError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (documentError) {
        console.error("Error fetching document:", documentError);
        throw documentError;
      }

      console.log('Found document:', document);

      const { data: existingQuestions, error: fetchError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", documentId);

      if (fetchError) {
        console.error("Error fetching questions:", fetchError);
        throw fetchError;
      }

      console.log('Raw questions data:', existingQuestions);

      if (!existingQuestions || existingQuestions.length === 0) {
        console.log('No questions found for document:', documentId);
        toast.info("Keine Fragen für dieses Dokument gefunden");
        setQuestions([]);
        return;
      }

      const formattedQuestions = existingQuestions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        type: q.type,
        difficulty: q.difficulty,
        points: q.points,
        document_id: q.document_id,
        answers: q.answers,
        course_name: q.course_name,
        chapter: q.chapter,
        topic: q.topic
      }));

      console.log('Formatted questions:', formattedQuestions);
      setQuestions(formattedQuestions);
      
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
        onGenerateQuiz={handleGenerateQuiz}
        onViewQuestions={handleViewQuestions}
        isGenerating={isGenerating}
      />

      {questions.length > 0 && (
        <QuestionsDisplay 
          questions={questions} 
          documentId={selectedDocumentId} 
        />
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