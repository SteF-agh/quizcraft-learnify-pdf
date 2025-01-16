import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { DocumentTableBase } from "./DocumentTableBase";

interface PublicDocumentListProps {
  onDocumentAssigned: () => void;
}

export const PublicDocumentList = ({ onDocumentAssigned }: PublicDocumentListProps) => {
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

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

  const handleAssignDocuments = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Bitte wähle mindestens ein Dokument aus');
      return;
    }

    setIsAssigning(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Du musst eingeloggt sein, um Dokumente hinzuzufügen');
        return;
      }

      for (const documentId of selectedDocuments) {
        const { data: document, error: fetchError } = await supabase
          .from('documents')
          .select('assigned_to')
          .eq('id', documentId)
          .single();

        if (fetchError) {
          console.error('Error fetching document:', fetchError);
          continue;
        }

        const newAssignedTo = [...(document.assigned_to || []), user.id];

        const { error: updateError } = await supabase
          .from('documents')
          .update({ assigned_to: newAssignedTo })
          .eq('id', documentId);

        if (updateError) {
          console.error('Error updating document:', updateError);
          continue;
        }
      }

      toast.success('Dokumente erfolgreich hinzugefügt');
      setSelectedDocuments([]);
      onDocumentAssigned();
    } catch (error) {
      console.error('Error assigning documents:', error);
      toast.error('Fehler beim Hinzufügen der Dokumente');
    } finally {
      setIsAssigning(false);
    }
  };

  const toggleDocument = (documentId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  if (isLoading) {
    return <div>Lade Dokumente...</div>;
  }

  return (
    <div className="space-y-4">
      <DocumentTableBase 
        headers={['Auswählen', 'Name', 'Upload Date', 'Actions']}
        emptyMessage="Keine öffentlichen Dokumente verfügbar"
      >
        {publicDocuments.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <Checkbox
                checked={selectedDocuments.includes(doc.id)}
                onCheckedChange={() => toggleDocument(doc.id)}
              />
            </TableCell>
            <TableCell>{doc.name}</TableCell>
            <TableCell>
              {new Date(doc.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDocument(doc.id)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {selectedDocuments.includes(doc.id) ? 'Ausgewählt' : 'Auswählen'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </DocumentTableBase>
      
      {selectedDocuments.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={handleAssignDocuments}
            disabled={isAssigning}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {selectedDocuments.length} {selectedDocuments.length === 1 ? 'Dokument' : 'Dokumente'} hinzufügen
          </Button>
        </div>
      )}
    </div>
  );
};