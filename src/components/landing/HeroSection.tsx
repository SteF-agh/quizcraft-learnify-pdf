import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export const HeroSection = () => {
  return (
    <div className="mt-8 grid lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h1 className="text-5xl font-bold leading-tight">
          Willkommen bei LeeonQuiz –
          <span className="text-primary block mt-2">Lernen mit Spaß!</span>
        </h1>
        <div className="relative w-full lg:hidden">
          <img
            src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
            alt="Leeon Mascot"
            className="w-48 h-48 object-contain mx-auto"
          />
        </div>
      </div>

      <div className="lg:block relative hidden">
        <img
          src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
          alt="Leeon Mascot"
          className="w-64 h-64 object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
};