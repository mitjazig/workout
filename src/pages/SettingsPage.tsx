import { useState } from 'react';
import type { AppState, CardioMode, FeedbackSettings } from '../types';
import { getProgram } from '../data/programs';
import { requestNotificationPermission } from '../services/reminders';
import { unlockAudio } from '../utils/feedback';
import CardioModeToggle from '../components/CardioModeToggle';
import './SettingsPage.css';

const DAY_LABELS = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];

interface SettingsPageProps {
  state: AppState;
  onUpdateReminders: (settings: Partial<AppState['reminders']>) => void;
  onReset: (programId?: string) => void;
  onResetTreadmill: () => void;
  onCardioModeChange: (mode: CardioMode) => void;
  onFeedbackChange: (patch: Partial<FeedbackSettings>) => void;
}

export default function SettingsPage({
  state,
  onUpdateReminders,
  onReset,
  onResetTreadmill,
  onCardioModeChange,
  onFeedbackChange,
}: SettingsPageProps) {
  const { reminders, feedback } = state;
  const program = getProgram(state.activeProgramId);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmTmReset, setConfirmTmReset] = useState(false);

  const toggleDay = (day: number) => {
    const days = reminders.daysOfWeek.includes(day)
      ? reminders.daysOfWeek.filter((d) => d !== day)
      : [...reminders.daysOfWeek, day];
    onUpdateReminders({ daysOfWeek: days });
  };

  const handleEnableReminders = async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    onUpdateReminders({ enabled });
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    onReset(state.activeProgramId);
    setConfirmReset(false);
  };

  const handleTmReset = () => {
    if (!confirmTmReset) {
      setConfirmTmReset(true);
      return;
    }
    onResetTreadmill();
    setConfirmTmReset(false);
  };

  return (
    <div className="settings-page">
      <h2>Nastavitve</h2>

      <section className="settings-section">
        <p className="settings-section-title">Opomniki</p>
        <div className="settings-row">
          <div className="settings-row-label">
            <span>Dnevni opomniki</span>
            <span className="settings-row-sub">
              Obvestilo, če danes še ni vadbe (z nizi)
            </span>
          </div>
          <input
            type="checkbox"
            checked={reminders.enabled}
            onChange={(e) => handleEnableReminders(e.target.checked)}
            className="toggle-input"
            aria-label="Vklopi opomniki"
          />
        </div>

        {reminders.enabled && (
          <>
            <label className="setting-label">
              Čas opomnika
              <input
                type="time"
                value={reminders.time}
                onChange={(e) => onUpdateReminders({ time: e.target.value })}
                className="time-input"
              />
            </label>

            <fieldset className="days-fieldset">
              <legend>Dnevi v tednu</legend>
              <div className="days-grid">
                {DAY_LABELS.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`day-btn ${reminders.daysOfWeek.includes(i) ? 'active' : ''}`}
                    onClick={() => toggleDay(i)}
                    aria-pressed={reminders.daysOfWeek.includes(i)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}
      </section>

      <section className="settings-section">
        <p className="settings-section-title">Med vadbo</p>
        <div className="settings-row">
          <div className="settings-row-label">
            <span>Zvok ob segmentu</span>
            <span className="settings-row-sub">Pisk, ko se segment na stezi konča</span>
          </div>
          <input
            type="checkbox"
            checked={feedback.sound}
            onChange={(e) => {
              void unlockAudio();
              onFeedbackChange({ sound: e.target.checked });
            }}
            className="toggle-input"
            aria-label="Zvok"
          />
        </div>
        <div className="settings-row">
          <div className="settings-row-label">
            <span>Vibracija</span>
            <span className="settings-row-sub">Haptika ob koncu segmenta</span>
          </div>
          <input
            type="checkbox"
            checked={feedback.haptics}
            onChange={(e) => onFeedbackChange({ haptics: e.target.checked })}
            className="toggle-input"
            aria-label="Vibracija"
          />
        </div>
      </section>

      <section className="settings-section">
        <p className="settings-section-title">Tekalna steza</p>
        <div className="settings-cardio">
          <CardioModeToggle
            value={state.cardioMode}
            onChange={onCardioModeChange}
          />
        </div>
        <p className="settings-hint">
          V izzivu se hoja in intervali pokažejo z km/h in naklonom (Alpha Run), ali kot hoja zunaj.
        </p>
      </section>

      <section className="settings-section">
        <p className="settings-section-title">Napredek</p>
        <p className="settings-current-program">
          Aktivni izziv: <strong>{program.name}</strong>
        </p>
        <button type="button" className="reset-btn" onClick={handleReset}>
          {confirmReset ? 'Potrdi ponastavitev izziva' : 'Ponastavi napredek izziva'}
        </button>
        {confirmReset && (
          <button type="button" className="btn-ghost" onClick={() => setConfirmReset(false)}>
            Prekliči
          </button>
        )}
        <button type="button" className="reset-btn" onClick={handleTmReset}>
          {confirmTmReset ? 'Potrdi ponastavitev steze' : 'Ponastavi napredek steze'}
        </button>
        {confirmTmReset && (
          <button type="button" className="btn-ghost" onClick={() => setConfirmTmReset(false)}>
            Prekliči
          </button>
        )}
        <p className="settings-hint">Napredek je shranjen lokalno na tej napravi.</p>
      </section>

      <section className="settings-section">
        <p className="settings-section-title">O aplikaciji</p>
        <div className="about-section">
          <p><strong>Izziv 10 – Vadbe</strong> · v2.2</p>
          <p>10-dnevni vadbeni izziv: ogrevanje, moč, kardio in mobilnost. PWA – deluje offline.</p>
          <span className="offline-badge">✓ Deluje brez internetne povezave</span>
        </div>
      </section>
    </div>
  );
}
