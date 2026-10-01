import type { CardioMode } from '../types';
import './CardioModeToggle.css';

interface Props {
  value: CardioMode;
  onChange: (mode: CardioMode) => void;
  compact?: boolean;
}

export default function CardioModeToggle({ value, onChange, compact }: Props) {
  return (
    <div className={`cardio-toggle ${compact ? 'compact' : ''}`} role="group" aria-label="Način hoje">
      {!compact && <p className="cardio-toggle-label">Hojo / kardio izvedem</p>}
      <div className="cardio-toggle-btns">
        <button
          type="button"
          className={value === 'treadmill' ? 'active' : ''}
          onClick={() => onChange('treadmill')}
          aria-pressed={value === 'treadmill'}
        >
          Steza
        </button>
        <button
          type="button"
          className={value === 'outdoor' ? 'active' : ''}
          onClick={() => onChange('outdoor')}
          aria-pressed={value === 'outdoor'}
        >
          Zunaj
        </button>
      </div>
    </div>
  );
}
