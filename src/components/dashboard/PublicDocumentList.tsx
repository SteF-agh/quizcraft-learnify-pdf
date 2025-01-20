import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentTable } from "./public-document-list/DocumentTable";

interface Document {
  id: string;
  name: string;
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

      const testUserId = '00000000-0000-0000-0000-000000000000';
      const newAssignedTo = [...(currentDoc.assigned_to || []), testUserId];

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

  return <DocumentTable documents={documents} onAssignDocument={handleAssignDocument} />;
};