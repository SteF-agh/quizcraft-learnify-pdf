import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize, formatDate } from "@/utils/formatters";
import { DocumentProgress } from "./DocumentProgress";
import { Checkbox } from "@/components/ui/checkbox";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
}

interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const DocumentRow = ({ 
  document, 
  isSelected,
  onSelect,
  onDelete 
}: DocumentRowProps) => {
  return (
    <TableRow>
      <TableCell className="w-[80px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div>{document.name}</div>
          <DocumentProgress documentId={document.id} />
        </div>
      </TableCell>
      <TableCell>{document.file_size ? formatFileSize(document.file_size) : '-'}</TableCell>
      <TableCell>{formatDate(document.created_at)}</TableCell>
      <TableCell>
        <button
          onClick={onDelete}
          className="text-destructive hover:text-destructive/80"
        >
          Löschen
        </button>
      </TableCell>
    </TableRow>
  );
};