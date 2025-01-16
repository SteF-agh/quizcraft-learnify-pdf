import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { useDocuments } from "@/hooks/useDocuments";
import { DocumentTableBase } from "@/components/dashboard/DocumentTableBase";
import { Search, Users, FileText, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";

const Admin = () => {
  const [userRole] = useState('admin');
  const { documents, fetchDocuments } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");

  const handleUploadSuccess = () => {
    toast.success("Dokument erfolgreich hochgeladen");
    fetchDocuments();
  };

  const filteredDocuments = documents?.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!userRole) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Input
              type="search"
              placeholder="Dokumente suchen..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Statistik-Karten */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gesamt Dokumente</p>
              <p className="text-2xl font-bold">{documents?.length || 0}</p>
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
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="w-full justify-start">
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
                    documents={filteredDocuments}
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
          </TabsContent>

          <TabsContent value="stats">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;