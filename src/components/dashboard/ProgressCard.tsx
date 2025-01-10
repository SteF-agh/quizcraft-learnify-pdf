import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ProgressCardProps {
  progress: number;
}

export const ProgressCard = ({ progress }: ProgressCardProps) => {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-secondary">Dein Fortschritt</h2>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-muted-foreground">{progress}% abgeschlossen</p>
      <div className="flex gap-2">
        <Badge variant="secondary">Level 5</Badge>
        <Badge variant="default">500 Punkte</Badge>
      </div>
    </Card>
  );
};