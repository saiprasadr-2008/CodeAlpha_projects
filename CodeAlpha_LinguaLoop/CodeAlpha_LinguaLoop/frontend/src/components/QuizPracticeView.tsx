import React, { useState } from 'react';
import type { CourseData, QuizQuestion, MatchingPair } from '../types/language';
import type { CourseProgress } from '../services/storageService';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Layers,
} from 'lucide-react';

interface QuizPracticeViewProps {
  course: CourseData;
  progress: CourseProgress;
  onSaveQuizResult: (courseId: string, topic: string, score: number, total: number) => void;
  onNavigateTab: (tab: 'vocabulary' | 'lessons') => void;
}

export const QuizPracticeView: React.FC<QuizPracticeViewProps> = ({
  course,
  progress,
  onSaveQuizResult,
  onNavigateTab,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userSelectedAnswer, setUserSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);

  // State for Translation Matching Questions
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [matchingError, setMatchingError] = useState<boolean>(false);

  // Start or restart quiz
  const handleStartQuiz = React.useCallback((topicFilter: string = selectedTopic) => {
    let pool = [...course.quizzes];
    if (topicFilter !== 'all') {
      pool = pool.filter((q) => q.topic === topicFilter);
    }
    if (pool.length === 0) {
      pool = [...course.quizzes]; // fallback if topic has no specific quizzes
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setActiveQuizQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setUserSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsQuizCompleted(false);
    setSelectedLeftId(null);
    setMatchedPairIds([]);
  }, [course.quizzes, selectedTopic]);

  // Launch initial quiz when view loads or topic changes
  React.useEffect(() => {
    handleStartQuiz(selectedTopic);
  }, [course.id, selectedTopic, handleStartQuiz]);

  const currentQuestion: QuizQuestion | undefined = activeQuizQuestions[currentIndex];

  // Submit answer for Multiple Choice or Fill in the blank
  const handleSubmitChoice = (choice: string) => {
    if (isAnswerSubmitted || !currentQuestion) return;

    setUserSelectedAnswer(choice);
    setIsAnswerSubmitted(true);

    const isCorrect = choice.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase();
    setIsCurrentCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      speechService.playCorrectSound();
    } else {
      speechService.playWrongSound();
    }
  };

  // Handle Matching logic
  const handleLeftMatchClick = (id: string) => {
    if (matchedPairIds.includes(id)) return;
    setSelectedLeftId(id);
    setMatchingError(false);
  };

  const handleRightMatchClick = (pair: MatchingPair) => {
    if (matchedPairIds.includes(pair.id) || !selectedLeftId) return;

    if (selectedLeftId === pair.id) {
      // Correct pair match!
      speechService.playCorrectSound();
      const updated = [...matchedPairIds, pair.id];
      setMatchedPairIds(updated);
      setSelectedLeftId(null);

      // Check if all pairs matched
      const totalPairs = currentQuestion?.matchingPairs?.length || 0;
      if (updated.length >= totalPairs) {
        setIsAnswerSubmitted(true);
        setIsCurrentCorrect(true);
        setScore((prev) => prev + 1);
      }
    } else {
      // Incorrect match
      speechService.playWrongSound();
      setMatchingError(true);
      setTimeout(() => setMatchingError(false), 800);
    }
  };

  // Next question or complete quiz
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuizQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setIsCurrentCorrect(false);
      setSelectedLeftId(null);
      setMatchedPairIds([]);
    } else {
      // Finish Quiz
      setIsQuizCompleted(true);
      const finalScore = score + (isCurrentCorrect ? 1 : 0);
      onSaveQuizResult(course.id, selectedTopic, finalScore, activeQuizQuestions.length);

      speechService.playCompletionFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  if (!currentQuestion && !isQuizCompleted) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
        <p className="text-slate-400">Loading quiz questions...</p>
      </div>
    );
  }

  // RESULTS SCREEN
  if (isQuizCompleted) {
    const totalQ = activeQuizQuestions.length || 1;
    const finalPercentage = Math.round((score / totalQ) * 100);
    const passed = finalPercentage >= 70;

    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <Trophy className="w-10 h-10 text-white" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-white">Quiz Challenge Completed!</h2>
          <p className="text-sm text-slate-400 mt-1">
            {passed
              ? 'Outstanding performance! You have demonstrated strong comprehension.'
              : 'Good effort! Review the explanations and practice difficult items.'}
          </p>
        </div>

        {/* Score Card */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-medium">Final Score</span>
            <span className="text-3xl font-extrabold text-teal-300 mt-1 block">
              {score} / {totalQ}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <span className="text-xs text-slate-400 block font-medium">Accuracy</span>
            <span
              className={`text-3xl font-extrabold mt-1 block ${
                passed ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {finalPercentage}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => handleStartQuiz()}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 text-white font-bold text-sm hover:from-indigo-500 hover:to-teal-400 transition shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry This Quiz</span>
          </button>

          <button
            onClick={() => onNavigateTab('vocabulary')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Practice Weak Words ({progress.weakWordIds.length})</span>
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE QUIZ INTERFACE
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Topics Selector Pill Bar */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <span className="text-xs text-slate-400 font-semibold mr-1">Quiz Mode:</span>
        <button
          onClick={() => setSelectedTopic('all')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
            selectedTopic === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Topics
        </button>
        {['introductions', 'shopping', 'food', 'travel', 'job_interview'].map((top) => (
          <button
            key={top}
            onClick={() => setSelectedTopic(top)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition ${
              selectedTopic === top
                ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {top.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Quiz Progress & Question Status */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-1 rounded-lg border border-indigo-500/30 uppercase tracking-wider">
            {currentQuestion.type.replace('_', ' ')}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            Topic: {currentQuestion.topic.replace('_', ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span>Question {currentIndex + 1} of {activeQuizQuestions.length}</span>
          <span className="text-teal-400 font-bold">• Score: {score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / activeQuizQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQuestion.prompt}
          </h3>

          {/* Fill in the blank sentence */}
          {currentQuestion.sentenceWithBlank && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center">
              <p className="text-xl sm:text-2xl font-bold text-teal-300 tracking-wide">
                {currentQuestion.sentenceWithBlank}
              </p>
            </div>
          )}
        </div>

        {/* 1. MULTIPLE CHOICE OR FILL BLANK OPTIONS */}
        {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'fill_blank') && (
          <div className="space-y-3">
            {(currentQuestion.options || currentQuestion.blankOptions || []).map((option, idx) => {
              const isSelected = userSelectedAnswer === option;
              const isTargetCorrect =
                option.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase();

              let buttonStyle = 'bg-slate-800/70 border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-indigo-500';

              if (isAnswerSubmitted) {
                if (isTargetCorrect) {
                  buttonStyle = 'bg-teal-500/20 border-teal-500 text-teal-200 font-bold ring-1 ring-teal-500';
                } else if (isSelected) {
                  buttonStyle = 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold';
                } else {
                  buttonStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={`${option}-${idx}`}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSubmitChoice(option)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-sm font-semibold transition text-left ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {isAnswerSubmitted && isTargetCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isTargetCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. MATCHING PAIRS EXERCISE */}
        {currentQuestion.type === 'matching' && currentQuestion.matchingPairs && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Click a word on the left, then click its corresponding match on the right.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {/* Left Column (Target Language) */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                  Target Term
                </span>
                {currentQuestion.matchingPairs.map((pair) => {
                  const isMatched = matchedPairIds.includes(pair.id);
                  const isSelected = selectedLeftId === pair.id;

                  return (
                    <button
                      key={`left-${pair.id}`}
                      disabled={isMatched}
                      onClick={() => handleLeftMatchClick(pair.id)}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
                        isMatched
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 opacity-70 line-through'
                          : isSelected
                          ? 'bg-indigo-600 border-indigo-400 text-white font-bold ring-2 ring-indigo-400'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {pair.left}
                    </button>
                  );
                })}
              </div>

              {/* Right Column (Translations) */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
                  Translation
                </span>
                {/* Randomize right column display */}
                {currentQuestion.matchingPairs.map((pair) => {
                  const isMatched = matchedPairIds.includes(pair.id);

                  return (
                    <button
                      key={`right-${pair.id}`}
                      disabled={isMatched || !selectedLeftId}
                      onClick={() => handleRightMatchClick(pair)}
                      className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-semibold transition text-left ${
                        isMatched
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300 opacity-70 line-through'
                          : matchingError && selectedLeftId === pair.id
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 animate-shake'
                          : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-teal-500'
                      }`}
                    >
                      {pair.right}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK & EXPLANATION BANNER */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-2xl border space-y-1.5 animate-fadeIn ${
              isCurrentCorrect
                ? 'bg-teal-950/40 border-teal-500/40 text-teal-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {isCurrentCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-teal-400" />
                  <span>Correct! Well done.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>Not quite. Let us review:</span>
                </>
              )}
            </div>
            <p className="text-xs leading-relaxed opacity-90 pl-7">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Question / Continue Button */}
        {isAnswerSubmitted && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-md transition"
            >
              <span>{currentIndex + 1 < activeQuizQuestions.length ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
