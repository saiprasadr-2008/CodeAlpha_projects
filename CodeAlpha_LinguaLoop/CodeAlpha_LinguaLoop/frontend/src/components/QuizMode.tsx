import React, { useState, useEffect } from 'react';
import type { Flashcard, Category, QuizConfig, QuizQuestion, QuizResult } from '../types';
import { audioService } from '../services/audio';
import confetti from 'canvas-confetti';
import { EmptyState } from './EmptyState';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';

interface QuizModeProps {
  cards: Flashcard[];
  categories: Category[];
  onSaveQuizResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
  onNavigateDashboard: () => void;
  onOpenAddModal: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  cards,
  categories,
  onSaveQuizResult,
  onNavigateDashboard,
  onOpenAddModal,
}) => {
  const [quizState, setQuizState] = useState<'setup' | 'running' | 'completed'>('setup');

  const [config, setConfig] = useState<QuizConfig>({
    category: 'all',
    questionCount: 5,
    mode: 'multiple-choice',
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const [showRecallAnswer, setShowRecallAnswer] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  const startQuiz = () => {
    let eligibleCards =
      config.category === 'all'
        ? [...cards]
        : cards.filter((c) => c.category === config.category);

    if (eligibleCards.length === 0) return;

    const shuffledCards = [...eligibleCards].sort(() => Math.random() - 0.5);
    const count = Math.min(config.questionCount, shuffledCards.length);
    const selectedCards = shuffledCards.slice(0, count);

    const quizQuestions: QuizQuestion[] = selectedCards.map((card) => {
      const otherCards = cards.filter((c) => c.id !== card.id);
      const shuffledOthers = [...otherCards].sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3).map((c) => c.answer);

      const allOptions = [...distractors, card.answer].sort(() => Math.random() - 0.5);

      return {
        card,
        options: allOptions,
        correctAnswer: card.answer,
      };
    });

    setQuestions(quizQuestions);
    setCurrentIdx(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setShowRecallAnswer(false);
    setTimerSeconds(0);
    setQuizState('running');

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmitOption = () => {
    if (!selectedOption || isAnswerSubmitted) return;

    const currentQuestion = questions[currentIdx];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    setIsAnswerSubmitted(true);
    setUserAnswers((prev) => [...prev, selectedOption]);
  };

  const handleSelfGrade = (isCorrect: boolean) => {
    const currentQuestion = questions[currentIdx];
    const answerGiven = isCorrect ? currentQuestion.correctAnswer : '__incorrect__';

    if (isCorrect) {
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    setUserAnswers((prev) => [...prev, answerGiven]);
    advanceQuestion();
  };

  const advanceQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setShowRecallAnswer(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (timerInterval) clearInterval(timerInterval);

    const correctCount = userAnswers.reduce((acc, ans, idx) => {
      return ans === questions[idx].correctAnswer ? acc + 1 : acc;
    }, 0);

    const scorePct = Math.round((correctCount / questions.length) * 100);

    if (scorePct >= 70) {
      audioService.playCompletion();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti fail:', e);
      }
    }

    onSaveQuizResult({
      category: config.category,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      scorePercentage: scorePct,
      timeSpentSeconds: timerSeconds,
      mode: config.mode,
    });

    setQuizState('completed');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (cards.length < 2) {
    return (
      <EmptyState
        title="Not Enough Flashcards for Quiz"
        description="You need at least 2 flashcards in your deck to launch quiz mode. Create more flashcards to unlock tests."
        actionLabel="Create Flashcards"
        onAction={onOpenAddModal}
        iconType="quiz"
      />
    );
  }

  if (quizState === 'setup') {
    const eligibleCount =
      config.category === 'all'
        ? cards.length
        : cards.filter((c) => c.category === config.category).length;

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Knowledge Quiz Challenge
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your subject, question count, and test mode.
              </p>
            </div>
          </div>

          <div className="space-y-5 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Select Subject / Category
              </label>
              <select
                value={config.category}
                onChange={(e) => setConfig({ ...config, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Categories ({cards.length} Total Cards)</option>
                {categories.map((cat) => {
                  const count = cards.filter((c) => c.category === cat.name).length;
                  return (
                    <option key={cat.id} value={cat.name}>
                      {cat.name} ({count} Cards)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setConfig({ ...config, questionCount: num })}
                    className={`py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                      config.questionCount === num
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num} Cards
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Quiz Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig({ ...config, mode: 'multiple-choice' })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    config.mode === 'multiple-choice'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-sm block">Multiple Choice</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                    Choose correct answer from 4 generated choices.
                  </span>
                </button>

                <button
                  onClick={() => setConfig({ ...config, mode: 'self-grade' })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    config.mode === 'self-grade'
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <span className="font-bold text-sm block">Self-Graded Recall</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                    Recall answer in mind, flip to verify, and rate yourself.
                  </span>
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            disabled={eligibleCount === 0}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base shadow-lg transition-all active:scale-98 cursor-pointer ${
              eligibleCount > 0
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Trophy className="w-5 h-5 text-amber-300" />
            Start Quiz ({Math.min(config.questionCount, eligibleCount)} Questions)
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'running') {
    const currentQ = questions[currentIdx];
    const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);

    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              {currentQ.card.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
            <Clock className="w-4 h-4 text-indigo-500" />
            {formatTime(timerSeconds)}
          </div>
        </div>

        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-500 mb-2 block">
              Question
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {currentQ.card.question}
            </h2>
          </div>

          {config.mode === 'multiple-choice' ? (
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQ.correctAnswer;

                let btnStyle =
                  'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-indigo-400';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
                  }
                } else if (isSelected) {
                  btnStyle =
                    'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-500/20';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left text-sm transition-all flex items-start justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}

              <div className="pt-4 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitOption}
                    disabled={!selectedOption}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
                      selectedOption
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={advanceQuestion}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
                  >
                    {currentIdx + 1 < questions.length ? 'Next Question' : 'View Results'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              {!showRecallAnswer ? (
                <button
                  onClick={() => setShowRecallAnswer(true)}
                  className="w-full py-4 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-sm rounded-2xl border border-indigo-200 dark:border-indigo-800 transition-all cursor-pointer"
                >
                  Reveal Answer
                </button>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl bg-indigo-900 text-white space-y-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-300">
                      Answer
                    </span>
                    <p className="text-base font-medium">{currentQ.card.answer}</p>
                  </div>

                  <div className="space-y-2 text-center">
                    <p className="text-xs font-bold text-slate-500 uppercase">
                      Did you recall correctly?
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSelfGrade(false)}
                        className="flex-1 py-3 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-700 dark:text-rose-300 font-bold text-sm rounded-xl border border-rose-200 dark:border-rose-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5 text-rose-500" />
                        Incorrect
                      </button>

                      <button
                        onClick={() => handleSelfGrade(true)}
                        className="flex-1 py-3 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-sm rounded-xl border border-emerald-200 dark:border-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Correct!
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const correctCount = userAnswers.reduce((acc, ans, idx) => {
    return ans === questions[idx].correctAnswer ? acc + 1 : acc;
  }, 0);
  const scorePct = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in zoom-in-95 duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 text-white shadow-lg mb-2">
          <Trophy className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">
            Quiz Completed!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {scorePct >= 80
              ? 'Outstanding performance! You mastered this session.'
              : scorePct >= 50
              ? 'Good job! Keep studying to reach 100% precision.'
              : 'Keep practicing! Repetition is key to mastery.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 text-white flex justify-around items-center">
          <div>
            <span className="text-xs text-indigo-200 uppercase font-semibold">Final Score</span>
            <p className="text-4xl font-black text-amber-300 mt-0.5">{scorePct}%</p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <span className="text-xs text-indigo-200 uppercase font-semibold">Accuracy</span>
            <p className="text-2xl font-bold mt-0.5">
              {correctCount} / {questions.length}
            </p>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div>
            <span className="text-xs text-indigo-200 uppercase font-semibold">Time</span>
            <p className="text-2xl font-bold mt-0.5">{formatTime(timerSeconds)}</p>
          </div>
        </div>

        <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Question Review Breakdown
          </h3>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {questions.map((q, idx) => {
              const uAns = userAnswers[idx];
              const isCorrect = uAns === q.correctAnswer;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-900 dark:text-slate-100">
                      Q{idx + 1}: {q.card.question}
                    </span>
                    {isCorrect ? (
                      <span className="text-emerald-600 font-bold shrink-0">✓ Correct</span>
                    ) : (
                      <span className="text-rose-600 font-bold shrink-0">✗ Incorrect</span>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-500">Correct Answer:</strong> {q.correctAnswer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button
            onClick={startQuiz}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
          <button
            onClick={onNavigateDashboard}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-bold text-sm rounded-xl cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
