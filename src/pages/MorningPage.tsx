import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AppState, WorkoutDifficulty } from '../types';
import { morningRoutines, type MorningRoutine } from '../data/morningRoutines';
import {
  getMorningCompletionCount,
  wasMorningDoneToday,
} from '../services/progress';
import { scaleMorningRoutine } from '../utils/difficulty';
import { youtubeEmbedUrl } from '../data/dayVideos';
import MorningSession from '../components/MorningSession';
import WorkoutPreview from '../components/WorkoutPreview';
import './MorningPage.css';

interface Props {
  state: AppState;
  onCompleteRoutine: (routineId: string) => void;
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
    <svg viewBox="0 0 24 24">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function StoryCard({
  routine,
  today,
  count,
  demoOpen,
  onToggleDemo,
  onStart,
}: {
  routine: MorningRoutine;
  today: boolean;
  count: number;
  demoOpen: boolean;
  onToggleDemo: () => void;
  onStart: () => void;
}) {
  const thumb = `https://i.ytimg.com/vi/${routine.video.videoId}/hqdefault.jpg`;

  return (
    <article className={`morning-story ${today ? 'done' : ''}`}>
      <div className="morning-story-meta">
        <span>{routine.when}</span>
        <span>~{routine.estimatedMinutes} min</span>
      </div>
      <h2>{routine.title}</h2>
      <p className="morning-story-sub">{routine.subtitle}</p>
      <p className="morning-story-summary">{routine.summary}</p>

      <ol className="morning-story-moves">
        {routine.moves.map((m) => (
          <li key={m.id}>
            <span>{m.reps}×</span> {m.name}
          </li>
        ))}
      </ol>

      <div className="morning-story-actions">
        <button type="button" className="morning-story-start" onClick={onStart}>
          <IconPlay />
          {today ? 'Ponovi' : 'Začni'}
        </button>
        <button type="button" className="morning-story-demo" onClick={onToggleDemo}>
          {demoOpen ? 'Skrij demo' : 'Poglej demo'}
        </button>
      </div>

      {count > 0 && (
        <p className="morning-story-count">
          {today ? 'Danes opravljeno' : 'Opravljeno'} · {count}×
        </p>
      )}

      {demoOpen && (
        <div className="morning-demo">
          <div className="morning-demo-frame">
            <iframe
              src={`${youtubeEmbedUrl(routine.video.videoId)}`}
              title={routine.video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          {routine.video.note && <p className="morning-demo-note">{routine.video.note}</p>}
          <a
            className="morning-demo-link"
            href={`https://www.youtube.com/shorts/${routine.video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Odpri Short na YouTube
          </a>
          <img src={thumb} alt="" className="sr-only" />
        </div>
      )}
    </article>
  );
}

export default function MorningPage({
  state,
  onCompleteRoutine,
  onDifficultyChange,
}: Props) {
  const [preview, setPreview] = useState<MorningRoutine | null>(null);
  const [active, setActive] = useState<MorningRoutine | null>(null);
  const [demoId, setDemoId] = useState<string | null>(null);
  const anyToday = wasMorningDoneToday(state);

  const scaledPreview = useMemo(() => {
    if (!preview) return null;
    return scaleMorningRoutine(preview, state.difficulty);
  }, [preview, state.difficulty]);

  const startFromPreview = () => {
    if (!preview) return;
    setActive(scaleMorningRoutine(preview, state.difficulty));
    setPreview(null);
  };

  return (
    <>
      {preview && scaledPreview && (
        <WorkoutPreview
          kicker="Jutranji blok"
          title={preview.title}
          summary={preview.summary}
          meta={[
            { label: 'Čas', value: `~${scaledPreview.estimatedMinutes} min` },
            { label: 'Kdaj', value: preview.when },
            { label: 'Oprema', value: 'Brez' },
            { label: 'Gibi', value: String(scaledPreview.moves.length) },
          ]}
          steps={scaledPreview.moves.map((m) => ({
            name: m.name,
            detail: `${m.reps}×`,
          }))}
          stepsTitle="Gibi"
          difficulty={state.difficulty}
          onDifficultyChange={onDifficultyChange}
          ctaLabel={wasMorningDoneToday(state, preview.id) ? 'Ponovi' : 'Začni'}
          onStart={startFromPreview}
          onClose={() => setPreview(null)}
        />
      )}

      {active && (
        <MorningSession
          routine={active}
          feedback={state.feedback}
          onClose={() => setActive(null)}
          onComplete={onCompleteRoutine}
        />
      )}

      <div className="morning-page">
        <Link to="/" className="morning-back-link">
          <IconBack />
          Domov
        </Link>

        <header className="morning-hero">
          <p className="morning-hero-kicker">Posebna zgodba</p>
          <h1 className="morning-hero-title">Jutranji blok</h1>
          <p className="morning-hero-lede">
            Predogled, nato težavnost (30× / 60×). Tapni ponovitve. Nato hoja.
          </p>
          {anyToday && <span className="morning-today-badge">Danes že kaj opravljeno ✓</span>}
        </header>

        <div className="morning-stories">
          {morningRoutines.map((routine) => (
            <StoryCard
              key={routine.id}
              routine={routine}
              today={wasMorningDoneToday(state, routine.id)}
              count={getMorningCompletionCount(state, routine.id)}
              demoOpen={demoId === routine.id}
              onToggleDemo={() =>
                setDemoId((id) => (id === routine.id ? null : routine.id))
              }
              onStart={() => setPreview(routine)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
