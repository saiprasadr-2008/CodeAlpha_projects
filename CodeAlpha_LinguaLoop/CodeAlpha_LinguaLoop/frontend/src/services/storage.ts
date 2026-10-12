import type { Flashcard, Category, QuizResult, UserStats, FlashcardFormData } from '../types';
import { INITIAL_CATEGORIES, INITIAL_FLASHCARDS } from '../data/sampleCards';

const STORAGE_KEYS = {
  CARDS: 'flashlearn_cards_v1',
  CATEGORIES: 'flashlearn_categories_v1',
  QUIZ_RESULTS: 'flashlearn_quiz_results_v1',
  USER_STATS: 'flashlearn_user_stats_v1',
  THEME: 'flashlearn_theme_v1',
  SOUND: 'flashlearn_sound_v1',
};

// Initialize Storage with Sample Data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.CARDS)) {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_FLASHCARDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS)) {
    const initialQuizResults: QuizResult[] = [
      {
        id: 'quiz-1',
        date: Date.now() - 86400000 * 2,
        category: 'Web Development',
        totalQuestions: 5,
        correctAnswers: 4,
        scorePercentage: 80,
        timeSpentSeconds: 120,
        mode: 'multiple-choice',
      },
      {
        id: 'quiz-2',
        date: Date.now() - 86400000 * 1,
        category: 'TypeScript & JS',
        totalQuestions: 5,
        correctAnswers: 5,
        scorePercentage: 100,
        timeSpentSeconds: 95,
        mode: 'self-grade',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(initialQuizResults));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_STATS)) {
    const initialStats: UserStats = {
      totalStudySessions: 8,
      totalCardsReviewed: 34,
      studyStreakDays: 3,
      lastStudyDate: new Date().toISOString().split('T')[0],
      quizzesCompleted: 2,
      averageQuizScore: 90,
    };
    localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(initialStats));
  }
};

// Cards API
export const getCards = (): Flashcard[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CARDS);
  return data ? JSON.parse(data) : INITIAL_FLASHCARDS;
};

export const saveCards = (cards: Flashcard[]): void => {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
};

export const addCard = (formData: FlashcardFormData): Flashcard => {
  const cards = getCards();
  const newCard: Flashcard = {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    question: formData.question.trim(),
    answer: formData.answer.trim(),
    category: formData.category,
    difficulty: formData.difficulty,
    mastery: 'New',
    timesReviewed: 0,
    timesCorrect: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const updatedCards = [newCard, ...cards];
  saveCards(updatedCards);
  return newCard;
};

export const updateCard = (id: string, formData: FlashcardFormData): Flashcard | null => {
  const cards = getCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updatedCard: Flashcard = {
    ...cards[index],
    question: formData.question.trim(),
    answer: formData.answer.trim(),
    category: formData.category,
    difficulty: formData.difficulty,
    updatedAt: Date.now(),
  };

  cards[index] = updatedCard;
  saveCards(cards);
  return updatedCard;
};

export const deleteCard = (id: string): void => {
  const cards = getCards();
  const filtered = cards.filter((c) => c.id !== id);
  saveCards(filtered);
};

export const updateCardMastery = (
  id: string,
  isCorrect: boolean
): Flashcard | null => {
  const cards = getCards();
  const index = cards.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const card = cards[index];
  const newTimesReviewed = card.timesReviewed + 1;
  const newTimesCorrect = isCorrect ? card.timesCorrect + 1 : card.timesCorrect;

  let mastery = card.mastery;
  const correctRatio = newTimesCorrect / newTimesReviewed;

  if (newTimesReviewed >= 3 && correctRatio >= 0.8) {
    mastery = 'Mastered';
  } else if (newTimesReviewed > 0) {
    mastery = 'Learning';
  }

  const updatedCard: Flashcard = {
    ...card,
    timesReviewed: newTimesReviewed,
    timesCorrect: newTimesCorrect,
    mastery,
    lastReviewedAt: Date.now(),
    updatedAt: Date.now(),
  };

  cards[index] = updatedCard;
  saveCards(cards);
  return updatedCard;
};

// Categories API
export const getCategories = (): Category[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : INITIAL_CATEGORIES;
};

export const addCategory = (name: string, description: string, color: string): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name,
    description,
    color,
  };
  const updated = [...categories, newCategory];
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
  return newCategory;
};

// Quiz Results API
export const getQuizResults = (): QuizResult[] => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
  return data ? JSON.parse(data) : [];
};

export const saveQuizResult = (result: Omit<QuizResult, 'id' | 'date'>): QuizResult => {
  const results = getQuizResults();
  const newResult: QuizResult = {
    ...result,
    id: `quiz-${Date.now()}`,
    date: Date.now(),
  };
  const updated = [newResult, ...results];
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updated));

  updateStatsAfterQuiz(newResult.scorePercentage);

  return newResult;
};

// User Stats API
export const getUserStats = (): UserStats => {
  initializeStorage();
  const data = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  if (!data) {
    return {
      totalStudySessions: 0,
      totalCardsReviewed: 0,
      studyStreakDays: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      quizzesCompleted: 0,
      averageQuizScore: 0,
    };
  }
  return JSON.parse(data);
};

export const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
};

export const recordStudySession = (cardsCount: number): void => {
  const stats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  const lastDate = stats.lastStudyDate;

  let streak = stats.studyStreakDays;
  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastDate === yesterday) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const updatedStats: UserStats = {
    ...stats,
    totalStudySessions: stats.totalStudySessions + 1,
    totalCardsReviewed: stats.totalCardsReviewed + cardsCount,
    studyStreakDays: streak,
    lastStudyDate: today,
  };

  saveUserStats(updatedStats);
};

export const updateStatsAfterQuiz = (scorePercentage: number): void => {
  const stats = getUserStats();
  const quizResults = getQuizResults();
  const totalQuizzes = quizResults.length;
  const totalScoresSum = quizResults.reduce((acc, curr) => acc + curr.scorePercentage, 0);
  const avgScore = totalQuizzes > 0 ? Math.round(totalScoresSum / totalQuizzes) : scorePercentage;

  const updatedStats: UserStats = {
    ...stats,
    quizzesCompleted: totalQuizzes,
    averageQuizScore: avgScore,
  };

  saveUserStats(updatedStats);
};

// Reset to Default Sample Data
export const resetToSampleData = (): void => {
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(INITIAL_FLASHCARDS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
  localStorage.removeItem(STORAGE_KEYS.USER_STATS);
  initializeStorage();
};

// Settings (Theme & Sound)
export const getSettings = () => {
  return {
    theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',
    sound: localStorage.getItem(STORAGE_KEYS.SOUND) !== 'false',
  };
};

export const setSoundSetting = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEYS.SOUND, enabled.toString());
};

export const setThemeSetting = (theme: 'light' | 'dark') => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};
