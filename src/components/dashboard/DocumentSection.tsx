import { DocumentList } from "./DocumentList";
import { PublicDocumentList } from "./PublicDocumentList";

interface DocumentSectionProps {
  documents: any[];
  onDocumentDeleted: () => void;
}

export const DocumentSection = ({
  documents,
  onDocumentDeleted,
}: DocumentSectionProps) => {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-semibold mb-4">Verfügbare Skripte</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Hier findest du alle von deinen Trainern bereitgestellten Skripte
        </p>
        <PublicDocumentList
          onDocumentAssigned={onDocumentDeleted}
        />
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-4">Deine Skripte</h2>
        <DocumentList
          documents={documents}
          onDocumentDeleted={onDocumentDeleted}
        />
      </div>
    </div>
  );
};