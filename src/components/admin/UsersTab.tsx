import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const UsersTab = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Benutzer verwalten</h2>
      <p className="text-muted-foreground mb-4">
        Hier können Sie Benutzerkonten und Berechtigungen verwalten
      </p>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Benutzerübersicht</h3>
            <p className="text-sm text-muted-foreground">
              Alle registrierten Benutzer und ihre Rollen
            </p>
          </div>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Benutzer verwalten
          </Button>
        </div>
      </div>
    </Card>
  );
};