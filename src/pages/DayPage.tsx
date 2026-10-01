import { useMemo, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import type { AppState, CardioMode, TrainingDay, WorkoutDifficulty } from '../types';
import { getDayById, getProgram } from '../data/programs';
import { dayHasTreadmillCardio } from '../data/challengeProgram';
import { categoryLabel } from '../data/categories';
import { getDayVideo } from '../data/dayVideos';
import {
  getDayExerciseProgress,
  getProgressStats,
  hasDayProgress,
  isDayCompleted,
} from '../services/progress';
import { scaleTrainingDay } from '../utils/difficulty';
import { shareOrDownloadCard } from '../utils/shareCard';
import CardioModeToggle from '../components/CardioModeToggle';
import DayVideo from '../components/DayVideo';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseSession from '../components/ExerciseSession';
import WorkoutPreview from '../components/WorkoutPreview';
import './DayPage.css';

interface DayPageProps {
  state: AppState;
  onCompleteExercise: (dayId: string, exerciseId: string) => void;
  onCompleteDay: (dayId: string, exercisesCompleted: string[]) => void;
  onClearDay: (dayId: string) => void;
  onCardioModeChange: (mode: CardioMode) => void;
  onDifficultyChange: (difficulty: WorkoutDifficulty) => void;
}

function IconBack() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'currentColor', strokeWidth: 0 }}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`;
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

export default function DayPage({
  state,
  onCompleteExercise,
  onCompleteDay,
  onClearDay,
  onCardioModeChange,
  onDifficultyChange,
}: DayPageProps) {
  const { dayId } = useParams<{ dayId: string }>();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionDay, setSessionDay] = useState<TrainingDay | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const program = getProgram(state.activeProgramId);
  const day = dayId ? getDayById(program.id, dayId) : undefined;

  const scaledPreview = useMemo(() => {
    if (!day) return null;
    return scaleTrainingDay(day, state.difficulty);
  }, [day, state.difficulty]);

  if (!day || !scaledPreview) return <Navigate to="/" replace />;

  const completedExercises = getDayExerciseProgress(state, day.id);
  const dayDone = isDayCompleted(state, day.id);
  const hasProgress = hasDayProgress(state, day.id);
  const allExercisesDone = day.exercises.every((e) => completedExercises.includes(e.id));
  const dayVideo = getDayVideo(day.day);
  const showCardioToggle = dayHasTreadmillCardio(day);
  const useTreadmill = state.cardioMode === 'treadmill';
  const stats = getProgressStats(state);
  const equipment = showCardioToggle
    ? useTreadmill
      ? 'Steza'
      : 'Zunaj'
    : 'Doma';

  const handleCompleteDay = () => {
    onCompleteDay(day.id, day.exercises.map((e) => e.id));
  };

  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    onClearDay(day.id);
    setConfirmClear(false);
  };

  const handleShare = async () => {
    setShareStatus('Pripravljam …');
    const result = await shareOrDownloadCard({
      dayNumber: day.day,
      title: day.title,
      streak: stats.currentStreak,
      percent: stats.challengePercent,
    });
    setShareStatus(
      result === 'shared' ? 'Deljeno ✓' : result === 'downloaded' ? 'Shranjeno ✓' : null,
    );
    if (result !== 'cancelled') {
      window.setTimeout(() => setShareStatus(null), 2200);
    } else {
      setShareStatus(null);
    }
  };

  const startFromPreview = () => {
    setSessionDay(scaleTrainingDay(day, state.difficulty));
    setPreviewOpen(false);
    setSessionOpen(true);
  };

  return (
    <>
      {previewOpen && (
        <WorkoutPreview
          kicker={`Dan ${day.day}/10`}
          title={day.title}
          summary={day.summary}
          meta={[
            { label: 'Čas', value: `~${scaledPreview.estimatedMinutes} min` },
            { label: 'Fokus', value: categoryLabel(day.focus) },
            { label: 'Oprema', value: equipment },
            { label: 'Koraki', value: String(scaledPreview.exercises.length) },
          ]}
          steps={scaledPreview.exercises.map((e) => ({
            name: e.name,
            detail: formatDuration(e.durationSeconds),
          }))}
          stepsTitle="Koraki dneva"
          difficulty={state.difficulty}
          onDifficultyChange={onDifficultyChange}
          ctaLabel="Začni dan"
          onStart={startFromPreview}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {sessionOpen && sessionDay && (
        <ExerciseSession
          day={sessionDay}
          completedExercises={completedExercises}
          onCompleteExercise={(exerciseId) => onCompleteExercise(day.id, exerciseId)}
          onClose={() => {
            setSessionOpen(false);
            setSessionDay(null);
          }}
          useTreadmill={useTreadmill}
        />
      )}

      <div className="day-page">
        <Link to="/" className="back-link">
          <IconBack />
          Nazaj
        </Link>

        <header className="day-header">
          <div className="day-meta">
            <span className="day-meta-chip">Dan {day.day}/10</span>
            <span className="day-meta-chip">{categoryLabel(day.focus)}</span>
            <span className="day-meta-chip">~{day.estimatedMinutes} min</span>
          </div>
          <h2>{day.title}</h2>
          <p>{day.summary}</p>
          {dayDone && <span className="badge badge-done">Dan opravljen ✓</span>}

          {showCardioToggle && (
            <div className="day-cardio-toggle">
              <CardioModeToggle
                value={state.cardioMode}
                onChange={onCardioModeChange}
              />
            </div>
          )}

          {dayDone && (
            <button type="button" className="day-share-btn" onClick={() => void handleShare()}>
              {shareStatus ?? 'Deli za Stories'}
            </button>
          )}

          {hasProgress && (
            <button
              type="button"
              className={`day-clear-btn ${confirmClear ? 'confirm' : ''}`}
              onClick={handleClear}
              onBlur={() => setConfirmClear(false)}
            >
              {confirmClear ? 'Potrdi brisanje napredka' : 'Izbriši napredek dneva'}
            </button>
          )}
        </header>

        {!dayDone && (
          <button
            type="button"
            className="start-session-btn"
            onClick={() => setPreviewOpen(true)}
          >
            <IconPlay />
            Začni dan
          </button>
        )}

        {dayVideo && <DayVideo video={dayVideo} />}

        <h3 className="exercise-list-title">Koraki dneva</h3>

        <div className="exercise-list">
          {day.exercises.map((exercise, i) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              index={i}
              completed={completedExercises.includes(exercise.id)}
              onComplete={(id) => onCompleteExercise(day.id, id)}
              useTreadmill={useTreadmill}
            />
          ))}
        </div>

        {!dayDone && (
          <div className="day-complete-section">
            <button
              type="button"
              className="btn-primary"
              onClick={handleCompleteDay}
              disabled={!allExercisesDone}
            >
              Označi celoten dan kot opravljen
            </button>
            {!allExercisesDone && (
              <p className="hint">Najprej opravite vse korake ali jih označite ročno.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
