
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 max-w-2xl mx-auto text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Willkommen beim LeeonQuiz
            <span className="text-primary block mt-2">
              Lernen mit Spaß!
            </span>
          </h1>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-lg relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl transform rotate-3"></div>
            <img
              src="/lovable-uploads/4743755b-3e90-43bb-8c20-de2796e864cf.png"
              alt="Leeon Mascot"
              className="relative z-10 w-full h-auto object-contain transform transition-all duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
