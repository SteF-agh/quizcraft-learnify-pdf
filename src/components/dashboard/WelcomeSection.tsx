import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export const WelcomeSection = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      console.log("Starting file upload:", file.name);
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) {
        throw error;
      }

      console.log("File uploaded successfully:", data);

      toast({
        title: "File uploaded successfully",
        description: "Your PDF is being processed. Questions will be generated shortly.",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error uploading file",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-8 grid lg:grid-cols-2 gap-16 items-center bg-white/50 rounded-2xl p-12 shadow-lg">
      <div className="space-y-8">
        <h2 className="text-5xl font-bold leading-tight">
          Willkommen bei LeeonQuiz –
          <span className="text-primary block mt-2">Lernen mit Spaß!</span>
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Upload your PDF documents and let our AI generate engaging quiz questions to enhance your learning experience.
        </p>
        <div className="space-y-4">
          <FileUpload
            onUpload={handleFileUpload}
            isUploading={isUploading}
            accept=".pdf"
          />
        </div>
      </div>

      <div className="lg:block relative">
        <img
          src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
          alt="Leeon Mascot"
          className="w-full max-w-md mx-auto transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};