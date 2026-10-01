import type { AppState, ReminderSettings } from '../types';
import { assetPath } from '../utils/paths';
import { getProgressStats, hasActivityToday, loadState, saveState } from './progress';

let activeTimeout: ReturnType<typeof setTimeout> | null = null;
let stateGetter: (() => AppState | null) | null = null;

export function bindReminderState(getter: () => AppState | null) {
  stateGetter = getter;
}

function parseTime(time: string): { hours: number; minutes: number } {
  const [h, m] = time.split(':').map(Number);
  return { hours: h ?? 8, minutes: m ?? 0 };
}

function msUntilNext(settings: ReminderSettings): number | null {
  if (!settings.enabled) return null;

  const now = new Date();
  const { hours, minutes } = parseTime(settings.time);

  for (let offset = 0; offset < 8; offset++) {
    const candidate = new Date(now);
    candidate.setDate(candidate.getDate() + offset);
    candidate.setHours(hours, minutes, 0, 0);

    if (candidate <= now) continue;
    if (!settings.daysOfWeek.includes(candidate.getDay())) continue;

    return candidate.getTime() - now.getTime();
  }

  return null;
}

async function resolveState(): Promise<AppState> {
  return stateGetter?.() ?? (await loadState());
}

async function showReminder() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const state = await resolveState();
  if (hasActivityToday(state)) return;

  const streak = getProgressStats(state).currentStreak;
  const body =
    streak > 0
      ? `Niz ${streak} ${streak === 1 ? 'dan' : 'dni'} – danes še ni vadbe. 15–30 min zadošča.`
      : 'Danes še ni vadbe. 15–30 minut te loči od napredka.';

  new Notification('Izziv 10 – čas za vadbo', {
    body,
    icon: assetPath('icons.svg'),
    tag: 'izziv-10-reminder',
  });
}

function scheduleNext(settings: ReminderSettings) {
  if (activeTimeout) clearTimeout(activeTimeout);

  const ms = msUntilNext(settings);
  if (ms === null) return;

  activeTimeout = setTimeout(() => {
    void showReminder().then(() => scheduleNext(settings));
  }, ms);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function updateReminders(
  state: AppState,
  settings: Partial<ReminderSettings>,
): Promise<AppState> {
  const reminders: ReminderSettings = { ...state.reminders, ...settings };
  const updated = { ...state, reminders };
  await saveState(updated);

  if (reminders.enabled) {
    await requestNotificationPermission();
    scheduleNext(reminders);
  } else if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }

  return updated;
}

export function initReminders(settings: ReminderSettings) {
  if (settings.enabled && Notification.permission === 'granted') {
    scheduleNext(settings);
  }
}
