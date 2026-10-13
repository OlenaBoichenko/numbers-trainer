import type { AppSettings, ContentType, CurrencyCode } from '../types';
import { resolveLanguage } from '../types';
import type { ValidationErrors } from '../lib/validation';
import { useT, type ErrorKey } from '../lib/i18n';
import { FieldError, NumberField, Segmented, Slider, Toggle } from './controls';

interface Props {
  settings: AppSettings;
  errors: ValidationErrors;
  voiceMissing: boolean;
  speechUnsupported: boolean;
  onChange: (settings: AppSettings) => void;
  onStart: () => void;
}

const CURRENCY_OPTIONS: { code: CurrencyCode; symbol: string }[] = [
  { code: 'USD', symbol: '$' },
  { code: 'CAD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

const CONTENT_TYPES: { type: ContentType; icon: string }[] = [
  { type: 'numbers', icon: '123' },
  { type: 'dates', icon: '📅' },
  { type: 'currency', icon: '💰' },
];

export function SettingsScreen({
  settings, errors, voiceMissing, speechUnsupported, onChange, onStart,
}: Props) {
  const t = useT();
  const s = settings;
  const set = (patch: Partial<AppSettings>) => onChange({ ...s, ...patch });
  const hasErrors = Object.keys(errors).length > 0;
  const errorText = (key?: ErrorKey) => (key ? t.errors[key] : undefined);

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
        <h1>{t.appTitle}</h1>
        <p className="app-subtitle">{t.appSubtitle}</p>
      </header>

      {speechUnsupported && (
        <div className="banner banner-error" role="alert">
          {t.speechUnsupported}
        </div>
      )}
      {!speechUnsupported && voiceMissing && (
        <div className="banner banner-warning" role="alert">
          {t.voiceMissing}
        </div>
      )}

      <section className="card">
        <h2>{t.trainingLanguage}</h2>
        <Segmented
          ariaLabel={t.trainingLanguage}
          options={[
            { value: 'en', label: <><span className="flag" aria-hidden="true">🇬🇧</span> English</> },
            { value: 'fr', label: <><span className="flag" aria-hidden="true">🇫🇷</span> Français</> },
          ]}
          value={s.uiLanguage}
          onChange={(uiLanguage) => set({ uiLanguage })}
        />
        {s.uiLanguage === 'en' && (
          <div className="sub-setting">
            <span className="sub-label">{t.englishVariant}</span>
            <Segmented
              ariaLabel={t.englishVariantAria}
              options={[
                { value: 'en-US', label: <><span className="flag" aria-hidden="true">🇺🇸</span> American</> },
                { value: 'en-GB', label: <><span className="flag" aria-hidden="true">🇬🇧</span> British</> },
              ]}
              value={s.englishVariant}
              onChange={(englishVariant) => set({ englishVariant })}
            />
            <p className="hint">
              {t.englishVariantHint(s.englishVariant === 'en-US' ? 'March 18, 1997' : '18 March 1997')}
            </p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>{t.trainingMode}</h2>
        <div className="content-type-grid mode-grid" role="radiogroup" aria-label={t.trainingMode}>
          <button
            type="button"
            role="radio"
            aria-checked={s.mode === 'dictation'}
            className={`content-type-card${s.mode === 'dictation' ? ' is-active' : ''}`}
            onClick={() => set({ mode: 'dictation' })}
          >
            <span className="ct-icon" aria-hidden="true">🎧</span>
            <span className="ct-title">{t.modeDictation}</span>
            <span className="ct-hint">{t.modeDictationHint}</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={s.mode === 'stepByStep'}
            className={`content-type-card${s.mode === 'stepByStep' ? ' is-active' : ''}`}
            onClick={() => set({ mode: 'stepByStep' })}
          >
            <span className="ct-icon" aria-hidden="true">👁</span>
            <span className="ct-title">{t.modeStepByStep}</span>
            <span className="ct-hint">{t.modeStepByStepHint}</span>
          </button>
        </div>
      </section>

      <section className="card">
        <h2>{t.contentType}</h2>
        <div className="content-type-grid" role="radiogroup" aria-label={t.contentType}>
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
              <span className="ct-title">{t.contentTypes[ct.type].title}</span>
              <span className="ct-hint">{t.contentTypes[ct.type].hint}</span>
            </button>
          ))}
        </div>
      </section>

      {s.contentType === 'numbers' && (
        <section className="card">
          <h2>{t.numberSettings}</h2>
          <div className="field-grid">
            <NumberField
              id="num-min" label={t.minimum} value={s.numbers.min} min={0}
              onChange={(min) => set({ numbers: { ...s.numbers, min } })}
            />
            <NumberField
              id="num-max" label={t.maximum} value={s.numbers.max} min={0}
              onChange={(max) => set({ numbers: { ...s.numbers, max } })}
            />
          </div>
          <FieldError message={errorText(errors.numberRange ?? errors.numberRangeNarrow)} />
          <div className="toggle-group">
            <Toggle
              id="num-int" label={t.integers} checked={s.numbers.includeIntegers}
              onChange={(includeIntegers) => set({ numbers: { ...s.numbers, includeIntegers } })}
            />
            <Toggle
              id="num-dec" label={t.decimals} checked={s.numbers.includeDecimals}
              onChange={(includeDecimals) => set({ numbers: { ...s.numbers, includeDecimals } })}
            />
            <Toggle
              id="num-neg" label={t.negativeNumbers} checked={s.numbers.includeNegative}
              onChange={(includeNegative) => set({ numbers: { ...s.numbers, includeNegative } })}
            />
          </div>
          <FieldError message={errorText(errors.numberTypes)} />
          {s.numbers.includeDecimals && (
            <div className="sub-setting">
              <span className="sub-label">{t.maxDecimalDigits}</span>
              <Segmented
                ariaLabel={t.maxDecimalDigitsAria}
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
          <h2>{t.dateSettings}</h2>
          <div className="field-grid">
            <NumberField
              id="date-start" label={t.startYear} value={s.dates.startYear} min={1900} max={2100}
              onChange={(startYear) => set({ dates: { ...s.dates, startYear } })}
            />
            <NumberField
              id="date-end" label={t.endYear} value={s.dates.endYear} min={1900} max={2100}
              onChange={(endYear) => set({ dates: { ...s.dates, endYear } })}
            />
          </div>
          <FieldError message={errorText(errors.yearRange)} />
          <p className="hint">
            {t.answerFormat} {resolveLanguage(s) === 'fr-FR'
              ? '18 mars 1997'
              : s.englishVariant === 'en-US' ? 'March 18, 1997' : '18 March 1997'}
          </p>
        </section>
      )}

      {s.contentType === 'currency' && (
        <section className="card">
          <h2>{t.currencySettings}</h2>
          <div className="currency-grid" role="group" aria-label={t.currencies}>
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
                <span className="cur-name">{t.currencyNames[c.code]}</span>
              </button>
            ))}
          </div>
          <p className="hint">{t.currenciesHint}</p>
          <FieldError message={errorText(errors.currencyList)} />
          <div className="field-grid">
            <NumberField
              id="cur-min" label={t.minAmount} value={s.currency.min} min={0}
              onChange={(min) => set({ currency: { ...s.currency, min } })}
            />
            <NumberField
              id="cur-max" label={t.maxAmount} value={s.currency.max} min={0}
              onChange={(max) => set({ currency: { ...s.currency, max } })}
            />
          </div>
          <FieldError message={errorText(errors.currencyRange)} />
          <div className="toggle-group">
            <Toggle
              id="cur-dec" label={t.centsPart} checked={s.currency.includeDecimals}
              onChange={(includeDecimals) => set({ currency: { ...s.currency, includeDecimals } })}
            />
            <Toggle
              id="cur-neg" label={t.negativeAmounts} checked={s.currency.includeNegative}
              onChange={(includeNegative) => set({ currency: { ...s.currency, includeNegative } })}
            />
          </div>
          {s.currency.includeDecimals && (
            <div className="sub-setting">
              <span className="sub-label">{t.decimalDigits}</span>
              <Segmented
                ariaLabel={t.decimalDigitsAria}
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
        <h2>{t.trainingParams}</h2>
        <Slider
          id="rate" label={t.speechRate}
          min={0.5} max={1.5} step={0.1}
          value={s.speechRate}
          display={`${s.speechRate.toFixed(1)}×`}
          onChange={(speechRate) => set({ speechRate: Math.round(speechRate * 10) / 10 })}
        />
        <Slider
          id="duration" label={s.mode === 'dictation' ? t.dictationTime : t.duration}
          min={1} max={30} step={1}
          value={s.durationMinutes}
          display={t.minutesShort(s.durationMinutes)}
          onChange={(durationMinutes) => set({ durationMinutes })}
        />
        {s.mode === 'dictation' ? (
          <>
            <Slider
              id="dictation-pause" label={t.dictationPause}
              min={0.2} max={2} step={0.2}
              value={s.dictationPauseSeconds}
              display={t.secondsShort(s.dictationPauseSeconds.toFixed(1))}
              onChange={(v) => set({ dictationPauseSeconds: Math.round(v * 10) / 10 })}
            />
            <p className="hint">{t.dictationPauseHint}</p>
          </>
        ) : (
          <>
            <Slider
              id="pause" label={t.taskPause}
              min={1} max={15} step={1}
              value={s.pauseSeconds}
              display={t.secondsShort(s.pauseSeconds)}
              onChange={(pauseSeconds) => set({ pauseSeconds })}
            />
            <div className="sub-setting">
              <span className="sub-label">{t.autoRepeats}</span>
              <Segmented
                ariaLabel={t.autoRepeatsAria}
                options={[
                  { value: 1, label: t.repeatTimes(1) },
                  { value: 2, label: t.repeatTimes(2) },
                  { value: 3, label: t.repeatTimes(3) },
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
        {t.startTraining}
      </button>
      {hasErrors && (
        <p className="hint hint-center">{t.fixSettings}</p>
      )}
    </div>
  );
}
