import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Index = () => {
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/Logo.png"
                alt="LeeonQuiz Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  console.log("Logo failed to load");
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23009ee0'/%3E%3C/svg%3E";
                }}
              />
              <h1 className="text-2xl font-bold text-secondary">LeeonQuiz</h1>
            </div>
            <nav>
              <Button variant="ghost" className="text-secondary hover:text-primary">Login</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold leading-tight">
              Transform Your PDFs into
              <span className="text-primary"> Interactive Quizzes</span>
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

          <div className="lg:block">
            <img
              src="/Leeon.png"
              alt="Leeon Mascot"
              className="w-full max-w-md mx-auto"
              onError={(e) => {
                console.log("Mascot failed to load");
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23e2007a' opacity='0.1'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary">Upload PDFs</h3>
            <p className="text-muted-foreground">
              Simply upload your PDF documents and let our system process them.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-secondary-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary">AI-Generated Questions</h3>
            <p className="text-muted-foreground">
              Our AI analyzes your content and creates relevant quiz questions.
            </p>
          </Card>

          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-accent-20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary">Track Progress</h3>
            <p className="text-muted-foreground">
              Earn points, unlock badges, and compete on the leaderboard.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;