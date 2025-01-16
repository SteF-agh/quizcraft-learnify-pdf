import { TableCell, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
}

interface DocumentRowProps {
  document: Document;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const DocumentRow = ({ 
  document, 
  isSelected, 
  onSelect, 
  onDelete 
}: DocumentRowProps) => {
  return (
    <TableRow 
      className={isSelected ? "bg-primary/10" : ""}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <TableCell>
        <RadioGroup value={isSelected ? document.id : ""}>
          <RadioGroupItem value={document.id} id={document.id} />
        </RadioGroup>
      </TableCell>
      <TableCell className="font-medium">{document.name}</TableCell>
      <TableCell>
        {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'N/A'}
      </TableCell>
      <TableCell>
        {new Date(document.created_at).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })}
      </TableCell>
      <TableCell>
        <DeleteDocumentDialog onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};