import { ProgressCard } from "./ProgressCard";
import { Achievements } from "./Achievements";
import { ActiveQuizzes } from "./ActiveQuizzes";

interface StatsSectionProps {
  progress: number;
}

export const StatsSection = ({ progress }: StatsSectionProps) => {
  return (
    <div className="space-y-6">
      <ProgressCard progress={progress} />
      <Achievements />
      <ActiveQuizzes />
    </div>
  );
};