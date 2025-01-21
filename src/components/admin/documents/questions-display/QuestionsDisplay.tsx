import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Question } from "../types";

interface QuestionsDisplayProps {
  questions: Question[];
  documentId: string | null;
}

export const QuestionsDisplay = ({ questions, documentId }: QuestionsDisplayProps) => {
  console.log('QuestionsDisplay rendered with:', { questions, documentId });

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

  if (!documentId) {
    return (
      <div className="bg-slate-50 p-6 rounded-lg border mt-8">
        <h2 className="text-2xl font-semibold mb-2">Generierte bzw. hochgeladene Fragen</h2>
        <p className="text-slate-600">
          Bitte wählen Sie ein Dokument aus, um dessen Fragen anzuzeigen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-6 rounded-lg border mt-8">
      <h2 className="text-2xl font-semibold mb-2">Generierte bzw. hochgeladene Fragen</h2>
      <p className="text-slate-600 mb-4">
        {questions.length === 0 
          ? "Keine Fragen für dieses Dokument vorhanden." 
          : `${questions.length} ${questions.length === 1 ? 'Frage wurde' : 'Fragen wurden'} für dieses Dokument erfasst:`
        }
      </p>
      {questions.length > 0 && (
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
      )}
    </div>
  );
};