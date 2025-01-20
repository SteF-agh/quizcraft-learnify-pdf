import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyDocumentState } from "./document-list/EmptyDocumentState";
import { DocumentRow } from "./document-list/DocumentRow";
import { useDeleteHandler } from "./document-list/DeleteHandler";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  onDocumentDeleted?: () => void;
}

export const DocumentList = ({ 
  documents, 
  onDocumentDeleted 
}: DocumentListProps) => {
  const handleDelete = useDeleteHandler(onDocumentDeleted);
  const [documentCoins, setDocumentCoins] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchDocumentCoins = async () => {
      for (const doc of documents) {
        const { data: results } = await supabase
          .from('quiz_results')
          .select('total_points')
          .eq('document_id', doc.id)
          .eq('user_id', '00000000-0000-0000-0000-000000000000');

        if (results && results.length > 0) {
          const totalCoins = results.reduce((sum, result) => sum + (result.total_points || 0), 0);
          setDocumentCoins(prev => ({
            ...prev,
            [doc.id]: totalCoins
          }));
        }
      }
    };

    if (documents.length > 0) {
      fetchDocumentCoins();
    }
  }, [documents]);

  if (!documents.length) {
    return <EmptyDocumentState />;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name & Fortschritt</TableHead>
              <TableHead className="w-[180px]">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onDelete={(e) => handleDelete(doc, e)}
                coins={documentCoins[doc.id] || 0}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};