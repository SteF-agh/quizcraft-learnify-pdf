import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmptyDocumentState } from "./document-list/EmptyDocumentState";
import { DocumentRow } from "./document-list/DocumentRow";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  content_type?: string;
  file_path: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
  onDocumentDeleted?: () => void;
}

export const DocumentList = ({ 
  documents, 
  selectedDocument, 
  onSelectDocument,
  onDocumentDeleted 
}: DocumentListProps) => {
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

  if (!documents.length) {
    return <EmptyDocumentState />;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Auswahl</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Größe</TableHead>
              <TableHead>Upload Datum</TableHead>
              <TableHead className="w-[100px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                isSelected={selectedDocument === doc.id}
                onSelect={() => onSelectDocument(doc.id)}
                onDelete={(e) => handleDelete(doc, e)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};