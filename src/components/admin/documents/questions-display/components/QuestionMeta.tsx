import { Badge } from "@/components/ui/badge";
import { getDifficultyColor, getTypeLabel } from "../../utils/questionFormatters";

interface QuestionMetaProps {
  difficulty: string;
  type: string;
  points: number;
}

export const QuestionMeta = ({ difficulty, type, points }: QuestionMetaProps) => {
  return (
    <div className="space-y-2">
      <Badge className={getDifficultyColor(difficulty)}>
        {difficulty}
      </Badge>
      <div className="flex items-center space-x-2">
        <Badge variant="outline">
          {getTypeLabel(type)}
        </Badge>
        <span className="text-sm text-gray-500">
          {points} Punkte
        </span>
      </div>
    </div>
  );
};