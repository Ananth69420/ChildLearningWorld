import { useLocalStorage } from './useLocalStorage';
import { GameState, gameStateSchema } from '@shared/schema';

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
      pet: "🐰"
    },
    inventory: [],
    progress: [
      { subject: "Mathematics", level: 1, progress: 0, stars: 0, totalQuestions: 0, correctAnswers: 0 },
      { subject: "Language Arts", level: 1, progress: 0, stars: 0, totalQuestions: 0, correctAnswers: 0 },
      { subject: "Problem Solving", level: 1, progress: 0, stars: 0, totalQuestions: 0, correctAnswers: 0 }
    ]
  },
  cityGrid: Array(10).fill(null).map(() => Array(10).fill("")),
  settings: {
    soundEnabled: true,
    nightMode: false,
    difficulty: 'easy'
  },
  gameHistory: {
    lastLogin: undefined,
    dailyBonusClaimed: false,
    streakDays: 0
  }
};

export function useGameState() {
  const [gameState, setGameState] = useLocalStorage<GameState>('learnquest-game-state', defaultGameState);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1500) + 1;
  };

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
        level: newLevel
      }
    });

    return { leveledUp, newLevel };
  };

  const awardCoins = (amount: number) => {
    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins + amount
      }
    });
  };

  const spendCoins = (amount: number) => {
    if (gameState.user.coins >= amount) {
      updateGameState({
        user: {
          ...gameState.user,
          coins: gameState.user.coins - amount
        }
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
    getXPForNextLevel
  };
}
