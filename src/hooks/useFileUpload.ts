import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { uploadImageToStorage, saveImageToDatabase } from "@/services/uploadService";

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
    if (!file || !file.type.includes('image')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, or GIF)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { fileName, uploadData } = await uploadImageToStorage(file);
      await saveImageToDatabase(file.name, fileName, file);

      console.log("Image uploaded successfully:", uploadData);
      toast({
        title: "Success!",
        description: "Your avatar image has been uploaded successfully.",
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image. Please try again.",
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