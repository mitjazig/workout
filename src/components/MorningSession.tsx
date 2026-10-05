import { useState, useCallback, useRef } from 'react';
import type { FeedbackSettings } from '../types';
import type { MorningRoutine } from '../data/morningRoutines';
import { cueSegmentEnd, cueWorkoutComplete, unlockAudio } from '../utils/feedback';
import './MorningSession.css';

interface Props {
  routine: MorningRoutine;
  feedback: FeedbackSettings;
  sessionKicker?: string;
  doneBackLabel?: string;
  onClose: () => void;
  onComplete: (routineId: string) => void;
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

export default function MorningSession({
  routine,
  feedback,
  sessionKicker = 'Jutranja zgodba',
  doneBackLabel = 'Nazaj na jutro',
  onClose,
  onComplete,
}: Props) {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false);
  const lastTap = useRef(0);

  const move = routine.moves[index];
  const isLast = index === routine.moves.length - 1;
  const target = move.reps;
  const percent = Math.round(((index + count / target) / routine.moves.length) * 100);
  const moveDone = count >= target;

  const bump = useCallback(() => {
    void unlockAudio();
    const now = Date.now();
    if (now - lastTap.current < 80) return;
    lastTap.current = now;

    setCount((c) => {
      const next = Math.min(c + 1, target);
      if (next === target && c < target) {
        cueSegmentEnd(feedback);
      }
      return next;
    });
  }, [feedback, target]);

  const finishMove = () => {
    void unlockAudio();
    if (isLast) {
      cueWorkoutComplete(feedback);
      if (!saved) {
        onComplete(routine.id);
        setSaved(true);
      }
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setCount(0);
  };

  const skipToDone = () => {
    setCount(target);
    cueSegmentEnd(feedback);
  };

  if (done) {
    return (
      <div className="morning-session">
        <div className="morning-session-top">
          <button type="button" className="morning-back" onClick={onClose} aria-label="Zapri">
            <IconBack />
          </button>
          <span className="morning-session-label">Končano</span>
        </div>
        <div className="morning-done">
          <p className="morning-done-kicker">{sessionKicker}</p>
          <h2>{routine.title}</h2>
          <p>{routine.finishNote}</p>
          <button type="button" className="morning-btn primary wide" onClick={onClose}>
            {doneBackLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="morning-session">
      <div className="morning-session-top">
        <button type="button" className="morning-back" onClick={onClose} aria-label="Nazaj">
          <IconBack />
        </button>
        <div className="morning-session-progress">
          <span className="morning-session-label">
            Gib {index + 1}/{routine.moves.length} · {routine.title}
          </span>
          <div className="morning-progress-bar">
            <div className="morning-progress-fill" style={{ width: `${Math.min(100, percent)}%` }} />
          </div>
        </div>
      </div>

      <div className="morning-session-body">
        <h2 className="morning-move-name">{move.name}</h2>
        <p className="morning-move-desc">{move.description}</p>

        <button
          type="button"
          className={`morning-rep-pad ${moveDone ? 'done' : ''}`}
          onClick={bump}
          aria-label={`Štej ponovitev, trenutno ${count} od ${target}`}
        >
          <span className="morning-rep-count">{count}</span>
          <span className="morning-rep-target">/ {target}</span>
          <span className="morning-rep-hint">
            {moveDone ? 'Cilj dosežen' : 'Tapni za vsako ponovitev'}
          </span>
        </button>

        <ol className="morning-howto">
          {move.howTo.slice(0, 3).map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="morning-session-actions">
        {!moveDone && (
          <button type="button" className="morning-btn secondary wide" onClick={skipToDone}>
            Označi {target}× kot opravljeno
          </button>
        )}
        <button
          type="button"
          className="morning-btn primary wide"
          onClick={finishMove}
          disabled={!moveDone}
        >
          {isLast ? 'Zaključi rutino' : 'Naslednji gib'}
        </button>
      </div>
    </div>
  );
}
