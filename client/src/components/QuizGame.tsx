import { useState, useEffect } from 'react';
import { GameState, QuizQuestion } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { generateQuizQuestion, checkBadgeEligibility, adjustDifficulty } from '@/lib/gameLogic';
import { audioManager } from '@/lib/audioUtils';
import { X } from 'lucide-react';

interface QuizGameProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

export default function QuizGame({ gameState, updateGameState, onBack }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({ show: false, correct: false, message: '' });
  const [gameCompleted, setGameCompleted] = useState(false);

  const subjects = ['Mathematics', 'Language Arts', 'General Knowledge'];
  const difficulty = adjustDifficulty(
    gameState.user.progress.reduce((sum, p) => sum + p.correctAnswers, 0),
    gameState.user.progress.reduce((sum, p) => sum + p.totalQuestions, 0)
  );

  useEffect(() => {
    generateNewQuestion();
  }, []);

  const generateNewQuestion = () => {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const question = generateQuizQuestion(subject, difficulty);
    setCurrentQuestion(question);
    setAnswered(false);
    setSelectedAnswer(null);
    setFeedback({ show: false, correct: false, message: '' });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered || !currentQuestion) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      audioManager.play('correct');
      setScore(score + 1);
      setFeedback({
        show: true,
        correct: true,
        message: `Correct! You earned ${currentQuestion.coinReward} coins and ${currentQuestion.xpReward} XP!`
      });

      // Update user progress
      const updatedProgress = gameState.user.progress.map(p => {
        if (p.subject === currentQuestion.subject) {
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
          xp: gameState.user.xp + currentQuestion.xpReward,
          coins: gameState.user.coins + currentQuestion.coinReward,
          stars: gameState.user.stars + 1,
          progress: updatedProgress
        }
      });
    } else {
      audioManager.play('incorrect');
      setFeedback({
        show: true,
        correct: false,
        message: `Oops! The correct answer was "${currentQuestion.answers[currentQuestion.correctAnswer]}". Try again!`
      });

      // Update total questions count
      const updatedProgress = gameState.user.progress.map(p => {
        if (p.subject === currentQuestion.subject) {
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
      if (questionNumber >= 10) {
        setGameCompleted(true);
        updateGameState({
          user: {
            ...gameState.user,
            totalGamesPlayed: gameState.user.totalGamesPlayed + 1
          }
        });
      } else {
        setQuestionNumber(questionNumber + 1);
        generateNewQuestion();
      }
    }, 3000);
  };

  const resetGame = () => {
    setQuestionNumber(1);
    setScore(0);
    setGameCompleted(false);
    generateNewQuestion();
  };

  if (!currentQuestion && !gameCompleted) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-screen overflow-y-auto">
        <CardContent className="p-8">
          {/* Quiz Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">🧠 Quiz Time!</h2>
            <Button variant="ghost" size="icon" onClick={onBack}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {!gameCompleted ? (
            <>
              {/* Quiz Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Question {questionNumber} of 10</span>
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Score: {score}/10</span>
                </div>
                <Progress value={(questionNumber - 1) * 10} className="h-3" />
              </div>

              {/* Quiz Question */}
              <Card className="mb-6 turquoise-gradient">
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{currentQuestion?.question}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion?.answers.map((answer, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={answered}
                        className={`bg-white text-gray-800 p-4 font-semibold text-lg hover:bg-gray-100 transition-colors ${
                          answered && index === currentQuestion.correctAnswer 
                            ? 'bg-green-500 text-white' 
                            : answered && index === selectedAnswer && index !== currentQuestion.correctAnswer
                            ? 'bg-red-500 text-white'
                            : ''
                        }`}
                      >
                        {String.fromCharCode(65 + index)}) {answer}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Section */}
              {feedback.show && (
                <Card className="text-center mb-6">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-2">{feedback.correct ? '🎉' : '😔'}</div>
                    <h3 className={`text-2xl font-fredoka mb-2 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback.correct ? 'Correct!' : 'Not quite!'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">{feedback.message}</p>
                  </CardContent>
                </Card>
              )}

              {/* Mascot Section */}
              <div className="text-center">
                <div className="text-6xl animate-bounce-gentle mb-2">🦉</div>
                <p className="text-gray-600 dark:text-gray-300 font-semibold">"Choose the right answer!"</p>
              </div>
            </>
          ) : (
            /* Game Completed */
            <div className="text-center">
              <div className="text-8xl mb-4">🏆</div>
              <h3 className="text-3xl font-fredoka text-gray-800 dark:text-white mb-4">Quiz Complete!</h3>
              <div className="text-6xl mb-2">{score >= 7 ? '🌟' : score >= 5 ? '👍' : '💪'}</div>
              <p className="text-xl mb-4">You scored {score} out of 10!</p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {score >= 7 ? 'Excellent work!' : score >= 5 ? 'Good job!' : 'Keep practicing!'}
              </p>
              <div className="flex space-x-4 justify-center">
                <Button onClick={resetGame} className="coral-gradient text-white font-bold">
                  Play Again
                </Button>
                <Button onClick={onBack} variant="outline">
                  Back to Menu
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
