import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Flashcard } from "./Flashcard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FlashcardsDeckProps {
  documentId: string;
}

export const FlashcardsDeck = ({ documentId }: FlashcardsDeckProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Temporary mock data - will be replaced with actual data from the edge function
  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ["flashcards", documentId],
    queryFn: async () => {
      // This will be replaced with actual API call to generate flashcards
      return [
        { id: 1, front: "Was ist React?", back: "Eine JavaScript-Bibliothek zur Entwicklung von Benutzeroberflächen" },
        { id: 2, front: "Was ist ein Hook?", back: "Eine Funktion, die es ermöglicht, React-Features in Funktionskomponenten zu verwenden" },
        { id: 3, front: "Was ist JSX?", back: "Eine Syntaxerweiterung für JavaScript, die es ermöglicht, HTML-ähnlichen Code in JavaScript zu schreiben" },
      ];
    },
  });

  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    // TODO: Implement shuffle logic
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!flashcards.length) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Keine Lernkarten verfügbar</h2>
        <p className="text-muted-foreground">
          Es konnten keine Lernkarten für dieses Dokument generiert werden.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Lernkarten</h1>
        <p className="text-muted-foreground">
          Karte {currentCardIndex + 1} von {flashcards.length}
        </p>
      </div>

      <div className="relative min-h-[400px] flex justify-center items-center">
        <Flashcard
          front={flashcards[currentCardIndex].front}
          back={flashcards[currentCardIndex].back}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
        >
          <ArrowLeft className="mr-2" />
          Zurück
        </Button>
        <Button
          variant="outline"
          onClick={handleShuffle}
        >
          <Shuffle className="mr-2" />
          Mischen
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentCardIndex === flashcards.length - 1}
        >
          Weiter
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};