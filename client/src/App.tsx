import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import GamePage from "@/pages/game";
import NotFound from "@/pages/not-found";

// ✅ Initialize default game state if missing
if (!localStorage.getItem("gameState")) {
  const defaultGameState = {
    user: {
      xp: 0,
      coins: 0,
    },
    gameHistory: {
      lastLogin: "",
      dailyBonusClaimed: false,
      streakDays: 0,
      levelsCompleted: [],
    },
    cityGrid: Array(10)
      .fill(null)
      .map(() => Array(10).fill(null)), // 10x10 grid
  };
  localStorage.setItem("gameState", JSON.stringify(defaultGameState));
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GamePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
