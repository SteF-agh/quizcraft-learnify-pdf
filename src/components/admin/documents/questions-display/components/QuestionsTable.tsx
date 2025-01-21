import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Question } from "../../types";

interface QuestionsTableProps {
  questions: Question[];
}

export const QuestionsTable = ({ questions }: QuestionsTableProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice':
        return 'Multiple Choice';
      case 'single-choice':
        return 'Single Choice';
      case 'true-false':
        return 'Wahr/Falsch';
      default:
        return type;
    }
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Kursname</TableHead>
            <TableHead>Kapitel</TableHead>
            <TableHead>Thema</TableHead>
            <TableHead>Schwierigkeit</TableHead>
            <TableHead>Frage</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Punkte</TableHead>
            <TableHead>Lernziel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <TableRow key={question.id || index}>
              <TableCell>{question.id || index + 1}</TableCell>
              <TableCell>{question.course_name}</TableCell>
              <TableCell>{question.chapter}</TableCell>
              <TableCell>{question.topic}</TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </TableCell>
              <TableCell className="max-w-md">
                <div className="truncate font-medium">{question.question_text}</div>
                {question.feedback && (
                  <div className="mt-1 text-sm text-gray-500 truncate">
                    Feedback: {question.feedback}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getTypeLabel(question.type)}
                </Badge>
              </TableCell>
              <TableCell>{question.points}</TableCell>
              <TableCell>{question.learning_objective_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};