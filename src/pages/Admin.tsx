import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Admin = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast.error("Kein Zugriff auf den Admin-Bereich");
        navigate('/dashboard');
        return;
      }

      setUserRole(profile.role);
    };

    checkAdminAccess();
  }, [navigate]);

  if (!userRole) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Benutzer Statistiken</h2>
            <p className="text-muted-foreground mb-4">
              Übersicht aller Benutzeraktivitäten und Lernfortschritte
            </p>
            <Button variant="outline" className="w-full">
              Statistiken anzeigen
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dokumente verwalten</h2>
            <p className="text-muted-foreground mb-4">
              Alle hochgeladenen Dokumente und Lernmaterialien
            </p>
            <Button variant="outline" className="w-full">
              Dokumente verwalten
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Benutzer verwalten</h2>
            <p className="text-muted-foreground mb-4">
              Benutzerkonten und Berechtigungen verwalten
            </p>
            <Button variant="outline" className="w-full">
              Benutzer verwalten
            </Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;