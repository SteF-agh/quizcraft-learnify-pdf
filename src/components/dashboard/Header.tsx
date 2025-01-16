import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current session:", session);
      
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        console.log("Profile data:", profile);
        console.log("Profile error:", error);
        
        if (profile) {
          console.log("User role:", profile.role);
          setIsAdmin(profile.role === 'admin');
        }
      }
    };

    checkAdminStatus();
  }, []);

  console.log("Is admin state:", isAdmin);

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <img 
            src="/lovable-uploads/44addff5-511d-4fae-a8bc-f8ab538c69fc.png" 
            alt="Leeon Logo" 
            className="h-16 w-auto object-contain"
          />
          <Button 
            variant="ghost" 
            className="text-2xl font-bold hover:scale-105 transition-transform duration-200"
            onClick={() => navigate("/")}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              LeeonQuiz
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-secondary hover:text-secondary/80"
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/leaderboard")}
            className="text-secondary hover:text-secondary/80"
          >
            Leaderboard
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="text-secondary hover:text-secondary/80"
            >
              Admin
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};