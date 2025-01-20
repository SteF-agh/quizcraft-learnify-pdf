import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Brain, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

  const { data: completedQuizzes } = useQuery({
    queryKey: ['completed-quizzes'],
    queryFn: async () => {
      console.log('Fetching completed quizzes');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return [];

      const { data, error } = await supabase
        .from('quiz_results')
        .select(`
          *,
          documents:document_id (
            name
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching completed quizzes:', error);
        return [];
      }

      console.log('Fetched completed quizzes:', data);
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
        <h3 className="text-xl font-bold text-secondary">Quizze</h3>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Verfügbar</TabsTrigger>
          <TabsTrigger value="completed">Abgeschlossen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-3 mt-2">
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
        </TabsContent>

        <TabsContent value="completed" className="space-y-3 mt-2">
          {completedQuizzes?.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{quiz.documents?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {quiz.correct_answers}/{quiz.total_questions} richtig • {quiz.total_points} Punkte
                  </span>
                </div>
              </div>
              <Badge variant="secondary">
                Abgeschlossen
              </Badge>
            </div>
          ))}

          {!completedQuizzes?.length && (
            <div className="text-center text-muted-foreground py-4">
              Noch keine Quizze abgeschlossen
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};