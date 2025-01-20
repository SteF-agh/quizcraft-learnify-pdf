import { useQuestionGenerationLogic } from "./useQuestionGenerationLogic";
import { useQuestionHandlingLogic } from "./useQuestionHandlingLogic";

export const useQuestionGeneration = (onRefetch: () => void) => {
  const { state, setState, handleGenerateQuiz } = useQuestionGenerationLogic();
  const { handleAcceptQuestion, handleRegenerateQuestion } = useQuestionHandlingLogic(
    state,
    setState,
    onRefetch
  );

  return {
    isGenerating: state.isGenerating,
    currentQuestion: state.currentQuestion,
    showQuestionDialog: state.showQuestionDialog,
    setShowQuestionDialog: (show: boolean) =>
      setState({ ...state, showQuestionDialog: show }),
    handleGenerateQuiz,
    handleAcceptQuestion,
    handleRegenerateQuestion,
    generationProgress: state.generationProgress,
  };
};