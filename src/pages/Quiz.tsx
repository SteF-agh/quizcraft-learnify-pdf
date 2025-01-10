import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showMotivation, setShowMotivation] = useState(false);

  // Sample questions - in a real app, these would come from an API
  const questions: Question[] = [
    {
      id: 1,
      text: "Was ist die Hauptstadt von Deutschland?",
      options: ["Hamburg", "Berlin", "München", "Köln"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Welches chemische Element hat das Symbol 'H'?",
      options: ["Helium", "Wasserstoff", "Hafnium", "Holmium"],
      correctAnswer: 1,
    },
  ];

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correctAnswer) {
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 3000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header with progress */}
      <div className="container mx-auto mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              ← Zurück zur Hauptseite
            </Button>
            <h1 className="text-3xl font-bold text-secondary">LeeonQuiz</h1>
          </div>
          <Badge variant="default" className="bg-accent">
            Frage {currentQuestion + 1} von {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 bg-secondary/20" />
      </div>

      {/* Quiz content */}
      <div className="container mx-auto max-w-4xl">
        <Card className="border-primary/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-secondary text-2xl">
              {questions[currentQuestion].text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "secondary" : "outline"}
                className="w-full text-left justify-start h-auto py-4 hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </Button>
            ))}
            
            {selectedAnswer !== null && (
              <Button
                onClick={handleNextQuestion}
                className="w-full mt-6 bg-accent hover:bg-accent/80"
                disabled={currentQuestion >= questions.length - 1}
              >
                Nächste Frage
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Leeon mascot */}
        <div className="fixed bottom-8 right-8">
          <img
            src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
            alt="Leeon Mascot"
            className={`w-48 h-48 object-contain transition-transform duration-300 ${
              showMotivation ? "animate-bounce" : ""
            }`}
          />
          {showMotivation && (
            <div className="absolute top-0 right-full mr-4 bg-white p-4 rounded-lg shadow-lg animate-fade-in">
              <p className="text-secondary font-bold">Super gemacht! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;