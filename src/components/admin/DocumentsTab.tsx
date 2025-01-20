import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { Switch } from "@/components/ui/switch";
import { Globe, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  name: string;
  file_size?: number;
  created_at: string;
  is_public?: boolean;
}

interface DocumentsTabProps {
  documents: Document[];
  onUploadSuccess: () => void;
  onRefetch: () => void;
}

export const DocumentsTab = ({ documents, onUploadSuccess, onRefetch }: DocumentsTabProps) => {
  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ is_public: !currentState })
        .eq('id', documentId);

      if (error) throw error;

      toast.success(`Dokument ist jetzt ${!currentState ? 'öffentlich' : 'privat'}`);
      onRefetch();
    } catch (error) {
      console.error('Error toggling document visibility:', error);
      toast.error('Fehler beim Ändern der Sichtbarkeit');
    }
  };

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      toast.success('Quiz wurde erfolgreich generiert');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Fehler beim Generieren des Quiz');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 col-span-1">
        <h2 className="text-xl font-semibold mb-4">Neues Skript hochladen</h2>
        <p className="text-muted-foreground mb-4">
          Lade hier neue Skripte hoch, die dann allen Teilnehmern zur Verfügung stehen
        </p>
        <FileUpload onUploadSuccess={onUploadSuccess} />
      </Card>

      <Card className="p-6 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Vorhandene Skripte</h2>
        <div className="overflow-x-auto">
          <div className="w-full">
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Größe</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Datum</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Öffentlich</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{doc.name}</td>
                      <td className="p-4 align-middle">
                        {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                      </td>
                      <td className="p-4 align-middle">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={doc.is_public}
                            onCheckedChange={() => handleTogglePublic(doc.id, doc.is_public || false)}
                          />
                          <Globe className={`h-4 w-4 ${doc.is_public ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </td>
                      <td className="p-4 align-middle space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerateQuiz(doc.id)}
                          className="mr-2"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Quiz generieren
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            // Handle delete
                          }}
                        >
                          Löschen
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};