import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";

export const StatsTab = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Detaillierte Statistiken</h2>
      <p className="text-muted-foreground mb-4">
        Hier finden Sie detaillierte Statistiken über die Nutzung der Plattform
      </p>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Nutzungsstatistiken</h3>
            <p className="text-sm text-muted-foreground">
              Übersicht aller Benutzeraktivitäten und Lernfortschritte
            </p>
          </div>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistiken anzeigen
          </Button>
        </div>
      </div>
    </Card>
  );
};