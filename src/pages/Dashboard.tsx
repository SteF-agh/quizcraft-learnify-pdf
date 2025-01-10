import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { ActiveQuizzes } from "@/components/dashboard/ActiveQuizzes";
import { Achievements } from "@/components/dashboard/Achievements";
import { Header } from "@/components/dashboard/Header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const [progress] = useState(65);
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        return;
      }

      setDocuments(data || []);
    };

    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-16 space-y-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <ProgressCard progress={progress} />
          <ActiveQuizzes />
          <Achievements />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Documents</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    {new Date(doc.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;