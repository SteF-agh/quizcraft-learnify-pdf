import { Button } from "@/components/ui/button";

interface FileInputProps {
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileInput = ({ isUploading, onFileSelect }: FileInputProps) => {
  return (
    <div className="mt-4">
      <input
        type="file"
        accept=".json"
        onChange={onFileSelect}
        disabled={isUploading}
        className="hidden"
        id="question-upload"
      />
      <label htmlFor="question-upload">
        <Button
          variant="outline"
          disabled={isUploading}
          className="cursor-pointer"
          asChild
        >
          <span>
            {isUploading ? "Lade Fragen hoch..." : "Fragen aus JSON-Datei hochladen"}
          </span>
        </Button>
      </label>
    </div>
  );
};