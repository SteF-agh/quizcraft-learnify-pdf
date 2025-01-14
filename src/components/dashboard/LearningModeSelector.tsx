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
    <div className="mt-8 p-6 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Choose Learning Mode</h3>
      <RadioGroup
        value={learningMode || ""}
        onValueChange={(value) => onModeChange(value as "quiz" | "flashcards")}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="quiz" id="quiz" />
          <Label htmlFor="quiz">Quiz</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="flashcards" id="flashcards" />
          <Label htmlFor="flashcards">Lernkarten</Label>
        </div>
      </RadioGroup>

      <Button
        onClick={onStartLearning}
        className="mt-6"
        disabled={!selectedDocument || !learningMode}
      >
        Start Learning
      </Button>
    </div>
  );
};