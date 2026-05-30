export const SKILLS = [
  'reading',
  'writing',
  'speaking',
  'math',
  'memory',
  'focus',
  'communication',
  'decisionMaking',
  'productivity',
] as const

export type Skill = (typeof SKILLS)[number]

export type ExerciseKind = 'multipleChoice' | 'text'

export interface ExerciseTemplate {
  id: string
  title: string
  category: string
  skill: Skill
  kind: ExerciseKind
  prompt: string
  options?: string[]
  answer: string
  acceptedAnswers?: string[]
  explanation: string
  timeLimitSec: number
  minDifficulty: number
  maxDifficulty: number
}

export interface DailyExercise extends ExerciseTemplate {
  difficulty: number
}

export interface SessionResult {
  exerciseId: string
  skill: Skill
  score: number
  correct: boolean
}

export interface WorkoutHistory {
  date: string
  totalScore: number
  completedExercises: number
  skillDeltas: Partial<Record<Skill, number>>
}

export interface Streak {
  current: number
  best: number
  lastCompletedDate: string | null
}

export interface ProgressState {
  skillScores: Record<Skill, number>
  skillLevels: Record<Skill, number>
  recentSkillScores: Record<Skill, number[]>
  streak: Streak
  history: WorkoutHistory[]
  totalPoints: number
  workoutPlans: Record<string, DailyExercise[]>
}

export const STORAGE_KEY = 'neurogames.progress.v1'

export const EXERCISE_LIBRARY: ExerciseTemplate[] = [
  {
    id: 'reading-speed-1',
    title: 'Reading Sprint',
    category: 'Timed reading comprehension',
    skill: 'reading',
    kind: 'multipleChoice',
    prompt:
      'A short memo says: “Shipments are delayed only for coastal warehouses due to weather.” Which location should still receive on time?',
    options: ['Coastal hub', 'Inland fulfillment center', 'Any warehouse near the ocean', 'All locations are delayed'],
    answer: 'Inland fulfillment center',
    explanation: 'Only coastal warehouses are delayed, so inland centers are unaffected.',
    timeLimitSec: 35,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'vocab-match-1',
    title: 'Vocabulary Match',
    category: 'Vocabulary matching',
    skill: 'writing',
    kind: 'multipleChoice',
    prompt: 'Choose the best synonym for “concise.”',
    options: ['Verbose', 'Brief', 'Unclear', 'Emotional'],
    answer: 'Brief',
    explanation: 'Concise means expressing much in few words.',
    timeLimitSec: 28,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'sentence-clarity-1',
    title: 'Sentence Clarity',
    category: 'Sentence clarity',
    skill: 'communication',
    kind: 'multipleChoice',
    prompt: 'Which rewrite is clearest?',
    options: [
      'Given the time constraints, maybe we could possibly review later.',
      'Let’s review this tomorrow at 10 AM for 15 minutes.',
      'Reviewing might happen if schedules align.',
      'A future review is perhaps an option.',
    ],
    answer: 'Let’s review this tomorrow at 10 AM for 15 minutes.',
    explanation: 'The clearest sentence is specific, direct, and actionable.',
    timeLimitSec: 30,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'grammar-fix-1',
    title: 'Grammar Fix',
    category: 'Grammar correction',
    skill: 'writing',
    kind: 'text',
    prompt: 'Correct this sentence: “Neither the manager nor the interns was ready.”',
    answer: 'Neither the manager nor the interns were ready.',
    acceptedAnswers: ['Neither the manager nor the interns were ready'],
    explanation: 'With “nor,” the verb agrees with the nearer subject: interns → were.',
    timeLimitSec: 40,
    minDifficulty: 2,
    maxDifficulty: 5,
  },
  {
    id: 'mental-math-1',
    title: 'Mental Math',
    category: 'Mental math',
    skill: 'math',
    kind: 'text',
    prompt: 'You buy 3 items at $14 each and use a $5 coupon. Total?',
    answer: '37',
    acceptedAnswers: ['37', '$37'],
    explanation: '3 × 14 = 42, then 42 - 5 = 37.',
    timeLimitSec: 30,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'memory-recall-1',
    title: 'Memory Recall',
    category: 'Memory sequence recall',
    skill: 'memory',
    kind: 'text',
    prompt: 'Memorize and type this sequence: 8-2-9-4-1',
    answer: '82941',
    acceptedAnswers: ['8-2-9-4-1', '82941'],
    explanation: 'The correct order is 8, 2, 9, 4, 1.',
    timeLimitSec: 25,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'prioritization-1',
    title: 'Priority Stack',
    category: 'Prioritization',
    skill: 'productivity',
    kind: 'multipleChoice',
    prompt: 'Which task should you do first?',
    options: [
      'Color-code old notes',
      'Fix a production bug affecting customers',
      'Reorganize desktop folders',
      'Draft ideas for next quarter',
    ],
    answer: 'Fix a production bug affecting customers',
    explanation: 'Urgent, high-impact work should be prioritized first.',
    timeLimitSec: 30,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'listening-style-1',
    title: 'Response Tone',
    category: 'Listening/speaking-style prompt',
    skill: 'speaking',
    kind: 'multipleChoice',
    prompt: 'A teammate says they feel overwhelmed. Pick the strongest response.',
    options: [
      '“You should just relax.”',
      '“I hear you. Let’s break this into two priorities and reassign one task.”',
      '“Everyone is busy.”',
      '“Noted.”',
    ],
    answer: '“I hear you. Let’s break this into two priorities and reassign one task.”',
    explanation: 'Active listening + practical action improves communication.',
    timeLimitSec: 35,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'decision-drill-1',
    title: 'Decision Drill',
    category: 'Quick decision drill',
    skill: 'decisionMaking',
    kind: 'multipleChoice',
    prompt: 'You have 5 minutes before a meeting. Best use of time?',
    options: [
      'Open unrelated messages',
      'Skim agenda and note one key question',
      'Start a long report',
      'Delay and improvise in meeting',
    ],
    answer: 'Skim agenda and note one key question',
    explanation: 'Fast, high-value preparation improves meeting quality.',
    timeLimitSec: 20,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
  {
    id: 'focus-filter-1',
    title: 'Focus Filter',
    category: 'Selective focus',
    skill: 'focus',
    kind: 'multipleChoice',
    prompt: 'Your phone pings while finishing a deadline. Best action?',
    options: [
      'Check every notification now',
      'Enable Do Not Disturb for 20 minutes and finish the task',
      'Switch tasks every five minutes',
      'Reply to social chats first',
    ],
    answer: 'Enable Do Not Disturb for 20 minutes and finish the task',
    explanation: 'Reducing context switching preserves focus and speed.',
    timeLimitSec: 20,
    minDifficulty: 1,
    maxDifficulty: 5,
  },
]

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const buildDefaultMap = <T,>(builder: (skill: Skill) => T) =>
  SKILLS.reduce((acc, skill) => {
    acc[skill] = builder(skill)
    return acc
  }, {} as Record<Skill, T>)

export const createInitialProgressState = (): ProgressState => ({
  skillScores: buildDefaultMap(() => 50),
  skillLevels: buildDefaultMap(() => 1),
  recentSkillScores: buildDefaultMap(() => []),
  streak: {
    current: 0,
    best: 0,
    lastCompletedDate: null,
  },
  history: [],
  totalPoints: 0,
  workoutPlans: {},
})

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.,!?$]/g, '')

