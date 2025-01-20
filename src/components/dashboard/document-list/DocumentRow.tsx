import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/utils/formatters";
import { DocumentProgress } from "./DocumentProgress";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trash2, Clock, Award, FileText, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DocumentRowProps {
  document: {
    id: string;
    name: string;
    file_size?: number;
    created_at: string;
  };
  onDelete: (e: React.MouseEvent) => void;
  coins: number;
}

export const DocumentRow = ({
  document,
  onDelete,
  coins
}: DocumentRowProps) => {
  const navigate = useNavigate();
  const daysSinceCreation = Math.floor((Date.now() - new Date(document.created_at).getTime()) / (1000 * 60 * 60 * 24));
  
  const { data: quizStats } = useQuery({
    queryKey: ['quiz-stats', document.id],
    queryFn: async () => {
      console.log('Fetching quiz stats for document:', document.id);
      const { data: results, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('document_id', document.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching quiz results:', error);
        return null;
      }

      console.log('Quiz results:', results);
      return {
        totalAttempts: results.length,
        averageScore: results.length > 0 
          ? Math.round(results.reduce((acc, curr) => acc + (curr.correct_answers / curr.total_questions * 100), 0) / results.length)
          : 0,
        lastAttempt: results[0]?.completed_at
      };
    }
  });

  const handleStartLearning = () => {
    navigate(`/learning-mode?documentId=${document.id}`);
  };

  return (
    <TableRow>
      <TableCell>
        <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-lg">{document.name}</h3>
                  {daysSinceCreation < 7 && (
                    <Badge variant="secondary" className="animate-pulse">Neu</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(document.file_size || 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStartLearning}
                className="gap-2 bg-primary hover:bg-primary/90 text-white"
                size="lg"
              >
                <GraduationCap className="h-5 w-5" />
                Lernen
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                className="h-10 w-10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <div>
                <span className="text-sm font-medium">{coins} Coins</span>
                {quizStats?.totalAttempts > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Ø {quizStats.averageScore}% Erfolg
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4 text-blue-500" />
              <div>
                <span className="text-sm font-medium">{quizStats?.totalAttempts || 0} Quiz(ze)</span>
                {quizStats?.lastAttempt && (
                  <p className="text-xs text-muted-foreground">
                    Letztes: {new Date(quizStats.lastAttempt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <div>
                <span className="text-sm font-medium">
                  Erstellt: {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <DocumentProgress documentId={document.id} />
          </div>
        </Card>
      </TableCell>
    </TableRow>
  );
};