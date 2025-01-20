import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen } from "lucide-react";

interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

interface DocumentRowProps {
  document: Document;
  onTogglePublic: (documentId: string, currentState: boolean) => void;
  onGenerateQuiz: (documentId: string) => void;
  isGenerating: boolean;
}

export const DocumentRow = ({
  document,
  onTogglePublic,
  onGenerateQuiz,
  isGenerating,
}: DocumentRowProps) => {
  return (
    <tr className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4 align-middle">{document.name}</td>
      <td className="p-4 align-middle">
        {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : "N/A"}
      </td>
      <td className="p-4 align-middle">
        {new Date(document.created_at).toLocaleDateString()}
      </td>
      <td className="p-4 align-middle">
        <div className="flex items-center space-x-2">
          <Switch
            checked={document.is_public}
            onCheckedChange={() => onTogglePublic(document.id, document.is_public || false)}
          />
          <Globe
            className={`h-4 w-4 ${
              document.is_public ? "text-primary" : "text-muted-foreground"
            }`}
          />
        </div>
      </td>
      <td className="p-4 align-middle space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGenerateQuiz(document.id)}
          disabled={isGenerating}
          className="mr-2"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          {isGenerating ? "Generiere..." : "Quiz generieren"}
        </Button>
      </td>
    </tr>
  );
};