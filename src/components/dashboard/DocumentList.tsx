import { TableCell, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Table, TableBody, TableHead, TableHeader } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
      // First delete related flashcards
      const { error: flashcardsError } = await supabase
        .from('flashcards')
        .delete()
        .eq('document_id', doc.id);

      if (flashcardsError) {
        console.error('Error deleting related flashcards:', flashcardsError);
        toast.error('Fehler beim Löschen der zugehörigen Lernkarten');
        return;
      }

      // Then delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('pdfs')
        .remove([doc.file_path]);

      if (storageError) {
        console.error('Error deleting file from storage:', storageError);
        toast.error('Fehler beim Löschen der Datei aus dem Speicher');
        return;
      }

      // Finally delete the document record
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
    return (
      <div className="text-center py-8 space-y-3">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
        <div className="space-y-1">
          <p className="text-lg font-medium">Keine Dokumente vorhanden</p>
          <p className="text-sm text-muted-foreground">
            Laden Sie ein neues Dokument hoch, um zu beginnen
          </p>
        </div>
      </div>
    );
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
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}</TableCell>
                <TableCell>
                  {new Date(doc.created_at).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Dokument löschen</AlertDialogTitle>
                        <AlertDialogDescription>
                          Möchten Sie dieses Dokument wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
                          Alle zugehörigen Lernkarten werden ebenfalls gelöscht.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                          Abbrechen
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => handleDelete(doc, e)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Löschen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};