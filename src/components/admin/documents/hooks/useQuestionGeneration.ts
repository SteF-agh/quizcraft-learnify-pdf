import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types";

export const useQuestionGeneration = (onRefetch: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);

      const { data: response, error } = await supabase.functions.invoke('generate-questions', {
        body: { documentId }
      });

      if (error) throw error;

      // Simuliere Fortschritt während der Generierung
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 1000);

      if (response.questions && response.questions.length > 0) {
        const firstQuestion = response.questions[0];
        setCurrentQuestion(firstQuestion);
        setShowQuestionDialog(true);
      }

      // Setze Fortschritt auf 100% wenn fertig
      setGenerationProgress(100);
      setTimeout(() => {
        clearInterval(progressInterval);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);

      onRefetch();
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Fehler beim Generieren des Quiz');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleAcceptQuestion = async () => {
    if (!currentQuestion) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .insert([currentQuestion]);

      if (error) throw error;

      toast.success('Frage erfolgreich gespeichert');
      setShowQuestionDialog(false);
      setCurrentQuestion(null);
      onRefetch();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Fehler beim Speichern der Frage');
    }
  };

  const handleRegenerateQuestion = async () => {
    // Implementierung der Regenerierung einer einzelnen Frage
    toast.info('Generiere neue Frage...');
  };

  return {
    isGenerating,
    currentQuestion,
    showQuestionDialog,
    setShowQuestionDialog,
    handleGenerateQuiz,
    handleAcceptQuestion,
    handleRegenerateQuestion,
    generationProgress
  };
};