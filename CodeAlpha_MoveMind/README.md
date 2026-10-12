# MoveMind — Your Personal Activity Companion

MoveMind is a responsive, local-first fitness habit tracker built with React, TypeScript, Vite, Tailwind CSS, Lucide, and Recharts. It helps you record activity at your own pace, set personal goals, plan a flexible week, and reflect on your habits.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```bash
npm run build
npm run preview
```

## Features

- Dashboard with daily steps, active minutes, logged sessions, and manually entered calories alongside configurable goals.
- Manual activity logging for walking, running, cycling, yoga, strength training, stretching, and custom activities. Edit and delete records from the activity log.
- Personal step, active-minute, and weekly workout goals, plus an editable weekly activity plan.
- Rule-based, transparent activity prompts and an optional mood/energy check-in.
- Interactive weekly charts, activity date filters, daily summaries, calendar history, and consistency milestones.
- CSV export and reset-to-sample-data action.
- Responsive desktop sidebar and mobile navigation; data is saved in browser LocalStorage.

## Data and privacy

First launch includes clearly marked sample activity records for the current and previous week. The app stores records, goals, plans, and mood check-ins in LocalStorage on this device. There is no account, backend, sensor integration, or automatic step detection. Steps and calories are manually entered; sample records are labelled as sample. Reset sample data replaces saved records and preferences after confirmation. CSV export downloads the currently filtered history.

MoveMind's suggestions are simple prompts based on the activity log, not medical advice or predictions. Goals and plans are personal and can be changed at any time; rest and changing plans are always okay.
