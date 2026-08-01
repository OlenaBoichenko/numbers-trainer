import type { CurrencyCode, Language } from '../types';

export const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** Display string for a number: "2,540.36" (en) / "2 540,36" (fr). */
export function formatNumber(value: number, fractionDigits: number, language: Language): string {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Display string for a money amount: "$1,450.75" (en) / "1 450,75 $US" (fr). */
export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  fractionDigits: number,
  language: Language,
): string {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** Display string for a date in the required format. */
export function formatDate(day: number, month: number, year: number, language: Language): string {
  if (language === 'fr-FR') {
    const d = day === 1 ? '1er' : String(day);
    return `${d} ${MONTHS_FR[month]} ${year}`;
  }
  if (language === 'en-GB') {
    return `${day} ${MONTHS_EN[month]} ${year}`;
  }
  return `${MONTHS_EN[month]} ${day}, ${year}`;
}
