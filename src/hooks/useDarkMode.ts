import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

const KEY = 'izziv-10:theme';
const LEGACY_DARK = 'izziv-10:dark-mode';
const LEGACY_TAI = 'tai-chi:dark-mode';

/** Temno od 18:00 do 6:00 (večerna vadba). */
export function isEveningNow(date = new Date()): boolean {
  const h = date.getHours();
  return h >= 18 || h < 6;
}

export function resolveDark(mode: ThemeMode, date = new Date()): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return isEveningNow(date);
}

function readMode(): ThemeMode {
  const stored = localStorage.getItem(KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark' || stored === 'auto') return stored;

  const legacy = localStorage.getItem(LEGACY_DARK) ?? localStorage.getItem(LEGACY_TAI);
  if (legacy === 'true') return 'dark';
  if (legacy === 'false') return 'light';
  return 'auto';
}

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(readMode);
  const [dark, setDark] = useState(() => resolveDark(readMode()));

  useEffect(() => {
    const apply = () => {
      const next = resolveDark(mode);
      setDark(next);
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme-mode', mode);
    };
    apply();
    localStorage.setItem(KEY, mode);

    if (mode !== 'auto') return;

    const id = window.setInterval(apply, 60_000);
    return () => window.clearInterval(id);
  }, [mode]);

  const toggle = () => {
    setMode((m) => (m === 'light' ? 'dark' : m === 'dark' ? 'auto' : 'light'));
  };

  const label =
    mode === 'auto' ? (dark ? 'Avto · noč' : 'Avto · dan') : mode === 'dark' ? 'Temno' : 'Svetlo';

  return { dark, mode, toggle, label, setMode };
}
