import { FileUpload } from "@/components/FileUpload";

export const WelcomeSection = () => {
  return (
    <div className="mt-8 bg-white/50 rounded-2xl p-12 shadow-lg">
      <div className="space-y-8">
        <p className="text-xl text-muted-foreground leading-relaxed">
          Upload your PDF documents and let our AI generate engaging quiz questions to enhance your learning experience.
        </p>
        <div className="space-y-4">
          <FileUpload />
        </div>
      </div>
    </div>
  );
};