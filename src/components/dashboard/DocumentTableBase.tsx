import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
}

export interface DocumentTableBaseProps {
  documents: Document[];
  showActions?: boolean;
  onDocumentDeleted?: () => void;
}

export const DocumentTableBase = ({
  documents,
  showActions = false,
  onDocumentDeleted
}: DocumentTableBaseProps) => {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Dokument erfolgreich gelöscht");
      if (onDocumentDeleted) {
        onDocumentDeleted();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Fehler beim Löschen des Dokuments");
    }
  };

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Größe</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Datum</th>
              {showActions && (
                <th className="h-12 px-4 text-left align-middle font-medium">Aktionen</th>
              )}
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td className="p-4 align-middle">{doc.name}</td>
                <td className="p-4 align-middle">{formatFileSize(doc.file_size)}</td>
                <td className="p-4 align-middle">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="p-4 align-middle">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Löschen
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};