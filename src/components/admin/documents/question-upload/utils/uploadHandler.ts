import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { convertExcelToQuestions } from "./excelConverter";
import { convertCsvToQuestions } from "./csvConverter";

export const handleQuestionFileUpload = async (
  file: File,
  documentId: string
): Promise<boolean> => {
  try {
    console.log('Starting file upload process for:', file.name);
    let questions;

    if (file.name.endsWith('.json')) {
      const text = await file.text();
      questions = JSON.parse(text);
      console.log('Parsed JSON questions:', questions);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      questions = await convertExcelToQuestions(file);
      console.log('Converted Excel questions:', questions);
    } else if (file.name.endsWith('.csv')) {
      questions = await convertCsvToQuestions(file);
      console.log('Converted CSV questions:', questions);
    } else {
      throw new Error("Nicht unterstütztes Dateiformat");
    }

    if (!Array.isArray(questions)) {
      throw new Error("Die Datei muss ein Array von Fragen enthalten");
    }

    console.log('Processing questions array:', questions);

    const transformedQuestions = questions.map((q: any) => ({
      ...q,
      document_id: documentId,
      answers: Array.isArray(q.answers) ? q.answers : JSON.stringify(q.answers)
    }));

    console.log('Transformed questions for upload:', transformedQuestions);

    const { error } = await supabase
      .from("quiz_questions")
      .insert(transformedQuestions);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Questions successfully uploaded to Supabase');
    toast.success("Fragen wurden erfolgreich hochgeladen");
    return true;
  } catch (error) {
    console.error("Error uploading questions:", error);
    toast.error(`Fehler beim Hochladen der Fragen: ${error.message}`);
    return false;
  }
};