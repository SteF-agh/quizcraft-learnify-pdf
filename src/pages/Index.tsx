import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/dashboard/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LucideBookOpen, LucideFlame, LucideTrophy } from "lucide-react";
import { Auth } from '@supabase/auth-ui-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const learningModes = [
    {
      title: "Quiz-Modus",
      description: "Teste dein Wissen mit interaktiven Fragen",
      icon: LucideFlame,
      gradient: "from-orange-400 to-red-500"
    },
    {
      title: "Lern-Modus",
      description: "Lerne in deinem eigenen Tempo",
      icon: LucideBookOpen,
      gradient: "from-blue-400 to-indigo-500"
    }
  ];

  if (session) {
    return null; // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-16 pb-16 flex-grow">
        {/* Hero Section */}
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
                  theme: 'light',
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

        {/* Learning Modes Section */}
        <div className="mt-24">
          <h3 className="text-3xl font-bold text-center mb-12">Lernmöglichkeiten</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {learningModes.map((mode, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-4`}>
                  <mode.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-2">{mode.title}</h4>
                <p className="text-muted-foreground">{mode.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Leaderboard Preview Section */}
        <div className="mt-24 bg-white/50 rounded-2xl p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                <LucideTrophy className="w-5 h-5" />
                <span className="font-medium">Leaderboard Feature</span>
              </div>
              <h3 className="text-3xl font-bold">Vergleiche deine Leistungen</h3>
              <p className="text-lg text-muted-foreground">
                Optional kannst du deine Ergebnisse im Leaderboard veröffentlichen und mit anderen vergleichen!
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Leaderboard Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div className="flex-grow">
                    <div className="font-medium">Top Learner</div>
                    <div className="text-sm text-muted-foreground">2400 Punkte</div>
                  </div>
                  <LucideTrophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex items-center gap-4 p-3 bg-secondary/5 rounded-lg">
                  <div className="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div className="flex-grow">
                    <div className="font-medium">Quick Thinker</div>
                    <div className="text-sm text-muted-foreground">2100 Punkte</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-accent/5 rounded-lg">
                  <div className="w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div className="flex-grow">
                    <div className="font-medium">Knowledge Seeker</div>
                    <div className="text-sm text-muted-foreground">1950 Punkte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;