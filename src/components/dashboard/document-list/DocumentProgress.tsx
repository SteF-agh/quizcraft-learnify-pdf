import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DocumentProgressProps {
  documentId: string;
}

export const DocumentProgress = ({ documentId }: DocumentProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      console.log('Fetching progress for document:', documentId);
      
      const { data: results, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('document_id', documentId);

      if (error) {
        console.error('Error fetching quiz results:', error);
        return;
      }

      if (results && results.length > 0) {
        const totalAttempts = results.length;
        const avgProgress = results.reduce((acc, curr) => {
          return acc + (curr.correct_answers / curr.total_questions * 100);
        }, 0) / totalAttempts;

        console.log('Progress calculated:', avgProgress, 'from', totalAttempts, 'attempts');
        
        setProgress(Math.round(avgProgress));
        setAttempts(totalAttempts);
      }
    };

    fetchProgress();
  }, [documentId]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{attempts} Versuche</span>
        <span>{progress}% Erfolg</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};