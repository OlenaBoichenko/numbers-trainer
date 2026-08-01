const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', ' thousand', ' million', ' billion', ' trillion'];

function below100(n: number): string {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r === 0 ? TENS[t] : `${TENS[t]}-${ONES[r]}`;
}

function below1000(n: number, british: boolean): string {
  if (n < 100) return below100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const head = `${ONES[h]} hundred`;
  if (r === 0) return head;
  return british ? `${head} and ${below100(r)}` : `${head} ${below100(r)}`;
}

/** Integer (non-negative) to English words. british=true inserts "and". */
export function intToWordsEn(n: number, british: boolean): string {
  if (n === 0) return 'zero';
  const groups: number[] = [];
  let x = Math.abs(Math.round(n));
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (groups[i] === 0) continue;
    parts.push(below1000(groups[i], british) + SCALES[i]);
  }
  let out = parts.join(' ');
  // British: "one thousand and five" when the last group is 1..99
  if (british && groups.length > 1 && groups[0] > 0 && groups[0] < 100) {
    const last = parts[parts.length - 1];
    out = parts.slice(0, -1).join(' ') + ' and ' + last;
  }
  return out;
}

/** Decimal digits spoken separately: "72" -> "seven two". */
export function fractionDigitsEn(fraction: string): string {
  return fraction.split('').map((d) => ONES[Number(d)]).join(' ');
}

/** Full number (may be negative / decimal) to spoken English. */
export function numberToSpeechEn(value: number, fractionDigits: string | null, british: boolean): string {
  const abs = Math.abs(value);
  const intPart = Math.trunc(abs);
  let words = intToWordsEn(intPart, british);
  if (fractionDigits) {
    words += ` point ${fractionDigitsEn(fractionDigits)}`;
  }
  return value < 0 ? `minus ${words}` : words;
}

const ORD_ONES: Record<number, string> = {
  1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth',
  7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 11: 'eleventh',
  12: 'twelfth', 13: 'thirteenth', 14: 'fourteenth', 15: 'fifteenth',
  16: 'sixteenth', 17: 'seventeenth', 18: 'eighteenth', 19: 'nineteenth',
  20: 'twentieth', 30: 'thirtieth',
};

/** Ordinal word for a day of month (1..31). */
export function ordinalEn(n: number): string {
  if (ORD_ONES[n]) return ORD_ONES[n];
  const t = Math.floor(n / 10) * 10;
  const r = n % 10;
  return `${TENS[t / 10]}-${ORD_ONES[r]}`;
}

/** Year to spoken English: 1997 -> "nineteen ninety-seven", 2007 -> "two thousand seven". */
export function yearToWordsEn(year: number, british: boolean): string {
  if (year >= 2000 && year <= 2009) {
    if (year === 2000) return 'two thousand';
    return british ? `two thousand and ${ONES[year - 2000]}` : `two thousand ${ONES[year - 2000]}`;
  }
  const hi = Math.floor(year / 100);
  const lo = year % 100;
  if (lo === 0) return `${below100(hi)} hundred`;
  if (lo < 10) return `${below100(hi)} oh ${ONES[lo]}`;
  return `${below100(hi)} ${below100(lo)}`;
}
