import { Link } from 'react-router-dom';
import type { AppState } from '../types';
import { getDayByIndex, getProgram } from '../data/programs';
import { categoryLabel } from '../data/categories';
import {
  getActiveProgress,
  getCompletedCount,
  getCompletionPercent,
  isDayCompleted,
  isProgramDayCompleted,
} from '../services/progress';
import './HomePage.css';
import './ProgramHomePage.css';

interface Props {
  state: AppState;
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
    <svg viewBox="0 0 24 24">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

export default function ProgramHomePage({ state }: Props) {
  const program = getProgram(state.activeProgramId);
  const progress = getActiveProgress(state);
  const totalDays = program.days.length;
  const percent = getCompletionPercent(state, totalDays);
  const daysDone = getCompletedCount(state);
  const currentDay = getDayByIndex(program.id, progress.currentDayIndex);
  const currentCompleted = currentDay ? isDayCompleted(state, currentDay.id) : false;
  const allDone = daysDone >= totalDays && totalDays > 0;

  const weeks = Array.from({ length: program.weeks }, (_, i) => i + 1);

  return (
    <div className="program-home">
      <Link to="/" className="program-home-back">
        <IconBack />
        Vsi programi
      </Link>

      <header className="program-home-hero">
        <div className="program-home-title-row">
          <h1 className="program-home-title">{program.name}</h1>
          {program.badge && <span className="program-home-badge">{program.badge}</span>}
        </div>
        <div className="program-home-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="program-home-progress-text">
            <strong>
              {daysDone}/{totalDays}
            </strong>{' '}
            dni · {percent}%
            {(program.durationLabel || program.equipment?.length) && (
              <>
                {' '}
                ·{' '}
                {[
                  program.durationLabel,
                  ...(program.equipment?.length ? program.equipment : ['Brez opreme']),
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </>
            )}
          </p>
        </div>
        {program.safetyNote && (
          <p className="program-home-safety">{program.safetyNote}</p>
        )}
      </header>

      <section className="program-weeks" aria-label="Tedni">
        {weeks.map((week) => {
          const weekDays = program.days.filter((d) => d.week === week);
          return (
            <div key={week} className="program-week">
              <h2 className="program-week-title">Teden {week}</h2>
              <div className="program-week-dots">
                {weekDays.map((day) => {
                  const done = isProgramDayCompleted(state, program.id, day.id);
                  return (
                    <Link
                      key={day.id}
                      to={`/day/${day.id}`}
                      className={`program-week-dot ${done ? 'done' : ''}`}
                      title={`Dan ${day.day}: ${day.title}`}
                      aria-label={`Dan ${day.day}${done ? ', opravljeno' : ''}`}
                    >
                      {done ? <IconCheck /> : day.day}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {currentDay && (
        <section className="program-next">
          <p className="program-next-kicker">
            {allDone ? 'Program končan' : 'Naslednja vadba'}
          </p>
          <p className="program-next-day">Dan {currentDay.day}</p>
          <h2 className="program-next-title">{currentDay.title}</h2>
          <p className="program-next-summary">{currentDay.summary}</p>
          <div className="program-next-meta">
            <span>{categoryLabel(currentDay.focus)}</span>
            <span>~{currentDay.estimatedMinutes} min</span>
          </div>
          {currentCompleted && !allDone ? (
            <span className="badge badge-done">
              <IconCheck /> Dan opravljen
            </span>
          ) : (
            <Link to={`/day/${currentDay.id}`} className="program-next-cta">
              <IconPlay />
              {allDone ? 'Ponovi' : daysDone === 0 ? 'Začni' : 'Začni'}
            </Link>
          )}
        </section>
      )}

      <section className="program-all" id="vse-vadbe">
        <div className="program-all-head">
          <h2>Vse vadbe</h2>
          <span>
            {daysDone}/{totalDays}
          </span>
        </div>
        <ul className="day-list">
          {program.days.map((day, i) => {
            const done = isDayCompleted(state, day.id);
            return (
              <li key={day.id} style={{ animationDelay: `${0.05 + i * 0.02}s` }}>
                <Link to={`/day/${day.id}`} className={`day-item ${done ? 'day-done' : ''}`}>
                  <div className="day-number">{done ? <IconCheck /> : day.day}</div>
                  <div className="day-item-info">
                    <span className="day-item-label">{categoryLabel(day.focus)}</span>
                    <span className="day-item-title">{day.title}</span>
                    <span className="day-item-meta">
                      {day.estimatedMinutes} min · {day.exercises.length} korakov
                    </span>
                  </div>
                  {done ? (
                    <span className="badge badge-done">
                      <IconCheck />
                    </span>
                  ) : (
                    <span className="day-item-arrow">
                      <IconChevronRight />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
