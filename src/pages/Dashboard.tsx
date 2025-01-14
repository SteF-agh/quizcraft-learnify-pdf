import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { ActiveQuizzes } from "@/components/dashboard/ActiveQuizzes";
import { Achievements } from "@/components/dashboard/Achievements";
import { Header } from "@/components/dashboard/Header";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
        <WelcomeSection />
        
        <div className="grid lg:grid-cols-3 gap-8">
          <ProgressCard progress={progress} />
          <ActiveQuizzes />
          <Achievements />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow 
                  key={doc.id} 
                  className={selectedDocument === doc.id ? "bg-primary/10" : ""}
                  onClick={() => setSelectedDocument(doc.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <RadioGroup value={selectedDocument || ""}>
                      <RadioGroupItem value={doc.id} id={doc.id} />
                    </RadioGroup>
                  </TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {selectedDocument && (
            <div className="mt-8 p-6 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Choose Learning Mode</h3>
              <RadioGroup
                value={learningMode || ""}
                onValueChange={(value) => setLearningMode(value as "quiz" | "flashcards")}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quiz" id="quiz" />
                  <Label htmlFor="quiz">Quiz</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="flashcards" id="flashcards" />
                  <Label htmlFor="flashcards">Lernkarten</Label>
                </div>
              </RadioGroup>

              <Button
                onClick={handleStartLearning}
                className="mt-6"
                disabled={!selectedDocument || !learningMode}
              >
                Start Learning
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;