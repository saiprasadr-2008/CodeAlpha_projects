import { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/Layout';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { QuizPage } from './pages/QuizPage';
import { SettingsPage } from './pages/SettingsPage';
import { StudyPage } from './pages/StudyPage';
import { applyRating as importRating, getUnlockedBadges } from './lib/algorithms';
import { createInitialData, loadData, persistData } from './lib/storage';
import type { AppData, Deck, Flashcard, Preferences, QuizResult, Rating, StudySession } from './types';

export type PageId = 'dashboard' | 'library' | 'study' | 'quiz' | 'analytics' | 'settings';
export type Notice = { message: string; tone?: 'success' | 'error' };

function makeId(prefix: string): string {
  return `${prefix}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`}`;
}

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [page, setPage] = useState<PageId>('dashboard');
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 220);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) persistData(data);
  }, [data, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const notify = (message: string, tone: Notice['tone'] = 'success') => setNotice({ message, tone });
  const subjects = useMemo(() => [...new Set(data.decks.map((deck) => deck.subject).concat(data.cards.map((card) => card.subject)))].filter(Boolean).sort(), [data.decks, data.cards]);

  const addCard = (card: Flashcard) => {
    setData((current) => ({ ...current, cards: [card, ...current.cards] }));
    notify('Card added to your library.');
  };
  const updateCard = (card: Flashcard) => {
    setData((current) => ({ ...current, cards: current.cards.map((item) => item.id === card.id ? card : item) }));
    notify('Your card has been updated.');
  };
  const deleteCard = (id: string) => {
    setData((current) => ({ ...current, cards: current.cards.filter((card) => card.id !== id) }));
    notify('Card removed from your library.');
  };
  const addDeck = (deck: Omit<Deck, 'id' | 'createdAt'>) => {
    setData((current) => ({ ...current, decks: [{ ...deck, id: makeId('deck'), createdAt: new Date().toISOString() }, ...current.decks] }));
    notify('Your new deck is ready.');
  };
  const updateDeck = (deck: Deck) => {
    setData((current) => ({
      ...current,
      decks: current.decks.map((item) => item.id === deck.id ? deck : item),
      cards: current.cards.map((card) => card.deckId === deck.id ? { ...card, subject: deck.subject } : card),
    }));
    notify('Deck details saved.');
  };
  const deleteDeck = (id: string) => {
    setData((current) => ({ ...current, decks: current.decks.filter((deck) => deck.id !== id), cards: current.cards.filter((card) => card.deckId !== id) }));
    notify('Deck and its cards were deleted.');
  };

  const finishStudy = (sessionId: string, ratings: { cardId: string; rating: Rating }[], durationMinutes: number) => {
    setData((current) => {
      if (current.sessions.some((session) => session.id === sessionId)) return current;
      const uniqueRatings = [...new Map(ratings.map((item) => [item.cardId, item])).values()];
      const completedAt = new Date();
      const cards = current.cards.map((card) => {
        const choice = uniqueRatings.find((item) => item.cardId === card.id);
        return choice ? applyRatingOnce(card, choice.rating, sessionId, completedAt) : card;
      });
      const pointsAwarded = 15 + uniqueRatings.length * 5;
      const session: StudySession = {
        id: sessionId,
        completedAt: completedAt.toISOString(),
        cardIds: uniqueRatings.map((item) => item.cardId),
        reviewedCount: uniqueRatings.length,
        durationMinutes: Math.max(1, Math.round(durationMinutes)),
        pointsAwarded,
      };
      const provisional: AppData = { ...current, cards, sessions: [session, ...current.sessions], points: current.points + pointsAwarded };
      return { ...provisional, badges: [...new Set([...provisional.badges, ...getUnlockedBadges(provisional)])] };
    });
    notify('Study session complete — your progress is saved.');
  };

  const saveQuiz = (draft: Omit<QuizResult, 'pointsAwarded'>) => {
    let pointsEarned = 0;
    setData((current) => {
      if (current.quizzes.some((quiz) => quiz.id === draft.id)) return current;
      pointsEarned = draft.score * 3 + (draft.total > 0 && draft.score === draft.total ? 8 : 0);
      const result: QuizResult = { ...draft, pointsAwarded: pointsEarned };
      const provisional: AppData = { ...current, quizzes: [result, ...current.quizzes], points: current.points + pointsEarned };
      return { ...provisional, badges: [...new Set([...provisional.badges, ...getUnlockedBadges(provisional)])] };
    });
    notify('Quiz result saved to your progress.');
  };

  const updatePreferences = (preferences: Preferences) => {
    setData((current) => ({ ...current, preferences }));
    notify('Preferences saved.');
  };
  const resetDemo = () => {
    if (!window.confirm('Reset RecallQuest to the original demo decks and cards? Your saved study history, quizzes, points, and preferences will be cleared.')) return false;
    setData(createInitialData());
    notify('Demo data restored.');
    return true;
  };

  let content;
  if (page === 'library') content = <LibraryPage data={data} subjects={subjects} onAddCard={addCard} onUpdateCard={updateCard} onDeleteCard={deleteCard} onAddDeck={addDeck} onUpdateDeck={updateDeck} onDeleteDeck={deleteDeck} notify={notify} />;
  else if (page === 'study') content = <StudyPage data={data} onFinish={finishStudy} notify={notify} />;
  else if (page === 'quiz') content = <QuizPage data={data} onSaveResult={saveQuiz} notify={notify} />;
  else if (page === 'analytics') content = <AnalyticsPage data={data} />;
  else if (page === 'settings') content = <SettingsPage data={data} onSave={updatePreferences} onReset={resetDemo} />;
  else content = <DashboardPage data={data} onNavigate={setPage} />;

  if (!ready) {
    return <div className="loading-screen"><div className="brand-mark large"><span>R</span></div><div className="loading-line" /><p>Gathering your next good idea…</p></div>;
  }

  return (
    <Layout page={page} onNavigate={setPage} points={data.points} notice={notice} onDismissNotice={() => setNotice(null)}>
      {content}
    </Layout>
  );
}

function applyRatingOnce(card: Flashcard, rating: Rating, sessionId: string, at: Date): Flashcard {
  return importRating(card, rating, `${sessionId}:${card.id}`, at);
}