export const evaluateAnswer = (exercise: DailyExercise, answer: string) => {
  if (!answer.trim()) {
    return false
  }

  const expected = normalize(exercise.answer)
  const given = normalize(answer)

  if (exercise.kind === 'multipleChoice') {
    return given === expected
  }

  const alternatives = (exercise.acceptedAnswers ?? []).map(normalize)
  return given === expected || alternatives.includes(given)
}

export const scoreExercise = ({
  correct,
  timeLimitSec,
  timeSpentSec,
  difficulty,
}: {
  correct: boolean
  timeLimitSec: number
  timeSpentSec: number
  difficulty: number
}) => {
  const safeTime = clamp(timeSpentSec, 0, timeLimitSec)
  const base = correct ? 65 : 20
  const speedBonus = correct ? ((timeLimitSec - safeTime) / timeLimitSec) * 25 : 0
  const difficultyBonus = difficulty * 2
  return Math.round(clamp(base + speedBonus + difficultyBonus, 0, 100))
}

const getDateAsKey = (date: Date) => date.toISOString().slice(0, 10)

const isConsecutive = (lastDateKey: string, currentDateKey: string) => {
  const oneDayMs = 24 * 60 * 60 * 1000
  const lastDate = new Date(`${lastDateKey}T00:00:00Z`).getTime()
  const currentDate = new Date(`${currentDateKey}T00:00:00Z`).getTime()
  return currentDate - lastDate === oneDayMs
}

const toDifficulty = (level: number, template: ExerciseTemplate) =>
  clamp(level, template.minDifficulty, template.maxDifficulty)

