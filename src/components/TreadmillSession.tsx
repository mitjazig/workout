import { useState, useEffect, useCallback, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { FeedbackSettings } from '../types';
import type { TreadmillWorkout } from '../types/treadmill';
import { estimateWorkoutKm } from '../data/treadmillWorkouts';
import { cueSegmentEnd, cueWorkoutComplete, unlockAudio } from '../utils/feedback';
import './TreadmillSession.css';

interface Props {
  workout: TreadmillWorkout;
  onClose: () => void;
  onComplete: (workoutId: string, durationSeconds: number, distanceKm?: number) => void;
  feedback: FeedbackSettings;
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

function formatSpeed(v: number) {
  return v.toFixed(1).replace('.', ',');
}

function SegmentTimer({
  durationSeconds,
  onFinish,
}: {
  durationSeconds: number;
  onFinish: () => void;
}) {
  const { display, running, finished, start, pause, reset } = useTimer(durationSeconds);

  useEffect(() => {
    if (finished) onFinish();
  }, [finished, onFinish]);

  return (
    <div className="tm-timer">
      <div className={`tm-timer-display ${finished ? 'finished' : ''}`}>{display}</div>
      <div className="tm-timer-btns">
        {!running ? (
          <button type="button" className="tm-btn primary" onClick={start} disabled={finished}>
            {finished ? 'Konec' : 'Začni'}
          </button>
        ) : (
          <button type="button" className="tm-btn secondary" onClick={pause}>
            Pavza
          </button>
        )}
        <button type="button" className="tm-btn ghost" onClick={() => reset(durationSeconds)}>
          ↺
        </button>
      </div>
    </div>
  );
}

export default function TreadmillSession({ workout, onClose, onComplete, feedback }: Props) {
  const [index, setIndex] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const estimated = estimateWorkoutKm(workout);
  const [kmInput, setKmInput] = useState(estimated.toFixed(1).replace('.', ','));
  const cuedRef = useRef(false);

  const segment = workout.segments[index];
  const isLast = index === workout.segments.length - 1;
  const percent = Math.round(((index + (done ? 1 : 0)) / workout.segments.length) * 100);
  const next = !isLast ? workout.segments[index + 1] : null;
  const totalSeconds = workout.segments.reduce((sum, s) => sum + s.durationSeconds, 0);

  useEffect(() => {
    cuedRef.current = false;
  }, [index, timerKey]);

  const handleSegmentEnd = useCallback(() => {
    if (cuedRef.current) return;
    cuedRef.current = true;
    cueSegmentEnd(feedback);
  }, [feedback]);

  const parseKm = (raw: string): number | undefined => {
    const normalized = raw.trim().replace(',', '.');
    if (!normalized) return undefined;
    const value = Number(normalized);
    if (!Number.isFinite(value) || value <= 0) return undefined;
    return Math.round(value * 100) / 100;
  };

  const goNext = () => {
    void unlockAudio();
    if (isLast) {
      cueWorkoutComplete(feedback);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setTimerKey((k) => k + 1);
  };

  const handleSave = () => {
    if (saved) {
      onClose();
      return;
    }
    onComplete(workout.id, totalSeconds, parseKm(kmInput));
    setSaved(true);
  };

  if (done) {
    return (
      <div className="tm-session">
        <div className="tm-session-top">
          <button type="button" className="tm-back" onClick={onClose} aria-label="Zapri">
            <IconBack />
          </button>
          <span className="tm-session-label">Končano</span>
        </div>
        <div className="tm-done">
          <p className="tm-done-kicker">Tekalna steza</p>
          <h2>{workout.title}</h2>
          {!saved ? (
            <>
              <p>Vpiši km s konzole (Alpha Run). Ocena po programu: {formatSpeed(estimated)} km.</p>
              <label className="tm-km-field">
                <span>Prehojeno (km)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={kmInput}
                  onChange={(e) => setKmInput(e.target.value)}
                  placeholder="npr. 2,4"
                  autoFocus
                />
              </label>
              <button type="button" className="tm-btn primary wide" onClick={handleSave}>
                Shrani vadbo
              </button>
              <button
                type="button"
                className="tm-btn secondary wide"
                onClick={() => {
                  onComplete(workout.id, totalSeconds);
                  setSaved(true);
                }}
              >
                Shrani brez km
              </button>
            </>
          ) : (
            <>
              <p>
                Odlično – seja je shranjena
                {parseKm(kmInput) ? ` (${formatSpeed(parseKm(kmInput)!)} km)` : ''}.
              </p>
              <button type="button" className="tm-btn primary wide" onClick={onClose}>
                Nazaj na stezo
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tm-session">
      <div className="tm-session-top">
        <button type="button" className="tm-back" onClick={onClose} aria-label="Nazaj">
          <IconBack />
        </button>
        <div className="tm-session-progress">
          <span className="tm-session-label">
            {index + 1}/{workout.segments.length} · {workout.title}
          </span>
          <div className="tm-progress-bar" role="progressbar" aria-valuenow={percent}>
            <div className="tm-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>

      <div className="tm-session-body">
        <p className="tm-seg-kicker">Nastavi na konzoli</p>
        <h2 className="tm-seg-name">{segment.name}</h2>
        {segment.note && <p className="tm-seg-note">{segment.note}</p>}

        <div className="tm-targets">
          <div className="tm-target">
            <span className="tm-target-value">{formatSpeed(segment.speedKmh)}</span>
            <span className="tm-target-unit">km/h</span>
            <span className="tm-target-label">Hitrost</span>
          </div>
          <div className="tm-target">
            <span className="tm-target-value">{segment.inclinePercent}</span>
            <span className="tm-target-unit">%</span>
            <span className="tm-target-label">Naklon</span>
          </div>
        </div>

        <SegmentTimer
          key={timerKey}
          durationSeconds={segment.durationSeconds}
          onFinish={handleSegmentEnd}
        />

        {next && (
          <p className="tm-next-hint">
            Naprej: {next.name} · {formatSpeed(next.speedKmh)} km/h · {next.inclinePercent} %
          </p>
        )}
      </div>

      <div className="tm-session-actions">
        <button type="button" className="tm-btn primary wide" onClick={goNext}>
          {isLast ? 'Zaključi vadbo' : 'Naslednji segment'}
        </button>
      </div>
    </div>
  );
}
