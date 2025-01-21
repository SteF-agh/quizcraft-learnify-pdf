import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types";
import { DatabaseQuestion } from "@/components/quiz/types/QuestionTypes";

export const useQuestionView = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const mapDatabaseQuestionToQuestion = (dbQuestion: DatabaseQuestion): Question => {
    console.log('Mapping database question:', dbQuestion);
    
    // Ensure answers is properly formatted
    const answers = Array.isArray(dbQuestion.answers) 
      ? dbQuestion.answers 
      : typeof dbQuestion.answers === 'object' && dbQuestion.answers !== null
      ? Object.entries(dbQuestion.answers)
          .filter(([key]) => key.startsWith('Antwort'))
          .map((_, index) => ({
            text: dbQuestion.answers[`Antwort ${index + 1}`] || '',
            isCorrect: dbQuestion.answers[`Antwort ${index + 1} korrekt`] === 'true'
          }))
      : [];

    return {
      id: dbQuestion.id,
      document_id: dbQuestion.document_id,
      course_name: dbQuestion.course_name,
      chapter: dbQuestion.chapter,
      topic: dbQuestion.topic,
      difficulty: dbQuestion.difficulty,
      question_text: dbQuestion.question_text,
      type: dbQuestion.type,
      points: dbQuestion.points,
      answers: answers,
      feedback: dbQuestion.feedback,
      learning_objective_id: dbQuestion.learning_objective_id,
      metadata: dbQuestion.metadata
    };
  };

  const handleViewQuestions = async (documentId: string) => {
    console.log('Viewing questions for document:', documentId);
    setSelectedDocumentId(documentId);
    
    try {
      const { data: dbQuestions, error: fetchError } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", documentId);

      if (fetchError) throw fetchError;

      console.log('Fetched questions from database:', dbQuestions);

      if (!dbQuestions) {
        toast.info("Keine Fragen für dieses Dokument gefunden");
        setQuestions([]);
        return;
      }

      // Map database questions to our Question type
      const mappedQuestions = dbQuestions.map(mapDatabaseQuestionToQuestion);
      console.log('Mapped questions:', mappedQuestions);
      
      setQuestions(mappedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Fehler beim Laden der Fragen");
      setQuestions([]);
    }
  };

  return {
    selectedDocumentId,
    questions,
    handleViewQuestions
  };
};