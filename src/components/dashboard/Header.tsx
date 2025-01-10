import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/44addff5-511d-4fae-a8bc-f8ab538c69fc.png" 
            alt="Leeon Logo" 
            className="h-10 w-10"
          />
          <Button 
            variant="ghost" 
            className="text-2xl font-bold text-secondary hover:text-secondary/80"
            onClick={() => navigate("/")}
          >
            LeeonQuiz
          </Button>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button 
                variant="outline"
                className="mr-2"
                onClick={() => navigate("/")}
              >
                Dashboard
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant="accent"
                onClick={() => navigate("/quiz")}
              >
                Start Quiz
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};