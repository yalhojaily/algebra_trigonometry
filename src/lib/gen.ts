// أدوات مشتركة لتوليد التمارين
import type { C } from './answer';

export const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
export const nz = (a: number, b: number) => {
  let v = 0;
  while (v === 0) v = rnd(a, b);
  return v;
};
export const pick = <T>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];
export const shuffle = <T>(xs: T[]): T[] => {
  const a = [...xs];
  for (let k = a.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [a[k], a[j]] = [a[j], a[k]];
  }
  return a;
};
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);
export const R = (re: number): C => ({ re, im: 0 });
export const Z = (re: number, im: number): C => ({ re, im });

/** كسر مختزل بصيغة TeX */
export function frac(p: number, q: number): string {
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1;
  p /= g; q /= g;
  if (q === 1) return String(p);
  return `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
}

/** حد بمعامل: coef(3,'x') = 3x ، coef(-1,'x') = -x ، coef(1,'x',true) = +x */
export function term(k: number, v: string, lead = false): string {
  if (k === 0) return '';
  const sign = k < 0 ? '-' : lead ? '' : '+';
  const abs = Math.abs(k);
  const num = abs === 1 && v ? '' : String(abs);
  return `${sign} ${num}${v}`.replace(/^\+ /, '+ ').trim();
}

/** يبني كثير حدود من معاملات [a_n,...,a_0] بالمتغير x */
export function poly(coefs: number[], v = 'x'): string {
  const n = coefs.length - 1;
  const parts: string[] = [];
  coefs.forEach((k, idx) => {
    if (k === 0) return;
    const p = n - idx;
    const vv = p === 0 ? '' : p === 1 ? v : `${v}^{${p}}`;
    const sign = k < 0 ? '-' : parts.length ? '+' : '';
    const abs = Math.abs(k);
    const num = abs === 1 && vv ? '' : String(abs);
    parts.push(`${sign}${parts.length ? ' ' : ''}${num}${vv}`);
  });
  return parts.length ? parts.join(' ').replace(/^\+ /, '') : '0';
}

/** (x - r) بإشارة صحيحة */
export const factor = (r: number, v = 'x') => (r === 0 ? v : r > 0 ? `(${v} - ${r})` : `(${v} + ${-r})`);

/** عدد مركب بصيغة TeX */
export function cx(re: number, im: number): string {
  if (im === 0) return String(re);
  const imPart = Math.abs(im) === 1 ? 'i' : `${Math.abs(im)}i`;
  if (re === 0) return `${im < 0 ? '-' : ''}${imPart}`;
  return `${re} ${im < 0 ? '-' : '+'} ${imPart}`;
}

export type Problem =
  | {
      kind: 'values';
      prompt: string;
      answer: C[];
      /** الترتيب مهم (إحداثيات نقطة أو مجموعة قيم بترتيب محدد) */
      ordered?: boolean;
      /** تسامح مطلق للإجابات المقرّبة (مثل 0.005 لمنزلتين عشريتين) */
      tol?: number;
      hint: string;
      solution: string[];
      placeholder?: string;
    }
  | {
      kind: 'expr';
      prompt: string;
      /** الإجابة المتوقعة بصيغة المحلل، مثل "x^2-4x+4" */
      answer: string;
      vars: string[];
      /** قيم موجبة فقط للمتغيرات (عند وجود جذور زوجية أو أسس كسرية) */
      positive?: boolean;
      /** شروط على شكل الإجابة */
      require?: ('factored' | 'noRadicalDenominator' | 'noNegativeExponent' | 'expanded' | 'monomial' | 'logsExpanded' | 'logsCondensed')[];
      hint: string;
      solution: string[];
      placeholder?: string;
    }
  | {
      kind: 'choice';
      prompt: string;
      choices: string[];
      correct: number;
      hint: string;
      solution: string[];
    };

/** سؤال اختيار من متعدد: يخلط الخيارات ويحفظ موضع الصحيح */
export function choice(prompt: string, right: string, wrong: string[], hint: string, solution: string[]): Problem {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  const all = shuffle([right, ...uniq]);
  return { kind: 'choice', prompt, choices: all, correct: all.indexOf(right), hint, solution };
}

/** كثير حدود بصيغة يقرؤها المحلل (بدون أقواس TeX) */
export const polyP = (coefs: number[], v = 'x') => poly(coefs, v).replace(/\{(-?\d+)\}/g, '$1').replace(/\s+/g, '');

/** ضرب كثيري حدود (معاملات من الأعلى إلى الأدنى) */
export function pmul(a: number[], b: number[]): number[] {
  const r = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => (r[i + j] += x * y)));
  return r;
}

/** تبسيط √n إلى k√m بصيغة TeX */
export function simpRoot(n: number): string {
  if (n === 0) return '0';
  let k = 1, m = n;
  for (let p = 2; p * p <= m; p++) while (m % (p * p) === 0) { m /= p * p; k *= p; }
  if (m === 1) return String(k);
  return `${k === 1 ? '' : k}\\sqrt{${m}}`;
}
/** الصيغة نفسها بلغة المحلل */
export function simpRootP(n: number): string {
  const t = simpRoot(n);
  return t.replace(/\\sqrt\{(\d+)\}/, 'sqrt($1)');
}
