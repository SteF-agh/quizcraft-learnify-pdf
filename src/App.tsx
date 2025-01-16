import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import LearningMode from "./pages/LearningMode";
import Flashcards from "./pages/Flashcards";
import Admin from "./pages/Admin";
import AvatarCreator from "./pages/AvatarCreator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/learning-mode" element={<LearningMode />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/avatar-creator" element={<AvatarCreator />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;