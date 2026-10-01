/** Segment tekalne steze – uporabnik nastavi na konzoli */
export interface TreadmillSegment {
  id: string;
  name: string;
  durationSeconds: number;
  /** Ciljna hitrost v km/h */
  speedKmh: number;
  /** Ciljni naklon v % (0–12 na Alpha Run 200) */
  inclinePercent: number;
  note?: string;
}

export interface TreadmillWorkout {
  id: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  level: 'lahko' | 'srednje' | 'zahtevno';
  segments: TreadmillSegment[];
}
