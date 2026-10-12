import type {
  LanguageCode,
  QuizResultRecord,
  DailyActivity,
  Achievement,
} from '../types/language';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { getCourse } from '../data/courses/registry';

const STORAGE_KEYS = {
  ACTIVE_COURSE: 'lingualoop_active_course_v1',
  COURSE_PROGRESS_PREFIX: 'lingualoop_progress_',
  GLOBAL_STATS: 'lingualoop_global_stats_v1',
  SETTINGS: 'lingualoop_settings_v1',
  ACHIEVEMENTS: 'lingualoop_achievements_v1',
};

export interface CourseProgress {
  completedLessonIds: string[];
  bookmarkedWordIds: string[];
  weakWordIds: string[]; // Needs practice
  masteredWordIds: string[]; // Known
  completedScenarioIds: string[];
}

export interface GlobalStats {
  quizHistory: QuizResultRecord[];
  dailyActivities: Record<string, DailyActivity>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyGoal: number; // e.g. 5 activities per day
  xp: number;
}

export interface AppSettings {
  sound: boolean;
  theme: 'light' | 'dark';
}

const DEFAULT_SETTINGS: AppSettings = {
  sound: true,
  theme: 'dark',
};

function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class StorageService {
  // Course selection
  public getActiveCourse(): { sourceLanguage: LanguageCode; targetLanguage: LanguageCode } {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_COURSE);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return { sourceLanguage: 'en', targetLanguage: 'es' };
  }

  public setActiveCourse(sourceLanguage: LanguageCode, targetLanguage: LanguageCode) {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_COURSE,
      JSON.stringify({ sourceLanguage, targetLanguage })
    );
  }

  // Course progress (namespaced per course)
  public getCourseProgress(courseId: string): CourseProgress {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS_PREFIX + courseId);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      completedLessonIds: [],
      bookmarkedWordIds: [],
      weakWordIds: [],
      masteredWordIds: [],
      completedScenarioIds: [],
    };
  }

  public saveCourseProgress(courseId: string, progress: CourseProgress) {
    localStorage.setItem(
      STORAGE_KEYS.COURSE_PROGRESS_PREFIX + courseId,
      JSON.stringify(progress)
    );
  }

  // Global statistics
  public getGlobalStats(): GlobalStats {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GLOBAL_STATS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      quizHistory: [],
      dailyActivities: {},
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: getTodayKey(),
      dailyGoal: 5,
      xp: 40,
    };
  }

  public saveGlobalStats(stats: GlobalStats) {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_STATS, JSON.stringify(stats));
  }

  // Settings
  public getSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Achievements
  public getAchievements(): Achievement[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        const stored: Achievement[] = JSON.parse(saved);
        // Merge with initial in case new badges were added
        return INITIAL_ACHIEVEMENTS.map((init) => {
          const found = stored.find((s) => s.id === init.id);
          return found || init;
        });
      }
    } catch {
      // ignore
    }
    return [...INITIAL_ACHIEVEMENTS];
  }

  public saveAchievements(achievements: Achievement[]) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  // Record user activity & recalculate streaks + achievements
  public recordActivity(
    type: 'lesson' | 'vocab' | 'quiz' | 'scenario',
    courseId: string,
    extraXp: number = 10
  ): { newlyUnlocked: Achievement[] } {
    const today = getTodayKey();
    const yesterday = getYesterdayKey();
    const stats = this.getGlobalStats();

    // 1. Update streak based on local calendar date
    if (stats.lastActiveDate === today) {
      // Already active today, streak maintained
    } else if (stats.lastActiveDate === yesterday) {
      // Continuous streak!
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
      }
      stats.lastActiveDate = today;
    } else {
      // Streak broken, reset to 1
      stats.currentStreak = 1;
      stats.lastActiveDate = today;
    }

    // 2. Daily activity log
    if (!stats.dailyActivities[today]) {
      stats.dailyActivities[today] = {
        date: today,
        lessonsCompleted: 0,
        wordsReviewed: 0,
        quizzesTaken: 0,
        xpEarned: 0,
      };
    }

    const todayAct = stats.dailyActivities[today];
    if (type === 'lesson') todayAct.lessonsCompleted += 1;
    if (type === 'vocab') todayAct.wordsReviewed += 1;
    if (type === 'quiz') todayAct.quizzesTaken += 1;
    todayAct.xpEarned += extraXp;
    stats.xp += extraXp;

    this.saveGlobalStats(stats);

    // 3. Check achievements
    const newlyUnlocked = this.checkAchievements(courseId);
    return { newlyUnlocked };
  }

  public checkAchievements(courseId: string): Achievement[] {
    const achievements = this.getAchievements();
    const progress = this.getCourseProgress(courseId);
    const stats = this.getGlobalStats();
    const today = getTodayKey();
    const todayAct = stats.dailyActivities[today] || { lessonsCompleted: 0, wordsReviewed: 0, quizzesTaken: 0 };
    const todayTotal = todayAct.lessonsCompleted + todayAct.wordsReviewed + todayAct.quizzesTaken;

    const newlyUnlocked: Achievement[] = [];

    achievements.forEach((ach) => {
      if (ach.unlockedAt) return; // Already unlocked

      let currentVal = 0;
      switch (ach.id) {
        case 'first_lesson':
          currentVal = progress.completedLessonIds.length;
          break;
        case 'vocab_collector':
        case 'vocab_master':
          currentVal = progress.masteredWordIds.length;
          break;
        case 'first_quiz':
          currentVal = stats.quizHistory.length;
          break;
        case 'quiz_ace': {
          const hasAce = stats.quizHistory.some((q) => q.percentage === 100);
          currentVal = hasAce ? 1 : 0;
          break;
        }
        case 'scenario_rookie':
        case 'scenario_diplomat':
          currentVal = progress.completedScenarioIds.length;
          break;
        case 'streak_3':
          currentVal = stats.currentStreak;
          break;
        case 'daily_goal_crusher':
          currentVal = todayTotal >= stats.dailyGoal ? 1 : 0;
          break;
        default:
          break;
      }

      ach.progress = Math.min(currentVal, ach.maxProgress);
      if (ach.progress >= ach.maxProgress && !ach.unlockedAt) {
        ach.unlockedAt = new Date().toISOString();
        newlyUnlocked.push(ach);
      }
    });

    this.saveAchievements(achievements);
    return newlyUnlocked;
  }

  public saveQuizResult(
    courseId: string,
    topic: string,
    score: number,
    totalQuestions: number
  ): { newlyUnlocked: Achievement[] } {
    const stats = this.getGlobalStats();
    const percentage = Math.round((score / totalQuestions) * 100);

    const record: QuizResultRecord = {
      id: `quiz_${Date.now()}`,
      timestamp: new Date().toISOString(),
      courseId,
      topic,
      score,
      totalQuestions,
      percentage,
    };

    stats.quizHistory.unshift(record);
    // Keep max 50 historical quizzes
    if (stats.quizHistory.length > 50) {
      stats.quizHistory.pop();
    }
    this.saveGlobalStats(stats);

    return this.recordActivity('quiz', courseId, 25);
  }

  // Toggle lesson completed
  public toggleLessonCompleted(courseId: string, lessonId: string): boolean {
    const progress = this.getCourseProgress(courseId);
    const index = progress.completedLessonIds.indexOf(lessonId);
    let isNowCompleted = false;

    if (index > -1) {
      progress.completedLessonIds.splice(index, 1);
    } else {
      progress.completedLessonIds.push(lessonId);
      isNowCompleted = true;
    }

    this.saveCourseProgress(courseId, progress);
    if (isNowCompleted) {
      this.recordActivity('lesson', courseId, 15);
    }
    return isNowCompleted;
  }

  // Toggle word bookmark
  public toggleWordBookmark(courseId: string, wordId: string): boolean {
    const progress = this.getCourseProgress(courseId);
    const index = progress.bookmarkedWordIds.indexOf(wordId);
    let isBookmarked = false;

    if (index > -1) {
      progress.bookmarkedWordIds.splice(index, 1);
    } else {
      progress.bookmarkedWordIds.push(wordId);
      isBookmarked = true;
    }

    this.saveCourseProgress(courseId, progress);
    return isBookmarked;
  }

  // Update vocabulary mastery: Known ('mastered') vs Needs Practice ('weak')
  public markWordMastery(courseId: string, wordId: string, mastery: 'mastered' | 'weak') {
    const progress = this.getCourseProgress(courseId);

    if (mastery === 'mastered') {
      if (!progress.masteredWordIds.includes(wordId)) {
        progress.masteredWordIds.push(wordId);
      }
      // Remove from weak words
      progress.weakWordIds = progress.weakWordIds.filter((id) => id !== wordId);
      this.recordActivity('vocab', courseId, 10);
    } else {
      if (!progress.weakWordIds.includes(wordId)) {
        progress.weakWordIds.push(wordId);
      }
      // Remove from mastered words
      progress.masteredWordIds = progress.masteredWordIds.filter((id) => id !== wordId);
      this.recordActivity('vocab', courseId, 5);
    }

    this.saveCourseProgress(courseId, progress);
  }

  // Mark scenario completed
  public markScenarioCompleted(courseId: string, scenarioId: string) {
    const progress = this.getCourseProgress(courseId);
    if (!progress.completedScenarioIds.includes(scenarioId)) {
      progress.completedScenarioIds.push(scenarioId);
      this.saveCourseProgress(courseId, progress);
      this.recordActivity('scenario', courseId, 30);
    }
  }

  // Get weekly activity for Recharts (last 7 days)
  public getWeeklyActivity(): Array<{ day: string; date: string; lessons: number; vocab: number; quizzes: number; total: number }> {
    const stats = this.getGlobalStats();
    const result = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const dayName = daysOfWeek[d.getDay()];

      const act = stats.dailyActivities[dateKey];
      const lessons = act ? act.lessonsCompleted : 0;
      const vocab = act ? act.wordsReviewed : 0;
      const quizzes = act ? act.quizzesTaken : 0;

      result.push({
        day: dayName,
        date: dateKey,
        lessons,
        vocab,
        quizzes,
        total: lessons + vocab + quizzes,
      });
    }

    return result;
  }

  // Get today's progress towards daily goal
  public getTodayGoalProgress(): { current: number; target: number; percentage: number } {
    const stats = this.getGlobalStats();
    const todayKey = getTodayKey();
    const act = stats.dailyActivities[todayKey];
    const current = act ? act.lessonsCompleted + act.wordsReviewed + act.quizzesTaken : 0;
    const target = stats.dailyGoal || 5;
    const percentage = Math.min(100, Math.round((current / target) * 100));
    return { current, target, percentage };
  }

  // Reset demo progress after confirmation
  public resetAllProgress() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_COURSE);
      localStorage.removeItem(STORAGE_KEYS.GLOBAL_STATS);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      // Clean course progresses
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEYS.COURSE_PROGRESS_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
  }

  // Populate sample baseline demo data
  public seedDemoData() {
    const courseId = 'en-es';
    const course = getCourse('en', 'es');
    if (!course) return;

    const progress: CourseProgress = {
      completedLessonIds: [course.lessons[0].id, course.lessons[1].id],
      bookmarkedWordIds: [course.vocabulary[0].id],
      weakWordIds: [course.vocabulary[2]?.id || 'es-voc-3'],
      masteredWordIds: [course.vocabulary[0].id, course.vocabulary[1].id],
      completedScenarioIds: [course.scenarios[0].id],
    };

    this.saveCourseProgress(courseId, progress);

    const today = getTodayKey();
    const stats: GlobalStats = {
      quizHistory: [
        {
          id: 'quiz_demo_1',
          timestamp: new Date().toISOString(),
          courseId: 'en-es',
          topic: 'introductions',
          score: 4,
          totalQuestions: 5,
          percentage: 80,
        },
      ],
      dailyActivities: {
        [today]: {
          date: today,
          lessonsCompleted: 2,
          wordsReviewed: 2,
          quizzesTaken: 1,
          xpEarned: 85,
        },
      },
      currentStreak: 2,
      longestStreak: 4,
      lastActiveDate: today,
      dailyGoal: 5,
      xp: 145,
    };
    this.saveGlobalStats(stats);
  }
}

export const storageService = new StorageService();
