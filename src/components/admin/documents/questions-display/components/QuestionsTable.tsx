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
            <TableHead>Frage</TableHead>
            <TableHead>Kurs</TableHead>
            <TableHead>Kapitel</TableHead>
            <TableHead>Thema</TableHead>
            <TableHead>Typ</TableHead>
            <TableHead>Schwierigkeit</TableHead>
            <TableHead>Punkte</TableHead>
            <TableHead>Antworten</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="max-w-md">
                <div className="truncate font-medium">{question.question_text}</div>
              </TableCell>
              <TableCell>{question.course_name}</TableCell>
              <TableCell>{question.chapter}</TableCell>
              <TableCell>{question.topic}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getTypeLabel(question.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getDifficultyColor(question.difficulty)}>
                  {question.difficulty}
                </Badge>
              </TableCell>
              <TableCell>{question.points}</TableCell>
              <TableCell>
                <div className="max-w-xs">
                  {question.answers.map((answer, index) => (
                    <div 
                      key={index} 
                      className={`text-sm ${answer.isCorrect ? 'text-green-600 font-medium' : 'text-gray-600'}`}
                    >
                      • {answer.text}
                    </div>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};