import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export const LeaderboardTabs = ({ data, isLoading }: LeaderboardTabsProps) => {
  console.log('LeaderboardTabs Data:', data); // Debug log
  
  // Use fallback data if no real data is available
  const displayData = (data && data.length > 0) ? data : fallbackData;
  
  return (
    <Tabs defaultValue="global" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="global">Globale Rangliste</TabsTrigger>
        <TabsTrigger value="weekly">Wöchentliche Rangliste</TabsTrigger>
      </TabsList>

      <TabsContent value="global">
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
      </TabsContent>

      <TabsContent value="weekly">
        <Card className="p-6">
          <p className="text-center text-lg text-muted-foreground">
            Wöchentliche Rangliste wird bald verfügbar sein!
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
};