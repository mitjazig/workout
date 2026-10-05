import { useState } from 'react';
import { usePwaInstall } from '../hooks/usePwaInstall';
import './PwaInstallButton.css';

interface Props {
  /** banner = Domov; row = Nastavitve */
  variant?: 'banner' | 'row';
}

export default function PwaInstallButton({ variant = 'banner' }: Props) {
  const { canInstall, installed, iosHint, install } = usePwaInstall();
  const [busy, setBusy] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  if (installed) {
    if (variant === 'row') {
      return (
        <div className="pwa-install pwa-install--row pwa-install--done">
          <div className="pwa-install-copy">
            <strong>Aplikacija nameščena</strong>
            <span>Teče kot PWA na začetnem zaslonu.</span>
          </div>
          <span className="pwa-install-badge" aria-hidden>
            ✓
          </span>
        </div>
      );
    }
    return null;
  }

  if (!canInstall && !iosHint) return null;

  const handleClick = async () => {
    if (iosHint && !canInstall) {
      setShowIosHelp((v) => !v);
      return;
    }
    setBusy(true);
    try {
      await install();
    } finally {
      setBusy(false);
    }
  };

  if (variant === 'row') {
    return (
      <div className="pwa-install pwa-install--row">
        <div className="pwa-install-copy">
          <strong>Namesti aplikacijo</strong>
          <span>
            {iosHint && !canInstall
              ? 'Dodaj na začetni zaslon za hitrejši dostop.'
              : 'Namesti Workout na telefon – deluje tudi offline.'}
          </span>
        </div>
        <button
          type="button"
          className="pwa-install-btn"
          onClick={() => void handleClick()}
          disabled={busy}
        >
          {busy ? '…' : iosHint && !canInstall ? 'Kako?' : 'Namesti'}
        </button>
        {showIosHelp && (
          <p className="pwa-install-ios">
            Tapni <strong>Deli</strong> (kvadrat s puščico) → <strong>Dodaj na začetni zaslon</strong>.
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="pwa-install pwa-install--banner" aria-label="Namestitev aplikacije">
      <div className="pwa-install-copy">
        <p className="pwa-install-kicker">Hitrejši dostop</p>
        <h2 className="pwa-install-title">Namesti Workout</h2>
        <p className="pwa-install-text">
          {iosHint && !canInstall
            ? 'Dodaj aplikacijo na začetni zaslon – vadba je vedno pri roki.'
            : 'Namesti PWA na telefon. Deluje offline, kot prava aplikacija.'}
        </p>
      </div>
      <button
        type="button"
        className="pwa-install-btn pwa-install-btn--primary"
        onClick={() => void handleClick()}
        disabled={busy}
      >
        {busy ? 'Nameščam …' : iosHint && !canInstall ? 'Kako namestiti' : 'Namesti aplikacijo'}
      </button>
      {showIosHelp && (
        <p className="pwa-install-ios">
          Tapni <strong>Deli</strong> (kvadrat s puščico) spodaj v Safari →{' '}
          <strong>Dodaj na začetni zaslon</strong> → Dodaj.
        </p>
      )}
    </section>
  );
}
