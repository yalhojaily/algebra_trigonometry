// محلل صغير للتعابير الرياضية (أعداد مركبة ومتغيرات) لتصحيح الإجابات رياضيًا لا نصيًا.
// أمثلة مقبولة: 3   -2/5   2+3i   sqrt(5)   2√3   x^2-4x+4   (x+1)(x-2)   3x^(1/2)

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
  if (Number.isInteger(n) && Math.abs(n) <= 64) {
    let r = c(1);
    const base = n < 0 ? div(c(1), a) : a;
    for (let k = 0; k < Math.abs(n); k++) r = mul(r, base);
    return r;
  }
  if (a.im === 0 && a.re >= 0) return c(Math.pow(a.re, n));
  // جذر فردي لعدد سالب: (-8)^(1/3) = -2
  if (a.im === 0 && a.re < 0) {
    for (const q of [3, 5, 7, 9]) {
      const p = n * q;
      if (Math.abs(p - Math.round(p)) < 1e-9) {
        const root = -Math.pow(-a.re, 1 / q);
        return pow(c(root), c(Math.round(p)));
      }
    }
  }
  throw new Error('أس غير مدعوم');
}
function sqrt(a: C): C {
  if (a.im === 0) return a.re >= 0 ? c(Math.sqrt(a.re)) : c(0, Math.sqrt(-a.re));
  const r = Math.hypot(a.re, a.im);
  return c(Math.sqrt((r + a.re) / 2), Math.sign(a.im) * Math.sqrt((r - a.re) / 2));
}

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const SUP: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
export function normalize(s: string) {
  return s
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((ch) => SUP[ch]).join(''))
    .replace(/٫/g, '.')
    .replace(/[−–]/g, '-')
    .replace(/[×·]/g, '*')
    .replace(/÷/g, '/')
    .replace(/\s+/g, '')
    .toLowerCase();
}

// ===== شجرة التعبير =====
export type Node =
  | { t: 'num'; v: number }
  | { t: 'i' }
  | { t: 'var'; v: string }
  | { t: 'neg'; a: Node }
  | { t: 'add' | 'sub' | 'mul' | 'div' | 'pow'; a: Node; b: Node }
  | { t: 'sqrt'; a: Node };

type Tok = { t: 'num'; v: number } | { t: 'i' } | { t: 'var'; v: string } | { t: 'op'; v: string } | { t: 'fn' };

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
      out.push({ t: 'fn' });
      k += 4;
    } else if (ch === '√') {
      out.push({ t: 'fn' });
      k++;
    } else if (ch === 'i') {
      out.push({ t: 'i' });
      k++;
    } else if (/[a-z]/.test(ch)) {
      out.push({ t: 'var', v: ch });
      k++;
    } else if ('+-*/^()'.includes(ch)) {
      out.push({ t: 'op', v: ch });
      k++;
    } else throw new Error(`رمز غير مفهوم: ${ch}`);
  }
  const res: Tok[] = [];
  for (const cur of out) {
    const prev = res[res.length - 1];
    const prevEnds = prev && (prev.t === 'num' || prev.t === 'i' || prev.t === 'var' || (prev.t === 'op' && prev.v === ')'));
    const curStarts = cur.t === 'num' || cur.t === 'i' || cur.t === 'var' || cur.t === 'fn' || (cur.t === 'op' && cur.v === '(');
    if (prevEnds && curStarts) res.push({ t: 'op', v: '*' });
    res.push(cur);
  }
  return res;
}

