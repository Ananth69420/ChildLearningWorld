import { GameState } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { audioManager } from '@/lib/audioUtils';
import { X, Printer, Trophy, Star, Target, BookOpen } from 'lucide-react';

interface ProgressProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

export default function Progress({ gameState, updateGameState, onBack }: ProgressProps) {
  const handlePrintProgress = () => {
    audioManager.play('click');
    
    // Create a printable version of the progress report
    const printContent = `
      <html>
        <head>
          <title>Progress Report - ${gameState.user.name}</title>
          <style>
            body { font-family: 'Nunito', sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-item { text-align: center; }
            .badges { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0; }
            .badge { border: 2px solid #ddd; padding: 10px; text-align: center; border-radius: 10px; }
            .subjects { margin: 20px 0; }
            .subject { margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .progress-bar { width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; }
            .progress-fill { height: 100%; background: linear-gradient(90deg, #4ECDC4, #45B7D1); }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🏅 Progress Report</h1>
            <h2>${gameState.user.name} - Level ${gameState.user.level} Explorer</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <h3>📊 ${gameState.user.xp}</h3>
              <p>Total XP</p>
            </div>
            <div class="stat-item">
              <h3>⭐ ${gameState.user.stars}</h3>
              <p>Stars Earned</p>
            </div>
            <div class="stat-item">
              <h3>🏆 ${gameState.user.badges.length}</h3>
              <p>Badges</p>
            </div>
            <div class="stat-item">
              <h3>🎯 ${gameState.user.totalGamesPlayed}</h3>
              <p>Games Played</p>
            </div>
          </div>

          <h3>🏅 Badges Earned</h3>
          <div class="badges">
            ${gameState.user.badges.map(badge => `
              <div class="badge">
                <div style="font-size: 2em;">${badge.emoji}</div>
                <h4>${badge.name}</h4>
                <p>${badge.description}</p>
              </div>
            `).join('')}
          </div>

          <h3>📈 Subject Progress</h3>
          <div class="subjects">
            ${gameState.user.progress.map(subject => `
              <div class="subject">
                <h4>${subject.subject} - Level ${subject.level}</h4>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${subject.progress}%"></div>
                </div>
                <p>Accuracy: ${subject.totalQuestions > 0 ? Math.round((subject.correctAnswers / subject.totalQuestions) * 100) : 0}% (${subject.correctAnswers}/${subject.totalQuestions})</p>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const totalCorrectAnswers = gameState.user.progress.reduce((sum, p) => sum + p.correctAnswers, 0);
  const totalQuestions = gameState.user.progress.reduce((sum, p) => sum + p.totalQuestions, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrectAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Progress Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">🏅 My Progress</h2>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="coral-gradient">
              <CardContent className="p-6 text-center text-white">
                <BookOpen className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{gameState.user.xp}</h3>
                <p className="text-sm">Total XP</p>
              </CardContent>
            </Card>
            
            <Card className="turquoise-gradient">
              <CardContent className="p-6 text-center text-white">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{gameState.user.stars}</h3>
                <p className="text-sm">Stars Earned</p>
              </CardContent>
            </Card>
            
            <Card className="plum-gradient">
              <CardContent className="p-6 text-center text-white">
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{gameState.user.badges.length}</h3>
                <p className="text-sm">Badges</p>
              </CardContent>
            </Card>
            
            <Card className="softyellow-gradient">
              <CardContent className="p-6 text-center text-white">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">{gameState.user.totalGamesPlayed}</h3>
                <p className="text-sm">Games Played</p>
              </CardContent>
            </Card>
          </div>

          {/* Overall Accuracy */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-fredoka text-gray-800 dark:text-white mb-4">📊 Overall Performance</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-300">Overall Accuracy</span>
                <span className="font-bold text-gray-800 dark:text-white">{overallAccuracy}%</span>
              </div>
              <ProgressBar value={overallAccuracy} className="h-4 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {totalCorrectAnswers} correct out of {totalQuestions} questions
              </p>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-4">🏅 Badges Earned</h3>
            {gameState.user.badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {gameState.user.badges.map((badge, index) => (
                  <Card key={badge.id} className="bg-yellow-50 dark:bg-yellow-900 border-2 border-yellow-200 dark:border-yellow-700">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2 star-earned">{badge.emoji}</div>
                      <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{badge.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{badge.description}</p>
                      {badge.earnedDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No badges yet!</h4>
                  <p className="text-gray-600 dark:text-gray-300">Keep playing games to earn your first badge!</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Subject Progress */}
          <div className="mb-8">
            <h3 className="text-2xl font-fredoka text-gray-800 dark:text-white mb-4">📈 Subject Progress</h3>
            <div className="space-y-4">
              {gameState.user.progress.map((subject, index) => {
                const accuracy = subject.totalQuestions > 0 
                  ? Math.round((subject.correctAnswers / subject.totalQuestions) * 100) 
                  : 0;
                
                const getSubjectIcon = (subjectName: string) => {
                  switch (subjectName) {
                    case 'Mathematics': return '🔢';
                    case 'Language Arts': return '📝';
                    case 'Problem Solving': return '🧩';
                    default: return '📚';
                  }
                };

                const getGradientClass = (index: number) => {
                  const gradients = ['coral-gradient', 'turquoise-gradient', 'plum-gradient'];
                  return gradients[index % gradients.length];
                };

                return (
                  <Card key={subject.subject} className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-white flex items-center space-x-2">
                          <span>{getSubjectIcon(subject.subject)}</span>
                          <span>{subject.subject}</span>
                        </h4>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          Level {subject.level} - {accuracy}% accuracy
                        </span>
                      </div>
                      <ProgressBar value={subject.progress} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{subject.correctAnswers}/{subject.totalQuestions} correct</span>
                        <span>{subject.stars} ⭐ stars</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Print Button */}
          <div className="text-center">
            <Button 
              onClick={handlePrintProgress}
              className="skyblue-gradient text-white px-8 py-3 font-bold text-lg hover:shadow-lg transition-all"
            >
              <Printer className="h-5 w-5 mr-2" />
              Print Progress Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
