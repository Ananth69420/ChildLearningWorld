import { useState } from "react";
import { GameState } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { audioManager } from "@/lib/audioUtils";
import { X, Shuffle } from "lucide-react";

interface PuzzleGamesProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onBack: () => void;
}

type PuzzleType = "matching" | "spelling" | "fillBlanks";

interface MatchingPair {
  id: string;
  word: string;
  match: string;
  matched: boolean;
}

interface SpellingWord {
  word: string;
  scrambled: string;
  hint: string;
}

interface FillBlankSentence {
  sentence: string;
  blanks: string[];
  options: string[];
}

export default function PuzzleGames({
  gameState,
  updateGameState,
  onBack,
}: PuzzleGamesProps) {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleType>("matching");
  const [score, setScore] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState(0);
  const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Matching Game State
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([
    { id: "1", word: "Cat", match: "🐱", matched: false },
    { id: "2", word: "Dogesh", match: "🐕", matched: false },
    { id: "3", word: "Fish", match: "🐠", matched: false },
    { id: "4", word: "Bird", match: "🐦", matched: false },
    { id: "5", word: "Tree", match: "🌳", matched: false },
  ]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Spelling Game State

  // Fill Blanks Game State

  const handleMatchingClick = (item: MatchingPair, type: "word" | "match") => {
    const itemToSelect = type === "word" ? item.word : item.match;

    if (selectedWords.includes(itemToSelect)) {
      setSelectedWords(selectedWords.filter((w) => w !== itemToSelect));
      return;
    }

    const newSelected = [...selectedWords, itemToSelect];
    setSelectedWords(newSelected);

    if (newSelected.length === 2) {
      // Check if it's a match
      const pair = matchingPairs.find(
        (p) => newSelected.includes(p.word) && newSelected.includes(p.match),
      );

      if (pair) {
        audioManager.play("correct");
        setMatchingPairs((prev) =>
          prev.map((p) => (p.id === pair.id ? { ...p, matched: true } : p)),
        );
        setScore(score + 10);

        // Award XP and coins
        updateGameState({
          user: {
            ...gameState.user,
            xp: gameState.user.xp + 25,
            coins: gameState.user.coins + 5,
          },
        });
      } else {
        audioManager.play("incorrect");
      }

      setTimeout(() => {
        setSelectedWords([]);
      }, 1000);
    }
  };

  const handleSpellingSubmit = () => {
    if (spellingAnswer.toUpperCase() === currentSpellingWord.word) {
      audioManager.play("correct");
      setScore(score + 20);

      updateGameState({
        user: {
          ...gameState.user,
          xp: gameState.user.xp + 50,
          coins: gameState.user.coins + 10,
        },
      });

      const nextIndex = spellingIndex + 1;
      if (nextIndex < shuffledSpellingWords.length) {
        setSpellingIndex(nextIndex);
        setCurrentSpellingWord(shuffledSpellingWords[nextIndex]);
      } else {
        const reshuffled = shuffleArray(spellingWordBank);
        setShuffledSpellingWords(reshuffled);
        setSpellingIndex(0);
        setCurrentSpellingWord(reshuffled[0]);
      }

      setSpellingAnswer("");
    } else {
      audioManager.play("incorrect");
    }
  };

  // Generate new word
  // Spelling Word Bank (expanded)
  const spellingWordBank: SpellingWord[] = [
    {
      word: "BUTTERFLY",
      scrambled: "TERFLYBUT",
      hint: "Colorful flying insect",
    },
    {
      word: "ELEPHANT",
      scrambled: "PHANTELE",
      hint: "Large gray animal with trunk",
    },
    { word: "MOUNTAIN", scrambled: "TAINMOUN", hint: "Very tall hill" },
    {
      word: "SANDWICH",
      scrambled: "WICHSAND",
      hint: "Food between two bread slices",
    },
    {
      word: "RAINBOW",
      scrambled: "WAINBOR",
      hint: "Colors in the sky after rain",
    },
    { word: "NOTEBOOK", scrambled: "BOOKNOTE", hint: "Used to write notes" },
    {
      word: "GIRAFFE",
      scrambled: "RAFFEGI",
      hint: "Tall animal with a long neck",
    },
    { word: "UMBRELLA", scrambled: "RELLAUMB", hint: "Used when it rains" },
    {
      word: "PINEAPPLE",
      scrambled: "APPLEPINE",
      hint: "A tropical fruit with a crown",
    },
    {
      word: "KANGAROO",
      scrambled: "ROOKANGA",
      hint: "Jumps and carries baby in pouch",
    },
  ];

  const [shuffledSpellingWords, setShuffledSpellingWords] = useState<
    SpellingWord[]
  >(shuffleArray(spellingWordBank));
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [currentSpellingWord, setCurrentSpellingWord] = useState<SpellingWord>(
    shuffledSpellingWords[0],
  );
  const [spellingAnswer, setSpellingAnswer] = useState("");

  const handleFillBlankSubmit = () => {
    if (
      fillBlankAnswers[0].toLowerCase() ===
      currentFillBlank.blanks[0].toLowerCase()
    ) {
      audioManager.play("correct");
      setScore(score + 15);

      updateGameState({
        user: {
          ...gameState.user,
          xp: gameState.user.xp + 35,
          coins: gameState.user.coins + 7,
        },
      });

      const nextIndex = fillBlankIndex + 1;
      if (nextIndex < shuffledFillBlanks.length) {
        setFillBlankIndex(nextIndex);
        setCurrentFillBlank(shuffledFillBlanks[nextIndex]);
      } else {
        const reshuffled = shuffleArray(fillBlankBank);
        setShuffledFillBlanks(reshuffled);
        setFillBlankIndex(0);
        setCurrentFillBlank(reshuffled[0]);
      }

      setFillBlankAnswers([""]);
    } else {
      audioManager.play("incorrect");
    }
  };

  // Generate new sentence
  const fillBlankBank: FillBlankSentence[] = [
    {
      sentence: "The ___ swims in the ocean.",
      blanks: ["fish"],
      options: ["fish", "bird", "cat", "dog"],
    },
    {
      sentence: "I like to ___ books.",
      blanks: ["read"],
      options: ["read", "eat", "sleep", "run"],
    },
    {
      sentence: "The ___ is very hot.",
      blanks: ["fire"],
      options: ["fire", "ice", "water", "air"],
    },
    {
      sentence: "The ___ is shining brightly today.",
      blanks: ["sun"],
      options: ["sun", "moon", "star", "cloud"],
    },
    {
      sentence: "Birds build their ___ in trees.",
      blanks: ["nests"],
      options: ["nests", "homes", "beds", "eggs"],
    },
    {
      sentence: "We wear ___ on our feet.",
      blanks: ["shoes"],
      options: ["shoes", "gloves", "hats", "shirts"],
    },
    {
      sentence: "The ___ barks at strangers.",
      blanks: ["dog"],
      options: ["dog", "cat", "bird", "cow"],
    },
    {
      sentence: "She drank a glass of ___.",
      blanks: ["milk"],
      options: ["milk", "water", "juice", "tea"],
    },
    {
      sentence: "Stars twinkle in the ___.",
      blanks: ["sky"],
      options: ["sky", "ground", "sea", "sun"],
    },
    {
      sentence: "The ___ rings when the class ends.",
      blanks: ["bell"],
      options: ["bell", "clock", "whistle", "alarm"],
    },
  ];

  const [shuffledFillBlanks, setShuffledFillBlanks] = useState<
    FillBlankSentence[]
  >(shuffleArray(fillBlankBank));
  const [fillBlankIndex, setFillBlankIndex] = useState(0);
  const [currentFillBlank, setCurrentFillBlank] = useState<FillBlankSentence>(
    shuffledFillBlanks[0],
  );
  const [fillBlankAnswers, setFillBlankAnswers] = useState<string[]>([""]);

  const switchPuzzle = (type: PuzzleType) => {
    setCurrentPuzzle(type);
    audioManager.play("click");
  };
  // Shuffle unmatched matching words and icons before rendering
  const unmatchedPairs = matchingPairs.filter((p) => !p.matched);
  const shuffledWords = shuffleArray(unmatchedPairs.map((p) => p.word));
  const shuffledMatches = shuffleArray(unmatchedPairs.map((p) => p.match));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full h-full max-h-screen overflow-y-auto">
        <CardContent className="p-8 h-full flex flex-col">
          {/* Puzzle Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-fredoka text-gray-800 dark:text-white">
              🧩 Puzzle Games
            </h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Score: {score}
              </div>
              <Button variant="ghost" size="icon" onClick={onBack}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Puzzle Type Selector */}
          <div className="flex space-x-2 mb-6">
            <Button
              onClick={() => switchPuzzle("matching")}
              className={
                currentPuzzle === "matching"
                  ? "coral-gradient text-white"
                  : "bg-gray-200 text-gray-700"
              }
            >
              🔗 Matching
            </Button>
            <Button
              onClick={() => switchPuzzle("spelling")}
              className={
                currentPuzzle === "spelling"
                  ? "turquoise-gradient text-white"
                  : "bg-gray-200 text-gray-700"
              }
            >
              📝 Spelling
            </Button>
            <Button
              onClick={() => switchPuzzle("fillBlanks")}
              className={
                currentPuzzle === "fillBlanks"
                  ? "plum-gradient text-white"
                  : "bg-gray-200 text-gray-700"
              }
            >
              📄 Fill Blanks
            </Button>
          </div>

          {/* Matching Game */}
          {currentPuzzle === "matching" && (
            <div className="flex-1">
              <h3 className="text-xl font-fredoka mb-4">
                Match the words with their pictures!
              </h3>
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Word Buttons */}
                <div className="space-y-2">
                  {shuffledWords.map((word, index) => (
                    <Button
                      key={`word-${index}`}
                      onClick={() =>
                        handleMatchingClick(
                          { word, match: "", id: "", matched: false },
                          "word",
                        )
                      }
                      className={`w-full h-16 text-lg font-semibold ${
                        selectedWords.includes(word)
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-800 hover:bg-gray-100"
                      }`}
                    >
                      {word}
                    </Button>
                  ))}
                </div>

                {/* Match Buttons */}
                <div className="space-y-2">
                  {shuffledMatches.map((match, index) => (
                    <Button
                      key={`match-${index}`}
                      onClick={() =>
                        handleMatchingClick(
                          { word: "", match, id: "", matched: false },
                          "match",
                        )
                      }
                      className={`w-full h-16 text-3xl ${
                        selectedWords.includes(match)
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {match}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Spelling Game */}
          {currentPuzzle === "spelling" && (
            <div className="flex-1">
              <h3 className="text-xl font-fredoka mb-4">
                Unscramble the word!
              </h3>
              <Card className="mb-6 turquoise-gradient">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold text-white mb-4">
                    {currentSpellingWord.scrambled}
                  </div>
                  <p className="text-white text-lg mb-4">
                    Hint: {currentSpellingWord.hint}
                  </p>
                  <Input
                    value={spellingAnswer}
                    onChange={(e) => setSpellingAnswer(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSpellingSubmit()
                    }
                    className="bg-white text-gray-800 text-center text-2xl font-bold mb-4"
                    placeholder="Type your answer"
                  />
                  <Button
                    onClick={handleSpellingSubmit}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fill in the Blanks Game */}
          {currentPuzzle === "fillBlanks" && (
            <div className="flex-1">
              <h3 className="text-xl font-fredoka mb-4">Fill in the blank!</h3>
              <Card className="mb-6 plum-gradient">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-white mb-6">
                    {currentFillBlank.sentence}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {currentFillBlank.options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => setFillBlankAnswers([option])}
                        className={`bg-white text-gray-800 hover:bg-gray-100 ${
                          fillBlankAnswers[0] === option
                            ? "bg-blue-500 text-white"
                            : ""
                        }`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <Button
                    onClick={handleFillBlankSubmit}
                    disabled={!fillBlankAnswers[0]}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mascot */}
          <div className="text-center mt-auto">
            <div className="text-6xl animate-bounce-gentle mb-2">🦋</div>
            <p className="text-gray-600 dark:text-gray-300 font-semibold">
              "Keep solving puzzles!"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
