import { ProgressCard } from "./ProgressCard";
import { Achievements } from "./Achievements";
import { ActiveQuizzes } from "./ActiveQuizzes";

interface StatsSectionProps {
  progress: number;
}

export const StatsSection = ({ progress }: StatsSectionProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-secondary">Deine Statistiken</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgressCard progress={progress} />
        <Achievements />
        <ActiveQuizzes />
      </div>
    </div>
  );
};