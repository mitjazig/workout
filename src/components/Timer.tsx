import { useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import './Timer.css';

interface TimerProps {
  durationSeconds: number;
  onFinish?: () => void;
}

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Timer({ durationSeconds, onFinish }: TimerProps) {
  const { seconds, display, running, finished, start, pause, reset } = useTimer(durationSeconds);

  useEffect(() => {
    if (finished) onFinish?.();
  }, [finished, onFinish]);

  const progress = durationSeconds > 0 ? seconds / durationSeconds : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div className="timer" role="timer" aria-live="polite">
      <div className="timer-ring">
        <svg viewBox="0 0 120 120">
          <circle className="timer-ring-bg" cx="60" cy="60" r={RADIUS} />
          <circle
            className={`timer-ring-fill ${finished ? 'finished' : ''} ${running ? 'running' : ''}`}
            cx="60"
            cy="60"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="timer-display-center">
          <span
            className={`timer-display ${finished ? 'finished' : ''}`}
            aria-label={`Preostali čas: ${display}`}
          >
            {display}
          </span>
          <span className="timer-label">{finished ? 'Konec' : running ? 'Teče' : 'Čas'}</span>
        </div>
      </div>

      <div className="timer-controls">
        {!running ? (
          <button
            type="button"
            className="btn-small timer-btn-start"
            onClick={start}
            disabled={finished}
          >
            {finished ? 'Končano ✓' : 'Začni'}
          </button>
        ) : (
          <button type="button" className="btn-small timer-btn-pause" onClick={pause}>
            Pavza
          </button>
        )}
        <button
          type="button"
          className="btn-small timer-btn-reset"
          onClick={() => reset(durationSeconds)}
        >
          Ponastavi
        </button>
      </div>
    </div>
  );
}
