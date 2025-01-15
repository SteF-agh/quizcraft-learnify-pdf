import { Card } from "@/components/ui/card";
import { LucideBookOpen, LucideFlame } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const LearningModes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("documentId");

  const handleModeSelect = (modeId: string) => {
    if (!documentId) {
      toast.error("Bitte wähle zuerst ein Dokument aus");
      return;
    }

    if (modeId === "quiz") {
      navigate(`/quiz?documentId=${documentId}`);
    } else if (modeId === "flashcards") {
      toast.info("Lernkarten werden bald verfügbar sein");
    } else {
      toast.info("Dieser Modus ist noch nicht verfügbar");
    }
  };

  const learningModes = [
    {
      id: "quiz",
      title: "Quiz-Modus",
      description: "Teste dein Wissen mit interaktiven Fragen",
      icon: LucideFlame,
      gradient: "from-orange-400 to-red-500",
      available: true,
      details: [
        "Multiple-Choice: Wähle die richtige Antwort aus mehreren Optionen",
        "Wahr/Falsch: Entscheide, ob eine Aussage korrekt ist",
        "Offene Fragen: Formuliere deine Antwort in eigenen Worten",
        "Lückentexte: Ergänze fehlende Wörter im Text",
        "Zuordnungsaufgaben: Verbinde zusammengehörige Elemente"
      ]
    },
    {
      id: "flashcards",
      title: "Lernkarten",
      description: "Lerne mit digitalen Karteikarten",
      icon: LucideBookOpen,
      gradient: "from-blue-400 to-indigo-500",
      available: false,
      details: [
        "Vorderseite: Frage oder Begriff",
        "Rückseite: Antwort oder Erklärung",
        "Selbsteinschätzung: Bewerte dein Verständnis",
        "Wiederholungsintervalle: Karten werden basierend auf deiner Leistung wiederholt",
        "Eigene Notizen: Füge persönliche Merkhilfen hinzu"
      ]
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {learningModes.map((mode) => (
        <Card 
          key={mode.id}
          className={`p-6 transition-all duration-300 hover:shadow-lg ${
            mode.available ? 'cursor-pointer hover:-translate-y-1' : 'opacity-75'
          }`}
          onClick={() => handleModeSelect(mode.id)}
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center mb-4`}>
            <mode.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">{mode.title}</h3>
          <p className="text-muted-foreground mb-4">{mode.description}</p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-secondary">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {mode.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>

          {!mode.available && (
            <span className="inline-block mt-3 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Coming Soon
            </span>
          )}
        </Card>
      ))}
    </div>
  );
};