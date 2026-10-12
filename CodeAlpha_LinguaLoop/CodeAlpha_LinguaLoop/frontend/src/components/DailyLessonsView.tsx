import React, { useState } from 'react';
import type { CourseData } from '../types/language';
import type { CourseProgress } from '../services/storageService';
import { LESSON_TOPICS } from '../data/languages';
import { speechService } from '../services/speechService';
import {
  Volume2,
  Bookmark,
  CheckCircle,
  Circle,
  Search,
  Filter,
  Users,
  ShoppingBag,
  Compass,
  UtensilsCrossed,
  GraduationCap,
  Briefcase,
  BookOpen,
} from 'lucide-react';

interface DailyLessonsViewProps {
  course: CourseData;
  progress: CourseProgress;
  onToggleLessonCompleted: (lessonId: string) => void;
  onToggleBookmarkWord: (wordId: string) => void;
  targetSpeechCode: string;
}

export const DailyLessonsView: React.FC<DailyLessonsViewProps> = ({
  course,
  progress,
  onToggleLessonCompleted,
  onToggleBookmarkWord,
  targetSpeechCode,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [playingLessonId, setPlayingLessonId] = useState<string | null>(null);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Categories' },
    { id: 'vocabulary', label: 'Vocabulary' },
    { id: 'phrases', label: 'Phrases' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'conversation', label: 'Conversation' },
  ];

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Compass':
        return <Compass className="w-4 h-4" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      case 'Briefcase':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  // Filter lessons
  const filteredLessons = course.lessons.filter((item) => {
    const matchesTopic = selectedTopic === 'all' || item.topic === selectedTopic;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.targetText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nativeScript && item.nativeScript.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.phonetic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesCategory && matchesSearch;
  });

  const handlePlayAudio = async (lessonId: string, textToSpeak: string) => {
    setPlayingLessonId(lessonId);
    await speechService.speak(textToSpeak, targetSpeechCode);
    setPlayingLessonId(null);
  };

  const completedCount = course.lessons.filter((l) =>
    progress.completedLessonIds.includes(l.id)
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Progress Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">Daily Lessons</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
              {course.title}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Carefully curated vocabulary, grammar points, idioms, and everyday dialogues with pronunciation audio.
          </p>
        </div>

        {/* Completion Pill */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 self-start sm:self-center shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Completed</span>
            <span className="text-base font-extrabold text-teal-300">
              {completedCount} / {course.lessons.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
            {Math.round((completedCount / (course.lessons.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search words, translations, script, or phonetics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Topics Filter Bar */}
        <div>
          <span className="text-xs font-semibold text-slate-400 block mb-2">Filter by Topic:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTopic('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedTopic === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              All Topics ({course.lessons.length})
            </button>
            {LESSON_TOPICS.map((topic) => {
              const count = course.lessons.filter((l) => l.topic === topic.id).length;
              if (count === 0) return null;
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-teal-500 text-white shadow-sm font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {getTopicIcon(topic.iconName)}
                  <span>{topic.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List Grid */}
      {filteredLessons.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Filter className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No lessons match your filter</h3>
          <p className="text-xs text-slate-400">Try adjusting your topic or clearing your search term.</p>
          <button
            onClick={() => {
              setSelectedTopic('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);
            const isBookmarked = progress.bookmarkedWordIds.includes(lesson.id);
            const isPlaying = playingLessonId === lesson.id;

            return (
              <div
                key={lesson.id}
                className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-900/70 border-teal-500/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Meta Badges & Bookmark */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {lesson.category}
                      </span>
                      <span className="text-xs text-slate-400 capitalize font-medium">
                        {lesson.topic.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Bookmark Button */}
                      <button
                        onClick={() => onToggleBookmarkWord(lesson.id)}
                        aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson word'}
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked
                            ? 'text-amber-400 bg-amber-500/15'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={isBookmarked ? 'Bookmarked (Saved for revision)' : 'Bookmark lesson'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                      </button>

                      {/* Completed Toggle Button */}
                      <button
                        onClick={() => onToggleLessonCompleted(lesson.id)}
                        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        className={`p-1.5 rounded-lg transition ${
                          isCompleted
                            ? 'text-teal-400 bg-teal-500/15'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                        }`}
                        title={isCompleted ? 'Completed' : 'Mark as completed'}
                      >
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Target Phrase with Script & Audio */}
                  <div className="space-y-1">
                    {lesson.nativeScript && (
                      <p className="text-xl sm:text-2xl font-bold text-white tracking-wide leading-relaxed font-sans">
                        {lesson.nativeScript}
                      </p>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-teal-300">{lesson.targetText}</h3>
                      <button
                        onClick={() => handlePlayAudio(lesson.id, lesson.nativeScript || lesson.targetText)}
                        aria-label={`Listen to pronunciation of ${lesson.targetText}`}
                        className={`p-2 rounded-xl border transition shrink-0 ${
                          isPlaying
                            ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-teal-300'
                        }`}
                        title="Listen to pronunciation (Web Speech API)"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Phonetic Transliteration */}
                    <p className="text-xs font-mono text-indigo-300 bg-indigo-950/40 px-2 py-1 rounded inline-block">
                      🗣️ {lesson.phonetic}
                    </p>

                    {/* Translation */}
                    <p className="text-sm font-semibold text-slate-200 pt-1">{lesson.translation}</p>
                  </div>

                  {/* Contextual Example */}
                  <div className="mt-3.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
                    <p className="text-xs font-medium text-slate-200">
                      <strong className="text-teal-400">Ex:</strong> {lesson.exampleTarget}
                    </p>
                    <p className="text-xs text-slate-400 italic">{lesson.exampleTranslation}</p>
                  </div>

                  {/* Grammar / Nuance Note */}
                  {lesson.grammarNote && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
                      <span className="font-bold text-indigo-300">💡 Note: </span>
                      {lesson.grammarNote}
                    </div>
                  )}
                </div>

                {/* Card Footer: Status Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {isCompleted ? '✓ Marked as learned' : 'Click checkmark when learned'}
                  </span>
                  <button
                    onClick={() => onToggleLessonCompleted(lesson.id)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                      isCompleted
                        ? 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20'
                        : 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
