import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

interface LearningSelectorProps {
  selectedDocument: string | null;
  onStartLearning: () => void;
}

export const LearningModeSelector = ({
  selectedDocument,
  onStartLearning
}: LearningSelectorProps) => {
  return (
    <div className="p-6 border rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
      <Button
        onClick={onStartLearning}
        className="w-full transition-all hover:scale-[1.02] gap-2"
        disabled={!selectedDocument}
      >
        <GraduationCap className="h-5 w-5" />
        Lernen starten
      </Button>
    </div>
  );
};