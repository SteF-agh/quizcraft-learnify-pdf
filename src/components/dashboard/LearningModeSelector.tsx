import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface LearningSelectorProps {
  selectedDocument: string | null;
  learningMode: "quiz" | "flashcards" | null;
  onModeChange: (mode: "quiz" | "flashcards") => void;
  onStartLearning: () => void;
}

export const LearningModeSelector = ({
  selectedDocument,
  learningMode,
  onModeChange,
  onStartLearning
}: LearningSelectorProps) => {
  return (
    <div className="p-6 border rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-secondary">Lernmodus wählen</h3>
      <RadioGroup
        value={learningMode || ""}
        onValueChange={(value) => onModeChange(value as "quiz" | "flashcards")}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 hover:bg-primary/5 p-2 rounded-lg transition-colors">
          <RadioGroupItem value="quiz" id="quiz" />
          <Label htmlFor="quiz" className="cursor-pointer">Quiz</Label>
        </div>
        <div className="flex items-center space-x-2 hover:bg-primary/5 p-2 rounded-lg transition-colors">
          <RadioGroupItem value="flashcards" id="flashcards" />
          <Label htmlFor="flashcards" className="cursor-pointer">Lernkarten</Label>
        </div>
      </RadioGroup>

      <Button
        onClick={onStartLearning}
        className="mt-6 w-full transition-all hover:scale-[1.02]"
        disabled={!selectedDocument || !learningMode}
      >
        Lernen starten
      </Button>
    </div>
  );
};