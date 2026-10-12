export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type MasteryStatus = 'New' | 'Learning' | 'Mastered';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: Difficulty;
  mastery: MasteryStatus;
  timesReviewed: number;
  timesCorrect: number;
  createdAt: number;
  updatedAt: number;
  lastReviewedAt?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName?: string;
}

export type ViewMode = 'dashboard' | 'study' | 'quiz' | 'manage' | 'progress';

export interface QuizQuestion {
  card: Flashcard;
  options: string[];
  correctAnswer: string;
}

export interface QuizConfig {
  category: string;
  questionCount: number;
  mode: 'multiple-choice' | 'self-grade';
}

export interface QuizResult {
  id: string;
  date: number;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  mode: 'multiple-choice' | 'self-grade';
}

export interface UserStats {
  totalStudySessions: number;
  totalCardsReviewed: number;
  studyStreakDays: number;
  lastStudyDate: string;
  quizzesCompleted: number;
  averageQuizScore: number;
}

export interface FlashcardFormData {
  question: string;
  answer: string;
  category: string;
  difficulty: Difficulty;
}

export interface FormErrors {
  question?: string;
  answer?: string;
  category?: string;
  difficulty?: string;
}
