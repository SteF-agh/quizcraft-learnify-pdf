import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Document } from "../types";
import { formatFileSize } from "@/utils/formatters";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

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
  onViewQuestions,
}: DocumentRowProps) => {
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestionCount = async () => {
      try {
        const { data, error, count } = await supabase
          .from("quiz_questions")
          .select("*", { count: 'exact' })
          .eq("document_id", document.id);

        if (error) {
          console.error("Error fetching question count:", error);
          return;
        }

        console.log(`Found ${count} questions for document ${document.id}`);
        setQuestionCount(count);
      } catch (error) {
        console.error("Error in fetchQuestionCount:", error);
      }
    };

    fetchQuestionCount();
  }, [document.id]);

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
            onClick={() => onViewQuestions(document.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Fragen anzeigen
          </Button>
          {questionCount !== null && (
            <Badge variant={questionCount > 0 ? "default" : "secondary"}>
              {questionCount} {questionCount === 1 ? 'Frage' : 'Fragen'}
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};