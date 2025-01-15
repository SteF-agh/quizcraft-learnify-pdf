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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <UploadSection onUploadSuccess={onDocumentDeleted} />
        </div>
        <div className="md:col-span-2">
          <DocumentList
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={onSelectDocument}
            onDocumentDeleted={onDocumentDeleted}
          />
        </div>
      </div>
      <div className="pt-4">
        <LearningModeSelector
          selectedDocument={selectedDocument}
          onStartLearning={onStartLearning}
        />
      </div>
    </div>
  );
};