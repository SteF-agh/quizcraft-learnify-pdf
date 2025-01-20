import { DocumentList } from "./DocumentList";
import { PublicDocumentList } from "./PublicDocumentList";
import { Card } from "@/components/ui/card";

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
        <h2 className="text-2xl font-bold text-secondary mb-6">Verfügbare Skripte</h2>
        <Card className="p-6 bg-white/80">
          <div className="max-w-2xl">
            <p className="text-muted-foreground mb-6">
              Wähle aus den von deinen Trainern bereitgestellten Skripten aus und beginne mit dem Lernen
            </p>
            <PublicDocumentList
              onDocumentAssigned={onDocumentDeleted}
            />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-secondary mb-6">Deine Skripte</h2>
        <DocumentList
          documents={documents}
          onDocumentDeleted={onDocumentDeleted}
        />
      </div>
    </div>
  );
};