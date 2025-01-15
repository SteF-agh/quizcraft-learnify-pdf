import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LeaderboardCard } from './LeaderboardCard';
import { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardTabsProps {
  data: LeaderboardEntry[] | undefined;
  isLoading: boolean;
}

export const LeaderboardTabs = ({ data, isLoading }: LeaderboardTabsProps) => {
  console.log('LeaderboardTabs Data:', data); // Debug log
  
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
          ) : data && data.length > 0 ? (
            data.map((entry: LeaderboardEntry) => (
              <LeaderboardCard
                key={entry.username}
                username={entry.username}
                rank={entry.rank}
                totalPoints={entry.total_points}
                achievements={entry.achievements}
              />
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-lg text-muted-foreground">
                Keine Einträge in der Rangliste gefunden.
              </p>
            </Card>
          )}
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