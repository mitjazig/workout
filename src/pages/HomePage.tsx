import { useNavigate, Link } from 'react-router-dom';
import type { AppState } from '../types';
import { allPrograms } from '../data/programs';
import {
  getProgramProgress,
  getProgressStats,
  getWeeklySummary,
  hasActivityToday,
  wasMorningDoneToday,
} from '../services/progress';
import ProgramCard from '../components/ProgramCard';
import PwaInstallButton from '../components/PwaInstallButton';
import WeeklySummaryCard from '../components/WeeklySummary';
import './HomePage.css';

interface HomePageProps {
  state: AppState;
  onSelectProgram: (programId: string) => void | Promise<void>;
}

export default function HomePage({ state, onSelectProgram }: HomePageProps) {
  const navigate = useNavigate();
  const stats = getProgressStats(state);
  const week = getWeeklySummary(state);
  const activeToday = hasActivityToday(state);
  const morningToday = wasMorningDoneToday(state);

  const openProgram = async (programId: string) => {
    await onSelectProgram(programId);
    navigate('/program');
  };

  return (
    <div className="home-page home-hub">
      <section className="home-hero hub-hero" aria-label="Workout">
        <div className="home-hero-aurora" aria-hidden="true">
          <span className="home-orb home-orb-a" />
          <span className="home-orb home-orb-b" />
          <span className="home-orb home-orb-c" />
        </div>
        <p className="home-kicker">Vadbene poti</p>
        <h1 className="home-brand">Workout</h1>
        <p className="home-lede">Izberi program. Napredek ostane ločen.</p>
      </section>

      <section className="hub-programs" aria-label="Moji programi">
        <div className="hub-programs-head">
          <h2>Moji programi</h2>
          <span>{allPrograms.length}</span>
        </div>
        <div className="hub-program-list">
          {allPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              progress={getProgramProgress(state, program.id)}
              onClick={() => void openProgram(program.id)}
            />
          ))}
        </div>
      </section>

      <PwaInstallButton variant="banner" />

      <section className="home-story">
        <div className="home-story-top">
          <p className="home-story-kicker">Posebna zgodba</p>
          {morningToday && <span className="home-story-done">Danes ✓</span>}
        </div>
        <h2 className="home-story-title">Jutranji blok</h2>
        <p className="home-story-text">
          Zbudi telo (5 min) ali Za srce (2 min) – nato hoja. Ločeno od programov.
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
              ? `Niz ${stats.currentStreak} ${stats.currentStreak === 1 ? 'dan' : 'dni'} – ohrani ga s programom ali stezo.`
              : 'Začni danes – 15–30 minut zadošča.'}
          </p>
          <div className="home-nudge-actions">
            <Link to="/treadmill" className="home-nudge-link secondary">
              Steza
            </Link>
          </div>
        </section>
      )}

      <WeeklySummaryCard summary={week} />
    </div>
  );
}
