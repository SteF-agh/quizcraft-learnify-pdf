import { Header } from "@/components/dashboard/Header";
import { Footer } from "@/components/dashboard/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-32">
        {children}
      </main>
      <Footer />
    </div>
  );
};