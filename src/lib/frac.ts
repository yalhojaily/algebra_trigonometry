// كسور دقيقة صغيرة للعمليات على المصفوفات
export type Q = { n: number; d: number };
const g = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g(b, a % b));
export const q = (n: number, d = 1): Q => {
  if (d < 0) { n = -n; d = -d; }
  const k = g(n, d) || 1;
  return { n: n / k, d: d / k };
};
export const add = (a: Q, b: Q) => q(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Q, b: Q) => q(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Q, b: Q) => q(a.n * b.n, a.d * b.d);
export const div = (a: Q, b: Q) => q(a.n * b.d, a.d * b.n);
export const isZero = (a: Q) => a.n === 0;
export const val = (a: Q) => a.n / a.d;
export const qTex = (a: Q) => (a.d === 1 ? String(a.n) : `${a.n < 0 ? '-' : ''}\\tfrac{${Math.abs(a.n)}}{${a.d}}`);
/** مصفوفة بصيغة TeX، مع خط فاصل قبل العمود الأخير إن كانت موسّعة */
export function matTex(m: (Q | number)[][], augmented = false): string {
  const cols = m[0].length;
  const spec = augmented ? `${'c'.repeat(cols - 1)}|c` : 'c'.repeat(cols);
  const body = m.map((r) => r.map((x) => (typeof x === 'number' ? String(x) : qTex(x))).join(' & ')).join(' \\\\ ');
  return `\\left[\\begin{array}{${spec}}${body}\\end{array}\\right]`;
}
