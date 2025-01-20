import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/formatters";
import { Plus } from "lucide-react";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
}

interface DocumentRowProps {
  document: Document;
  onAssign: () => void;
}

export const DocumentRow = ({ document, onAssign }: DocumentRowProps) => {
  return (
    <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
      <TableCell className="p-4 align-middle">{document.name}</TableCell>
      <TableCell className="p-4 align-middle">
        {document.file_size ? formatFileSize(document.file_size) : 'N/A'}
      </TableCell>
      <TableCell className="p-4 align-middle">
        {new Date(document.created_at).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </TableCell>
      <TableCell className="p-4 align-middle">
        <Button
          variant="outline"
          size="sm"
          onClick={onAssign}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Hinzufügen
        </Button>
      </TableCell>
    </TableRow>
  );
};