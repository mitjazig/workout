/** Kategorija vaje */
export type TaskCategory = 'warmup' | 'strength' | 'cardio' | 'mobility' | 'cooldown';

/** Kje izvesti kardio/hojo */
export type CardioMode = 'treadmill' | 'outdoor';

/** Težavnost vadbe (NTC-style: lahko / standard) */
export type WorkoutDifficulty = 'easy' | 'standard';

/** Stanje bedža za UI */
export interface BadgeStatus {
  id: string;
  title: string;
  description: string;
  mark: string;
  unlocked: boolean;
  progressLabel?: string;
}

/** Predpis za tekalno stezo (Alpha Run 200 ipd.) */
export interface TreadmillPrescription {
  speedKmh: number;
  inclinePercent: number;
  /** Počasnejša hitrost pri intervalih */
  speedEasyKmh?: number;
  note?: string;
  howTo?: string[];
}

/** YouTube vadba za dan (brezplačni javni videi) */
export interface DayYoutubeVideo {
  videoId: string;
  title: string;
  channel: string;
  /** Kratek namig v UI (npr. alternativa za hojo doma) */
  note?: string;
}

/** Posamezna vaja */
export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  howTo: string[];
  tips?: string[];
  category: TaskCategory;
  durationSeconds: number;
  /** Če obstaja: vaja se lahko izvede na stezi */
  treadmill?: TreadmillPrescription;
}

/** En dan vadbe */
export interface TrainingDay {
  id: string;
  week: number;
  day: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  focus: TaskCategory;
  exercises: Exercise[];
}

/** Celoten 10-dnevni vadbeni izziv */
export interface Program {
  id: string;
  name: string;
  description: string;
  weeks: number;
  days: TrainingDay[];
}

export interface DayProgress {
  dayId: string;
  completedAt: string;
  exercisesCompleted: string[];
}

export interface UserProgress {
  programId: string;
  startedAt: string;
  currentDayIndex: number;
  completedDays: DayProgress[];
  lastActiveAt: string;
}

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  daysOfWeek: number[];
}

export interface FeedbackSettings {
  sound: boolean;
  haptics: boolean;
}

export interface WeeklySummary {
  weekLabel: string;
  activeDays: number;
  activities: number;
  treadmillMinutes: number;
  treadmillKm: number;
  challengeDays: number;
}

/** Opravljena seja na tekalni stezi */
export interface TreadmillCompletion {
  /** Stabilen ključ za brisanje (starejšim vnosom ga dodamo ob migraciji) */
  id: string;
  workoutId: string;
  completedAt: string;
  /** Trajanje seje v sekundah (vsota segmentov) */
  durationSeconds: number;
  /** Prehojena razdalja z konzole (km) */
  distanceKm?: number;
}

/** Dan v heatmapu aktivnosti */
export interface HeatmapDay {
  dateKey: string;
  count: number;
  label: string;
}

export interface ProgressStats {
  challengeDaysDone: number;
  challengePercent: number;
  treadmillSessions: number;
  treadmillMinutes: number;
  treadmillKm: number;
  totalActivities: number;
  currentStreak: number;
  bestStreak: number;
  activeDaysLast30: number;
}

/** Opravljena jutranja rutina */
export interface MorningCompletion {
  id: string;
  routineId: string;
  completedAt: string;
}

/** Vnos v dnevniku aktivnosti */
export interface ActivityLogItem {
  id: string;
  kind: 'challenge' | 'treadmill' | 'morning';
  title: string;
  subtitle: string;
  completedAt: string;
  dayId?: string;
  completionId?: string;
  distanceKm?: number;
  durationSeconds?: number;
  routineId?: string;
}

export interface ActivityDayGroup {
  dateKey: string;
  label: string;
  items: ActivityLogItem[];
}

export interface AppState {
  activeProgramId: string;
  programs: Record<string, UserProgress>;
  reminders: ReminderSettings;
  /** Zgodovina vadb na tekalni stezi */
  treadmillCompletions: TreadmillCompletion[];
  /** Jutranji blok (posebna zgodba) */
  morningCompletions: MorningCompletion[];
  /** Privzeti način za hojo/kardio v izzivu */
  cardioMode: CardioMode;
  /** Zvok / vibracija med vadbo */
  feedback: FeedbackSettings;
  /** Ali je bil prikazan uvod */
  onboardingDone: boolean;
  /** Privzeta težavnost (lahko / standard) */
  difficulty: WorkoutDifficulty;
  version: number;
}

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface SyncAdapter {
  push(state: AppState): Promise<void>;
  pull(): Promise<AppState | null>;
  isOnline(): boolean;
}
