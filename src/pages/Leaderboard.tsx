import React from 'react';
import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Card } from "@/components/ui/card";

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, error } = useLeaderboard();

  console.log('Leaderboard Data:', leaderboardData); // Debug log
  console.log('Loading State:', isLoading); // Debug log
  console.log('Error State:', error); // Debug log

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Rangliste</h1>
      
      {error ? (
        <Card className="p-6 bg-destructive/10 text-destructive">
          <p className="text-center">
            Es tut uns leid, aber beim Laden der Rangliste ist ein Fehler aufgetreten. 
            Bitte versuchen Sie es später erneut.
          </p>
        </Card>
      ) : (
        <LeaderboardTabs data={leaderboardData} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Leaderboard;