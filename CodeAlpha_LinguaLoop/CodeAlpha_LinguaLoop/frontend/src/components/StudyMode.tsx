import React, { useState, useEffect, useCallback } from 'react';
import type { Flashcard, Category } from '../types';
import { audioService } from '../services/audio';
import { EmptyState } from './EmptyState';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shuffle,
  CheckCircle2,
  XCircle,
  Eye,
  Keyboard,
  Filter,
} from 'lucide-react';

interface StudyModeProps {
  cards: Flashcard[];
  categories: Category[];
  initialCategory?: string;
  onUpdateMastery: (cardId: string, isCorrect: boolean) => void;
  onOpenAddModal: () => void;
  onRecordStudySession: (cardsCount: number) => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  cards,
  categories,
  initialCategory = 'all',
  onUpdateMastery,
  onOpenAddModal,
  onRecordStudySession,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shuffled, setShuffled] = useState<boolean>(false);
  const [deck, setDeck] = useState<Flashcard[]>([]);

  useEffect(() => {
    let filtered =
      selectedCategory === 'all'
        ? [...cards]
        : cards.filter((c) => c.category === selectedCategory);

    if (shuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    setDeck(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards, selectedCategory, shuffled]);

  useEffect(() => {
    if (cards.length > 0) {
      onRecordStudySession(cards.length);
    }
  }, []);

  const currentCard = deck[currentIndex];

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    audioService.playFlip();
  }, []);

  const handleNext = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    if (deck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + deck.length) % deck.length);
  }, [deck.length]);

  const handleGrade = (isCorrect: boolean) => {
    if (!currentCard) return;
    if (isCorrect) {
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }
    onUpdateMastery(currentCard.id, isCorrect);
    handleNext();
  };

  const toggleShuffle = () => {
    setShuffled((prev) => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleGrade(false);
      } else if (e.key === '2') {
        e.preventDefault();
        handleGrade(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, currentCard]);

  if (deck.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            All Categories ({cards.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <EmptyState
          title="No Flashcards Found"
          description={
            selectedCategory === 'all'
              ? 'You have no flashcards in your deck yet. Create your first card to begin studying!'
              : `No flashcards found under "${selectedCategory}". Add a card or select a different category.`
          }
          actionLabel="Add Flashcard"
          onAction={onOpenAddModal}
        />
      </div>
    );
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Hard':
        return 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  const getMasteryBadge = (mastery: string) => {
    switch (mastery) {
      case 'Mastered':
        return 'bg-emerald-500 text-white';
      case 'Learning':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-slate-400 text-white';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            All ({cards.length})
          </button>
          {categories.map((cat) => {
            const count = cards.filter((c) => c.category === cat.name).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={toggleShuffle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            shuffled
              ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
          }`}
        >
          <Shuffle className="w-3.5 h-3.5" />
          {shuffled ? 'Shuffled' : 'Shuffle'}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>
            Card <strong className="text-slate-900 dark:text-slate-100">{currentIndex + 1}</strong> of{' '}
            <strong className="text-slate-900 dark:text-slate-100">{deck.length}</strong>
          </span>
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
            {Math.round(((currentIndex + 1) / deck.length) * 100)}% Completed
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="perspective-1000 w-full min-h-[360px] cursor-pointer" onClick={handleFlip}>
        <div
          className={`relative w-full min-h-[360px] duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          <div className="absolute inset-0 w-full h-full backface-hidden bg-white dark:bg-slate-900 rounded-3xl p-8 border-2 border-indigo-100 dark:border-slate-800 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                  {currentCard.category}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                      currentCard.difficulty
                    )}`}
                  >
                    {currentCard.difficulty}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getMasteryBadge(
                      currentCard.mastery
                    )}`}
                  >
                    {currentCard.mastery}
                  </span>
                </div>
              </div>

              <div className="py-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-500 mb-2 block">
                  Question
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {currentCard.question}
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" />
                Click card or press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300">Space</kbd> to reveal answer
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">FRONT</span>
            </div>
          </div>

          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white rounded-3xl p-8 border-2 border-indigo-500/40 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/10">
                  {currentCard.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Answer Side
                </span>
              </div>

              <div className="py-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300 mb-2 block">
                  Answer
                </span>
                <p className="text-lg sm:text-xl font-medium leading-relaxed text-slate-100">
                  {currentCard.answer}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-indigo-200">
              <span>Rate your recall memory below</span>
              <span className="font-semibold text-amber-300">BACK</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrev}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleFlip}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4 animate-spin-once" />
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </button>

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleGrade(false)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-xs border border-rose-200 dark:border-rose-900 transition-all cursor-pointer"
            title="Mark as Needs Practice (Key: 1)"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            Needs Practice
          </button>

          <button
            onClick={() => handleGrade(true)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-900 transition-all cursor-pointer"
            title="Mark as Got it Right (Key: 2)"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Got it Right!
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-4">
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
          <Keyboard className="w-3.5 h-3.5 text-indigo-500" /> Shortcuts:
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            Space
          </kbd>{' '}
          Flip
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            ←
          </kbd>{' '}
          /{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            →
          </kbd>{' '}
          Prev / Next
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            1
          </kbd>{' '}
          Needs Practice
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
            2
          </kbd>{' '}
          Got it Right
        </span>
      </div>
    </div>
  );
};
