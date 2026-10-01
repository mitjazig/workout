import { useState, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import type { TrainingDay } from '../types';
import ExerciseIllustration from './ExerciseIllustration';
import './ExerciseSession.css';
import './CardioModeToggle.css';

interface Props {
  day: TrainingDay;
  completedExercises: string[];
  onCompleteExercise: (exerciseId: string) => void;
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

function Timer({ durationSeconds, onFinish }: { durationSeconds: number; onFinish: () => void }) {
  const { display, running, finished, start, pause, reset } = useTimer(durationSeconds);

  useEffect(() => {
    if (finished) onFinish();
  }, [finished, onFinish]);

  return (
    <div className="session-timer">
      <div className={`session-timer-time ${finished ? 'finished' : ''}`}>{display}</div>
      <div className="session-timer-btns">
        {!running ? (
          <button className="s-btn start" onClick={start} disabled={finished}>
            {finished ? '✓ Konec' : '▶ Začni'}
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
      <div className="session-overlay">
        <div className="session-topbar">
          <button className="session-back" onClick={onClose}><IconBack /></button>
          <div className="session-progress-wrap">
            <span className="session-progress-label">Trening zaključen</span>
            <div className="session-progress-bar">
              <div className="session-progress-fill" style={{ width: '100%' }} />
            </div>
          </div>
          <span className="session-counter">{exercises.length}/{exercises.length}</span>
        </div>
        <div className="session-done-screen">
          <div className="session-done-icon">✓</div>
          <h2>Odlično!</h2>
          <p>Vsi koraki za danes so opravljeni.</p>
          <button className="session-done-close" onClick={onClose}>
            <IconCheck /> Nazaj na dan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="session-overlay">
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
        ) : (
          <div className="session-illus">
            <ExerciseIllustration category={exercise.category} label={exercise.name} />
          </div>
        )}

        <Timer
          key={`${exercise.id}-${timerKey}`}
          durationSeconds={exercise.durationSeconds}
          onFinish={handleComplete}
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
