# RecallQuest implementation plan

## Product and implementation approach

RecallQuest is a usable, local-first study studio for creating flashcards, practicing active recall, checking knowledge with quizzes, and reviewing real learning progress. The project is a React + TypeScript single-page Vite app. Tailwind CSS and the project's small focused page-level CSS files establish the interface; Lucide icons provide consistent interaction cues; Recharts renders analytics. No authentication, paid API, or server database is needed.

Application state is initialized with four sample subject decks and their cards, then persisted in browser LocalStorage (flashcards, decks, review schedules, completed sessions, quiz results, points, badge milestones, and preferences). Mutations are typed and centralized in the app root. Study ratings feed an explainable, SM-2-inspired schedule; practice history drives the dashboard, analytics and milestone logic. Session and quiz IDs are unique and completion checks make rewards idempotent. Demo reset returns the sample dataset and default preferences.

The main product areas are:

- **Overview:** live card, mastery, due and streak measures; daily target; seven-day activity; deck/subject entry points; recent sessions and quizzes.
- **My library:** searchable/filterable cards, card create/edit/delete, and custom subject/deck create/edit/delete.
- **Study session:** due or deck selection, one-card-at-a-time recall, reveal, previous/next navigation, four confidence ratings, and a saved completion summary.
- **Quick quiz:** deck selection, multiple-choice or answer-reveal mode, objective scoring, explanation review, and a focused retry round for misses.
- **Progress:** recorded accuracy, review counts, session time, activity, challenging topics, and unlocked badges.
- **Settings:** durable daily goal and preferred quiz style plus a confirmed demo-data reset.

`public/manus-routes.json` declares the sole `/` SPA route. The production configuration builds Vite's static output into `dist`; the development preview listens on the initialized runtime port.

## Project structure

- `src/App.tsx` — root state, page selection, persistence wiring, CRUD mutations, reward idempotency, and toast feedback.
- `src/components/` — shared application shell, responsive navigation, page headings, and empty states.
- `src/pages/` — focused Dashboard, Library, Study, Quiz, Analytics, and Settings pages.
- `src/lib/storage.ts` — safe local loading/serialization and demo initialization.
- `src/lib/algorithms.ts` — spaced repetition, due/mastery state, streaks, badges, and activity series.
- `src/data/seed.ts` — first-run Java, Mathematics, Artificial Intelligence, and General Knowledge examples.
- `src/types.ts` — canonical models for app, cards, decks, study logs, quiz records, badges, and preferences.
- `src/*.css` and page-level CSS — navy/violet system, reusable UI, responsive page patterns, and motion.
- `public/` — static route manifest and favicon; project root — Vite/TypeScript/pnpm configuration, metadata, README, and this plan.

## Design direction

- **Design Movement:** A restrained editorial study-studio aesthetic, blending dark academic tools with a soft, contemporary digital atelier.
- **Core Principles:** Calm focus; visible progress; honest, forgiving feedback; generous spacing around the learning moment.
- **Color Philosophy:** Deep ink/navy lets study content stay central; an ownable lavender-violet marks intent and recall; mint means progress, amber means revisit, and muted ink text reduces glare rather than competing with content.
- **Layout Paradigm:** A persistent, narrow desktop rail anchors navigation while the main canvas unfolds in distinct study zones—overview metrics, an uneven chart/goal pairing, and a separate subjects/activity split. On small screens the rail yields to a compact drawer/mobile navigation, preserving the question or card as the focal surface.
- **Signature Elements:** An orbital compass “Q” mark with a tiny mint spark; lavender topographic/halo glows behind active cards; a thin violet recall-progress line paired with small mint checkpoints.
- **Interaction Philosophy:** Controls acknowledge a deliberate action immediately; quiz feedback explains a miss without shaming; study ratings state their next-review effect; destructive reset is explicit and confirmed. Search and filters act on the current library data, not a mock list.
- **Animation:** Short, purposeful transitions (roughly 180–300 ms) on focus, hover, page entry, and answer reveal; chart fills ease into view. Avoid looping decorative motion, keep transformations small, and honor reduced-motion preferences.
- **Typography System:** Manrope for brand, display titles and numeric metrics; DM Sans for labels, questions, explanations, navigation and controls. Use a clear size/weight ladder with readable line lengths and restrained uppercase micro-labels.
- **Brand Essence:** “A thoughtful study studio that helps curious learners turn small recall sessions into durable knowledge.” Personality: **thoughtful, encouraging, precise**.
- **Brand Voice:** Reassuring, specific and progress-oriented—never guilt-driven. Examples: “Give it a moment.” and “You showed up for yourself.”
- **Wordmark & Logo:** A lowercase recallquest wordmark paired with an orbital compass/recall glyph: a ringed question-mark/letterform and one mint spark, drawn as a custom geometric mark rather than a default type icon.
- **Signature Brand Color:** Lavender violet **#A79BFF**—a recognizable signal for focused recall and forward momentum.

## Dependencies and delivery constraints

The app uses only client-side dependencies; there are no environment secrets, external services, authentication flows, or managed-database writes. LocalStorage is browser/device scoped and is intentionally explained in the UI and README. pnpm is pinned and the Vite build is configured as a static-site build to `dist`.
