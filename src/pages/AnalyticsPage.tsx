import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Activity, Award, BookOpen, Brain, Check, Clock3, Flame, Medal, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState, PageHeading } from '../components/UI';
import { getStudyStreak, getWeeklyActivity, isDue, totalReviewed } from '../lib/algorithms';
import type { AppData, BadgeId, Flashcard } from '../types';
import '../analytics.css';

const badgeInfo: { id: BadgeId; name: string; description: string; icon: typeof Award; requirement: string; tone: string }[] = [
  { id: 'first-session', name: 'First Focus', description: 'Complete your first study session.', icon: Sparkles, requirement: '1 study session', tone: 'violet' },
  { id: 'three-day-streak', name: 'Steady Flame', description: 'Study on three days in a row.', icon: Flame, requirement: '3-day streak', tone: 'amber' },
  { id: 'twenty-five-reviews', name: 'Recall Builder', description: 'Review 25 flashcards.', icon: BookOpen, requirement: '25 reviews', tone: 'blue' },
  { id: 'quiz-ace', name: 'Quiz Ace', description: 'Earn a perfect quiz score.', icon: Medal, requirement: '1 perfect quiz', tone: 'mint' },
  { id: 'century-club', name: 'Century Club', description: 'Earn your first 100 points.', icon: Award, requirement: '100 points', tone: 'pink' },
];

