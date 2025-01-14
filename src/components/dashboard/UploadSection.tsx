import { FileUpload } from "@/components/FileUpload";

interface UploadSectionProps {
  onUploadSuccess?: () => void;
}

export const UploadSection = ({ onUploadSuccess }: UploadSectionProps) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg transition-all hover:shadow-xl">
      <div className="space-y-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Upload your PDF documents and let our AI generate engaging quiz questions to enhance your learning experience.
        </p>
        <div>
          <FileUpload onUploadSuccess={onUploadSuccess} />
        </div>
      </div>
    </div>
  );
};