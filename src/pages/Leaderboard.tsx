import React from 'react';
import { Layout } from "@/components/layout/Layout";
import { LeaderboardTabs } from "@/components/leaderboard/LeaderboardTabs";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const Leaderboard = () => {
  const { data: leaderboardData, isLoading, error } = useLeaderboard();

  console.log('Leaderboard Data:', leaderboardData); // Debug log
  console.log('Loading State:', isLoading); // Debug log
  console.log('Error State:', error); // Debug log

  return (
    <Layout>
      <div className="flex items-center justify-center gap-4 mb-8">
        <img
          src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
          alt="Leon Mascot"
          className="w-16 h-16 object-contain animate-bounce"
        />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent flex items-center gap-3">
          Leaderboard
          <Trophy className="h-10 w-10 text-yellow-500 animate-pulse" />
        </h1>
      </div>
      
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
    </Layout>
  );
};

export default Leaderboard;