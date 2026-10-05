import { useNavigate, Link } from 'react-router-dom';
import type { AppState } from '../types';
import { allPrograms } from '../data/programs';
import {
  getProgramProgress,
  getProgressStats,
  getWeeklySummary,
  hasActivityToday,
  wasMorningDoneToday,
  wasBonusDoneToday,
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
  const bonusToday = wasBonusDoneToday(state);

  const openProgram = async (programId: string) => {
    await onSelectProgram(programId);
    navigate('/program');
  };

  return (
    <div className="home-page home-hub">
      <section className="hub-programs" aria-label="Moji programi">
        <div className="hub-programs-head">
          <h2>Programi</h2>
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

      <Link to="/morning" className="home-link-row">
        <span className="home-link-copy">
          <strong>Jutranji blok</strong>
          <small>5 min ali 2 min · nato hoja</small>
        </span>
        {morningToday ? (
          <span className="home-link-done">Danes ✓</span>
        ) : (
          <span className="home-link-chevron" aria-hidden>
            →
          </span>
        )}
      </Link>

      <Link to="/bonus" className="home-link-row home-link-row--tight">
        <span className="home-link-copy">
          <strong>Bonus vaje</strong>
          <small>Sedeči core · stol · ~8 min</small>
        </span>
        {bonusToday ? (
          <span className="home-link-done">Danes ✓</span>
        ) : (
          <span className="home-link-chevron" aria-hidden>
            →
          </span>
        )}
      </Link>

      {!activeToday && (
        <p className="home-nudge-line" aria-live="polite">
          Danes še ni vadbe
          {stats.currentStreak > 0
            ? ` · niz ${stats.currentStreak}`
            : ''}
          {' · '}
          <Link to="/treadmill">Steza</Link>
        </p>
      )}

      <PwaInstallButton variant="row" />

      <WeeklySummaryCard summary={week} compact />
    </div>
  );
}
