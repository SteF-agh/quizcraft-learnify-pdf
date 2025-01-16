import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  file_path: string;
}

export const useDeleteHandler = (onDocumentDeleted?: () => void) => {
  const handleDelete = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Attempting to delete document:', doc.id);

    try {
      const { error: flashcardsError } = await supabase
        .from('flashcards')
        .delete()
        .eq('document_id', doc.id);

      if (flashcardsError) {
        console.error('Error deleting related flashcards:', flashcardsError);
        toast.error('Fehler beim Löschen der zugehörigen Lernkarten');
        return;
      }

      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        toast.error('Fehler beim Löschen der Datei aus dem Speicher');
        return;
      }

      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) {
        console.error('Error deleting document from database:', dbError);
        toast.error('Fehler beim Löschen des Dokuments aus der Datenbank');
        return;
      }

      console.log('Document successfully deleted:', doc.id);
      toast.success('Dokument erfolgreich gelöscht');
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Fehler beim Löschen des Dokuments');
    }
  };

  return handleDelete;
};