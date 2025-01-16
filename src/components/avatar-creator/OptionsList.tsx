import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "@/components/ui/image";

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
            className="w-full justify-start gap-4"
            onClick={() => onSelect(option.id)}
          >
            {option.preview && (
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img 
                  src={option.preview} 
                  alt={option.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {option.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};