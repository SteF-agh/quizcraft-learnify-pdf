import { FileUpload } from "@/components/FileUpload";

interface UploadSectionProps {
  onUploadSuccess?: () => void;
}

export const UploadSection = ({ onUploadSuccess }: UploadSectionProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Upload your PDF documents and let our AI generate engaging quiz questions.
        </p>
        <div>
          <FileUpload onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
    </div>
  );
};