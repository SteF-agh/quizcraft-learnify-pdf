import { Card } from "@/components/ui/card";
import { FileText, Users, BarChart3, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardsProps {
  documentsCount: number;
}

export const StatsCards = ({ documentsCount }: StatsCardsProps) => {
  // Fetch total questions count
  const { data: questionsCount = 0 } = useQuery({
    queryKey: ['total-questions'],
    queryFn: async () => {
      console.log('Fetching total questions count...');
      const { count, error } = await supabase
        .from('quiz_questions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching questions count:', error);
        return 0;
      }

      console.log('Total questions count:', count);
      return count || 0;
    }
  });

  // Fetch active users count
  const { data: activeUsersCount = 0 } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      console.log('Fetching active users count...');
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'trainee');

      if (error) {
        console.error('Error fetching active users count:', error);
        return 0;
      }

      console.log('Active users count:', count);
      return count || 0;
    }
  });

  // Fetch quiz average
  const { data: quizAverage = 0 } = useQuery({
    queryKey: ['quiz-average'],
    queryFn: async () => {
      console.log('Fetching quiz average...');
      const { data, error } = await supabase
        .from('quiz_results')
        .select('correct_answers, total_questions');

      if (error) {
        console.error('Error fetching quiz results:', error);
        return 0;
      }

      if (!data || data.length === 0) return 0;

      const totalPercentage = data.reduce((acc, curr) => {
        return acc + (curr.correct_answers / curr.total_questions) * 100;
      }, 0);

      const average = Math.round(totalPercentage / data.length);
      console.log('Quiz average:', average);
      return average;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gesamt Dokumente</p>
          <p className="text-2xl font-bold">{documentsCount}</p>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-green-100 rounded-full">
          <HelpCircle className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Verfügbare Fragen</p>
          <p className="text-2xl font-bold">{questionsCount}</p>
        </div>
      </Card>
      
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-secondary/10 rounded-full">
          <Users className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Aktive Benutzer</p>
          <p className="text-2xl font-bold">{activeUsersCount}</p>
        </div>
      </Card>
      
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-accent/10 rounded-full">
          <BarChart3 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Quiz Durchschnitt</p>
          <p className="text-2xl font-bold">{quizAverage}%</p>
        </div>
      </Card>
    </div>
  );
};