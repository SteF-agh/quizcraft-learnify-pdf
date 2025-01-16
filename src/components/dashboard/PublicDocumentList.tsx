import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  content_type?: string;
  is_public: boolean;
  assigned_to: string[];
}

interface PublicDocumentListProps {
  onDocumentAssigned?: () => void;
}

export const PublicDocumentList = ({ onDocumentAssigned }: PublicDocumentListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPublicDocuments = async () => {
    try {
      console.log('Fetching public documents...');
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Fehler beim Laden der Dokumente');
        return;
      }

      console.log('Fetched public documents:', documents);
      setDocuments(documents || []);
    } catch (error) {
      console.error('Error in fetchPublicDocuments:', error);
      toast.error('Fehler beim Laden der Dokumente');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDocument = async (documentId: string) => {
    try {
      console.log('Assigning document:', documentId);
      
      // Get the current document's assigned_to array
      const { data: currentDoc } = await supabase
        .from('documents')
        .select('assigned_to')
        .eq('id', documentId)
        .single();

      if (!currentDoc) {
        console.error('Document not found');
        toast.error('Dokument nicht gefunden');
        return;
      }

      // For testing purposes, we'll use a fixed test user ID
      const testUserId = '00000000-0000-0000-0000-000000000000';
      
      // Create a new array with the test user ID added
      const newAssignedTo = [...(currentDoc.assigned_to || []), testUserId];

      // Update the document with the new assigned_to array
      const { error: updateError } = await supabase
        .from('documents')
        .update({ assigned_to: newAssignedTo })
        .eq('id', documentId);

      if (updateError) {
        console.error('Error updating document:', updateError);
        toast.error('Fehler beim Zuweisen des Dokuments');
        return;
      }

      console.log('Document assigned successfully');
      toast.success('Dokument erfolgreich zugewiesen');
      onDocumentAssigned?.();
    } catch (error) {
      console.error('Error in handleAssignDocument:', error);
      toast.error('Fehler beim Zuweisen des Dokuments');
    }
  };

  useEffect(() => {
    fetchPublicDocuments();
  }, []);

  if (loading) {
    return <div>Lade Dokumente...</div>;
  }

  if (!documents.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Keine öffentlichen Dokumente verfügbar</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border min-w-[800px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead className="w-[100px]">Größe</TableHead>
              <TableHead className="w-[150px]">Upload Datum</TableHead>
              <TableHead className="w-[170px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                </TableCell>
                <TableCell>
                  {new Date(doc.created_at).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAssignDocument(doc.id)}
                  >
                    Hinzufügen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};