import type { AppSettings, ContentType, CurrencyCode } from '../types';
import { resolveLanguage } from '../types';
import type { ValidationErrors } from '../lib/validation';
import { FieldError, NumberField, Segmented, Slider, Toggle } from './controls';

interface Props {
  settings: AppSettings;
  errors: ValidationErrors;
  voiceMissing: boolean;
  speechUnsupported: boolean;
  onChange: (settings: AppSettings) => void;
  onStart: () => void;
}

const CURRENCY_OPTIONS: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: 'USD', symbol: '$', name: 'Доллар США' },
  { code: 'CAD', symbol: '$', name: 'Канадский доллар' },
  { code: 'EUR', symbol: '€', name: 'Евро' },
  { code: 'GBP', symbol: '£', name: 'Британский фунт' },
];

const CONTENT_TYPES: { type: ContentType; icon: string; title: string; hint: string }[] = [
  { type: 'numbers', icon: '123', title: 'Числа', hint: 'Целые и десятичные' },
  { type: 'dates', icon: '📅', title: 'Даты', hint: 'Календарные даты' },
  { type: 'currency', icon: '💰', title: 'Валюты', hint: 'Денежные суммы' },
];

export function SettingsScreen({
  settings, errors, voiceMissing, speechUnsupported, onChange, onStart,
}: Props) {
  const s = settings;
  const set = (patch: Partial<AppSettings>) => onChange({ ...s, ...patch });
  const hasErrors = Object.keys(errors).length > 0;

  const toggleCurrency = (code: CurrencyCode) => {
    const list = s.currency.currencies.includes(code)
      ? s.currency.currencies.filter((c) => c !== code)
      : [...s.currency.currencies, code];
    set({ currency: { ...s.currency, currencies: list } });
  };

  return (
    <div className="screen settings-screen">
      <header className="app-header">
        <div className="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4" />
          </svg>
        </div>
        <h1>Тренажёр числительных</h1>
        <p className="app-subtitle">
          Тренируйте восприятие чисел, дат и денежных сумм на слух.
          Приложение произносит случайное значение — запишите услышанное
          и сверьтесь с правильным ответом.
        </p>
      </header>

      {speechUnsupported && (
        <div className="banner banner-error" role="alert">
          Ваш браузер не поддерживает синтез речи (Web Speech API).
          Попробуйте открыть сайт в Chrome, Edge или Safari.
        </div>
      )}
      {!speechUnsupported && voiceMissing && (
        <div className="banner banner-warning" role="alert">
          В вашем браузере не найден голос для выбранного языка.
          Попробуйте другой браузер или установите соответствующий системный голос.
        </div>
      )}

      <section className="card">
        <h2>Язык тренировки</h2>
        <Segmented
          ariaLabel="Язык тренировки"
          options={[
            { value: 'en', label: <><span className="flag" aria-hidden="true">🇬🇧</span> English</> },
            { value: 'fr', label: <><span className="flag" aria-hidden="true">🇫🇷</span> Français</> },
          ]}
          value={s.uiLanguage}
          onChange={(uiLanguage) => set({ uiLanguage })}
        />
        {s.uiLanguage === 'en' && (
          <div className="sub-setting">
            <span className="sub-label">Вариант английского</span>
            <Segmented
              ariaLabel="Вариант английского языка"
              options={[
                { value: 'en-US', label: <><span className="flag" aria-hidden="true">🇺🇸</span> American</> },
                { value: 'en-GB', label: <><span className="flag" aria-hidden="true">🇬🇧</span> British</> },
              ]}
              value={s.englishVariant}
              onChange={(englishVariant) => set({ englishVariant })}
            />
            <p className="hint">
              Влияет на голос, союз «and» в числах и формат даты
              ({s.englishVariant === 'en-US' ? 'March 18, 1997' : '18 March 1997'}).
            </p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Режим тренировки</h2>
        <div className="content-type-grid mode-grid" role="radiogroup" aria-label="Режим тренировки">
          <button
            type="button"
            role="radio"
            aria-checked={s.mode === 'dictation'}
            className={`content-type-card${s.mode === 'dictation' ? ' is-active' : ''}`}
            onClick={() => set({ mode: 'dictation' })}
          >
            <span className="ct-icon" aria-hidden="true">🎧</span>
            <span className="ct-title">Диктовка</span>
            <span className="ct-hint">Непрерывная диктовка значений всё время тренировки</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={s.mode === 'stepByStep'}
            className={`content-type-card${s.mode === 'stepByStep' ? ' is-active' : ''}`}
            onClick={() => set({ mode: 'stepByStep' })}
          >
            <span className="ct-icon" aria-hidden="true">👁</span>
            <span className="ct-title">По одному с проверкой</span>
            <span className="ct-hint">Одно значение — записали — посмотрели ответ</span>
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Тип контента</h2>
        <div className="content-type-grid" role="radiogroup" aria-label="Тип контента">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.type}
              type="button"
              role="radio"
              aria-checked={s.contentType === ct.type}
              className={`content-type-card${s.contentType === ct.type ? ' is-active' : ''}`}
              onClick={() => set({ contentType: ct.type })}
            >
              <span className="ct-icon" aria-hidden="true">{ct.icon}</span>
              <span className="ct-title">{ct.title}</span>
              <span className="ct-hint">{ct.hint}</span>
            </button>
          ))}
        </div>
      </section>

      {s.contentType === 'numbers' && (
        <section className="card">
          <h2>Настройки чисел</h2>
          <div className="field-grid">
            <NumberField
              id="num-min" label="Минимум" value={s.numbers.min} min={0}
              onChange={(min) => set({ numbers: { ...s.numbers, min } })}
            />
            <NumberField
              id="num-max" label="Максимум" value={s.numbers.max} min={0}
              onChange={(max) => set({ numbers: { ...s.numbers, max } })}
            />
          </div>
          <FieldError message={errors.numberRange ?? errors.numberRangeNarrow} />
          <div className="toggle-group">
            <Toggle
              id="num-int" label="Целые числа" checked={s.numbers.includeIntegers}
              onChange={(includeIntegers) => set({ numbers: { ...s.numbers, includeIntegers } })}
            />
            <Toggle
              id="num-dec" label="Десятичные числа" checked={s.numbers.includeDecimals}
              onChange={(includeDecimals) => set({ numbers: { ...s.numbers, includeDecimals } })}
            />
            <Toggle
              id="num-neg" label="Отрицательные числа" checked={s.numbers.includeNegative}
              onChange={(includeNegative) => set({ numbers: { ...s.numbers, includeNegative } })}
            />
          </div>
          <FieldError message={errors.numberTypes} />
          {s.numbers.includeDecimals && (
            <div className="sub-setting">
              <span className="sub-label">Максимум цифр после разделителя</span>
              <Segmented
                ariaLabel="Максимум цифр после десятичного разделителя"
                options={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                  { value: 3, label: '3' },
                ]}
                value={s.numbers.maxDecimalPlaces}
                onChange={(maxDecimalPlaces) =>
                  set({ numbers: { ...s.numbers, maxDecimalPlaces: maxDecimalPlaces as 1 | 2 | 3 } })}
              />
            </div>
          )}
        </section>
      )}

      {s.contentType === 'dates' && (
        <section className="card">
          <h2>Настройки дат</h2>
          <div className="field-grid">
            <NumberField
              id="date-start" label="Начальный год" value={s.dates.startYear} min={1900} max={2100}
              onChange={(startYear) => set({ dates: { ...s.dates, startYear } })}
            />
            <NumberField
              id="date-end" label="Конечный год" value={s.dates.endYear} min={1900} max={2100}
              onChange={(endYear) => set({ dates: { ...s.dates, endYear } })}
            />
          </div>
          <FieldError message={errors.yearRange} />
          <p className="hint">
            Формат ответа: {resolveLanguage(s) === 'fr-FR'
              ? '18 mars 1997'
              : s.englishVariant === 'en-US' ? 'March 18, 1997' : '18 March 1997'}
          </p>
        </section>
      )}

      {s.contentType === 'currency' && (
        <section className="card">
          <h2>Настройки валют</h2>
          <div className="currency-grid" role="group" aria-label="Валюты">
            {CURRENCY_OPTIONS.map((c) => (
              <button
                key={c.code}
                type="button"
                aria-pressed={s.currency.currencies.includes(c.code)}
                className={`currency-chip${s.currency.currencies.includes(c.code) ? ' is-active' : ''}`}
                onClick={() => toggleCurrency(c.code)}
              >
                <span className="cur-symbol" aria-hidden="true">{c.symbol}</span>
                <span className="cur-code">{c.code}</span>
                <span className="cur-name">{c.name}</span>
              </button>
            ))}
          </div>
          <p className="hint">Если выбрано несколько валют, они чередуются случайно.</p>
          <FieldError message={errors.currencyList} />
          <div className="field-grid">
            <NumberField
              id="cur-min" label="Минимальная сумма" value={s.currency.min} min={0}
              onChange={(min) => set({ currency: { ...s.currency, min } })}
            />
            <NumberField
              id="cur-max" label="Максимальная сумма" value={s.currency.max} min={0}
              onChange={(max) => set({ currency: { ...s.currency, max } })}
            />
          </div>
          <FieldError message={errors.currencyRange} />
          <div className="toggle-group">
            <Toggle
              id="cur-dec" label="Дробная часть (центы)" checked={s.currency.includeDecimals}
              onChange={(includeDecimals) => set({ currency: { ...s.currency, includeDecimals } })}
            />
            <Toggle
              id="cur-neg" label="Отрицательные суммы" checked={s.currency.includeNegative}
              onChange={(includeNegative) => set({ currency: { ...s.currency, includeNegative } })}
            />
          </div>
          {s.currency.includeDecimals && (
            <div className="sub-setting">
              <span className="sub-label">Цифр после разделителя</span>
              <Segmented
                ariaLabel="Цифр после десятичного разделителя"
                options={[
                  { value: 1, label: '1' },
                  { value: 2, label: '2' },
                ]}
                value={s.currency.decimalPlaces}
                onChange={(decimalPlaces) =>
                  set({ currency: { ...s.currency, decimalPlaces: decimalPlaces as 1 | 2 } })}
              />
            </div>
          )}
        </section>
      )}

      <section className="card">
        <h2>Параметры тренировки</h2>
        <Slider
          id="rate" label="Скорость речи"
          min={0.5} max={1.5} step={0.1}
          value={s.speechRate}
          display={`${s.speechRate.toFixed(1)}×`}
          onChange={(speechRate) => set({ speechRate: Math.round(speechRate * 10) / 10 })}
        />
        <Slider
          id="duration" label={s.mode === 'dictation' ? 'Время диктовки' : 'Продолжительность'}
          min={1} max={30} step={1}
          value={s.durationMinutes}
          display={`${s.durationMinutes} мин`}
          onChange={(durationMinutes) => set({ durationMinutes })}
        />
        {s.mode === 'dictation' ? (
          <>
            <Slider
              id="dictation-pause" label="Пауза между значениями"
              min={0.2} max={2} step={0.2}
              value={s.dictationPauseSeconds}
              display={`${s.dictationPauseSeconds.toFixed(1)} с`}
              onChange={(v) => set({ dictationPauseSeconds: Math.round(v * 10) / 10 })}
            />
            <p className="hint">
              Робот диктует значения одно за другим с этой паузой в течение
              всего времени тренировки.
            </p>
          </>
        ) : (
          <>
            <Slider
              id="pause" label="Пауза перед заданием"
              min={1} max={15} step={1}
              value={s.pauseSeconds}
              display={`${s.pauseSeconds} с`}
              onChange={(pauseSeconds) => set({ pauseSeconds })}
            />
            <div className="sub-setting">
              <span className="sub-label">Автоповторов задания</span>
              <Segmented
                ariaLabel="Количество автоматических повторений"
                options={[
                  { value: 1, label: '1 раз' },
                  { value: 2, label: '2 раза' },
                  { value: 3, label: '3 раза' },
                ]}
                value={s.repeatCount}
                onChange={(repeatCount) => set({ repeatCount: repeatCount as 1 | 2 | 3 })}
              />
            </div>
          </>
        )}
      </section>

      <button
        type="button"
        className="btn btn-primary btn-start"
        onClick={onStart}
        disabled={hasErrors || speechUnsupported}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Начать тренировку
      </button>
      {hasErrors && (
        <p className="hint hint-center">Исправьте отмеченные настройки, чтобы начать.</p>
      )}
    </div>
  );
}
