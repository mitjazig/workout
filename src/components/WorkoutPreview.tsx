import type { ReactNode } from 'react';
import type { WorkoutDifficulty } from '../types';
import { DIFFICULTY_LABELS } from '../utils/difficulty';
import './WorkoutPreview.css';

export interface PreviewMeta {
  label: string;
  value: string;
}

export interface PreviewStep {
  name: string;
  detail?: string;
}

interface Props {
  kicker: string;
  title: string;
  summary: string;
  meta: PreviewMeta[];
  steps: PreviewStep[];
  stepsTitle?: string;
  difficulty?: WorkoutDifficulty;
  onDifficultyChange?: (d: WorkoutDifficulty) => void;
  ctaLabel?: string;
  onStart: () => void;
  onClose: () => void;
  footer?: ReactNode;
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

export default function WorkoutPreview({
  kicker,
  title,
  summary,
  meta,
  steps,
  stepsTitle = 'Koraki',
  difficulty,
  onDifficultyChange,
  ctaLabel = 'Začni',
  onStart,
  onClose,
  footer,
}: Props) {
  return (
    <div className="wp-overlay" role="dialog" aria-modal="true" aria-labelledby="wp-title">
      <div className="wp-sheet">
        <header className="wp-head">
          <button type="button" className="wp-close" onClick={onClose} aria-label="Zapri">
            <IconClose />
          </button>
          <p className="wp-kicker">{kicker}</p>
          <h2 id="wp-title" className="wp-title">
            {title}
          </h2>
          <p className="wp-summary">{summary}</p>

          <div className="wp-meta">
            {meta.map((m) => (
              <div key={m.label} className="wp-meta-item">
                <span className="wp-meta-label">{m.label}</span>
                <strong className="wp-meta-value">{m.value}</strong>
              </div>
            ))}
          </div>
        </header>

        {difficulty && onDifficultyChange && (
          <div className="wp-diff" role="group" aria-label="Težavnost">
            {(['easy', 'standard'] as WorkoutDifficulty[]).map((d) => (
              <button
                key={d}
                type="button"
                className={`wp-diff-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => onDifficultyChange(d)}
              >
                {DIFFICULTY_LABELS[d]}
                {d === 'easy' && <small>Manj ponovitev / krajše</small>}
                {d === 'standard' && <small>Polni tempo</small>}
              </button>
            ))}
          </div>
        )}

        <div className="wp-steps">
          <h3 className="wp-steps-title">
            {stepsTitle}
            <span>{steps.length}</span>
          </h3>
          <ol className="wp-steps-list">
            {steps.map((step, i) => (
              <li key={`${step.name}-${i}`}>
                <span className="wp-step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="wp-step-body">
                  <strong>{step.name}</strong>
                  {step.detail && <small>{step.detail}</small>}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {footer}

        <div className="wp-actions">
          <button type="button" className="wp-cta" onClick={onStart}>
            <IconPlay />
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
