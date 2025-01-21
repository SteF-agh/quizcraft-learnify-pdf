import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const handleQuestionFileUpload = async (
  file: File,
  documentId: string
): Promise<boolean> => {
  try {
    const text = await file.text();
    const questions = JSON.parse(text);

    if (!Array.isArray(questions)) {
      throw new Error("Die Datei muss ein Array von Fragen enthalten");
    }

    const transformedQuestions = questions.map((q: any) => ({
      ...q,
      document_id: documentId,
    }));

    const { error } = await supabase
      .from("quiz_questions")
      .insert(transformedQuestions);

    if (error) throw error;

    toast.success("Fragen wurden erfolgreich hochgeladen");
    return true;
  } catch (error) {
    console.error("Error uploading questions:", error);
    toast.error("Fehler beim Hochladen der Fragen");
    return false;
  }
};