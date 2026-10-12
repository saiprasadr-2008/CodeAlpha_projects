import type { AppData, BadgeId, Flashcard, Rating, StudySession } from '../types';

export const DAY_MS = 86_400_000;

export function dayKey(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDue(card: Flashcard, now = new Date()): boolean {
  return new Date(card.nextReviewAt).getTime() <= now.getTime();
}

export function isMastered(card: Flashcard): boolean {
  return card.repetitions >= 3 && card.intervalDays >= 7;
}

export function getStudyStreak(sessions: StudySession[], now = new Date()): number {
  const days = new Set(sessions.map((session) => dayKey(session.completedAt)));
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function applyRating(card: Flashcard, rating: Rating, reviewId: string, at = new Date()): Flashcard {
  if (card.reviewLog.some((review) => review.id === reviewId)) return card;
  const next = { ...card, reviewLog: [...card.reviewLog] };
  const oldInterval = Math.max(0, next.intervalDays);
  let intervalDays: number;
  if (rating === 'Again') {
    intervalDays = 1;
    next.repetitions = 0;
    next.lapses += 1;
    next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
  } else if (rating === 'Hard') {
    intervalDays = oldInterval <= 1 ? 2 : Math.max(1, Math.ceil(oldInterval * 1.2));
    next.repetitions += 1;
    next.easeFactor = Math.max(1.3, next.easeFactor - 0.15);
  } else if (rating === 'Good') {
    intervalDays = next.repetitions === 0 ? 1 : next.repetitions === 1 ? 3 : Math.max(1, Math.round(oldInterval * next.easeFactor));
    next.repetitions += 1;
  } else {
    intervalDays = next.repetitions === 0 ? 4 : Math.max(2, Math.round(Math.max(1, oldInterval) * next.easeFactor * 1.3));
    next.repetitions += 1;
    next.easeFactor = Math.min(3, next.easeFactor + 0.15);
  }
  next.intervalDays = intervalDays;
  next.lastReviewedAt = at.toISOString();
  next.nextReviewAt = new Date(at.getTime() + intervalDays * DAY_MS).toISOString();
  next.reviewLog.push({ id: reviewId, at: at.toISOString(), rating });
  return next;
}

export function getWeeklyActivity(data: AppData, now = new Date()) {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6 + offset);
    const key = dayKey(date);
    const daySessions = data.sessions.filter((session) => dayKey(session.completedAt) === key);
    const dayQuizzes = data.quizzes.filter((quiz) => dayKey(quiz.completedAt) === key);
    const dayReviews = data.cards.flatMap((card) => card.reviewLog).filter((review) => dayKey(review.at) === key);
    const quizTotal = dayQuizzes.reduce((sum, quiz) => sum + quiz.total, 0);
    const quizCorrect = dayQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);
    const successfulReviews = dayReviews.filter((review) => review.rating === 'Good' || review.rating === 'Easy').length;
    const reviewAccuracy = dayReviews.length ? successfulReviews / dayReviews.length : null;
    const quizAccuracy = quizTotal ? quizCorrect / quizTotal : null;
    const accuracyParts = [reviewAccuracy, quizAccuracy].filter((value): value is number => value !== null);
    const accuracy = accuracyParts.length ? Math.round(accuracyParts.reduce((sum, value) => sum + value, 0) / accuracyParts.length * 100) : 0;
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: key,
      reviewed: daySessions.reduce((sum, session) => sum + session.reviewedCount, 0),
      quizQuestions: quizTotal,
      accuracy,
      hasActivity: daySessions.length > 0 || dayQuizzes.length > 0 || dayReviews.length > 0,
    };
  });
}

export function totalReviewed(data: AppData): number {
  return data.sessions.reduce((sum, session) => sum + session.reviewedCount, 0);
}

export function getUnlockedBadges(data: AppData, streak = getStudyStreak(data.sessions)): BadgeId[] {
  const reviewed = totalReviewed(data);
  const conditions: Record<BadgeId, boolean> = {
    'first-session': data.sessions.length > 0,
    'three-day-streak': streak >= 3,
    'twenty-five-reviews': reviewed >= 25,
    'quiz-ace': data.quizzes.some((quiz) => quiz.total > 0 && quiz.score === quiz.total),
    'century-club': data.points >= 100,
  };
  return (Object.keys(conditions) as BadgeId[]).filter((id) => conditions[id]);
}
