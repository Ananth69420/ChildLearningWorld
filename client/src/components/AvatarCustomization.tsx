import { useState } from 'react';
import { GameState } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { audioManager } from '@/lib/audioUtils';
import { X, Save, RotateCcw } from 'lucide-react';

interface AvatarCustomizationProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

const avatarOptions = {
  hair: [
    { id: 'girl1', emoji: '👧', name: 'Girl 1', cost: 0 },
    { id: 'girl2', emoji: '👧🏻', name: 'Girl 2', cost: 50 },
    { id: 'girl3', emoji: '👧🏽', name: 'Girl 3', cost: 50 },
    { id: 'girl4', emoji: '👧🏿', name: 'Girl 4', cost: 50 },
    { id: 'boy1', emoji: '👦', name: 'Boy 1', cost: 50 },
    { id: 'boy2', emoji: '👦🏻', name: 'Boy 2', cost: 50 },
    { id: 'boy3', emoji: '👦🏽', name: 'Boy 3', cost: 50 },
    { id: 'boy4', emoji: '👦🏿', name: 'Boy 4', cost: 50 }
  ],
  accessories: [
    { id: 'none', emoji: '', name: 'None', cost: 0 },
    { id: 'crown', emoji: '👑', name: 'Crown', cost: 150 },
    { id: 'cape', emoji: '🌈', name: 'Cape', cost: 120 },
    { id: 'backpack', emoji: '🎒', name: 'Backpack', cost: 80 },
    { id: 'glasses', emoji: '🕶️', name: 'Glasses', cost: 60 },
    { id: 'hat', emoji: '🎩', name: 'Top Hat', cost: 100 },
    { id: 'bow', emoji: '🎀', name: 'Bow', cost: 40 },
    { id: 'scarf', emoji: '🧣', name: 'Scarf', cost: 70 }
  ],
  pets: [
    { id: 'bunny', emoji: '🐰', name: 'Bunny', cost: 0 },
    { id: 'cat', emoji: '🐱', name: 'Cat', cost: 100 },
    { id: 'dog', emoji: '🐶', name: 'Dog', cost: 100 },
    { id: 'unicorn', emoji: '🦄', name: 'Unicorn', cost: 200 },
    { id: 'dragon', emoji: '🐲', name: 'Dragon', cost: 250 },
    { id: 'owl', emoji: '🦉', name: 'Owl', cost: 120 },
    { id: 'fox', emoji: '🦊', name: 'Fox', cost: 130 },
    { id: 'panda', emoji: '🐼', name: 'Panda', cost: 180 }
  ]
};

