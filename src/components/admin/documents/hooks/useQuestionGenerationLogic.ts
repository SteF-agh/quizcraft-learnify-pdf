import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question, QuestionGenerationState } from "../types/questionTypes";

export const useQuestionGenerationLogic = () => {
  const [state, setState] = useState<QuestionGenerationState>({
    isGenerating: false,
    currentQuestion: null,
    generatedQuestions: [],
    showQuestionDialog: false,
    generationProgress: 0,
  });

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      setState(prev => ({ ...prev, isGenerating: true, generationProgress: 10 }));
      console.log("Starting quiz generation for document:", documentId);

      // Direct edge function call without authentication check for testing
      const response = await supabase.functions.invoke("generate-questions", {
        body: { documentId },
      });

      console.log("Response from generate-questions:", response);

      if (response.error) {
        console.error("Error from generate-questions:", response.error);
        throw response.error;
      }

      if (!response.data?.questions || !Array.isArray(response.data.questions)) {
        console.error("Invalid response format:", response.data);
        throw new Error("Ungültiges Antwortformat vom Server");
      }

      setState(prev => ({
        ...prev,
        generationProgress: 70,
        generatedQuestions: response.data.questions,
        currentQuestion: response.data.questions[0],
        showQuestionDialog: true,
      }));

      setState(prev => ({ ...prev, generationProgress: 100 }));
      toast.success("Fragen wurden erfolgreich generiert");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Fehler beim Generieren des Quiz: " + (error.message || "Unbekannter Fehler"));
      setState(prev => ({ ...prev, showQuestionDialog: false }));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false, generationProgress: 0 }));
    }
  };

  return {
    state,
    setState,
    handleGenerateQuiz,
  };
};