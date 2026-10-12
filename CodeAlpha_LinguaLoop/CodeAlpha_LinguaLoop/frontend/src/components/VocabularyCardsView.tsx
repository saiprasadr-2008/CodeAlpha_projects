import React, { useState, useEffect, useCallback } from 'react';
import type { CourseData, VocabularyCard } from '../types/language';
import type { CourseProgress } from '../services/storageService';
import { speechService } from '../services/speechService';
import {
  Volume2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Check,
  AlertCircle,
  Bookmark,
  Layers,
  Sparkles,
} from 'lucide-react';

interface VocabularyCardsViewProps {
  course: CourseData;
  progress: CourseProgress;
  onMarkWordMastery: (wordId: string, mastery: 'mastered' | 'weak') => void;
  onToggleBookmarkWord: (wordId: string) => void;
  targetSpeechCode: string;
}

export const VocabularyCardsView: React.FC<VocabularyCardsViewProps> = ({
  course,
  progress,
  onMarkWordMastery,
  onToggleBookmarkWord,
  targetSpeechCode,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'weak' | 'bookmarked'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Filtered vocabulary list
  const activeDeck: VocabularyCard[] = React.useMemo(() => {
    let list = [...course.vocabulary];

    if (filterMode === 'weak') {
      list = list.filter((w) => progress.weakWordIds.includes(w.id));
    } else if (filterMode === 'bookmarked') {
      list = list.filter((w) => progress.bookmarkedWordIds.includes(w.id));
    }

    return list;
  }, [course.vocabulary, filterMode, progress.weakWordIds, progress.bookmarkedWordIds]);

  // Reset index when deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [filterMode, course.id]);

  const currentCard = activeDeck[currentIndex] || null;

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
    speechService.playFlipSound();
  }, []);

  const handleNext = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeDeck.length);
  }, [activeDeck.length]);

  const handlePrev = useCallback(() => {
    if (activeDeck.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
  }, [activeDeck.length]);

  const handleShuffle = () => {
    if (activeDeck.length <= 1) return;
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * activeDeck.length);
    setCurrentIndex(randomIndex);
  };

  const handleMarkMastery = useCallback((mastery: 'mastered' | 'weak') => {
    if (!currentCard) return;
    onMarkWordMastery(currentCard.id, mastery);
    if (mastery === 'mastered') {
      speechService.playCorrectSound();
    } else {
      speechService.playWrongSound();
    }
    // Auto advance to next card
    setTimeout(() => {
      handleNext();
    }, 250);
  }, [currentCard, onMarkWordMastery, handleNext]);

  const handlePlayAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard) return;
    setIsPlayingAudio(true);
    await speechService.speak(
      currentCard.nativeScript || currentCard.targetText,
      targetSpeechCode
    );
    setIsPlayingAudio(false);
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input field
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === '1') {
        e.preventDefault();
        handleMarkMastery('weak');
      } else if (e.key === '2') {
        e.preventDefault();
        handleMarkMastery('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, handleMarkMastery]);

  const isCurrentMastered = currentCard ? progress.masteredWordIds.includes(currentCard.id) : false;
  const isCurrentWeak = currentCard ? progress.weakWordIds.includes(currentCard.id) : false;
  const isCurrentBookmarked = currentCard ? progress.bookmarkedWordIds.includes(currentCard.id) : false;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Deck Info and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Interactive Vocabulary Deck</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">Space</kbd> to flip, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">1</kbd> for Needs Practice, <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300">2</kbd> for Known
          </p>
        </div>

        {/* Filter Mode Selector */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start sm:self-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({course.vocabulary.length})
          </button>
          <button
            onClick={() => setFilterMode('weak')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              filterMode === 'weak'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Weak</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60">
              {progress.weakWordIds.length}
            </span>
          </button>
          <button
            onClick={() => setFilterMode('bookmarked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterMode === 'bookmarked'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bookmarked ({progress.bookmarkedWordIds.length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {activeDeck.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <Sparkles className="w-10 h-10 text-teal-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">No cards in this deck view</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filterMode === 'weak'
              ? 'Great work! You currently have no words tagged as needing practice.'
              : 'You have not bookmarked any words yet. Bookmark difficult words in lessons to review them here.'}
          </p>
          <button
            onClick={() => setFilterMode('all')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-md"
          >
            View All Vocabulary
          </button>
        </div>
      ) : (
        <>
          {/* Card Counter & Shuffle */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <span className="font-semibold text-slate-300">
              Card {currentIndex + 1} of {activeDeck.length}
            </span>
            <button
              onClick={handleShuffle}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition"
              title="Shuffle card deck"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle Deck</span>
            </button>
          </div>

          {/* 3D Flashcard Container */}
          <div
            onClick={handleFlip}
            className="perspective-1000 cursor-pointer select-none group min-h-[340px]"
          >
            <div
              className={`relative w-full min-h-[340px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-xl border ${
                isFlipped
                  ? 'rotate-y-180 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/40'
                  : 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* FRONT OF CARD */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Front Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {currentCard.partOfSpeech}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">
                      {currentCard.topic.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Audio Playback Button */}
                    <button
                      onClick={handlePlayAudio}
                      aria-label="Listen to pronunciation"
                      className={`p-2 rounded-xl border transition ${
                        isPlayingAudio
                          ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-teal-400 border-slate-700'
                      }`}
                      title="Listen to pronunciation (Web Speech API)"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmarkWord(currentCard.id);
                      }}
                      aria-label={isCurrentBookmarked ? 'Remove bookmark' : 'Bookmark word'}
                      className={`p-2 rounded-xl border transition ${
                        isCurrentBookmarked
                          ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                          : 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'
                      }`}
                      title={isCurrentBookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${isCurrentBookmarked ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Front Main Content */}
                <div className="text-center py-6 space-y-3">
                  {currentCard.nativeScript && (
                    <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide font-sans">
                      {currentCard.nativeScript}
                    </p>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-teal-300 tracking-tight">
                    {currentCard.targetText}
                  </h3>
                  <p className="text-sm font-mono text-indigo-300 bg-indigo-950/40 px-3 py-1 rounded-full inline-block">
                    🗣️ {currentCard.phonetic}
                  </p>
                </div>

                {/* Front Footer */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                  <span className="flex items-center gap-1.5">
                    {isCurrentMastered ? (
                      <span className="text-teal-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Mastered
                      </span>
                    ) : isCurrentWeak ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Needs Practice
                      </span>
                    ) : (
                      <span>Unseen / New</span>
                    )}
                  </span>
                  <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    Click card or press Space to reveal <RotateCw className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden rotate-y-180 ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Back Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Translation & Usage
                  </span>
                  <span className="text-xs text-slate-400">Card {currentIndex + 1}</span>
                </div>

                {/* Back Main Content */}
                <div className="text-center py-4 space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase font-semibold">Meaning</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      {currentCard.translation}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-left space-y-1">
                    <p className="text-xs font-semibold text-slate-200">
                      <strong className="text-teal-400">Ex:</strong> {currentCard.exampleTarget}
                    </p>
                    <p className="text-xs text-slate-400 italic">{currentCard.exampleTranslation}</p>
                  </div>

                  {currentCard.usageTip && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 text-left">
                      <span className="font-bold text-indigo-300">💡 Usage Tip: </span>
                      {currentCard.usageTip}
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="text-center text-xs text-slate-400 pt-3 border-t border-slate-800">
                  <span>Rate your recall below to organize review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recall Rating Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleMarkMastery('weak')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-sm transition"
              title="Tag as Needs Practice (Key: 1)"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Needs Practice [1]</span>
            </button>

            <button
              onClick={() => handleMarkMastery('mastered')}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-sm transition"
              title="Tag as Known / Mastered (Key: 2)"
            >
              <Check className="w-4 h-4 text-teal-400" />
              <span>Known / Mastered [2]</span>
            </button>
          </div>

          {/* Navigation Controls: Prev & Next */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={activeDeck.length <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold text-slate-400">
              {currentIndex + 1} / {activeDeck.length}
            </span>

            <button
              onClick={handleNext}
              disabled={activeDeck.length <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
