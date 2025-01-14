import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { ActiveQuizzes } from "@/components/dashboard/ActiveQuizzes";
import { Achievements } from "@/components/dashboard/Achievements";
import { Header } from "@/components/dashboard/Header";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { DocumentList } from "@/components/dashboard/DocumentList";
import { LearningModeSelector } from "@/components/dashboard/LearningModeSelector";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [progress] = useState(65);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [learningMode, setLearningMode] = useState<"quiz" | "flashcards" | null>(null);
  const navigate = useNavigate();

  const fetchDocuments = useCallback(async () => {
    console.log("Fetching documents...");
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      toast.error("Failed to load documents");
      return;
    }

    console.log("Documents fetched:", data);
    setDocuments(data || []);
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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

  const handleDocumentDeleted = () => {
    setSelectedDocument(null);
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-20 pb-16 space-y-8 animate-fade-in">
        <div className="grid gap-8">
          {/* Upload and Document Management Section */}
          <div className="space-y-6">
            <UploadSection onUploadSuccess={fetchDocuments} />
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg transition-all hover:shadow-xl p-6 space-y-6">
              <h2 className="text-2xl font-bold text-secondary">Deine Dokumente</h2>
              <DocumentList
                documents={documents}
                selectedDocument={selectedDocument}
                onSelectDocument={setSelectedDocument}
                onDocumentDeleted={handleDocumentDeleted}
              />
              {documents.length > 0 && (
                <div className="pt-4">
                  <LearningModeSelector
                    selectedDocument={selectedDocument}
                    learningMode={learningMode}
                    onModeChange={setLearningMode}
                    onStartLearning={handleStartLearning}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats and Achievement Section */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <ProgressCard progress={progress} />
            </div>
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <ActiveQuizzes />
            </div>
            <div className="transform hover:scale-[1.02] transition-transform duration-300">
              <Achievements />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;