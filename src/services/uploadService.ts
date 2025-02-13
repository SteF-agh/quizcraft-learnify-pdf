
import { supabase } from "@/integrations/supabase/client";

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-zA-Z0-9.-]/g, '_');  // Replace other special chars with underscore
};

export const uploadDocumentToStorage = async (file: File) => {
  console.log("Starting document upload:", file.name);
  
  const sanitizedName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${sanitizedName}`;
  
  console.log("Sanitized file name:", fileName);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  return { fileName, uploadData };
};

type Document = {
  name: string;
  file_path: string;
  file_size: number;
  content_type: string;
  is_public: boolean;
};

export const saveDocumentToDatabase = async (name: string, filePath: string, file: File) => {
  console.log("Saving document metadata to database:", {
    name,
    filePath,
    size: file.size,
    type: file.type
  });

  const { error: dbError } = await supabase
    .from('documents')
    .insert<Document>({
      name: name,
      file_path: filePath,
      file_size: file.size,
      content_type: file.type,
      is_public: false
    });

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }
};
