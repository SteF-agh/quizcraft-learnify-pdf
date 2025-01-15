import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ProgressCardProps {
  progress: number;
}

export const ProgressCard = ({ progress }: ProgressCardProps) => {
  return (
    <Card className="p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow h-full">
      <h3 className="text-xl font-bold text-secondary">Dein Fortschritt</h3>
      <Progress value={progress} className="h-3 rounded-lg" />
      <p className="text-lg font-medium text-muted-foreground">{progress}% abgeschlossen</p>
      <div className="flex gap-3">
        <Badge variant="secondary" className="px-3 py-1">Level 5</Badge>
        <Badge variant="default" className="px-3 py-1">500 Punkte</Badge>
      </div>
    </Card>
  );
};