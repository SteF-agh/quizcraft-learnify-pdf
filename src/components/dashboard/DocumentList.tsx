import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Document {
  id: string;
  name: string;
  created_at: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
}

export const DocumentList = ({ documents, selectedDocument, onSelectDocument }: DocumentListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Upload Date</TableHead>
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
            <TableCell>
              {new Date(doc.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};