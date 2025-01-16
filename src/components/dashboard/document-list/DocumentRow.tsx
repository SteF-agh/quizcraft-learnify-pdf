import { TableCell, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DeleteDocumentDialog } from "./DeleteDocumentDialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Document {
  id: string;
  name: string;
  created_at: string;
  file_size?: number;
  file_path: string;
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
  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Attempting to preview document:', document.file_path);
    
    try {
      const { data } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(document.file_path, 60); // URL valid for 60 seconds

      if (data?.signedUrl) {
        console.log('Opening signed URL:', data.signedUrl);
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error creating signed URL:', error);
    }
  };

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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            title="Dokument öffnen"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DeleteDocumentDialog onDelete={onDelete} />
        </div>
      </TableCell>
    </TableRow>
  );
};