# LinguaLoop — Practice Real-Life Conversations

> **CodeAlpha Language Learning Web Application Submission**  
> Suggested Repository Name: `CodeAlpha_LinguaLoop`

**LinguaLoop** is a complete, fully functional, responsive language-learning web application designed to take beginner and intermediate learners from isolated word memorization to genuine, real-life conversational confidence. Built with **React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts**, and the browser's native **Web Speech API**, LinguaLoop operates entirely client-side with persistent progress stored in **LocalStorage** and zero external backend or paid API dependencies.

---

## 🌟 Highlights & Signature Features

### 1. Real-Life Scenario Practice — Signature Feature
- **Branching Conversational Simulations**: Practice across 6 critical real-life domains:
  1. **Introductions & Greetings**: Meeting new teammates or classmates.
  2. **Shopping & Market**: Bargaining with artisans, asking prices, and requesting sizes.
  3. **Travel & Transit**: Navigating train stations, airport check-in, and street directions.
  4. **Food & Dining**: Ordering regional delicacies, specifying dietary/vegetarian preferences, and asking for the bill.
  5. **College & Student Life**: Collaborative group project discussions, deadlines, and campus library etiquette.
  6. **Job Interviews & Careers**: Professional introductions, articulating software engineering experience, and discussing problem-solving methodologies.
- **Contextual Cultural Etiquette Feedback**: Every response option (Best, Acceptable, Inappropriate) features in-depth cultural analysis explaining politeness registers (e.g. *Tú* vs *Usted* in Spanish, *Aap* vs *Tum* in Hindi, *Neenga* vs *Nee* in Tamil), idioms, and common beginner traps.
- **Audio Speech Pronunciation**: Hear native character dialogues spoken aloud via Web Speech API.

### 2. Multi-Language Selection with Verified Datasets
- **Source & Target Languages**: English, Spanish (Español), Hindi (हिन्दी), Tamil (தமிழ்), French (Français), and Japanese (日本語).
- **Authentic Scripts & Phonetics**:
  - **English ➔ Spanish**: Authentic Iberian & Latin American usage, grammar nuances (*Ser* vs *Estar*).
  - **English ➔ Hindi**: Authentic Devanagari script (e.g., नमस्ते, आप कैसे हैं?), Romanized transliteration, and postposition notes.
  - **English ➔ Tamil**: Authentic Tamil script (e.g., வணக்கம்! என் பெயர்...), Romanized transliteration, and honorifics.
  - **English ➔ French & Japanese**: Verified essentials, Kanji/Kana + Romaji, and dining etiquette.
- **Truth in Data**: No hallucinated or invented machine translations. Unverified language pairs clearly display a verification status indicator.
- **Safe Course Switching**: Switch active language courses anytime without deleting existing progress in other courses.

### 3. Home Dashboard & Daily Study Goals
- **Real Calculated Metrics**:
  - Lessons Completed count & progress bar.
  - Words Mastered count & difficult words counter.
  - Quiz Accuracy % calculated across all historical quiz sessions.
  - Active Daily Learning Streak (calculated from local calendar dates `YYYY-MM-DD`).
- **Interactive Daily Goal Ring**: Visual circular completion tracker with customizable daily target (3, 5, 8, 10, or 15 activities).
- **Direct Action Buttons**:
  - **Continue Learning**: Directly opens the active lesson catalog.
  - **Practice Weak Words**: Launches flashcards or quizzes filtered directly to difficult items.
  - **Explore Scenarios**: Jumps straight into real-life branching dialogues.

### 4. Daily Lessons Catalog
- **Categorized Learning**: Vocabulary, Grammar, Phrases, and Conversation.
- **Interactive Lesson Cards**:
  - Native script & target phrase.
  - Phonetic transliteration guide (`🗣️`).
  - English translation and usage context.
  - Contextual example sentences.
  - Grammar tip / cultural nuance highlight box (`💡 Note`).
  - Web Speech API pronunciation button with visual speaking wave indicator.
  - Toggle Mark as Completed button.
  - Toggle Bookmark button for quick review.

### 5. Interactive 3D Vocabulary Flashcards
- **3D Card Flip Perspective**: Smooth CSS transforms (`perspective: 1000px`, `transform-style: preserve-3d`).
- **Spaced Self-Grading**: Rate recall with **"Needs Practice"** (tags as weak word) or **"Known / Mastered"** (records mastery).
- **Deck Filters**: Switch between **All Words**, **Weak / Difficult Words Only**, or **Bookmarked Words**.
- **Keyboard Shortcuts**:
  - `Space` — Flip card
  - `→` / `Next` — Next card
  - `←` / `Prev` — Previous card
  - `1` — Mark Needs Practice
  - `2` — Mark Known / Mastered

### 6. Multi-Format Quiz & Practice Engine
- **Three Dynamic Exercise Formats**:
  1. **Multiple Choice Questions**: Comprehension and translation selection.
  2. **Interactive Translation Matching**: Click-to-pair target terms with English meanings.
  3. **Cloze Fill-in-the-Blank**: Sentence completion testing grammar and verbs.
