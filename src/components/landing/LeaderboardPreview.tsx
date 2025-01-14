import { LucideTrophy } from "lucide-react";

export const LeaderboardPreview = () => {
  return (
    <div className="mt-24 bg-white/50 rounded-2xl p-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
            <LucideTrophy className="w-5 h-5" />
            <span className="font-medium">Leaderboard Feature</span>
          </div>
          <h3 className="text-3xl font-bold">Vergleiche deine Leistungen</h3>
          <p className="text-lg text-muted-foreground">
            Optional kannst du deine Ergebnisse im Leaderboard veröffentlichen und mit anderen vergleichen!
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div className="flex-grow">
                <div className="font-medium">Top Learner</div>
                <div className="text-sm text-muted-foreground">2400 Punkte</div>
              </div>
              <LucideTrophy className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-center gap-4 p-3 bg-secondary/5 rounded-lg">
              <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div className="flex-grow">
                <div className="font-medium">Quick Thinker</div>
                <div className="text-sm text-muted-foreground">2100 Punkte</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-accent/5 rounded-lg">
              <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div className="flex-grow">
                <div className="font-medium">Knowledge Seeker</div>
                <div className="text-sm text-muted-foreground">1950 Punkte</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};