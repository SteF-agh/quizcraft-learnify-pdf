import { Card } from "@/components/ui/card";

interface AvatarPreviewProps {
  selectedOptions: {
    [key: string]: string;
  };
}

export const AvatarPreview = ({ selectedOptions }: AvatarPreviewProps) => {
  return (
    <Card className="p-6 flex items-center justify-center">
      <div className="w-48 h-48 bg-secondary/20 rounded-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Avatar Preview
          {Object.entries(selectedOptions).map(([category, option]) => (
            <div key={category}>
              {category}: {option}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};