import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";

interface UploadSectionProps {
  onUploadSuccess: () => void;
}

export const UploadSection = ({ onUploadSuccess }: UploadSectionProps) => {
  return (
    <Card className="p-6 col-span-1">
      <h2 className="text-xl font-semibold mb-4">Neues Skript hochladen</h2>
      <p className="text-muted-foreground mb-4">
        Lade hier neue Skripte hoch, die dann allen Teilnehmern zur Verfügung stehen
      </p>
      <FileUpload onUploadSuccess={onUploadSuccess} />
    </Card>
  );
};