
import { FileUpload } from "@/components/FileUpload";

interface UploadSectionProps {
  onUploadSuccess: () => void;
}

export const UploadSection = ({ onUploadSuccess }: UploadSectionProps) => {
  return (
    <div className="w-full">
      <FileUpload onUploadSuccess={onUploadSuccess} />
    </div>
  );
};
