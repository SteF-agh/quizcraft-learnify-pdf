import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ChapterSelection } from "@/components/quiz/chapter-selection/ChapterSelection";
import { QuizProgress } from "@/components/quiz/progress/QuizProgress";
import { useQuizLogic } from "@/components/quiz/hooks/useQuizLogic";

const POINTS_PER_CORRECT_ANSWER = 10;

const Quiz = () => {
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  const {
    currentQuestion,
    selectedAnswer,
    showMotivation,
    questions,
    isGenerating,
    showCompletionModal,
    quizStats,
    setCurrentQuestion,
    setSelectedAnswer,
    setShowMotivation,
    setShowCompletionModal,
    setQuizStats,
    loadQuestions,
  } = useQuizLogic(documentId);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const docId = searchParams.get('documentId');

    if (!docId) {
      toast.error("Wähle eine Datei aus, für die ein Quiz erzeugt werden soll");
      navigate('/learning-mode');
      return;
    }

    setDocumentId(docId);
    setLoading(false);
  }, [location.search, navigate]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    checkAnswer(index);
  };

  const checkAnswer = (index: number) => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'multiple-choice' || currentQ.type === 'single-choice') {
      isCorrect = index === currentQ.correctAnswer;
    } else if (currentQ.type === 'true-false') {
      isCorrect = index === (currentQ.correctAnswer ? 0 : 1);
    }
    
    if (isCorrect) {
      setQuizStats(prev => ({
        correctAnswers: prev.correctAnswers + 1,
        totalPoints: prev.totalPoints + POINTS_PER_CORRECT_ANSWER
      }));
      showCorrectAnswerFeedback();
    } else {
      showIncorrectAnswerFeedback();
    }
  };

  const showCorrectAnswerFeedback = () => {
    setShowMotivation(true);
    toast.success("Richtig! Weiter so!");
    setTimeout(() => setShowMotivation(false), 3000);
  };

  const showIncorrectAnswerFeedback = () => {
    toast.error("Leider falsch. Versuche es noch einmal!");
  };

  const handleNextQuestion = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Benutzer nicht eingeloggt");
          return;
        }

        const { error: quizError } = await supabase
          .from('quiz_results')
          .insert({
            user_id: user.id,
            total_points: quizStats.totalPoints,
            correct_answers: quizStats.correctAnswers,
            total_questions: questions.length,
            document_id: documentId
          });

        if (quizError) throw quizError;

        const { error: statsError } = await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            quiz_points: quizStats.totalPoints
          }, {
            onConflict: 'user_id'
          });

        if (statsError) throw statsError;

        setShowCompletionModal(true);
      } catch (error) {
        console.error('Error saving quiz results:', error);
        toast.error("Fehler beim Speichern der Ergebnisse");
      }
    }
  };

  const handleStartQuiz = (selectedChapter: string | null) => {
    loadQuestions(selectedChapter);
  };

  const handleContinueQuiz = () => {
    setShowCompletionModal(false);
    navigate('/learning-mode');
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12">
        {questions.length === 0 ? (
          <div className="container mx-auto max-w-3xl px-4 mt-8">
            <ChapterSelection
              documentId={documentId!}
              onStart={handleStartQuiz}
            />
          </div>
        ) : (
          <QuizProgress
            currentQuestion={currentQuestion}
            questions={questions}
            selectedAnswer={selectedAnswer}
            showMotivation={showMotivation}
            showCompletionModal={showCompletionModal}
            quizStats={quizStats}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onContinue={handleContinueQuiz}
            onCloseModal={() => setShowCompletionModal(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default Quiz;