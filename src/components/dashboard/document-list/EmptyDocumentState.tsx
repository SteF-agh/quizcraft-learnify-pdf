import { FileQuestion } from "lucide-react";

export const EmptyDocumentState = () => {
  return (
    <div className="text-center py-8 space-y-3">
      <div className="flex justify-center">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Keine Skripte ausgewählt</h3>
      <p className="text-sm text-muted-foreground">
        Wähle ein Skript aus den verfügbaren Skripten aus, um mit dem Lernen zu beginnen.
      </p>
    </div>
  );
};