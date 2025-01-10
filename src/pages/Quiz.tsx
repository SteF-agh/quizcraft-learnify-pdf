import { useState, useEffect } from "react";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Mascot } from "@/components/quiz/Mascot";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

// Temporary sample questions until we integrate with OpenAI
const sampleQuestions: Question[] = [
  {
    type: 'multiple-choice',
    text: 'Was ist die Hauptstadt von Deutschland?',
    options: ['Berlin', 'Hamburg', 'München', 'Frankfurt'],
    correctAnswer: 0
  },
  {
    type: 'true-false',
    text: 'Deutschland ist ein Mitglied der Europäischen Union.',
    correctAnswer: true
  },
  {
    type: 'open',
    text: 'Erkläre kurz, was das Grundgesetz ist.',
    correctAnswer: 'Das Grundgesetz ist die Verfassung Deutschlands'
  },
  {
    type: 'matching',
    text: 'Ordne die Bundesländer ihren Hauptstädten zu.',
    options: ['Bayern - München', 'Hessen - Wiesbaden', 'Sachsen - Dresden'],
    correctAnswer: 0
  },
  {
    type: 'fill-in',
    text: 'Die ____ ist das Parlament der Bundesrepublik Deutschland.',
    options: ['Bundestag', 'Bundesrat', 'Bundesversammlung'],
    correctAnswer: 0
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
          toast.error("Wähle eine Datei aus, für die ein Quiz erzeugt werden soll");
          navigate('/');
          return;
        }

        // Simulate loading time for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Later, we'll fetch AI-generated questions here
        console.log('Document ID for question generation:', documentId);
        setQuestions(sampleQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing quiz:', error);
        toast.error("Fehler beim Laden des Quiz");
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [location.search, navigate]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    const currentQ = questions[currentQuestion];
    
    let isCorrect = false;
    if (currentQ.type === 'multiple-choice' || currentQ.type === 'matching' || currentQ.type === 'fill-in') {
      isCorrect = index === currentQ.correctAnswer;
    } else if (currentQ.type === 'true-false') {
      isCorrect = index === (currentQ.correctAnswer ? 0 : 1);
    }
    
    if (isCorrect) {
      setShowMotivation(true);
      toast.success("Richtig!");
      setTimeout(() => setShowMotivation(false), 3000);
    } else {
      toast.error("Leider falsch. Versuche es noch einmal!");
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
        <div className="text-xl">Quiz wird geladen...</div>
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