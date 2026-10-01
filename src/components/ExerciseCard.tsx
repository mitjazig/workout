import type { Exercise } from '../types';
import { categoryLabel } from '../data/categories';
import ExerciseIllustration from './ExerciseIllustration';
import Timer from './Timer';
import './ExerciseCard.css';
import './CardioModeToggle.css';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  completed: boolean;
  onComplete: (exerciseId: string) => void;
  useTreadmill?: boolean;
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function formatSpeed(v: number) {
  return v.toFixed(1).replace('.', ',');
}

export default function ExerciseCard({
  exercise,
  index,
  completed,
  onComplete,
  useTreadmill = false,
}: ExerciseCardProps) {
  const tm = useTreadmill ? exercise.treadmill : undefined;
  const howTo = tm?.howTo?.length ? tm.howTo : exercise.howTo;

  return (
    <article className={`exercise-card ${completed ? 'exercise-done' : ''}`}>
      <div className="exercise-card-inner">
        <header className="exercise-header">
          <span className="exercise-number" aria-hidden>{index + 1}</span>
          <div className="exercise-header-text">
            <p className="exercise-category">{categoryLabel(exercise.category)}</p>
            <h3>{exercise.name}</h3>
            <p className="exercise-description">{exercise.description}</p>
          </div>
        </header>
      </div>

      <ExerciseIllustration category={exercise.category} label={exercise.name} />

      <div className="exercise-card-inner">
        {tm && (
          <>
            {tm.note && <p className="tm-guide-note">{tm.note}</p>}
            <div className="tm-targets-inline">
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
          </>
        )}

        <div className="exercise-howto">
          <h4>{tm ? 'Na stezi' : 'Korak za korakom'}</h4>
          <ol className="howto-steps">
            {howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        {exercise.tips && exercise.tips.length > 0 && (
          <div className="exercise-tips">
            <h4>Pazite na to</h4>
            <ul>
              {exercise.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {exercise.instructions.length > 0 && !tm && (
          <div className="exercise-instructions">
            <h4>Opomniki</h4>
            <ul>
              {exercise.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        <Timer
          durationSeconds={exercise.durationSeconds}
          onFinish={() => {
            if (!completed) onComplete(exercise.id);
          }}
        />
      </div>

      <div className="exercise-footer">
        {completed ? (
          <div className="exercise-done-label">
            <IconCheck />
            Korak opravljen
          </div>
        ) : (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => onComplete(exercise.id)}
          >
            Označi kot opravljeno
          </button>
        )}
      </div>
    </article>
  );
}
