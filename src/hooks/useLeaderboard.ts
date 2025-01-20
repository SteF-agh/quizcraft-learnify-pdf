import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LeaderboardEntry } from "@/types/leaderboard";
import { toast } from "sonner";

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      console.log('Fetching leaderboard data...'); // Debug log

      // Get user stats
      const { data: stats, error: statsError } = await supabase
        .from("user_stats")
        .select(`
          total_points,
          user_id
        `)
        .order("total_points", { ascending: false });

      console.log('Stats data:', stats); // Debug log
      console.log('Stats error:', statsError); // Debug log

      if (statsError) {
        console.error('Stats error:', statsError);
        toast.error("Fehler beim Laden der Statistiken");
        throw statsError;
      }

      if (!stats || stats.length === 0) {
        console.log('No stats found, returning empty array');
        return [];
      }

      // Get usernames
      const userIds = stats.map((stat: any) => stat.user_id).filter(Boolean);
      
      if (userIds.length === 0) {
        console.log('No valid user IDs found, returning empty array');
        return [];
      }

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      console.log('Profiles data:', profiles); // Debug log
      console.log('Profiles error:', profilesError); // Debug log

      if (profilesError) {
        console.error('Profiles error:', profilesError);
        toast.error("Fehler beim Laden der Profile");
        throw profilesError;
      }

      // Get achievements only if we have valid userIds
      const { data: achievements, error: achievementsError } = await supabase
        .from("user_achievements")
        .select(`
          user_id,
          achievements(badge_icon)
        `)
        .in("user_id", userIds);

      console.log('Achievements data:', achievements); // Debug log
      console.log('Achievements error:', achievementsError); // Debug log

      if (achievementsError) {
        console.error('Achievements error:', achievementsError);
        toast.error("Fehler beim Laden der Errungenschaften");
        throw achievementsError;
      }

      // Create maps for lookups
      const usernameMap = new Map(
        profiles?.map((profile: any) => [profile.id, profile.username]) || []
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

      // Combine data
      const leaderboardData = stats.map((entry: any, index: number) => ({
        username: usernameMap.get(entry.user_id) || "Anonymous User",
        total_points: entry.total_points || 0,
        rank: index + 1,
        achievements: achievementsMap.get(entry.user_id) || []
      }));

      console.log('Final leaderboard data:', leaderboardData); // Debug log
      return leaderboardData;
    },
    retry: 1, // Only retry once
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
};