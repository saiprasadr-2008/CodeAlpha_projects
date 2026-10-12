import { useMemo } from 'react';
import { Activity, ArrowRight, BookOpen, Brain, CalendarCheck2, Check, Clock3, Flame, Layers3, Play, Sparkles, Target, Trophy } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { PageId } from '../App';
import { EmptyState, PageHeading } from '../components/UI';
import { dayKey, getStudyStreak, getWeeklyActivity, isDue, isMastered, totalReviewed } from '../lib/algorithms';
import type { AppData } from '../types';
import '../dashboard.css';

const subjectTone: Record<string, { bg: string; color: string }> = {
  Java: { bg: 'rgba(165,142,255,.15)', color: '#c2b3ff' },
  Mathematics: { bg: 'rgba(117,172,255,.13)', color: '#9fc9ff' },
  'Artificial Intelligence': { bg: 'rgba(131,217,183,.12)', color: '#9be6c6' },
  'General Knowledge': { bg: 'rgba(241,187,124,.13)', color: '#f2c48e' },
};

export function DashboardPage({ data, onNavigate }: { data: AppData; onNavigate: (page: PageId) => void }) {
  const today = new Date();
  const week = useMemo(() => getWeeklyActivity(data, today), [data]);
  const dueCount = data.cards.filter((card) => isDue(card, today)).length;
  const masteredCount = data.cards.filter(isMastered).length;
  const streak = getStudyStreak(data.sessions, today);
  const todayKey = dayKey(today);
  const todayReviews = data.cards.flatMap((card) => card.reviewLog).filter((review) => dayKey(review.at) === todayKey).length;
  const todayQuizzes = data.quizzes.filter((quiz) => dayKey(quiz.completedAt) === todayKey).reduce((sum, quiz) => sum + quiz.total, 0);
  const dailyProgress = todayReviews + todayQuizzes;
  const goal = data.preferences.dailyGoal;
  const goalPercent = Math.min(100, Math.round(dailyProgress / Math.max(1, goal) * 100));
  const activityExists = week.some((day) => day.hasActivity);
  const subjects = [...new Set(data.decks.map((deck) => deck.subject))].map((subject) => ({ subject, count: data.cards.filter((card) => card.subject === subject).length, deckCount: data.decks.filter((deck) => deck.subject === subject).length }));
  const recent = [
    ...data.sessions.map((session) => ({ id: session.id, title: 'Study session', subtitle: `${session.reviewedCount} ${session.reviewedCount === 1 ? 'card' : 'cards'} reviewed`, date: session.completedAt, icon: BookOpen, color: '#b8aaff' })),
    ...data.quizzes.map((quiz) => ({ id: quiz.id, title: 'Quiz complete', subtitle: `${quiz.score}/${quiz.total} correct`, date: quiz.completedAt, icon: Sparkles, color: '#9de7c5' })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4);
  const reviewedAllTime = totalReviewed(data);

  return <>
    <PageHeading eyebrow="YOUR STUDY STUDIO" title="Your learning space" description="A little progress, repeated often, adds up to something remarkable." actions={<button className="btn btn-secondary" onClick={() => onNavigate('analytics')}><Activity size={15} /> See your progress</button>} />

    <section className="metric-grid" aria-label="Learning overview">
      <Metric icon={<Layers3 size={15} />} label="Total flashcards" value={data.cards.length.toLocaleString()} note={`${data.decks.length} decks in your library`} accent="#b6a8ff" bg="rgba(156,137,255,.12)" />
      <Metric icon={<Check size={15} />} label="Cards mastered" value={masteredCount.toLocaleString()} note={data.cards.length ? `${Math.round(masteredCount / data.cards.length * 100)}% of your cards` : 'No cards to master yet'} accent="#94e1bf" bg="rgba(126,217,174,.1)" />
      <Metric icon={<CalendarCheck2 size={15} />} label="Due to revisit" value={dueCount.toLocaleString()} note={dueCount ? 'Ready when you are' : 'You are all caught up'} accent="#f0bd83" bg="rgba(240,189,131,.1)" />
      <Metric icon={<Flame size={15} />} label="Study streak" value={streak.toLocaleString()} note={streak === 1 ? 'day in a row — nice start' : streak > 1 ? 'days in a row — keep it warm' : 'Start a session to begin'} accent="#e2a5ff" bg="rgba(209,135,255,.11)" suffix={streak === 1 ? 'day' : 'days'} />
    </section>

    <section className="dashboard-grid">
      <div className="panel">
        <div className="panel-head"><div><h2 className="panel-title">Your week, in focus</h2><p className="panel-subtitle">Reviews completed and quiz accuracy · last 7 days</p></div><span className="chart-legend"><i className="legend-dot violet-dot" /> reviews <i className="legend-dot mint-dot" /> accuracy</span></div>
        <div className="chart-wrap">
          {activityExists ? <div className="dashboard-chart"><div className="chart-grid-lines"><span /><span /><span /><span /></div><div className="chart-bars">{week.map((day) => <div className="chart-day" key={day.date}><div className="chart-columns"><span className="bar-track"><i style={{ height: `${day.reviewed ? Math.min(100, 18 + day.reviewed * 12) : 3}%` }} /></span><span className="accuracy-track"><i style={{ height: `${day.accuracy}%` }} /></span></div><small>{day.day}</small></div>)}</div></div> : <div className="chart-empty"><div><div className="chart-empty-icon"><Activity size={20} /></div><strong>Your first week starts here</strong><span>Complete a study session or quiz to see your activity.</span></div></div>}
        </div>
      </div>
      <div className="goal-panel panel">
        <div className="goal-head"><span><Target size={13} style={{ verticalAlign: '-2px', marginRight: 6 }} />DAILY MOMENTUM</span><span>{goalPercent}%</span></div>
        <div className="goal-count">{dailyProgress}<small> / {goal} cards</small></div>
        <p className="goal-desc">{goalPercent >= 100 ? 'You reached your daily study goal. Beautiful work.' : 'A few focused reviews can make today count.'}</p>
        <div className="progress-track"><span style={{ width: `${goalPercent}%` }} /></div>
        <div className="goal-footer"><span>{todayReviews} reviews · {todayQuizzes} quiz questions</span><strong>{Math.max(0, goal - dailyProgress)} to go</strong></div>
        <div className="goal-flourish"><Sparkles size={17} /></div>
      </div>
    </section>

    <section className="quick-start panel">
      <div className="quick-start-copy"><div className="quick-start-icon"><Brain size={19} /></div><div><h3>Make today’s recall count</h3><p>{dueCount ? `${dueCount} ${dueCount === 1 ? 'card is' : 'cards are'} ready for a quick review.` : 'Build a fresh streak with a focused session.'} Reviews train the memory you’ll use later.</p></div></div>
      <button className="btn btn-primary" onClick={() => onNavigate('study')}><Play size={14} fill="currentColor" /> Start studying</button>
    </section>

    <section className="dashboard-grid section-gap">
      <div className="panel">
        <div className="panel-head"><div><h2 className="panel-title">Your subjects</h2><p className="panel-subtitle">Organized by what you’re curious about</p></div><button className="panel-action" onClick={() => onNavigate('library')}>Open library <ArrowRight size={13} /></button></div>
        {subjects.length ? <div className="subject-list">{subjects.map((item) => {
          const tone = subjectTone[item.subject] ?? { bg: 'rgba(157,231,197,.1)', color: '#9de7c5' };
          return <button className="subject-row subject-row-button" key={item.subject} onClick={() => onNavigate('library')}><span className="subject-symbol" style={{ color: tone.color, background: tone.bg }}>{item.subject.slice(0, 1).toUpperCase()}</span><span className="subject-copy"><strong>{item.subject}</strong><small>{item.deckCount} {item.deckCount === 1 ? 'deck' : 'decks'}</small></span><span className="subject-count">{item.count}<small> cards</small></span><ArrowRight size={14} className="subject-arrow" /></button>;
        })}</div> : <EmptyState title="Add a subject" description="Create a deck to start organizing your flashcards." action={<button className="subtle-link" onClick={() => onNavigate('library')}>Open your library</button>} />}
      </div>
      <div className="panel">
        <div className="panel-head"><div><h2 className="panel-title">Recent activity</h2><p className="panel-subtitle">Your latest sessions and quizzes</p></div><span className="activity-total"><Clock3 size={12} /> {reviewedAllTime} reviewed</span></div>
        {recent.length ? <div className="recent-list">{recent.map((entry) => <div className="recent-row" key={entry.id}><div className="recent-icon" style={{ color: entry.color }}><entry.icon size={15} /></div><div className="recent-copy"><strong>{entry.title}</strong><small>{entry.subtitle}</small></div><time>{relativeTime(entry.date)}</time></div>)}</div> : <EmptyState title="A clean slate" description="Your completed sessions will show up here." icon={<Trophy size={19} />} />}
      </div>
    </section>
  </>;
}

function Metric({ icon, label, value, note, accent, bg, suffix }: { icon: ReactNode; label: string; value: string; note: string; accent: string; bg: string; suffix?: string }) {
  return <div className="panel metric-card" style={{ '--accent': accent, '--accent-bg': bg, '--glow': bg } as CSSProperties}><div className="metric-label"><span className="metric-icon">{icon}</span>{label}</div><div className="metric-value">{value}{suffix && <span className="metric-suffix">{suffix}</span>}</div><div className="metric-note">{note}</div></div>;
}

function relativeTime(value: string): string {
  const elapsed = Date.now() - new Date(value).getTime();
  const mins = Math.max(1, Math.floor(elapsed / 60_000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
