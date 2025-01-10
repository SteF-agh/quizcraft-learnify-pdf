import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const Index = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(65);
  const [showLevelAnimation, setShowLevelAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation when progress reaches certain thresholds (e.g., every 20%)
    if (progress > 0 && progress % 20 === 0) {
      setShowLevelAnimation(true);
      setTimeout(() => setShowLevelAnimation(false), 1000);
    }
  }, [progress]);

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
      <header className="fixed top-0 left-0 right-0 border-b border-border/50 bg-white/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/44addff5-511d-4fae-a8bc-f8ab538c69fc.png"
                alt="LeeonQuiz Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-bold text-secondary">LeeonQuiz</h1>
            </div>
            <nav>
              <Button variant="ghost" className="text-secondary hover:text-primary">Login</Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Section */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-secondary">Dein Fortschritt</h2>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">{progress}% abgeschlossen</p>
            <div className="flex gap-2">
              <Badge variant="secondary">Level 5</Badge>
              <Badge variant="default">500 Punkte</Badge>
            </div>
          </Card>

          {/* Active Quizzes */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-secondary">Aktive Quizze</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Mathematik Quiz</span>
                <Badge variant="secondary">Neu</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Deutsch Quiz</span>
                <Badge variant="default">In Bearbeitung</Badge>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-secondary">Errungenschaften</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-primary-20 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-center">Erste Schritte</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-secondary-20 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs text-center">Schnell wie der Blitz</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-accent-20 flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-xs text-center">Bücherwurm</span>
              </div>
            </div>
          </Card>
        </div>

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
              className={`w-full max-w-md mx-auto transition-transform duration-500 ${
                showLevelAnimation ? 'animate-level-complete' : ''
              }`}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;