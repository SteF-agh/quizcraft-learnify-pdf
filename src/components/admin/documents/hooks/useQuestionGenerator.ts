import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GeneratedQuestion, QuestionGenerationState } from "../types/questionTypes";
import { Json } from "@/integrations/supabase/types";

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
      console.log('Calling generate-questions edge function...');
      const { data: response, error } = await supabase.functions.invoke('generate-questions', {
        body: { documentId }
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw error;
      }

      console.log('Response from edge function:', response);

      if (!response.questions || !Array.isArray(response.questions)) {
        console.error('Invalid response format:', response);
        throw new Error('Ungültiges Antwortformat vom Server');
      }

      setState(prev => ({
        ...prev,
        currentQuestions: response.questions,
        showQuestionDialog: true,
        generationProgress: 100,
      }));

      console.log('Questions generated successfully:', response.questions);
      toast.success('Fragen wurden erfolgreich generiert');
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Fehler bei der Fragengenerierung: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const saveQuestions = async (questions: GeneratedQuestion[]) => {
    console.log('Attempting to save questions:', questions);
    
    try {
      const formattedQuestions = questions.map(q => ({
        document_id: q.document_id,
        course_name: q.course_name,
        chapter: q.chapter,
        topic: q.topic,
        difficulty: q.difficulty,
        question_text: q.question_text,
        type: q.type,
        points: q.points,
        answers: q.answers as unknown as Json,
        feedback: q.feedback,
        learning_objective_id: q.learning_objective_id,
        metadata: q.metadata
      }));

      const { error } = await supabase
        .from('quiz_questions')
        .insert(formattedQuestions);

      if (error) {
        console.error('Error saving questions:', error);
        throw error;
      }

      console.log('Questions saved successfully');
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