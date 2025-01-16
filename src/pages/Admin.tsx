import { Layout } from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentTableBase } from "@/components/dashboard/DocumentTableBase";

const Admin = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const { documents, fetchDocuments } = useDocuments();

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

  const handleUploadSuccess = () => {
    toast.success("Dokument erfolgreich hochgeladen");
    fetchDocuments();
  };

  if (!userRole) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList>
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="stats">Statistiken</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 col-span-1">
                <h2 className="text-xl font-semibold mb-4">Neues Skript hochladen</h2>
                <p className="text-muted-foreground mb-4">
                  Lade hier neue Skripte hoch, die dann allen Teilnehmern zur Verfügung stehen
                </p>
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </Card>

              <Card className="p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Vorhandene Skripte</h2>
                <div className="overflow-x-auto">
                  <DocumentTableBase
                    documents={documents}
                    showActions={true}
                    onDocumentDeleted={fetchDocuments}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Benutzer verwalten</h2>
              <p className="text-muted-foreground mb-4">
                Benutzerkonten und Berechtigungen verwalten
              </p>
              <Button variant="outline" className="w-full">
                Benutzer verwalten
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Benutzer Statistiken</h2>
              <p className="text-muted-foreground mb-4">
                Übersicht aller Benutzeraktivitäten und Lernfortschritte
              </p>
              <Button variant="outline" className="w-full">
                Statistiken anzeigen
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;