export type LanguageCode = 'en' | 'es' | 'hi' | 'ta' | 'fr' | 'ja';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  scriptDirection: 'ltr' | 'rtl';
  description: string;
}

export type LessonCategory = 'vocabulary' | 'grammar' | 'phrases' | 'conversation';

export type LessonTopic = 
  | 'introductions'
  | 'shopping'
  | 'travel'
  | 'food'
  | 'college'
  | 'job_interview';

export interface LessonTopicInfo {
  id: LessonTopic;
  title: string;
  description: string;
  iconName: string;
  level: 'Beginner' | 'Intermediate';
}

export interface LessonItem {
  id: string;
  topic: LessonTopic;
  category: LessonCategory;
  targetText: string;
  nativeScript?: string;
  phonetic: string;
  translation: string;
  exampleTarget: string;
  exampleTranslation: string;
  grammarNote?: string;
  audioSupported: boolean;
}

export interface VocabularyCard {
  id: string;
  topic: LessonTopic;
  targetText: string;
  nativeScript?: string;
  phonetic: string;
  translation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'expression';
  exampleTarget: string;
  exampleTranslation: string;
  usageTip?: string;
}

export type QuestionType = 'multiple_choice' | 'matching' | 'fill_blank';

export interface MatchingPair {
  id: string;
  left: string; // target language
  right: string; // source translation
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  topic: LessonTopic;
  prompt: string;
  targetScript?: string;
  phonetic?: string;
  options?: string[]; // For multiple_choice
  correctAnswer?: string; // For multiple_choice and fill_blank
  matchingPairs?: MatchingPair[]; // For matching
  sentenceWithBlank?: string; // For fill_blank e.g. "Yo ___ cafe por la mañana."
  blankOptions?: string[]; // For fill_blank
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  phonetic?: string;
  translation: string;
  quality: 'best' | 'acceptable' | 'inappropriate';
  feedback: string;
  nextStepId?: string; // For branching
}

export interface ScenarioStep {
  id: string;
  speaker: string;
  speakerRole: string;
  avatar: string;
  messageTarget: string;
  messagePhonetic?: string;
  messageTranslation: string;
  audioSupported?: boolean;
  options: ScenarioOption[];
}

export interface Scenario {
  id: string;
  topic: LessonTopic;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate';
  culturalContext: string;
  interlocutorName: string;
  interlocutorRole: string;
  interlocutorAvatar: string;
  steps: ScenarioStep[];
}

export interface QuizResultRecord {
  id: string;
  timestamp: string;
  courseId: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  lessonsCompleted: number;
  wordsReviewed: number;
  quizzesTaken: number;
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'lessons' | 'quizzes' | 'scenarios' | 'streak' | 'vocab';
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserProgressData {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  completedLessonIds: string[];
  bookmarkedWordIds: string[];
  weakWordIds: string[]; // Needs practice
  masteredWordIds: string[];
  completedScenarioIds: string[];
  quizHistory: QuizResultRecord[];
  dailyActivities: Record<string, DailyActivity>; // Keyed by YYYY-MM-DD
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  dailyGoal: number; // e.g. 5 activities per day
  xp: number;
  unlockedAchievements: string[];
}

export interface CourseData {
  id: string; // e.g. "en-es"
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  title: string;
  description: string;
  isVerified: boolean;
  lessons: LessonItem[];
  vocabulary: VocabularyCard[];
  quizzes: QuizQuestion[];
  scenarios: Scenario[];
}

export type ViewTab = 
  | 'dashboard'
  | 'lessons'
  | 'vocabulary'
  | 'practice'
  | 'scenarios'
  | 'analytics'
  | 'achievements';
