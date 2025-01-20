import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  name: string;
  is_public: boolean;
  assigned_to: string[];
}

interface DocumentTableProps {
  documents: Document[];
  onAssignDocument: (id: string) => void;
}

export const DocumentTable = ({ documents, onAssignDocument }: DocumentTableProps) => {
  const [questionsCount, setQuestionsCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchQuestionsCount = async () => {
      console.log('Fetching questions count for documents...');
      for (const doc of documents) {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('id')
          .eq('document_id', doc.id);

        if (error) {
          console.error('Error fetching questions count:', error);
          continue;
        }

        setQuestionsCount(prev => ({
          ...prev,
          [doc.id]: data.length
        }));
      }
    };

    fetchQuestionsCount();
  }, [documents]);

  if (!documents.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Keine öffentlichen Dokumente verfügbar
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Select onValueChange={onAssignDocument}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Wähle ein Skript aus" />
        </SelectTrigger>
        <SelectContent>
          {documents.map((doc) => (
            <SelectItem key={doc.id} value={doc.id}>
              <div className="flex justify-between items-center gap-4">
                <span>{doc.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({questionsCount[doc.id] || 0} Fragen)
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};