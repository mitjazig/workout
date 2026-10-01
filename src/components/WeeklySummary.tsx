import type { WeeklySummary as WeeklySummaryData } from '../types';
import './WeeklySummary.css';

interface Props {
  summary: WeeklySummaryData;
  compact?: boolean;
  onExportCsv?: () => void;
  onExportImage?: () => void;
}

function formatKm(km: number) {
  return km.toFixed(1).replace('.', ',');
}

export default function WeeklySummaryCard({
  summary,
  compact,
  onExportCsv,
  onExportImage,
}: Props) {
  return (
    <section className={`week-summary ${compact ? 'compact' : ''}`}>
      <div className="week-summary-head">
        <h3>Ta teden</h3>
        <span>{summary.weekLabel}</span>
      </div>
      <div className="week-summary-grid">
        <div>
          <strong>{summary.activeDays}</strong>
          <span>Aktivni dnevi</span>
        </div>
        <div>
          <strong>{summary.activities}</strong>
          <span>Seje</span>
        </div>
        <div>
          <strong>{summary.treadmillMinutes}</strong>
          <span>Min steza</span>
        </div>
        <div>
          <strong>{formatKm(summary.treadmillKm)}</strong>
          <span>Km</span>
        </div>
      </div>
      {(onExportCsv || onExportImage) && (
        <div className="week-summary-export">
          {onExportCsv && (
            <button type="button" onClick={onExportCsv}>
              CSV
            </button>
          )}
          {onExportImage && (
            <button type="button" onClick={onExportImage}>
              Slika
            </button>
          )}
        </div>
      )}
    </section>
  );
}
