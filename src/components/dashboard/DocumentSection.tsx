import { DocumentList } from "./DocumentList";
import { UploadSection } from "./UploadSection";
import { LearningModeSelector } from "./LearningModeSelector";
import { PublicDocumentList } from "./PublicDocumentList";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
            <div className="space-y-6">
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
              
              <div className="w-full max-w-xl">
                <UploadSection onUploadSuccess={onDocumentDeleted} />
              </div>
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