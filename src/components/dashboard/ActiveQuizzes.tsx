import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export const ActiveQuizzes = () => {
  return (
    <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow h-full">
      <h3 className="text-xl font-bold text-secondary">Aktive Quizze</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="w-full justify-between text-base font-medium hover:bg-primary/10" 
            onClick={() => window.location.href = '/quiz'}
          >
            <span>Mathematik Quiz</span>
            <Badge variant="default" className="ml-2">Neu</Badge>
          </Button>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-base font-medium">Deutsch Quiz</span>
          <Badge variant="secondary">In Bearbeitung</Badge>
        </div>
      </div>
    </Card>
  );
};