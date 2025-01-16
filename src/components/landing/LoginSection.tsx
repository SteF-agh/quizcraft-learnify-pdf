import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { toast } from "sonner";
import { useEffect } from 'react';

export const LoginSection = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_DELETED') {
        toast.error('User was deleted');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info('Password recovery requested');
      } else if (event === 'SIGNED_OUT') {
        toast.info('Signed out successfully');
      } else if (event === 'SIGNED_IN') {
        toast.success('Signed in successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="mt-12 bg-white/50 rounded-2xl p-8 shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-6">Willkommen bei LeeTrainer</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'w-full',
              input: 'w-full rounded-md border border-gray-300',
              label: 'text-sm font-medium text-gray-700'
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-Mail Adresse',
                password_label: 'Passwort',
                button_label: 'Anmelden',
                loading_button_label: 'Anmeldung läuft...',
                email_input_placeholder: 'Ihre E-Mail Adresse',
                password_input_placeholder: 'Ihr Passwort'
              },
              sign_up: {
                email_label: 'E-Mail Adresse',
                password_label: 'Passwort',
                button_label: 'Registrieren',
                loading_button_label: 'Registrierung läuft...',
                email_input_placeholder: 'Ihre E-Mail Adresse',
                password_input_placeholder: 'Ihr Passwort'
              }
            }
          }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};