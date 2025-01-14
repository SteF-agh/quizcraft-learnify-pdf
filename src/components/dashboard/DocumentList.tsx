import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Größe nicht verfügbar';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleDelete = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection when clicking delete

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        toast.error('Fehler beim Löschen der Datei aus dem Speicher');
        return;
      }

      // Delete from database
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
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
      </TableBody>
    </Table>
  );
};