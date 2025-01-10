import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export const ActiveQuizzes = () => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-secondary">Aktive Quizze</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="w-full justify-between" onClick={() => window.location.href = '/quiz'}>
            <span>Mathematik Quiz</span>
            <Badge variant="default">Neu</Badge>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <span>Deutsch Quiz</span>
          <Badge variant="secondary">In Bearbeitung</Badge>
        </div>
      </div>
    </Card>
  );
};