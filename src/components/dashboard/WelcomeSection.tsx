import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const WelcomeSection = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement file upload to Supabase
      toast({
        title: "File uploaded successfully",
        description: "Your PDF is being processed. Questions will be generated shortly.",
      });
    } catch (error) {
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
    <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-5xl font-bold leading-tight">
          Willkommen bei LeeonQuiz –
          <span className="text-primary"> Lernen mit Spaß!</span>
        </h2>
        <p className="text-lg text-muted-foreground">
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
          className="w-full max-w-md mx-auto transition-transform duration-500"
        />
      </div>
    </div>
  );
};