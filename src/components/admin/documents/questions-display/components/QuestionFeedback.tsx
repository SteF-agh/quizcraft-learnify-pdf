interface QuestionFeedbackProps {
  feedback?: string;
}

export const QuestionFeedback = ({ feedback }: QuestionFeedbackProps) => {
  if (!feedback) return null;
  
  return (
    <div className="mt-1 text-sm text-gray-500">
      Feedback: {feedback}
    </div>
  );
};