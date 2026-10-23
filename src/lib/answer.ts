// مقيِّم صغير للتعابير العددية (يدعم الأعداد المركبة) لتصحيح الإجابات رياضيًا لا نصيًا.
// أمثلة مقبولة: 3   -2/5   1.5   2+3i   -i   sqrt(5)   2√3   (1-i)/2   3, -4

export type C = { re: number; im: number };
const c = (re: number, im = 0): C => ({ re, im });
const add = (a: C, b: C) => c(a.re + b.re, a.im + b.im);
const sub = (a: C, b: C) => c(a.re - b.re, a.im - b.im);
const mul = (a: C, b: C) => c(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a: C, b: C) => {
  const d = b.re * b.re + b.im * b.im;
  if (d === 0) throw new Error('قسمة على صفر');
  return c((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
};
function pow(a: C, b: C): C {
  if (b.im !== 0) throw new Error('أس غير مدعوم');
  const n = b.re;
  if (Number.isInteger(n)) {
    let r = c(1);
    const base = n < 0 ? div(c(1), a) : a;
    for (let k = 0; k < Math.abs(n); k++) r = mul(r, base);
    return r;
  }
  if (a.im === 0 && a.re >= 0) return c(Math.pow(a.re, n));
  throw new Error('أس غير مدعوم');
}
function sqrt(a: C): C {
  if (a.im === 0) return a.re >= 0 ? c(Math.sqrt(a.re)) : c(0, Math.sqrt(-a.re));
  const r = Math.hypot(a.re, a.im);
  return c(Math.sqrt((r + a.re) / 2), Math.sign(a.im) * Math.sqrt((r - a.re) / 2));
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
export function normalize(s: string) {
  return s
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .replace(/٫/g, '.')
    .replace(/[−–]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
    .toLowerCase();
}

type Tok = { t: 'num'; v: number } | { t: 'i' } | { t: 'op'; v: string } | { t: 'fn'; v: string };

function tokenize(s: string): Tok[] {
  const out: Tok[] = [];
  let k = 0;
  while (k < s.length) {
    const ch = s[k];
    if (/[0-9.]/.test(ch)) {
      let j = k;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const v = Number(s.slice(k, j));
      if (Number.isNaN(v)) throw new Error('رقم غير صالح');
      out.push({ t: 'num', v });
      k = j;
    } else if (s.startsWith('sqrt', k)) {
      out.push({ t: 'fn', v: 'sqrt' });
      k += 4;
    } else if (ch === '√') {
      out.push({ t: 'fn', v: 'sqrt' });
      k++;
    } else if (ch === 'i') {
      out.push({ t: 'i' });
      k++;
    } else if ('+-*/^()'.includes(ch)) {
      out.push({ t: 'op', v: ch });
      k++;
    } else throw new Error(`رمز غير مفهوم: ${ch}`);
  }
  // الضرب الضمني: 2i ، 3(…) ، 2√3 ، )( ...
  const res: Tok[] = [];
  for (let n = 0; n < out.length; n++) {
    const prev = res[res.length - 1];
    const cur = out[n];
    const prevEnds = prev && (prev.t === 'num' || prev.t === 'i' || (prev.t === 'op' && prev.v === ')'));
    const curStarts = cur.t === 'num' || cur.t === 'i' || cur.t === 'fn' || (cur.t === 'op' && cur.v === '(');
    if (prevEnds && curStarts) res.push({ t: 'op', v: '*' });
    res.push(cur);
  }
  return res;
}

export function evaluate(input: string): C {
  const toks = tokenize(normalize(input));
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === 'op' && (peek() as any).v === v;

  function expr(): C {
    let v = term();
    while (isOp('+') || isOp('-')) {
      const op = (toks[p++] as any).v;
      const r = term();
      v = op === '+' ? add(v, r) : sub(v, r);
    }
    return v;
  }
  function term(): C {
    let v = unary();
    while (isOp('*') || isOp('/')) {
      const op = (toks[p++] as any).v;
      const r = unary();
      v = op === '*' ? mul(v, r) : div(v, r);
    }
    return v;
  }
  function unary(): C {
    if (isOp('-')) { p++; return mul(c(-1), unary()); }
    if (isOp('+')) { p++; return unary(); }
    return power();
  }
  function power(): C {
    const b = atom();
    if (isOp('^')) { p++; return pow(b, unary()); }
    return b;
  }
  function atom(): C {
    const tk = toks[p++];
    if (!tk) throw new Error('تعبير ناقص');
    if (tk.t === 'num') return c(tk.v);
    if (tk.t === 'i') return c(0, 1);
    if (tk.t === 'fn') return sqrt(power());
    if (tk.t === 'op' && tk.v === '(') {
      const v = expr();
      if (!isOp(')')) throw new Error('قوس غير مغلق');
      p++;
      return v;
    }
    throw new Error('تعبير غير صالح');
  }
  const v = expr();
  if (p !== toks.length) throw new Error('تعبير غير صالح');
  return v;
}

const EMPTY = ['لايوجد', 'لاحل', 'none', 'nosolution', '∅', '{}', 'ø'];

/** يحلل قائمة إجابات مفصولة بفواصل. يعيد [] إن كتب المستخدم «لا يوجد حل». */
export function parseList(input: string): C[] {
  const n = normalize(input);
  if (EMPTY.includes(n)) return [];
  return n
    .split(/[,،;؛]/)
    .filter(Boolean)
    .map((part) => evaluate(part));
}

const close = (a: C, b: C) => {
  const tol = 1e-6 * Math.max(1, Math.hypot(b.re, b.im));
  return Math.abs(a.re - b.re) < tol && Math.abs(a.im - b.im) < tol;
};

/** مقارنة مجموعتين من الحلول بغض النظر عن الترتيب */
export function sameSet(given: C[], expected: C[]) {
  const uniq = (xs: C[]) => xs.filter((x, k) => xs.findIndex((y) => close(x, y)) === k);
  const g = uniq(given);
  const e = uniq(expected);
  return g.length === e.length && e.every((x) => g.some((y) => close(x, y)));
}
