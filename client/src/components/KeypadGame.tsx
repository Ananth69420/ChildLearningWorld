import { useState, useEffect } from 'react';
import { GameState, KeypadEquation } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { generateKeypadEquation, checkBadgeEligibility, adjustDifficulty } from '@/lib/gameLogic';
import { audioManager } from '@/lib/audioUtils';
import { X } from 'lucide-react';

interface KeypadGameProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

export default function KeypadGame({ gameState, updateGameState, onBack }: KeypadGameProps) {
  const [currentEquation, setCurrentEquation] = useState<KeypadEquation | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({ show: false, correct: false, message: '' });
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const difficulty = adjustDifficulty(
    gameState.user.progress.find(p => p.subject === 'Mathematics')?.correctAnswers || 0,
    gameState.user.progress.find(p => p.subject === 'Mathematics')?.totalQuestions || 0
  );

  useEffect(() => {
    generateNewEquation();
  }, []);

  const generateNewEquation = () => {
    const equation = generateKeypadEquation(difficulty);
    setCurrentEquation(equation);
    setUserAnswer('');
    setFeedback({ show: false, correct: false, message: '' });
  };

  const handleSubmitAnswer = () => {
    if (!currentEquation || userAnswer === '') return;

    const answerNum = parseFloat(userAnswer);
    const isCorrect = Math.abs(answerNum - currentEquation.answer) < 0.01;

    if (isCorrect) {
      audioManager.play('correct');
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({
        show: true,
        correct: true,
        message: `Excellent! You earned ${currentEquation.coinReward} coins and ${currentEquation.xpReward} XP!`
      });

      // Update user progress
      const updatedProgress = gameState.user.progress.map(p => {
        if (p.subject === 'Mathematics') {
          return {
            ...p,
            correctAnswers: p.correctAnswers + 1,
            totalQuestions: p.totalQuestions + 1,
            stars: p.stars + 1
          };
        }
        return p;
      });

      updateGameState({
        user: {
          ...gameState.user,
          xp: gameState.user.xp + currentEquation.xpReward,
          coins: gameState.user.coins + currentEquation.coinReward,
          stars: gameState.user.stars + 1,
          progress: updatedProgress
        }
      });
    } else {
      audioManager.play('incorrect');
      setFeedback({
        show: true,
        correct: false,
        message: `Not quite! The correct answer was ${currentEquation.answer}. Keep trying!`
      });

      // Update total questions count
      const updatedProgress = gameState.user.progress.map(p => {
        if (p.subject === 'Mathematics') {
          return {
            ...p,
            totalQuestions: p.totalQuestions + 1
          };
        }
        return p;
      });

      updateGameState({
        user: {
          ...gameState.user,
          progress: updatedProgress
        }
      });
    }

    setQuestionsAnswered(questionsAnswered + 1);

    // Check for new badges
    const newBadges = checkBadgeEligibility(gameState);
    if (newBadges.length > 0) {
      updateGameState({
        user: {
          ...gameState.user,
          badges: [...gameState.user.badges, ...newBadges]
        }
      });
    }

    setTimeout(() => {
      generateNewEquation();
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  if (!currentEquation) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Keypad Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">🔢 Solve for X!</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Score: {correctAnswers}/{questionsAnswered}
              </div>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Equation Display */}
          <Card className="mb-6 turquoise-gradient">
            <CardContent className="p-8 text-center">
              <h3 className="text-4xl font-bold text-white mb-6">{currentEquation.equation}</h3>
              <p className="text-white text-lg mb-4">What is x?</p>
              
              {/* Input Field */}
              <div className="bg-white rounded-xl p-4 mb-4">
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full text-3xl text-center font-bold text-gray-800 bg-transparent border-none outline-none"
                  placeholder="?"
                  disabled={feedback.show}
                />
              </div>
              
              <Button 
                onClick={handleSubmitAnswer}
                disabled={feedback.show || userAnswer === ''}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-bold text-xl transition-colors"
              >
                Submit Answer
              </Button>
            </CardContent>
          </Card>

          {/* Keypad Feedback */}
          {feedback.show && (
            <Card className="text-center mb-6">
              <CardContent className="p-6">
                <div className="text-6xl mb-2">{feedback.correct ? '⭐' : '🤔'}</div>
                <h3 className={`text-2xl font-fredoka mb-2 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                  {feedback.correct ? 'Excellent!' : 'Try Again!'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{feedback.message}</p>
              </CardContent>
            </Card>
          )}

          {/* Mascot */}
          <div className="text-center">
            <div className="text-6xl animate-pulse-slow mb-2">🤓</div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">"Think carefully about the equation!"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
