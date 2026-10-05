import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TrainingDay } from '../types';
import ExerciseIllustration from './ExerciseIllustration';
import TaiChiExerciseMedia from './TaiChiExerciseMedia';
import './ExerciseSession.css';
import './CardioModeToggle.css';

interface Props {
  day: TrainingDay;
  completedExercises: string[];
  onCompleteExercise: (exerciseId: string) => void;
  onCompleteDay?: () => void;
  onClose: () => void;
  useTreadmill?: boolean;
}

function IconBack() {
  return <svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6" /></svg>;
}
function IconCheck() {
  return <svg viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12" /></svg>;
}
function IconNext() {
  return <svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" /></svg>;
}

function formatSpeed(v: number) {
  return v.toFixed(1).replace('.', ',');
}

function Timer({
  durationSeconds,
  onFinish,
  calm,
}: {
  durationSeconds: number;
  onFinish: () => void;
  calm?: boolean;
}) {
  const { display, running, finished, start, pause, reset } = useTimer(durationSeconds);

  useEffect(() => {
    if (finished) onFinish();
  }, [finished, onFinish]);

  return (
    <div className={`session-timer ${calm ? 'calm' : ''}`}>
      <div className={`session-timer-time ${finished ? 'finished' : ''}`}>{display}</div>
      {finished && calm && (
        <p className="session-timer-calm-note">Čas je mimo – doključite krog, nato naprej.</p>
      )}
      <div className="session-timer-btns">
        {!running ? (
          <button className="s-btn start" onClick={start} disabled={finished}>
            {finished ? (calm ? 'Pripravljeno' : '✓ Konec') : '▶ Začni'}
          </button>
        ) : (
          <button className="s-btn pause" onClick={pause}>⏸ Pavza</button>
        )}
        <button className="s-btn reset" onClick={() => reset(durationSeconds)}>↺</button>
      </div>
    </div>
  );
}

export default function ExerciseSession({
  day,
  completedExercises,
  onCompleteExercise,
  onCompleteDay,
  onClose,
  useTreadmill = false,
}: Props) {
  const exercises = day.exercises;
  const [index, setIndex] = useState(() => {
    const first = exercises.findIndex((e) => !completedExercises.includes(e.id));
    return first >= 0 ? first : 0;
  });
  const [timerKey, setTimerKey] = useState(0);

  const exercise = exercises[index];
  const tm = useTreadmill ? exercise.treadmill : undefined;
  const isTaiChi = exercise.style === 'taichi';
  const isCompleted = completedExercises.includes(exercise.id);
  const isLast = index === exercises.length - 1;
  const percent = Math.round((index / exercises.length) * 100);
  const allDone = exercises.every((e) => completedExercises.includes(e.id));

  const goNext = () => {
    if (!isCompleted) onCompleteExercise(exercise.id);
    if (!isLast) {
      setIndex((i) => i + 1);
      setTimerKey((k) => k + 1);
    }
  };

  const handleComplete = () => {
    if (!isCompleted) onCompleteExercise(exercise.id);
  };

  if (allDone) {
    return (
      <div className={`session-overlay ${isTaiChi ? 'session-taichi' : ''}`}>
        <div className="session-topbar">
          <button className="session-back" onClick={onClose}><IconBack /></button>
          <div className="session-progress-wrap">
            <span className="session-progress-label">
              {day.focus === 'mobility' ? 'Vadba zaključena' : 'Trening zaključen'}
            </span>
            <div className="session-progress-bar">
              <div className="session-progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
          <span className="session-counter">{exercises.length}/{exercises.length}</span>
        </div>
        <div className="session-done-screen">
          <div className="session-done-icon">✓</div>
          <h2>{isTaiChi || day.focus === 'mobility' ? 'Mirno zaključeno' : 'Odlično!'}</h2>
          <p>Vsi koraki za danes so opravljeni.</p>
          {onCompleteDay ? (
            <button type="button" className="session-done-close" onClick={onCompleteDay}>
              <IconCheck /> Potrdi dan kot opravljen
            </button>
          ) : (
            <button type="button" className="session-done-close" onClick={onClose}>
              <IconCheck /> Nazaj na dan
            </button>
          )}
          {onCompleteDay && (
            <button type="button" className="session-done-secondary" onClick={onClose}>
              Nazaj na dan
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`session-overlay ${isTaiChi ? 'session-taichi' : ''}`}>
      <div className="session-topbar">
        <button className="session-back" onClick={onClose} aria-label="Zapri vadbo">
          <IconBack />
        </button>
        <div className="session-progress-wrap">
          <span className="session-progress-label">{exercise.name}</span>
          <div className="session-progress-bar">
            <div className="session-progress-fill" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <span className="session-counter">{index + 1}/{exercises.length}</span>
      </div>

      <div className="session-body">
        <h2 className="session-name">{exercise.name}</h2>
        {exercise.englishName && (
          <p className="session-english">{exercise.englishName}</p>
        )}
        <p className="session-desc">
          {tm?.note ?? exercise.description}
        </p>

        {tm ? (
          <div className="tm-targets-inline session-tm-targets">
            <div className="tm-chip">
              <span className="tm-chip-value">
                {tm.speedEasyKmh
                  ? `${formatSpeed(tm.speedEasyKmh)}–${formatSpeed(tm.speedKmh)}`
                  : formatSpeed(tm.speedKmh)}
              </span>
              <span className="tm-chip-label">km/h</span>
            </div>
            <div className="tm-chip">
              <span className="tm-chip-value">{tm.inclinePercent}</span>
              <span className="tm-chip-label">naklon %</span>
            </div>
          </div>
        ) : isTaiChi ? (
          <div className="session-taichi-media">
            <TaiChiExerciseMedia exercise={exercise} />
          </div>
        ) : (
          <div className="session-illus">
            <ExerciseIllustration category={exercise.category} label={exercise.name} />
          </div>
        )}

        {exercise.breathing && (
          <div className="session-breathing">
            <p className="session-breathing-label">Dihanje</p>
            <p>{exercise.breathing}</p>
          </div>
        )}

        {!tm && exercise.howTo.length > 0 && (
          <details className="session-howto">
            <summary>Korak za korakom</summary>
            <ol>
              {exercise.howTo.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </details>
        )}

        {exercise.tips && exercise.tips.length > 0 && (
          <details className="session-howto session-tips">
            <summary>Pazi na to</summary>
            <ul>
              {exercise.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </details>
        )}

        <Timer
          key={`${exercise.id}-${timerKey}`}
          durationSeconds={exercise.durationSeconds}
          onFinish={handleComplete}
          calm={isTaiChi}
        />

        <div className="session-actions">
          <button
            className={`session-complete-btn ${isCompleted ? 'done' : ''}`}
            onClick={handleComplete}
            disabled={isCompleted}
          >
            <IconCheck />
            {isCompleted ? 'Opravljeno' : 'Označi opravljeno'}
          </button>

          <button className="session-next-btn" onClick={goNext}>
            {isLast ? 'Zaključi' : <><IconNext /></>}
          </button>
        </div>
      </div>
    </div>
  );
}
