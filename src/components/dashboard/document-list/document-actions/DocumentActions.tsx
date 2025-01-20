import { Button } from "@/components/ui/button";
import { GraduationCap, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DocumentActionsProps {
  documentId: string;
  onDelete: (e: React.MouseEvent) => void;
  onStartLearning: () => void;
}

export const DocumentActions = ({ 
  documentId, 
  onDelete, 
  onStartLearning 
}: DocumentActionsProps) => {
  const handleShareResults = async () => {
    try {
      const { error } = await supabase
        .from('quiz_results')
        .update({ is_public: true })
        .eq('document_id', documentId)
        .eq('user_id', '00000000-0000-0000-0000-000000000000');

      if (error) throw error;

      toast.success("Lernergebnisse wurden erfolgreich freigegeben!");
    } catch (error) {
      console.error('Error sharing results:', error);
      toast.error("Fehler beim Freigeben der Lernergebnisse");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onStartLearning}
        className="gap-2 bg-primary hover:bg-primary/90 text-white"
        size="lg"
      >
        <GraduationCap className="h-5 w-5" />
        Lernen
      </Button>
      <Button
        onClick={handleShareResults}
        className="gap-2"
        variant="outline"
        size="lg"
      >
        <Share2 className="h-5 w-5" />
        Ergebnisse freigeben
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onDelete}
        className="h-10 w-10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};