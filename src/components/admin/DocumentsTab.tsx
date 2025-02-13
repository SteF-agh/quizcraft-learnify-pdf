
import { Card } from "@/components/ui/card";
import { DocumentTable } from "./documents/DocumentTable";
import { UploadSection } from "./documents/UploadSection";
import { Document } from "./documents/types";

interface DocumentsTabProps {
  documents: Document[];
  onUploadSuccess: () => void;
  onRefetch: () => void;
}

export const DocumentsTab = ({
  documents,
  onUploadSuccess,
  onRefetch
}: DocumentsTabProps) => {
  return <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-xl shadow-sm border border-primary/10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-secondary mb-2">Neues Dokument hochladen</h2>
          <p className="text-muted-foreground mb-6">
            Lade dein Kursskript hoch und lasse automatisch Übungsfragen generieren.
            Nach der Freigabe können deine Teilnehmer mit dem Material üben.
          </p>
          <UploadSection onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vorhandene Skripte</h2>
        <DocumentTable documents={documents} onRefetch={onRefetch} />
      </Card>
    </div>;
};
