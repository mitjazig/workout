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
  if (done <= 0) return 'Začni program';
  if (done >= total) return 'Ponovi program';
  return 'Nadaljuj';
}

export default function ProgramCard({ program, progress, onClick }: ProgramCardProps) {
  const total = program.days.length;
  const done = countCompleted(program, progress);
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const nextIndex = Math.min(progress.currentDayIndex, Math.max(0, total - 1));
  const nextDay = getDayByIndex(program.id, nextIndex);
  const equipment =
    program.equipment && program.equipment.length > 0
      ? program.equipment.join(' · ')
      : 'Brez opreme';
  const duration = program.durationLabel ?? `${total} dni`;

  return (
    <button type="button" className="program-card" onClick={onClick}>
      <div className="program-card-top">
        {program.badge && <span className="program-card-badge">{program.badge}</span>}
        <span className="program-card-duration">{duration}</span>
      </div>

      <h2 className="program-card-title">{program.name}</h2>
      <p className="program-card-desc">
        {program.shortDescription ?? program.description}
      </p>

      <div className="program-card-progress">
        <div className="program-card-progress-meta">
          <span>
            Dan {done} / {total}
          </span>
          <span>{percent}%</span>
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
      </div>

      <div className="program-card-meta">
        <span>{equipment}</span>
        {nextDay && done < total && (
          <span>
            {done === 0 ? 'Začni' : 'Nadaljuj'}: Dan {nextDay.day}
          </span>
        )}
        {done >= total && <span>Program končan</span>}
      </div>

      <span className="program-card-cta">{ctaLabel(done, total)}</span>
    </button>
  );
}
