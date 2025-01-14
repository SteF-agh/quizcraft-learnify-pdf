import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/dashboard/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-16 pb-16 flex-grow">
        <div className="mt-8 grid lg:grid-cols-2 gap-16 items-center bg-white/50 rounded-2xl p-12 shadow-lg">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold leading-tight">
              Willkommen bei LeeonQuiz –
              <span className="text-primary block mt-2">Lernen mit Spaß!</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Upload your PDF documents and let our AI generate engaging quiz questions to enhance your learning experience.
            </p>
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                Zum Dashboard
              </Button>
            </div>
          </div>

          <div className="lg:block relative">
            <img
              src="/lovable-uploads/0c9c15e3-978d-4d58-95c3-d935f65127d1.png"
              alt="Leeon Mascot"
              className="w-full max-w-md mx-auto transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;