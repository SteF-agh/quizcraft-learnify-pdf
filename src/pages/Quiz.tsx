import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Mascot } from "@/components/quiz/Mascot";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { QuizCompletionModal } from "@/components/quiz/completion/QuizCompletionModal";
import { ChapterSelection } from "@/components/quiz/chapter-selection/ChapterSelection";

interface Question {
  type: 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';
  text: string;
  options?: string[];
  correctAnswer: string | number | boolean;
}

const POINTS_PER_CORRECT_ANSWER = 10;

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [quizStats, setQuizStats] = useState({
    correctAnswers: 0,
    totalPoints: 0,
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const [documentId, setDocumentId] = useState<string | null>(null);

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

  const loadQuestions = async (selectedChapter: string | null) => {
    try {
      setIsGenerating(true);
      console.log('Loading questions for chapter:', selectedChapter);

      let query = supabase
        .from('quiz_questions')
        .select('*')
        .eq('document_id', documentId);

      if (selectedChapter) {
        query = query.eq('chapter', selectedChapter);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (!data || data.length === 0) {
        toast.error("Keine Fragen gefunden");
        return;
      }

      // Shuffle questions
      const shuffledQuestions = data.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setQuizStats({ correctAnswers: 0, totalPoints: 0 });
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error("Fehler beim Laden der Fragen");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    checkAnswer(index);
  };

  const checkAnswer = (index: number) => {
    const currentQ = questions[currentQuestion];
    let isCorrect = false;

    if (currentQ.type === 'multiple-choice' || currentQ.type === 'matching' || currentQ.type === 'fill-in') {
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

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

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
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={handleNextQuestion}
                isLastQuestion={currentQuestion >= questions.length - 1}
              />
            </div>

            <Mascot showMotivation={showMotivation} />

            <QuizCompletionModal
              isOpen={showCompletionModal}
              onClose={() => setShowCompletionModal(false)}
              points={quizStats.totalPoints}
              correctAnswers={quizStats.correctAnswers}
              totalQuestions={questions.length}
              onContinue={handleContinueQuiz}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Quiz;
