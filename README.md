# RecallQuest — Learn Smarter, Remember Longer

A local-first flashcard study app with spaced repetition, deck-based quizzes, activity analytics, and session-based rewards. Built with React, TypeScript, Vite, Tailwind CSS, Lucide, and Recharts.

## Run locally

Requirements: Node.js 20+ and pnpm 11 (the project pins pnpm 11.25.0).

```bash
pnpm install
pnpm dev
```

Vite prints the local URL after starting. Create a production build with `pnpm build`; preview the production output using `pnpm preview`.

## What is included

- **Dashboard:** Total, mastered, and due cards; study streak; daily goal; weekly activity and performance; quick-start actions.
- **Library:** Search and filter cards, add/edit/delete cards, and create/edit/delete decks. Subjects are editable on every card and can be introduced when creating a deck. Seed decks cover Java, Mathematics, Artificial Intelligence, and General Knowledge.
- **Study:** Due-card or full-library sessions, answer reveal, previous/next navigation, and Again/Hard/Good/Easy confidence ratings.
- **Quiz:** Select a deck (or all cards), choose multiple choice or answer reveal, receive per-question feedback, see a final score, and retry only missed questions.
- **Analytics:** Accuracy, completed reviews, study time, seven-day activity, difficult cards, and subjects to revisit.
- **Rewards:** Points, study streaks, and milestone badges. A session/result has a unique ID and is recorded once; refreshing cannot award it again.
- **Preferences:** Daily review goal and default quiz mode are saved with the rest of the local data. Use “Reset demo data” to restore the included sample decks/cards.

## Spaced repetition

Each confidence rating updates the card's next review date. **Again** resets progress and schedules 1 day; **Hard** grows the interval conservatively (about 1.2×); **Good** schedules 1 day for a new card, then 3 days, then approximately `previous interval × ease`; **Easy** schedules 4 days for a new card, then approximately `previous interval × ease × 1.3`. Ease begins at 2.5, moves down slightly on Again/Hard and up slightly on Easy, and is bounded between 1.3 and 3.0. Dates and rating history are visible in the app's card detail and persisted locally.

## Data and privacy

All flashcards, decks, review schedules, study history, quiz results, rewards, and preferences are stored in this browser's LocalStorage. No account, backend, paid API, or server-side data collection is required. Clearing site data removes the app's saved state; the reset action re-seeds the demo cards and decks.

## Project structure

```text
src/
  components/  shared layout, navigation, dialogs, charts, and UI primitives
  data/        first-run demo decks and flashcards
  lib/         LocalStorage, spaced repetition, streak, and activity calculations
  pages/       Dashboard, Library, Study, Quiz, and Analytics views
  App.tsx      app state, navigation, and data mutations
  types.ts     persisted model types
```
