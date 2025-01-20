import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  isGenerating: boolean;
  generationProgress: number;
}

export const GenerationProgress = ({ isGenerating, generationProgress }: GenerationProgressProps) => {
  if (!isGenerating) return null;

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold mb-2">Generiere Quizfragen...</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Bitte haben Sie etwas Geduld, während die KI Quizfragen für das ausgewählte Skript erstellt.
        Dies kann einige Minuten dauern.
      </p>
      <Progress value={generationProgress} className="w-full" />
      <p className="text-sm text-muted-foreground mt-2">
        {generationProgress}% abgeschlossen
      </p>
    </Card>
  );
};