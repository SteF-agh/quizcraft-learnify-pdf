import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/formatters";
import { DocumentRow } from "./DocumentRow";

export interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  content_type?: string;
  is_public: boolean;
  assigned_to: string[];
}

interface DocumentTableProps {
  documents: Document[];
  onAssignDocument: (id: string) => void;
}

export const DocumentTable = ({ documents, onAssignDocument }: DocumentTableProps) => {
  if (!documents.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine öffentlichen Dokumente verfügbar
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Größe</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Datum</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onAssign={() => onAssignDocument(doc.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};