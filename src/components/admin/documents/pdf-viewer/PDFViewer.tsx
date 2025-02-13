
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      console.log('Opening PDF:', documentPath);
      const { data, error } = await supabase.storage
        .from('pdfs')
        .createSignedUrl(documentPath, 60);

      if (error) {
        console.error('Error creating signed URL:', error);
        return;
      }

      if (data?.signedUrl) {
        console.log('Generated signed URL:', data.signedUrl);
        setPdfUrl(data.signedUrl);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error getting PDF URL:', error);
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
