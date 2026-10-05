import type { Program, UserProgress } from '../types';
import { getDayByIndex } from '../data/programs';
import './ProgramCard.css';

export interface ProgramCardProps {
  program: Program;
  progress: UserProgress;
  onClick: () => void;
}

function countCompleted(program: Program, progress: UserProgress): number {
  return program.days.filter((day) => {
    const entry = progress.completedDays.find((d) => d.dayId === day.id);
    if (!entry) return false;
    return day.exercises.every((e) => entry.exercisesCompleted.includes(e.id));
  }).length;
}

function ctaLabel(done: number, total: number): string {
  if (done <= 0) return 'Začni';
  if (done >= total) return 'Ponovi';
  return 'Nadaljuj';
}

export default function ProgramCard({ program, progress, onClick }: ProgramCardProps) {
  const total = program.days.length;
  const done = countCompleted(program, progress);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const nextIndex = Math.min(progress.currentDayIndex, Math.max(0, total - 1));
  const nextDay = getDayByIndex(program.id, nextIndex);
  const duration = program.durationLabel ?? `${total} dni`;

  return (
    <button type="button" className="program-card" onClick={onClick}>
      <div className="program-card-main">
        <div className="program-card-text">
          <div className="program-card-top">
            <h2 className="program-card-title">{program.name}</h2>
            <span className="program-card-duration">{duration}</span>
          </div>
          <p className="program-card-meta">
            {done}/{total} dni · {percent}%
            {nextDay && done < total && ` · Dan ${nextDay.day}`}
            {done >= total && ' · Končano'}
          </p>
        </div>
        <span className="program-card-cta">{ctaLabel(done, total)}</span>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
      </div>
    </button>
  );
}
