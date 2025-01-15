import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Mascot } from "@/components/quiz/Mascot";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

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
          navigate('/learning-mode');
          return;
        }

        // Simulate loading time for demonstration
        await new Promise(resolve => setTimeout(resolve, 1000));
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
      toast.success("Richtig! Weiter so!");
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
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5">
          <div className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent animate-pulse">
            Quiz wird geladen...
          </div>
        </div>
      </Layout>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-8">
        <QuizHeader 
          currentQuestion={currentQuestion}
          totalQuestions={questions.length}
          progress={progress}
        />

        <div className="container mx-auto max-w-4xl px-4">
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
    </Layout>
  );
};

export default Quiz;