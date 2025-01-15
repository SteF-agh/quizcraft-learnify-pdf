import { Card } from "@/components/ui/card";

interface FlashcardProps {
  front: string;
  back: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export const Flashcard = ({ front, back, isFlipped, onFlip }: FlashcardProps) => {
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
          <div className="flex items-center justify-center h-full text-lg">
            {front}
          </div>
        </Card>

        <Card className="absolute w-full min-h-[300px] p-6 backface-hidden rotate-y-180">
          <div className="flex items-center justify-center h-full text-lg">
            {back}
          </div>
        </Card>
      </div>
    </div>
  );
};