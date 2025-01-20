import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question, QuestionGenerationState } from "../types/questionTypes";
import { Json } from "@/integrations/supabase/types";

export const useQuestionHandlingLogic = (
  state: QuestionGenerationState,
  setState: (state: QuestionGenerationState) => void,
  onRefetch: () => void
) => {
  const handleAcceptQuestion = async () => {
    if (!state.currentQuestion) {
      console.log("No current question to accept");
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error("Bitte melden Sie sich an, um die Frage zu speichern");
        return;
      }

      console.log("Saving question:", state.currentQuestion);

      // Map the properties to match database column names
      const { error } = await supabase.from("quiz_questions").insert({
        course_name: state.currentQuestion.courseName,
        chapter: state.currentQuestion.chapter,
        topic: state.currentQuestion.topic,
        difficulty: state.currentQuestion.difficulty,
        question_text: state.currentQuestion.questionText,
        type: state.currentQuestion.type,
        points: state.currentQuestion.points,
        answers: state.currentQuestion.answers as Json,
        feedback: state.currentQuestion.feedback,
        learning_objective_id: state.currentQuestion.learningObjectiveId,
        metadata: state.currentQuestion.metadata as Json,
        document_id: state.currentQuestion.documentId,
        created_by: session.user.id
      });

      if (error) {
        console.error("Error saving question:", error);
        throw error;
      }

      const currentIndex = state.generatedQuestions.findIndex(
        (q) => q.id === state.currentQuestion?.id
      );
      console.log("Current question index:", currentIndex);

      if (currentIndex < state.generatedQuestions.length - 1) {
        setState({
          ...state,
          currentQuestion: state.generatedQuestions[currentIndex + 1]
        });
        toast.success("Frage gespeichert - Nächste Frage wird angezeigt");
      } else {
        setState({ ...state, showQuestionDialog: false });
        toast.success("Alle Fragen wurden erfolgreich gespeichert");
        onRefetch();
      }
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Fehler beim Speichern der Frage: " + (error.message || "Unbekannter Fehler"));
    }
  };

  const handleRegenerateQuestion = () => {
    const currentIndex = state.generatedQuestions.findIndex(
      (q) => q.id === state.currentQuestion?.id
    );
    if (currentIndex < state.generatedQuestions.length - 1) {
      setState({
        ...state,
        currentQuestion: state.generatedQuestions[currentIndex + 1]
      });
    } else {
      setState({ ...state, showQuestionDialog: false });
    }
  };

  return {
    handleAcceptQuestion,
    handleRegenerateQuestion,
  };
};