- **Immediate Explanation**: Detailed rationale provided after every answer explaining why it is correct and the cultural/grammatical context.
- **Results Celebration**: Final score %, accuracy badge, celebratory confetti (`canvas-confetti`), audio fanfare, and option to retry or practice weak words.

### 7. Learning Analytics & Progress Visualizer
- **Recharts Interactive Data Visualizations**:
  - **Weekly Learning Consistency**: 7-day multi-bar chart comparing lessons, vocabulary, and quizzes completed per day.
  - **Quiz Accuracy Trend**: Historical line chart mapping accuracy percentage across test sessions.
  - **Topic Competency Breakdown**: Progress bars analyzing completion across the 6 topics.
- **Difficult Vocabulary Manager**: Comprehensive table listing all words tagged as "Needs Practice" with pronunciation buttons and one-click "Mark Mastered" action.

### 8. Streaks, Achievements & Settings
- **Calendar-Based Streak Engine**: Tracks daily learning using local dates (`YYYY-MM-DD`).
- **Badge Showcase**: 9 unlockable milestones with progress bars and timestamps (e.g., First Words, Lexicon Champion, Perfect Score, Cultural Diplomat, 3-Day Streak, Goal Crusher).
- **Custom Daily Goals & Speech Testing**: Adjust target activity volume and test browser speech synthesis.
- **Reset Demo Progress**: 2-step confirmation modal allowing full reset or seeding of sample starter progress.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Data Analytics Charts** | [Recharts](https://recharts.org/) |
| **Pronunciation & Audio** | Native **Web Speech API** + **Web Audio API** Synthesizer |
| **Celebratory FX** | [Canvas Confetti](https://github.com/catdad/canvas-confetti) |
| **Persistence** | Browser `localStorage` (Namespaced, Zero Backend Needed) |

---

## 📁 Project Structure

```
CodeAlpha_LinguaLoop/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx                # Top header + mobile bottom navigation
│   │   │   ├── Sidebar.tsx               # Desktop sidebar navigation
│   │   │   ├── DashboardView.tsx         # Dashboard with metrics, goal ring & weekly chart
│   │   │   ├── DailyLessonsView.tsx      # Lessons catalog with filters, phonetics & TTS
│   │   │   ├── VocabularyCardsView.tsx   # 3D interactive flashcards with recall rating
│   │   │   ├── QuizPracticeView.tsx      # Multi-format quiz engine (MCQ, Matching, Cloze)
│   │   │   ├── ScenarioPracticeView.tsx  # Signature Feature: Branching real-life scenarios
│   │   │   ├── ProgressAnalyticsView.tsx # Recharts analytics + difficult words table
│   │   │   ├── LanguageSelectorModal.tsx # Multi-language course selector & validation
│   │   │   ├── AchievementsModal.tsx     # Milestones & badge showcase
│   │   │   └── SettingsModal.tsx         # Daily goal adjuster & reset confirmation
│   │   ├── data/
│   │   │   ├── languages.ts              # Supported language registry & topic metadata
│   │   │   ├── achievements.ts           # Milestone definitions
│   │   │   └── courses/
│   │   │       ├── en-es.ts              # English to Spanish full verified course
│   │   │       ├── en-hi.ts              # English to Hindi (Devanagari + phonetics)
│   │   │       ├── en-ta.ts              # English to Tamil (Tamil script + phonetics)
│   │   │       ├── en-fr.ts              # English to French verified starter pack
│   │   │       ├── en-ja.ts              # English to Japanese (Kana + Romaji)
│   │   │       └── registry.ts           # Course loader & validation helper
│   │   ├── services/
│   │   │   ├── speechService.ts          # Web Speech TTS & Web Audio FX synthesizer
│   │   │   └── storageService.ts         # Typed LocalStorage persistence & streak tracker
│   │   ├── types/
│   │   │   └── language.ts               # Core TypeScript models & schemas
│   │   ├── App.tsx                       # Root view router & global state manager
│   │   ├── index.css                     # Tailwind v4, keyframe animations, 3D card CSS
│   │   └── main.tsx                      # React root entry point
│   ├── index.html                        # Application HTML entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── package.json                          # Root repository scripts
└── README.md                             # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Installation
Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/CodeAlpha_LinguaLoop.git
cd CodeAlpha_LinguaLoop

# Install frontend dependencies
cd frontend
npm install
```

### Running in Development Mode
Start the Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173` to interact with **LinguaLoop**.

### Production Build
Create an optimized production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🌐 Audio & Speech Synthesis Support

LinguaLoop leverages the browser's standard **Web Speech API** (`window.speechSynthesis`):
- Automatically matches installed voices for target languages (`es-ES`/`es-MX`, `hi-IN`, `ta-IN`, `fr-FR`, `ja-JP`, `en-US`).
- Speech rate is comfortably calibrated for language learners (0.9x).
- **Graceful Fallback**: If a specific language voice is not pre-installed on the operating system, LinguaLoop falls back seamlessly without throwing errors, and interface chimes continue to play via the Web Audio API.

---

## 📄 License & Attribution

Developed for the **CodeAlpha Web Development Internship**.  
Released under the [MIT License](LICENSE).
