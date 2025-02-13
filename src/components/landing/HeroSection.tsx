
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Lernen leicht gemacht
            <span className="text-primary block mt-2">
              für Ihren Erfolg
            </span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-xl">
            Eine moderne Lernplattform, die speziell für kleine Gruppen entwickelt wurde. 
            Effektiv, fokussiert und praxisorientiert.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
            >
              Zum Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
            {[
              { title: "Fokussiert", desc: "Speziell für kleine Gruppen" },
              { title: "Effizient", desc: "Direkt zum Lernziel" },
              { title: "Praxisnah", desc: "Mit echten Anwendungsfällen" }
            ].map((item, index) => (
              <Card key={index} className="p-4 text-center border-primary/20 bg-card/50 backdrop-blur">
                <h3 className="font-bold text-lg text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
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
