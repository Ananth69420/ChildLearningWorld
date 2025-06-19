import { useState } from 'react';
import { GameState, AvatarPart } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { audioManager } from '@/lib/audioUtils';
import { X, ShoppingCart } from 'lucide-react';

interface ShopProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

const avatarItems: AvatarPart[] = [
  { type: 'accessories', id: 'crown', name: 'Golden Crown', emoji: '👑', cost: 150, unlocked: false },
  { type: 'pet', id: 'unicorn', name: 'Unicorn Pet', emoji: '🦄', cost: 200, unlocked: false },
  { type: 'accessories', id: 'cape', name: 'Rainbow Cape', emoji: '🌈', cost: 120, unlocked: false },
  { type: 'accessories', id: 'backpack', name: 'Adventure Pack', emoji: '🎒', cost: 80, unlocked: false },
  { type: 'hair', id: 'boy', name: 'Boy Avatar', emoji: '👦', cost: 50, unlocked: false },
  { type: 'hair', id: 'girl2', name: 'Girl Avatar 2', emoji: '👧🏻', cost: 50, unlocked: false },
  { type: 'hair', id: 'girl3', name: 'Girl Avatar 3', emoji: '👧🏽', cost: 50, unlocked: false },
  { type: 'hair', id: 'girl4', name: 'Girl Avatar 4', emoji: '👧🏿', cost: 50, unlocked: false },
  { type: 'pet', id: 'cat', name: 'Cat Pet', emoji: '🐱', cost: 100, unlocked: false },
  { type: 'pet', id: 'dog', name: 'Dog Pet', emoji: '🐶', cost: 100, unlocked: false },
  { type: 'pet', id: 'dragon', name: 'Dragon Pet', emoji: '🐲', cost: 250, unlocked: false },
  { type: 'accessories', id: 'glasses', name: 'Cool Glasses', emoji: '🕶️', cost: 60, unlocked: false }
];

const buildingItems = [
  { id: 'fountain', name: 'Magic Fountain', emoji: '⛲', cost: 150, description: 'Beautiful fountain for your city center' },
  { id: 'windmill', name: 'Windmill', emoji: '🏭', cost: 180, description: 'Generate energy for your city' },
  { id: 'bridge', name: 'Golden Bridge', emoji: '🌉', cost: 220, description: 'Connect different parts of your city' },
  { id: 'lighthouse', name: 'Lighthouse', emoji: '🗼', cost: 300, description: 'Guide ships to your harbor' },
  { id: 'ferriswheel', name: 'Ferris Wheel', emoji: '🎡', cost: 400, description: 'Fun attraction for your city' },
  { id: 'rocket', name: 'Space Rocket', emoji: '🚀', cost: 500, description: 'Launch pad for space adventures' }
];

export default function Shop({ gameState, updateGameState, onBack }: ShopProps) {
  const [activeTab, setActiveTab] = useState('avatar');
  const [purchaseAnimation, setPurchaseAnimation] = useState<string | null>(null);

  const buyAvatarItem = (item: AvatarPart) => {
    if (gameState.user.coins < item.cost) {
      audioManager.play('incorrect');
      return;
    }

    if (gameState.user.inventory.includes(item.id)) {
      return; // Already owned
    }

    audioManager.play('coin');
    setPurchaseAnimation(item.id);

    // Update inventory and coins
    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins - item.cost,
        inventory: [...gameState.user.inventory, item.id]
      }
    });

    // Auto-equip if it's a replacement for current avatar part
    if (item.type === 'hair') {
      updateGameState({
        user: {
          ...gameState.user,
          avatar: {
            ...gameState.user.avatar,
            hair: item.emoji
          }
        }
      });
    } else if (item.type === 'pet') {
      updateGameState({
        user: {
          ...gameState.user,
          avatar: {
            ...gameState.user.avatar,
            pet: item.emoji
          }
        }
      });
    } else if (item.type === 'accessories') {
      updateGameState({
        user: {
          ...gameState.user,
          avatar: {
            ...gameState.user.avatar,
            accessories: item.emoji
          }
        }
      });
    }

    setTimeout(() => {
      setPurchaseAnimation(null);
    }, 1000);
  };

  const buyBuildingItem = (item: any) => {
    if (gameState.user.coins < item.cost) {
      audioManager.play('incorrect');
      return;
    }

    audioManager.play('coin');
    setPurchaseAnimation(item.id);

    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins - item.cost,
        inventory: [...gameState.user.inventory, item.id]
      }
    });

    setTimeout(() => {
      setPurchaseAnimation(null);
    }, 1000);
  };

  const isItemOwned = (itemId: string) => {
    return gameState.user.inventory.includes(itemId);
  };

  const canAfford = (cost: number) => {
    return gameState.user.coins >= cost;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Shop Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">🛒 Magical Shop</h2>
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

          {/* Shop Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="avatar" className="flex items-center space-x-2">
                <span>👤</span>
                <span>Avatar Items</span>
              </TabsTrigger>
              <TabsTrigger value="buildings" className="flex items-center space-x-2">
                <span>🏢</span>
                <span>Buildings</span>
              </TabsTrigger>
            </TabsList>

            {/* Avatar Items Tab */}
            <TabsContent value="avatar" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {avatarItems.map(item => {
                  const owned = isItemOwned(item.id);
                  const affordable = canAfford(item.cost);
                  const isPurchasing = purchaseAnimation === item.id;
                  
                  return (
                    <Card 
                      key={item.id} 
                      className={`transition-all duration-300 ${
                        isPurchasing ? 'scale-110 ring-4 ring-yellow-400' : ''
                      } ${owned ? 'bg-green-50 dark:bg-green-900' : ''}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{item.emoji}</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                          {item.type === 'hair' ? 'Change your look!' : 
                           item.type === 'pet' ? 'Loyal companion!' : 
                           'Cool accessory!'}
                        </p>
                        {owned ? (
                          <Button disabled className="bg-green-500 text-white">
                            ✓ Owned
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => buyAvatarItem(item)}
                            disabled={!affordable}
                            className={`${affordable ? 'coral-gradient hover:shadow-lg' : 'bg-gray-400'} text-white text-sm`}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {affordable ? `Buy - ${item.cost}` : 'Too expensive'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Buildings Tab */}
            <TabsContent value="buildings" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {buildingItems.map(item => {
                  const owned = isItemOwned(item.id);
                  const affordable = canAfford(item.cost);
                  const isPurchasing = purchaseAnimation === item.id;
                  
                  return (
                    <Card 
                      key={item.id}
                      className={`transition-all duration-300 ${
                        isPurchasing ? 'scale-110 ring-4 ring-yellow-400' : ''
                      } ${owned ? 'bg-green-50 dark:bg-green-900' : ''}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{item.emoji}</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{item.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{item.description}</p>
                        {owned ? (
                          <Button disabled className="bg-green-500 text-white">
                            ✓ Owned
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => buyBuildingItem(item)}
                            disabled={!affordable}
                            className={`${affordable ? 'mint-gradient hover:shadow-lg' : 'bg-gray-400'} text-white text-sm`}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {affordable ? `Buy - ${item.cost}` : 'Too expensive'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
