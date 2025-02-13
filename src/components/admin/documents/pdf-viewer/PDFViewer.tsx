
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface PDFViewerProps {
  documentPath: string;
  documentName: string;
}

export const PDFViewer = ({ documentPath, documentName }: PDFViewerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleOpenPDF = async () => {
    try {
      console.log('Attempting to open PDF with path:', documentPath);
      
      if (!documentPath) {
        console.error('Document path is empty');
        toast.error('Dokument-Pfad fehlt');
        return;
      }

      const { data, error } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(documentPath, 60);

      console.log('Storage response:', { data, error });

      if (error) {
        console.error('Error creating signed URL:', error);
        toast.error('Fehler beim Laden des PDFs');
        return;
      }

      if (data?.signedUrl) {
        console.log('Successfully generated signed URL:', data.signedUrl);
        setPdfUrl(data.signedUrl);
        setIsOpen(true);
      } else {
        console.error('No signed URL received');
        toast.error('Keine PDF-URL erhalten');
      }
    } catch (error) {
      console.error('Error in handleOpenPDF:', error);
      toast.error('Fehler beim Öffnen des PDFs');
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleOpenPDF}
        className="inline-flex"
      >
        PDF anzeigen
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{documentName}</DialogTitle>
          </DialogHeader>
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full rounded-md"
              title={`PDF Preview: ${documentName}`}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
