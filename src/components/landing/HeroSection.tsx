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
          <div className="w-full h-auto max-w-md relative">
            <img
              src="/lovable-uploads/4743755b-3e90-43bb-8c20-de2796e864cf.png"
              alt="Leeon Mascot"
              className="w-full h-auto object-contain transition-all duration-500 hover:scale-105 transform-gpu"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};