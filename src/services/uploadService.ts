import { supabase } from "@/integrations/supabase/client";

export const uploadPdfToStorage = async (file: File) => {
  console.log("Starting file upload:", file.name);
  
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('pdfs')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  return { fileName, uploadData };
};

export const saveDocumentToDatabase = async (name: string, filePath: string) => {
  const { error: dbError } = await supabase
    .from('documents')
    .insert({
      name: name,
      file_path: filePath,
    });

  if (dbError) throw dbError;
};