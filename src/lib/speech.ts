import type { Language } from '../types';

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];
const listeners = new Set<() => void>();

function refreshVoices() {
  cachedVoices = window.speechSynthesis.getVoices();
  listeners.forEach((fn) => fn());
}

if (speechSupported()) {
  refreshVoices();
  window.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
}

/** Subscribe to voice list updates (voices often load asynchronously). */
export function onVoicesChanged(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getVoices(): SpeechSynthesisVoice[] {
  return cachedVoices;
}

/**
 * Pick the best voice for a language: exact locale match first,
 * then any voice of the same base language.
 */
export function findVoice(lang: Language): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const voices = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  const target = lang.toLowerCase();
  const base = target.slice(0, 2);

  const exact = voices.filter((v) => norm(v.lang) === target);
  if (exact.length) return exact.find((v) => v.default) ?? exact[0];

  const sameBase = voices.filter((v) => norm(v.lang).startsWith(base));
  if (sameBase.length) return sameBase.find((v) => v.default) ?? sameBase[0];

  return null;
}

/** Stop any current or queued speech. */
export function cancelSpeech(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}

/**
 * Speak text with the given language and rate. Resolves when playback
 * finishes or is cancelled; rejects only on a real synthesis error.
 */
export function speak(text: string, lang: Language, rate: number): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!speechSupported()) {
      reject(new Error('speech-not-supported'));
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = findVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = lang;
    utterance.rate = rate;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') {
        resolve();
      } else {
        reject(new Error(e.error));
      }
    };
    synth.speak(utterance);
  });
}
