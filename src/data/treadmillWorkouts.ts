import type { TreadmillWorkout } from '../types/treadmill';

function seg(
  id: string,
  name: string,
  durationSeconds: number,
  speedKmh: number,
  inclinePercent: number,
  note?: string,
) {
  return { id, name, durationSeconds, speedKmh, inclinePercent, note };
}

/** Vadbe za Kettler Alpha Run 200 (in podobne steze) – app pove, konzola nastavi */
export const treadmillWorkouts: TreadmillWorkout[] = [
  {
    id: 'tm-walk-15',
    title: 'Hitri start – hoja',
    summary: '15 min umirjene hoje. Idealno za začetek ali aktivni počitek.',
    estimatedMinutes: 15,
    level: 'lahko',
    segments: [
      seg('tm-walk-15-a', 'Ogrevanje', 180, 3.5, 0, 'Počasi pospešujte.'),
      seg('tm-walk-15-b', 'Hoja', 600, 4.5, 1, 'Tempo: lahko govorite.'),
      seg('tm-walk-15-c', 'Umirjanje', 120, 3.5, 0),
    ],
  },
  {
    id: 'tm-intervals',
    title: 'Intervali 1–2',
    summary: '1 min hitreje, 2 min počasneje – 5 krogov. Dobro za kardio.',
    estimatedMinutes: 22,
    level: 'srednje',
    segments: [
      seg('tm-int-wu', 'Ogrevanje', 300, 4.0, 0),
      seg('tm-int-1f', 'Hitreje 1', 60, 6.0, 1, 'Zadihanost ~6/10.'),
      seg('tm-int-1e', 'Počasneje 1', 120, 4.0, 0),
      seg('tm-int-2f', 'Hitreje 2', 60, 6.0, 1),
      seg('tm-int-2e', 'Počasneje 2', 120, 4.0, 0),
      seg('tm-int-3f', 'Hitreje 3', 60, 6.2, 1),
      seg('tm-int-3e', 'Počasneje 3', 120, 4.0, 0),
      seg('tm-int-4f', 'Hitreje 4', 60, 6.2, 1),
      seg('tm-int-4e', 'Počasneje 4', 120, 4.0, 0),
      seg('tm-int-5f', 'Hitreje 5', 60, 6.5, 1),
      seg('tm-int-5e', 'Počasneje 5', 120, 4.0, 0),
      seg('tm-int-cd', 'Umirjanje', 180, 3.5, 0),
    ],
  },
  {
    id: 'tm-incline',
    title: 'Hoja z naklonom',
    summary: '20 min hoje z zviševanjem naklona – moč nog brez teka.',
    estimatedMinutes: 20,
    level: 'srednje',
    segments: [
      seg('tm-inc-1', 'Ogrevanje', 180, 4.0, 0),
      seg('tm-inc-2', 'Naklon 2 %', 240, 4.2, 2),
      seg('tm-inc-3', 'Naklon 4 %', 240, 4.0, 4, 'Skrajšajte korak, pokončen trup.'),
      seg('tm-inc-4', 'Naklon 6 %', 180, 3.8, 6, 'Če je preveč: ostanite na 4 %.'),
      seg('tm-inc-5', 'Naklon 3 %', 180, 4.0, 3),
      seg('tm-inc-6', 'Umirjanje', 180, 3.5, 0),
    ],
  },
  {
    id: 'tm-mix',
    title: 'Mix – hoja + intervali',
    summary: 'Celotna seja: ogrevanje, intervali, umirjanje. ~25 min.',
    estimatedMinutes: 25,
    level: 'zahtevno',
    segments: [
      seg('tm-mix-1', 'Ogrevanje', 300, 4.0, 0),
      seg('tm-mix-2', 'Hoja', 420, 5.0, 1),
      seg('tm-mix-3f', 'Hitreje', 60, 6.5, 1),
      seg('tm-mix-3e', 'Počasneje', 120, 4.2, 0),
      seg('tm-mix-4f', 'Hitreje', 60, 6.5, 1),
      seg('tm-mix-4e', 'Počasneje', 120, 4.2, 0),
      seg('tm-mix-5f', 'Hitreje', 60, 6.8, 1),
      seg('tm-mix-5e', 'Počasneje', 120, 4.2, 0),
      seg('tm-mix-6', 'Hoja', 240, 4.8, 1),
      seg('tm-mix-7', 'Umirjanje', 180, 3.5, 0),
    ],
  },
];

export function getTreadmillWorkout(id: string): TreadmillWorkout | undefined {
  return treadmillWorkouts.find((w) => w.id === id);
}

/** Ocena km iz predpisanih hitrosti × čas (če konzola ni na voljo). */
export function estimateWorkoutKm(workout: TreadmillWorkout): number {
  const km = workout.segments.reduce(
    (sum, s) => sum + s.speedKmh * (s.durationSeconds / 3600),
    0,
  );
  return Math.round(km * 10) / 10;
}
