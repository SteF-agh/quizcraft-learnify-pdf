import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ProgressCardProps {
  progress: number;
}

export const ProgressCard = ({ progress }: ProgressCardProps) => {
  return (
    <Card className="p-8 space-y-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-2xl font-bold text-secondary">Dein Fortschritt</h2>
      <Progress value={progress} className="h-3 rounded-lg" />
      <p className="text-lg font-medium text-muted-foreground">{progress}% abgeschlossen</p>
      <div className="flex gap-3">
        <Badge variant="secondary" className="px-4 py-1 text-base">Level 5</Badge>
        <Badge variant="default" className="px-4 py-1 text-base">500 Punkte</Badge>
      </div>
    </Card>
  );
};