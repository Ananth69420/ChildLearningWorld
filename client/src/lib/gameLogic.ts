import { QuizQuestion, KeypadEquation, Badge } from "@shared/schema";

export const generateQuizQuestion = (
  subject: string,
  difficulty: "easy" | "medium" | "hard",
): QuizQuestion => {
  if (subject === "Mathematics") {
    return generateMathQuestion(difficulty);
  } else if (subject === "Language Arts") {
    return generateLanguageQuestion(difficulty);
  }
  return generateGeneralQuestion(difficulty);
};

const generateMathQuestion = (
  difficulty: "easy" | "medium" | "hard",
): QuizQuestion => {
  const questions = {
    easy: [
      { q: "What is 5 + 3?", answers: ["6", "7", "8", "9"], correct: 2 },
      { q: "What is 10 - 4?", answers: ["5", "6", "7", "8"], correct: 1 },
      { q: "What is 2 × 4?", answers: ["6", "7", "8", "9"], correct: 2 },
      { q: "What is 12 ÷ 3?", answers: ["3", "4", "5", "6"], correct: 1 },
      { q: "What is 7 + 6?", answers: ["12", "13", "14", "15"], correct: 1 },
    ],
    medium: [
      { q: "What is 15 + 27?", answers: ["32", "42", "52", "41"], correct: 1 },
      { q: "What is 56 - 19?", answers: ["37", "38", "39", "35"], correct: 0 },
      { q: "What is 8 × 7?", answers: ["54", "56", "58", "52"], correct: 1 },
      { q: "What is 72 ÷ 8?", answers: ["8", "9", "10", "7"], correct: 1 },
      { q: "What is 25 + 48?", answers: ["71", "72", "73", "74"], correct: 2 },
    ],
    hard: [
      {
        q: "What is 123 + 89?",
        answers: ["210", "211", "212", "213"],
        correct: 2,
      },
      {
        q: "What is 15 × 12?",
        answers: ["180", "185", "175", "170"],
        correct: 0,
      },
      { q: "What is 144 ÷ 12?", answers: ["11", "12", "13", "14"], correct: 1 },
      {
        q: "What is 75% of 200?",
        answers: ["150", "160", "140", "170"],
        correct: 0,
      },
      { q: "What is 2³?", answers: ["6", "8", "9", "12"], correct: 1 },
    ],
  };

  const questionSet = questions[difficulty];
  const question = questionSet[Math.floor(Math.random() * questionSet.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: question.q,
    answers: question.answers,
    correctAnswer: question.correct,
    subject: "Mathematics",
    difficulty,
    xpReward: difficulty === "easy" ? 50 : difficulty === "medium" ? 75 : 100,
    coinReward: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20,
  };
};

const generateLanguageQuestion = (
  difficulty: "easy" | "medium" | "hard",
): QuizQuestion => {
  const questions = {
    easy: [
      {
        q: "What is the opposite of 'hot'?",
        answers: ["warm", "cold", "cool", "freezing"],
        correct: 1,
      },
      {
        q: "Which word rhymes with 'cat'?",
        answers: ["dog", "hat", "car", "sun"],
        correct: 1,
      },
      {
        q: "How many letters are in 'dog'?",
        answers: ["2", "3", "4", "5"],
        correct: 1,
      },
      {
        q: "What is the first letter of 'apple'?",
        answers: ["A", "B", "C", "D"],
        correct: 0,
      },
      {
        q: "Which is a color?",
        answers: ["happy", "blue", "fast", "loud"],
        correct: 1,
      },
    ],
    medium: [
      {
        q: "What is the plural of 'child'?",
        answers: ["childs", "children", "childes", "child"],
        correct: 1,
      },
      {
        q: "Which word is a noun?",
        answers: ["run", "quickly", "house", "beautiful"],
        correct: 2,
      },
      {
        q: "What is a synonym for 'happy'?",
        answers: ["sad", "angry", "joyful", "tired"],
        correct: 2,
      },
      {
        q: "Which sentence is correct?",
        answers: ["I are happy", "I is happy", "I am happy", "I be happy"],
        correct: 2,
      },
      {
        q: "What is the past tense of 'go'?",
        answers: ["goes", "went", "going", "gone"],
        correct: 1,
      },
    ],
    hard: [
      {
        q: "What is an antonym for 'enormous'?",
        answers: ["huge", "tiny", "big", "large"],
        correct: 1,
      },
      {
        q: "Which is a compound word?",
        answers: ["beautiful", "sunshine", "running", "jumped"],
        correct: 1,
      },
      {
        q: "What type of word is 'quickly'?",
        answers: ["noun", "verb", "adjective", "adverb"],
        correct: 3,
      },
      {
        q: "Which sentence uses correct punctuation?",
        answers: [
          "Hello world",
          "Hello, world!",
          "Hello world.",
          "hello world",
        ],
        correct: 1,
      },
      {
        q: "What is a metaphor?",
        answers: [
          "A comparison using 'like'",
          "A direct comparison",
          "A rhyming word",
          "A loud sound",
        ],
        correct: 1,
      },
    ],
  };

  const questionSet = questions[difficulty];
  const question = questionSet[Math.floor(Math.random() * questionSet.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: question.q,
    answers: question.answers,
    correctAnswer: question.correct,
    subject: "Language Arts",
    difficulty,
    xpReward: difficulty === "easy" ? 50 : difficulty === "medium" ? 75 : 100,
    coinReward: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20,
  };
};

const generateGeneralQuestion = (
  difficulty: "easy" | "medium" | "hard",
): QuizQuestion => {
  const questions = {
    easy: [
      {
        q: "How many days are in a week?",
        answers: ["5", "6", "7", "8"],
        correct: 2,
      },
      {
        q: "What color do you get when you mix red and yellow?",
        answers: ["green", "orange", "purple", "blue"],
        correct: 1,
      },
      {
        q: "Which animal says 'moo'?",
        answers: ["pig", "cow", "sheep", "horse"],
        correct: 1,
      },
      {
        q: "How many wheels does a bicycle have?",
        answers: ["1", "2", "3", "4"],
        correct: 1,
      },
      {
        q: "What do bees make?",
        answers: ["milk", "honey", "eggs", "wool"],
        correct: 1,
      },
    ],
    medium: [
      {
        q: "What is the capital of France?",
        answers: ["London", "Berlin", "Paris", "Rome"],
        correct: 2,
      },
      {
        q: "How many continents are there?",
        answers: ["5", "6", "7", "8"],
        correct: 2,
      },
      {
        q: "What do plants need to grow?",
        answers: [
          "Only water",
          "Only sunlight",
          "Water and sunlight",
          "Only soil",
        ],
        correct: 2,
      },
      {
        q: "Which planet is closest to the sun?",
        answers: ["Venus", "Mercury", "Earth", "Mars"],
        correct: 1,
      },
      {
        q: "What is the largest ocean?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3,
      },
    ],
    hard: [
      {
        q: "Who painted the Mona Lisa?",
        answers: ["Picasso", "Van Gogh", "Da Vinci", "Monet"],
        correct: 2,
      },
      {
        q: "What is the chemical symbol for water?",
        answers: ["H2O", "CO2", "NaCl", "O2"],
        correct: 0,
      },
      {
        q: "Which is the longest river in the world?",
        answers: ["Amazon", "Nile", "Mississippi", "Yangtze"],
        correct: 1,
      },
      {
        q: "What is the speed of light?",
        answers: [
          "300,000 km/s",
          "150,000 km/s",
          "450,000 km/s",
          "200,000 km/s",
        ],
        correct: 0,
      },
      {
        q: "Who wrote Romeo and Juliet?",
        answers: ["Dickens", "Shakespeare", "Austen", "Twain"],
        correct: 1,
      },
    ],
  };

  const questionSet = questions[difficulty];
  const question = questionSet[Math.floor(Math.random() * questionSet.length)];

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: question.q,
    answers: question.answers,
    correctAnswer: question.correct,
    subject: "General Knowledge",
    difficulty,
    xpReward: difficulty === "easy" ? 50 : difficulty === "medium" ? 75 : 100,
    coinReward: difficulty === "easy" ? 10 : difficulty === "medium" ? 15 : 20,
  };
};

export const generateKeypadEquation = (
  difficulty: "easy" | "medium" | "hard",
): KeypadEquation => {
  let equation: string;
  let answer: number;

  switch (difficulty) {
    case "easy":
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      answer = Math.floor(Math.random() * 10) + 1;

      if (Math.random() > 0.5) {
        equation = `${a} + x = ${a + answer}`;
      } else {
        equation = `x + ${a} = ${a + answer}`;
      }
      break;

    case "medium":
      const c = Math.floor(Math.random() * 20) + 10;
      const d = Math.floor(Math.random() * 20) + 10;
      answer = Math.floor(Math.random() * 20) + 5;

      const operations = ["+", "-", "*"];
      const op = operations[Math.floor(Math.random() * operations.length)];

      if (op === "+") {
        equation = `${c} + x = ${c + answer}`;
      } else if (op === "-") {
        equation = `${c + answer} - x = ${c}`;
      } else {
        const multiplier = Math.floor(Math.random() * 5) + 2;
        answer = multiplier;
        equation = `${c} * x = ${c * multiplier}`;
      }
      break;

    case "hard":
      const e = Math.floor(Math.random() * 50) + 20;
      const f = Math.floor(Math.random() * 10) + 2;

      if (Math.random() > 0.5) {
        answer = Math.floor(Math.random() * 20) + 5;
        equation = `${e} + ${f} * x = ${e + f * answer}`;
      } else {
        answer = Math.floor(e / f);
        equation = `${e} / x = ${f}`;
      }
      break;

    default:
      answer = 5;
      equation = "2 + x = 7";
  }

  return {
    equation,
    answer,
    difficulty,
    xpReward: difficulty === "easy" ? 75 : difficulty === "medium" ? 100 : 150,
    coinReward: difficulty === "easy" ? 15 : difficulty === "medium" ? 20 : 30,
  };
};

export const checkBadgeEligibility = (gameState: any): Badge[] => {
  const newBadges: Badge[] = [];
  const earnedBadgeIds = gameState.user.badges.map((b: Badge) => b.id);

  // Math Star Badge
  if (!earnedBadgeIds.includes("math-star")) {
    const mathProgress = gameState.user.progress.find(
      (p: any) => p.subject === "Mathematics",
    );
    if (mathProgress && mathProgress.correctAnswers >= 20) {
      newBadges.push({
        id: "math-star",
        name: "Math Star",
        emoji: "🌟",
        description: "Solved 20 math problems",
        earned: true,
        earnedDate: new Date().toISOString(),
      });
    }
  }

  // Spelling Bee Badge
  if (!earnedBadgeIds.includes("spelling-bee")) {
    const langProgress = gameState.user.progress.find(
      (p: any) => p.subject === "Language Arts",
    );
    if (langProgress && langProgress.correctAnswers >= 15) {
      newBadges.push({
        id: "spelling-bee",
        name: "Spelling Bee",
        emoji: "📚",
        description: "Perfect spelling streak",
        earned: true,
        earnedDate: new Date().toISOString(),
      });
    }
  }

  // City Builder Badge
  if (
    !earnedBadgeIds.includes("city-builder") &&
    Array.isArray(gameState.cityGrid) &&
    gameState.cityGrid.flat().some((cell: string) => cell !== "")
  ) {
    newBadges.push({
      id: "city-builder",
    });
  }

  // Puzzle Master Badge
  if (
    !earnedBadgeIds.includes("puzzle-master") &&
    gameState.user.totalGamesPlayed >= 10
  ) {
    newBadges.push({
      id: "puzzle-master",
      name: "Puzzle Master",
      emoji: "🧩",
      description: "Completed 10 puzzles",
      earned: true,
      earnedDate: new Date().toISOString(),
    });
  }

  // Daily Player Badge
  if (
    !earnedBadgeIds.includes("daily-player") &&
    gameState.gameHistory.streakDays >= 7
  ) {
    newBadges.push({
      id: "daily-player",
      name: "Daily Player",
      emoji: "📅",
      description: "7 days in a row!",
      earned: true,
      earnedDate: new Date().toISOString(),
    });
  }

  return newBadges;
};

export const adjustDifficulty = (
  correctAnswers: number,
  totalQuestions: number,
): "easy" | "medium" | "hard" => {
  if (totalQuestions < 5) return "easy";

  const accuracy = correctAnswers / totalQuestions;

  if (accuracy >= 0.8) return "hard";
  if (accuracy >= 0.6) return "medium";
  return "easy";
};
