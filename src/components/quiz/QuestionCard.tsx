import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Question } from "./types/QuestionTypes";
import { QuestionContent } from "./content/QuestionContent";
import { AnswerFeedback } from "./feedback/AnswerFeedback";
import { NextQuestionButton } from "./navigation/NextQuestionButton";
import { checkAnswer, getCorrectAnswerText } from "./utils/answerUtils";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNextQuestion,
  isLastQuestion,
}: QuestionCardProps) => {
  const [openAnswer, setOpenAnswer] = useState("");
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerSelect = (index: number) => {
    onAnswerSelect(index);
    const isCorrect = checkAnswer(question, index);
    setShowCorrectAnswer(!isCorrect);
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5">
      <CardHeader className="space-y-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <QuestionContent
          question={question}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          openAnswer={openAnswer}
          setOpenAnswer={setOpenAnswer}
        />
        
        <AnswerFeedback 
          showCorrectAnswer={showCorrectAnswer}
          correctAnswer={getCorrectAnswerText(question)}
        />
        
        <NextQuestionButton
          show={selectedAnswer !== null || question.type === 'open'}
          onClick={onNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      </CardContent>
    </Card>
  );
};