import type { Exercise } from '../types';
import { categoryLabel } from '../data/categories';
import ExerciseIllustration from './ExerciseIllustration';
import TaiChiExerciseMedia from './TaiChiExerciseMedia';
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
  const isTaiChi = exercise.style === 'taichi';

  return (
    <article className={`exercise-card ${completed ? 'exercise-done' : ''} ${isTaiChi ? 'taichi' : ''}`}>
      <div className="exercise-card-inner">
        <header className="exercise-header">
          <span className="exercise-number" aria-hidden>{index + 1}</span>
          <div className="exercise-header-text">
            <p className="exercise-category">
              {isTaiChi ? 'Tai Chi' : categoryLabel(exercise.category)}
              {exercise.side === 'alternating' ? ' · izmenično' : ''}
            </p>
            <h3>{exercise.name}</h3>
            {exercise.englishName && (
              <p className="exercise-english">{exercise.englishName}</p>
            )}
            <p className="exercise-description">{exercise.description}</p>
          </div>
        </header>
      </div>

      {isTaiChi ? (
        <div className="exercise-taichi-media">
          <TaiChiExerciseMedia exercise={exercise} density="compact" />
        </div>
      ) : (
        <ExerciseIllustration category={exercise.category} label={exercise.name} />
      )}

      <div className="exercise-card-inner exercise-card-details">
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

        {exercise.breathing && (
          <details className="exercise-fold">
            <summary>Dihanje</summary>
            <p>{exercise.breathing}</p>
          </details>
        )}

        <details className="exercise-fold">
          <summary>{tm ? 'Na stezi' : 'Korak za korakom'}</summary>
          <ol className="howto-steps">
            {howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </details>

        {exercise.tips && exercise.tips.length > 0 && (
          <details className="exercise-fold">
            <summary>Pazi na to</summary>
            <ul>
              {exercise.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </details>
        )}

        {exercise.instructions.length > 0 && !tm && (
          <details className="exercise-fold">
            <summary>Opomniki</summary>
            <ul>
              {exercise.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </details>
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
