import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/dashboard/Footer";
import { DocumentSection } from "@/components/dashboard/DocumentSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { useDocuments } from "@/hooks/useDocuments";

const Dashboard = () => {
  const [progress] = useState(65);
  const navigate = useNavigate();
  const {
    documents,
    selectedDocument,
    setSelectedDocument,
    fetchDocuments,
    handleDocumentDeleted
  } = useDocuments();

  const handleStartLearning = () => {
    if (!selectedDocument) {
      toast.error("Bitte wähle zuerst ein Dokument aus");
      return;
    }
    navigate(`/quiz?documentId=${selectedDocument}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32">
        <h1 className="text-3xl font-bold mb-8">Willkommen zurück, Steffi!</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <DocumentSection
            documents={documents}
            selectedDocument={selectedDocument}
            onSelectDocument={setSelectedDocument}
            onDocumentDeleted={handleDocumentDeleted}
            onStartLearning={handleStartLearning}
          />
          <StatsSection progress={progress} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;