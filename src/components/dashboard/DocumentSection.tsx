import { DocumentList } from "./DocumentList";
import { UploadSection } from "./UploadSection";
import { LearningModeSelector } from "./LearningModeSelector";

interface DocumentSectionProps {
  documents: any[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
  onDocumentDeleted: () => void;
  onStartLearning: () => void;
}

export const DocumentSection = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onDocumentDeleted,
  onStartLearning
}: DocumentSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <UploadSection onUploadSuccess={onDocumentDeleted} />
        <DocumentList
          documents={documents}
          selectedDocument={selectedDocument}
          onSelectDocument={onSelectDocument}
          onDocumentDeleted={onDocumentDeleted}
        />
        <div className="pt-4">
          <LearningModeSelector
            selectedDocument={selectedDocument}
            onStartLearning={onStartLearning}
          />
        </div>
      </div>
    </div>
  );
};