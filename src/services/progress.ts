import type {
  ActivityDayGroup,
  ActivityLogItem,
  AppState,
  BadgeStatus,
  CardioMode,
  DayProgress,
  FeedbackSettings,
  HeatmapDay,
  MorningCompletion,
  BonusCompletion,
  ProgressStats,
  TreadmillCompletion,
  UserProgress,
  WeeklySummary,
  WorkoutDifficulty,
} from '../types';
import { getProgram, allPrograms } from '../data/programs';
import { challengeProgram } from '../data/challengeProgram';
import { getMorningRoutine } from '../data/morningRoutines';
import { getBonusRoutine } from '../data/bonusRoutines';
import { getTreadmillWorkout } from '../data/treadmillWorkouts';
import { BADGES } from '../data/badges';
import { storage } from './storage';

const STATE_KEY = 'app-state';
const STATE_VERSION = 13;

/** Hitri vnos steze (brez vodene seje) */
export const QUICK_TREADMILL_ID = 'tm-quick';

function newCompletionId(): string {
  return `tm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTreadmillCompletions(
  list: Array<
    Partial<TreadmillCompletion> &
      Pick<TreadmillCompletion, 'workoutId' | 'completedAt' | 'durationSeconds'>
  > | undefined,
): TreadmillCompletion[] {
  return (list ?? []).map((c, i) => ({
    id: c.id || `legacy-${c.workoutId}-${c.completedAt}-${i}`,
    workoutId: c.workoutId,
    completedAt: c.completedAt,
    durationSeconds: c.durationSeconds,
    distanceKm:
      typeof c.distanceKm === 'number' && Number.isFinite(c.distanceKm)
        ? Math.round(c.distanceKm * 100) / 100
        : undefined,
  }));
}

const defaultReminders = {
  enabled: false,
  time: '08:00',
  daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
};

const defaultFeedback: FeedbackSettings = {
  sound: false,
  haptics: true,
};

export function createDefaultProgress(programId: string): UserProgress {
  const now = new Date().toISOString();
  return {
    programId,
    startedAt: now,
    currentDayIndex: 0,
    completedDays: [],
    lastActiveAt: now,
  };
}

/** Začetni napredek za vse registrirane programe */
export function createInitialProgramsMap(
  existing?: Record<string, UserProgress> | Partial<Record<string, UserProgress>>,
): Record<string, UserProgress> {
  const programs: Record<string, UserProgress> = {};
  for (const program of allPrograms) {
    const saved = existing?.[program.id];
    if (saved && saved.programId) {
      programs[program.id] = {
        programId: program.id,
        startedAt: saved.startedAt || new Date().toISOString(),
        currentDayIndex:
          typeof saved.currentDayIndex === 'number' ? saved.currentDayIndex : 0,
        completedDays: Array.isArray(saved.completedDays) ? saved.completedDays : [],
        lastActiveAt: saved.lastActiveAt || saved.startedAt || new Date().toISOString(),
      };
    } else {
      programs[program.id] = createDefaultProgress(program.id);
    }
  }
  return programs;
}

function createDefaultState(): AppState {
  return {
    activeProgramId: challengeProgram.id,
    programs: createInitialProgramsMap(),
    reminders: defaultReminders,
    treadmillCompletions: [],
    morningCompletions: [],
    bonusCompletions: [],
    cardioMode: 'treadmill',
    feedback: defaultFeedback,
    onboardingDone: false,
    difficulty: 'standard',
    version: STATE_VERSION,
  };
}

function normalizeDifficulty(value: unknown): WorkoutDifficulty {
  return value === 'easy' ? 'easy' : 'standard';
}

function isKnownProgramId(id: string | undefined): id is string {
  return !!id && allPrograms.some((p) => p.id === id);
}

function migrateState(saved: Partial<AppState> & { progress?: UserProgress }): AppState {
  const base = createDefaultState();

  const knownVersions = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, STATE_VERSION];
  const hasPrograms =
    saved.programs &&
    (saved.programs[challengeProgram.id] ||
      Object.keys(saved.programs).some((id) => isKnownProgramId(id)));

  if (knownVersions.includes(saved.version as number) && hasPrograms) {
    const programs = createInitialProgramsMap(saved.programs);

    // Legacy: single `progress` field → challenge-10
    if (saved.progress && !saved.programs?.[challengeProgram.id]) {
      programs[challengeProgram.id] = {
        ...createDefaultProgress(challengeProgram.id),
        ...saved.progress,
        programId: challengeProgram.id,
      };
    }

    return {
      ...base,
      activeProgramId: isKnownProgramId(saved.activeProgramId)
        ? saved.activeProgramId
        : challengeProgram.id,
      programs,
      reminders: { ...base.reminders, ...saved.reminders },
      treadmillCompletions: normalizeTreadmillCompletions(saved.treadmillCompletions),
      morningCompletions: normalizeMorningCompletions(saved.morningCompletions),
      bonusCompletions: normalizeBonusCompletions(saved.bonusCompletions),
      cardioMode: saved.cardioMode === 'outdoor' ? 'outdoor' : 'treadmill',
      feedback: {
        // v12: zvok privzeto izklopljen (enkrat ob nadgradnji)
        sound:
          typeof saved.version === 'number' && saved.version >= 12
            ? (saved.feedback?.sound ?? false)
            : false,
        haptics: saved.feedback?.haptics ?? true,
      },
      onboardingDone: saved.onboardingDone === true,
      difficulty: normalizeDifficulty(saved.difficulty),
      version: STATE_VERSION,
    };
  }

  return base;
}

function normalizeMorningCompletions(
  list: Array<Partial<MorningCompletion> & Pick<MorningCompletion, 'routineId' | 'completedAt'>> | undefined,
): MorningCompletion[] {
  return (list ?? []).map((c, i) => ({
    id: c.id || `morning-legacy-${c.routineId}-${c.completedAt}-${i}`,
    routineId: c.routineId,
    completedAt: c.completedAt,
  }));
}

function normalizeBonusCompletions(
  list: Array<Partial<BonusCompletion> & Pick<BonusCompletion, 'routineId' | 'completedAt'>> | undefined,
): BonusCompletion[] {
  return (list ?? []).map((c, i) => ({
    id: c.id || `bonus-legacy-${c.routineId}-${c.completedAt}-${i}`,
    routineId: c.routineId,
    completedAt: c.completedAt,
  }));
}

export async function loadState(): Promise<AppState> {
  const saved = await storage.get<AppState & { progress?: UserProgress }>(STATE_KEY);
  if (!saved) return createDefaultState();
  return migrateState(saved);
}

export async function saveState(state: AppState): Promise<void> {
  await storage.set(STATE_KEY, { ...state, version: STATE_VERSION });
}

export function getActiveProgress(state: AppState): UserProgress {
  const id = state.activeProgramId;
  return state.programs[id] ?? createDefaultProgress(id);
}

/** Napredek posameznega programa (Hub kartice) – nikoli globalni active */
export function getProgramProgress(state: AppState, programId: string): UserProgress {
  return state.programs[programId] ?? createDefaultProgress(programId);
}

export function isProgramDayCompleted(
  state: AppState,
  programId: string,
  dayId: string,
): boolean {
  const program = getProgram(programId);
  const day = program.days.find((d) => d.id === dayId);
  const entry = getProgramProgress(state, programId).completedDays.find((d) => d.dayId === dayId);
  if (!day || !entry) return false;
  return day.exercises.every((e) => entry.exercisesCompleted.includes(e.id));
}

export function getProgramCompletedCount(state: AppState, programId: string): number {
  const program = getProgram(programId);
  return program.days.filter((d) => isProgramDayCompleted(state, programId, d.id)).length;
}

export function getProgramCompletionPercent(state: AppState, programId: string): number {
  const total = getProgram(programId).days.length;
  if (total === 0) return 0;
  return Math.round((getProgramCompletedCount(state, programId) / total) * 100);
}

export function isDayCompleted(state: AppState, dayId: string): boolean {
  return isProgramDayCompleted(state, state.activeProgramId, dayId);
}

export function hasDayProgress(state: AppState, dayId: string): boolean {
  return getDayExerciseProgress(state, dayId).length > 0;
}

export function getCompletedCount(state: AppState): number {
  return getProgramCompletedCount(state, state.activeProgramId);
}

export function getCompletionPercent(state: AppState, totalDays: number): number {
  if (totalDays === 0) return 0;
  return Math.round((getCompletedCount(state) / totalDays) * 100);
}

export async function setActiveProgram(state: AppState, programId: string): Promise<AppState> {
  const programs = { ...state.programs };
  if (!programs[programId]) {
    programs[programId] = createDefaultProgress(programId);
  }

  const updated: AppState = {
    ...state,
    activeProgramId: programId,
    programs,
  };

  await saveState(updated);
  return updated;
}

export async function markDayComplete(
  state: AppState,
  dayId: string,
  exercisesCompleted: string[],
): Promise<AppState> {
  const programId = state.activeProgramId;
  const program = getProgram(programId);
  const progress = getActiveProgress(state);
  const now = new Date().toISOString();

  const existing = progress.completedDays.filter((d) => d.dayId !== dayId);
  const entry: DayProgress = { dayId, completedAt: now, exercisesCompleted };

  const dayIndex = program.days.findIndex((d) => d.id === dayId);
  const nextIndex =
    dayIndex >= 0 && dayIndex >= progress.currentDayIndex
      ? Math.min(dayIndex + 1, program.days.length - 1)
      : progress.currentDayIndex;

  const updatedProgress: UserProgress = {
    ...progress,
    completedDays: [...existing, entry],
    currentDayIndex: nextIndex,
    lastActiveAt: now,
  };

  const updated: AppState = {
    ...state,
    programs: { ...state.programs, [programId]: updatedProgress },
  };

  await saveState(updated);
  return updated;
}

export async function markExerciseComplete(
  state: AppState,
  dayId: string,
  exerciseId: string,
): Promise<AppState> {
  const programId = state.activeProgramId;
  const program = getProgram(programId);
  const progress = getActiveProgress(state);
  const dayProg = progress.completedDays.find((d) => d.dayId === dayId);
  const completed = dayProg?.exercisesCompleted ?? [];
  if (completed.includes(exerciseId)) return state;

  const now = new Date().toISOString();
  const without = progress.completedDays.filter((d) => d.dayId !== dayId);
  const exercisesCompleted = [...completed, exerciseId];
  const entry: DayProgress = {
    dayId,
    completedAt: dayProg?.completedAt ?? now,
    exercisesCompleted,
  };

  const trainingDay = program.days.find((d) => d.id === dayId);
  const allDone =
    !!trainingDay &&
    trainingDay.exercises.every((e) => exercisesCompleted.includes(e.id));
  const dayIndex = program.days.findIndex((d) => d.id === dayId);
  const nextIndex =
    allDone && dayIndex >= 0 && dayIndex >= progress.currentDayIndex
      ? Math.min(dayIndex + 1, program.days.length - 1)
      : progress.currentDayIndex;

  const updated: AppState = {
    ...state,
    programs: {
      ...state.programs,
      [programId]: {
        ...progress,
        completedDays: [...without, entry],
        currentDayIndex: nextIndex,
        lastActiveAt: now,
      },
    },
  };

  await saveState(updated);
  return updated;
}

export function getDayExerciseProgress(state: AppState, dayId: string): string[] {
  return getActiveProgress(state).completedDays.find((d) => d.dayId === dayId)?.exercisesCompleted ?? [];
}

export async function resetProgress(state: AppState, programId?: string): Promise<AppState> {
  const id = programId ?? state.activeProgramId;
  const updated: AppState = {
    ...state,
    programs: { ...state.programs, [id]: createDefaultProgress(id) },
  };
  await saveState(updated);
  return updated;
}

export async function resetAllProgress(): Promise<AppState> {
  const state = createDefaultState();
  await saveState(state);
  return state;
}

export function getTreadmillCompletions(state: AppState): TreadmillCompletion[] {
  return state.treadmillCompletions ?? [];
}

export function getTreadmillCompletionCount(state: AppState, workoutId?: string): number {
  const list = getTreadmillCompletions(state);
  if (!workoutId) return list.length;
  return list.filter((c) => c.workoutId === workoutId).length;
}

export function getTreadmillTotalMinutes(state: AppState): number {
  const seconds = getTreadmillCompletions(state).reduce((sum, c) => sum + c.durationSeconds, 0);
  return Math.round(seconds / 60);
}

export function getLastTreadmillCompletion(
  state: AppState,
  workoutId: string,
): TreadmillCompletion | undefined {
  const list = getTreadmillCompletions(state).filter((c) => c.workoutId === workoutId);
  if (list.length === 0) return undefined;
  return list.reduce((latest, c) => (c.completedAt > latest.completedAt ? c : latest));
}

export function getTreadmillTotalKm(state: AppState): number {
  const km = getTreadmillCompletions(state).reduce((sum, c) => sum + (c.distanceKm ?? 0), 0);
  return Math.round(km * 10) / 10;
}

export async function markTreadmillComplete(
  state: AppState,
  workoutId: string,
  durationSeconds: number,
  distanceKm?: number,
): Promise<AppState> {
  const entry: TreadmillCompletion = {
    id: newCompletionId(),
    workoutId,
    completedAt: new Date().toISOString(),
    durationSeconds,
    ...(typeof distanceKm === 'number' && Number.isFinite(distanceKm) && distanceKm > 0
      ? { distanceKm: Math.round(distanceKm * 100) / 100 }
      : {}),
  };
  const updated: AppState = {
    ...state,
    treadmillCompletions: [...getTreadmillCompletions(state), entry],
  };
  await saveState(updated);
  return updated;
}

export async function removeTreadmillCompletion(
  state: AppState,
  completionId: string,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    treadmillCompletions: getTreadmillCompletions(state).filter((c) => c.id !== completionId),
  };
  await saveState(updated);
  return updated;
}

export async function updateTreadmillDistance(
  state: AppState,
  completionId: string,
  distanceKm: number | undefined,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    treadmillCompletions: getTreadmillCompletions(state).map((c) => {
      if (c.id !== completionId) return c;
      if (typeof distanceKm === 'number' && Number.isFinite(distanceKm) && distanceKm > 0) {
        return { ...c, distanceKm: Math.round(distanceKm * 100) / 100 };
      }
      const { distanceKm: _removed, ...rest } = c;
      return rest;
    }),
  };
  await saveState(updated);
  return updated;
}

export async function completeOnboarding(
  state: AppState,
  cardioMode?: CardioMode,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    onboardingDone: true,
    ...(cardioMode ? { cardioMode } : {}),
  };
  await saveState(updated);
  return updated;
}

export function getMorningCompletions(state: AppState): MorningCompletion[] {
  return state.morningCompletions ?? [];
}

export function getMorningCompletionCount(state: AppState, routineId?: string): number {
  const list = getMorningCompletions(state);
  if (!routineId) return list.length;
  return list.filter((c) => c.routineId === routineId).length;
}

export function wasMorningDoneToday(state: AppState, routineId?: string): boolean {
  const today = dateKeyFromDate(startOfLocalDay(new Date()));
  return getMorningCompletions(state).some((c) => {
    if (formatLocalDateKey(c.completedAt) !== today) return false;
    return routineId ? c.routineId === routineId : true;
  });
}

export async function markMorningComplete(
  state: AppState,
  routineId: string,
): Promise<AppState> {
  const entry: MorningCompletion = {
    id: `morning-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    routineId,
    completedAt: new Date().toISOString(),
  };
  const updated: AppState = {
    ...state,
    morningCompletions: [...getMorningCompletions(state), entry],
  };
  await saveState(updated);
  return updated;
}

