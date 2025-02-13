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
      <div className="bg-slate-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Neues Dokument hochladen (Lade dein Kursskript hier hoch, lasse dafür spezifische Fragen generieren und veröffentliche es, so dass eine Teilnehmer damit üben können)</h2>
        <UploadSection onUploadSuccess={onUploadSuccess} />
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vorhandene Skripte</h2>
        <DocumentTable documents={documents} onRefetch={onRefetch} />
      </Card>
    </div>;
};