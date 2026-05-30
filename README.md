# Neurogames

Neurogames is a mobile-first cognitive training web app inspired by the structure of modern daily brain workout products.

Users open the app, complete a personalized daily workout of 3–5 short exercises, receive instant feedback, and track progress over time across core skills: reading, writing, speaking, math, memory, focus, communication, decision-making, and personal productivity.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- localStorage persistence (no backend required)

## Getting Started

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Linting:

```bash
npm run lint
```

## App Architecture

- `src/App.tsx`
  - Dashboard UI, workout flow, timer, feedback screens, analytics views
- `src/training.ts`
  - Exercise library
  - Skill model and workout planner
  - Scoring + adaptive difficulty logic
  - Streak tracking + progress persistence helpers
- `src/index.css`
  - Tailwind import + minimal global styles

## Exercise Data Model

`ExerciseTemplate` fields:

- `id`: stable exercise identifier
- `title`: display name
- `category`: exercise type label (e.g., timed reading comprehension)
- `skill`: mapped core skill domain
- `kind`: `multipleChoice | text`
- `prompt`: exercise instructions
- `options`: answer options for multiple choice
- `answer`: canonical answer
- `acceptedAnswers`: optional normalized alternatives for text answers
- `explanation`: instant feedback explanation
- `timeLimitSec`: timed challenge duration
- `minDifficulty` / `maxDifficulty`: adaptive difficulty boundaries

## Scoring + Adaptation System

Each exercise is scored from 0–100:

- Base points: correctness weighted (`65` correct / `20` incorrect)
- Speed bonus: faster correct responses earn more
- Difficulty bonus: higher difficulty earns extra points

Per-skill updates after each completed daily workout:

- Skill score deltas are applied from exercise score outcomes
- Recent per-skill score windows drive adaptive level changes
  - Strong average increases level
  - Weak average decreases level
- Daily workout selection prioritizes weaker skill areas first

## Progress Tracking

The app stores all progression in localStorage under `neurogames.progress.v1`:

- Skill scores and levels
- Current/best streak with date continuity checks
- Workout history (score + skill deltas)
- Total points
- Generated daily workout plans

## Included Exercise Types

- Timed reading comprehension
- Vocabulary matching
- Sentence clarity
- Grammar correction
- Mental math
- Memory sequence recall
- Prioritization
- Listening/speaking-style prompts
- Quick decision drills
- Focus filtering challenge

## UI Principles

- Premium minimal visual style
- Rounded cards and soft-glass panels
- Smooth progress/timer animations
- Progress rings + bars for analytics
- Mobile-first responsive layout

## Roadmap

- AI-generated dynamic exercises per skill and level
- User accounts + cloud sync
- Streak reminders/notifications
- Expanded analytics (weekly trends, per-exercise breakdowns)
- Audio capture for speaking/listening drills
