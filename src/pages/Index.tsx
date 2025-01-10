import { Header } from "@/components/dashboard/Header";
import { FileUpload } from "@/components/FileUpload";
import { Footer } from "@/components/dashboard/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-16 space-y-12 flex-grow">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Upload Your PDF</h1>
          <FileUpload />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;