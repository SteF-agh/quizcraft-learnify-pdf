import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export const HeroSection = () => {
  return (
    <div className="mt-8 grid lg:grid-cols-2 gap-16 items-center bg-white/50 rounded-2xl p-12 shadow-lg">
      <div className="space-y-8">
        <h2 className="text-5xl font-bold leading-tight">
          Willkommen bei LeeonQuiz –
          <span className="text-primary block mt-2">Lernen mit Spaß!</span>
        </h2>
        <div className="space-y-4 bg-white/80 p-8 rounded-lg shadow-md">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeMinimal,
              style: {
                button: {
                  background: 'rgb(var(--primary))',
                  color: 'white',
                  borderRadius: '0.5rem',
                },
                anchor: {
                  color: 'rgb(var(--primary))',
                },
              },
            }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>

      <div className="lg:block relative">
        <img
          src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
          alt="Leeon Mascot"
          className="w-full max-w-md mx-auto transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};