export function AnalyticsPage({ data }: { data: AppData }) {
  const week = useMemo(() => getWeeklyActivity(data), [data]);
  const reviews = data.cards.flatMap((card) => card.reviewLog);
  const quizQuestions = data.quizzes.reduce((sum, quiz) => sum + quiz.total, 0);
  const quizCorrect = data.quizzes.reduce((sum, quiz) => sum + quiz.score, 0);
  const reviewCorrect = reviews.filter((review) => review.rating === 'Good' || review.rating === 'Easy').length;
  const denominator = reviews.length + quizQuestions;
  const accuracy = denominator ? Math.round((reviewCorrect + quizCorrect) / denominator * 100) : 0;
  const reviewed = totalReviewed(data);
  const studyMinutes = data.sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
  const streak = getStudyStreak(data.sessions);
  const activity = week.some((day) => day.hasActivity);

  const difficultCards = data.cards.map((card) => ({
    card,
    again: card.reviewLog.filter((review) => review.rating === 'Again').length,
    hard: card.reviewLog.filter((review) => review.rating === 'Hard').length,
    score: card.lapses * 3 + card.reviewLog.filter((review) => review.rating === 'Again').length * 2 + card.reviewLog.filter((review) => review.rating === 'Hard').length + (isDue(card) ? 1 : 0) + (card.difficulty === 'Hard' ? 1 : 0),
  })).filter((item) => item.score > 0 || item.card.difficulty === 'Hard').sort((a, b) => b.score - a.score || b.again - a.again).slice(0, 5);
  const subjects = [...new Set(data.cards.map((card) => card.subject))].map((subject) => {
    const cards = data.cards.filter((card) => card.subject === subject);
    const due = cards.filter((card) => isDue(card)).length;
    const needsWork = cards.filter((card) => card.difficulty === 'Hard' || card.reviewLog.some((review) => review.rating === 'Again' || review.rating === 'Hard')).length;
    return { subject, due, needsWork, total: cards.length, severity: due * 2 + needsWork };
  }).filter((item) => item.severity > 0).sort((a, b) => b.severity - a.severity);

  return <>
    <PageHeading eyebrow="YOUR LEARNING, REFLECTED" title="Progress you can feel." description="A real picture of your practice — each number comes from sessions and quizzes you completed." />
    <section className="analytics-metrics">
      <InsightMetric icon={<Target size={15} />} label="Overall accuracy" value={denominator ? `${accuracy}%` : '—'} caption={denominator ? `${reviewCorrect + quizCorrect} of ${denominator} confident answers` : 'Complete a quiz or review'} accent="violet" />
      <InsightMetric icon={<BookOpen size={15} />} label="Cards reviewed" value={reviewed.toLocaleString()} caption={`${reviews.length} confidence ratings saved`} accent="mint" />
      <InsightMetric icon={<Clock3 size={15} />} label="Time in study" value={formatMinutes(studyMinutes)} caption={`${data.sessions.length} completed sessions`} accent="amber" />
      <InsightMetric icon={<Flame size={15} />} label="Current streak" value={`${streak}`} caption={streak === 1 ? 'day of showing up' : 'days of showing up'} accent="pink" />
    </section>

    <section className="analytics-grid">
      <div className="panel analytics-chart-panel"><div className="panel-head"><div><h2 className="panel-title">Practice over time</h2><p className="panel-subtitle">Cards reviewed each day · the last seven days</p></div><span className="chart-legend"><i className="legend-dot violet-dot" /> cards reviewed</span></div><div className="analytics-chart-wrap">{activity ? <ResponsiveContainer width="100%" height="100%"><BarChart data={week} barSize={20} margin={{ top: 12, right: 14, left: -18, bottom: 0 }}><CartesianGrid stroke="rgba(255,255,255,.055)" vertical={false} /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#77768b', fontSize: 9 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#77768b', fontSize: 9 }} allowDecimals={false} /><Tooltip contentStyle={{ background: '#1b1b2a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 9, fontSize: 10, color: '#ddd' }} cursor={{ fill: 'rgba(255,255,255,.025)' }} /><Bar dataKey="reviewed" name="Cards reviewed" fill="#8c7af4" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="analytics-chart-empty"><Activity size={20} /><strong>A week of practice will appear here</strong><span>Complete a study session to start your activity chart.</span></div>}</div><div className="analytics-chart-foot"><span><i className="tiny-mint-dot" /> Quiz questions are included in accuracy</span><span>{week.filter((day) => day.hasActivity).length} active days</span></div></div>
      <div className="panel weekly-score-panel"><div className="panel-head"><div><h2 className="panel-title">Weekly snapshot</h2><p className="panel-subtitle">The little signals behind your progress</p></div></div><div className="weekly-score-content"><div className="weekly-score-ring" style={{ '--score': `${accuracy}%` } as CSSProperties}><div><strong>{denominator ? `${accuracy}%` : '—'}</strong><small>accuracy</small></div></div><div className="weekly-facts"><div><span className="fact-icon fact-violet"><Activity size={13} /></span><span><strong>{reviewed + quizQuestions}</strong><small>learning moments</small></span></div><div><span className="fact-icon fact-mint"><Check size={13} /></span><span><strong>{reviewCorrect + quizCorrect}</strong><small>answers recalled</small></span></div><div><span className="fact-icon fact-amber"><TrendingUp size={13} /></span><span><strong>{data.points.toLocaleString()}</strong><small>points earned</small></span></div></div></div></div>
    </section>

    <section className="analytics-grid section-gap">
      <div className="panel"><div className="panel-head"><div><h2 className="panel-title">Worth another look</h2><p className="panel-subtitle">Cards flagged by a tough rating or a due date</p></div><span className="problem-count">{difficultCards.length} cards</span></div>{difficultCards.length ? <div className="difficult-list">{difficultCards.map(({ card, again, hard, score }) => <DifficultCard key={card.id} card={card} again={again} hard={hard} score={score} />)}</div> : <EmptyState title="No trouble spots yet" description="Cards you rate Again or Hard will show here, alongside anything due for review." icon={<Check size={18} />} />}</div>
      <div className="panel"><div className="panel-head"><div><h2 className="panel-title">Subjects to revisit</h2><p className="panel-subtitle">Topics with due or challenging cards</p></div><Brain size={15} className="analytics-head-icon" /></div>{subjects.length ? <div className="topic-list">{subjects.slice(0, 6).map((item) => <div className="topic-row" key={item.subject}><div className="topic-mark">{item.subject.slice(0, 1)}</div><div className="topic-copy"><strong>{item.subject}</strong><small>{item.due} due · {item.needsWork} challenging · {item.total} total</small></div><div className="topic-progress"><i style={{ width: `${Math.min(100, Math.max(8, item.severity / Math.max(1, item.total) * 100))}%` }} /></div></div>)}</div> : <EmptyState title="Looking good" description="Your subjects will show here when a card needs a revisit." icon={<Sparkles size={18} />} />}</div>
    </section>

    <section className="panel badges-panel section-gap"><div className="panel-head"><div><h2 className="panel-title">Milestones along the way</h2><p className="panel-subtitle">Badges unlock as your practice grows</p></div><span className="badge-count"><Award size={13} /> {data.badges.length}/{badgeInfo.length} earned</span></div><div className="badge-grid">{badgeInfo.map((badge) => <BadgeTile key={badge.id} earned={data.badges.includes(badge.id)} name={badge.name} description={badge.description} requirement={badge.requirement} icon={badge.icon} tone={badge.tone} />)}</div></section>
  </>;
}

function InsightMetric({ icon, label, value, caption, accent }: { icon: React.ReactNode; label: string; value: string; caption: string; accent: string }) {
  return <div className={`panel insight-metric insight-${accent}`}><div className="insight-label"><span>{icon}</span>{label}</div><strong>{value}</strong><small>{caption}</small></div>;
}

function DifficultCard({ card, again, hard, score }: { card: Flashcard; again: number; hard: number; score: number }) {
  const deckColor = card.difficulty === 'Hard' ? 'hard' : again ? 'again' : 'due';
  return <div className="difficult-row"><span className={`difficulty-indicator ${deckColor}`}><BookOpen size={13} /></span><div className="difficult-copy"><strong>{card.question}</strong><small>{card.subject} · {again} Again · {hard} Hard</small></div><span className="difficulty-score">{score}<small> signal</small></span></div>;
}

function BadgeTile({ earned, name, description, requirement, icon: Icon, tone }: { earned: boolean; name: string; description: string; requirement: string; icon: typeof Award; tone: string }) {
  return <div className={`badge-tile ${earned ? `badge-earned badge-${tone}` : 'badge-locked'}`}><span className="badge-icon"><Icon size={17} /></span><div><strong>{name}</strong><small>{earned ? description : requirement}</small></div><span className="badge-status">{earned ? <Check size={12} /> : 'LOCKED'}</span></div>;
}

function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0 min';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours ? `${hours}h ${mins}m` : `${mins} min`;
}
