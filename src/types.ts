export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Rating = 'Again' | 'Hard' | 'Good' | 'Easy';
export type QuizMode = 'multiple-choice' | 'reveal';

export interface Deck {
  id: string;
  name: string;
  subject: string;
  color: string;
  createdAt: string;
}

export interface ReviewLog {
  id: string;
  at: string;
  rating: Rating;
}

export interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: Difficulty;
  explanation?: string;
  createdAt: string;
  nextReviewAt: string;
  lastReviewedAt?: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  lapses: number;
  reviewLog: ReviewLog[];
}

export interface StudySession {
  id: string;
  completedAt: string;
  cardIds: string[];
  reviewedCount: number;
  durationMinutes: number;
  pointsAwarded: number;
}

export interface QuizResult {
  id: string;
  completedAt: string;
  deckId: string;
  mode: QuizMode;
  score: number;
  total: number;
  correctCardIds: string[];
  incorrectCardIds: string[];
  durationSeconds: number;
  pointsAwarded: number;
}

export type BadgeId = 'first-session' | 'three-day-streak' | 'twenty-five-reviews' | 'quiz-ace' | 'century-club';

export interface Preferences {
  dailyGoal: number;
  preferredQuizMode: QuizMode;
}

export interface AppData {
  version: 1;
  decks: Deck[];
  cards: Flashcard[];
  sessions: StudySession[];
  quizzes: QuizResult[];
  points: number;
  badges: BadgeId[];
  preferences: Preferences;
}
