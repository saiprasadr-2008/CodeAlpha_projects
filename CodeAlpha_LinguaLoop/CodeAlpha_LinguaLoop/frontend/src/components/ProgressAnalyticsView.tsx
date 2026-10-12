import React from 'react';
import type { CourseData } from '../types/language';
import type { CourseProgress, GlobalStats } from '../services/storageService';
import { speechService } from '../services/speechService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Zap,
  Volume2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ProgressAnalyticsViewProps {
  course: CourseData;
  progress: CourseProgress;
  stats: GlobalStats;
  weeklyActivity: Array<{ day: string; date: string; lessons: number; vocab: number; quizzes: number; total: number }>;
  onMarkWordMastered: (wordId: string) => void;
  onNavigateToDeck: () => void;
  targetSpeechCode: string;
}

export const ProgressAnalyticsView: React.FC<ProgressAnalyticsViewProps> = ({
  course,
  progress,
  stats,
  weeklyActivity,
  onMarkWordMastered,
  onNavigateToDeck,
  targetSpeechCode,
}) => {
  // Aggregate topic competency from lessons completed
  const topicBreakdown = React.useMemo(() => {
    const topicsMap: Record<string, { total: number; completed: number }> = {};

    course.lessons.forEach((lesson) => {
      if (!topicsMap[lesson.topic]) {
        topicsMap[lesson.topic] = { total: 0, completed: 0 };
      }
      topicsMap[lesson.topic].total += 1;
      if (progress.completedLessonIds.includes(lesson.id)) {
        topicsMap[lesson.topic].completed += 1;
      }
    });

    return Object.entries(topicsMap).map(([topic, data]) => ({
      topicName: topic.replace('_', ' ').toUpperCase(),
      pct: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
      completed: data.completed,
      total: data.total,
    }));
  }, [course.lessons, progress.completedLessonIds]);

  // Quiz history trend data
  const quizTrendData = React.useMemo(() => {
    return [...stats.quizHistory].reverse().slice(-10).map((q, idx) => ({
      attempt: `#${idx + 1}`,
      accuracy: q.percentage,
      topic: q.topic,
    }));
  }, [stats.quizHistory]);

  // Weak / Difficult Words list
  const weakWords = course.vocabulary.filter((w) => progress.weakWordIds.includes(w.id));

  const handleSpeak = (text: string) => {
    speechService.speak(text, targetSpeechCode);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Analytics Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Learning Progress & Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real activity records, retention metrics, accuracy trends, and difficult vocabulary tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold self-start sm:self-center">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Real-time LocalStorage Sync</span>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Total XP Earned</span>
          <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">
            {stats.xp} XP
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Vocabulary Mastered</span>
          <span className="text-2xl font-extrabold text-teal-400 mt-1 block">
            {progress.masteredWordIds.length} words
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Quizzes Completed</span>
          <span className="text-2xl font-extrabold text-violet-400 mt-1 block">
            {stats.quizHistory.length} tests
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Scenarios Cleared</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">
            {progress.completedScenarioIds.length} / {course.scenarios.length}
          </span>
        </div>
      </div>

      {/* Two Column Grid: Weekly Learning Activity & Quiz Accuracy Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 7-Day Activity Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Weekly Learning Consistency</h3>
              <p className="text-xs text-slate-400">Total activities completed per day</p>
            </div>
            <span className="text-xs text-teal-400 font-semibold">Last 7 Days</span>
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="lessons" name="Lessons" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="vocab" name="Vocab" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quizzes" name="Quizzes" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
              <span>Lessons</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
              <span>Vocabulary</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
              <span>Quizzes</span>
            </span>
          </div>
        </div>

        {/* Chart 2: Quiz Accuracy Trend Over Time */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Quiz Accuracy Trend</h3>
              <p className="text-xs text-slate-400">Score percentage progression</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="h-60 w-full pt-2">
            {quizTrendData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <Zap className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs text-slate-400">
                  No quiz history yet. Complete a quiz challenge to visualize your performance trend.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                  <XAxis dataKey="attempt" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy %"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 text-center">
            {quizTrendData.length > 0
              ? `Displaying latest ${quizTrendData.length} quiz test sessions`
              : 'Target accuracy: 80%+'}
          </div>
        </div>
      </div>

      {/* Topic Competency Progress Bars */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-bold text-base text-white">Topic Competency Breakdown</h3>
          <p className="text-xs text-slate-400">
            Lesson completion percentage across conversational topics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {topicBreakdown.map((t) => (
            <div key={t.topicName} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{t.topicName}</span>
                <span className="font-mono text-teal-400 font-bold">{t.pct}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block text-right">
                {t.completed} of {t.total} lessons
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Difficult / Weak Words Management Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">Difficult Vocabulary (Needs Practice)</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Words marked as &quot;Needs Practice&quot; during flashcard review. Practice them to cement long-term memory.
            </p>
          </div>

          {weakWords.length > 0 && (
            <button
              onClick={onNavigateToDeck}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm self-start sm:self-center"
            >
              Practice {weakWords.length} Weak Words in Deck
            </button>
          )}
        </div>

        {weakWords.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-800/40 border border-slate-700/40">
            <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-200">No weak words right now!</h4>
            <p className="text-xs text-slate-400 mt-1">
              When studying vocabulary, rate any challenging words as &quot;Needs Practice&quot; to review them here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3 rounded-l-lg">Target Word</th>
                  <th className="p-3">Phonetics</th>
                  <th className="p-3">Translation</th>
                  <th className="p-3">Topic</th>
                  <th className="p-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {weakWords.map((word) => (
                  <tr key={word.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                      <span>{word.nativeScript || word.targetText}</span>
                      <button
                        onClick={() => handleSpeak(word.nativeScript || word.targetText)}
                        aria-label={`Listen to ${word.targetText}`}
                        className="p-1 rounded text-slate-400 hover:text-teal-300"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                    <td className="p-3 font-mono text-indigo-300">{word.phonetic}</td>
                    <td className="p-3 text-slate-300 font-medium">{word.translation}</td>
                    <td className="p-3 text-slate-400 capitalize">{word.topic.replace('_', ' ')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onMarkWordMastered(word.id)}
                        className="px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-300 hover:bg-teal-500/25 border border-teal-500/30 font-semibold"
                        title="Mark as Mastered"
                      >
                        Mark Mastered
                      </button>
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
