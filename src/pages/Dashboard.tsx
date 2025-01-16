import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { DocumentSection } from "@/components/dashboard/DocumentSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { useDocuments } from "@/hooks/useDocuments";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Coins } from "lucide-react";

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src="/lovable-uploads/60caa0e3-5b9f-443e-b211-5be575e4e3f7.png" />
            <AvatarFallback>SF</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">
            Willkommen zurück, <span className="text-primary">Stefanie Feurstein</span>!
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-semibold">2,500</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold">12</span>
          </div>
        </div>
      </div>
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