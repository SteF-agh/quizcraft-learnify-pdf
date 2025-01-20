import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { Search, Users, FileText, BarChart3, Globe, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

const Admin = () => {
  const [userRole] = useState('admin');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  // Fetch documents using React Query
  const { data: documents = [], refetch } = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      console.log('Fetching documents for admin view...');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast.error('Fehler beim Laden der Dokumente');
        return [];
      }

      console.log('Fetched documents:', data);
      return data || [];
    }
  });

  const handleUploadSuccess = () => {
    toast.success("Dokument erfolgreich hochgeladen");
    refetch();
  };

  const handleTogglePublic = async (documentId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ is_public: !currentState })
        .eq('id', documentId);

      if (error) throw error;

      toast.success(`Dokument ist jetzt ${!currentState ? 'öffentlich' : 'privat'}`);
      refetch();
    } catch (error) {
      console.error('Error toggling document visibility:', error);
      toast.error('Fehler beim Ändern der Sichtbarkeit');
    }
  };

  const handleGenerateQuiz = async (documentId: string) => {
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      toast.success('Quiz wurde erfolgreich generiert');
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Fehler beim Generieren des Quiz');
    }
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
                  <div className="w-full">
                    <div className="rounded-md border">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Größe</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Datum</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Öffentlich</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Aktionen</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDocuments.map((doc) => (
                            <tr key={doc.id} className="border-b transition-colors hover:bg-muted/50">
                              <td className="p-4 align-middle">{doc.name}</td>
                              <td className="p-4 align-middle">
                                {doc.file_size ? `${Math.round(doc.file_size / 1024)} KB` : 'N/A'}
                              </td>
                              <td className="p-4 align-middle">
                                {new Date(doc.created_at).toLocaleDateString()}
                              </td>
                              <td className="p-4 align-middle">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={doc.is_public}
                                    onCheckedChange={() => handleTogglePublic(doc.id, doc.is_public)}
                                  />
                                  <Globe className={`h-4 w-4 ${doc.is_public ? 'text-primary' : 'text-muted-foreground'}`} />
                                </div>
                              </td>
                              <td className="p-4 align-middle space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGenerateQuiz(doc.id)}
                                  className="mr-2"
                                >
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Quiz generieren
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    // Handle delete
                                  }}
                                >
                                  Löschen
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
