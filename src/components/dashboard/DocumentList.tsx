import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  content_type?: string;
}

interface DocumentListProps {
  documents: Document[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
}

export const DocumentList = ({ documents, selectedDocument, onSelectDocument }: DocumentListProps) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Select</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
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
            <TableCell>{formatFileSize(doc.file_size)}</TableCell>
            <TableCell>
              {new Date(doc.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};