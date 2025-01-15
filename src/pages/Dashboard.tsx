import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
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
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Willkommen zurück, Steffi!</h1>
      <div className="space-y-12">
        <DocumentSection
          documents={documents}
          selectedDocument={selectedDocument}
          onSelectDocument={setSelectedDocument}
          onDocumentDeleted={handleDocumentDeleted}
          onStartLearning={handleStartLearning}
        />
        <StatsSection progress={progress} />
      </div>
    </Layout>
  );
};

export default Dashboard;