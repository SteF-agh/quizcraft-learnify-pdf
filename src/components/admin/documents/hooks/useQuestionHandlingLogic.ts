import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question, QuestionGenerationState } from "../types/questionTypes";

export const useQuestionHandlingLogic = (
  state: QuestionGenerationState,
  setState: (state: QuestionGenerationState) => void,
  onRefetch: () => void
) => {
  const handleAcceptQuestion = async () => {
    if (!state.currentQuestion) return;

    try {
      console.log("Attempting to save question:", state.currentQuestion);
      
      const { error } = await supabase.from("quiz_questions").insert([
        {
          document_id: state.currentQuestion.documentId,
          question_text: state.currentQuestion.questionText,
          type: state.currentQuestion.type,
          difficulty: state.currentQuestion.difficulty,
          points: state.currentQuestion.points,
          answers: state.currentQuestion.answers,
          feedback: state.currentQuestion.feedback,
          course_name: state.currentQuestion.courseName,
          chapter: state.currentQuestion.chapter,
          topic: state.currentQuestion.topic,
        },
      ]);

      if (error) {
        console.error("Error saving question:", error);
        throw error;
      }

      const nextQuestion = state.generatedQuestions[
        state.generatedQuestions.indexOf(state.currentQuestion) + 1
      ];

      setState({
        ...state,
        currentQuestion: nextQuestion,
        showQuestionDialog: !!nextQuestion,
      });

      toast.success("Frage erfolgreich gespeichert");

      if (!nextQuestion) {
        onRefetch();
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage");
    }
  };

  const handleRegenerateQuestion = async () => {
    if (!state.currentQuestion?.documentId) return;

    try {
      const response = await supabase.functions.invoke("generate-questions", {
        body: { documentId: state.currentQuestion.documentId, count: 1 },
      });

      if (response.error) throw response.error;

      const newQuestion = response.data?.questions?.[0];
      if (!newQuestion) throw new Error("Keine neue Frage generiert");

      const updatedQuestions = [...state.generatedQuestions];
      const currentIndex = updatedQuestions.indexOf(state.currentQuestion);
      updatedQuestions[currentIndex] = newQuestion;

      setState({
        ...state,
        currentQuestion: newQuestion,
        generatedQuestions: updatedQuestions,
      });

      toast.success("Neue Frage wurde generiert");
    } catch (error) {
      console.error("Error regenerating question:", error);
      toast.error("Fehler bei der Neugeneration der Frage");
    }
  };

  return {
    handleAcceptQuestion,
    handleRegenerateQuestion,
  };
};