import { useState } from "react";
import { Question, DatabaseQuestion } from "../types/QuestionTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useQuizLogic = (documentId: string | null) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [quizStats, setQuizStats] = useState({
    correctAnswers: 0,
    totalPoints: 0,
  });

  const mapDatabaseQuestionToFrontend = (dbQuestion: DatabaseQuestion): Question => {
    return {
      type: dbQuestion.type,
      text: dbQuestion.question_text,
      options: dbQuestion.answers.options,
      correctAnswer: dbQuestion.answers.correctAnswer,
    };
  };

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

      const mappedQuestions = data.map(mapDatabaseQuestionToFrontend);
      const shuffledQuestions = mappedQuestions.sort(() => Math.random() - 0.5);
      
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

  return {
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
  };
};