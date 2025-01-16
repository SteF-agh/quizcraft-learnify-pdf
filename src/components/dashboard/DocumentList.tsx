import { TableCell, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DocumentTableBase } from "./DocumentTableBase";
import { formatFileSize } from "@/utils/formatters";

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

    try {
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

      toast.success('Dokument erfolgreich gelöscht');
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Fehler beim Löschen des Dokuments');
    }
  };

  return (
    <DocumentTableBase 
      headers={['Select', 'Name', 'Size', 'Upload Date', 'Actions']}
      emptyMessage="Keine eigenen Dokumente verfügbar"
    >
      {documents.map((doc) => (
        <TableRow 
          key={doc.id} 
          className={selectedDocument === doc.id ? "bg-primary/10" : ""}
          onClick={() => onSelectDocument(doc.id)}
          style={{ cursor: 'pointer' }}
        >
          <TableCell>
            <RadioGroup value={selectedDocument || ""}>
              <RadioGroupItem value={doc.id} id={doc.id} />
            </RadioGroup>
          </TableCell>
          <TableCell>{doc.name}</TableCell>
          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
          <TableCell>
            {new Date(doc.created_at).toLocaleDateString()}
          </TableCell>
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => handleDelete(doc, e)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </DocumentTableBase>
  );
};