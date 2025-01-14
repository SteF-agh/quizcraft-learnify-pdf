import { Card } from "@/components/ui/card";
import { LucideBookOpen, LucideFlame } from "lucide-react";

export const LearningModes = () => {
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

  return (
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
  );
};