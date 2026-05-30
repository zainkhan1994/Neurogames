import { useEffect, useMemo, useState } from 'react'
import {
  SKILLS,
  applyWorkoutResults,
  buildDailyWorkout,
  computeWeeklyCompletionRate,
  evaluateAnswer,
  getTodayKey,
  loadProgress,
  saveProgress,
  scoreExercise,
  type SessionResult,
  type Skill,
} from './training'

const skillLabel: Record<Skill, string> = {
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
  math: 'Math',
  memory: 'Memory',
  focus: 'Focus',
  communication: 'Communication',
  decisionMaking: 'Decision',
  productivity: 'Productivity',
}

const ringColor = (score: number) => {
  if (score > 79) return '#34d399'
  if (score > 59) return '#60a5fa'
  if (score > 39) return '#f59e0b'
  return '#f87171'
}

interface LiveWorkoutState {
  index: number
  results: SessionResult[]
  feedback: {
    correct: boolean
    expected: string
    score: number
    explanation: string
  } | null
  exerciseStartedAt: number
}

function App() {
  const [progress, setProgress] = useState(loadProgress)
  const todayKey = getTodayKey()
  const [liveWorkout, setLiveWorkout] = useState<LiveWorkoutState | null>(null)
  const [answer, setAnswer] = useState('')
  const [tick, setTick] = useState(() => Date.now())

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const todayWorkout = useMemo(
    () => progress.workoutPlans[todayKey] ?? buildDailyWorkout(progress, todayKey),
    [progress, todayKey],
  )
  const hasCompletedToday = progress.history.some((entry) => entry.date === todayKey)

  const currentExercise = liveWorkout ? todayWorkout[liveWorkout.index] : null
  const timeLeft =
    liveWorkout && currentExercise
      ? Math.max(
          currentExercise.timeLimitSec -
            Math.floor((tick - liveWorkout.exerciseStartedAt) / 1000),
          0,
        )
      : 0

  useEffect(() => {
    if (!currentExercise || !liveWorkout || liveWorkout.feedback || timeLeft <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setTick(Date.now())
    }, 250)

    return () => window.clearInterval(timer)
  }, [currentExercise, liveWorkout, timeLeft])

  const weeklyCompletion = useMemo(
    () => computeWeeklyCompletionRate(progress, todayKey),
    [progress, todayKey],
  )

  const averageScore = useMemo(() => {
    if (!progress.history.length) {
      return 0
    }

    return Math.round(
      progress.history.reduce((sum, workout) => sum + workout.totalScore, 0) / progress.history.length,
    )
  }, [progress.history])

  const startWorkout = () => {
    if (!todayWorkout.length || hasCompletedToday) {
      return
    }

    setProgress((prev) =>
      prev.workoutPlans[todayKey]
        ? prev
        : {
            ...prev,
            workoutPlans: {
              ...prev.workoutPlans,
              [todayKey]: todayWorkout,
            },
          },
    )

    setLiveWorkout({
      index: 0,
      results: [],
      feedback: null,
      exerciseStartedAt: Date.now(),
    })
    setTick(Date.now())
    setAnswer('')
  }

  const submitCurrentAnswer = (forcedAnswer?: string) => {
    if (!liveWorkout || !currentExercise || liveWorkout.feedback) {
      return
    }

    const submittedAnswer = forcedAnswer ?? answer
    const correct = evaluateAnswer(currentExercise, submittedAnswer)
    const elapsed = Math.min(
      currentExercise.timeLimitSec,
      Math.floor((Date.now() - liveWorkout.exerciseStartedAt) / 1000),
    )
    const score = scoreExercise({
      correct,
      difficulty: currentExercise.difficulty,
      timeLimitSec: currentExercise.timeLimitSec,
      timeSpentSec: elapsed,
    })

    setLiveWorkout((prev) => {
      if (!prev) {
        return prev
      }

      return {
        ...prev,
        feedback: {
          correct,
          expected: currentExercise.answer,
          score,
          explanation: currentExercise.explanation,
        },
        results: [
          ...prev.results,
          {
            exerciseId: currentExercise.id,
            skill: currentExercise.skill,
            score,
            correct,
          },
        ],
      }
    })
  }

  const continueWorkout = () => {
    if (!liveWorkout) {
      return
    }

    const isLastExercise = liveWorkout.index >= todayWorkout.length - 1

    if (isLastExercise) {
      const updated = applyWorkoutResults(progress, todayKey, liveWorkout.results)
      setProgress(updated)
      setLiveWorkout(null)
      return
    }

    setLiveWorkout((prev) =>
      prev
        ? {
            ...prev,
            index: prev.index + 1,
            feedback: null,
            exerciseStartedAt: Date.now(),
          }
        : prev,
    )
    setTick(Date.now())
    setAnswer('')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur transition-all duration-300 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Neurogames</p>
              <h1 className="text-2xl font-semibold sm:text-3xl">Daily Cognitive Workout</h1>
              <p className="mt-1 text-sm text-slate-300">
                3–5 adaptive exercises across memory, language, logic, and focus.
              </p>
            </div>
            <div className="rounded-2xl border border-cyan-300/40 bg-cyan-400/10 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-widest text-cyan-200">Streak</p>
              <p className="text-xl font-semibold">{progress.streak.current} days</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <MetricCard label="Total Points" value={progress.totalPoints.toString()} />
          <MetricCard label="7-Day Completion" value={`${weeklyCompletion}%`} />
          <MetricCard label="Avg. Workout Score" value={`${averageScore}`} />
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Today&apos;s Personalized Plan</h2>
              <p className="text-sm text-slate-300">
                {todayWorkout.length} short exercises tuned to your weaker skill areas.
              </p>
            </div>
            {!liveWorkout && (
              <button
                type="button"
                className="rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={startWorkout}
                disabled={hasCompletedToday || !todayWorkout.length}
              >
                {hasCompletedToday ? 'Workout Completed' : 'Start Workout'}
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {todayWorkout.map((exercise, index) => (
              <div
                key={exercise.id}
                className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-cyan-300/40"
              >
                <p className="text-xs uppercase tracking-wider text-cyan-200">Exercise {index + 1}</p>
                <p className="mt-1 font-medium">{exercise.title}</p>
                <p className="mt-1 text-sm text-slate-300">{exercise.category}</p>
              </div>
            ))}
          </div>
        </section>

        {liveWorkout && currentExercise && (
          <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl transition-all duration-300 sm:p-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <p>
                Exercise {liveWorkout.index + 1} of {todayWorkout.length}
              </p>
              <p className="font-semibold text-cyan-200">{timeLeft}s</p>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{ width: `${(timeLeft / currentExercise.timeLimitSec) * 100}%` }}
              />
            </div>

            <h3 className="mt-4 text-xl font-semibold">{currentExercise.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{currentExercise.prompt}</p>

            <div className="mt-4">
              {currentExercise.kind === 'multipleChoice' ? (
                <div className="grid gap-3">
                  {currentExercise.options?.map((option) => (
                    <button
                      key={option}
                      type="button"
                      disabled={Boolean(liveWorkout.feedback)}
                      className={`rounded-xl border p-3 text-left text-sm transition ${
                        answer === option
                          ? 'border-cyan-300 bg-cyan-300/20'
                          : 'border-white/10 bg-white/5 hover:border-cyan-300/40'
                      } disabled:opacity-70`}
                      onClick={() => setAnswer(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  disabled={Boolean(liveWorkout.feedback)}
                  placeholder="Type your answer"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none transition focus:border-cyan-300"
                />
              )}
            </div>

            {!liveWorkout.feedback ? (
              <button
                type="button"
                onClick={() => submitCurrentAnswer()}
                className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-cyan-300"
              >
                Submit
              </button>
            ) : (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p
                  className={`font-semibold ${
                    liveWorkout.feedback.correct ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {liveWorkout.feedback.correct ? 'Great work!' : 'Keep improving!'} +
                  {liveWorkout.feedback.score} pts
                </p>
                {!liveWorkout.feedback.correct && (
                  <p className="mt-1 text-sm text-slate-300">
                    Correct answer: <span className="text-slate-100">{liveWorkout.feedback.expected}</span>
                  </p>
                )}
                <p className="mt-2 text-sm text-slate-300">{liveWorkout.feedback.explanation}</p>
                <button
                  type="button"
                  onClick={continueWorkout}
                  className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  {liveWorkout.index === todayWorkout.length - 1 ? 'Finish Workout' : 'Next Exercise'}
                </button>
              </div>
            )}
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg sm:p-6">
          <h2 className="text-lg font-semibold">Skill Scores</h2>
          <p className="text-sm text-slate-300">
            Scores adapt after each workout with difficulty progression per skill.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {SKILLS.map((skill) => (
              <SkillRing
                key={skill}
                label={skillLabel[skill]}
                score={progress.skillScores[skill]}
                level={progress.skillLevels[skill]}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg sm:p-6">
          <h2 className="text-lg font-semibold">Progress Analytics</h2>
          <div className="mt-4 space-y-3">
            {SKILLS.map((skill) => {
              const score = progress.skillScores[skill]
              return (
                <div key={skill}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{skillLabel[skill]}</span>
                    <span>{score}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${score}%`, backgroundColor: ringColor(score) }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:border-cyan-300/40">
      <p className="text-xs uppercase tracking-widest text-slate-300">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  )
}

function SkillRing({ label, score, level }: { label: string; score: number; level: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-center">
      <div
        className="mx-auto grid h-16 w-16 place-items-center rounded-full text-sm font-semibold"
        style={{
          background: `conic-gradient(${ringColor(score)} ${score * 3.6}deg, rgba(148, 163, 184, 0.25) 0deg)`,
        }}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-slate-900">{score}</span>
      </div>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-xs text-slate-300">Level {level}</p>
    </div>
  )
}

export default App
