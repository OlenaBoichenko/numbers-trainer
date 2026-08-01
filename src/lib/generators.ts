import type {
  AppSettings, ContentType, CurrencyCode, Language, TrainingItem,
} from '../types';
import { chance, pick, randInt } from './random';
import { formatCurrency, formatDate, formatNumber, MONTHS_EN, MONTHS_FR } from './format';
import { intToWordsEn, numberToSpeechEn, ordinalEn, yearToWordsEn } from './wordsEn';
import { intToWordsFr, numberToSpeechFr } from './wordsFr';

let seq = 0;
function nextId(): string {
  return `task-${Date.now()}-${++seq}`;
}

const HISTORY_SIZE = 10;
const MAX_ATTEMPTS = 25;

interface Generated {
  displayValue: string;
  speechText: string;
}

/** Random digits string of given length whose last digit is never zero. */
function randomFraction(digits: number): string {
  let s = '';
  for (let i = 0; i < digits - 1; i++) s += randInt(0, 9);
  s += randInt(1, 9);
  return s;
}

function generateNumber(s: AppSettings, lang: Language): Generated {
  const { numbers } = s;
  const british = lang === 'en-GB';
  const useDecimal =
    numbers.includeDecimals && (!numbers.includeIntegers || chance(0.5));
  const negative = numbers.includeNegative && chance(0.5);

  if (!useDecimal) {
    const magnitude = randInt(numbers.min, numbers.max);
    const value = negative ? -magnitude : magnitude;
    return {
      displayValue: formatNumber(value, 0, lang),
      speechText:
        lang === 'fr-FR'
          ? numberToSpeechFr(value, null)
          : numberToSpeechEn(value, null, british),
    };
  }

  const digits = randInt(1, numbers.maxDecimalPlaces);
  const fraction = randomFraction(digits);
  const intPart = randInt(numbers.min, Math.max(numbers.min, numbers.max - 1));
  const magnitude = Number(`${intPart}.${fraction}`);
  const value = negative ? -magnitude : magnitude;
  return {
    displayValue: formatNumber(value, digits, lang),
    speechText:
      lang === 'fr-FR'
        ? numberToSpeechFr(value, fraction)
        : numberToSpeechEn(value, fraction, british),
  };
}

function generateDate(s: AppSettings, lang: Language): Generated {
  const year = randInt(s.dates.startYear, s.dates.endYear);
  const month = randInt(0, 11);
  const day = randInt(1, new Date(year, month + 1, 0).getDate());

  let speechText: string;
  if (lang === 'fr-FR') {
    const dayWords = day === 1 ? 'premier' : intToWordsFr(day);
    speechText = `le ${dayWords} ${MONTHS_FR[month]} ${intToWordsFr(year)}`;
  } else if (lang === 'en-GB') {
    speechText = `the ${ordinalEn(day)} of ${MONTHS_EN[month]}, ${yearToWordsEn(year, true)}`;
  } else {
    speechText = `${MONTHS_EN[month]} ${ordinalEn(day)}, ${yearToWordsEn(year, false)}`;
  }
  return { displayValue: formatDate(day, month, year, lang), speechText };
}

interface CurrencyWords {
  en: { one: string; many: string; centOne: string; centMany: string };
  fr: { one: string; many: string; centOne: string; centMany: string };
}

const CURRENCY_WORDS: Record<CurrencyCode, CurrencyWords> = {
  USD: {
    en: { one: 'dollar', many: 'dollars', centOne: 'cent', centMany: 'cents' },
    fr: { one: 'dollar', many: 'dollars', centOne: 'cent', centMany: 'cents' },
  },
  CAD: {
    en: { one: 'Canadian dollar', many: 'Canadian dollars', centOne: 'cent', centMany: 'cents' },
    fr: { one: 'dollar canadien', many: 'dollars canadiens', centOne: 'cent', centMany: 'cents' },
  },
  EUR: {
    en: { one: 'euro', many: 'euros', centOne: 'cent', centMany: 'cents' },
    fr: { one: 'euro', many: 'euros', centOne: 'centime', centMany: 'centimes' },
  },
  GBP: {
    en: { one: 'pound', many: 'pounds', centOne: 'penny', centMany: 'pence' },
    fr: { one: 'livre sterling', many: 'livres sterling', centOne: 'penny', centMany: 'pence' },
  },
};

function generateCurrency(s: AppSettings, lang: Language): Generated {
  const c = s.currency;
  const british = lang === 'en-GB';
  const code = pick(c.currencies);
  const words = CURRENCY_WORDS[code][lang === 'fr-FR' ? 'fr' : 'en'];

  const negative = c.includeNegative && chance(0.5);
  const withCents = c.includeDecimals && chance(0.5);
  const major = withCents
    ? randInt(c.min, Math.max(c.min, c.max - 1))
    : randInt(c.min, c.max);
  const centsMax = Math.pow(10, c.decimalPlaces) - 1;
  const cents = withCents ? randInt(1, centsMax) : 0;
  const value = Number(`${major}.${String(cents).padStart(c.decimalPlaces, '0')}`);
  const signed = negative ? -value : value;

  let speech: string;
  if (lang === 'fr-FR') {
    // "une livre" — livre is feminine
    const majorWords =
      major === 1 && code === 'GBP' ? 'une' : intToWordsFr(major);
    speech = `${majorWords} ${major === 1 ? words.one : words.many}`;
    if (withCents) {
      speech += ` et ${intToWordsFr(cents)} ${cents === 1 ? words.centOne : words.centMany}`;
    }
    if (negative) speech = `moins ${speech}`;
  } else {
    speech = `${intToWordsEn(major, british)} ${major === 1 ? words.one : words.many}`;
    if (withCents) {
      speech += ` and ${intToWordsEn(cents, false)} ${cents === 1 ? words.centOne : words.centMany}`;
    }
    if (negative) speech = `minus ${speech}`;
  }

  return {
    displayValue: formatCurrency(signed, code, withCents ? c.decimalPlaces : 0, lang),
    speechText: speech,
  };
}

/**
 * Generate the next task, avoiding exact repeats of the last
 * HISTORY_SIZE display values within the current training session.
 */
export function generateItem(
  settings: AppSettings,
  lang: Language,
  history: string[],
): TrainingItem {
  const type: ContentType = settings.contentType;
  const recent = new Set(history.slice(-HISTORY_SIZE));

  let generated: Generated | null = null;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate =
      type === 'numbers'
        ? generateNumber(settings, lang)
        : type === 'dates'
          ? generateDate(settings, lang)
          : generateCurrency(settings, lang);
    generated = candidate;
    if (!recent.has(candidate.displayValue)) break;
  }

  return {
    id: nextId(),
    type,
    displayValue: generated!.displayValue,
    speechText: generated!.speechText,
    language: lang,
  };
}
