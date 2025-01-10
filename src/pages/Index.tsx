import { Header } from "@/components/dashboard/Header";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-16 space-y-12">
        <WelcomeSection />
      </main>
    </div>
  );
};

export default Index;