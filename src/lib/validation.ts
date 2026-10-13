import type { AppSettings } from '../types';
import type { ErrorKey } from './i18n';

export type ValidationErrors = Partial<Record<
  | 'numberRange'
  | 'numberTypes'
  | 'numberRangeNarrow'
  | 'yearRange'
  | 'currencyList'
  | 'currencyRange',
  ErrorKey
>>;

export function validateSettings(s: AppSettings): ValidationErrors {
  const errors: ValidationErrors = {};

  if (s.contentType === 'numbers') {
    const n = s.numbers;
    if (!Number.isFinite(n.min) || !Number.isFinite(n.max)) {
      errors.numberRange = 'numberRangeMissing';
    } else if (n.min < 0) {
      errors.numberRange = 'numberRangeNegative';
    } else if (n.min > n.max) {
      errors.numberRange = 'numberRangeInverted';
    }
    if (!n.includeIntegers && !n.includeDecimals) {
      errors.numberTypes = 'numberTypes';
    }
    if (
      !errors.numberRange &&
      n.includeIntegers && !n.includeDecimals && !n.includeNegative &&
      n.max - n.min < 2
    ) {
      errors.numberRangeNarrow = 'numberRangeNarrow';
    }
  }

  if (s.contentType === 'dates') {
    const d = s.dates;
    if (!Number.isFinite(d.startYear) || !Number.isFinite(d.endYear)) {
      errors.yearRange = 'yearRangeMissing';
    } else if (d.startYear > d.endYear) {
      errors.yearRange = 'yearRangeInverted';
    } else if (d.startYear < 1900 || d.endYear > 2100) {
      errors.yearRange = 'yearRangeBounds';
    }
  }

  if (s.contentType === 'currency') {
    const c = s.currency;
    if (c.currencies.length === 0) {
      errors.currencyList = 'currencyList';
    }
    if (!Number.isFinite(c.min) || !Number.isFinite(c.max)) {
      errors.currencyRange = 'currencyRangeMissing';
    } else if (c.min < 0) {
      errors.currencyRange = 'currencyRangeNegative';
    } else if (c.min > c.max) {
      errors.currencyRange = 'currencyRangeInverted';
    } else if (!c.includeDecimals && c.max - c.min < 2) {
      errors.currencyRange = 'currencyRangeNarrow';
    }
  }

  return errors;
}
