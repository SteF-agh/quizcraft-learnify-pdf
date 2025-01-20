import { Award, Timer, Clock } from "lucide-react";
import { DocumentProgress } from "../DocumentProgress";

interface DocumentStatsProps {
  coins: number;
  averageScore?: number;
  totalAttempts: number;
  lastAttempt?: string;
  createdAt: string;
  documentId: string;
}

export const DocumentStats = ({
  coins,
  averageScore,
  totalAttempts,
  lastAttempt,
  createdAt,
  documentId
}: DocumentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-yellow-500" />
        <div>
          <span className="text-sm font-medium">{coins} Coins</span>
          {averageScore !== undefined && totalAttempts > 0 && (
            <p className="text-xs text-muted-foreground">
              Ø {averageScore}% Erfolg
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-blue-500" />
        <div>
          <span className="text-sm font-medium">{totalAttempts} Quiz(ze)</span>
          {lastAttempt && (
            <p className="text-xs text-muted-foreground">
              Letztes: {new Date(lastAttempt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-green-500" />
        <div>
          <span className="text-sm font-medium">
            Erstellt: {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <DocumentProgress documentId={documentId} />
    </div>
  );
};