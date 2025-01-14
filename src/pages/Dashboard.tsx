import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { ActiveQuizzes } from "@/components/dashboard/ActiveQuizzes";
import { Achievements } from "@/components/dashboard/Achievements";
import { Header } from "@/components/dashboard/Header";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { LearningModeSelector } from "@/components/dashboard/LearningModeSelector";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [progress] = useState(65);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [learningMode, setLearningMode] = useState<"quiz" | "flashcards" | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error("Failed to load documents");
        return;
      }

      setDocuments(data || []);
    };

    fetchDocuments();
  }, []);

  const handleStartLearning = () => {
    if (!selectedDocument) {
      toast.error("Please select a document first");
      return;
    }
    if (!learningMode) {
      toast.error("Please select a learning mode");
      return;
    }

    if (learningMode === "quiz") {
      navigate(`/quiz?documentId=${selectedDocument}`);
    } else {
      toast.info("Flashcards feature coming soon!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-16 space-y-12">
        <UploadSection />
        
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-secondary">Your Documents</h2>
          <DocumentList
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
          />
          {documents.length > 0 && (
            <LearningModeSelector
              selectedDocument={selectedDocument}
              learningMode={learningMode}
              onModeChange={setLearningMode}
              onStartLearning={handleStartLearning}
            />
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <ProgressCard progress={progress} />
          <ActiveQuizzes />
          <Achievements />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;