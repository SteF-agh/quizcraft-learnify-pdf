import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard = ({ front, back, isFlipped, onFlip }: FlashcardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playText = async (text: string) => {
    try {
      setIsPlaying(true);
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) {
        console.error('Error calling text-to-speech:', error);
        toast.error('Fehler beim Abspielen der Audiowiedergabe');
        return;
      }

      // Create and play audio from base64
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();

      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Fehler beim Abspielen der Audiowiedergabe');
      setIsPlaying(false);
    }
  };

  return (
    <div
      className="w-full max-w-2xl perspective-1000 cursor-pointer"
      onClick={onFlip}
    >
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        <Card className="absolute w-full min-h-[300px] p-6 backface-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 text-lg">{front}</div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                playText(front);
              }}
              disabled={isPlaying}
            >
              <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </Card>

        <Card className="absolute w-full min-h-[300px] p-6 backface-hidden rotate-y-180">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 text-lg">{back}</div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                playText(back);
              }}
              disabled={isPlaying}
            >
              <Volume2 className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};