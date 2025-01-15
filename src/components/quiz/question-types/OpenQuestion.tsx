import { Input } from "@/components/ui/input";

interface OpenQuestionProps {
  value: string;
  onChange: (value: string) => void;
}

export const OpenQuestion = ({ value, onChange }: OpenQuestionProps) => {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Deine Antwort..."
      className="w-full p-4 text-lg border-2 focus:border-secondary"
    />
  );
};