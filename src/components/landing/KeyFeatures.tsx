import { Card } from "@/components/ui/card";
import { LucideBookOpen, LucideUpload, LucideTrophy, LucideUsers } from "lucide-react";

export const KeyFeatures = () => {
  const features = [
    {
      title: "Vielfältige Lernformate",
      description: "Wähle das Format, das zu dir passt! Ob spannende Quizzes, effektive Lernkarten oder bald auch interaktive Spiele – hier findest du deinen Weg zum Lernerfolg.",
      icon: LucideBookOpen,
      gradient: "from-primary to-secondary"
    },
    {
      title: "Individuelle Inhalte",
      description: "Lerne, was du wirklich brauchst! Lade deine eigenen Skripte hoch und gestalte deine Lerninhalte passgenau nach deinen Bedürfnissen.",
      icon: LucideUpload,
      gradient: "from-secondary to-accent"
    },
    {
      title: "Motivation durch Fortschritt",
      description: "Punkte sammeln leicht gemacht: Verfolge deinen Fortschritt, gewinne Punkte und bleibe motiviert – Schritt für Schritt zu deinem Ziel.",
      icon: LucideTrophy,
      gradient: "from-accent to-primary"
    },
    {
      title: "Freiwilliger Wettbewerb",
      description: "Miss dich mit anderen Teilnehmer:innen auf unserem Leaderboard! Teile deine Erfolge – oder lerne einfach nur für dich selbst.",
      icon: LucideUsers,
      gradient: "from-primary to-accent"
    }
  ];

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-center mb-4">Entdecke, wie einfach und motivierend Lernen sein kann</h2>
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
          Mit LeeonQuiz wird Lernen smarter, flexibler und unterhaltsamer. Bereit, deine Ziele zu erreichen? 🎯
        </p>
      </div>
    </div>
  );
};