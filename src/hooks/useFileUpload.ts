import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uploadPdfToStorage, saveDocumentToDatabase } from "@/services/uploadService";

export const useFileUpload = (onUploadSuccess?: () => void) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!file || !file.type.includes('pdf')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { fileName, uploadData } = await uploadPdfToStorage(file);
      await saveDocumentToDatabase(file.name, fileName);

      console.log("File uploaded successfully:", uploadData);
      toast({
        title: "Success!",
        description: "Your PDF has been uploaded successfully.",
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      await handleUpload(files[0]);
    }
  };

  return {
    dragActive,
    isUploading,
    handleDrag,
    handleDrop,
    handleUpload
  };
};