import { Layout } from "@/components/layout/Layout";
import { DocumentSection } from "@/components/dashboard/DocumentSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trophy, Coins, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/avatar-creator">
              <Avatar className="h-16 w-16 cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SF</AvatarFallback>
              </Avatar>
            </Link>
            <h1 className="text-3xl font-bold">
              Willkommen, <span className="text-primary">Stefanie Feurstein</span>!
            </h1>
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
          </div>
        </div>

        <StatsSection />
        <DocumentSection />
      </div>
    </Layout>
  );
};

export default Dashboard;