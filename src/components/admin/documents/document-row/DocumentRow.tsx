import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Document } from "../types";
import { formatFileSize } from "@/utils/formatters";
import { Eye, Play } from "lucide-react";

interface DocumentRowProps {
  document: Document;
  onTogglePublic: (id: string, currentState: boolean) => void;
  onGenerateQuiz: (id: string) => void;
  onViewQuestions: (id: string) => void;
  isGenerating: boolean;
}

export const DocumentRow = ({
  document,
  onTogglePublic,
  onGenerateQuiz,
  onViewQuestions,
  isGenerating,
}: DocumentRowProps) => {
  const formattedDate = new Date(document.created_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <TableRow>
      <TableCell>{document.name}</TableCell>
      <TableCell>{document.file_size ? formatFileSize(document.file_size) : "-"}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell>
        <Switch
          checked={document.is_public}
          onCheckedChange={() => onTogglePublic(document.id, document.is_public || false)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onGenerateQuiz(document.id)}
            disabled={isGenerating}
          >
            <Play className="h-4 w-4 mr-2" />
            Quiz generieren
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewQuestions(document.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Fragen anzeigen
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};