import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useDocumentVisibility = (onRefetch: () => void) => {
  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    console.log('Attempting to toggle document visibility:', documentId);
    try {
      const { error } = await supabase
        .from("documents")
        .update({ is_public: !currentState })
        .eq("id", documentId);

      if (error) throw error;

      toast.success(`Dokument ist jetzt ${!currentState ? "öffentlich" : "privat"}`);
      onRefetch();
    } catch (error) {
      console.error("Error toggling document visibility:", error);
      toast.error("Fehler beim Ändern der Sichtbarkeit");
    }
  };

  return { handleTogglePublic };
};