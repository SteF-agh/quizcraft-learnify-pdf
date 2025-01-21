import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Question } from "../../types";
import { QuestionAnswers } from "./QuestionAnswers";
import { QuestionFeedback } from "./QuestionFeedback";
import { QuestionMeta } from "./QuestionMeta";

interface QuestionsTableProps {
  questions: Question[];
}

export const QuestionsTable = ({ questions }: QuestionsTableProps) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kursname</TableHead>
            <TableHead>Kapitel</TableHead>
            <TableHead>Thema</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Frage</TableHead>
            <TableHead>Antworten</TableHead>
            <TableHead>Lernziel</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((question, index) => (
            <TableRow key={question.id || index}>
              <TableCell>{question.course_name}</TableCell>
              <TableCell>{question.chapter}</TableCell>
              <TableCell>{question.topic}</TableCell>
              <TableCell>
                <QuestionMeta 
                  difficulty={question.difficulty}
                  type={question.type}
                  points={question.points}
                />
              </TableCell>
              <TableCell className="max-w-md">
                <div className="font-medium">{question.question_text}</div>
                <QuestionFeedback feedback={question.feedback} />
              </TableCell>
              <TableCell className="max-w-xs">
                <QuestionAnswers answers={question.answers} />
              </TableCell>
              <TableCell>{question.learning_objective_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};