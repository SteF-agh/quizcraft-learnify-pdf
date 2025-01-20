import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Brain } from "lucide-react"

export const ActiveQuizzes = () => {
  const navigate = useNavigate();
  
  const { data: documents } = useQuery({
    queryKey: ['public-documents'],
    queryFn: async () => {
      console.log('Fetching public documents for quizzes');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_public', true)
        .limit(3);

      if (error) {
        console.error('Error fetching documents:', error);
        return [];
      }

      console.log('Fetched documents:', data);
      return data;
    }
  });

  const handleQuizStart = (documentId: string) => {
    navigate(`/quiz?documentId=${documentId}`);
  };

  return (
    <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow h-full bg-white/80">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h3 className="text-xl font-bold text-secondary">Aktive Quizze</h3>
      </div>
      
      <div className="space-y-3">
        {documents?.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-base font-medium hover:bg-primary/10 group" 
              onClick={() => handleQuizStart(doc.id)}
            >
              <span className="truncate">{doc.name}</span>
              <Badge 
                variant="default" 
                className="ml-2 group-hover:bg-primary group-hover:text-white transition-colors"
              >
                Quiz starten
              </Badge>
            </Button>
          </div>
        ))}

        {!documents?.length && (
          <div className="text-center text-muted-foreground py-4">
            Keine aktiven Quizze verfügbar
          </div>
        )}
      </div>
    </Card>
  );
};