import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentRow } from "./DocumentRow";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
}

interface DocumentTableProps {
  documents: Document[];
  onAssignDocument: (id: string) => void;
}

export const DocumentTable = ({ documents, onAssignDocument }: DocumentTableProps) => {
  if (!documents.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Keine öffentlichen Dokumente verfügbar</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
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
                onAssign={onAssignDocument}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};