import { TableCell, TableRow } from "@/components/ui/table";
import { formatBytes } from "@/utils/formatters";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { QuestionUpload } from "../question-upload/QuestionUpload";

interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

interface DocumentRowProps {
  document: Document;
  onTogglePublic: (documentId: string, currentState: boolean) => Promise<void>;
  onGenerateQuiz: (documentId: string) => Promise<void>;
  onViewQuestions: (documentId: string) => Promise<void>;
  isGenerating: boolean;
}

export const DocumentRow = ({
  document,
  onTogglePublic,
  onGenerateQuiz,
  onViewQuestions,
  isGenerating
}: DocumentRowProps) => {
  return (
    <TableRow key={document.id}>
      <TableCell>{document.name}</TableCell>
      <TableCell>{formatBytes(document.file_size || 0)}</TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(document.created_at), {
          addSuffix: true,
          locale: de
        })}
      </TableCell>
      <TableCell>
        <Switch
          checked={document.is_public}
          onCheckedChange={(checked) => onTogglePublic(document.id, checked)}
        />
      </TableCell>
      <TableCell className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGenerateQuiz(document.id)}
          disabled={isGenerating}
        >
          {isGenerating ? "Generiere Fragen..." : "Fragen generieren"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewQuestions(document.id)}
        >
          Fragen anzeigen
        </Button>
        <QuestionUpload documentId={document.id} onUploadSuccess={() => onViewQuestions(document.id)} />
      </TableCell>
    </TableRow>
  );
};