import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const LoginSection = () => {
  const navigate = useNavigate();

  const handleDirectSignIn = () => {
    // For now, we'll just navigate directly to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="mt-12 bg-white/50 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Willkommen zurück, Steffi!</h2>
        <Button 
          className="w-full" 
          onClick={handleDirectSignIn}
        >
          Zum Dashboard
        </Button>
      </div>
    </div>
  );
};