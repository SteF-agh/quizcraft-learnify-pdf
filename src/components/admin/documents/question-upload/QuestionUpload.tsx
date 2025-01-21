import { useState } from "react";
import { FileInput } from "./components/FileInput";
import { handleQuestionFileUpload } from "./utils/uploadHandler";

interface QuestionUploadProps {
  documentId: string;
  onUploadSuccess: () => void;
}

export const QuestionUpload = ({ documentId, onUploadSuccess }: QuestionUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const success = await handleQuestionFileUpload(file, documentId);
    if (success) {
      onUploadSuccess();
    }
    setIsUploading(false);
  };

  return <FileInput isUploading={isUploading} onFileSelect={handleFileSelect} />;
};