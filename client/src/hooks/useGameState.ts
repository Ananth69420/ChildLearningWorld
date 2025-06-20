import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { GameState } from "@shared/schema";

const defaultGameState: GameState = {
  user: {
    name: "Explorer",
    level: 1,
    xp: 0,
    coins: 50,
    stars: 0,
    badges: [],
    totalGamesPlayed: 0,
    avatar: {
      hair: "👧",
      clothes: "",
      accessories: "",
      skinTone: "",
      pet: "🐰",
    },
    inventory: [],
    progress: [
      {
        subject: "Mathematics",
        level: 1,
        progress: 0,
        stars: 0,
        totalQuestions: 0,
        correctAnswers: 0,
      },
      {
        subject: "Language Arts",
        level: 1,
        progress: 0,
        stars: 0,
        totalQuestions: 0,
        correctAnswers: 0,
      },
      {
        subject: "Problem Solving",
        level: 1,
        progress: 0,
        stars: 0,
        totalQuestions: 0,
        correctAnswers: 0,
      },
    ],
  },
  cityGrid: Array(10)
    .fill(null)
    .map(() => Array(10).fill("")),
  settings: {
    soundEnabled: true,
    nightMode: false,
    difficulty: "easy",
  },
  gameHistory: {
    lastLogin: undefined,
    dailyBonusClaimed: false,
    streakDays: 0,
  },
};

export function useGameState() {
  const [gameState, setGameState] = useLocalStorage<GameState>(
    "learnquest-game-state",
    defaultGameState,
  );

  // ✅ Auto-fix missing or broken cityGrid
  useEffect(() => {
    const gridBroken =
      !gameState.cityGrid ||
      gameState.cityGrid.length !== 10 ||
      gameState.cityGrid.some((row) => row.length !== 10);

    if (gridBroken) {
      const fixedGrid = Array(10)
        .fill(null)
        .map(() => Array(10).fill(""));
      updateGameState({ cityGrid: fixedGrid });
      console.log("✅ Fixed broken or missing cityGrid.");
    }
  }, [gameState.cityGrid]);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  const calculateLevel = (xp: number) => Math.floor(xp / 1500) + 1;

  const getXPForNextLevel = (currentXP: number) => {
    const currentLevel = calculateLevel(currentXP);
    return currentLevel * 1500;
  };

  const awardXP = (amount: number) => {
    const newXP = gameState.user.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > gameState.user.level;

    updateGameState({
      user: {
        ...gameState.user,
        xp: newXP,
        level: newLevel,
      },
    });

    return { leveledUp, newLevel };
  };

  const awardCoins = (amount: number) => {
    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins + amount,
      },
    });
  };

  const spendCoins = (amount: number) => {
    if (gameState.user.coins >= amount) {
      updateGameState({
        user: {
          ...gameState.user,
          coins: gameState.user.coins - amount,
        },
      });
      return true;
    }
    return false;
  };

  return {
    gameState,
    updateGameState,
    awardXP,
    awardCoins,
    spendCoins,
    calculateLevel,
    getXPForNextLevel,
  };
}
