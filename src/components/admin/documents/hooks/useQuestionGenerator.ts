import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GeneratedQuestion, QuestionGenerationState } from "../types/questionTypes";

export const useQuestionGenerator = (onRefetch: () => void) => {
  const [state, setState] = useState<QuestionGenerationState>({
    isGenerating: false,
    currentQuestions: [],
    showQuestionDialog: false,
    generationProgress: 0,
    selectedChapter: null,
  });

  const generateQuestions = async (documentId: string) => {
    console.log('Starting question generation for document:', documentId);
    setState(prev => ({ ...prev, isGenerating: true, generationProgress: 10 }));

    try {
      const { data: response, error } = await supabase.functions.invoke('generate-questions', {
        body: { documentId }
      });

      if (error) throw error;

      console.log('Generated questions:', response);

      if (!response.questions || !Array.isArray(response.questions)) {
        throw new Error('Ungültiges Antwortformat vom Server');
      }

      setState(prev => ({
        ...prev,
        currentQuestions: response.questions,
        showQuestionDialog: true,
        generationProgress: 100,
      }));

      toast.success('Fragen wurden erfolgreich generiert');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Fehler bei der Fragengenerierung: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const saveQuestions = async (questions: GeneratedQuestion[]) => {
    console.log('Saving questions:', questions);
    
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .insert(questions.map(q => ({
          document_id: q.document_id,
          course_name: q.course_name,
          chapter: q.chapter,
          topic: q.topic,
          difficulty: q.difficulty,
          question_text: q.question_text,
          type: q.type,
          points: q.points,
          answers: q.answers,
          feedback: q.feedback,
          learning_objective_id: q.learning_objective_id,
          metadata: q.metadata
        })));

      if (error) throw error;

      toast.success('Fragen wurden erfolgreich gespeichert');
      setState(prev => ({ ...prev, showQuestionDialog: false, currentQuestions: [] }));
      onRefetch();
    } catch (error) {
      console.error('Error saving questions:', error);
      toast.error('Fehler beim Speichern der Fragen');
    }
  };

  return {
    state,
    generateQuestions,
    saveQuestions,
    setState,
  };
};