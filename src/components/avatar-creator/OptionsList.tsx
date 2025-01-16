import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AvatarOption {
  id: string;
  name: string;
  preview?: string;
}

interface OptionsListProps {
  options: AvatarOption[];
  selectedOption: string;
  onSelect: (id: string) => void;
}

export const OptionsList = ({ options, selectedOption, onSelect }: OptionsListProps) => {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOption === option.id ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onSelect(option.id)}
          >
            {option.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};