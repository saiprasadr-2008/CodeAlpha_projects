import React from 'react';
import type { Flashcard, Category, UserStats, QuizResult } from '../types';
import {
  BarChart3,
  CheckCircle2,
  BookOpen,
  Award,
  Flame,
  Clock,
  Layers,
  TrendingUp,
} from 'lucide-react';

interface ProgressViewProps {
  cards: Flashcard[];
  categories: Category[];
  stats: UserStats;
  quizResults: QuizResult[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  cards,
  categories,
  stats,
  quizResults,
}) => {
  const totalCards = cards.length;
  const masteredCount = cards.filter((c) => c.mastery === 'Mastered').length;
  const learningCount = cards.filter((c) => c.mastery === 'Learning').length;
  const newCount = cards.filter((c) => c.mastery === 'New').length;

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Learning Analytics & Progress
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Track memory retention, mastery levels, and recent quiz performance.
        </p>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Study Sessions</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {stats.totalStudySessions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active Streak</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {stats.studyStreakDays} <span className="text-xs font-normal">days</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quizzes Taken</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {stats.quizzesCompleted}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cards Mastered</p>
              <p className="text-2xl font-black text-slate-900 dark:text-slate-100">
                {masteredCount}{' '}
                <span className="text-xs font-normal text-slate-500">
                  / {totalCards}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Mastery Level Distribution */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Card Mastery Level Distribution
        </h2>

        {/* Stacked Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-5 rounded-2xl overflow-hidden flex">
          <div
            title={`Mastered: ${masteredCount}`}
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${totalCards > 0 ? (masteredCount / totalCards) * 100 : 0}%` }}
          />
          <div
            title={`Learning: ${learningCount}`}
            className="bg-blue-500 h-full transition-all duration-500"
            style={{ width: `${totalCards > 0 ? (learningCount / totalCards) * 100 : 0}%` }}
          />
          <div
            title={`New: ${newCount}`}
            className="bg-slate-300 dark:bg-slate-700 h-full transition-all duration-500"
            style={{ width: `${totalCards > 0 ? (newCount / totalCards) * 100 : 0}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-around text-xs font-semibold pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Mastered ({masteredCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Learning ({learningCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" />
            <span>New / Unreviewed ({newCount})</span>
          </div>
        </div>
      </div>

      {/* Category Mastery Progress List */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Subject Category Breakdown
        </h2>

        <div className="space-y-4">
          {categories.map((cat) => {
            const catCards = cards.filter((c) => c.category === cat.name);
            const catMastered = catCards.filter((c) => c.mastery === 'Mastered').length;
            const pct = catCards.length > 0 ? Math.round((catMastered / catCards.length) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{cat.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {catMastered} / {catCards.length} Mastered ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Recent Quiz History Log
        </h2>

        {quizResults.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No quizzes completed yet. Take a quiz to log your test scores!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Format</th>
                  <th className="p-3 text-right">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {quizResults.map((q) => (
                  <tr key={q.id}>
                    <td className="p-3 font-medium text-slate-500">{formatDate(q.date)}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {q.category === 'all' ? 'All Subjects' : q.category}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                          q.scorePercentage >= 80
                            ? 'bg-emerald-100 text-emerald-700'
                            : q.scorePercentage >= 60
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {q.scorePercentage}% ({q.correctAnswers}/{q.totalQuestions})
                      </span>
                    </td>
                    <td className="p-3 font-medium capitalize">{q.mode}</td>
                    <td className="p-3 text-right font-mono font-semibold">
                      {Math.floor(q.timeSpentSeconds / 60)}m {q.timeSpentSeconds % 60}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
