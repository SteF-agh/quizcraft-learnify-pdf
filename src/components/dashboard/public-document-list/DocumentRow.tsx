import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DocumentRowProps {
  document: {
    id: string;
    name: string;
    file_size?: number;
    created_at: string;
  };
  onAssign: (id: string) => void;
}

export const DocumentRow = ({ document, onAssign }: DocumentRowProps) => {
  return (
    <TableRow>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAssign(document.id)}
        >
          Hinzufügen
        </Button>
      </TableCell>
    </TableRow>
  );
};