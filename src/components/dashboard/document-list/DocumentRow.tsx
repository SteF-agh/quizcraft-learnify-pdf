import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/utils/formatters";
import { DocumentProgress } from "./DocumentProgress";
import { Checkbox } from "@/components/ui/checkbox";
import { Coins } from "lucide-react";

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
  coins?: number;
}

export const DocumentRow = ({ 
  document, 
  isSelected,
  onSelect,
  onDelete,
  coins = 0
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
          <div className="flex items-center justify-between">
            <span>{document.name}</span>
            <div className="flex items-center gap-2 text-yellow-500">
              <Coins className="h-4 w-4" />
              <span>{coins}</span>
            </div>
          </div>
          <DocumentProgress documentId={document.id} />
        </div>
      </TableCell>
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