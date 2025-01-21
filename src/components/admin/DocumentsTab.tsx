import { Card } from "@/components/ui/card";
import { DocumentTable } from "./documents/DocumentTable";
import { UploadSection } from "./documents/UploadSection";

interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

interface DocumentsTabProps {
  documents: Document[];
  onUploadSuccess: () => void;
  onRefetch: () => void;
}

export const DocumentsTab = ({ documents, onUploadSuccess, onRefetch }: DocumentsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-2">Dokumente hochladen</h2>
        <p className="text-slate-600 mb-4">Laden Sie Dokumente hoch und lassen Sie die KI automatisch Fragen generieren.</p>
        <UploadSection onUploadSuccess={onUploadSuccess} />
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Vorhandene Skripte</h2>
        <DocumentTable documents={documents} onRefetch={onRefetch} />
      </Card>
    </div>
  );
};