export function parse(input: string): Node {
  const toks = tokenize(normalize(input));
  if (!toks.length) throw new Error('الإجابة فارغة');
  let p = 0;
  const isOp = (v: string) => toks[p]?.t === 'op' && (toks[p] as any).v === v;
  function expr(): Node {
    let n = term();
    while (isOp('+') || isOp('-')) {
      const op = (toks[p++] as any).v;
      n = { t: op === '+' ? 'add' : 'sub', a: n, b: term() };
    }
    return n;
  }
  function term(): Node {
    let n = unary();
    while (isOp('*') || isOp('/')) {
      const op = (toks[p++] as any).v;
      n = { t: op === '*' ? 'mul' : 'div', a: n, b: unary() };
    }
    return n;
  }
  function unary(): Node {
    if (isOp('-')) { p++; return { t: 'neg', a: unary() }; }
    if (isOp('+')) { p++; return unary(); }
    return power();
  }
  function power(): Node {
    const b = atom();
    if (isOp('^')) { p++; return { t: 'pow', a: b, b: unary() }; }
    return b;
  }
  function atom(): Node {
    const tk = toks[p++];
    if (!tk) throw new Error('تعبير ناقص');
    if (tk.t === 'num') return { t: 'num', v: tk.v };
    if (tk.t === 'i') return { t: 'i' };
    if (tk.t === 'var') return { t: 'var', v: tk.v };
    if (tk.t === 'fn') return { t: 'sqrt', a: power() };
    if (tk.t === 'op' && tk.v === '(') {
      const v = expr();
      if (!isOp(')')) throw new Error('قوس غير مغلق');
      p++;
      return v;
    }
    throw new Error('تعبير غير صالح');
  }
  const n = expr();
  if (p !== toks.length) throw new Error('تعبير غير صالح');
  return n;
}

export function evalNode(n: Node, vars: Record<string, number> = {}): C {
  switch (n.t) {
    case 'num': return c(n.v);
    case 'i': return c(0, 1);
    case 'var':
      if (!(n.v in vars)) throw new Error(`المتغير ${n.v} غير متوقع هنا`);
      return c(vars[n.v]);
    case 'neg': return mul(c(-1), evalNode(n.a, vars));
    case 'sqrt': return sqrt(evalNode(n.a, vars));
    case 'add': return add(evalNode(n.a, vars), evalNode(n.b, vars));
    case 'sub': return sub(evalNode(n.a, vars), evalNode(n.b, vars));
    case 'mul': return mul(evalNode(n.a, vars), evalNode(n.b, vars));
    case 'div': return div(evalNode(n.a, vars), evalNode(n.b, vars));
    case 'pow': return pow(evalNode(n.a, vars), evalNode(n.b, vars));
  }
}

export const evaluate = (input: string): C => evalNode(parse(input));

// ===== تحويل الشجرة إلى TeX للمعاينة =====
const prec = (n: Node) => (n.t === 'add' || n.t === 'sub' ? 1 : n.t === 'mul' || n.t === 'div' ? 2 : n.t === 'neg' ? 2 : n.t === 'pow' ? 4 : 5);
const wrap = (s: string) => `\\left(${s}\\right)`;
export function toTex(n: Node): string {
  switch (n.t) {
    case 'num': return String(n.v);
    case 'i': return 'i';
    case 'var': return n.v;
    case 'neg': return '-' + (prec(n.a) <= 2 ? wrap(toTex(n.a)) : toTex(n.a));
    case 'sqrt': return `\\sqrt{${toTex(n.a)}}`;
    case 'add': return `${toTex(n.a)} + ${toTex(n.b)}`;
    case 'sub': return `${toTex(n.a)} - ${prec(n.b) <= 1 || n.b.t === 'neg' ? wrap(toTex(n.b)) : toTex(n.b)}`;
    case 'div': return `\\frac{${toTex(n.a)}}{${toTex(n.b)}}`;
    case 'pow': {
      const base = prec(n.a) < 5 || n.a.t === 'sqrt' ? wrap(toTex(n.a)) : toTex(n.a);
      return `${base}^{${toTex(n.b)}}`;
    }
    case 'mul': {
      const L = prec(n.a) < 2 ? wrap(toTex(n.a)) : toTex(n.a);
      const R = prec(n.b) < 2 || n.b.t === 'neg' ? wrap(toTex(n.b)) : toTex(n.b);
      const juxt = n.b.t !== 'num' && !(n.b.t === 'pow' && n.b.a.t === 'num') && !R.startsWith('-');
      return juxt ? `${L}${R}` : `${L} \\cdot ${R}`;
    }
  }
}

