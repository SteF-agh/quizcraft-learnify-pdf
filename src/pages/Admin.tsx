import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCards } from "@/components/admin/StatsCards";
import { DocumentsTab } from "@/components/admin/DocumentsTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { StatsTab } from "@/components/admin/StatsTab";

const Admin = () => {
  const [userRole] = useState('admin');
  const [searchQuery, setSearchQuery] = useState("");

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

        <StatsCards documentsCount={documents?.length || 0} />
        
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="documents">Dokumente</TabsTrigger>
            <TabsTrigger value="users">Benutzer</TabsTrigger>
            <TabsTrigger value="stats">Statistiken</TabsTrigger>
          </TabsList>

          <TabsContent value="documents">
            <DocumentsTab 
              documents={filteredDocuments}
              onUploadSuccess={handleUploadSuccess}
              onRefetch={refetch}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTab />
          </TabsContent>

          <TabsContent value="stats">
            <StatsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;