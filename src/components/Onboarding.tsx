import { useState } from 'react';
import type { CardioMode } from '../types';
import CardioModeToggle from './CardioModeToggle';
import './Onboarding.css';

interface Props {
  initialMode: CardioMode;
  onComplete: (mode: CardioMode) => void;
}

const STEPS = [
  {
    kicker: 'Dobrodošel',
    title: 'Izziv 10',
    body: '10 dni domače vadbe – ogrevanje, moč, kardio in mobilnost. 15–30 minut na dan.',
  },
  {
    kicker: 'Kardio',
    title: 'Steza ali zunaj',
    body: 'Hojo in intervale lahko vodiš na Kettler Alpha Run (km/h + naklon) ali kot klasiko zunaj.',
  },
  {
    kicker: 'Alpha Run',
    title: 'Telefon na držalo',
    body: 'App pove hitrost, naklon in čas. Ti nastaviš na konzoli. Po vadbi vpiši km – ali uporabi Hitri vnos.',
  },
] as const;

export default function Onboarding({ initialMode, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<CardioMode>(initialMode);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="onboarding" role="dialog" aria-modal="true" aria-label="Uvod">
      <div className="onboarding-card">
        <p className="onboarding-kicker">{current.kicker}</p>
        <h1 className="onboarding-title">{current.title}</h1>
        <p className="onboarding-body">{current.body}</p>

        {step === 1 && (
          <div className="onboarding-toggle">
            <CardioModeToggle value={mode} onChange={setMode} />
          </div>
        )}

        <div className="onboarding-dots" aria-hidden>
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? 'active' : ''} />
          ))}
        </div>

        <div className="onboarding-actions">
          {step > 0 && (
            <button type="button" className="onboarding-back" onClick={() => setStep((s) => s - 1)}>
              Nazaj
            </button>
          )}
          <button
            type="button"
            className="onboarding-next"
            onClick={() => {
              if (isLast) onComplete(mode);
              else setStep((s) => s + 1);
            }}
          >
            {isLast ? 'Začni' : 'Naprej'}
          </button>
        </div>
      </div>
    </div>
  );
}
