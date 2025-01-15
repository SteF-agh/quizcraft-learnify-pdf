import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardEntry {
  username: string;
  total_points: number;
  rank: number;
  achievements: string[];
}

const Leaderboard = () => {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // First, get all user stats
      const { data: stats, error: statsError } = await supabase
        .from("user_stats")
        .select(`
          total_points,
          user_id
        `)
        .order("total_points", { ascending: false });

      if (statsError) throw statsError;

      // Get usernames
      const userIds = stats.map((stat: any) => stat.user_id).filter(Boolean);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      // Get achievements for these users
      const { data: achievements } = await supabase
        .from("user_achievements")
        .select(`
          user_id,
          achievements(badge_icon)
        `)
        .in("user_id", userIds);

      // Create maps for easy lookup
      const usernameMap = new Map(
        profiles?.map((profile: any) => [profile.id, profile.username])
      );
      
      const achievementsMap = new Map();
      achievements?.forEach((ua: any) => {
        const userId = ua.user_id;
        const badges = achievementsMap.get(userId) || [];
        if (ua.achievements?.badge_icon) {
          badges.push(ua.achievements.badge_icon);
        }
        achievementsMap.set(userId, badges);
      });

      // Combine all data
      return stats.map((entry: any, index: number) => ({
        username: usernameMap.get(entry.user_id) || "Anonymous User",
        total_points: entry.total_points || 0,
        rank: index + 1,
        achievements: achievementsMap.get(entry.user_id) || []
      }));
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Leaderboard</h1>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="global">Global Rangliste</TabsTrigger>
          <TabsTrigger value="weekly">Wöchentliche Rangliste</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <div className="grid gap-4">
            {isLoading ? (
              <Card className="p-4">Laden...</Card>
            ) : (
              leaderboardData?.map((entry: LeaderboardEntry) => (
                <Card key={entry.username} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {entry.rank === 1 && <Trophy className="h-6 w-6 text-yellow-500" />}
                      {entry.rank === 2 && <Medal className="h-6 w-6 text-gray-400" />}
                      {entry.rank === 3 && <Medal className="h-6 w-6 text-amber-600" />}
                      {entry.rank > 3 && <Star className="h-6 w-6 text-blue-500" />}
                      <span className="font-bold">{entry.rank}.</span>
                      <span>{entry.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {entry.achievements.map((badge, index) => (
                          <span key={index} className="text-lg">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <span className="font-bold">{entry.total_points} Punkte</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="p-4">
            <p className="text-center text-muted-foreground">
              Wöchentliche Rangliste wird bald verfügbar sein!
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leaderboard;