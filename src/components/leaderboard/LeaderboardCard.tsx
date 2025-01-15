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
        return <Trophy className="h-6 w-6 text-yellow-500 animate-bounce" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getCardStyle = () => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'hover:bg-gray-50';
    }
  };

  const getRankTextStyle = () => {
    switch (rank) {
      case 1:
        return 'text-yellow-700';
      case 2:
        return 'text-gray-700';
      case 3:
        return 'text-amber-700';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card 
      className={`p-4 transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${getCardStyle()}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {getRankIcon()}
          <span className={`font-bold ${getRankTextStyle()}`}>
            {rank}.
          </span>
          <span className="font-semibold">{username}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {achievements.map((badge, index) => (
              <span 
                key={index} 
                className="text-lg transform hover:scale-110 transition-transform"
              >
                {badge}
              </span>
            ))}
          </div>
          <span className="font-bold text-primary">
            {totalPoints} Punkte
          </span>
        </div>
      </div>
    </Card>
  );
};