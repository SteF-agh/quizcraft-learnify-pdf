import { QuizHeader } from "../QuizHeader";
import { QuestionCard } from "../QuestionCard";
import { Mascot } from "../Mascot";
import { QuizCompletionModal } from "../completion/QuizCompletionModal";
import { Question } from "../types/QuestionTypes";

interface QuizProgressProps {
  currentQuestion: number;
  questions: Question[];
  selectedAnswer: number | null;
  showMotivation: boolean;
  showCompletionModal: boolean;
  quizStats: {
    correctAnswers: number;
    totalPoints: number;
  };
  onAnswerSelect: (index: number) => void;
  onNextQuestion: () => void;
  onContinue: () => void;
  onCloseModal: () => void;
}

export const QuizProgress = ({
  currentQuestion,
  questions,
  selectedAnswer,
  showMotivation,
  showCompletionModal,
  quizStats,
  onAnswerSelect,
  onNextQuestion,
  onContinue,
  onCloseModal,
}: QuizProgressProps) => {
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      <QuizHeader 
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={progress}
      />

      <div className="container mx-auto max-w-3xl px-4">
        <QuestionCard
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={onAnswerSelect}
          onNextQuestion={onNextQuestion}
          isLastQuestion={currentQuestion >= questions.length - 1}
        />
      </div>

      <Mascot showMotivation={showMotivation} />

      <QuizCompletionModal
        isOpen={showCompletionModal}
        onClose={onCloseModal}
        points={quizStats.totalPoints}
        correctAnswers={quizStats.correctAnswers}
        totalQuestions={questions.length}
        onContinue={onContinue}
      />
    </>
  );
};