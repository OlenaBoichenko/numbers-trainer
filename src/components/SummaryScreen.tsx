import type { TrainingStats } from '../types';
import { useT } from '../lib/i18n';

interface Props {
  stats: TrainingStats;
  onRestart: () => void;
}

const LANG_LABELS: Record<string, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'fr-FR': 'Français',
};

export function SummaryScreen({ stats, onRestart }: Props) {
  const t = useT();
  const isDictation = stats.mode === 'dictation';

  return (
    <div className="screen summary-screen">
      <div className="card summary-card">
        <div className="summary-icon" aria-hidden="true">🎉</div>
        <h1>{t.trainingComplete}</h1>
        <p className="summary-note">
          {isDictation
            ? t.summaryDictation
            : t.summaryStepByStep}
        </p>

        <dl className="summary-stats">
          <div className="stat">
            <dt>{t.statDuration}</dt>
            <dd>{t.elapsed(Math.floor(stats.elapsedSeconds / 60), stats.elapsedSeconds % 60)}</dd>
          </div>
          <div className="stat">
            <dt>{t.statLanguage}</dt>
            <dd>{LANG_LABELS[stats.language]}</dd>
          </div>
          <div className="stat">
            <dt>{t.statContentType}</dt>
            <dd>{t.contentTypes[stats.contentType].title}</dd>
          </div>
          <div className="stat">
            <dt>{isDictation ? t.statDictated : t.statTasksCreated}</dt>
            <dd>{stats.tasksCreated}</dd>
          </div>
          {!isDictation && (
            <div className="stat">
              <dt>{t.statAnswersViewed}</dt>
              <dd>{stats.tasksViewed}</dd>
            </div>
          )}
          <div className="stat">
            <dt>{t.statSpeechRate}</dt>
            <dd>{stats.speechRate.toFixed(1)}×</dd>
          </div>
        </dl>

        {isDictation && stats.items.length > 0 && (
          <div className="dictated-list-block">
            <h2>{t.dictatedValues}</h2>
            <ol className="dictated-list">
              {stats.items.map((item, i) => (
                <li key={item.id}>
                  <span className="dictated-index" aria-hidden="true">{i + 1}</span>
                  <span className="dictated-value">{item.displayValue}</span>
                  <span className="dictated-words">{item.speechText}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <button type="button" className="btn btn-primary btn-start" onClick={onRestart}>
          {t.newTraining}
        </button>
      </div>
    </div>
  );
}
