import { useState, useEffect, useCallback } from 'react';
import type { ViewTab, LanguageCode, Achievement } from './types/language';
import { SUPPORTED_LANGUAGES } from './data/languages';
import { getCourse, getCourseId } from './data/courses/registry';
import { storageService, type CourseProgress, type GlobalStats } from './services/storageService';
import { speechService } from './services/speechService';

// UI Components
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { DailyLessonsView } from './components/DailyLessonsView';
import { VocabularyCardsView } from './components/VocabularyCardsView';
import { QuizPracticeView } from './components/QuizPracticeView';
import { ScenarioPracticeView } from './components/ScenarioPracticeView';
import { ProgressAnalyticsView } from './components/ProgressAnalyticsView';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { Trophy, CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  // Active course
  const [sourceLang, setSourceLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('es');

  // View Navigation
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');

  // Course Progress & Global Stats
  const [progress, setProgress] = useState<CourseProgress>({
    completedLessonIds: [],
    bookmarkedWordIds: [],
    weakWordIds: [],
    masteredWordIds: [],
    completedScenarioIds: [],
  });

  const [stats, setStats] = useState<GlobalStats>({
    quizHistory: [],
    dailyActivities: {},
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: '',
    dailyGoal: 5,
    xp: 0,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Modals
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'achievement' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'achievement' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Reload current course progress & stats
  const reloadData = useCallback(() => {
    const active = storageService.getActiveCourse();
    setSourceLang(active.sourceLanguage);
    setTargetLang(active.targetLanguage);

    const cId = getCourseId(active.sourceLanguage, active.targetLanguage);
    const loadedProgress = storageService.getCourseProgress(cId);
    const loadedStats = storageService.getGlobalStats();
    const loadedAchievements = storageService.getAchievements();
    const settings = storageService.getSettings();

    setProgress(loadedProgress);
    setStats(loadedStats);
    setAchievements(loadedAchievements);
    setSoundEnabled(settings.sound);
    speechService.setSoundEnabled(settings.sound);

    const isDark = settings.theme === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    reloadData();
  }, [reloadData]);

  const activeCourse = getCourse(sourceLang, targetLang) || getCourse('en', 'es')!;
  const courseId = getCourseId(sourceLang, targetLang);
  const sourceInfo = SUPPORTED_LANGUAGES[sourceLang] || SUPPORTED_LANGUAGES.en;
  const targetInfo = SUPPORTED_LANGUAGES[targetLang] || SUPPORTED_LANGUAGES.es;

  // Handle new achievements unlock notification
  const handleNewlyUnlocked = (newlyUnlocked: Achievement[]) => {
    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach((ach) => {
        showToast(`Achievement Unlocked: ${ach.title}!`, 'achievement');
      });
      setAchievements(storageService.getAchievements());
    }
  };

  // Course Selector
  const handleSelectCourse = (src: LanguageCode, tgt: LanguageCode) => {
    storageService.setActiveCourse(src, tgt);
    setSourceLang(src);
    setTargetLang(tgt);
    const cId = getCourseId(src, tgt);
    setProgress(storageService.getCourseProgress(cId));
    showToast(`Switched course to ${SUPPORTED_LANGUAGES[src].name} ➔ ${SUPPORTED_LANGUAGES[tgt].name}`);
  };

  // Toggle Lesson Completed
  const handleToggleLessonCompleted = (lessonId: string) => {
    const isCompleted = storageService.toggleLessonCompleted(courseId, lessonId);
    setProgress(storageService.getCourseProgress(courseId));
    setStats(storageService.getGlobalStats());
    const newly = storageService.checkAchievements(courseId);
    handleNewlyUnlocked(newly);
    showToast(isCompleted ? 'Lesson marked as learned! (+15 XP)' : 'Lesson unmarked');
  };

  // Toggle Bookmark Word
  const handleToggleBookmarkWord = (wordId: string) => {
    const isBookmarked = storageService.toggleWordBookmark(courseId, wordId);
    setProgress(storageService.getCourseProgress(courseId));
    showToast(isBookmarked ? 'Word added to bookmarks' : 'Bookmark removed');
  };

  // Mark Vocabulary Mastery
  const handleMarkWordMastery = (wordId: string, mastery: 'mastered' | 'weak') => {
    storageService.markWordMastery(courseId, wordId, mastery);
    setProgress(storageService.getCourseProgress(courseId));
    setStats(storageService.getGlobalStats());
    const newly = storageService.checkAchievements(courseId);
    handleNewlyUnlocked(newly);
    if (mastery === 'mastered') {
      showToast('Word marked as Mastered! (+10 XP)');
    } else {
      showToast('Word added to Needs Practice list (+5 XP)', 'info');
    }
  };

  // Save Quiz Result
  const handleSaveQuizResult = (
    cId: string,
    topic: string,
    scoreVal: number,
    totalVal: number
  ) => {
    const { newlyUnlocked } = storageService.saveQuizResult(cId, topic, scoreVal, totalVal);
    setStats(storageService.getGlobalStats());
    handleNewlyUnlocked(newlyUnlocked);
    showToast(`Quiz result saved: ${scoreVal}/${totalVal} (+25 XP)`);
  };

  // Mark Scenario Completed
  const handleMarkScenarioCompleted = (scenarioId: string) => {
    storageService.markScenarioCompleted(courseId, scenarioId);
    setProgress(storageService.getCourseProgress(courseId));
    setStats(storageService.getGlobalStats());
    const newly = storageService.checkAchievements(courseId);
    handleNewlyUnlocked(newly);
    showToast('Real-Life Scenario Cleared! (+30 XP)', 'achievement');
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const newSound = !soundEnabled;
    setSoundEnabled(newSound);
    speechService.setSoundEnabled(newSound);
    const currSettings = storageService.getSettings();
    storageService.saveSettings({ ...currSettings, sound: newSound });
    showToast(newSound ? 'Sound audio enabled' : 'Sound audio muted', 'info');
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const currSettings = storageService.getSettings();
    storageService.saveSettings({ ...currSettings, theme: newDark ? 'dark' : 'light' });
  };

  // Daily Goal Update
  const handleUpdateDailyGoal = (newGoal: number) => {
    const currentStats = storageService.getGlobalStats();
    currentStats.dailyGoal = newGoal;
    storageService.saveGlobalStats(currentStats);
    setStats(currentStats);
    showToast(`Daily goal updated to ${newGoal} items/day`);
  };

  // Reset Progress
  const handleResetProgress = () => {
    storageService.resetAllProgress();
    reloadData();
    showToast('User progress has been reset successfully.', 'info');
  };

  // Seed Demo Data
  const handleSeedDemoData = () => {
    storageService.seedDemoData();
    reloadData();
    showToast('Sample starter progress seeded!');
  };

  // Today Goal Progress calculation
  const todayGoal = storageService.getTodayGoalProgress();
  const weeklyActivity = storageService.getWeeklyActivity();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl animate-slideIn">
          {toast.type === 'achievement' ? (
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          )}
          <span className="text-xs font-bold text-white">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-1">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenAchievements={() => setIsAchievementsModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenLanguageSelector={() => setIsLangModalOpen(true)}
          courseTitle={activeCourse.title}
          sourceFlag={sourceInfo.flag}
          targetFlag={targetInfo.flag}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
          {/* Top Navbar */}
          <Navbar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenLanguageSelector={() => setIsLangModalOpen(true)}
            sourceFlag={sourceInfo.flag}
            targetFlag={targetInfo.flag}
            sourceLangName={sourceInfo.name}
            targetLangName={targetInfo.name}
            streak={stats.currentStreak}
            xp={stats.xp}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            darkMode={darkMode}
            onToggleTheme={handleToggleTheme}
            goalCurrent={todayGoal.current}
            goalTarget={todayGoal.target}
          />

          {/* Active View Container */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'dashboard' && (
              <DashboardView
                course={activeCourse}
                progress={progress}
                stats={stats}
                todayGoalCurrent={todayGoal.current}
                todayGoalTarget={todayGoal.target}
                weeklyActivity={weeklyActivity}
                onNavigateTab={setActiveTab}
                onOpenLanguageSelector={() => setIsLangModalOpen(true)}
              />
            )}

            {activeTab === 'lessons' && (
              <DailyLessonsView
                course={activeCourse}
                progress={progress}
                onToggleLessonCompleted={handleToggleLessonCompleted}
                onToggleBookmarkWord={handleToggleBookmarkWord}
                targetSpeechCode={targetInfo.speechCode}
              />
            )}

            {activeTab === 'vocabulary' && (
              <VocabularyCardsView
                course={activeCourse}
                progress={progress}
                onMarkWordMastery={handleMarkWordMastery}
                onToggleBookmarkWord={handleToggleBookmarkWord}
                targetSpeechCode={targetInfo.speechCode}
              />
            )}

            {activeTab === 'practice' && (
              <QuizPracticeView
                course={activeCourse}
                progress={progress}
                onSaveQuizResult={handleSaveQuizResult}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'scenarios' && (
              <ScenarioPracticeView
                course={activeCourse}
                progress={progress}
                onMarkScenarioCompleted={handleMarkScenarioCompleted}
                targetSpeechCode={targetInfo.speechCode}
              />
            )}

            {activeTab === 'analytics' && (
              <ProgressAnalyticsView
                course={activeCourse}
                progress={progress}
                stats={stats}
                weeklyActivity={weeklyActivity}
                onMarkWordMastered={(wordId) => handleMarkWordMastery(wordId, 'mastered')}
                onNavigateToDeck={() => setActiveTab('vocabulary')}
                targetSpeechCode={targetInfo.speechCode}
              />
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentSource={sourceLang}
        currentTarget={targetLang}
        onSelectCourse={handleSelectCourse}
      />

      <AchievementsModal
        isOpen={isAchievementsModalOpen}
        onClose={() => setIsAchievementsModalOpen(false)}
        achievements={achievements}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        dailyGoal={stats.dailyGoal}
        onUpdateDailyGoal={handleUpdateDailyGoal}
        onResetProgress={handleResetProgress}
        onSeedDemoData={handleSeedDemoData}
        targetSpeechCode={targetInfo.speechCode}
      />
    </div>
  );
}

export default App;
