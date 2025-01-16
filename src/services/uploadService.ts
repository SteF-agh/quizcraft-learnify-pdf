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

export const uploadImageToStorage = async (file: File) => {
  console.log("Starting image upload:", file.name);
  
  const sanitizedName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${sanitizedName}`;
  
  console.log("Sanitized file name:", fileName);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  return { fileName, uploadData };
};

type AvatarImage = {
  name: string;
  file_path: string;
  file_size: number;
  content_type: string;
};

export const saveImageToDatabase = async (name: string, filePath: string, file: File) => {
  console.log("Saving image metadata to database:", {
    name,
    filePath,
    size: file.size,
    type: file.type
  });

  const { error: dbError } = await supabase
    .from('avatar_images')
    .insert<AvatarImage>({
      name: name,
      file_path: filePath,
      file_size: file.size,
      content_type: file.type
    });

  if (dbError) {
    console.error("Database error:", dbError);
    throw dbError;
  }
};