import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, BadgeCheck, BookOpen, Check, ChevronLeft, ChevronRight, CircleHelp, RotateCcw, Sparkles, Target, X } from 'lucide-react';
import type { Notice } from '../App';
import { EmptyState, PageHeading } from '../components/UI';
import type { AppData, Flashcard, QuizMode, QuizResult } from '../types';
import '../quiz.css';

type Props = { data: AppData; onSaveResult: (result: Omit<QuizResult, 'pointsAwarded'>) => void; notify: (message: string, tone?: Notice['tone']) => void };
type Choice = { id: string; text: string };
type AnswerState = Record<string, { correct: boolean; selected: string }>;
function randomId() { return `quiz-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`; }
function shuffled<T>(items: T[]): T[] { return [...items].sort(() => Math.random() - .5); }
function choicesFor(card: Flashcard, pool: Flashcard[]): Choice[] {
  const distractors = shuffled(pool.filter((item) => item.id !== card.id && item.answer !== card.answer)).slice(0, 3).map((item) => ({ id: item.id, text: item.answer }));
  return shuffled([{ id: card.id, text: card.answer }, ...distractors]);
}

export function QuizPage({ data, onSaveResult, notify }: Props) {
  const [deckId, setDeckId] = useState('all');
  const [mode, setMode] = useState<QuizMode>(data.preferences.preferredQuizMode);
  const [questionCount, setQuestionCount] = useState('10');
  const [phase, setPhase] = useState<'setup' | 'active' | 'results'>('setup');
  const [questions, setQuestions] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [selected, setSelected] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<Omit<QuizResult, 'pointsAwarded'> | null>(null);
  const [quizKey, setQuizKey] = useState('');
  const startTime = useRef(0);
  const sourceCards = data.cards.filter((card) => deckId === 'all' || card.deckId === deckId);
  const current = questions[index];
  const options = useMemo(() => current && mode === 'multiple-choice' ? choicesFor(current, data.cards.filter((card) => deckId === 'all' || card.deckId === deckId)) : [], [current, data.cards, deckId, mode]);
  const currentAnswers = current ? answers[current.id] : undefined;
  const percent = questions.length ? Math.round(index / questions.length * 100) : 0;
  const pointsShown = result ? result.score * 3 + (result.total > 0 && result.score === result.total ? 8 : 0) : 0;

  const start = (onlyIncorrect?: string[]) => {
    const candidates = onlyIncorrect ? data.cards.filter((card) => onlyIncorrect.includes(card.id)) : sourceCards;
    if (!candidates.length) {
      notify('This selection has no flashcards yet. Add cards in the library first.', 'error');
      return;
    }
    const count = onlyIncorrect ? candidates.length : questionCount === 'all' ? candidates.length : Math.min(Number(questionCount), candidates.length);
    setQuestions(shuffled(candidates).slice(0, count));
    setIndex(0);
    setAnswers({});
    setSelected('');
    setRevealed(false);
    setResult(null);
    const id = randomId();
    setQuizKey(id);
    startTime.current = Date.now();
    setPhase('active');
  };

  const submitChoice = () => {
    if (!current || !selected) return;
    const correct = selected === current.id;
    setAnswers((prev) => ({ ...prev, [current.id]: { correct, selected } }));
  };
  const markReveal = (correct: boolean) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: { correct, selected: correct ? current.id : 'missed' } }));
    setRevealed(true);
  };
  const advance = () => {
    if (!current || !currentAnswers) return;
    if (index < questions.length - 1) {
      setIndex((value) => value + 1);
      setSelected('');
      setRevealed(false);
      return;
    }
    const correctCardIds = questions.filter((item) => answers[item.id]?.correct || (item.id === current.id && currentAnswers.correct)).map((item) => item.id);
    const incorrectCardIds = questions.filter((item) => !(answers[item.id]?.correct || (item.id === current.id && currentAnswers.correct))).map((item) => item.id);
    const draft: Omit<QuizResult, 'pointsAwarded'> = {
      id: quizKey,
      completedAt: new Date().toISOString(),
      deckId,
      mode,
      score: correctCardIds.length,
      total: questions.length,
      correctCardIds,
      incorrectCardIds,
      durationSeconds: Math.max(1, Math.round((Date.now() - startTime.current) / 1000)),
    };
    onSaveResult(draft);
    setResult(draft);
    setPhase('results');
  };

  if (phase === 'setup') return <>
    <PageHeading eyebrow="RECALL CHECK" title="Test what sticks." description="A quick quiz turns familiar pages into knowledge you can actually retrieve." />
    <div className="quiz-setup-grid">
      <div className="panel quiz-setup-card"><div className="quiz-setup-title"><span className="quiz-icon"><Sparkles size={19} /></span><div><h2>Build a quick quiz</h2><p>Choose a deck and a way to check your recall.</p></div></div>
        <div className="input-wrap"><label htmlFor="quiz-deck">Choose a deck</label><select id="quiz-deck" className="select-control" value={deckId} onChange={(event) => setDeckId(event.target.value)}><option value="all">All decks · {data.cards.length} cards</option>{data.decks.map((deck) => <option key={deck.id} value={deck.id}>{deck.name} · {data.cards.filter((card) => card.deckId === deck.id).length} cards</option>)}</select></div>
        <div className="quiz-mode-label">HOW WOULD YOU LIKE TO ANSWER?</div><div className="quiz-mode-options">
          <button className={`quiz-mode-option ${mode === 'multiple-choice' ? 'selected' : ''}`} onClick={() => setMode('multiple-choice')}><span className="mode-icon"><CircleHelp size={16} /></span><span><strong>Multiple choice</strong><small>Pick the right answer from a few possibilities.</small></span><i className="radio-dot" /></button>
          <button className={`quiz-mode-option ${mode === 'reveal' ? 'selected' : ''}`} onClick={() => setMode('reveal')}><span className="mode-icon reveal-mode"><BookOpen size={16} /></span><span><strong>Answer reveal</strong><small>Think it through, then mark yourself honestly.</small></span><i className="radio-dot" /></button>
        </div>
        <div className="input-wrap"><label htmlFor="question-count">Questions</label><select id="question-count" className="select-control" value={questionCount} onChange={(event) => setQuestionCount(event.target.value)}><option value="5">5 questions</option><option value="10">10 questions</option><option value="15">15 questions</option><option value="all">Every card in this selection</option></select><span className="field-hint">A shorter set is a fine place to begin.</span></div>
        <button className="btn btn-primary quiz-start" onClick={() => start()} disabled={sourceCards.length === 0}>Start quiz <ArrowRight size={15} /></button>
        {sourceCards.length === 0 && <p className="field-error">This selection has no cards yet. Add a card or choose another deck.</p>}
      </div>
      <div className="panel quiz-note-panel"><div className="quiz-planet"><span>?</span><i /></div><div className="quiz-note-copy"><span className="preview-eyebrow">NO PRESSURE, JUST PRACTICE</span><h3>Remembering is the workout.</h3><p>Getting something wrong is useful information. See the explanation, learn from the miss, and retry just the questions that need another pass.</p><div className="quiz-fact-row"><span><Target size={14} /> Real results</span><span><RotateCcw size={14} /> Retry misses</span></div></div></div>
    </div>
  </>;

  if (phase === 'results' && result) {
    const accuracy = result.total ? Math.round(result.score / result.total * 100) : 0;
    const title = accuracy === 100 ? 'A perfect pass.' : accuracy >= 70 ? 'That knowledge is taking hold.' : 'Every miss is a useful clue.';
    return <>
      <PageHeading eyebrow="QUIZ COMPLETE" title={title} description="Your answers and explanations are saved with your learning history." actions={<button className="btn btn-secondary" onClick={() => { setPhase('setup'); setResult(null); }}>New quiz <RotateCcw size={14} /></button>} />
      <div className="quiz-result-card panel"><div className={`result-ring ${accuracy >= 70 ? 'ring-good' : ''}`} style={{ '--score': `${accuracy}%` } as CSSProperties}><div><strong>{accuracy}%</strong><small>accuracy</small></div></div><h2>{result.score} of {result.total} correct</h2><p>{accuracy === 100 ? 'You brought every answer back. Lovely work.' : `${result.incorrectCardIds.length} ${result.incorrectCardIds.length === 1 ? 'question needs' : 'questions need'} another look — that’s your next best step.`}</p><div className="result-chip-row"><span><BadgeCheck size={14} /> +{pointsShown} points</span><span><Check size={13} /> {result.score} correct</span><span><X size={13} /> {result.incorrectCardIds.length} to retry</span></div></div>
      {result.incorrectCardIds.length > 0 && <div className="retry-banner panel"><div><strong>Turn the missed ones into momentum.</strong><small>Start a focused round using only the {result.incorrectCardIds.length} questions you missed.</small></div><button className="btn btn-primary btn-small" onClick={() => start(result.incorrectCardIds)}><RotateCcw size={13} /> Retry misses</button></div>}
      <div className="panel quiz-review-panel section-gap"><div className="panel-head"><div><h2 className="panel-title">Answer review</h2><p className="panel-subtitle">Correct answers and their explanations</p></div></div><div className="quiz-review-list">{questions.map((item, i) => <div className="quiz-review-item" key={item.id}><span className={`review-index ${result.correctCardIds.includes(item.id) ? 'review-correct' : 'review-wrong'}`}>{result.correctCardIds.includes(item.id) ? <Check size={12} /> : <X size={12} />}</span><div><strong>{item.question}</strong><p>{item.answer}</p>{item.explanation && <small>{item.explanation}</small>}</div><span className="review-number">{String(i + 1).padStart(2, '0')}</span></div>)}</div></div>
    </>;
  }

  if (!current) return <div className="panel"><EmptyState title="No question in this quiz" description="Go back and choose a deck with cards." action={<button className="btn btn-primary" onClick={() => setPhase('setup')}>Quiz setup</button>} /></div>;
  const alreadyAnswered = Boolean(currentAnswers);
  const isCorrect = currentAnswers?.correct;
  const currentDeck = data.decks.find((deck) => deck.id === current.deckId)?.name ?? 'Your library';

  return <>
    <PageHeading eyebrow={mode === 'reveal' ? 'ANSWER REVEAL' : 'MULTIPLE CHOICE'} title="Trust your first thought." description="Pick the answer that feels right — the explanation is coming either way." actions={<button className="btn btn-quiet" onClick={() => { setPhase('setup'); setResult(null); }}><ChevronLeft size={14} /> Exit quiz</button>} />
    <div className="quiz-progress-meta"><span>{currentDeck}</span><span>Question <strong>{String(index + 1).padStart(2, '0')}</strong> <i>/</i> {String(questions.length).padStart(2, '0')}</span></div><div className="study-progress-line"><span style={{ width: `${percent}%` }} /></div>
    <article className="quiz-question panel"><div className="quiz-question-label"><span>QUESTION {String(index + 1).padStart(2, '0')}</span><span className={`difficulty-chip diff-${current.difficulty.toLowerCase()}`}>{current.difficulty}</span></div><h2>{current.question}</h2>
      {mode === 'multiple-choice' ? <div className="quiz-options">{options.map((option, optionIndex) => {
        const isChosen = selected === option.id;
        const isAnswer = option.id === current.id;
        const revealCorrect = alreadyAnswered && isAnswer;
        const revealWrong = alreadyAnswered && isChosen && !currentAnswers?.correct;
        return <button key={`${option.id}-${optionIndex}`} className={`quiz-option ${isChosen ? 'chosen' : ''} ${revealCorrect ? 'answer-correct' : ''} ${revealWrong ? 'answer-wrong' : ''}`} disabled={alreadyAnswered} onClick={() => setSelected(option.id)}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option.text}</span>{revealCorrect && <Check size={15} className="option-feedback" />}{revealWrong && <X size={15} className="option-feedback" />}</button>;
      })}</div> : <div className="reveal-answer-area">{!revealed ? <><div className="reveal-prompt"><span className="reveal-spark"><Sparkles size={15} /></span><p>Take a breath. Say the answer in your own words before you reveal it.</p></div><button className="btn btn-secondary" onClick={() => setRevealed(true)}>Reveal answer <ArrowRight size={14} /></button></> : <><div className="revealed-answer"><span>THE ANSWER</span><strong>{current.answer}</strong>{current.explanation && <p>{current.explanation}</p>}</div><div className="self-grade"><span>Did you get it?</span><div><button className="btn btn-secondary btn-small" onClick={() => markReveal(false)} disabled={alreadyAnswered}><X size={13} /> Not quite</button><button className="btn btn-primary btn-small" onClick={() => markReveal(true)} disabled={alreadyAnswered}><Check size={13} /> I got it</button></div></div></>}</div>}
      {alreadyAnswered && <div className={`quiz-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}><span>{isCorrect ? <Check size={15} /> : <CircleHelp size={15} />}</span><div><strong>{isCorrect ? 'That’s right.' : 'Not quite — now you know.'}</strong><p>{current.explanation ?? `The answer is: ${current.answer}`}</p></div></div>}
      {mode === 'multiple-choice' && !alreadyAnswered ? <button className="btn btn-primary quiz-submit" disabled={!selected} onClick={submitChoice}>Check answer <ArrowRight size={14} /></button> : alreadyAnswered && <button className="btn btn-primary quiz-submit" onClick={advance}>{index === questions.length - 1 ? 'See my results' : 'Next question'} <ChevronRight size={15} /></button>}
    </article>
    <div className="quiz-bottom-note"><span><Sparkles size={12} /> The point is progress, not perfection.</span><span>{Object.keys(answers).length} answered so far</span></div>
  </>;
}
