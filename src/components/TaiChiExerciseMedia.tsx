import { useEffect, useMemo, useState } from 'react';
import type { Exercise } from '../types';
import { assetPath } from '../utils/paths';
import './TaiChiExerciseMedia.css';

interface Props {
  exercise: Exercise;
  /** compact = seznam na dan (manjša slika); default = vadbena seja */
  density?: 'default' | 'compact';
}

type Layer = 'loop' | 'phase' | 'thumb' | 'fallback';

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Placeholder() {
  return (
    <div className="tc-media-placeholder">
      <span className="tc-media-placeholder-mark" aria-hidden>
        ◯
      </span>
      <p>
        Vizualni prikaz
        <br />
        bo dodan.
      </p>
    </div>
  );
}

export default function TaiChiExerciseMedia({ exercise, density = 'default' }: Props) {
  const phases = exercise.phases ?? [];
  const hasPhases = phases.length > 0;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [broken, setBroken] = useState<Record<string, true>>({});

  useEffect(() => {
    setPhaseIndex(0);
    setBroken({});
  }, [exercise.id]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const markBroken = (key: string) => {
    setBroken((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  const loopSrc = exercise.media?.loop ? assetPath(exercise.media.loop) : null;
  const thumbSrc = exercise.media?.thumbnail
    ? assetPath(exercise.media.thumbnail)
    : null;

  const phase = hasPhases ? phases[Math.min(phaseIndex, phases.length - 1)] : null;
  const phaseImg = phase?.image ? assetPath(phase.image) : null;
  const phaseImgOk = !!(phaseImg && !broken[phaseImg]);

  /** loop → trenutna faza → thumbnail → placeholder */
  const layer: Layer = useMemo(() => {
    if (loopSrc && !broken[loopSrc] && !reduced) return 'loop';
    if (phaseImgOk) return 'phase';
    if (thumbSrc && !broken[thumbSrc]) return 'thumb';
    return 'fallback';
  }, [loopSrc, phaseImgOk, thumbSrc, broken, reduced]);

  const showPortraitFrame = hasPhases || layer !== 'fallback';
  const atStart = phaseIndex <= 0;
  const atEnd = phaseIndex >= phases.length - 1;

  return (
    <div
      className={[
        'tc-media',
        showPortraitFrame ? 'has-visual' : 'is-placeholder',
        density === 'compact' ? 'tc-media--compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={`tc-media-frame ${showPortraitFrame ? '' : 'tc-media-frame--compact'}`}
        aria-live="polite"
      >
        {layer === 'loop' && loopSrc && (
          <video
            className="tc-media-el"
            src={loopSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={thumbSrc && !broken[thumbSrc] ? thumbSrc : undefined}
            onError={() => markBroken(loopSrc)}
          />
        )}

        {layer === 'phase' && phaseImg && (
          <img
            key={phaseImg}
            className="tc-media-el"
            src={phaseImg}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => markBroken(phaseImg)}
          />
        )}

        {layer === 'thumb' && thumbSrc && (
          <img
            className="tc-media-el"
            src={thumbSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => markBroken(thumbSrc)}
          />
        )}

        {layer === 'fallback' && <Placeholder />}
      </div>

      {hasPhases && phase && (
        <div className="tc-phases">
          <div className="tc-phases-count">
            {phaseIndex + 1} / {phases.length}
          </div>
          <h4 className="tc-phases-title">{phase.title}</h4>
          <p className="tc-phases-text">{phase.instruction}</p>

          <div className="tc-phases-dots" role="tablist" aria-label="Faze giba">
            {phases.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === phaseIndex}
                className={`tc-dot ${i === phaseIndex ? 'active' : ''}`}
                onClick={() => setPhaseIndex(i)}
                aria-label={`Faza ${i + 1}: ${p.title}`}
              />
            ))}
          </div>

          <div className="tc-phases-nav">
            <button
              type="button"
              className="tc-nav-btn"
              onClick={() => setPhaseIndex((i) => Math.max(0, i - 1))}
              disabled={atStart}
              aria-label="Prejšnja faza"
            >
              ←
            </button>
            <button
              type="button"
              className="tc-nav-btn"
              onClick={() => setPhaseIndex((i) => Math.min(phases.length - 1, i + 1))}
              disabled={atEnd}
              aria-label="Naslednja faza"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
