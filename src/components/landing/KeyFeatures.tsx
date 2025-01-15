import { Card } from "@/components/ui/card";
import { LucideBookOpen, LucideUpload, LucideTrophy, LucideUsers } from "lucide-react";

export const KeyFeatures = () => {
  const features = [
    {
      title: "Vielfältige Lernformate",
      description: "Wählen Sie das Format, das zu Ihnen passt! Ob spannende Quizzes, effektive Lernkarten oder bald auch interaktive Spiele – hier findet jeder seinen Weg zum Lernerfolg.",
      icon: LucideBookOpen,
      gradient: "from-primary to-secondary"
    },
    {
      title: "Individuelle Inhalte",
      description: "Lernen, was Sie wirklich brauchen! Laden Sie Ihre eigenen Skripte hoch und gestalten Sie Ihre Lerninhalte passgenau nach Ihren Bedürfnissen.",
      icon: LucideUpload,
      gradient: "from-secondary to-accent"
    },
    {
      title: "Motivation durch Fortschritt",
      description: "Punkte sammeln leicht gemacht: Verfolgen Sie Ihren Fortschritt, gewinnen Sie Punkte und bleiben Sie motiviert – Schritt für Schritt zu Ihrem Ziel.",
      icon: LucideTrophy,
      gradient: "from-accent to-primary"
    },
    {
      title: "Freiwilliger Wettbewerb",
      description: "Messen Sie sich mit anderen Teilnehmer:innen auf unserem Leaderboard! Teilen Sie Ihre Erfolge – oder lernen Sie einfach nur für sich selbst.",
      icon: LucideUsers,
      gradient: "from-primary to-accent"
    }
  ];

  return (
    <div className="mt-24">
      <h2 className="text-3xl font-bold text-center mb-4">Entdecken Sie, wie einfach und motivierend Lernen sein kann</h2>
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <p className="text-lg text-muted-foreground">
          Mit LeeonQuiz wird Lernen smarter, flexibler und unterhaltsamer. Bereit, Ihre Ziele zu erreichen? 🎯
        </p>
      </div>
    </div>
  );
};