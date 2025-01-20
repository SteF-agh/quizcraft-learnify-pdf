import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DocumentRow } from "../document-row/DocumentRow";
import { Document } from "../types";

interface DocumentsTableProps {
  documents: Document[];
  onTogglePublic: (documentId: string, currentState: boolean) => Promise<void>;
  onGenerateQuiz: (documentId: string) => Promise<void>;
  onViewQuestions: (documentId: string) => Promise<void>;
  isGenerating: boolean;
}

export const DocumentsTable = ({
  documents,
  onTogglePublic,
  onGenerateQuiz,
  onViewQuestions,
  isGenerating
}: DocumentsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Größe</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Öffentlich</TableHead>
                <TableHead>Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  document={doc}
                  onTogglePublic={onTogglePublic}
                  onGenerateQuiz={onGenerateQuiz}
                  onViewQuestions={onViewQuestions}
                  isGenerating={isGenerating}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};