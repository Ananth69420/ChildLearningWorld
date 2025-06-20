import { useState } from "react";
import { GameState, Building } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { audioManager } from "@/lib/audioUtils";
import { X, Trash2, Save } from "lucide-react";

interface MyWorldProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

const buildings: Building[] = [
  { id: "house", name: "House", emoji: "/assets/house.jpg", cost: 50, unlocked: true, requiredBadges: 0 },
  { id: "apartment", name: "Apartment", emoji: "/assets/building.jpeg", cost: 50, unlocked: true, requiredBadges: 0 },
  { id: "tree", name: "Tree", emoji: "/assets/tree.jpeg", cost: 20, unlocked: true, requiredBadges: 0 },
  { id: "park", name: "Park", emoji: "/assets/park.png", cost: 100, unlocked: true, requiredBadges: 0 },
  { id: "road", name: "Road", emoji: "/assets/road.png", cost: 10, unlocked: true, requiredBadges: 0 },
  { id: "road2", name: "Road2", emoji: "/assets/inv road.png", cost: 10, unlocked: true, requiredBadges: 0 },
  { id: "school", name: "School", emoji: "/assets/school.jpeg", cost: 200, unlocked: true, requiredBadges: 5 },
  { id: "hospital", name: "Hospital", emoji: "/assets/hospital.jpeg", cost: 300, unlocked: true, requiredBadges: 8 },
  { id: "castle", name: "Castle", emoji: "/assets/castle.jpeg", cost: 500, unlocked: true, requiredBadges: 10 },
];

export default function MyWorld({ gameState, updateGameState, onBack }: MyWorldProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  if (!gameState.cityGrid || !Array.isArray(gameState.cityGrid)) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        ⚠️ City grid not loaded properly.
      </div>
    );
  }

  const handleBuildingSelect = (building: Building) => {
    if (!building.unlocked || building.requiredBadges > gameState.user.badges.length) return;
    audioManager.play("click");
    setSelectedBuilding(building);
  };

  const handleTileClick = (row: number, col: number) => {
    if (!selectedBuilding || !gameState.cityGrid?.[row]) return;
    if (gameState.user.coins < selectedBuilding.cost) {
      audioManager.play("incorrect");
      return;
    }

    const newGrid = [...gameState.cityGrid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = selectedBuilding.emoji;

    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins - selectedBuilding.cost,
      },
      cityGrid: newGrid,
    });

    audioManager.play("correct");
    showConfetti();
  };

  const handleTileRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (!gameState.cityGrid?.[row]) return;
    const newGrid = [...gameState.cityGrid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = "";
    updateGameState({ cityGrid: newGrid });
  };

  const clearCity = () => {
    const emptyGrid = Array(10).fill(null).map(() => Array(10).fill(""));
    updateGameState({ cityGrid: emptyGrid });
    audioManager.play("click");
  };

  const saveCity = () => {
    audioManager.play("correct");
  };

  const showConfetti = () => {
    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"];
    const container = document.createElement("div");
    container.className = "fixed inset-0 pointer-events-none z-50";
    document.body.appendChild(container);
    for (let i = 0; i < 20; i++) {
      const dot = document.createElement("div");
      dot.className = "confetti";
      dot.style.left = Math.random() * 100 + "%";
      dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      dot.style.animationDelay = Math.random() * 3 + "s";
      container.appendChild(dot);
    }
    setTimeout(() => document.body.removeChild(container), 3000);
  };

  const getBuildingAvailability = (b: Building) => {
    if (!b.unlocked) return { available: false, reason: "Locked" };
    if (b.requiredBadges > gameState.user.badges.length) return { available: false, reason: `Need ${b.requiredBadges} badges` };
    if (gameState.user.coins < b.cost) return { available: false, reason: "Not enough coins" };
    return { available: true, reason: "" };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full h-full max-w-6xl max-h-screen overflow-hidden">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">🏗️ My Dream City</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="fas fa-coins text-xl text-yellow-500"></i>
                <span className="text-xl font-bold text-gray-800 dark:text-white">{gameState.user.coins}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 space-x-4">
            {/* Sidebar */}
              <div className="w-64 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 overflow-y-auto max-h-[calc(100vh-200px)]">

              <h3 className="text-lg font-fredoka text-gray-800 dark:text-white mb-4">🏪 Buildings</h3>
              <div className="space-y-3">
                {buildings.map((b) => {
                  const availability = getBuildingAvailability(b);
                  return (
                    <Card
                      key={b.id}
                      className={`cursor-pointer transition-shadow ${selectedBuilding?.id === b.id ? "ring-2 ring-blue-500" : ""} ${!availability.available ? "opacity-50" : "hover:shadow-md"}`}
                      onClick={() => handleBuildingSelect(b)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <img src={b.emoji} alt={b.name} className="w-10 h-10 object-contain" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{b.name}</p>
                            <p className={`text-sm ${availability.available ? "text-yellow-600" : "text-red-600"}`}>
                              {availability.available ? `${b.cost} coins` : availability.reason}
                            </p>
                            {b.requiredBadges > 0 && (
                              <p className="text-xs text-gray-500">🏆 {b.requiredBadges} badges required</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Grid Area */}
            <div className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-0">
              <div className="grid grid-cols-10 gap-0 h-full">
                {gameState.cityGrid.map((row, rowIdx) =>
                  row.map((cell, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className="w-full aspect-square relative border border-white"
                      onClick={() => handleTileClick(rowIdx, colIdx)}
                      onContextMenu={(e) => handleTileRightClick(e, rowIdx, colIdx)}
                    >
                      {cell ? (
                        <img src={cell} alt="tile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/30"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button onClick={clearCity} variant="destructive" className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
              <Button onClick={saveCity} className="bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save City</span>
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {selectedBuilding ? `Selected: ${selectedBuilding.name} (${selectedBuilding.cost} coins)` : "Select a building from the palette!"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
