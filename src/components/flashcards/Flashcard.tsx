import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
  onCorrectAnswer: () => void;
}

export const Flashcard = ({ front, back, isFlipped, onFlip, onCorrectAnswer }: FlashcardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [showWrongAnswerPrompt, setShowWrongAnswerPrompt] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const playText = async (text: string) => {
    try {
      setIsPlaying(true);
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) {
        console.error('Fehler beim Aufrufen von text-to-speech:', error);
        toast.error('Fehler beim Abspielen der Audiowiedergabe');
        return;
      }

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();

      audio.onended = () => {
        setIsPlaying(false);
      };
    } catch (error) {
      console.error('Fehler beim Abspielen des Audios:', error);
      toast.error('Fehler beim Abspielen der Audiowiedergabe');
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          if (base64Audio) {
            try {
              const { data, error } = await supabase.functions.invoke('voice-to-text', {
                body: { audio: base64Audio },
              });

              if (error) throw error;
              setUserAnswer(data.text);
            } catch (error) {
              console.error('Fehler bei der Spracherkennung:', error);
              toast.error('Fehler bei der Spracherkennung');
            }
          }
        };
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Fehler beim Starten der Aufnahme:', error);
      toast.error('Fehler beim Starten der Aufnahme');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const evaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Bitte gib eine Antwort ein');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-answer', {
        body: { userAnswer, correctAnswer: back },
      });

      if (error) throw error;

      if (data.isCorrect) {
        toast.success('Richtig! Weiter zur nächsten Karte.');
        setUserAnswer("");
        setShowWrongAnswerPrompt(false);
        onCorrectAnswer();
      } else {
        setShowWrongAnswerPrompt(true);
      }
    } catch (error) {
      console.error('Fehler bei der Antwortbewertung:', error);
      toast.error('Fehler bei der Antwortbewertung');
    }
  };

  return (
    <div className="w-full max-w-2xl perspective-1000">
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
          
          <div className="mt-6 space-y-4">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Deine Antwort..."
              className="w-full"
            />
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                className={`flex-1 ${isRecording ? 'bg-red-100' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  isRecording ? stopRecording() : startRecording();
                }}
              >
                <Mic className={`h-5 w-5 mr-2 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                {isRecording ? 'Aufnahme stoppen' : 'Antwort sprechen'}
              </Button>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  evaluateAnswer();
                }}
                className="flex-1"
              >
                Antwort prüfen
              </Button>
            </div>

            {showWrongAnswerPrompt && (
              <Alert className="mt-4">
                <div className="flex flex-col gap-2">
                  <p>Deine Antwort ist nicht ganz richtig. Möchtest du es noch einmal versuchen?</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFlip();
                      }}
                    >
                      Lösung anzeigen
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserAnswer("");
                        setShowWrongAnswerPrompt(false);
                        onCorrectAnswer();
                      }}
                    >
                      Zur nächsten Karte
                    </Button>
                  </div>
                </div>
              </Alert>
            )}
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