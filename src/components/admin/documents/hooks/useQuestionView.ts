import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "../types";

interface DatabaseQuestion {
  id: string;
  document_id: string;
  course_name: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "advanced";
  question_text: string;
  type: "multiple-choice" | "single-choice" | "true-false";
  points: number;
  answers: Record<string, any>;
  feedback?: string;
  learning_objective_id?: string;
  metadata?: Record<string, any>;
}

export const useQuestionView = () => {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const mapDatabaseQuestionToQuestion = (dbQuestion: DatabaseQuestion): Question => {
    console.log('Mapping database question:', dbQuestion);
    
    // Format answers from the database structure
    let formattedAnswers = [];
    
    if (typeof dbQuestion.answers === 'object' && dbQuestion.answers !== null) {
      // Handle both array and record formats
      if (Array.isArray(dbQuestion.answers)) {
        formattedAnswers = dbQuestion.answers.map(answer => ({
          text: answer.text,
          isCorrect: answer.isCorrect
        }));
      } else {
        // Handle record format (e.g., from CSV import)
        const answerEntries = Object.entries(dbQuestion.answers);
        for (let i = 1; i <= 4; i++) {
          const answerText = answerEntries.find(([key]) => 
            key === `Antwort ${i}` || key === `text${i}` || key === `answer${i}`
          )?.[1];
          const isCorrect = answerEntries.find(([key]) => 
            key === `Antwort ${i} korrekt` || key === `correct${i}` || key === `isCorrect${i}`
          )?.[1] === 'true';
          
          if (answerText) {
            formattedAnswers.push({
              text: answerText,
              isCorrect: isCorrect || false
            });
          }
        }
      }
    }

    console.log('Formatted answers:', formattedAnswers);

    // Map to Question type
    const question: Question = {
      id: dbQuestion.id,
      document_id: dbQuestion.document_id,
      course_name: dbQuestion.course_name,
      chapter: dbQuestion.chapter,
      topic: dbQuestion.topic,
      difficulty: dbQuestion.difficulty,
      question_text: dbQuestion.question_text,
      type: dbQuestion.type,
      points: dbQuestion.points,
      answers: formattedAnswers,
      feedback: dbQuestion.feedback || undefined,
      learning_objective_id: dbQuestion.learning_objective_id || undefined,
      metadata: dbQuestion.metadata
    };

    return question;
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
      const mappedQuestions = dbQuestions.map((q) => mapDatabaseQuestionToQuestion(q as DatabaseQuestion));
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