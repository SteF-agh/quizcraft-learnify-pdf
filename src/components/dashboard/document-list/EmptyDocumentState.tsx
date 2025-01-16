import { FileText } from "lucide-react";

export const EmptyDocumentState = () => {
  return (
    <div className="text-center py-8 space-y-3">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
      <div className="space-y-1">
        <p className="text-lg font-medium">Keine Dokumente vorhanden</p>
        <p className="text-sm text-muted-foreground">
          Laden Sie ein neues Dokument hoch, um zu beginnen
        </p>
      </div>
    </div>
  );
};