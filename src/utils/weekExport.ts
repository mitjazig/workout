import type { AppState, WeeklySummary } from '../types';
import { getProgram } from '../data/programs';
import { getTreadmillWorkout } from '../data/treadmillWorkouts';
import {
  getActiveProgress,
  getTreadmillCompletions,
  getWeeklySummary,
  QUICK_TREADMILL_ID,
} from '../services/progress';

function currentWeekKeys(): Set<string> {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dow = start.getDay();
  const fromMon = dow === 0 ? 6 : dow - 1;
  const monday = new Date(start);
  monday.setDate(start.getDate() - fromMon);
  const keys = new Set<string>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    keys.add(`${y}-${m}-${day}`);
  }
  return keys;
}

function localKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildWeeklyCsv(state: AppState): string {
  const week = getWeeklySummary(state);
  const keys = currentWeekKeys();
  const program = getProgram(state.activeProgramId);
  const rows: string[][] = [['datum', 'tip', 'naslov', 'minute', 'km']];

  for (const dayProg of getActiveProgress(state).completedDays) {
    if (!keys.has(localKey(dayProg.completedAt))) continue;
    if (dayProg.exercisesCompleted.length === 0) continue;
    const day = program.days.find((d) => d.id === dayProg.dayId);
    rows.push([
      localKey(dayProg.completedAt),
      'izziv',
      day ? `Dan ${day.day}: ${day.title}` : dayProg.dayId,
      String(day?.estimatedMinutes ?? ''),
      '',
    ]);
  }

  for (const tm of getTreadmillCompletions(state)) {
    if (!keys.has(localKey(tm.completedAt))) continue;
    const workout = getTreadmillWorkout(tm.workoutId);
    const title =
      tm.workoutId === QUICK_TREADMILL_ID ? 'Hitri vnos' : (workout?.title ?? tm.workoutId);
    rows.push([
      localKey(tm.completedAt),
      'steza',
      title,
      String(Math.round(tm.durationSeconds / 60)),
      tm.distanceKm != null ? String(tm.distanceKm).replace('.', ',') : '',
    ]);
  }

  rows.push([]);
  rows.push(['povzetek_teden', week.weekLabel, '', '', '']);
  rows.push(['aktivni_dnevi', String(week.activeDays), '', '', '']);
  rows.push(['seje', String(week.activities), '', '', '']);
  rows.push(['min_steza', String(week.treadmillMinutes), '', '', '']);
  rows.push(['km', String(week.treadmillKm).replace('.', ','), '', '', '']);

  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
}

export function downloadWeeklyCsv(state: AppState) {
  const csv = `\uFEFF${buildWeeklyCsv(state)}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `izziv-10-teden-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function renderWeeklySummaryImage(week: WeeklySummary): HTMLCanvasElement {
  const w = 1080;
  const h = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(w * 0.8, 120, 20, w * 0.8, 120, 380);
  glow.addColorStop(0, 'rgba(250, 84, 0, 0.3)');
  glow.addColorStop(1, 'rgba(250, 84, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '700 32px "DM Sans", system-ui, sans-serif';
  ctx.fillText('IZZIV 10 · TEDENSKI LOG', 80, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = '400 96px "Bebas Neue", "Arial Narrow", Impact, sans-serif';
  ctx.fillText('TA TEDEN', 80, 240);

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '600 34px "DM Sans", system-ui, sans-serif';
  ctx.fillText(week.weekLabel, 80, 300);

  ctx.fillStyle = '#FA5400';
  ctx.fillRect(80, 340, 160, 12);

  const stats: [string, string][] = [
    [String(week.activeDays), 'AKTIVNI DNEVI'],
    [String(week.activities), 'SEJE'],
    [String(week.treadmillMinutes), 'MIN STEZA'],
    [week.treadmillKm.toFixed(1).replace('.', ','), 'KM'],
  ];

  stats.forEach(([value, label], i) => {
    const x = 80 + (i % 2) * 480;
    const y = 460 + Math.floor(i / 2) * 220;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, 420, 180);
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 96px "Bebas Neue", "Arial Narrow", Impact, sans-serif';
    ctx.fillText(value, x + 36, y + 100);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '700 26px "DM Sans", system-ui, sans-serif';
    ctx.fillText(label, x + 36, y + 145);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '600 28px "DM Sans", system-ui, sans-serif';
  ctx.fillText('Osebni log · Izziv 10', 80, h - 80);

  return canvas;
}

export function downloadWeeklyImage(week: WeeklySummary) {
  const canvas = renderWeeklySummaryImage(week);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `izziv-10-teden-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
