import React from 'react';
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Star } from "lucide-react";

interface LeaderboardCardProps {
  username: string;
  rank: number;
  totalPoints: number;
  achievements: string[];
}

export const LeaderboardCard = ({ username, rank, totalPoints, achievements }: LeaderboardCardProps) => {
  const getRankIcon = () => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" strokeWidth={2.5} />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" strokeWidth={2.5} />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600" strokeWidth={2.5} />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCardStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 shadow-yellow-100';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-gray-100';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300 shadow-amber-100';
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const getRankTextStyle = () => {
    switch (rank) {
      case 1:
        return 'text-yellow-700 font-bold text-lg';
      case 2:
        return 'text-gray-700 font-bold text-lg';
      case 3:
        return 'text-amber-700 font-bold text-lg';
      default:
        return 'text-gray-600 font-semibold';
    }
  };

  return (
    <Card 
      className={`p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${getCardStyle()} border-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="transform transition-transform duration-300 hover:scale-110">
            {getRankIcon()}
          </div>
          <div className="flex flex-col">
            <span className={getRankTextStyle()}>
              {rank}. Platz
            </span>
            <span className="font-semibold text-lg text-secondary">
              {username}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-2">
            {achievements.map((badge, index) => (
              <span 
                key={index} 
                className="text-2xl transform hover:scale-125 transition-transform duration-300 cursor-pointer"
                title="Achievement Badge"
              >
                {badge}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-lg text-primary">
              {totalPoints}
            </span>
            <span className="text-sm text-muted-foreground">
              Punkte
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};