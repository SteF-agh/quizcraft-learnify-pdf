import React from 'react';
import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";
import { useLeaderboard } from "@/hooks/useLeaderboard";

const Leaderboard = () => {
  const { data: leaderboardData, isLoading } = useLeaderboard();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>
      <LeaderboardTabs data={leaderboardData} isLoading={isLoading} />
    </div>
  );
};

export default Leaderboard;