// حل متباينة f(x) op 0 بالأعداد الحرجة، ورسمها على خط الأعداد
import { Plot, css, fmt } from './plot';

export type Op = '<' | '<=' | '>' | '>=';
export const opTex: Record<Op, string> = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };

const test = (y: number, op: Op) =>
  op === '<' ? y < 0 : op === '<=' ? y <= 1e-12 : op === '>' ? y > 0 : y >= -1e-12;

export type Run = { a: number; b: number; ca: boolean; cb: boolean }; // a,b قد تكون ±Infinity

/** points: الأعداد الحرجة. f قد تعيد NaN حيث لا تكون معرّفة */
export function solve(f: (x: number) => number, points: number[], op: Op) {
  const cs = [...new Set(points.map((p) => +p.toFixed(9)))].sort((x, y) => x - y);
  type Region = { kind: 'int'; a: number; b: number; ok: boolean; sign: number } | { kind: 'pt'; c: number; ok: boolean };
  const regions: Region[] = [];
  const bounds = [-Infinity, ...cs, Infinity];
  for (let k = 0; k < bounds.length - 1; k++) {
    const a = bounds[k], b = bounds[k + 1];
    const mid = a === -Infinity ? b - 1 : b === Infinity ? a + 1 : (a + b) / 2;
    const y = f(cs.length ? mid : 0);
    regions.push({ kind: 'int', a, b, ok: Number.isFinite(y) && test(y, op), sign: Math.sign(y) });
    if (b !== Infinity) {
      const yc = f(b);
      regions.push({ kind: 'pt', c: b, ok: Number.isFinite(yc) && test(yc, op) });
    }
  }
  const runs: Run[] = [];
  let cur: Run | null = null;
  regions.forEach((r) => {
    if (r.ok) {
      if (!cur) cur = r.kind === 'int' ? { a: r.a, b: r.b, ca: false, cb: false } : { a: r.c, b: r.c, ca: true, cb: true };
      else if (r.kind === 'int') { cur.b = r.b; cur.cb = false; }
      else { cur.b = r.c; cur.cb = true; }
    } else if (cur) {
      runs.push(cur);
      cur = null;
    }
  });
  if (cur) runs.push(cur);
  return { cs, regions, runs };
}

export function runsTex(runs: Run[]): string {
  if (!runs.length) return '\\varnothing';
  return runs
    .map((r) => {
      if (r.a === r.b) return `\\{${fmt(r.a)}\\}`;
      const A = r.a === -Infinity ? '-\\infty' : fmt(r.a);
      const B = r.b === Infinity ? '\\infty' : fmt(r.b);
      return `${r.ca ? '[' : '('}${A}, ${B}${r.cb ? ']' : ')'}`;
    })
    .join(' \\cup ');
}

/** يرسم خط الأعداد مع الإشارات والحل */
export function drawLine(
  plot: Plot,
  sol: ReturnType<typeof solve>,
  opts: { undefinedAt?: number[]; showSigns?: boolean } = {},
) {
  const { ctx, view } = plot;
  const y0 = 0;
  plot.clear();
  // المحور
  ctx.strokeStyle = css('--muted');
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(plot.X(view.xmin), plot.Y(y0));
  ctx.lineTo(plot.X(view.xmax), plot.Y(y0));
  ctx.stroke();
  ctx.fillStyle = css('--muted');
  ctx.font = '11px "Noto Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  for (let x = Math.ceil(view.xmin); x <= view.xmax; x++) {
    ctx.beginPath();
    ctx.moveTo(plot.X(x), plot.Y(y0) - 4);
    ctx.lineTo(plot.X(x), plot.Y(y0) + 4);
    ctx.stroke();
    if (x % 2 === 0) ctx.fillText(String(x), plot.X(x), plot.Y(y0) + 8);
  }
  // الحل
  const acc = css('--accent');
  ctx.strokeStyle = acc;
  ctx.lineWidth = 7;
  ctx.lineCap = 'butt';
  sol.runs.forEach((r) => {
    const a = Math.max(r.a, view.xmin), b = Math.min(r.b, view.xmax);
    if (r.a !== r.b) {
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.moveTo(plot.X(a), plot.Y(y0));
      ctx.lineTo(plot.X(b), plot.Y(y0));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  });
  // الإشارات
  if (opts.showSigns) {
    ctx.font = '700 15px "Noto Sans", sans-serif';
    ctx.textBaseline = 'bottom';
    sol.regions.forEach((r) => {
      if (r.kind !== 'int') return;
      const a = Math.max(r.a, view.xmin), b = Math.min(r.b, view.xmax);
      ctx.fillStyle = r.sign > 0 ? css('--ok') : r.sign < 0 ? css('--err') : css('--muted');
      ctx.fillText(r.sign > 0 ? '+' : r.sign < 0 ? '−' : '0', plot.X((a + b) / 2), plot.Y(y0) - 14);
    });
  }
  // النقاط الحرجة
  const und = (opts.undefinedAt ?? []).map((u) => +u.toFixed(9));
  sol.cs.forEach((c) => {
    const inSol = sol.runs.some((r) => (c > r.a && c < r.b) || (c === r.a && r.ca) || (c === r.b && r.cb));
    plot.dot(c, y0, und.includes(c) ? css('--err') : acc, 6, !inSol);
    ctx.fillStyle = css('--ink');
    ctx.font = '600 12px "Noto Sans", sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(fmt(c), plot.X(c), plot.Y(y0) + 24);
  });
}
