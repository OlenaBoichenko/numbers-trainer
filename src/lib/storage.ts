import type { AppSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const KEY = 'numbers-trainer-settings-v1';

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    // Merge with defaults so new fields get sane values after updates
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      numbers: { ...DEFAULT_SETTINGS.numbers, ...parsed.numbers },
      dates: { ...DEFAULT_SETTINGS.dates, ...parsed.dates },
      currency: { ...DEFAULT_SETTINGS.currency, ...parsed.currency },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // Storage unavailable (private mode etc.) — settings just won't persist
  }
}
