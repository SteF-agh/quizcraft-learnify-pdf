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
  course_name: string;
  chapter: string;
  topic: string;
  answers?: Array<{ text: string; isCorrect: boolean }>;
}

interface QuestionsDisplayProps {
  questions: Question[];
  documentId: string | null;
}

export const QuestionsDisplay = ({ questions, documentId }: QuestionsDisplayProps) => {
  if (!documentId || questions.length === 0) {
    console.log('No questions to display');
    return null;
  }

  console.log('Rendering questions in QuestionsDisplay:', questions);

  return (
    <div className="bg-slate-50 p-6 rounded-lg border">
      <h2 className="text-2xl font-semibold mb-2">KI Manager - Generierte Fragen</h2>
      <p className="text-slate-600 mb-4">Die KI hat folgende {questions.length} Fragen für dieses Dokument generiert:</p>
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="max-w-xl truncate">{question.question_text}</TableCell>
                <TableCell>{question.course_name}</TableCell>
                <TableCell>{question.chapter}</TableCell>
                <TableCell>{question.topic}</TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell>{question.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};