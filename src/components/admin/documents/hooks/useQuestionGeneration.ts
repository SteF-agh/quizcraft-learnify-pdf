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
      const questionData = {
        document_id: currentQuestion.document_id,
        course_name: currentQuestion.course_name,
        chapter: currentQuestion.chapter,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        question_text: currentQuestion.question_text,
        type: currentQuestion.type,
        points: currentQuestion.points,
        answers: JSON.stringify(currentQuestion.answers),
        feedback: currentQuestion.feedback,
        learning_objective_id: currentQuestion.learning_objective_id,
        metadata: JSON.stringify(currentQuestion.metadata || {})
      };

      const { error } = await supabase
        .from('quiz_questions')
        .insert([questionData]);

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