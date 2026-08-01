export type Language = 'en-US' | 'en-GB' | 'fr-FR';
export type UiLanguage = 'en' | 'fr';
export type EnglishVariant = 'en-US' | 'en-GB';
export type ContentType = 'numbers' | 'dates' | 'currency';
export type TrainingMode = 'dictation' | 'stepByStep';
export type CurrencyCode = 'USD' | 'CAD' | 'EUR' | 'GBP';

export interface NumberSettings {
  min: number;
  max: number;
  includeIntegers: boolean;
  includeDecimals: boolean;
  includeNegative: boolean;
  maxDecimalPlaces: 1 | 2 | 3;
}

export interface DateSettings {
  startYear: number;
  endYear: number;
}

export interface CurrencySettings {
  currencies: CurrencyCode[];
  min: number;
  max: number;
  includeDecimals: boolean;
  includeNegative: boolean;
  decimalPlaces: 1 | 2;
}

export interface AppSettings {
  uiLanguage: UiLanguage;
  englishVariant: EnglishVariant;
  contentType: ContentType;
  mode: TrainingMode;
  speechRate: number;
  durationMinutes: number;
  pauseSeconds: number;
  dictationPauseSeconds: number;
  repeatCount: 1 | 2 | 3;
  numbers: NumberSettings;
  dates: DateSettings;
  currency: CurrencySettings;
}

export interface TrainingItem {
  id: string;
  type: ContentType;
  displayValue: string;
  speechText: string;
  language: Language;
}

export interface TrainingStats {
  language: Language;
  contentType: ContentType;
  mode: TrainingMode;
  durationMinutes: number;
  elapsedSeconds: number;
  tasksCreated: number;
  tasksViewed: number;
  speechRate: number;
  /** All dictated values (dictation mode) so the user can check their notes. */
  items: TrainingItem[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  uiLanguage: 'en',
  englishVariant: 'en-US',
  contentType: 'numbers',
  mode: 'dictation',
  speechRate: 1.0,
  durationMinutes: 5,
  pauseSeconds: 5,
  dictationPauseSeconds: 1.0,
  repeatCount: 1,
  numbers: {
    min: 0,
    max: 10000,
    includeIntegers: true,
    includeDecimals: true,
    includeNegative: false,
    maxDecimalPlaces: 2,
  },
  dates: {
    startYear: 1900,
    endYear: 2100,
  },
  currency: {
    currencies: ['USD', 'EUR'],
    min: 1,
    max: 10000,
    includeDecimals: true,
    includeNegative: false,
    decimalPlaces: 2,
  },
};

export function resolveLanguage(s: AppSettings): Language {
  return s.uiLanguage === 'fr' ? 'fr-FR' : s.englishVariant;
}
