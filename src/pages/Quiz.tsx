import { useState, useEffect } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Mascot } from "@/components/quiz/Mascot";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
          toast.error("No document selected");
          return;
        }

        const response = await fetch('/functions/v1/generate-questions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ documentId }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        setQuestions(data.questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error("Failed to generate questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [location.search]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const currentQ = questions[currentQuestion];
    
    let isCorrect = false;
    if (currentQ.type === 'multiple-choice') {
      isCorrect = index === currentQ.correctAnswer;
    } else if (currentQ.type === 'true-false') {
      isCorrect = index === (currentQ.correctAnswer ? 0 : 1);
    }
    
    if (isCorrect) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <div className="text-xl">Generating questions...</div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      <QuizHeader 
        currentQuestion={currentQuestion}
        totalQuestions={questions.length}
        progress={progress}
      />

      <div className="container mx-auto max-w-4xl">
        {questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestion]}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            isLastQuestion={currentQuestion >= questions.length - 1}
          />
        )}
      </div>

      <Mascot showMotivation={showMotivation} />
    </div>
  );
};

export default Quiz;