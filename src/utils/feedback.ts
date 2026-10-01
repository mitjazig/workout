/** Zvok + vibracija za stezo (telefon na držalu). */

export interface FeedbackPrefs {
  sound: boolean;
  haptics: boolean;
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

function beep(freq: number, durationMs: number, gain = 0.08, when = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime + when;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMs / 1000);
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + durationMs / 1000 + 0.02);
}

export async function unlockAudio(): Promise<void> {
  const ctx = getCtx();
  if (ctx?.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      /* ignore */
    }
  }
}

export function cueSegmentEnd(prefs: FeedbackPrefs) {
  if (prefs.haptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([40, 60, 80]);
    } catch {
      /* ignore */
    }
  }
  if (prefs.sound) {
    void unlockAudio().then(() => {
      beep(880, 120, 0.09, 0);
      beep(1175, 180, 0.07, 0.14);
    });
  }
}

export function cueWorkoutComplete(prefs: FeedbackPrefs) {
  if (prefs.haptics && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([30, 40, 30, 40, 120]);
    } catch {
      /* ignore */
    }
  }
  if (prefs.sound) {
    void unlockAudio().then(() => {
      beep(660, 100, 0.08, 0);
      beep(880, 100, 0.08, 0.12);
      beep(1320, 220, 0.09, 0.24);
    });
  }
}
