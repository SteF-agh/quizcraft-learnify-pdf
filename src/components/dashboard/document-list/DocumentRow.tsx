import { TableCell, TableRow } from "@/components/ui/table";
import { formatFileSize } from "@/utils/formatters";
import { DocumentProgress } from "./DocumentProgress";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trash2, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface DocumentRowProps {
  document: {
    id: string;
    name: string;
    file_size?: number;
    created_at: string;
  };
  onDelete: (e: React.MouseEvent) => void;
  coins: number;
}

export const DocumentRow = ({
  document,
  onDelete,
  coins
}: DocumentRowProps) => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(`/learning-mode?documentId=${document.id}`);
  };

  return (
    <TableRow>
      <TableCell>
        <Card className="p-4 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{document.name}</h3>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(document.file_size || 0)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleStartLearning}
                className="gap-2"
                size="sm"
              >
                <GraduationCap className="h-4 w-4" />
                Lernen
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={onDelete}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">{coins} Coins verdient</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Letzte Aktivität: {new Date(document.created_at).toLocaleDateString()}</span>
            </div>
            <DocumentProgress documentId={document.id} />
          </div>
        </Card>
      </TableCell>
    </TableRow>
  );
};