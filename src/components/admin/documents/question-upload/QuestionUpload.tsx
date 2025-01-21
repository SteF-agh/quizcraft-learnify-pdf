import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types";

interface QuestionUploadProps {
  documentId: string;
  onUploadSuccess: () => void;
}

export const QuestionUpload = ({ documentId, onUploadSuccess }: QuestionUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const questions = JSON.parse(text);

      if (!Array.isArray(questions)) {
        throw new Error("Die Datei muss ein Array von Fragen enthalten");
      }

      // Validate and transform questions
      const transformedQuestions = questions.map((q: any) => ({
        ...q,
        document_id: documentId,
      }));

      const { error } = await supabase
        .from("quiz_questions")
        .insert(transformedQuestions);

      if (error) throw error;

      toast.success("Fragen wurden erfolgreich hochgeladen");
      onUploadSuccess();
    } catch (error) {
      console.error("Error uploading questions:", error);
      toast.error("Fehler beim Hochladen der Fragen");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
        id="question-upload"
      />
      <label htmlFor="question-upload">
        <Button
          variant="outline"
          disabled={isUploading}
          className="cursor-pointer"
          asChild
        >
          <span>
            {isUploading ? "Lade Fragen hoch..." : "Fragen aus JSON-Datei hochladen"}
          </span>
        </Button>
      </label>
    </div>
  );
};