import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { ThemeMinimal } from '@supabase/auth-ui-shared';

export const HeroSection = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Willkommen beim LeeonQuiz –
            <span className="text-primary block mt-2">
              Lernen mit Spaß!
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Entdecken Sie eine neue Art des Lernens - interaktiv, individuell und inspirierend.
          </p>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
            <img
              src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
              alt="Leeon Mascot"
              className="w-full h-full object-contain transition-all duration-500 hover:scale-105 transform-gpu"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};