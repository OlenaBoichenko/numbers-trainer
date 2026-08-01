import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppSettings, Language, TrainingItem, TrainingStats } from '../types';
import { generateItem } from '../lib/generators';
import { cancelSpeech, speak } from '../lib/speech';

interface Props {
  settings: AppSettings;
  language: Language;
  onFinish: (stats: TrainingStats) => void;
}

const TYPE_LABELS: Record<string, string> = {
  numbers: 'Числа',
  dates: 'Даты',
  currency: 'Валюты',
};

const LANG_LABELS: Record<Language, string> = {
  'en-US': '🇺🇸 English (US)',
  'en-GB': '🇬🇧 English (UK)',
  'fr-FR': '🇫🇷 Français',
};

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function DictationScreen({ settings, language, onFinish }: Props) {
  const totalSeconds = settings.durationMinutes * 60;

  const [count, setCount] = useState(0);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speechError, setSpeechError] = useState(false);
  const [notes, setNotes] = useState('');

  const itemsRef = useRef<TrainingItem[]>([]);
  const historyRef = useRef<string[]>([]);
  const runTokenRef = useRef(0);
  const startedRef = useRef(false);
  const remainingRef = useRef(totalSeconds);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    remainingRef.current = remaining;
  }, [remaining]);

  const buildStats = useCallback((): TrainingStats => ({
    language,
    contentType: settings.contentType,
    mode: 'dictation',
    durationMinutes: settings.durationMinutes,
    elapsedSeconds: totalSeconds - remainingRef.current,
    tasksCreated: itemsRef.current.length,
    tasksViewed: itemsRef.current.length,
    speechRate: settings.speechRate,
    items: [...itemsRef.current],
  }), [language, settings, totalSeconds]);

  const finish = useCallback(() => {
    runTokenRef.current += 1;
    cancelSpeech();
    onFinish(buildStats());
  }, [onFinish, buildStats]);

  useEffect(() => {
    finishRef.current = finish;
  }, [finish]);

 
  const runDictation = useCallback(
    async (initialDelayMs: number) => {
      const token = ++runTokenRef.current;
      const stale = () => token !== runTokenRef.current;
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      if (initialDelayMs > 0) {
        await sleep(initialDelayMs);
        if (stale()) return;
      }
      while (!stale()) {
        if (remainingRef.current <= 0) break;

        const item = generateItem(settings, language, historyRef.current);
        historyRef.current = [...historyRef.current, item.displayValue].slice(-10);
        itemsRef.current.push(item);
        setCount(itemsRef.current.length);

        setSpeaking(true);
        setSpeechError(false);
        try {
          await speak(item.speechText, language, settings.speechRate);
        } catch {
          if (!stale()) {
            setSpeaking(false);
            setSpeechError(true);
            setPaused(true);
          }
          return;
        }
        if (stale()) return;
        setSpeaking(false);

        if (remainingRef.current <= 0) break;
        await sleep(settings.dictationPauseSeconds * 1000);
      }
      if (!stale()) finishRef.current();
    },
    [settings, language],
  );

  // Start dictation on mount (guarded against double-invocation)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void runDictation(800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [paused]);

  // Cleanup on unmount
  useEffect(() => () => {
    runTokenRef.current += 1;
    cancelSpeech();
  }, []);

  const togglePause = () => {
    if (!paused) {
      runTokenRef.current += 1;
      cancelSpeech();
      setSpeaking(false);
      setPaused(true);
    } else {
      setSpeechError(false);
      setPaused(false);
      void runDictation(300);
    }
  };

  const progress = (remaining / totalSeconds) * 100;

  return (
    <div className="screen training-screen">
      <header className="training-header">
        <div className="training-chips">
          <span className="chip">{LANG_LABELS[language]}</span>
          <span className="chip">{TYPE_LABELS[settings.contentType]}</span>
          <span className="chip chip-muted">Продиктовано: {count}</span>
        </div>
        <div className="training-timer-block">
          <span className="training-timer" aria-label="Оставшееся время">
            {formatTime(remaining)}
          </span>
          <button
            type="button"
            className="btn btn-icon"
            onClick={togglePause}
            aria-label={paused ? 'Продолжить диктовку' : 'Приостановить диктовку'}
          >
            {paused ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
              </svg>
            )}
          </button>
          <button type="button" className="btn btn-ghost btn-small" onClick={finish}>
            Завершить
          </button>
        </div>
      </header>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {paused && !speechError && (
        <div className="banner banner-info" role="status">
          Диктовка на паузе. Таймер остановлен — нажмите ▶ чтобы продолжить.
        </div>
      )}
      {speechError && (
        <div className="banner banner-error" role="alert">
          Не удалось воспроизвести значение. Проверьте, что в браузере доступен
          голос для выбранного языка, и нажмите ▶ чтобы продолжить.
        </div>
      )}

      <main className="card training-card">
        <div className="play-area">
          <div
            className={`play-button play-indicator${speaking ? ' is-speaking' : ''}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
              <path d="M14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
            </svg>
          </div>
          <p className="play-caption" role="status">
            {paused
              ? 'Пауза'
              : speaking
                ? 'Диктуется — записывайте!'
                : 'Диктовка идёт…'}
          </p>
        </div>

        <div className="answer-block">
          <label htmlFor="notes-input">Черновик для записи (не проверяется)</label>
          <textarea
            id="notes-input"
            rows={5}
            placeholder="Записывайте услышанные значения здесь или на бумаге…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <p className="hint">
          Все продиктованные значения будут показаны после окончания —
          вы сможете сверить свои записи.
        </p>
      </main>
    </div>
  );
}