// ===== فحوص البنية =====
function flatMul(n: Node): Node[] {
  return n.t === 'mul' ? [...flatMul(n.a), ...flatMul(n.b)] : [n];
}
const isSum = (n: Node): boolean => n.t === 'add' || n.t === 'sub' || (n.t === 'neg' && isSum(n.a));
/** هل الإجابة مكتوبة كحاصل ضرب يتضمن عاملًا غير أحادي الحد؟ */
export function isFactored(n: Node): boolean {
  if (n.t === 'neg') return isFactored(n.a);
  if (n.t === 'pow') return isSum(n.a) && n.b.t === 'num' && n.b.v >= 2;
  if (n.t !== 'mul') return false;
  return flatMul(n).some((f) => isSum(f) || (f.t === 'pow' && isSum(f.a)));
}
function hasRadical(n: Node): boolean {
  if (n.t === 'sqrt') return true;
  if (n.t === 'pow' && n.b.t !== 'num') return true;
  if (n.t === 'pow' && n.b.t === 'num' && !Number.isInteger(n.b.v)) return true;
  if ('a' in n && hasRadical(n.a)) return true;
  if ('b' in n && hasRadical((n as any).b)) return true;
  return false;
}
export function hasRadicalDenominator(n: Node): boolean {
  if (n.t === 'div' && hasRadical(n.b)) return true;
  if ('a' in n && hasRadicalDenominator(n.a)) return true;
  if ('b' in n && hasRadicalDenominator((n as any).b)) return true;
  return false;
}
/** هل يوجد أس سالب؟ */
export function hasNegativeExponent(n: Node): boolean {
  if (n.t === 'pow' && (n.b.t === 'neg' || (n.b.t === 'num' && n.b.v < 0))) return true;
  if ('a' in n && hasNegativeExponent(n.a)) return true;
  if ('b' in n && hasNegativeExponent((n as any).b)) return true;
  return false;
}

const hasVar = (n: Node): boolean => n.t === 'var' || ('a' in n && hasVar(n.a)) || ('b' in n && hasVar((n as any).b));
/** مفكوك: لا ضرب في مجموع، ولا قوة لمجموع، ولا قسمة على مقدار فيه متغير */
export function isExpanded(n: Node): boolean {
  if (n.t === 'mul' && flatMul(n).some(isSum)) return false;
  if (n.t === 'pow' && isSum(n.a)) return false;
  if (n.t === 'div' && hasVar(n.b)) return false;
  if ('a' in n && !isExpanded(n.a)) return false;
  if ('b' in n && !isExpanded((n as any).b)) return false;
  return true;
}
/** حد واحد مبسّط: معامل عددي واحد على الأكثر، وكل متغير يظهر مرة واحدة */
export function isMonomial(n: Node): boolean {
  if (n.t === 'neg') return isMonomial(n.a);
  const fs = n.t === 'mul' ? flatMul(n) : [n];
  let nums = 0;
  const seen = new Set<string>();
  for (const f of fs) {
    if (!hasVar(f)) { nums++; continue; }
    const v = f.t === 'var' ? f.v : f.t === 'pow' && f.a.t === 'var' && !hasVar(f.b) ? f.a.v : null;
    if (!v || seen.has(v)) return false;
    seen.add(v);
  }
  return nums <= 1;
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

/** تكافؤ تعبيرين جبريين بالتعويض في نقاط عشوائية */
export function equivalent(given: Node, expected: Node, vars: string[], positive = false): boolean {
  let ok = 0;
  for (let k = 0; k < 40 && ok < 6; k++) {
    const env: Record<string, number> = {};
    vars.forEach((v, j) => {
      const r = 0.3 + ((k * 7 + j * 3) % 11) * 0.47 + Math.random() * 0.2;
      env[v] = positive ? r : k % 2 ? -r : r;
    });
    let e: C, g: C;
    try { e = evalNode(expected, env); } catch { continue; }
    if (!Number.isFinite(e.re) || Math.hypot(e.re, e.im) > 1e9) continue;
    try { g = evalNode(given, env); } catch { return false; }
    if (!close(g, e)) return false;
    ok++;
  }
  return ok >= 3;
}
