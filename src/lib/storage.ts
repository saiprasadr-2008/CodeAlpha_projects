import { createSeedCards, createSeedDecks } from '../data/seed';
import type { AppData } from '../types';

export const STORAGE_KEY = 'recallquest-data-v1';

export function createInitialData(now = new Date()): AppData {
  return {
    version: 1,
    decks: createSeedDecks(now),
    cards: createSeedCards(now),
    sessions: [],
    quizzes: [],
    points: 0,
    badges: [],
    preferences: { dailyGoal: 15, preferredQuizMode: 'multiple-choice' },
  };
}

export function loadData(): AppData {
  if (typeof window === 'undefined') return createInitialData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialData();
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' && parsed !== null &&
      'version' in parsed && parsed.version === 1 &&
      'cards' in parsed && Array.isArray(parsed.cards) &&
      'decks' in parsed && Array.isArray(parsed.decks) &&
      'sessions' in parsed && Array.isArray(parsed.sessions) &&
      'quizzes' in parsed && Array.isArray(parsed.quizzes)
    ) {
      const stored = parsed as AppData;
      return {
        ...createInitialData(),
        ...stored,
        points: Number.isFinite(stored.points) ? stored.points : 0,
        badges: Array.isArray(stored.badges) ? stored.badges : [],
        preferences: {
          dailyGoal: Number.isFinite(stored.preferences?.dailyGoal) ? stored.preferences.dailyGoal : 15,
          preferredQuizMode: stored.preferences?.preferredQuizMode === 'reveal' ? 'reveal' : 'multiple-choice',
        },
      };
    }
  } catch {
    // A damaged or unavailable browser store should not prevent opening the app.
  }
  return createInitialData();
}

export function persistData(data: AppData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // The interface remains usable in private browsing or when storage is full.
  }
}
