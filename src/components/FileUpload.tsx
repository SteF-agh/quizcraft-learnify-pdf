import { UploadZone } from "./upload/UploadZone";
import { useFileUpload } from "@/hooks/useFileUpload";

export const FileUpload = () => {
  const {
    dragActive,
    isUploading,
    handleDrag,
    handleDrop,
    handleUpload
  } = useFileUpload();

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