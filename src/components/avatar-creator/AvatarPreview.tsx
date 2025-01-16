import { Card } from "@/components/ui/card";

interface AvatarPreviewProps {
  selectedOptions: {
    type: string;
    [key: string]: string;
  };
}

export const AvatarPreview = ({ selectedOptions }: AvatarPreviewProps) => {
  const getAvatarTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      human: "Mensch",
      fantasy: "Fantasy-Wesen",
      monster: "Monster",
      robot: "Roboter"
    };
    return types[type] || type;
  };

  return (
    <Card className="p-6 flex items-center justify-center">
      <div className="w-48 h-48 bg-secondary/20 rounded-full flex flex-col items-center justify-center">
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold mb-2">
            Typ: {getAvatarTypeLabel(selectedOptions.type)}
          </div>
          {Object.entries(selectedOptions)
            .filter(([key]) => key !== 'type')
            .map(([category, option]) => (
              <div key={category}>
                {category}: {option}
              </div>
          ))}
        </div>
      </div>
    </Card>
  );
};