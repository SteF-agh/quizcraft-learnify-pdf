import { DocumentList } from "./DocumentList";
import { UploadSection } from "./UploadSection";
import { LearningModeSelector } from "./LearningModeSelector";
import { PublicDocumentList } from "./PublicDocumentList";

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
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Verfügbare Skripte</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Hier findest du alle von deinen Trainern bereitgestellten Skripte
              </p>
              <PublicDocumentList
                onDocumentAssigned={onDocumentDeleted}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">Deine Skripte</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Wähle das Skript aus, mit dem du jetzt lernen möchtest und gehe auf Lernen starten
              </p>
              <DocumentList
                documents={documents}
                selectedDocument={selectedDocument}
                onSelectDocument={onSelectDocument}
                onDocumentDeleted={onDocumentDeleted}
              />
            </div>
          </div>
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