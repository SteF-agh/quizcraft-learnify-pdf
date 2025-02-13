
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { FileText } from "lucide-react";

interface UploadZoneProps {
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
}

export const UploadZone = ({
  isUploading,
  onFileSelect,
  dragActive,
  handleDrag,
  handleDrop,
}: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 transition-colors
        ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
        ${isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        disabled={isUploading}
        className="hidden"
      />
      
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isUploading ? "Upload läuft..." : "PDF hier ablegen"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            PDF Dateien bis 10MB
          </p>
        </div>
        <Button variant="outline" disabled={isUploading}>
          PDF auswählen
        </Button>
      </div>
    </div>
  );
};
