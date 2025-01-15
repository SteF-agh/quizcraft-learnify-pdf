import React from 'react';
import { Card } from "@/components/ui/card";
import { LeaderboardCard } from './LeaderboardCard';
import { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardTabsProps {
  data: LeaderboardEntry[] | undefined;
  isLoading: boolean;
}

// Fallback data for testing the UI
const fallbackData: LeaderboardEntry[] = [
  {
    username: "MaxMustermann",
    rank: 1,
    total_points: 1000,
    achievements: ["👑", "🏆", "🌟"]
  },
  {
    username: "ErikaExample",
    rank: 2,
    total_points: 850,
    achievements: ["🏆", "🌟"]
  },
  {
    username: "TestUser",
    rank: 3,
    total_points: 700,
    achievements: ["🌟"]
  },
  {
    username: "LearningHero",
    rank: 4,
    total_points: 500,
    achievements: ["🎯"]
  }
];

// Weekly fallback data
const weeklyFallbackData: LeaderboardEntry[] = [
  {
    username: "LernKönig",
    rank: 1,
    total_points: 450,
    achievements: ["🎓", "⭐"]
  },
  {
    username: "WissenHeld",
    rank: 2,
    total_points: 380,
    achievements: ["📚"]
  },
  {
    username: "QuizMaster",
    rank: 3,
    total_points: 320,
    achievements: ["🎯"]
  },
  {
    username: "FlexiLerner",
    rank: 4,
    total_points: 280,
    achievements: ["💫"]
  }
];

export const LeaderboardTabs = ({ data, isLoading }: LeaderboardTabsProps) => {
  console.log('LeaderboardTabs Data:', data); // Debug log
  
  // Use fallback data if no real data is available
  const displayData = (data && data.length > 0) ? data : fallbackData;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Global Leaderboard */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Globale Rangliste
        </h2>
        <div className="grid gap-6">
          {isLoading ? (
            <Card className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
                <span className="text-lg text-muted-foreground">Laden...</span>
              </div>
            </Card>
          ) : displayData.map((entry: LeaderboardEntry) => (
              <LeaderboardCard
                key={entry.username}
                username={entry.username}
                rank={entry.rank}
                totalPoints={entry.total_points}
                achievements={entry.achievements}
              />
            ))
          }
        </div>
      </div>

      {/* Weekly Leaderboard */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
          Wöchentliche Rangliste
        </h2>
        <div className="grid gap-6">
          {weeklyFallbackData.map((entry: LeaderboardEntry) => (
            <LeaderboardCard
              key={entry.username}
              username={entry.username}
              rank={entry.rank}
              totalPoints={entry.total_points}
              achievements={entry.achievements}
            />
          ))}
        </div>
      </div>
    </div>
  );
};