import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, CircleCheck, Clock3, Eye, EyeOff, Info, Layers3, RotateCcw, Sparkles } from 'lucide-react';
import type { Notice } from '../App';
import { EmptyState, PageHeading } from '../components/UI';
import { isDue } from '../lib/algorithms';
import type { AppData, Flashcard, Rating } from '../types';
import '../study.css';

type ReviewChoice = { cardId: string; rating: Rating };
type Props = { data: AppData; onFinish: (id: string, ratings: ReviewChoice[], minutes: number) => void; notify: (message: string, tone?: Notice['tone']) => void };
const confidence: { id: Rating; caption: string; tone: string; detail: string }[] = [
  { id: 'Again', caption: 'Again', tone: 'again', detail: 'Reset · 1 day' },
  { id: 'Hard', caption: 'Hard', tone: 'hard', detail: 'Short interval' },
  { id: 'Good', caption: 'Good', tone: 'good', detail: 'Standard interval' },
  { id: 'Easy', caption: 'Easy', tone: 'easy', detail: 'Longer interval' },
];
function newSessionId() { return `study-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`; }

export function StudyPage({ data, onFinish, notify }: Props) {
  const [deckId, setDeckId] = useState('all');
  const [dueOnly, setDueOnly] = useState(true);
  const [queue, setQueue] = useState<Flashcard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [finished, setFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState('');
  const startedAt = useRef(0);
  const baseCards = data.cards.filter((card) => deckId === 'all' || card.deckId === deckId);
  const dueCards = baseCards.filter((card) => isDue(card));
  const activeQueue = queue ?? [];
  const card = activeQueue[index];
  const currentRating = card ? ratings[card.id] : undefined;
  const answeredCount = activeQueue.filter((item) => ratings[item.id]).length;
  const canFinish = activeQueue.length > 0 && answeredCount === activeQueue.length;
  const progress = activeQueue.length ? Math.round((answeredCount / activeQueue.length) * 100) : 0;
  const projectedPoints = 15 + activeQueue.length * 5;
  const currentDue = dueCards.length;

  const startSession = (all = !dueOnly) => {
    let selected = baseCards.filter((item) => !all ? isDue(item) : true);
    if (!selected.length && !all) {
      notify('No cards are due in this deck. Switch to All cards for an extra review.', 'error');
      return;
    }
    selected = [...selected].sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
    if (!selected.length) {
      notify('This deck does not have any cards yet. Add a few in your library first.', 'error');
      return;
    }
    setQueue(selected);
    setIndex(0);
    setRevealed(false);
    setRatings({});
    setFinished(false);
    const key = newSessionId();
    setSessionKey(key);
    startedAt.current = Date.now();
  };

  const navigate = (delta: number) => {
    setIndex((current) => Math.max(0, Math.min(activeQueue.length - 1, current + delta)));
    setRevealed(false);
  };
  const rateCard = (rating: Rating) => {
    if (!card) return;
    setRatings((current) => ({ ...current, [card.id]: rating }));
    setRevealed(true);
  };
  const complete = () => {
    if (!canFinish) {
      notify(`Rate all ${activeQueue.length} cards to finish your session.`, 'error');
      return;
    }
    onFinish(sessionKey, Object.entries(ratings).map(([cardId, rating]) => ({ cardId, rating })), (Date.now() - startedAt.current) / 60_000);
    setFinished(true);
  };
  const restart = () => { setQueue(null); setRatings({}); setIndex(0); setRevealed(false); setFinished(false); };

  if (finished) return <>
    <PageHeading eyebrow="SESSION COMPLETE" title="You showed up for yourself." description="A few minutes of focused recall make the next session easier." />
    <div className="completion-card panel"><div className="completion-orbit"><CircleCheck size={35} /></div><div className="completion-kicker">STUDY SESSION SAVED</div><h2>{activeQueue.length} {activeQueue.length === 1 ? 'card' : 'cards'} reviewed</h2><p>Your confidence ratings are already shaping what you’ll see next.</p><div className="completion-stats"><div><Sparkles size={16} /><strong>+{projectedPoints}</strong><small>points earned</small></div><div><Clock3 size={16} /><strong>{Math.max(1, Math.round((Date.now() - startedAt.current) / 60_000))} min</strong><small>in the zone</small></div><div><Check size={16} /><strong>{answeredCount}/{activeQueue.length}</strong><small>rated honestly</small></div></div><div className="completion-actions"><button className="btn btn-primary" onClick={restart}><RotateCcw size={14} /> Start another session</button><button className="btn btn-secondary" onClick={() => notify('Your study session is safely saved.')}>Keep this win</button></div></div>
  </>;

  if (!queue) return <>
    <PageHeading eyebrow="ACTIVE RECALL" title="A moment for your memory" description="Turn what you know into something you can bring back, right on cue." />
    <div className="study-setup-grid">
      <div className="panel study-setup-card"><div className="setup-icon"><BookOpen size={21} /></div><h2>Shape this session</h2><p>Choose where to focus. Ratings will schedule your next revision automatically.</p>
        <label className="setup-label" htmlFor="study-deck">DECK</label><div className="select-shell"><Layers3 size={15} /><select id="study-deck" value={deckId} onChange={(event) => setDeckId(event.target.value)}><option value="all">All decks · {data.cards.length} cards</option>{data.decks.map((deck) => <option value={deck.id} key={deck.id}>{deck.name} · {data.cards.filter((item) => item.deckId === deck.id).length} cards</option>)}</select></div>
        <div className="study-choice-row"><div><strong>Start with cards due now</strong><span>{currentDue} ready to revisit</span></div><button className={`switch ${dueOnly ? 'on' : ''}`} role="switch" aria-checked={dueOnly} aria-label="Study due cards only" onClick={() => setDueOnly((value) => !value)}><i /></button></div>
        <button className="btn btn-primary setup-start" onClick={() => startSession(!dueOnly)}><BookOpen size={15} /> Begin study session <ArrowRight size={15} /></button>
        <div className="schedule-note"><Info size={14} /><span>Again resets a card to tomorrow; Good and Easy gently lengthen its interval. Your review schedule stays on this device.</span></div>
      </div>
      <div className="panel study-preview"><div className="preview-orb"><span>Q</span><i /></div><span className="preview-eyebrow">A SMALL PROMISE TO FUTURE YOU</span><h3>First, try to remember.</h3><p>Retrieving an answer before you reveal it helps strengthen the memory. Take your time — there’s no clock to beat.</p><div className="preview-footer"><span><span className="mini-dot" /> {dueCards.length} due in selected deck</span><span>01 <i /> 04</span></div></div>
    </div>
    {data.cards.length === 0 && <div className="panel section-gap"><EmptyState title="Your study space is ready" description="Add your first cards to the library, then come back here to review." action={<button className="btn btn-secondary" onClick={() => notify('Open the library from the sidebar to add cards.')}><ArrowLeft size={14} /> Explore library</button>} /></div>}
  </>;

  if (!card) return <div className="panel"><EmptyState title="Nothing in this session" description="Start a new session to choose cards to review." action={<button className="btn btn-primary" onClick={restart}>Set up a session</button>} /></div>;

  return <>
    <PageHeading eyebrow="ACTIVE RECALL" title="Give it a moment." description="Try to bring the answer to mind before you turn the card." actions={<button className="btn btn-quiet" onClick={restart}><ArrowLeft size={14} /> End session</button>} />
    <div className="study-toolbar"><div className="study-deck-meta"><span className="deck-chip"><Layers3 size={12} /> {data.decks.find((deck) => deck.id === card.deckId)?.name ?? 'Custom deck'}</span><span className={`difficulty-chip diff-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span></div><div className="study-counter"><span>{index + 1}</span><i>/</i>{activeQueue.length} <span className="counter-divider" /> <span className="rated-pill"><Check size={11} /> {answeredCount} rated</span></div></div>
    <div className="study-progress-line"><span style={{ width: `${progress}%` }} /></div>
    <article className={`flashcard panel ${revealed ? 'is-revealed' : ''}`}>
      <div className="card-side-label"><span>{revealed ? <EyeOff size={13} /> : <Eye size={13} />}{revealed ? 'THE ANSWER' : 'QUESTION'}</span><span>{card.subject}</span></div>
      <div className="flashcard-content"><div className="question-mark">“</div><h2>{revealed ? card.answer : card.question}</h2>{revealed && card.explanation && <div className="explanation-box"><span className="explanation-icon"><Info size={14} /></span><p>{card.explanation}</p></div>}</div>
      {!revealed ? <button className="btn btn-reveal" onClick={() => setRevealed(true)}><Eye size={15} /> Show answer</button> : <div className="confidence-box"><div className="confidence-heading"><span>How well did you know it?</span><small>BE HONEST — IT HELPS</small></div><div className="confidence-grid">{confidence.map((choice) => <button key={choice.id} className={`confidence-choice ${choice.tone} ${currentRating === choice.id ? 'selected' : ''}`} onClick={() => rateCard(choice.id)}><span className="choice-dot" /><strong>{choice.caption}</strong><small>{choice.detail}</small></button>)}</div></div>}
      <div className="flashcard-footer"><button className="btn btn-quiet btn-small" onClick={() => navigate(-1)} disabled={index === 0}><ChevronLeft size={15} /> Previous</button>{index === activeQueue.length - 1 ? <button className="btn btn-primary btn-small" onClick={complete} disabled={!canFinish}>Complete session <Check size={14} /></button> : <button className="btn btn-secondary btn-small" onClick={() => navigate(1)}>Next <ChevronRight size={15} /></button>}</div>
    </article>
    <div className="study-bottom-hint"><span><Info size={12} /> {currentRating ? `Marked ${currentRating.toLowerCase()} · tap a different rating to change it.` : 'Choose a rating to schedule the next review.'}</span><span>{activeQueue.length - answeredCount} left to rate</span></div>
  </>;
}
