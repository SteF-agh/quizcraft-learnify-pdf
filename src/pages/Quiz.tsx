import { useState } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Mascot } from "@/components/quiz/Mascot";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);

  // Sample questions - in a real app, these would come from an API
  const questions: Question[] = [
    {
      id: 1,
      text: "Was ist die Hauptstadt von Deutschland?",
      options: ["Hamburg", "Berlin", "München", "Köln"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Welches chemische Element hat das Symbol 'H'?",
      options: ["Helium", "Wasserstoff", "Hafnium", "Holmium"],
      correctAnswer: 1,
    },
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 3000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      <QuizHeader 
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={progress}
      />

      <div className="container mx-auto max-w-4xl">
        <QuestionCard
          question={questions[currentQuestion]}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestion >= questions.length - 1}
        />
      </div>

      <Mascot showMotivation={showMotivation} />
    </div>
  );
};

export default Quiz;