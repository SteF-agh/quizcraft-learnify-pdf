import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyDocumentState } from "./document-list/EmptyDocumentState";
import { DocumentRow } from "./document-list/DocumentRow";
import { useDeleteHandler } from "./document-list/DeleteHandler";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  content_type?: string;
  file_path: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
  onDocumentDeleted?: () => void;
}

export const DocumentList = ({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDocumentDeleted 
}: DocumentListProps) => {
  const handleDelete = useDeleteHandler(onDocumentDeleted);

  if (!documents.length) {
    return <EmptyDocumentState />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Auswahl</TableHead>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead className="w-[100px]">Größe</TableHead>
              <TableHead className="w-[150px]">Upload Datum</TableHead>
              <TableHead className="w-[170px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                isSelected={selectedDocument === doc.id}
                onSelect={() => onSelectDocument(doc.id)}
                onDelete={(e) => handleDelete(doc, e)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};