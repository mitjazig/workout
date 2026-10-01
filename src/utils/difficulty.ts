import type { TrainingDay, WorkoutDifficulty } from '../types';
import type { MorningRoutine } from '../data/morningRoutines';

export const DIFFICULTY_LABELS: Record<WorkoutDifficulty, string> = {
  easy: 'Lahko',
  standard: 'Standard',
};

/** Jutranje ponovitve: lahko ≈ polovica (npr. 60 → 30). */
export function scaleMorningRoutine(
  routine: MorningRoutine,
  difficulty: WorkoutDifficulty,
): MorningRoutine {
  if (difficulty === 'standard') return routine;

  const moves = routine.moves.map((m) => {
    const reps = Math.max(15, Math.round(m.reps / 2));
    return {
      ...m,
      reps,
      durationSeconds: Math.max(20, Math.round(reps * 0.9)),
    };
  });

  const minutes = Math.max(
    1,
    Math.round(moves.reduce((s, m) => s + m.durationSeconds, 0) / 60),
  );

  return {
    ...routine,
    estimatedMinutes: minutes,
    subtitle: `${moves.length} gibov · ~${minutes} min · lahko`,
    moves,
  };
}

/** Dan izziva: lahko skrajša časovnike (~70 %). */
export function scaleTrainingDay(
  day: TrainingDay,
  difficulty: WorkoutDifficulty,
): TrainingDay {
  if (difficulty === 'standard') return day;

  const exercises = day.exercises.map((e) => ({
    ...e,
    durationSeconds: Math.max(20, Math.round(e.durationSeconds * 0.7)),
  }));

  const estimatedMinutes = Math.max(
    5,
    Math.round(exercises.reduce((s, e) => s + e.durationSeconds, 0) / 60),
  );

  return {
    ...day,
    estimatedMinutes,
    exercises,
  };
}
