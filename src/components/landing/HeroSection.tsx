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
                  background: 'hsl(var(--primary))',
                  color: 'white',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  width: '100%',
                  marginTop: '1rem',
                  transition: 'all 0.2s ease-in-out',
                  ':hover': {
                    background: 'hsl(var(--primary) / 0.9)',
                    transform: 'translateY(-1px)'
                  }
                },
                input: {
                  background: 'white',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  fontSize: '1rem',
                  width: '100%',
                  marginTop: '0.5rem',
                  transition: 'border-color 0.2s ease-in-out',
                  ':focus': {
                    outline: 'none',
                    borderColor: 'hsl(var(--primary))',
                    boxShadow: '0 0 0 2px hsl(var(--primary) / 0.1)'
                  }
                },
                label: {
                  color: 'hsl(var(--foreground))',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem'
                },
                message: {
                  fontSize: '0.875rem',
                  color: 'hsl(var(--muted-foreground))',
                  marginTop: '0.5rem'
                },
                anchor: {
                  color: 'hsl(var(--primary))',
                  textDecoration: 'none',
                  fontWeight: '500',
                  ':hover': {
                    textDecoration: 'underline'
                  }
                },
                container: {
                  width: '100%',
                  maxWidth: '400px',
                  margin: '0 auto'
                }
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