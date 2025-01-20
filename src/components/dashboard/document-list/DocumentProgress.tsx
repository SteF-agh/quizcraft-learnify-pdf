import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp } from "lucide-react";

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

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <TrendingUp className={`h-4 w-4 ${progress >= 80 ? 'text-green-500' : progress >= 60 ? 'text-yellow-500' : 'text-orange-500'}`} />
        <span className="text-sm font-medium">{progress}% Fortschritt</span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 transition-all duration-500"
        indicatorClassName={getProgressColor(progress)}
      />
      <div className="text-xs text-muted-foreground text-right">
        {attempts} {attempts === 1 ? 'Versuch' : 'Versuche'}
      </div>
    </div>
  );
};