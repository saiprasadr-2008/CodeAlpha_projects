import React from 'react';
import type { Flashcard, Category, UserStats, ViewMode } from '../types';
import {
  Brain,
  BookOpen,
  Trophy,
  Plus,
  Flame,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface DashboardProps {
  cards: Flashcard[];
  categories: Category[];
  stats: UserStats;
  onNavigate: (view: ViewMode, categoryFilter?: string) => void;
  onOpenAddModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cards,
  categories,
  stats,
  onNavigate,
  onOpenAddModal,
}) => {
  const totalCards = cards.length;
  const masteredCards = cards.filter((c) => c.mastery === 'Mastered').length;

  const masteryPercentage =
    totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-8 md:p-10 shadow-xl shadow-indigo-900/10">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-20 -top-10 w-60 h-60 rounded-full bg-indigo-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Interactive Learning Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Master Any Subject with{' '}
            <span className="bg-gradient-to-r from-amber-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
              Smart Flashcards
            </span>
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Boost memory retention through spaced self-assessment, custom quiz tests, and instant analytics feedback.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('study')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Start Study Session
            </button>
            <button
              onClick={() => onNavigate('quiz')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-700/60 hover:bg-indigo-700/80 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              Take Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cards */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Cards</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalCards}</p>
            <span className="text-[11px] text-slate-400">across {categories.length} subjects</span>
          </div>
        </div>

        {/* Mastered Cards */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mastered Rate</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {masteryPercentage}%
            </p>
            <span className="text-[11px] text-emerald-600 font-semibold">{masteredCards} cards mastered</span>
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Streak</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.studyStreakDays} <span className="text-sm font-normal text-slate-500">days</span>
            </p>
            <span className="text-[11px] text-amber-600 font-semibold">Keep it going! 🔥</span>
          </div>
        </div>

        {/* Quiz Avg Score */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Quiz Accuracy</p>
            <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {stats.averageQuizScore}%
            </p>
            <span className="text-[11px] text-slate-400">{stats.quizzesCompleted} quizzes taken</span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('study')}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-left shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <BookOpen className="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base">Study All Flashcards</h3>
            <p className="text-xs text-blue-100 mt-1">
              Review {totalCards} cards with 3D flip interactive mode.
            </p>
          </button>

          <button
            onClick={() => onNavigate('quiz')}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-left shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <Trophy className="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base">Take Knowledge Quiz</h3>
            <p className="text-xs text-purple-100 mt-1">
              Test your knowledge & earn scores.
            </p>
          </button>

          <button
            onClick={onOpenAddModal}
            className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-left shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all cursor-pointer group"
          >
            <Plus className="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-base">Create New Card</h3>
            <p className="text-xs text-emerald-100 mt-1">
              Add custom questions & answers.
            </p>
          </button>
        </div>
      </div>

      {/* Subject Decks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Study Decks by Subject
          </h2>
          <button
            onClick={() => onNavigate('manage')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            Manage All Cards <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const catCards = cards.filter((c) => c.category === cat.name);
            const catMastered = catCards.filter((c) => c.mastery === 'Mastered').length;
            const progress =
              catCards.length > 0 ? Math.round((catMastered / catCards.length) * 100) : 0;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-sm hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
                      {catCards.length} {catCards.length === 1 ? 'Card' : 'Cards'}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{progress}% Mastered</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-400">
                    {catMastered} / {catCards.length} Mastered
                  </span>
                  <button
                    onClick={() => onNavigate('study', cat.name)}
                    disabled={catCards.length === 0}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                      catCards.length > 0
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white cursor-pointer'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Study <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
