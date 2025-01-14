import { UploadZone } from "./upload/UploadZone";
import { useFileUpload } from "@/hooks/useFileUpload";

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const {
    dragActive,
    isUploading,
    handleDrag,
    handleDrop,
    handleUpload
  } = useFileUpload(onUploadSuccess);

  return (
    <UploadZone
      isUploading={isUploading}
      onFileSelect={handleUpload}
      dragActive={dragActive}
      handleDrag={handleDrag}
      handleDrop={handleDrop}
    />
  );
};