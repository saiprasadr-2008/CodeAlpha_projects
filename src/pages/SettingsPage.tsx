import '../settings.css';
import { useState } from 'react';
import { Check, Database, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { PageHeading } from '../components/UI';
import type { AppData, Preferences, QuizMode } from '../types';

export function SettingsPage({ data, onSave, onReset }: { data: AppData; onSave: (preferences: Preferences) => void; onReset: () => boolean }) {
  const [goal, setGoal] = useState(String(data.preferences.dailyGoal));
  const [mode, setMode] = useState<QuizMode>(data.preferences.preferredQuizMode);
  const [error, setError] = useState('');
  const save = () => {
    const value = Number(goal);
    if (!Number.isInteger(value) || value < 5 || value > 100) {
      setError('Choose a whole number between 5 and 100.');
      return;
    }
    setError('');
    onSave({ dailyGoal: value, preferredQuizMode: mode });
  };
  const handleReset = () => {
    if (onReset()) {
      setGoal('15');
      setMode('multiple-choice');
      setError('');
    }
  };
  return <>
    <PageHeading eyebrow="MAKE IT YOURS" title="A study rhythm that fits." description="Choose a gentle daily target and decide how you like to check your recall." />
    <div className="settings-layout">
      <section className="panel settings-card"><div className="settings-title"><span className="settings-icon"><SlidersHorizontal size={18} /></span><div><h2>Study preferences</h2><p>Small defaults that make your sessions feel like yours.</p></div></div>
        <div className="settings-field"><div><strong>Daily review goal</strong><small>A friendly target for your dashboard progress.</small></div><div className="goal-input"><input aria-label="Daily review goal" type="number" min="5" max="100" step="1" value={goal} onChange={(event) => setGoal(event.target.value)} /><span>cards / day</span></div></div>
        <div className="settings-field quiz-setting"><div><strong>Default quiz style</strong><small>Choose the mode selected when you open a new quiz.</small></div><div className="settings-mode-select"><button className={mode === 'multiple-choice' ? 'selected' : ''} onClick={() => setMode('multiple-choice')}>Multiple choice</button><button className={mode === 'reveal' ? 'selected' : ''} onClick={() => setMode('reveal')}>Answer reveal</button></div></div>
        {error && <div className="settings-error" role="alert">{error}</div>}
        <div className="settings-save-row"><span><Check size={13} /> Preferences are saved locally.</span><button className="btn btn-primary" onClick={save}>Save preferences <Check size={14} /></button></div>
      </section>
      <aside className="panel settings-privacy"><div className="privacy-mark"><ShieldCheck size={20} /></div><h3>Your progress stays yours.</h3><p>Cards, reviews, quizzes, rewards and these preferences live in this browser’s LocalStorage. No account or paid API is involved.</p><div className="privacy-facts"><span><Database size={14} /> This device only</span><span><Sparkles size={14} /> Offline-friendly data</span></div></aside>
      <section className="panel reset-card"><div className="reset-symbol"><RotateCcw size={17} /></div><div className="reset-copy"><h3>Reset demo data</h3><p>Restore the four original subject decks and clear your saved study history, quizzes, points, badges and preferences. This cannot be undone.</p></div><button className="btn btn-danger btn-small" onClick={handleReset}>Reset to demo</button></section>
      <p className="settings-meta">CURRENT LIBRARY <strong>{data.cards.length} cards</strong><span>·</span><strong>{data.decks.length} decks</strong><span>·</span><strong>{data.points.toLocaleString()} points</strong></p>
    </div>
  </>;
}
