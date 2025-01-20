import { Card } from "@/components/ui/card";
import { FileText, Users, BarChart3, Search } from "lucide-react";

interface StatsCardsProps {
  documentsCount: number;
}

export const StatsCards = ({ documentsCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Gesamt Dokumente</p>
          <p className="text-2xl font-bold">{documentsCount}</p>
        </div>
      </Card>
      
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-secondary/10 rounded-full">
          <Users className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Aktive Benutzer</p>
          <p className="text-2xl font-bold">-</p>
        </div>
      </Card>
      
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-accent/10 rounded-full">
          <BarChart3 className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Quiz Durchschnitt</p>
          <p className="text-2xl font-bold">-</p>
        </div>
      </Card>
      
      <Card className="p-6 flex items-center space-x-4">
        <div className="p-3 bg-destructive/10 rounded-full">
          <Search className="h-6 w-6 text-destructive" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Offene Anfragen</p>
          <p className="text-2xl font-bold">-</p>
        </div>
      </Card>
    </div>
  );
};