export default function AvatarCustomization({ gameState, updateGameState, onBack }: AvatarCustomizationProps) {
  const [previewAvatar, setPreviewAvatar] = useState(gameState.user.avatar);
  const [activeTab, setActiveTab] = useState('hair');

  const handleOptionSelect = (category: keyof typeof avatarOptions, option: any) => {
    // Check if user owns this item (free items or purchased items)
    if (option.cost > 0 && !gameState.user.inventory.includes(option.id)) {
      audioManager.play('incorrect');
      return;
    }

    audioManager.play('click');
    setPreviewAvatar(prev => ({
      ...prev,
      [category]: option.emoji
    }));
  };

  const saveAvatar = () => {
    audioManager.play('correct');
    updateGameState({
      user: {
        ...gameState.user,
        avatar: previewAvatar
      }
    });
    
    // Show success feedback
    showSaveAnimation();
  };

  const resetAvatar = () => {
    audioManager.play('click');
    setPreviewAvatar(gameState.user.avatar);
  };

  const showSaveAnimation = () => {
    // Simple save feedback animation
    const saveButton = document.querySelector('[data-save-button]');
    if (saveButton) {
      saveButton.classList.add('animate-pulse');
      setTimeout(() => {
        saveButton.classList.remove('animate-pulse');
      }, 1000);
    }
  };

  const isItemOwned = (item: any) => {
    return item.cost === 0 || gameState.user.inventory.includes(item.id);
  };

  const isItemSelected = (category: keyof typeof avatarOptions, item: any) => {
    return previewAvatar[category] === item.emoji;
  };

  const hasChanges = () => {
    return JSON.stringify(previewAvatar) !== JSON.stringify(gameState.user.avatar);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Avatar Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">👤 Customize Avatar</h2>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Preview */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
                <CardContent className="p-8 text-center">
                  <h3 className="text-xl font-fredoka text-gray-800 dark:text-white mb-6">Preview</h3>
                  
                  {/* Avatar Display */}
                  <div className="relative inline-block">
                    {/* Main Avatar */}
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-6xl animate-bounce-gentle mb-4">
                      {previewAvatar.hair}
                    </div>
                    
                    {/* Accessories Overlay */}
                    {previewAvatar.accessories && (
                      <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-2xl">
                        {previewAvatar.accessories}
                      </div>
                    )}
                    
                    {/* Pet */}
                    {previewAvatar.pet && (
                      <div className="absolute -bottom-2 -right-6 w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-2xl">
                        {previewAvatar.pet}
                      </div>
                    )}
                  </div>

                  {/* Avatar Info */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{gameState.user.name}</h4>
                    <p className="text-gray-600 dark:text-gray-300">Level {gameState.user.level} Explorer</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-6">
                    <Button 
                      onClick={saveAvatar}
                      disabled={!hasChanges()}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      data-save-button
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button 
                      onClick={resetAvatar}
                      disabled={!hasChanges()}
                      variant="outline"
                      className="flex-1"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customization Options */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hair" className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>Avatar</span>
                  </TabsTrigger>
                  <TabsTrigger value="accessories" className="flex items-center space-x-2">
                    <span>👑</span>
                    <span>Accessories</span>
                  </TabsTrigger>
                  <TabsTrigger value="pets" className="flex items-center space-x-2">
                    <span>🐾</span>
                    <span>Pets</span>
                  </TabsTrigger>
                </TabsList>

                {/* Hair/Avatar Tab */}
                <TabsContent value="hair" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {avatarOptions.hair.map(option => {
                      const owned = isItemOwned(option);
                      const selected = isItemSelected('hair', option);
                      
                      return (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all ${
                            selected ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                          } ${!owned ? 'opacity-60' : 'hover:shadow-md'}`}
                          onClick={() => handleOptionSelect('hair', option)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-4xl mb-2">{option.emoji}</div>
                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{option.name}</h4>
                            {option.cost > 0 && (
                              <p className={`text-xs ${owned ? 'text-green-600' : 'text-red-600'}`}>
                                {owned ? '✓ Owned' : `${option.cost} coins`}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Accessories Tab */}
                <TabsContent value="accessories" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {avatarOptions.accessories.map(option => {
                      const owned = isItemOwned(option);
                      const selected = isItemSelected('accessories', option);
                      
                      return (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all ${
                            selected ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                          } ${!owned ? 'opacity-60' : 'hover:shadow-md'}`}
                          onClick={() => handleOptionSelect('accessories', option)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-4xl mb-2 h-12 flex items-center justify-center">
                              {option.emoji || '✨'}
                            </div>
                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{option.name}</h4>
                            {option.cost > 0 && (
                              <p className={`text-xs ${owned ? 'text-green-600' : 'text-red-600'}`}>
                                {owned ? '✓ Owned' : `${option.cost} coins`}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Pets Tab */}
                <TabsContent value="pets" className="mt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {avatarOptions.pets.map(option => {
                      const owned = isItemOwned(option);
                      const selected = isItemSelected('pet', option);
                      
                      return (
                        <Card 
                          key={option.id}
                          className={`cursor-pointer transition-all ${
                            selected ? 'ring-4 ring-blue-500 bg-blue-50 dark:bg-blue-900' : ''
                          } ${!owned ? 'opacity-60' : 'hover:shadow-md'}`}
                          onClick={() => handleOptionSelect('pet', option)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-4xl mb-2">{option.emoji}</div>
                            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{option.name}</h4>
                            {option.cost > 0 && (
                              <p className={`text-xs ${owned ? 'text-green-600' : 'text-red-600'}`}>
                                {owned ? '✓ Owned' : `${option.cost} coins`}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Instructions */}
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 How to customize:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Select different avatar faces, accessories, and pets</li>
                <li>• Buy new items in the Shop with coins you've earned</li>
                <li>• Preview your changes before saving</li>
                <li>• Your avatar appears throughout the game!</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
