import { Progress } from "@/components/ui/progress";

interface GenerationProgressProps {
  isGenerating: boolean;
  generationProgress: number;
}

export const GenerationProgress = ({ isGenerating, generationProgress }: GenerationProgressProps) => {
  if (!isGenerating) return null;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Quiz wird generiert...</p>
        <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
      </div>
      <Progress value={generationProgress} className="w-full" />
    </div>
  );
};