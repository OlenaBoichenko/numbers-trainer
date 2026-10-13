import { useEffect, useMemo, useState } from 'react';
import type { AppSettings, TrainingStats } from './types';
import { resolveLanguage } from './types';
import { loadSettings, saveSettings } from './lib/storage';
import { validateSettings } from './lib/validation';
import { findVoice, onVoicesChanged, speechSupported } from './lib/speech';
import { applyTheme, loadTheme, type Theme } from './lib/theme';
import { applyLocale, I18nContext, loadLocale, LOCALES, MESSAGES, type Locale } from './lib/i18n';
import { SettingsScreen } from './components/SettingsScreen';
import { TrainingScreen } from './components/TrainingScreen';
import { DictationScreen } from './components/DictationScreen';
import { SummaryScreen } from './components/SummaryScreen';

type Screen =
  | { name: 'settings' }
  | { name: 'training' }
  | { name: 'summary'; stats: TrainingStats };

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [screen, setScreen] = useState<Screen>({ name: 'settings' });
  const [voicesVersion, setVoicesVersion] = useState(0);
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const [locale, setLocale] = useState<Locale>(loadLocale);

  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => onVoicesChanged(() => setVoicesVersion((v) => v + 1)), []);
  useEffect(() => applyTheme(theme), [theme]);
  useEffect(() => applyLocale(locale), [locale]);

  const t = MESSAGES[locale];

  const language = resolveLanguage(settings);
  const errors = useMemo(() => validateSettings(settings), [settings]);
  const voiceMissing = useMemo(
    () => speechSupported() && findVoice(language) === null,
    // voicesVersion re-checks after async voice loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, voicesVersion],
  );

  const start = () => {
    if (Object.keys(errors).length > 0) return;
    setScreen({ name: 'training' });
  };

  return (
    <I18nContext.Provider value={t}>
      <div className="app">
        <div className="top-controls">
          <div className="lang-switch" role="radiogroup" aria-label={t.interfaceLanguage}>
            {LOCALES.map((l) => (
              <button
                key={l.value}
                type="button"
                role="radio"
                aria-checked={locale === l.value}
                className={`lang-switch-item${locale === l.value ? ' is-active' : ''}`}
                onClick={() => setLocale(l.value)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={theme === 'dark' ? t.themeToLight : t.themeToDark}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
              </svg>
            )}
          </button>
        </div>
        {screen.name === 'settings' && (
          <SettingsScreen
            settings={settings}
            errors={errors}
            voiceMissing={voiceMissing}
            speechUnsupported={!speechSupported()}
            onChange={setSettings}
            onStart={start}
          />
        )}
        {screen.name === 'training' && settings.mode === 'dictation' && (
          <DictationScreen
            settings={settings}
            language={language}
            onFinish={(stats) => setScreen({ name: 'summary', stats })}
          />
        )}
        {screen.name === 'training' && settings.mode === 'stepByStep' && (
          <TrainingScreen
            settings={settings}
            language={language}
            onFinish={(stats) => setScreen({ name: 'summary', stats })}
          />
        )}
        {screen.name === 'summary' && (
          <SummaryScreen
            stats={screen.stats}
            onRestart={() => setScreen({ name: 'settings' })}
          />
        )}
      </div>
    </I18nContext.Provider>
  );
}
