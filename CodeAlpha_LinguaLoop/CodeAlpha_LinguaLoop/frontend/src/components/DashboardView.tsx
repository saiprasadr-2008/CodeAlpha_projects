import React from 'react';
import type { CourseData, ViewTab } from '../types/language';
import type { CourseProgress, GlobalStats } from '../services/storageService';
import {
  BookOpen,
  Award,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DashboardViewProps {
  course: CourseData;
  progress: CourseProgress;
  stats: GlobalStats;
  todayGoalCurrent: number;
  todayGoalTarget: number;
  weeklyActivity: Array<{ day: string; date: string; lessons: number; vocab: number; quizzes: number; total: number }>;
  onNavigateTab: (tab: ViewTab) => void;
  onOpenLanguageSelector: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  course,
  progress,
  stats,
  todayGoalCurrent,
  todayGoalTarget,
  weeklyActivity,
  onNavigateTab,
  onOpenLanguageSelector,
}) => {
  // Metrics calculated from actual saved records
  const lessonsCompletedCount = progress.completedLessonIds.length;
  const totalLessonsCount = course.lessons.length;
  const vocabLearnedCount = progress.masteredWordIds.length;
  const weakWordsCount = progress.weakWordIds.length;
  const scenariosCompletedCount = progress.completedScenarioIds.length;
  const totalScenariosCount = course.scenarios.length;

  // Quiz accuracy calculation from real historical results
  const quizAccuracyPercentage =
    stats.quizHistory.length > 0
      ? Math.round(
          stats.quizHistory.reduce((sum, q) => sum + q.percentage, 0) /
            stats.quizHistory.length
        )
      : 0;

  const goalPercentage = Math.min(
    100,
    Math.round((todayGoalCurrent / todayGoalTarget) * 100)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Interactive Real-Life Language Learning</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Welcome back to <span className="bg-gradient-to-r from-indigo-300 to-teal-300 bg-clip-text text-transparent">LinguaLoop</span>!
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            You are studying <strong className="text-teal-300">{course.title}</strong>.{' '}
            <button
              onClick={onOpenLanguageSelector}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
            >
              (Switch course)
            </button>{' '}
            Practice real conversations, master vocabulary, and build lasting confidence.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('lessons')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Learning</span>
            </button>

            <button
              onClick={() => onNavigateTab('vocabulary')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold transition ${
                weakWordsCount > 0
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Practice Weak Words</span>
              {weakWordsCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-500/30 text-amber-200 font-bold">
                  {weakWordsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigateTab('scenarios')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-semibold transition"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>Real-Life Scenarios</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Core Calculated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Lessons Completed */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lessons Done</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{lessonsCompletedCount}</span>
              <span className="text-sm font-medium text-slate-400">/ {totalLessonsCount}</span>
            </div>
            <div className="mt-2.5 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${totalLessonsCount > 0 ? (lessonsCompletedCount / totalLessonsCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Vocabulary Learned */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Words Mastered</span>
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{vocabLearnedCount}</span>
              <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                {progress.weakWordIds.length} weak
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {vocabLearnedCount > 0 ? 'Consistent vocabulary recall' : 'Review cards to mark mastered'}
            </p>
          </div>
        </div>

        {/* Metric 3: Quiz Accuracy */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quiz Accuracy</span>
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{quizAccuracyPercentage}%</span>
              <span className="text-xs font-medium text-slate-400">
                ({stats.quizHistory.length} {stats.quizHistory.length === 1 ? 'attempt' : 'attempts'})
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {stats.quizHistory.length > 0 ? 'Calculated from saved test sessions' : 'Take a quiz to set your baseline'}
            </p>
          </div>
        </div>

        {/* Metric 4: Learning Streak */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Streak</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-400">{stats.currentStreak}</span>
              <span className="text-sm font-medium text-slate-400">days</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Longest streak: <strong className="text-slate-200">{stats.longestStreak} days</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Daily Goal & Weekly Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Daily Learning Goal</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                {todayGoalCurrent} of {todayGoalTarget} items
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Complete lessons, flashcards, quizzes, or scenarios to fulfill your goal.
            </p>

            {/* Circular Progress & Visual Representation */}
            <div className="mt-6 flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-teal-400 transition-all duration-700"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - goalPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold text-white">{goalPercentage}%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {goalPercentage >= 100 ? 'Completed' : 'Today'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Goal Target: {todayGoalTarget} activities</span>
            <button
              onClick={() => onNavigateTab('lessons')}
              className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
            >
              <span>Keep Going</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weekly Activity Progress Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">Weekly Learning Activity</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Activities logged across the past 7 days (Lessons, Words, Quizzes)
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>Full Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recharts Bar Chart */}
            <div className="mt-6 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc',
                    }}
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  />
                  <Bar dataKey="lessons" name="Lessons" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vocab" name="Vocab" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="quizzes" name="Quizzes" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-around text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              <span>Lessons</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
              <span>Vocab</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
              <span>Quizzes</span>
            </span>
          </div>
        </div>
      </div>

      {/* Featured Jump Points: Real-Life Scenarios Spotlight */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Signature Feature • {scenariosCompletedCount} of {totalScenariosCount} Completed
              </span>
              <h3 className="font-extrabold text-lg text-white">Real-Life Conversation Scenarios</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Immerse in branching dialogues: airport check-in, market bargaining, restaurant dining, and job interviews with cultural etiquette feedback.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('scenarios')}
            className="self-start sm:self-center shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <span>Explore {totalScenariosCount} Scenarios</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios Mini Preview Row */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {course.scenarios.slice(0, 3).map((sc) => {
            const isDone = progress.completedScenarioIds.includes(sc.id);
            return (
              <div
                key={sc.id}
                onClick={() => onNavigateTab('scenarios')}
                className="p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{sc.interlocutorAvatar}</span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-teal-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded">
                      {sc.difficulty}
                    </span>
                  )}
                </div>
                <h4 className="mt-2 text-sm font-bold text-white group-hover:text-teal-300 transition">
                  {sc.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">{sc.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
