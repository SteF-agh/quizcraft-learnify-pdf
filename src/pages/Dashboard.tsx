import { Layout } from "@/components/layout/Layout";
import { DocumentSection } from "@/components/dashboard/DocumentSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Coins } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { StatsSection } from "@/components/dashboard/StatsSection";

const Dashboard = () => {
  const { documents, handleDocumentDeleted } = useDocuments();
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
        <div className="max-w-7xl mx-auto w-full px-4 py-8 space-y-12">
          {/* Header Section */}
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">
                  Willkommen, <span className="text-primary">Stefanie Feurstein</span>!
                </h1>
                <p className="text-muted-foreground mt-2">
                  Hier findest du deine Lernmaterialien und Fortschritte
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 text-yellow-500" />
                  <span className="text-xl font-bold">2,500</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  <span className="text-xl font-bold">12</span>
                </div>
                <Link to="/avatar-creator">
                  <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all duration-300">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>SF</AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <StatsSection progress={75} />

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Documents Section with updated styling */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <DocumentSection 
                documents={documents}
                onDocumentDeleted={handleDocumentDeleted}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;