import { z } from "zod";

// User schema for authentication/storage
export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email().optional(),
  createdAt: z.string().optional()
});

export const insertUserSchema = userSchema.omit({ id: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Mock users table for storage interface
export const users = {
  $inferSelect: {} as User,
  $inferInsert: {} as InsertUser
};

export const avatarPartSchema = z.object({
  type: z.enum(['hair', 'clothes', 'accessories', 'skinTone', 'pet']),
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  cost: z.number(),
  unlocked: z.boolean().default(false)
});

export const buildingSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  cost: z.number(),
  unlocked: z.boolean().default(true),
  requiredBadges: z.number().default(0)
});

export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  description: z.string(),
  earned: z.boolean().default(false),
  earnedDate: z.string().optional()
});

export const userProgressSchema = z.object({
  subject: z.string(),
  level: z.number(),
  progress: z.number(), // percentage
  stars: z.number(),
  totalQuestions: z.number(),
  correctAnswers: z.number()
});

export const gameStateSchema = z.object({
  user: z.object({
    name: z.string().default("Explorer"),
    level: z.number().default(1),
    xp: z.number().default(0),
    coins: z.number().default(50),
    stars: z.number().default(0),
    badges: z.array(badgeSchema).default([]),
    totalGamesPlayed: z.number().default(0),
    avatar: z.object({
      hair: z.string().default("👧"),
      clothes: z.string().default(""),
      accessories: z.string().default(""),
      skinTone: z.string().default(""),
      pet: z.string().default("🐰")
    }).default({}),
    inventory: z.array(z.string()).default([]),
    progress: z.array(userProgressSchema).default([])
  }),
  
  cityGrid: z.array(z.array(z.string())).default([]),
  
  settings: z.object({
    soundEnabled: z.boolean().default(true),
    nightMode: z.boolean().default(false),
    difficulty: z.enum(['easy', 'medium', 'hard']).default('easy')
  }).default({}),
  
  gameHistory: z.object({
    lastLogin: z.string().optional(),
    dailyBonusClaimed: z.boolean().default(false),
    streakDays: z.number().default(0)
  }).default({})
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  answers: z.array(z.string()),
  correctAnswer: z.number(),
  subject: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  xpReward: z.number(),
  coinReward: z.number()
});

export const keypadEquationSchema = z.object({
  equation: z.string(),
  answer: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  xpReward: z.number(),
  coinReward: z.number()
});

export type AvatarPart = z.infer<typeof avatarPartSchema>;
export type Building = z.infer<typeof buildingSchema>;
export type Badge = z.infer<typeof badgeSchema>;
export type UserProgress = z.infer<typeof userProgressSchema>;
export type GameState = z.infer<typeof gameStateSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type KeypadEquation = z.infer<typeof keypadEquationSchema>;
