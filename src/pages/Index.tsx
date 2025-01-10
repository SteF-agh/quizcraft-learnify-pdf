import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { ActiveQuizzes } from "@/components/dashboard/ActiveQuizzes";
import { Achievements } from "@/components/dashboard/Achievements";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";

const Index = () => {
  const [progress] = useState(65);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <ProgressCard progress={progress} />
          <ActiveQuizzes />
          <Achievements />
        </div>

        <WelcomeSection />
      </main>
    </div>
  );
};

export default Index;