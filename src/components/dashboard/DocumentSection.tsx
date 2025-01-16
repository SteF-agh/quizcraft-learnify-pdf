import { DocumentList } from "./DocumentList";
import { LearningModeSelector } from "./LearningModeSelector";
import { PublicDocumentList } from "./PublicDocumentList";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DocumentSectionProps {
  documents: any[];
  selectedDocument: string | null;
  onSelectDocument: (id: string) => void;
  onDocumentDeleted: () => void;
  onStartLearning: () => void;
}

export const DocumentSection = ({
  documents,
  selectedDocument,
  onSelectDocument,
  onDocumentDeleted,
  onStartLearning
}: DocumentSectionProps) => {
  const fetchAssignedDocuments = async () => {
    try {
      console.log('Fetching assigned documents...');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .contains('assigned_to', ['00000000-0000-0000-0000-000000000000']);

      if (error) {
        console.error('Error fetching assigned documents:', error);
        return;
      }

      console.log('Fetched assigned documents:', data);
    } catch (error) {
      console.error('Error in fetchAssignedDocuments:', error);
    }
  };

  useEffect(() => {
    fetchAssignedDocuments();
  }, []);

  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="space-y-8">
        <AccordionItem value="public-documents">
          <AccordionTrigger className="text-xl font-semibold">
            Verfügbare Skripte
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground mb-4">
              Hier findest du alle von deinen Trainern bereitgestellten Skripte
            </p>
            <PublicDocumentList
              onDocumentAssigned={onDocumentDeleted}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="my-documents">
          <AccordionTrigger className="text-xl font-semibold">
            Deine Skripte
          </AccordionTrigger>
          <AccordionContent>
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Wähle das Skript aus, mit dem du jetzt lernen möchtest und gehe auf Lernen starten
              </p>
              <DocumentList
                documents={documents}
                selectedDocument={selectedDocument}
                onSelectDocument={onSelectDocument}
                onDocumentDeleted={onDocumentDeleted}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="pt-4">
        <LearningModeSelector
          selectedDocument={selectedDocument}
          onStartLearning={onStartLearning}
        />
      </div>
    </div>
  );
};