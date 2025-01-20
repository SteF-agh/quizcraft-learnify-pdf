import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types";
import { Json } from "@/integrations/supabase/types";

export const useQuestionGeneration = (onRefetch: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      setIsGenerating(true);
      setGenerationProgress(10);
      console.log("Starting quiz generation for document:", documentId);

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

      setGenerationProgress(70);
      const questions = response.data.questions;
      console.log("Generated questions:", questions);

      setGeneratedQuestions(questions);
      setCurrentQuestion(questions[0]);
      setShowQuestionDialog(true);
      setGenerationProgress(100);
      toast.success("Fragen wurden erfolgreich generiert");
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Fehler beim Generieren des Quiz: " + (error.message || "Unbekannter Fehler"));
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleAcceptQuestion = async () => {
    if (!currentQuestion) {
      console.log("No current question to accept");
      return;
    }

    try {
      console.log("Saving question:", currentQuestion);

      const { error } = await supabase.from("quiz_questions").insert({
        course_name: currentQuestion.courseName,
        chapter: currentQuestion.chapter,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        question_text: currentQuestion.questionText,
        type: currentQuestion.type,
        points: currentQuestion.points,
        answers: currentQuestion.answers,
        feedback: currentQuestion.feedback,
        learning_objective_id: currentQuestion.learningObjectiveId,
        metadata: currentQuestion.metadata as Json,
        document_id: currentQuestion.documentId,
      });

      if (error) {
        console.error("Error saving question:", error);
        throw error;
      }

      // Move to next question
      const currentIndex = generatedQuestions.findIndex(
        (q) => q.id === currentQuestion.id
      );
      console.log("Current question index:", currentIndex);

      if (currentIndex < generatedQuestions.length - 1) {
        setCurrentQuestion(generatedQuestions[currentIndex + 1]);
        toast.success("Frage gespeichert - Nächste Frage wird angezeigt");
      } else {
        setShowQuestionDialog(false);
        toast.success("Alle Fragen wurden erfolgreich gespeichert");
        onRefetch();
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage: " + (error.message || "Unbekannter Fehler"));
    }
  };

  const handleRegenerateQuestion = () => {
    const currentIndex = generatedQuestions.findIndex(
      (q) => q.id === currentQuestion?.id
    );
    if (currentIndex < generatedQuestions.length - 1) {
      setCurrentQuestion(generatedQuestions[currentIndex + 1]);
    } else {
      setShowQuestionDialog(false);
    }
  };

  return {
    isGenerating,
    currentQuestion,
    showQuestionDialog,
    setShowQuestionDialog,
    handleGenerateQuiz,
    handleAcceptQuestion,
    handleRegenerateQuestion,
    generationProgress,
  };
};