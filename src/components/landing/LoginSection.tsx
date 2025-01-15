import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export const LoginSection = () => {
  return (
    <div className="mt-12 bg-white/50 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Jetzt einloggen</h2>
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
                backgroundColor: 'hsl(var(--primary))',
                transform: 'translateY(0)',
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
                outline: 'none',
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
              },
              container: {
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto'
              }
            },
            className: {
              button: 'hover:bg-primary/90 hover:-translate-y-[1px]',
              input: 'focus:border-primary focus:ring-2 focus:ring-primary/10',
              anchor: 'hover:underline'
            }
          }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};