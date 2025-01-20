import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LearningSelectorProps {
  selectedDocument: string | null;
  onStartLearning: () => void;
}

export const LearningModeSelector = ({
  selectedDocument
}: LearningSelectorProps) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (selectedDocument) {
      navigate(`/learning-mode?documentId=${selectedDocument}`);
    } else {
      toast.error("Bitte wähle zuerst ein Dokument aus");
    }
  };

  return (
    <div className="p-6 border rounded-xl bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300">
      <Button
        onClick={handleStartLearning}
        className="w-full transition-all hover:scale-[1.02] gap-2 bg-gradient-to-r from-primary to-secondary text-white"
        disabled={!selectedDocument}
      >
        <GraduationCap className="h-5 w-5" />
        Lernen starten
      </Button>
    </div>
  );
};