export async function removeMorningCompletion(
  state: AppState,
  completionId: string,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    morningCompletions: getMorningCompletions(state).filter((c) => c.id !== completionId),
  };
  await saveState(updated);
  return updated;
}

export function getBonusCompletions(state: AppState): BonusCompletion[] {
  return state.bonusCompletions ?? [];
}

export function getBonusCompletionCount(state: AppState, routineId?: string): number {
  const list = getBonusCompletions(state);
  if (!routineId) return list.length;
  return list.filter((c) => c.routineId === routineId).length;
}

export function wasBonusDoneToday(state: AppState, routineId?: string): boolean {
  const today = dateKeyFromDate(startOfLocalDay(new Date()));
  return getBonusCompletions(state).some((c) => {
    if (formatLocalDateKey(c.completedAt) !== today) return false;
    return routineId ? c.routineId === routineId : true;
  });
}

export async function markBonusComplete(
  state: AppState,
  routineId: string,
): Promise<AppState> {
  const entry: BonusCompletion = {
    id: `bonus-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    routineId,
    completedAt: new Date().toISOString(),
  };
  const updated: AppState = {
    ...state,
    bonusCompletions: [...getBonusCompletions(state), entry],
  };
  await saveState(updated);
  return updated;
}

export async function removeBonusCompletion(
  state: AppState,
  completionId: string,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    bonusCompletions: getBonusCompletions(state).filter((c) => c.id !== completionId),
  };
  await saveState(updated);
  return updated;
}

function recalcCurrentDayIndex(programId: string, completedDays: DayProgress[]): number {
  const program = getProgram(programId);
  const firstIncomplete = program.days.findIndex((day) => {
    const entry = completedDays.find((d) => d.dayId === day.id);
    if (!entry) return true;
    return !day.exercises.every((e) => entry.exercisesCompleted.includes(e.id));
  });
  if (firstIncomplete < 0) return Math.max(0, program.days.length - 1);
  return firstIncomplete;
}

/** Izbriše napredek dneva izziva (vaje + oznaka opravljeno). */
export async function clearDayProgress(state: AppState, dayId: string): Promise<AppState> {
  const owner =
    allPrograms.find((p) => p.days.some((d) => d.id === dayId)) ??
    getProgram(state.activeProgramId);
  const programId = owner.id;
  const progress = getProgramProgress(state, programId);
  const completedDays = progress.completedDays.filter((d) => d.dayId !== dayId);
  const updatedProgress: UserProgress = {
    ...progress,
    completedDays,
    currentDayIndex: recalcCurrentDayIndex(programId, completedDays),
    lastActiveAt: new Date().toISOString(),
  };
  const updated: AppState = {
    ...state,
    programs: { ...state.programs, [programId]: updatedProgress },
  };
  await saveState(updated);
  return updated;
}

function formatLocalDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function activityDayLabel(dateKey: string): string {
  const now = new Date();
  const today = formatLocalDateKey(now.toISOString());
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = formatLocalDateKey(yesterdayDate.toISOString());

  if (dateKey === today) return 'Danes';
  if (dateKey === yesterday) return 'Včeraj';

  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('sl-SI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

/** Dnevnik: vsi programi + steza + jutro, združeno po koledarskih dnevih (novejše najprej). */
export function getActivityLog(state: AppState): ActivityDayGroup[] {
  const items: ActivityLogItem[] = [];

  for (const program of allPrograms) {
    const progress = getProgramProgress(state, program.id);
    for (const dayProg of progress.completedDays) {
      if (dayProg.exercisesCompleted.length === 0) continue;
      const day = program.days.find((d) => d.id === dayProg.dayId);
      const allDone = day
        ? day.exercises.every((e) => dayProg.exercisesCompleted.includes(e.id))
        : false;
      items.push({
        id: `${program.id}-${dayProg.dayId}`,
        kind: 'challenge',
        title: day ? `Dan ${day.day}: ${day.title}` : dayProg.dayId,
        subtitle: allDone
          ? `${program.name} · ${dayProg.exercisesCompleted.length} korakov`
          : `${program.name} · ${dayProg.exercisesCompleted.length}/${day?.exercises.length ?? '?'} korakov`,
        completedAt: dayProg.completedAt,
        dayId: dayProg.dayId,
      });
    }
  }

  for (const tm of getTreadmillCompletions(state)) {
    const workout = getTreadmillWorkout(tm.workoutId);
    const mins = Math.round(tm.durationSeconds / 60);
    const kmPart =
      typeof tm.distanceKm === 'number' && tm.distanceKm > 0
        ? ` · ${tm.distanceKm.toFixed(1).replace('.', ',')} km`
        : '';
    const title =
      tm.workoutId === QUICK_TREADMILL_ID
        ? 'Hitri vnos'
        : (workout?.title ?? tm.workoutId);
    items.push({
      id: `treadmill-${tm.id}`,
      kind: 'treadmill',
      title,
      subtitle: `Steza · ${mins} min${kmPart}`,
      completedAt: tm.completedAt,
      completionId: tm.id,
      distanceKm: tm.distanceKm,
      durationSeconds: tm.durationSeconds,
    });
  }

  for (const m of getMorningCompletions(state)) {
    const routine = getMorningRoutine(m.routineId);
    items.push({
      id: `morning-${m.id}`,
      kind: 'morning',
      title: routine?.title ?? m.routineId,
      subtitle: `Jutro · ${routine?.estimatedMinutes ?? '?'} min`,
      completedAt: m.completedAt,
      completionId: m.id,
      routineId: m.routineId,
    });
  }

  for (const b of getBonusCompletions(state)) {
    const routine = getBonusRoutine(b.routineId);
    items.push({
      id: `bonus-${b.id}`,
      kind: 'bonus',
      title: routine?.title ?? b.routineId,
      subtitle: `Bonus · ${routine?.estimatedMinutes ?? '?'} min`,
      completedAt: b.completedAt,
      completionId: b.id,
      routineId: b.routineId,
    });
  }

  items.sort((a, b) => (a.completedAt < b.completedAt ? 1 : -1));

  const groups = new Map<string, ActivityLogItem[]>();
  for (const item of items) {
    const key = formatLocalDateKey(item.completedAt);
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([dateKey, groupItems]) => ({
      dateKey,
      label: activityDayLabel(dateKey),
      items: groupItems,
    }));
}

export async function resetTreadmillProgress(state: AppState): Promise<AppState> {
  const updated: AppState = { ...state, treadmillCompletions: [] };
  await saveState(updated);
  return updated;
}

/** Vsi datumi z aktivnostjo (izziv + steza), lokalni YYYY-MM-DD. */
function getActiveDateKeys(state: AppState): Map<string, number> {
  const counts = new Map<string, number>();
  const bump = (iso: string) => {
    const key = formatLocalDateKey(iso);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  };

  for (const program of allPrograms) {
    const progress = getProgramProgress(state, program.id);
    for (const dayProg of progress.completedDays) {
      if (dayProg.exercisesCompleted.length === 0) continue;
      bump(dayProg.completedAt);
    }
  }
  for (const tm of getTreadmillCompletions(state)) {
    bump(tm.completedAt);
  }
  for (const m of getMorningCompletions(state)) {
    bump(m.completedAt);
  }
  for (const b of getBonusCompletions(state)) {
    bump(b.completedAt);
  }
  return counts;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function dateKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Heatmap: zadnjih 12 tednov (pon–ned), intenziteta = št. aktivnosti. */
export function getActivityHeatmap(state: AppState, weeks = 12): HeatmapDay[] {
  const counts = getActiveDateKeys(state);
  const today = startOfLocalDay(new Date());
  const dow = today.getDay(); // 0 ned
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const end = today;
  const start = addDays(end, -(weeks * 7 - 1 + daysFromMonday));

  const days: HeatmapDay[] = [];
  for (let cursor = start; cursor <= end; cursor = addDays(cursor, 1)) {
    const key = dateKeyFromDate(cursor);
    const count = counts.get(key) ?? 0;
    days.push({
      dateKey: key,
      count,
      label: cursor.toLocaleDateString('sl-SI', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    });
  }
  return days;
}

function computeStreaks(activeKeys: Set<string>): { current: number; best: number } {
  const today = startOfLocalDay(new Date());
  let current = 0;
  let cursor = today;

  // Če danes ni aktivnosti, začni od včeraj (streak še velja)
  if (!activeKeys.has(dateKeyFromDate(cursor))) {
    cursor = addDays(cursor, -1);
  }

  while (activeKeys.has(dateKeyFromDate(cursor))) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let best = current;
  let run = 0;
  const sorted = [...activeKeys].sort();
  let prev: string | null = null;
  for (const key of sorted) {
    if (prev) {
      const [py, pm, pd] = prev.split('-').map(Number);
      const prevDate = new Date(py, pm - 1, pd);
      const expected = dateKeyFromDate(addDays(prevDate, 1));
      run = key === expected ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = key;
  }

  return { current, best };
}

export function getProgressStats(state: AppState): ProgressStats {
  const program = getProgram(state.activeProgramId);
  const challengeDaysDone = getCompletedCount(state);
  const challengePercent = getCompletionPercent(state, program.days.length);
  const treadmillSessions = getTreadmillCompletionCount(state);
  const treadmillMinutes = getTreadmillTotalMinutes(state);
  const treadmillKm = getTreadmillTotalKm(state);
  const counts = getActiveDateKeys(state);
  const { current, best } = computeStreaks(new Set(counts.keys()));

  const today = startOfLocalDay(new Date());
  let activeDaysLast30 = 0;
  for (let i = 0; i < 30; i++) {
    if (counts.has(dateKeyFromDate(addDays(today, -i)))) activeDaysLast30 += 1;
  }

  return {
    challengeDaysDone,
    challengePercent,
    treadmillSessions,
    treadmillMinutes,
    treadmillKm,
    totalActivities: [...counts.values()].reduce((a, b) => a + b, 0),
    currentStreak: current,
    bestStreak: best,
    activeDaysLast30,
  };
}

export function hasActivityToday(state: AppState): boolean {
  const today = dateKeyFromDate(startOfLocalDay(new Date()));
  return (getActiveDateKeys(state).get(today) ?? 0) > 0;
}

/** Povzetek tekočega koledarskega tedna (pon–ned). */
export function getWeeklySummary(state: AppState): WeeklySummary {
  const today = startOfLocalDay(new Date());
  const dow = today.getDay();
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const monday = addDays(today, -daysFromMonday);
  const sunday = addDays(monday, 6);

  const weekKeys = new Set<string>();
  for (let i = 0; i < 7; i++) {
    weekKeys.add(dateKeyFromDate(addDays(monday, i)));
  }

  const counts = getActiveDateKeys(state);
  let activeDays = 0;
  let activities = 0;
  for (const key of weekKeys) {
    const n = counts.get(key) ?? 0;
    if (n > 0) activeDays += 1;
    activities += n;
  }

  let treadmillMinutes = 0;
  let treadmillKm = 0;
  for (const tm of getTreadmillCompletions(state)) {
    const key = formatLocalDateKey(tm.completedAt);
    if (!weekKeys.has(key)) continue;
    treadmillMinutes += Math.round(tm.durationSeconds / 60);
    treadmillKm += tm.distanceKm ?? 0;
  }
  treadmillKm = Math.round(treadmillKm * 10) / 10;

  let challengeDays = 0;
  for (const program of allPrograms) {
    for (const dayProg of getProgramProgress(state, program.id).completedDays) {
      const key = formatLocalDateKey(dayProg.completedAt);
      if (!weekKeys.has(key)) continue;
      const day = program.days.find((d) => d.id === dayProg.dayId);
      if (!day) continue;
      if (day.exercises.every((e) => dayProg.exercisesCompleted.includes(e.id))) {
        challengeDays += 1;
      }
    }
  }

  const weekLabel = `${monday.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })} – ${sunday.toLocaleDateString('sl-SI', { day: 'numeric', month: 'short' })}`;

  return {
    weekLabel,
    activeDays,
    activities,
    treadmillMinutes,
    treadmillKm,
    challengeDays,
  };
}

export async function setFeedback(
  state: AppState,
  patch: Partial<FeedbackSettings>,
): Promise<AppState> {
  const updated: AppState = {
    ...state,
    feedback: { ...state.feedback, ...patch },
  };
  await saveState(updated);
  return updated;
}

export async function setCardioMode(state: AppState, cardioMode: CardioMode): Promise<AppState> {
  const updated: AppState = { ...state, cardioMode };
  await saveState(updated);
  return updated;
}

export async function setDifficulty(
  state: AppState,
  difficulty: WorkoutDifficulty,
): Promise<AppState> {
  const updated: AppState = { ...state, difficulty };
  await saveState(updated);
  return updated;
}

/** Bedži / zbirke glede na trenutni napredek */
export function getBadgeStatuses(state: AppState): BadgeStatus[] {
  const stats = getProgressStats(state);
  const morningCount = getMorningCompletionCount(state);
  const streak = Math.max(stats.currentStreak, stats.bestStreak);

  const checks: Record<string, { unlocked: boolean; progressLabel?: string }> = {
    'first-day': {
      unlocked: stats.challengeDaysDone >= 1,
      progressLabel: `${Math.min(stats.challengeDaysDone, 1)}/1`,
    },
    'challenge-half': {
      unlocked: stats.challengeDaysDone >= 5,
      progressLabel: `${Math.min(stats.challengeDaysDone, 5)}/5`,
    },
    'challenge-done': {
      unlocked: stats.challengeDaysDone >= 10,
      progressLabel: `${Math.min(stats.challengeDaysDone, 10)}/10`,
    },
    'streak-3': {
      unlocked: streak >= 3,
      progressLabel: `${Math.min(streak, 3)}/3`,
    },
    'streak-7': {
      unlocked: streak >= 7,
      progressLabel: `${Math.min(streak, 7)}/7`,
    },
    'first-morning': {
      unlocked: morningCount >= 1,
      progressLabel: `${Math.min(morningCount, 1)}/1`,
    },
    'morning-5': {
      unlocked: morningCount >= 5,
      progressLabel: `${Math.min(morningCount, 5)}/5`,
    },
    'first-treadmill': {
      unlocked: stats.treadmillSessions >= 1,
      progressLabel: `${Math.min(stats.treadmillSessions, 1)}/1`,
    },
    'treadmill-10': {
      unlocked: stats.treadmillSessions >= 10,
      progressLabel: `${Math.min(stats.treadmillSessions, 10)}/10`,
    },
    'km-20': {
      unlocked: stats.treadmillKm >= 20,
      progressLabel: `${Math.min(Math.round(stats.treadmillKm), 20)}/20 km`,
    },
  };

  return BADGES.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    mark: b.mark,
    unlocked: checks[b.id]?.unlocked ?? false,
    progressLabel: checks[b.id]?.progressLabel,
  }));
}

export async function exportState(state: AppState): Promise<string> {
  return JSON.stringify(state, null, 2);
}

export async function importState(json: string): Promise<AppState> {
  const parsed = JSON.parse(json) as AppState;
  const migrated = migrateState(parsed);
  await saveState(migrated);
  return migrated;
}
