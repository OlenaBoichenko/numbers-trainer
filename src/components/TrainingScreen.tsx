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

export function TrainingScreen({ settings, language, onFinish }: Props) {
  const totalSeconds = settings.durationMinutes * 60;

  const [item, setItem] = useState<TrainingItem | null>(null);
  const [taskNumber, setTaskNumber] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [answer, setAnswer] = useState('');
  const [speechError, setSpeechError] = useState(false);

  const historyRef = useRef<string[]>([]);
  const playTokenRef = useRef(0);
  const startedRef = useRef(false);
  const viewedRef = useRef(0);
  const taskNumberRef = useRef(0);
  const answerInputRef = useRef<HTMLInputElement>(null);

  const stopPlayback = useCallback(() => {
    playTokenRef.current += 1;
    cancelSpeech();
    setSpeaking(false);
  }, []);

  const playItem = useCallback(
    async (target: TrainingItem, initialDelayMs: number, repeats: number) => {
      const token = ++playTokenRef.current;
      const stale = () => token !== playTokenRef.current;
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      if (initialDelayMs > 0) {
        await sleep(initialDelayMs);
        if (stale()) return;
      }
      for (let i = 0; i < repeats; i++) {
        if (i > 0) {
          await sleep(settings.pauseSeconds * 1000);
          if (stale()) return;
        }
        setSpeaking(true);
        setSpeechError(false);
        try {
          await speak(target.speechText, language, settings.speechRate);
        } catch {
          if (!stale()) setSpeechError(true);
        }
        if (stale()) return;
        setSpeaking(false);
      }
    },
    [language, settings.pauseSeconds, settings.speechRate],
  );

  const nextTask = useCallback(
    (initialDelayMs: number) => {
      const next = generateItem(settings, language, historyRef.current);
      historyRef.current = [...historyRef.current, next.displayValue].slice(-10);
      taskNumberRef.current += 1;
      setTaskNumber(taskNumberRef.current);
      setItem(next);
      setRevealed(false);
      setAnswer('');
      void playItem(next, initialDelayMs, settings.repeatCount);
    },
    [settings, language, playItem],
  );

  // First task on mount (guarded against double-invocation)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    nextTask(800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    if (paused || timeUp) return;
    const id = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [paused, timeUp]);

  // Time is up: stop audio, no new tasks; current answer stays available
  useEffect(() => {
    if (remaining === 0 && !timeUp) {
      setTimeUp(true);
      stopPlayback();
    }
  }, [remaining, timeUp, stopPlayback]);

  // Cleanup on unmount
  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const buildStats = useCallback((): TrainingStats => ({
    language,
    contentType: settings.contentType,
    mode: 'stepByStep',
    durationMinutes: settings.durationMinutes,
    elapsedSeconds: totalSeconds - remaining,
    tasksCreated: taskNumberRef.current,
    tasksViewed: viewedRef.current,
    speechRate: settings.speechRate,
    items: [],
  }), [language, settings, totalSeconds, remaining]);

  const finish = () => {
    stopPlayback();
    onFinish(buildStats());
  };

  const reveal = () => {
    viewedRef.current += 1;
    setRevealed(true);
  };

  const togglePause = () => {
    if (timeUp) return;
    if (!paused) {
      stopPlayback();
      setPaused(true);
    } else {
      setPaused(false);
    }
  };

  const listenAgain = () => {
    if (paused || timeUp || !item) return;
    void playItem(item, 0, 1);
  };

  const progress = (remaining / totalSeconds) * 100;

  return (
    <div className="screen training-screen">
      <header className="training-header">
        <div className="training-chips">
          <span className="chip">{LANG_LABELS[language]}</span>
          <span className="chip">{TYPE_LABELS[settings.contentType]}</span>
          <span className="chip chip-muted">Задание №{taskNumber}</span>
        </div>
        <div className="training-timer-block">
          <span className={`training-timer${timeUp ? ' is-over' : ''}`} aria-label="Оставшееся время">
            {formatTime(remaining)}
          </span>
          <button
            type="button"
            className="btn btn-icon"
            onClick={togglePause}
            disabled={timeUp}
            aria-label={paused ? 'Продолжить тренировку' : 'Приостановить тренировку'}
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

      {timeUp && (
        <div className="banner banner-info" role="status">
          Время вышло! Новые задания не генерируются.
          {!revealed && item ? ' Вы можете посмотреть ответ на текущее задание.' : ''}
        </div>
      )}
      {paused && (
        <div className="banner banner-info" role="status">
          Тренировка на паузе. Таймер остановлен.
        </div>
      )}
      {speechError && (
        <div className="banner banner-error" role="alert">
          Не удалось воспроизвести задание. Проверьте, что в браузере доступен
          голос для выбранного языка, и попробуйте «Прослушать ещё раз».
        </div>
      )}

      <main className="card training-card">
        <div className="play-area">
          <button
            type="button"
            className={`play-button${speaking ? ' is-speaking' : ''}`}
            onClick={listenAgain}
            disabled={speaking || paused || timeUp}
            aria-label="Прослушать ещё раз"
          >
            <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
              <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z" />
              <path d="M14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
            </svg>
          </button>
          <p className="play-caption">
            {speaking
              ? 'Произносится…'
              : paused
                ? 'Пауза'
                : 'Прослушать ещё раз'}
          </p>
        </div>

        <div className="answer-block">
          <label htmlFor="answer-input">Запишите, что услышали</label>
          <input
            id="answer-input"
            ref={answerInputRef}
            type="text"
            autoComplete="off"
            placeholder="Ваш черновик — не проверяется"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>

        {!revealed ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={reveal}
            disabled={!item || paused}
          >
            Показать ответ
          </button>
        ) : (
          <div className="answer-reveal" role="status">
            <span className="answer-label">Правильный ответ</span>
            <div className="answer-value">{item?.displayValue}</div>
            <div className="answer-words">{item?.speechText}</div>
          </div>
        )}

        {revealed && !timeUp && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => nextTask(settings.pauseSeconds * 1000)}
            disabled={paused}
          >
            Следующее задание
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M8.6 4.6 15 11l-6.4 6.4L10 19l8-8-8-8z" />
            </svg>
          </button>
        )}
        {timeUp && (revealed || !item) && (
          <button type="button" className="btn btn-primary" onClick={finish}>
            Показать итоги
          </button>
        )}
      </main>
    </div>
  );
}
