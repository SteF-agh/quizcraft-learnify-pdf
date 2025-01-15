import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Gamepad } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const LearningMode = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get("documentId");

  const learningModes = [
    {
      id: "quiz",
      title: "Quiz-Modus",
      description: "Teste dein Wissen mit interaktiven Fragen",
      icon: Brain,
      available: true,
      gradient: "from-blue-400 to-indigo-500",
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
      icon: BookOpen,
      available: true,
      gradient: "from-purple-400 to-pink-500",
      details: [
        "Vorderseite: Frage oder Begriff",
        "Rückseite: Antwort oder Erklärung",
        "Selbsteinschätzung: Bewerte dein Verständnis",
        "Wiederholungsintervalle: Karten werden basierend auf deiner Leistung wiederholt",
        "Eigene Notizen: Füge persönliche Merkhilfen hinzu"
      ]
    },
    {
      id: "game",
      title: "Spiel-Modus",
      description: "Lerne spielerisch (Coming Soon)",
      icon: Gamepad,
      available: false,
      gradient: "from-orange-400 to-red-500",
      details: [
        "Interaktive Lernspiele",
        "Punktesystem und Achievements",
        "Wettbewerb mit anderen Lernenden",
        "Verschiedene Schwierigkeitsgrade",
        "Tägliche Herausforderungen"
      ]
    }
  ];

  const handleModeSelect = (modeId: string) => {
    if (!documentId) {
      toast.error("Bitte wähle zuerst ein Dokument aus");
      return;
    }

    const mode = learningModes.find(m => m.id === modeId);
    if (!mode?.available) {
      toast.info("Dieser Modus ist noch nicht verfügbar");
      return;
    }

    if (modeId === "quiz") {
      navigate(`/quiz?documentId=${documentId}`);
    } else if (modeId === "flashcards") {
      navigate(`/flashcards?documentId=${documentId}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
          Wähle dein Lernformat
        </h1>
        
        <div className="grid md:grid-cols-3 gap-6">
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
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="text-sm hover:no-underline py-2">
                    Mehr erfahren
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {mode.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {!mode.available && (
                <span className="inline-block mt-3 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  Coming Soon
                </span>
              )}
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mt-8 mx-auto block"
        >
          Zurück zum Dashboard
        </Button>
      </div>
    </Layout>
  );
};

export default LearningMode;