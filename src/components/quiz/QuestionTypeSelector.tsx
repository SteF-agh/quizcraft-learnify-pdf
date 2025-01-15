import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type QuestionType = 'all' | 'multiple-choice' | 'true-false' | 'open' | 'matching' | 'fill-in';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
}

export const QuestionTypeSelector = ({
  selectedType,
  onTypeSelect,
}: QuestionTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-primary">Wähle den Fragentyp</h3>
      <RadioGroup
        value={selectedType}
        onValueChange={(value) => onTypeSelect(value as QuestionType)}
        className="grid grid-cols-2 gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">Alle Typen gemischt</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="multiple-choice" id="multiple-choice" />
          <Label htmlFor="multiple-choice">Multiple Choice</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true-false" id="true-false" />
          <Label htmlFor="true-false">Wahr/Falsch</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="open" id="open" />
          <Label htmlFor="open">Offene Fragen</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="matching" id="matching" />
          <Label htmlFor="matching">Zuordnung</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="fill-in" id="fill-in" />
          <Label htmlFor="fill-in">Lückentext</Label>
        </div>
      </RadioGroup>
    </div>
  );
};