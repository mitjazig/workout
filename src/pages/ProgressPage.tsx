import { useState } from 'react';
import type { ActivityLogItem, AppState, HeatmapDay } from '../types';
import { getProgram } from '../data/programs';
import { categoryLabel } from '../data/categories';
import { treadmillWorkouts } from '../data/treadmillWorkouts';
import {
  getActiveProgress,
  getActivityHeatmap,
  getActivityLog,
  getBadgeStatuses,
  getDayExerciseProgress,
  getProgressStats,
  getTreadmillCompletionCount,
  getWeeklySummary,
  isDayCompleted,
} from '../services/progress';
import { downloadWeeklyCsv, downloadWeeklyImage } from '../utils/weekExport';
import { Link } from 'react-router-dom';
import WeeklySummaryCard from '../components/WeeklySummary';
import './ProgressPage.css';

interface ProgressPageProps {
  state: AppState;
  onClearDay: (dayId: string) => void;
  onRemoveTreadmill: (completionId: string) => void;
  onUpdateTreadmillKm: (completionId: string, distanceKm?: number) => void;
  onRemoveMorning: (completionId: string) => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('sl-SI', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatKm(km: number) {
  return km.toFixed(1).replace('.', ',');
}

function heatLevel(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

function Heatmap({ days }: { days: HeatmapDay[] }) {
  const weeks: HeatmapDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="heatmap" role="img" aria-label="Aktivnost zadnjih 12 tednov">
      <div className="heatmap-weekdays" aria-hidden>
        <span>P</span>
        <span>S</span>
        <span>Č</span>
      </div>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((day) => (
              <span
                key={day.dateKey}
                className={`heatmap-cell heat-${heatLevel(day.count)}`}
                title={`${day.label}: ${day.count === 0 ? 'brez vadbe' : `${day.count}×`}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend" aria-hidden>
        <span>Manj</span>
        <span className="heatmap-cell heat-0" />
        <span className="heatmap-cell heat-1" />
        <span className="heatmap-cell heat-2" />
        <span className="heatmap-cell heat-3" />
        <span>Več</span>
      </div>
    </div>
  );
}

export default function ProgressPage({
  state,
  onClearDay,
  onRemoveTreadmill,
  onUpdateTreadmillKm,
  onRemoveMorning,
}: ProgressPageProps) {
  const program = getProgram(state.activeProgramId);
  const progress = getActiveProgress(state);
  const total = program.days.length;
  const stats = getProgressStats(state);
  const week = getWeeklySummary(state);
  const heatmap = getActivityHeatmap(state, 12);
  const log = getActivityLog(state);
  const badges = getBadgeStatuses(state);
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editKm, setEditKm] = useState('');

  const handleDelete = (item: ActivityLogItem) => {
    if (confirmId !== item.id) {
      setConfirmId(item.id);
      return;
    }
    if (item.kind === 'challenge' && item.dayId) {
      onClearDay(item.dayId);
    } else if (item.kind === 'treadmill' && item.completionId) {
      onRemoveTreadmill(item.completionId);
    } else if (item.kind === 'morning' && item.completionId) {
      onRemoveMorning(item.completionId);
    }
    setConfirmId(null);
  };

  const startEdit = (item: ActivityLogItem) => {
    if (!item.completionId) return;
    setEditId(item.id);
    setEditKm(
      typeof item.distanceKm === 'number'
        ? item.distanceKm.toFixed(1).replace('.', ',')
        : '',
    );
  };

  const saveEdit = (item: ActivityLogItem) => {
    if (!item.completionId) return;
    const normalized = editKm.trim().replace(',', '.');
    const value = normalized === '' ? undefined : Number(normalized);
    if (normalized !== '' && (!Number.isFinite(value) || (value ?? 0) <= 0)) return;
    onUpdateTreadmillKm(item.completionId, value);
    setEditId(null);
  };

  return (
    <div className="progress-page">
      <h2>Vaš napredek</h2>
      <p className="progress-program-name">{program.name}</p>

      <section className="stats-summary" aria-label="Povzetek">
        <div className="stats-summary-main">
          <span className="stats-summary-pct">{stats.challengePercent}%</span>
          <span className="stats-summary-label">Izziv opravljeno</span>
        </div>
        <div className="stats-summary-row">
          <div className="stats-summary-item">
            <strong>{stats.challengeDaysDone}</strong>
            <span>Dni</span>
          </div>
          <div className="stats-summary-item">
            <strong>{stats.treadmillSessions}</strong>
            <span>Steza</span>
          </div>
          <div className="stats-summary-item">
            <strong>{formatKm(stats.treadmillKm)}</strong>
            <span>Km</span>
          </div>
        </div>
        <p className="stats-summary-date">
          Začetek: {new Date(progress.startedAt).toLocaleDateString('sl-SI')}
          {stats.treadmillMinutes > 0 ? ` · ${stats.treadmillMinutes} min steza` : ''}
        </p>
      </section>

      <WeeklySummaryCard
        summary={week}
        onExportCsv={() => downloadWeeklyCsv(state)}
        onExportImage={() => downloadWeeklyImage(week)}
      />

      <section className="week-section badges-section">
        <div className="week-section-head">
          <h3>Bedži</h3>
          <span className="week-count">
            {unlockedBadges}/{badges.length}
          </span>
        </div>
        <ul className="badges-grid">
          {badges.map((badge) => (
            <li
              key={badge.id}
              className={`badge-tile ${badge.unlocked ? 'unlocked' : 'locked'}`}
              title={badge.description}
            >
              <span className="badge-mark">{badge.mark}</span>
              <strong className="badge-title">{badge.title}</strong>
              <span className="badge-progress">
                {badge.unlocked ? 'Odklenjeno' : badge.progressLabel ?? 'Zaklenjeno'}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="week-section stats-detail-section">
        <div className="week-section-head">
          <h3>Statistika</h3>
          <span className="week-count">{stats.activeDaysLast30} aktivnih / 30 dni</span>
        </div>
        <div className="stats-detail-grid">
          <div className="stats-detail-item">
            <strong>{stats.currentStreak}</strong>
            <span>Trenutni niz</span>
          </div>
          <div className="stats-detail-item">
            <strong>{stats.bestStreak}</strong>
            <span>Najboljši niz</span>
          </div>
          <div className="stats-detail-item">
            <strong>{stats.totalActivities}</strong>
            <span>Skupaj sej</span>
          </div>
          <div className="stats-detail-item">
            <strong>{stats.treadmillMinutes}</strong>
            <span>Min na stezi</span>
          </div>
        </div>
      </section>

      <section className="week-section heatmap-section">
        <div className="week-section-head">
          <h3>Aktivnost</h3>
          <span className="week-count">12 tednov</span>
        </div>
        <Heatmap days={heatmap} />
      </section>

      <section className="week-section activity-log-section">
        <div className="week-section-head">
          <h3>Dnevnik</h3>
          <span className="week-count">
            {log.reduce((n, g) => n + g.items.length, 0)} vnosov
          </span>
        </div>

        {log.length === 0 ? (
          <p className="activity-empty">Še ni opravljenih treningov.</p>
        ) : (
          <div className="activity-log">
            {log.map((group) => (
              <div key={group.dateKey} className="activity-day">
                <h4 className="activity-day-label">{group.label}</h4>
                <ul className="activity-list">
                  {group.items.map((item) => (
                    <li key={item.id} className="activity-item">
                      <div className="activity-item-main">
                        <span className={`activity-kind activity-kind-${item.kind}`}>
                          {item.kind === 'challenge'
                            ? 'Izziv'
                            : item.kind === 'morning'
                              ? 'Jutro'
                              : 'Steza'}
                        </span>
                        <strong className="activity-title">{item.title}</strong>
                        <span className="activity-meta">
                          {formatTime(item.completedAt)} · {item.subtitle}
                        </span>
                        {editId === item.id && item.kind === 'treadmill' && (
                          <div className="activity-edit-km">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editKm}
                              onChange={(e) => setEditKm(e.target.value)}
                              placeholder="km"
                              aria-label="Kilometri"
                            />
                            <button type="button" onClick={() => saveEdit(item)}>
                              Shrani
                            </button>
                            <button type="button" className="ghost" onClick={() => setEditId(null)}>
                              Prekliči
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="activity-actions">
                        {item.kind === 'treadmill' && editId !== item.id && (
                          <button
                            type="button"
                            className="activity-edit"
                            onClick={() => startEdit(item)}
                          >
                            Km
                          </button>
                        )}
                        <button
                          type="button"
                          className={`activity-delete ${confirmId === item.id ? 'confirm' : ''}`}
                          onClick={() => handleDelete(item)}
                          onBlur={() => {
                            if (confirmId === item.id) setConfirmId(null);
                          }}
                        >
                          {confirmId === item.id ? 'Potrdi' : 'Izbriši'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="week-section">
        <div className="week-section-head">
          <h3>10 dni</h3>
          <span className="week-count">
            {stats.challengeDaysDone}/{total}
          </span>
        </div>
        <ul className="progress-day-list">
          {program.days.map((day) => {
            const done = isDayCompleted(state, day.id);
            const partial = getDayExerciseProgress(state, day.id).length;
            return (
              <li key={day.id}>
                <Link to={`/day/${day.id}`} className={`progress-day ${done ? 'done' : ''}`}>
                  <span className="progress-day-num">{day.day}</span>
                  <span className="progress-day-info">
                    <strong>{day.title}</strong>
                    <small>
                      {categoryLabel(day.focus)}
                      {partial > 0 && !done ? ` · ${partial} korakov` : ''}
                    </small>
                  </span>
                  <span className="progress-day-status">{done ? '✓' : ''}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="week-section tm-progress-section">
        <div className="week-section-head">
          <h3>Tekalna steza</h3>
          <span className="week-count">
            {stats.treadmillSessions} sej · {formatKm(stats.treadmillKm)} km
          </span>
        </div>
        <ul className="progress-day-list">
          {treadmillWorkouts.map((workout) => {
            const count = getTreadmillCompletionCount(state, workout.id);
            return (
              <li key={workout.id}>
                <Link
                  to="/treadmill"
                  className={`progress-day ${count > 0 ? 'done' : ''}`}
                >
                  <span className="progress-day-num">{count > 0 ? '✓' : '·'}</span>
                  <span className="progress-day-info">
                    <strong>{workout.title}</strong>
                    <small>~{workout.estimatedMinutes} min</small>
                  </span>
                  <span className="progress-day-status">{count > 0 ? `${count}×` : ''}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