export const buildDailyWorkout = (progress: ProgressState, dateKey: string) => {
  const seededValue = Number(dateKey.replace(/-/g, ''))
  const workoutSize = 3 + (seededValue % 3)
  const rankedSkills = [...SKILLS].sort(
    (a, b) => progress.skillScores[a] - progress.skillScores[b] || progress.skillLevels[a] - progress.skillLevels[b],
  )

  const picked: DailyExercise[] = []
  const used = new Set<string>()

  rankedSkills.forEach((skill) => {
    if (picked.length >= workoutSize) {
      return
    }

    const match = EXERCISE_LIBRARY.find((exercise) => exercise.skill === skill && !used.has(exercise.id))
    if (!match) {
      return
    }

    used.add(match.id)
    picked.push({
      ...match,
      difficulty: toDifficulty(progress.skillLevels[skill], match),
    })
  })

  for (const exercise of EXERCISE_LIBRARY) {
    if (picked.length >= workoutSize) {
      break
    }

    if (used.has(exercise.id)) {
      continue
    }

    used.add(exercise.id)
    picked.push({
      ...exercise,
      difficulty: toDifficulty(progress.skillLevels[exercise.skill], exercise),
    })
  }

  return picked
}

export const getTodayKey = () => getDateAsKey(new Date())

const hasCompletedOnDate = (progress: ProgressState, dateKey: string) =>
  progress.history.some((entry) => entry.date === dateKey)

export const ensureWorkoutForDate = (progress: ProgressState, dateKey: string) => {
  if (progress.workoutPlans[dateKey] || hasCompletedOnDate(progress, dateKey)) {
    return progress
  }

  return {
    ...progress,
    workoutPlans: {
      ...progress.workoutPlans,
      [dateKey]: buildDailyWorkout(progress, dateKey),
    },
  }
}

export const applyWorkoutResults = (progress: ProgressState, dateKey: string, results: SessionResult[]) => {
  if (!results.length) {
    return progress
  }

  const skillScores = { ...progress.skillScores }
  const skillLevels = { ...progress.skillLevels }
  const recentSkillScores = { ...progress.recentSkillScores }
  const skillDeltas: Partial<Record<Skill, number>> = {}

  results.forEach((result) => {
    const before = skillScores[result.skill]
    const delta = Math.round((result.score - 50) / 8)
    const after = clamp(before + delta, 0, 100)

    skillScores[result.skill] = after
    skillDeltas[result.skill] = (skillDeltas[result.skill] ?? 0) + (after - before)

    const recent = [...recentSkillScores[result.skill], result.score].slice(-6)
    recentSkillScores[result.skill] = recent

    const average = recent.reduce((sum, value) => sum + value, 0) / recent.length
    if (average > 76) {
      skillLevels[result.skill] = clamp(skillLevels[result.skill] + 1, 1, 10)
    } else if (average < 44) {
      skillLevels[result.skill] = clamp(skillLevels[result.skill] - 1, 1, 10)
    }
  })

  const totalScore = Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)
  const currentStreak = progress.streak.lastCompletedDate
    ? isConsecutive(progress.streak.lastCompletedDate, dateKey)
      ? progress.streak.current + 1
      : progress.streak.lastCompletedDate === dateKey
        ? progress.streak.current
        : 1
    : 1

  const updatedHistory = [
    {
      date: dateKey,
      totalScore,
      completedExercises: results.length,
      skillDeltas,
    },
    ...progress.history.filter((entry) => entry.date !== dateKey),
  ].slice(0, 60)

  return {
    ...progress,
    skillScores,
    skillLevels,
    recentSkillScores,
    totalPoints: progress.totalPoints + results.reduce((sum, item) => sum + item.score, 0),
    streak: {
      current: currentStreak,
      best: Math.max(progress.streak.best, currentStreak),
      lastCompletedDate: dateKey,
    },
    history: updatedHistory,
    workoutPlans: {
      ...progress.workoutPlans,
      [dateKey]: progress.workoutPlans[dateKey] ?? [],
    },
  }
}

export const loadProgress = (): ProgressState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createInitialProgressState()
    }

    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      ...createInitialProgressState(),
      ...parsed,
      skillScores: {
        ...createInitialProgressState().skillScores,
        ...(parsed.skillScores ?? {}),
      },
      skillLevels: {
        ...createInitialProgressState().skillLevels,
        ...(parsed.skillLevels ?? {}),
      },
      recentSkillScores: {
        ...createInitialProgressState().recentSkillScores,
        ...(parsed.recentSkillScores ?? {}),
      },
      streak: {
        ...createInitialProgressState().streak,
        ...(parsed.streak ?? {}),
      },
      history: parsed.history ?? [],
      workoutPlans: parsed.workoutPlans ?? {},
    }
  } catch {
    return createInitialProgressState()
  }
}

export const saveProgress = (progress: ProgressState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export const computeWeeklyCompletionRate = (progress: ProgressState, currentDateKey: string) => {
  const currentTime = new Date(`${currentDateKey}T00:00:00Z`).getTime()
  const week = 7

  const completed = progress.history.filter((entry) => {
    const entryTime = new Date(`${entry.date}T00:00:00Z`).getTime()
    return currentTime - entryTime >= 0 && currentTime - entryTime < week * 24 * 60 * 60 * 1000
  }).length

  return Math.round((completed / week) * 100)
}
