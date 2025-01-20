import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Question {
  id: string;
  question_text: string;
  type: string;
  difficulty: string;
  points: number;
}

interface QuestionsDisplayProps {
  questions: Question[];
  documentId: string | null;
}

export const QuestionsDisplay = ({ questions, documentId }: QuestionsDisplayProps) => {
  if (!documentId || questions.length === 0) return null;

  console.log('Rendering questions in QuestionsDisplay:', questions);

  return (
    <Card className="mt-6 p-6">
      <h3 className="text-xl font-semibold mb-4">Generierte Fragen ({questions.length})</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Frage</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Schwierigkeit</TableHead>
              <TableHead>Punkte</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="max-w-xl truncate">{question.question_text}</TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};