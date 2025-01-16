import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { Flashcard } from "./Flashcard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FlashcardsDeckProps {
  documentId: string;
}

export const FlashcardsDeck = ({ documentId }: FlashcardsDeckProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ["flashcards", documentId],
    queryFn: async () => {
      console.log('Fetching flashcards for document:', documentId);
      
      // First, check if flashcards exist
      const { data: existingCards, error: fetchError } = await supabase
        .from('flashcards')
        .select('*')
        .eq('document_id', documentId);

      if (fetchError) {
        console.error('Error fetching flashcards:', fetchError);
        throw new Error('Error fetching flashcards');
      }

      if (existingCards && existingCards.length > 0) {
        console.log('Found existing flashcards:', existingCards.length);
        return existingCards;
      }

      // If no flashcards exist, generate them
      console.log('No existing flashcards found, generating new ones...');
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: { documentId },
      });

      if (error) {
        console.error('Error generating flashcards:', error);
        toast.error('Fehler beim Generieren der Lernkarten');
        throw error;
      }

      console.log('Successfully generated flashcards:', data.flashcards);
      return data.flashcards;
    },
  });

  const progress = flashcards.length > 0 
    ? ((currentCardIndex + 1) / flashcards.length) * 100 
    : 0;

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
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNext();
    } else if (event.key === 'ArrowLeft') {
      handlePrevious();
    } else if (event.key === ' ') {
      setIsFlipped(!isFlipped);
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentCardIndex, isFlipped]);

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
        <p className="text-muted-foreground mb-4">
          Karte {currentCardIndex + 1} von {flashcards.length}
        </p>
        <Progress 
          value={progress} 
          className="h-3 rounded-lg bg-secondary/20"
        />
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
          className="hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="mr-2" />
          Zurück
        </Button>
        <Button
          variant="outline"
          onClick={handleShuffle}
          className="hover:scale-105 transition-transform"
        >
          <Shuffle className="mr-2" />
          Mischen
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentCardIndex === flashcards.length - 1}
          className="hover:translate-x-1 transition-transform"
        >
          Weiter
          <ArrowRight className="ml-2" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Tastaturkürzel:</p>
        <p>Leertaste zum Umdrehen, Pfeiltasten für Navigation</p>
      </div>
    </div>
  );
};