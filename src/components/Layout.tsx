import { NavLink, useLocation } from 'react-router-dom';
import { useDarkMode } from '../hooks/useDarkMode';
import './Layout.css';

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 19.5h16" />
      <path d="M7 16V11" />
      <path d="M12 16V7" />
      <path d="M17 16v-4" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="3.25" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.55 1.55M17.55 15.95l1.55 1.55M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.55-1.55M17.55 8.05l1.55-1.55" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.6 1.6M18 18l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.4 19.6l1.6-1.6M18 6l1.6-1.6" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M20.5 13.2A8.2 8.2 0 1 1 10.8 3.5 6.6 6.6 0 0 0 20.5 13.2z" />
    </svg>
  );
}

function IconTreadmill() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 18h16" />
      <path d="M6 18 8 8h7l2 4h3" />
      <path d="M9 12h5" />
    </svg>
  );
}

function IconMorning() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.2M12 18.8V21M4.2 12H2M22 12h-2.2M5.6 5.6l1.5 1.5M16.9 16.9l1.5 1.5M5.6 18.4l1.5-1.5M16.9 7.1l1.5-1.5" />
    </svg>
  );
}

function IconAuto() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2" />
      <path d="M5.2 5.2 6.6 6.6M17.4 17.4l1.4 1.4M5.2 18.8 6.6 17.4M17.4 6.6l1.4-1.4" />
    </svg>
  );
}

const tabs = [
  { to: '/', label: 'Domov', end: true, icon: IconHome },
  { to: '/morning', label: 'Jutro', end: false, icon: IconMorning },
  { to: '/treadmill', label: 'Steza', end: false, icon: IconTreadmill },
  { to: '/progress', label: 'Napredek', end: false, icon: IconChart },
  { to: '/settings', label: 'Nastavitve', end: false, icon: IconSettings },
] as const;

export default function Layout({ children }: { children?: React.ReactNode }) {
  const { dark, mode, toggle, label } = useDarkMode();
  const location = useLocation();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-mark" aria-hidden="true">W</div>
        <div className="layout-header-text">
          <p className="layout-brand">Workout</p>
          <p className="layout-subtitle">Programi · doma</p>
        </div>
        <button
          type="button"
          className="dark-toggle"
          onClick={toggle}
          aria-label={`Tema: ${label}. Klikni za menjavo.`}
          title={label}
        >
          {mode === 'auto' ? <IconAuto /> : dark ? <IconSun /> : <IconMoon />}
        </button>
      </header>

      <main className="layout-main" key={location.pathname}>
        {children}
      </main>

      <nav className="layout-nav" aria-label="Glavna navigacija">
        <div className="layout-nav-inner">
          {tabs.map(({ to, label, end, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => {
                const onProgramFlow =
                  to === '/' &&
                  (location.pathname === '/program' || location.pathname.startsWith('/day/'));
                return isActive || onProgramFlow ? 'nav-link active' : 'nav-link';
              }}
            >
              <span className="nav-icon"><Icon /></span>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
