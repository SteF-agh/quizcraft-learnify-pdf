import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface PublicDocumentListProps {
  onDocumentAssigned: () => void;
}

export const PublicDocumentList = ({ onDocumentAssigned }: PublicDocumentListProps) => {
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: publicDocuments = [], isLoading } = useQuery({
    queryKey: ['publicDocuments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching public documents:', error);
        toast.error('Fehler beim Laden der öffentlichen Dokumente');
        return [];
      }

      return data || [];
    }
  });

  const handleAssignDocument = async (documentId: string) => {
    setIsAssigning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Du musst eingeloggt sein, um Dokumente hinzuzufügen');
        return;
      }

      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('assigned_to')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        console.error('Error fetching document:', fetchError);
        toast.error('Fehler beim Hinzufügen des Dokuments');
        return;
      }

      const newAssignedTo = [...(document.assigned_to || []), user.id];

      const { error: updateError } = await supabase
        .from('documents')
        .update({ assigned_to: newAssignedTo })
        .eq('id', documentId);

      if (updateError) {
        console.error('Error updating document:', updateError);
        toast.error('Fehler beim Hinzufügen des Dokuments');
        return;
      }

      toast.success('Dokument erfolgreich hinzugefügt');
      onDocumentAssigned();
    } catch (error) {
      console.error('Error assigning document:', error);
      toast.error('Fehler beim Hinzufügen des Dokuments');
    } finally {
      setIsAssigning(false);
    }
  };

  if (isLoading) {
    return <div>Lade Dokumente...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Upload Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {publicDocuments.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>{doc.name}</TableCell>
            <TableCell>
              {new Date(doc.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAssignDocument(doc.id)}
                disabled={isAssigning}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Hinzufügen
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {publicDocuments.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-muted-foreground">
              Keine öffentlichen Dokumente verfügbar
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};