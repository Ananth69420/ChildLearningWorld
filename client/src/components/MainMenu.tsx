import { GameState } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { audioManager } from '@/lib/audioUtils';

interface MainMenuProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onNavigate: (game: string) => void;
}

export default function MainMenu({ gameState, updateGameState, onNavigate }: MainMenuProps) {
  const handleGameClick = (game: string) => {
    audioManager.play('click');
    onNavigate(game);
  };

  const xpProgress = ((gameState.user.xp % 1500) / 1500) * 100;
  const nextLevelXP = Math.ceil(gameState.user.xp / 1500) * 1500;

  const showDailyBonus = gameState.gameHistory?.lastLogin === new Date().toDateString() && !gameState.gameHistory?.dailyBonusClaimed;

  const claimDailyBonus = () => {
    audioManager.play('coin');
    updateGameState({
      user: {
        ...gameState.user,
        coins: gameState.user.coins + 5
      },
      gameHistory: {
        ...gameState.gameHistory,
        dailyBonusClaimed: true
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with Avatar and Stats */}
      <Card className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-4xl animate-bounce-gentle">
                  {gameState.user.avatar.hair}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-lg">
                  {gameState.user.avatar.pet}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-fredoka text-gray-800 dark:text-white">{gameState.user.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">Level {gameState.user.level} Explorer</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex space-x-6">
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-coins text-2xl text-yellow-500"></i>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">{gameState.user.coins}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Coins</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-star text-2xl text-yellow-500"></i>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">{gameState.user.stars}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Stars</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-trophy text-2xl text-orange-500"></i>
                  <span className="text-2xl font-bold text-gray-800 dark:text-white">{gameState.user.badges.length}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Badges</p>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Progress to Level {gameState.user.level + 1}</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{gameState.user.xp} / {nextLevelXP} XP</span>
            </div>
            <Progress value={xpProgress} className="h-4" />
          </div>
        </CardContent>
      </Card>

      {/* Daily Login Bonus */}
      {showDailyBonus && (
        <Card className="mb-8 softyellow-gradient shadow-xl">
          <CardContent className="p-6 text-center">
            <h3 className="text-2xl font-fredoka text-white mb-2">🎉 Daily Bonus!</h3>
            <p className="text-white mb-4">You earned 5 coins for logging in today!</p>
            <Button 
              onClick={claimDailyBonus}
              className="bg-white text-orange-500 hover:bg-gray-100 coin-animation"
            >
              <i className="fas fa-coins text-3xl"></i>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Game Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Quiz Game Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('quiz')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 coral-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🧠
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">Quiz Game</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Test your knowledge with fun multiple choice questions!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < 3 ? 'text-yellow-500' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <Button className="coral-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              Play Now!
            </Button>
          </CardContent>
        </Card>

        {/* Keypad Game Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('keypad')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 turquoise-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🔢
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">Keypad Game</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Solve for X in fun math equations!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < 2 ? 'text-yellow-500' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <Button className="turquoise-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              Solve Now!
            </Button>
          </CardContent>
        </Card>

        {/* Puzzle Games Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('puzzle')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 plum-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🧩
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">Puzzle Games</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Match, drag, drop and fill in the blanks!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < 4 ? 'text-yellow-500' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <Button className="plum-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              Puzzle Time!
            </Button>
          </CardContent>
        </Card>

        {/* My World Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('world')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 mint-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🏗️
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">My World</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Build your dream city with cool buildings!</p>
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fas fa-star ${i < 1 ? 'text-yellow-500' : 'text-gray-300'}`}></i>
              ))}
            </div>
            <Button className="mint-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              Build City!
            </Button>
          </CardContent>
        </Card>

        {/* Shop Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('shop')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 softyellow-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🛒
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">Shop</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Spend coins on avatar items and buildings!</p>
            <div className="flex justify-center space-x-2 mb-4">
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">New Items!</span>
            </div>
            <Button className="softyellow-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              Go Shopping!
            </Button>
          </CardContent>
        </Card>

        {/* Progress Card */}
        <Card className="game-card cursor-pointer" onClick={() => handleGameClick('progress')}>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 skyblue-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-4xl animate-pulse-slow">
              🏅
            </div>
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-2">Progress</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">View your achievements and badges!</p>
            <div className="flex justify-center space-x-2 mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">{gameState.user.badges.length} Badges</span>
            </div>
            <Button className="skyblue-gradient text-white font-bold text-lg hover:shadow-lg transition-all">
              View Progress!
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Adventure Mode Map */}
      <div className="mt-12">
        <h2 className="text-3xl font-fredoka text-white dark:text-gray-200 text-center mb-8">🗺️ Adventure Map</h2>
        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Jungle of Numbers */}
              <div className="relative">
                <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🌴</div>
                      <h3 className="font-fredoka text-xl">Jungle of Numbers</h3>
                      <p className="text-sm">Counting & Basic Math</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-check text-sm"></i>
                  </div>
                </div>
              </div>

              {/* Grammar Galaxy */}
              <div className="relative">
                <div className="h-40 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🚀</div>
                      <h3 className="font-fredoka text-xl">Grammar Galaxy</h3>
                      <p className="text-sm">Parts of Speech</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-lock text-sm"></i>
                  </div>
                </div>
              </div>

              {/* Castle of Equations */}
              <div className="relative">
                <div className="h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="text-4xl mb-2">🏰</div>
                      <h3 className="font-fredoka text-xl">Castle of Equations</h3>
                      <p className="text-sm">Advanced Algebra</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <i className="fas fa-lock text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
