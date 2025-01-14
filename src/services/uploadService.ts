import { supabase } from "@/integrations/supabase/client";

const sanitizeFileName = (fileName: string): string => {
  // Remove special characters and spaces, replace umlauts
  return fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[äÄ]/g, 'ae')
    .replace(/[öÖ]/g, 'oe')
    .replace(/[üÜ]/g, 'ue')
    .replace(/[ß]/g, 'ss')
    .replace(/[^a-zA-Z0-9.-]/g, '_');  // Replace other special chars with underscore
};

export const uploadPdfToStorage = async (file: File) => {
  console.log("Starting file upload:", file.name);
  
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

export const saveDocumentToDatabase = async (name: string, filePath: string) => {
  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      name: name,  // Keep original name for display
      file_path: filePath,
    });

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }
};