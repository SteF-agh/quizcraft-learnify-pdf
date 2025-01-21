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
        accept=".json,.xlsx,.xls,.csv"
        onChange={onFileSelect}
        disabled={isUploading}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          disabled:opacity-50 disabled:cursor-not-allowed"
        id="question-upload"
      />
    </div>
  );
};