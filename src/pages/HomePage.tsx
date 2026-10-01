import { Link } from 'react-router-dom';
import type { AppState } from '../types';
import { getDayByIndex, getProgram } from '../data/programs';
import { categoryLabel } from '../data/categories';
import {
  getActiveProgress,
  getCompletedCount,
  getCompletionPercent,
  getProgressStats,
  getWeeklySummary,
  hasActivityToday,
  isDayCompleted,
  wasMorningDoneToday,
} from '../services/progress';
import WeeklySummaryCard from '../components/WeeklySummary';
import './HomePage.css';

interface HomePageProps {
  state: AppState;
  onSelectProgram: (programId: string) => void;
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24">
      <polygon points="5,3 19,12 5,21" />
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

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  );
}

export default function HomePage({ state }: HomePageProps) {
  const program = getProgram(state.activeProgramId);
  const progress = getActiveProgress(state);
  const totalDays = program.days.length;
  const percent = getCompletionPercent(state, totalDays);
  const currentDay = getDayByIndex(program.id, progress.currentDayIndex);
  const currentCompleted = currentDay ? isDayCompleted(state, currentDay.id) : false;
  const daysDone = getCompletedCount(state);
  const stats = getProgressStats(state);
  const week = getWeeklySummary(state);
  const activeToday = hasActivityToday(state);
  const morningToday = wasMorningDoneToday(state);

  return (
    <div className="home-page">
      <section className="home-hero" aria-label="Izziv 10">
        <div className="home-hero-aurora" aria-hidden="true">
          <span className="home-orb home-orb-a" />
          <span className="home-orb home-orb-b" />
          <span className="home-orb home-orb-c" />
        </div>
        <p className="home-kicker">10-dnevni izziv</p>
        <h1 className="home-brand">Izziv 10</h1>
        <p className="home-lede">Doma. Brez opreme. 15–30 minut na dan.</p>
        <div className="home-progress">
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="home-progress-text">
            <strong>{daysDone}/{totalDays}</strong> dni · {percent}%
            {stats.currentStreak > 0 ? ` · niz ${stats.currentStreak}` : ''}
          </p>
        </div>
      </section>

      <section className="home-story">
        <div className="home-story-top">
          <p className="home-story-kicker">Posebna zgodba</p>
          {morningToday && <span className="home-story-done">Danes ✓</span>}
        </div>
        <h2 className="home-story-title">Jutranji blok</h2>
        <p className="home-story-text">
          Zbudi telo (5 min) ali Za srce (2 min) – nato hoja. Ločeno od 10-dnevnega izziva.
        </p>
        <Link to="/morning" className="home-story-cta">
          Odpri jutranjo zgodbo
        </Link>
      </section>

      {!activeToday && (
        <section className="home-nudge" aria-live="polite">
          <p className="home-nudge-kicker">Danes še ni vadbe</p>
          <p className="home-nudge-text">
            {stats.currentStreak > 0
              ? `Niz ${stats.currentStreak} ${stats.currentStreak === 1 ? 'dan' : 'dni'} – ohrani ga z izzivom ali stezo.`
              : 'Začni danes – 15–30 minut zadošča.'}
          </p>
          <div className="home-nudge-actions">
            {currentDay && !currentCompleted && (
              <Link to={`/day/${currentDay.id}`} className="home-nudge-link">
                Izziv
              </Link>
            )}
            <Link to="/treadmill" className="home-nudge-link secondary">
              Steza
            </Link>
          </div>
        </section>
      )}

      {currentDay && (
        <section className="home-today">
          <div className="home-today-top">
            <p className="home-today-label">Zdaj</p>
            <span className="home-today-day">Dan {currentDay.day}/10</span>
          </div>
          <h2 className="home-today-title">{currentDay.title}</h2>
          <p className="home-today-summary">{currentDay.summary}</p>
          <div className="home-today-meta">
            <span>{categoryLabel(currentDay.focus)}</span>
            <span>~{currentDay.estimatedMinutes} min</span>
          </div>
          {currentCompleted ? (
            <span className="badge badge-done"><IconCheck /> Danes opravljeno</span>
          ) : (
            <Link to={`/day/${currentDay.id}`} className="home-cta">
              <span className="home-cta-shine" aria-hidden="true" />
              <span className="home-cta-icon"><IconPlay /></span>
              Začni vadbo
            </Link>
          )}
        </section>
      )}

      <WeeklySummaryCard summary={week} />

      <section className="home-days">
        <div className="home-days-head">
          <h2>Program</h2>
          <span>{daysDone}/{totalDays}</span>
        </div>
        <ul className="day-list">
          {program.days.map((day, i) => {
            const done = isDayCompleted(state, day.id);
            return (
              <li key={day.id} style={{ animationDelay: `${0.2 + i * 0.04}s` }}>
                <Link to={`/day/${day.id}`} className={`day-item ${done ? 'day-done' : ''}`}>
                  <div className="day-number">{done ? <IconCheck /> : day.day}</div>
                  <div className="day-item-info">
                    <span className="day-item-label">{categoryLabel(day.focus)}</span>
                    <span className="day-item-title">{day.title}</span>
                    <span className="day-item-meta">{day.estimatedMinutes} min · {day.exercises.length} korakov</span>
                  </div>
                  {done
                    ? <span className="badge badge-done"><IconCheck /></span>
                    : <span className="day-item-arrow"><IconChevronRight /></span>
                  }
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
