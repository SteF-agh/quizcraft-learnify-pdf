import { Button } from "@/components/ui/button"

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-border/50 bg-white/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/lovable-uploads/44addff5-511d-4fae-a8bc-f8ab538c69fc.png"
              alt="LeeonQuiz Logo"
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-secondary">LeeonQuiz</h1>
          </div>
          <nav>
            <Button variant="ghost" className="text-secondary hover:text-primary">Login</Button>
          </nav>
        </div>
      </div>
    </header>
  );
};