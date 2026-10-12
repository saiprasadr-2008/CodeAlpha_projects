import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { BookOpen, Check, ChevronDown, Clock3, Edit3, Layers3, Plus, Search, Trash2, X } from 'lucide-react';
import type { Notice } from '../App';
import { EmptyState, PageHeading } from '../components/UI';
import type { AppData, Deck, Difficulty, Flashcard } from '../types';
import '../library.css';

type Props = {
  data: AppData;
  subjects: string[];
  onAddCard: (card: Flashcard) => void;
  onUpdateCard: (card: Flashcard) => void;
  onDeleteCard: (id: string) => void;
  onAddDeck: (deck: Omit<Deck, 'id' | 'createdAt'>) => void;
  onUpdateDeck: (deck: Deck) => void;
  onDeleteDeck: (id: string) => void;
  notify: (message: string, tone?: Notice['tone']) => void;
};
const tones = ['violet', 'blue', 'mint', 'amber'];
const toneStyle: Record<string, { bg: string; text: string }> = { violet: { bg: 'rgba(161,140,255,.12)', text: '#baadff' }, blue: { bg: 'rgba(120,173,255,.12)', text: '#a4cbff' }, mint: { bg: 'rgba(137,222,181,.11)', text: '#9de7c5' }, amber: { bg: 'rgba(242,190,130,.11)', text: '#f1c18c' } };
function makeId() { return `card-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`}`; }

export function LibraryPage({ data, subjects, onAddCard, onUpdateCard, onDeleteCard, onAddDeck, onUpdateDeck, onDeleteDeck, notify }: Props) {
  const [tab, setTab] = useState<'cards' | 'decks'>('cards');
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [deckFilter, setDeckFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [editorCard, setEditorCard] = useState<Flashcard | null | undefined>(undefined);
  const [editorDeck, setEditorDeck] = useState<Deck | null | undefined>(undefined);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return data.cards.filter((card) => {
      const deck = data.decks.find((item) => item.id === card.deckId);
      const haystack = [card.question, card.answer, card.subject, card.explanation, deck?.name].filter(Boolean).join(' ').toLowerCase();
      return (!term || haystack.includes(term)) && (subjectFilter === 'all' || card.subject === subjectFilter) && (deckFilter === 'all' || card.deckId === deckFilter) && (difficultyFilter === 'all' || card.difficulty === difficultyFilter);
    });
  }, [data.cards, data.decks, query, subjectFilter, deckFilter, difficultyFilter]);

  const saveCard = (card: Flashcard, isEditing: boolean) => {
    if (isEditing) onUpdateCard(card); else onAddCard(card);
    setEditorCard(undefined);
  };
  const removeCard = (card: Flashcard) => {
    if (!window.confirm(`Delete this card? “${card.question.slice(0, 90)}”`)) return;
    onDeleteCard(card.id);
  };
  const removeDeck = (deck: Deck) => {
    const count = data.cards.filter((card) => card.deckId === deck.id).length;
    if (!window.confirm(`Delete “${deck.name}” and its ${count} ${count === 1 ? 'card' : 'cards'}? This cannot be undone.`)) return;
    onDeleteDeck(deck.id);
    if (deckFilter === deck.id) setDeckFilter('all');
  };
  const saveDeck = (values: { id?: string; name: string; subject: string; color: string }) => {
    if (values.id) {
      const existing = data.decks.find((deck) => deck.id === values.id);
      if (existing) onUpdateDeck({ ...existing, ...values, id: values.id });
    } else onAddDeck(values);
    setEditorDeck(undefined);
  };

  return <>
    <PageHeading eyebrow="YOUR COLLECTION" title="A library built around you." description="Shape your cards into subjects that make sense, then find the ones you need in a moment." actions={<><button className="btn btn-secondary" onClick={() => setEditorDeck(null)}><Layers3 size={14} /> New deck</button><button className="btn btn-primary" onClick={() => {
      if (!data.decks.length) { notify('Create a deck first so your card has a home.', 'error'); setEditorDeck(null); return; }
      setEditorCard(null);
    }}><Plus size={15} /> Add flashcard</button></>} />

    <div className="library-overview-grid">
      <div className="library-count panel"><div className="lib-overview-icon"><BookOpen size={16} /></div><div><span>FLASHCARDS</span><strong>{data.cards.length}</strong><small>{filtered.length} shown right now</small></div></div>
      <div className="library-count panel"><div className="lib-overview-icon lib-mint"><Layers3 size={16} /></div><div><span>DECKS</span><strong>{data.decks.length}</strong><small>Across {subjects.length} {subjects.length === 1 ? 'subject' : 'subjects'}</small></div></div>
      <div className="library-count panel"><div className="lib-overview-icon lib-amber"><Clock3 size={16} /></div><div><span>NEEDING A PASS</span><strong>{data.cards.filter((card) => new Date(card.nextReviewAt).getTime() <= Date.now()).length}</strong><small>Cards due for revision</small></div></div>
    </div>

    <section className="panel library-panel">
      <div className="library-tabs"><button className={tab === 'cards' ? 'selected' : ''} onClick={() => setTab('cards')}><BookOpen size={14} /> Flashcards <span>{data.cards.length}</span></button><button className={tab === 'decks' ? 'selected' : ''} onClick={() => setTab('decks')}><Layers3 size={14} /> Decks <span>{data.decks.length}</span></button><div className="library-tabs-spacer" />{tab === 'decks' && <button className="btn btn-secondary btn-small" onClick={() => setEditorDeck(null)}><Plus size={13} /> Create deck</button>}</div>
      {tab === 'cards' ? <>
        <div className="library-toolbar"><label className="toolbar-search"><Search size={15} /><input type="search" placeholder="Search questions, answers, subjects…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search flashcards" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={14} /></button>}</label><div className="filter-row"><label className="filter-select"><span>Subject</span><select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}><option value="all">All subjects</option>{subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select><ChevronDown size={12} /></label><label className="filter-select"><span>Deck</span><select value={deckFilter} onChange={(event) => setDeckFilter(event.target.value)}><option value="all">All decks</option>{data.decks.map((deck) => <option key={deck.id} value={deck.id}>{deck.name}</option>)}</select><ChevronDown size={12} /></label><label className="filter-select"><span>Level</span><select value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)}><option value="all">Any level</option><option>Easy</option><option>Medium</option><option>Hard</option></select><ChevronDown size={12} /></label></div></div>
        {filtered.length ? <div className="cards-list">{filtered.map((card) => <CardRow key={card.id} card={card} deck={data.decks.find((item) => item.id === card.deckId)} onEdit={() => setEditorCard(card)} onDelete={() => removeCard(card)} />)}</div> : <EmptyState title={data.cards.length ? 'No cards found' : 'Your first card is waiting'} description={data.cards.length ? 'Try another phrase or adjust your filters.' : 'Add a flashcard to begin building a library that fits you.'} action={data.cards.length ? <button className="btn btn-quiet btn-small" onClick={() => { setQuery(''); setSubjectFilter('all'); setDeckFilter('all'); setDifficultyFilter('all'); }}>Clear filters</button> : <button className="btn btn-primary btn-small" onClick={() => data.decks.length ? setEditorCard(null) : setEditorDeck(null)}><Plus size={13} /> {data.decks.length ? 'Create a card' : 'Create your first deck'}</button>} icon={<Search size={18} />} />}
      </> : <>
        {data.decks.length ? <div className="deck-grid">{data.decks.map((deck) => <DeckTile key={deck.id} deck={deck} count={data.cards.filter((card) => card.deckId === deck.id).length} onEdit={() => setEditorDeck(deck)} onDelete={() => removeDeck(deck)} onOpen={() => { setTab('cards'); setDeckFilter(deck.id); }} />)}</div> : <EmptyState title="Make a space for your ideas" description="Create a deck, give it a subject, and start adding cards." action={<button className="btn btn-primary btn-small" onClick={() => setEditorDeck(null)}><Plus size={13} /> Create deck</button>} icon={<Layers3 size={18} />} />}
      </>}
    </section>

    {editorCard !== undefined && <CardEditor key={editorCard?.id ?? 'new-card'} card={editorCard} decks={data.decks} subjects={subjects} onClose={() => setEditorCard(undefined)} onSave={saveCard} />}
    {editorDeck !== undefined && <DeckEditor key={editorDeck?.id ?? 'new-deck'} deck={editorDeck} onClose={() => setEditorDeck(undefined)} onSave={saveDeck} />}
  </>;
}

function CardRow({ card, deck, onEdit, onDelete }: { card: Flashcard; deck?: Deck; onEdit: () => void; onDelete: () => void }) {
  const due = new Date(card.nextReviewAt).getTime() <= Date.now();
  const tone = toneStyle[deck?.color ?? 'violet'] ?? toneStyle.violet;
  return <article className="library-card-row"><div className="card-subject-mark" style={{ background: tone.bg, color: tone.text }}>{card.subject.slice(0, 1).toUpperCase()}</div><div className="card-row-copy"><div className="card-row-meta"><span className="card-subject-label">{card.subject}</span><span className="meta-separator">·</span><span>{deck?.name ?? 'No deck'}</span><span className={`difficulty-chip diff-${card.difficulty.toLowerCase()}`}>{card.difficulty}</span></div><h3>{card.question}</h3><p>{card.answer}</p>{card.explanation && <small className="row-explanation">{card.explanation}</small>}<div className="card-row-footer"><span className={due ? 'due-status' : 'scheduled-status'}>{due ? <><span className="due-indicator" /> Due now</> : <><Check size={10} /> Review {new Date(card.nextReviewAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</>}</span><span>{card.reviewLog.length} {card.reviewLog.length === 1 ? 'review' : 'reviews'}</span></div></div><div className="row-actions"><button className="icon-button" onClick={onEdit} aria-label="Edit card"><Edit3 size={14} /></button><button className="icon-button delete-action" onClick={onDelete} aria-label="Delete card"><Trash2 size={14} /></button></div></article>;
}

function DeckTile({ deck, count, onEdit, onDelete, onOpen }: { deck: Deck; count: number; onEdit: () => void; onDelete: () => void; onOpen: () => void }) {
  const tone = toneStyle[deck.color] ?? toneStyle.violet;
  return <article className="deck-tile panel"><div className="deck-tile-top"><span className="deck-tile-icon" style={{ color: tone.text, background: tone.bg }}><Layers3 size={17} /></span><div className="deck-actions"><button className="icon-button" onClick={onEdit} aria-label={`Edit ${deck.name}`}><Edit3 size={13} /></button><button className="icon-button delete-action" onClick={onDelete} aria-label={`Delete ${deck.name}`}><Trash2 size={13} /></button></div></div><span className="deck-subject">{deck.subject}</span><h3>{deck.name}</h3><div className="deck-tile-footer"><span><BookOpen size={12} /> {count} {count === 1 ? 'card' : 'cards'}</span><button className="panel-action" onClick={onOpen}>Open <ChevronDown size={13} style={{ transform: 'rotate(-90deg)' }} /></button></div><div className={`deck-accent deck-accent-${deck.color}`} /></article>;
}

function CardEditor({ card, decks, subjects, onClose, onSave }: { card: Flashcard | null; decks: Deck[]; subjects: string[]; onClose: () => void; onSave: (card: Flashcard, isEditing: boolean) => void }) {
  const [question, setQuestion] = useState(card?.question ?? '');
  const [answer, setAnswer] = useState(card?.answer ?? '');
  const [subject, setSubject] = useState(card?.subject ?? decks[0]?.subject ?? '');
  const [deckId, setDeckId] = useState(card?.deckId ?? decks[0]?.id ?? '');
  const [difficulty, setDifficulty] = useState<Difficulty>(card?.difficulty ?? 'Medium');
  const [explanation, setExplanation] = useState(card?.explanation ?? '');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim() || !answer.trim() || !subject.trim() || !deckId) { setError('Add a question, answer, subject, and deck to save this card.'); return; }
    const value: Flashcard = card ? { ...card, question: question.trim(), answer: answer.trim(), subject: subject.trim(), deckId, difficulty, explanation: explanation.trim() || undefined } : {
      id: makeId(), deckId, question: question.trim(), answer: answer.trim(), subject: subject.trim(), difficulty, explanation: explanation.trim() || undefined,
      createdAt: new Date().toISOString(), nextReviewAt: new Date().toISOString(), intervalDays: 0, easeFactor: 2.5, repetitions: 0, lapses: 0, reviewLog: [],
    };
    onSave(value, Boolean(card));
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="card-editor-title"><div className="modal-head"><div><h2 id="card-editor-title">{card ? 'Edit flashcard' : 'Create a flashcard'}</h2><p>Keep the prompt focused. You can change it whenever you like.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X size={15} /></button></div><form className="modal-body" onSubmit={submit}>
    <div className="input-wrap"><label htmlFor="card-question">Question <span className="required-star">*</span></label><textarea id="card-question" autoFocus maxLength={400} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What do you want to remember?" /></div>
    <div className="input-wrap"><label htmlFor="card-answer">Answer <span className="required-star">*</span></label><textarea id="card-answer" maxLength={900} value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="The key idea, in your own words…" /></div>
    <div className="form-grid"><div className="input-wrap"><label htmlFor="card-subject">Subject <span className="required-star">*</span></label><input id="card-subject" list="subject-options" maxLength={50} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Biology" /><datalist id="subject-options">{subjects.map((item) => <option key={item} value={item} />)}</datalist></div><div className="input-wrap"><label htmlFor="card-deck">Deck <span className="required-star">*</span></label><select id="card-deck" value={deckId} onChange={(event) => setDeckId(event.target.value)} required>{decks.map((deck) => <option value={deck.id} key={deck.id}>{deck.name}</option>)}</select></div><div className="input-wrap"><label htmlFor="card-difficulty">Difficulty</label><select id="card-difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}><option>Easy</option><option>Medium</option><option>Hard</option></select></div><div className="input-wrap"><label htmlFor="card-explanation">Explanation <span className="optional-label">OPTIONAL</span></label><input id="card-explanation" maxLength={300} value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="A helpful hint or memory cue" /></div></div>
    {error && <div className="form-error-message"><X size={13} />{error}</div>}{!decks.length && <div className="form-error-message">Create a deck before adding flashcards.</div>}
    <div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary" disabled={!decks.length}>{card ? 'Save changes' : 'Add flashcard'} <Check size={14} /></button></div>
  </form></div></div>;
}

function DeckEditor({ deck, onClose, onSave }: { deck: Deck | null; onClose: () => void; onSave: (deck: { id?: string; name: string; subject: string; color: string }) => void }) {
  const [name, setName] = useState(deck?.name ?? '');
  const [subject, setSubject] = useState(deck?.subject ?? '');
  const [color, setColor] = useState(deck?.color ?? 'violet');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !subject.trim()) { setError('Give your deck a name and subject.'); return; }
    onSave({ ...(deck ? { id: deck.id } : {}), name: name.trim(), subject: subject.trim(), color });
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal deck-modal" role="dialog" aria-modal="true" aria-labelledby="deck-editor-title"><div className="modal-head"><div><h2 id="deck-editor-title">{deck ? 'Edit deck' : 'Create a deck'}</h2><p>A good deck gives related ideas a place to grow.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X size={15} /></button></div><form className="modal-body" onSubmit={submit}><div className="input-wrap"><label htmlFor="deck-name">Deck name <span className="required-star">*</span></label><input id="deck-name" autoFocus maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Cell biology basics" /></div><div className="input-wrap"><label htmlFor="deck-subject">Subject <span className="required-star">*</span></label><input id="deck-subject" maxLength={50} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Biology" /></div><div className="input-wrap"><label>Deck accent</label><div className="color-picker">{tones.map((tone) => <button type="button" key={tone} className={`color-choice color-${tone} ${tone === color ? 'selected' : ''}`} aria-label={`${tone} accent`} aria-pressed={tone === color} onClick={() => setColor(tone)}>{tone === color && <Check size={13} />}</button>)}</div></div>{error && <div className="form-error-message"><X size={13} />{error}</div>}<div className="form-actions"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary">{deck ? 'Save deck' : 'Create deck'} <Check size={14} /></button></div></form></div></div>;
}
