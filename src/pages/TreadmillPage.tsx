import { useState } from 'react';
import type { AppState } from '../types';
import { treadmillWorkouts } from '../data/treadmillWorkouts';
import {
  getLastTreadmillCompletion,
  getTreadmillCompletionCount,
  getTreadmillTotalKm,
  getTreadmillTotalMinutes,
  QUICK_TREADMILL_ID,
} from '../services/progress';
import TreadmillSession from '../components/TreadmillSession';
import WorkoutPreview from '../components/WorkoutPreview';
import type { TreadmillWorkout } from '../types/treadmill';
import './TreadmillPage.css';

const levelLabel = {
  lahko: 'Lahko',
  srednje: 'Srednje',
  zahtevno: 'Zahtevno',
} as const;

interface TreadmillPageProps {
  state: AppState;
  onCompleteWorkout: (workoutId: string, durationSeconds: number, distanceKm?: number) => void;
}

function parseDecimal(raw: string): number | undefined {
  const normalized = raw.trim().replace(',', '.');
  if (!normalized) return undefined;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return value;
}

function formatSegDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} s`;
  if (s === 0) return `${m} min`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function TreadmillPage({ state, onCompleteWorkout }: TreadmillPageProps) {
  const [preview, setPreview] = useState<TreadmillWorkout | null>(null);
  const [active, setActive] = useState<TreadmillWorkout | null>(null);
  const [mins, setMins] = useState('20');
  const [km, setKm] = useState('2,0');
  const [quickSaved, setQuickSaved] = useState(false);
  const totalSessions = getTreadmillCompletionCount(state);
  const totalMinutes = getTreadmillTotalMinutes(state);
  const totalKm = getTreadmillTotalKm(state);

  const handleQuickLog = () => {
    const minutes = parseDecimal(mins);
    if (!minutes) return;
    const distance = parseDecimal(km);
    onCompleteWorkout(QUICK_TREADMILL_ID, Math.round(minutes * 60), distance);
    setQuickSaved(true);
    window.setTimeout(() => setQuickSaved(false), 2200);
  };

  return (
    <>
      {preview && (
        <WorkoutPreview
          kicker="Tekalna steza"
          title={preview.title}
          summary={preview.summary}
          meta={[
            { label: 'Čas', value: `~${preview.estimatedMinutes} min` },
            { label: 'Nivo', value: levelLabel[preview.level] },
            { label: 'Oprema', value: 'Steza' },
            { label: 'Segmenti', value: String(preview.segments.length) },
          ]}
          steps={preview.segments.map((s) => ({
            name: s.name,
            detail: `${formatSegDuration(s.durationSeconds)} · ${s.speedKmh} km/h · ${s.inclinePercent} %`,
          }))}
          stepsTitle="Segmenti"
          ctaLabel="Začni sejo"
          onStart={() => {
            setActive(preview);
            setPreview(null);
          }}
          onClose={() => setPreview(null)}
        />
      )}

      {active && (
        <TreadmillSession
          workout={active}
          onClose={() => setActive(null)}
          onComplete={onCompleteWorkout}
          feedback={state.feedback}
        />
      )}

      <div className="tm-page">
        <header className="tm-hero">
          <p className="tm-hero-kicker">Kettler Alpha Run 200</p>
          <h1 className="tm-hero-title">Tekalna steza</h1>
          <p className="tm-hero-lede">
            App pove hitrost, naklon in čas. Ti nastaviš na konzoli – telefon gre na držalo.
          </p>
          <div className="tm-hero-stats">
            <div>
              <strong>{totalSessions}</strong>
              <span>seje</span>
            </div>
            <div>
              <strong>{totalMinutes}</strong>
              <span>min</span>
            </div>
            <div>
              <strong>{totalKm.toFixed(1).replace('.', ',')}</strong>
              <span>km</span>
            </div>
          </div>
        </header>

        <section className="tm-quick">
          <div className="tm-quick-head">
            <h2>Hitri vnos</h2>
            <p>Brez vodene seje – vpiši, kar kaže konzola.</p>
          </div>
          <div className="tm-quick-fields">
            <label>
              <span>Minute</span>
              <input
                type="text"
                inputMode="decimal"
                value={mins}
                onChange={(e) => setMins(e.target.value)}
              />
            </label>
            <label>
              <span>Km</span>
              <input
                type="text"
                inputMode="decimal"
                value={km}
                onChange={(e) => setKm(e.target.value)}
              />
            </label>
          </div>
          <button type="button" className="tm-quick-btn" onClick={handleQuickLog}>
            {quickSaved ? 'Shranjeno ✓' : 'Logiraj stezo'}
          </button>
        </section>

        <ul className="tm-list">
          {treadmillWorkouts.map((workout) => {
            const count = getTreadmillCompletionCount(state, workout.id);
            const last = getLastTreadmillCompletion(state, workout.id);
            return (
              <li key={workout.id}>
                <button
                  type="button"
                  className={`tm-card ${count > 0 ? 'tm-card-done' : ''}`}
                  onClick={() => setPreview(workout)}
                >
                  <div className="tm-card-top">
                    <span className="tm-card-level">{levelLabel[workout.level]}</span>
                    <span className="tm-card-min">~{workout.estimatedMinutes} min</span>
                  </div>
                  <h2 className="tm-card-title">{workout.title}</h2>
                  <p className="tm-card-summary">{workout.summary}</p>
                  <div className="tm-card-footer">
                    <span className="tm-card-cta">{count > 0 ? 'Ponovi' : 'Začni'}</span>
                    {count > 0 && (
                      <span className="tm-card-count">
                        {count}×
                        {last && (
                          <> · {new Date(last.completedAt).toLocaleDateString('sl-SI')}</>
                        )}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
