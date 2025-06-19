import { useState } from 'react';
import { GameState, Building } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { audioManager } from '@/lib/audioUtils';
import { X, Trash2, Save } from 'lucide-react';

interface MyWorldProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

const buildings: Building[] = [
  { id: 'house', name: 'House', emoji: '🏠', cost: 50, unlocked: true, requiredBadges: 0 },
  { id: 'tree', name: 'Tree', emoji: '🌳', cost: 20, unlocked: true, requiredBadges: 0 },
  { id: 'park', name: 'Park', emoji: '🏞️', cost: 100, unlocked: true, requiredBadges: 0 },
  { id: 'road', name: 'Road', emoji: '🛣️', cost: 10, unlocked: true, requiredBadges: 0 },
  { id: 'school', name: 'School', emoji: '🏫', cost: 200, unlocked: false, requiredBadges: 5 },
  { id: 'hospital', name: 'Hospital', emoji: '🏥', cost: 300, unlocked: false, requiredBadges: 8 },
  { id: 'castle', name: 'Castle', emoji: '🏰', cost: 500, unlocked: false, requiredBadges: 10 }
];

export default function MyWorld({ gameState, updateGameState, onBack }: MyWorldProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [draggedBuilding, setDraggedBuilding] = useState<Building | null>(null);

  const handleBuildingSelect = (building: Building) => {
    if (!building.unlocked || (building.requiredBadges > 0 && gameState.user.badges.length < building.requiredBadges)) {
      return;
    }
    audioManager.play('click');
    setSelectedBuilding(building);
  };

  const handleTileClick = (row: number, col: number) => {
    if (!selectedBuilding) return;
    
    if (gameState.user.coins < selectedBuilding.cost) {
      audioManager.play('incorrect');
      return;
    }

    // Place building on tile
    const newGrid = [...gameState.cityGrid];
    newGrid[row][col] = selectedBuilding.emoji;

    // Deduct coins
    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins - selectedBuilding.cost
      },
      cityGrid: newGrid
    });

    audioManager.play('correct');
    showConfetti();
  };

  const handleTileRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    // Remove building from tile
    const newGrid = [...gameState.cityGrid];
    newGrid[row][col] = '';
    
    updateGameState({
      cityGrid: newGrid
    });
  };

  const clearCity = () => {
    const emptyGrid = Array(10).fill(null).map(() => Array(10).fill(''));
    updateGameState({
      cityGrid: emptyGrid
    });
    audioManager.play('click');
  };

  const saveCity = () => {
    // City is automatically saved through updateGameState
    audioManager.play('correct');
    // Could show a toast here
  };

  const showConfetti = () => {
    // Simple confetti effect
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 3000);
  };

  const getBuildingAvailability = (building: Building) => {
    if (!building.unlocked) return { available: false, reason: 'Locked' };
    if (building.requiredBadges > gameState.user.badges.length) {
      return { available: false, reason: `Need ${building.requiredBadges} badges` };
    }
    if (gameState.user.coins < building.cost) {
      return { available: false, reason: 'Not enough coins' };
    }
    return { available: true, reason: '' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full h-full max-w-6xl max-h-screen overflow-hidden">
        <CardContent className="p-6 h-full flex flex-col">
          {/* World Header */}
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
            {/* Building Palette */}
            <div className="w-64 bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 overflow-y-auto">
              <h3 className="text-lg font-fredoka text-gray-800 dark:text-white mb-4">🏪 Buildings</h3>
              <div className="space-y-3">
                {buildings.map(building => {
                  const availability = getBuildingAvailability(building);
                  return (
                    <Card 
                      key={building.id}
                      className={`cursor-pointer transition-shadow ${
                        selectedBuilding?.id === building.id ? 'ring-2 ring-blue-500' : ''
                      } ${!availability.available ? 'opacity-50' : 'hover:shadow-md'}`}
                      onClick={() => handleBuildingSelect(building)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{building.emoji}</div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">{building.name}</p>
                            <p className={`text-sm ${availability.available ? 'text-yellow-600' : 'text-red-600'}`}>
                              {availability.available ? `${building.cost} coins` : availability.reason}
                            </p>
                            {building.requiredBadges > 0 && (
                              <p className="text-xs text-gray-500">
                                🏆 {building.requiredBadges} badges required
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* City Grid */}
            <div className="flex-1 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-2xl p-4">
              <div className="grid grid-cols-10 gap-1 h-full">
                {gameState.cityGrid.map((row, rowIndex) => 
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="building-tile bg-white/50 dark:bg-gray-800/50 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 cursor-pointer flex items-center justify-center text-2xl transition-all aspect-square"
                      onClick={() => handleTileClick(rowIndex, colIndex)}
                      onContextMenu={(e) => handleTileRightClick(e, rowIndex, colIndex)}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                onClick={clearCity}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
              <Button 
                onClick={saveCity}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save City</span>
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {selectedBuilding 
                ? `Selected: ${selectedBuilding.name} (${selectedBuilding.cost} coins)` 
                : 'Select a building from the palette!'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
