const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
  'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize',
];
const TENS: Record<number, string> = {
  10: 'dix', 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante', 60: 'soixante',
};

function below100(n: number, plural = true): string {
  if (n < 17) return UNITS[n];
  if (n < 20) return `dix-${UNITS[n - 10]}`;
  if (n < 70) {
    const t = Math.floor(n / 10) * 10;
    const r = n % 10;
    if (r === 0) return TENS[t];
    if (r === 1) return `${TENS[t]} et un`;
    return `${TENS[t]}-${UNITS[r]}`;
  }
  if (n < 80) {
    if (n === 71) return 'soixante et onze';
    return `soixante-${below100(n - 60)}`;
  }
  // 80..99
  if (n === 80) return plural ? 'quatre-vingts' : 'quatre-vingt';
  return `quatre-vingt-${below100(n - 80)}`;
}

function below1000(n: number, plural = true): string {
  if (n < 100) return below100(n, plural);
  const h = Math.floor(n / 100);
  const r = n % 100;
  let head = h === 1 ? 'cent' : `${UNITS[h]} cent`;
  if (r === 0) {
    if (h > 1 && plural) head += 's';
    return head;
  }
  return `${head} ${below100(r)}`;
}

/** Integer (non-negative) to French words. */
export function intToWordsFr(n: number): string {
  if (n === 0) return 'zéro';
  let x = Math.abs(Math.round(n));
  const parts: string[] = [];

  const millions = Math.floor(x / 1_000_000);
  if (millions > 0) {
    parts.push(millions === 1 ? 'un million' : `${below1000(millions)} millions`);
    x %= 1_000_000;
  }
  const thousands = Math.floor(x / 1000);
  if (thousands > 0) {
    // "vingt" and "cent" lose the plural "s" before "mille"
    parts.push(thousands === 1 ? 'mille' : `${below1000(thousands, false)} mille`);
    x %= 1000;
  }
  if (x > 0) parts.push(below1000(x));
  return parts.join(' ');
}

/**
 * Fraction part after "virgule": read as a number, leading zeros
 * spelled out ("07" -> "zéro sept").
 */
export function fractionToWordsFr(fraction: string): string {
  const words: string[] = [];
  let i = 0;
  while (i < fraction.length - 1 && fraction[i] === '0') {
    words.push('zéro');
    i++;
  }
  words.push(intToWordsFr(Number(fraction.slice(i))));
  return words.join(' ');
}

/** Full number (may be negative / decimal) to spoken French. */
export function numberToSpeechFr(value: number, fractionDigits: string | null): string {
  const abs = Math.abs(value);
  const intPart = Math.trunc(abs);
  let words = intToWordsFr(intPart);
  if (fractionDigits) {
    words += ` virgule ${fractionToWordsFr(fractionDigits)}`;
  }
  return value < 0 ? `moins ${words}` : words;
}
