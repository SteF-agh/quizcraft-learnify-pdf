import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Fehler beim Laden der Dokumente');
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error in fetchDocuments:', error);
      toast.error('Fehler beim Laden der Dokumente');
    }
  }, []);

  const handleDocumentDeleted = () => {
    setSelectedDocument(null);
    fetchDocuments();
  };

  return {
    documents,
    selectedDocument,
    setSelectedDocument,
    fetchDocuments,
    handleDocumentDeleted
  };
};