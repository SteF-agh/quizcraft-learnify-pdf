import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/utils/formatters";
import { DocumentProgress } from "./DocumentProgress";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DocumentRowProps {
  document: {
    id: string;
    name: string;
    file_size?: number;
    created_at: string;
  };
  onDelete: (e: React.MouseEvent) => void;
  coins: number;
}

export const DocumentRow = ({
  document,
  onDelete,
  coins
}: DocumentRowProps) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/learning-mode?documentId=${document.id}`);
  };

  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <div className="font-medium">{document.name}</div>
          <div className="text-sm text-muted-foreground">
            {formatFileSize(document.file_size || 0)} • {coins} Coins verdient
          </div>
          <DocumentProgress documentId={document.id} />
        </div>
      </TableCell>
      <TableCell className="w-[180px]">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleStartLearning}
            className="flex-1 gap-2"
            size="sm"
          >
            <GraduationCap className="h-4 w-4" />
            Lernen
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};