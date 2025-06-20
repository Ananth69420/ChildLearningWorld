import { useState, useEffect } from "react";
import { useGameState } from "@/hooks/useGameState";
import MainMenu from "@/components/MainMenu";
import QuizGame from "@/components/QuizGame";
import KeypadGame from "@/components/KeypadGame";
import PuzzleGames from "@/components/PuzzleGames";
import MyWorld from "@/components/MyWorld";
import Shop from "@/components/Shop";
import Progress from "@/components/Progress";
import AvatarCustomization from "@/components/AvatarCustomization";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type GameMode = 'menu' | 'quiz' | 'keypad' | 'puzzle' | 'world' | 'shop' | 'progress' | 'avatar';

export default function GamePage() {
  const { gameState, updateGameState } = useGameState();
  const [currentGame, setCurrentGame] = useState<GameMode>('menu');
  const [nightMode, setNightMode] = useState(false);

  useEffect(() => {
    // Check daily bonus
    const today = new Date().toDateString();
    if (gameState.gameHistory?.lastLogin !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const isConsecutiveDay = gameState.gameHistory?.lastLogin === yesterday;
      
      updateGameState({
        user: {
          ...gameState.user,
          coins: gameState.user.coins + 5
        },
        gameHistory: {
          ...gameState.gameHistory,
          lastLogin: today,
          dailyBonusClaimed: false,
          streakDays: isConsecutiveDay ? (gameState.gameHistory?.streakDays || 0) + 1 : 1
        }
      });
    }
  }, [gameState.gameHistory?.lastLogin, updateGameState]);

  useEffect(() => {
    if (nightMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [nightMode]);

  const navigateToGame = (game: string) => {
    setCurrentGame(game as GameMode);
  };

  const navigateToMenu = () => {
    setCurrentGame('menu');
  };

  const toggleNightMode = () => {
    setNightMode(!nightMode);
    updateGameState({
      settings: {
        ...gameState.settings,
        nightMode: !nightMode
      }
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Night Mode Toggle */}
      <Button
        onClick={toggleNightMode}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-full shadow-lg"
        size="icon"
      >
        {nightMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </Button>

      {/* Game Content */}
      {currentGame === 'menu' && (
        <MainMenu 
          gameState={gameState} 
          updateGameState={updateGameState}
          onNavigate={navigateToGame}
        />
      )}
      
      {currentGame === 'quiz' && (
        <QuizGame 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'keypad' && (
        <KeypadGame 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'puzzle' && (
        <PuzzleGames 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'world' && (
        <MyWorld 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'shop' && (
        <Shop 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'progress' && (
        <Progress 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
      
      {currentGame === 'avatar' && (
        <AvatarCustomization 
          gameState={gameState} 
          updateGameState={updateGameState}
          onBack={navigateToMenu}
        />
      )}
    </div>
  );
}