
import { QuestionDialog } from "./question-dialog/QuestionDialog";
import { useQuestionGenerator } from "./hooks/useQuestionGenerator";
import { Document } from "./types";
import { GenerationProgress } from "./generation-progress/GenerationProgress";
import { TableFilters } from "./table-filters/TableFilters";
import { DocumentsTable } from "./table/DocumentsTable";
import { QuestionUpload } from "./question-upload/QuestionUpload";
import { useDocumentVisibility } from "./hooks/useDocumentVisibility";
import { useQuestionView } from "./hooks/useQuestionView";
import { useDocumentFilter } from "./hooks/useDocumentFilter";

interface DocumentTableProps {
  documents: Document[];
  onRefetch: () => void;
}

export const DocumentTable = ({ documents, onRefetch }: DocumentTableProps) => {
  const { handleTogglePublic } = useDocumentVisibility(onRefetch);
  const { selectedDocumentId, questions, handleViewQuestions } = useQuestionView();
  const { 
    searchQuery, 
    setSearchQuery, 
    filterStatus, 
    setFilterStatus,
    filteredDocuments 
  } = useDocumentFilter(documents);

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

  console.log('DocumentTable rendered with documents:', documents);
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
