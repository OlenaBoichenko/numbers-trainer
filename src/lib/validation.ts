import type { AppSettings } from '../types';

export type ValidationErrors = Partial<Record<
  | 'numberRange'
  | 'numberTypes'
  | 'numberRangeNarrow'
  | 'yearRange'
  | 'currencyList'
  | 'currencyRange',
  string
>>;

export function validateSettings(s: AppSettings): ValidationErrors {
  const errors: ValidationErrors = {};

  if (s.contentType === 'numbers') {
    const n = s.numbers;
    if (!Number.isFinite(n.min) || !Number.isFinite(n.max)) {
      errors.numberRange = 'Укажите минимальное и максимальное значение.';
    } else if (n.min < 0) {
      errors.numberRange = 'Минимальное значение не может быть меньше нуля — используйте переключатель отрицательных чисел.';
    } else if (n.min > n.max) {
      errors.numberRange = 'Минимальное значение больше максимального.';
    }
    if (!n.includeIntegers && !n.includeDecimals) {
      errors.numberTypes = 'Выберите хотя бы один тип чисел: целые или десятичные.';
    }
    if (
      !errors.numberRange &&
      n.includeIntegers && !n.includeDecimals && !n.includeNegative &&
      n.max - n.min < 2
    ) {
      errors.numberRangeNarrow = 'Диапазон слишком узкий для генерации разных значений — расширьте его.';
    }
  }

  if (s.contentType === 'dates') {
    const d = s.dates;
    if (!Number.isFinite(d.startYear) || !Number.isFinite(d.endYear)) {
      errors.yearRange = 'Укажите начальный и конечный год.';
    } else if (d.startYear > d.endYear) {
      errors.yearRange = 'Начальный год больше конечного.';
    } else if (d.startYear < 1900 || d.endYear > 2100) {
      errors.yearRange = 'Поддерживаются годы в диапазоне от 1900 до 2100.';
    }
  }

  if (s.contentType === 'currency') {
    const c = s.currency;
    if (c.currencies.length === 0) {
      errors.currencyList = 'Выберите хотя бы одну валюту.';
    }
    if (!Number.isFinite(c.min) || !Number.isFinite(c.max)) {
      errors.currencyRange = 'Укажите минимальную и максимальную сумму.';
    } else if (c.min < 0) {
      errors.currencyRange = 'Минимальная сумма не может быть меньше нуля — используйте переключатель отрицательных сумм.';
    } else if (c.min > c.max) {
      errors.currencyRange = 'Минимальная сумма больше максимальной.';
    } else if (!c.includeDecimals && c.max - c.min < 2) {
      errors.currencyRange = 'Диапазон сумм слишком узкий для генерации разных значений.';
    }
  }

  return errors;
}
