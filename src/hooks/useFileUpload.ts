
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadDocumentToStorage, saveDocumentToDatabase } from "@/services/uploadService";

export const useFileUpload = (onUploadSuccess?: () => void) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
        title: "Ungültiger Dateityp",
        description: "Bitte laden Sie eine PDF-Datei hoch",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Datei zu groß",
        description: "Die Datei darf nicht größer als 10MB sein",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { fileName, uploadData } = await uploadDocumentToStorage(file);
      await saveDocumentToDatabase(file.name, fileName, file);

      console.log("Document uploaded successfully:", uploadData);
      toast({
        title: "Erfolgreich!",
        description: "Ihr Dokument wurde erfolgreich hochgeladen.",
      });
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload fehlgeschlagen",
        description: "Beim Hochladen ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
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
