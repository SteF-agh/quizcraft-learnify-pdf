import { Header } from "@/components/dashboard/Header";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { Footer } from "@/components/dashboard/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-16 space-y-12 flex-grow">
        <WelcomeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;