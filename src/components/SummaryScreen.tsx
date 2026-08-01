import type { TrainingStats } from '../types';

interface Props {
  stats: TrainingStats;
  onRestart: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  numbers: 'Числа',
  dates: 'Даты',
  currency: 'Валюты',
};

const LANG_LABELS: Record<string, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'fr-FR': 'Français',
};

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} сек`;
  return s === 0 ? `${m} мин` : `${m} мин ${s} сек`;
}

export function SummaryScreen({ stats, onRestart }: Props) {
  const isDictation = stats.mode === 'dictation';

  return (
    <div className="screen summary-screen">
      <div className="card summary-card">
        <div className="summary-icon" aria-hidden="true">🎉</div>
        <h1>Тренировка завершена!</h1>
        <p className="summary-note">
          {isDictation
            ? 'Сверьте свои записи со списком продиктованных значений ниже.'
            : 'Отличная работа. Регулярные короткие тренировки — лучший способ научиться уверенно воспринимать числа на слух.'}
        </p>

        <dl className="summary-stats">
          <div className="stat">
            <dt>Продолжительность</dt>
            <dd>{formatElapsed(stats.elapsedSeconds)}</dd>
          </div>
          <div className="stat">
            <dt>Язык</dt>
            <dd>{LANG_LABELS[stats.language]}</dd>
          </div>
          <div className="stat">
            <dt>Тип контента</dt>
            <dd>{TYPE_LABELS[stats.contentType]}</dd>
          </div>
          <div className="stat">
            <dt>{isDictation ? 'Продиктовано значений' : 'Создано заданий'}</dt>
            <dd>{stats.tasksCreated}</dd>
          </div>
          {!isDictation && (
            <div className="stat">
              <dt>Просмотрено ответов</dt>
              <dd>{stats.tasksViewed}</dd>
            </div>
          )}
          <div className="stat">
            <dt>Скорость речи</dt>
            <dd>{stats.speechRate.toFixed(1)}×</dd>
          </div>
        </dl>

        {isDictation && stats.items.length > 0 && (
          <div className="dictated-list-block">
            <h2>Продиктованные значения</h2>
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
          Начать новую тренировку
        </button>
      </div>
    </div>
  );
}
